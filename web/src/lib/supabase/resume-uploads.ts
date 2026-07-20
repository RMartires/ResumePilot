import type { SupabaseClient } from "@supabase/supabase-js";

export const RESUME_UPLOADS_BUCKET = "resume-uploads";

export type ResumeUploadStatus = "processing" | "success" | "failed";

export function sanitizeUploadFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? "upload.pdf";
  const sanitized = base.replace(/[^\w.\-() ]+/g, "_").trim();
  return sanitized || "upload.pdf";
}

export function buildResumeUploadPath(
  userId: string,
  uploadId: string,
  filename: string,
): string {
  return `${userId}/${uploadId}/${sanitizeUploadFilename(filename)}`;
}

export async function saveResumePdfToStorage(
  supabase: SupabaseClient,
  path: string,
  buffer: ArrayBuffer,
): Promise<void> {
  const { error } = await supabase.storage
    .from(RESUME_UPLOADS_BUCKET)
    .upload(path, buffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to save PDF: ${error.message}`);
  }
}

export async function createResumeUploadRecord(
  supabase: SupabaseClient,
  input: {
    id: string;
    userId: string;
    filePath: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  },
): Promise<void> {
  const { error } = await supabase.from("resume_uploads").insert({
    id: input.id,
    user_id: input.userId,
    file_path: input.filePath,
    file_name: input.fileName,
    file_size: input.fileSize,
    mime_type: input.mimeType || null,
    status: "processing",
  });

  if (error) {
    throw new Error(`Failed to record upload: ${error.message}`);
  }
}

export async function markResumeUploadSuccess(
  supabase: SupabaseClient,
  uploadId: string,
  resumeId: string,
): Promise<void> {
  const { error } = await supabase
    .from("resume_uploads")
    .update({
      status: "success",
      resume_id: resumeId,
      error_message: null,
    })
    .eq("id", uploadId);

  if (error) {
    console.error("[resume-uploads] failed to mark success", uploadId, error);
  }
}

export async function markResumeUploadFailed(
  supabase: SupabaseClient,
  uploadId: string,
  errorMessage: string,
): Promise<void> {
  const { error } = await supabase
    .from("resume_uploads")
    .update({
      status: "failed",
      error_message: errorMessage,
    })
    .eq("id", uploadId);

  if (error) {
    console.error("[resume-uploads] failed to mark failure", uploadId, error);
  }
}
