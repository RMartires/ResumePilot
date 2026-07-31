import { NextResponse } from "next/server";
import { processResumeImport } from "@/lib/ai/process-resume-import";
import { extractPdfText } from "@/lib/pdf/extract-text";
import { getUploadedFile } from "@/lib/pdf/form-data-file";
import {
  assertPdfMagicBytes,
  assertUploadedPdf,
  PdfExtractError,
} from "@/lib/pdf/validation";
import {
  buildResumeUploadPath,
  createResumeUploadRecord,
  markResumeUploadFailed,
  saveResumePdfToStorage,
} from "@/lib/supabase/resume-uploads";
import { createClient } from "@/lib/supabase/server";
import { getErrorMessage } from "@/lib/utils";

export const maxDuration = 60;

function pdfValidationError(error: unknown): string {
  return error instanceof PdfExtractError
    ? error.message
    : "Only PDF files are supported.";
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
    return NextResponse.json({ error: pdfValidationError(error) }, { status: 400 });
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
    return NextResponse.json({ error: pdfValidationError(error) }, { status: 400 });
  }

  const uploadId = crypto.randomUUID();
  const filePath = buildResumeUploadPath(user.id, uploadId, upload.name);

  try {
    await createResumeUploadRecord(supabase, {
      id: uploadId,
      userId: user.id,
      filePath,
      fileName: upload.name,
      fileSize: buffer.byteLength,
      mimeType: upload.type,
    });
  } catch (error) {
    console.error(
      "[import-pdf] failed to create upload record — run migration 003_resume_uploads_storage.sql",
      error,
    );
    return NextResponse.json({ error: "Could not start upload." }, { status: 500 });
  }

  // Persist PDF before parsing so failed imports remain inspectable in Storage.
  try {
    await saveResumePdfToStorage(supabase, filePath, buffer);
  } catch (error) {
    const message = getErrorMessage(error, "Failed to save PDF");
    await markResumeUploadFailed(supabase, uploadId, message);
    console.error("[import-pdf] storage failed", uploadId, error);
    return NextResponse.json({ error: message, uploadId }, { status: 500 });
  }

  let pdfText: string;
  try {
    pdfText = await extractPdfText(buffer);
  } catch (error) {
    const message = getErrorMessage(error, "Failed to import resume");
    await markResumeUploadFailed(supabase, uploadId, message);
    console.error("[import-pdf] extract failed", uploadId, error);

    const status = error instanceof PdfExtractError ? 400 : 500;
    return NextResponse.json({ error: message, uploadId }, { status });
  }

  try {
    const result = await processResumeImport({
      uploadId,
      userId: user.id,
      fileName: upload.name,
      filePath,
      pdfText,
    });

    return NextResponse.json({
      id: result.resumeId,
      title: result.title,
      uploadId,
      source: result.source,
    });
  } catch (error) {
    const message = getErrorMessage(error, "Failed to import resume");
    return NextResponse.json({ error: message, uploadId }, { status: 500 });
  }
}
