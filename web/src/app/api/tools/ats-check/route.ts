import { NextResponse } from "next/server";
import { extractPdfText, PdfExtractError } from "@/lib/pdf/extract-text";
import { assertUploadedPdf, assertPdfMagicBytes } from "@/lib/pdf/validation";
import { scoreResumeAgainstJd } from "@/lib/seo/ats-score";

export const runtime = "nodejs";

const MAX_TEXT_CHARS = 80_000;

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let resumeText = "";
    let jdText = "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const resumeField = form.get("resumeText");
      const jdField = form.get("jdText");
      const file = form.get("file");

      if (typeof resumeField === "string") {
        resumeText = resumeField.slice(0, MAX_TEXT_CHARS);
      }
      if (typeof jdField === "string") {
        jdText = jdField.slice(0, MAX_TEXT_CHARS);
      }

      if (file instanceof File && file.size > 0) {
        assertUploadedPdf(file);
        const buffer = await file.arrayBuffer();
        assertPdfMagicBytes(buffer);
        resumeText = await extractPdfText(buffer);
      }
    } else {
      const body = (await request.json()) as {
        resumeText?: string;
        jdText?: string;
      };
      resumeText = (body.resumeText ?? "").slice(0, MAX_TEXT_CHARS);
      jdText = (body.jdText ?? "").slice(0, MAX_TEXT_CHARS);
    }

    resumeText = resumeText.trim();
    if (!resumeText) {
      return NextResponse.json(
        { error: "Provide resume text or upload a PDF." },
        { status: 400 },
      );
    }

    const result = scoreResumeAgainstJd(resumeText, jdText || null);
    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof PdfExtractError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const message =
      error instanceof Error ? error.message : "Could not score this resume.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
