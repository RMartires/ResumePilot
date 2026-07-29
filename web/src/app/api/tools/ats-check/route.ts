import { NextResponse } from "next/server";
import { extractPdfText, PdfExtractError } from "@/lib/pdf/extract-text";
import {
  assertUsageAvailable,
  recordUsage,
  usageLimitResponse,
  UsageLimitError,
} from "@/lib/billing/usage";
import {
  assertUploadedPdf,
  assertPdfMagicBytes,
  MAX_PDF_BYTES,
} from "@/lib/pdf/validation";
import { scoreResumeAgainstJd } from "@/lib/seo/ats-score";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export const MAX_TEXT_CHARS = 80_000;
export const MAX_JSON_BODY_BYTES = 200 * 1024;
export const MAX_MULTIPART_BODY_BYTES = MAX_PDF_BYTES + 512 * 1024;

class RequestInputError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 413 | 415,
  ) {
    super(message);
    this.name = "RequestInputError";
  }
}

function assertContentLengthWithinLimit(request: Request, limit: number) {
  const value = request.headers.get("content-length");
  if (value === null) return;
  if (!/^\d+$/.test(value)) {
    throw new RequestInputError("Invalid Content-Length header.", 400);
  }
  if (Number(value) > limit) {
    throw new RequestInputError("Request body is too large.", 413);
  }
}

async function readBodyWithinLimit(request: Request, limit: number): Promise<ArrayBuffer> {
  assertContentLengthWithinLimit(request, limit);
  if (!request.body) return new ArrayBuffer(0);

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > limit) {
        await reader.cancel();
        throw new RequestInputError("Request body is too large.", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body.buffer;
}

function assertTextField(value: unknown, field: string): string {
  if (value === undefined) return "";
  if (typeof value !== "string") {
    throw new RequestInputError(`${field} must be text.`, 400);
  }
  if (value.length > MAX_TEXT_CHARS) {
    throw new RequestInputError(
      `${field} must be ${MAX_TEXT_CHARS.toLocaleString("en-US")} characters or fewer.`,
      413,
    );
  }
  return value;
}

function parseJsonFields(body: unknown): {
  resumeText: string;
  jdText: string;
  tool?: string;
} {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new RequestInputError("JSON body must be an object.", 400);
  }

  const record = body as Record<string, unknown>;
  const unknownField = Object.keys(record).find(
    (key) => key !== "resumeText" && key !== "jdText" && key !== "tool",
  );
  if (unknownField) {
    throw new RequestInputError(`Unknown field: ${unknownField}.`, 400);
  }

  const tool =
    record.tool === undefined
      ? undefined
      : assertTextField(record.tool, "tool");

  return {
    resumeText: assertTextField(record.resumeText, "resumeText"),
    jdText: assertTextField(record.jdText, "jdText"),
    tool,
  };
}

function resolveUsageEvent(tool: string | null | undefined) {
  if (tool === "resume-score") {
    return "resume_score" as const;
  }
  if (tool === "ats-checker") {
    return "ats_check" as const;
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    const mediaType = contentType.split(";", 1)[0]?.trim().toLowerCase();
    let resumeText = "";
    let jdText = "";
    let tool: string | undefined;

    if (mediaType === "multipart/form-data") {
      const body = await readBodyWithinLimit(request, MAX_MULTIPART_BODY_BYTES);
      const boundedRequest = new Request(request.url, {
        method: "POST",
        headers: request.headers,
        body,
      });
      let form: FormData;
      try {
        form = await boundedRequest.formData();
      } catch {
        if (body.byteLength > MAX_PDF_BYTES) {
          throw new RequestInputError("PDF must be 10 MB or smaller.", 413);
        }
        throw new RequestInputError("Invalid multipart form data.", 400);
      }

      const allowedFields = new Set(["resumeText", "jdText", "file", "tool"]);
      const unknownField = Array.from(form.keys()).find((key) => !allowedFields.has(key));
      if (unknownField) {
        throw new RequestInputError(`Unknown field: ${unknownField}.`, 400);
      }

      const resumeFields = form.getAll("resumeText");
      const jdFields = form.getAll("jdText");
      const toolFields = form.getAll("tool");
      const files = form.getAll("file");
      if (
        resumeFields.length > 1 ||
        jdFields.length > 1 ||
        toolFields.length > 1 ||
        files.length > 1
      ) {
        throw new RequestInputError("Submit each field at most once.", 400);
      }

      resumeText = assertTextField(resumeFields[0], "resumeText");
      jdText = assertTextField(jdFields[0], "jdText");
      tool = toolFields[0] ? assertTextField(toolFields[0], "tool") : undefined;

      const file = files[0];
      if (typeof file === "string") {
        throw new RequestInputError("file must be a PDF upload.", 400);
      }
      if (file !== undefined) {
        if (file.size > MAX_PDF_BYTES) {
          throw new RequestInputError("PDF must be 10 MB or smaller.", 413);
        }
        assertUploadedPdf(file);
        const buffer = await file.arrayBuffer();
        assertPdfMagicBytes(buffer);
        resumeText = await extractPdfText(buffer);
        if (resumeText.length > MAX_TEXT_CHARS) {
          throw new RequestInputError(
            `Extracted resume text must be ${MAX_TEXT_CHARS.toLocaleString("en-US")} characters or fewer.`,
            413,
          );
        }
      }
    } else if (mediaType === "application/json") {
      const body = await readBodyWithinLimit(request, MAX_JSON_BODY_BYTES);
      let parsed: unknown;
      try {
        parsed = JSON.parse(new TextDecoder().decode(body));
      } catch {
        throw new RequestInputError("Invalid JSON body.", 400);
      }
      ({ resumeText, jdText, tool } = parseJsonFields(parsed));
    } else {
      throw new RequestInputError(
        "Content-Type must be application/json or multipart/form-data.",
        415,
      );
    }

    const usageEvent = resolveUsageEvent(tool);
    let authenticatedUserId: string | null = null;

    if (usageEvent) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json(
          {
            error: "Sign in to use this tool with your free monthly allowance.",
            code: "AUTH_REQUIRED",
            signInUrl: "/login",
          },
          { status: 401 },
        );
      }

      authenticatedUserId = user.id;

      try {
        await assertUsageAvailable(user.id, usageEvent);
      } catch (error) {
        if (error instanceof UsageLimitError) {
          return NextResponse.json(usageLimitResponse(error), { status: 402 });
        }
        throw error;
      }
    }

    resumeText = resumeText.trim();
    if (!resumeText) {
      return NextResponse.json(
        { error: "Provide resume text or upload a PDF." },
        { status: 400 },
      );
    }

    const result = scoreResumeAgainstJd(resumeText, jdText || null);

    if (usageEvent && authenticatedUserId) {
      await recordUsage(authenticatedUserId, usageEvent);
    }

    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof RequestInputError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof PdfExtractError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const message =
      error instanceof Error ? error.message : "Could not score this resume.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
