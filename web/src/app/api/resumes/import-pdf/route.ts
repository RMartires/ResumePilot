import { NextResponse } from "next/server";
import { flushLangSmithTraces } from "@/lib/ai/langsmith";
import { importResumeFromPdf } from "@/lib/ai/import-resume-from-pdf";
import { PdfExtractError } from "@/lib/pdf/extract-text";
import { getUploadedFile } from "@/lib/pdf/form-data-file";
import { assertPdfMagicBytes, assertUploadedPdf } from "@/lib/pdf/validation";
import { normalizeResume, resumeToJson } from "@/lib/resume";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60;

function titleFromFilename(filename: string): string {
  return filename.replace(/\.pdf$/i, "").trim() || "Imported Resume";
}

export async function POST(request: Request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      {
        error:
          "AI is not configured. Set OPENROUTER_API_KEY in web/.env.local",
      },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const upload = getUploadedFile(formData);
  if (!upload) {
    return NextResponse.json({ error: "PDF file is required" }, { status: 400 });
  }

  try {
    assertUploadedPdf(upload);
  } catch (error) {
    const message =
      error instanceof PdfExtractError
        ? error.message
        : "Only PDF files are supported.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  let buffer: ArrayBuffer;
  try {
    buffer = await upload.blob.arrayBuffer();
  } catch {
    return NextResponse.json({ error: "Failed to read PDF file" }, { status: 400 });
  }

  try {
    assertPdfMagicBytes(buffer);
  } catch (error) {
    const message =
      error instanceof PdfExtractError
        ? error.message
        : "Only PDF files are supported.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const imported = await importResumeFromPdf(buffer);

    const resume = resumeToJson(normalizeResume(imported.resume));
    const title =
      imported.title.trim() ||
      resume.header.name.trim() ||
      titleFromFilename(upload.name);

    const { data: defaultTemplate } = await supabase
      .from("templates")
      .select("id")
      .eq("is_default", true)
      .maybeSingle();

    const { data, error } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title,
        template_id: defaultTemplate?.id ?? null,
        data: resume,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await flushLangSmithTraces();
    return NextResponse.json({ id: data.id, title });
  } catch (error) {
    await flushLangSmithTraces();
    if (error instanceof PdfExtractError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[import-pdf] failed", error);
    const message =
      error instanceof Error ? error.message : "Failed to import resume";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
