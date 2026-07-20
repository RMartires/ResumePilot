import { NextResponse } from "next/server";
import type { ResumeUploadStatus } from "@/lib/supabase/resume-uploads";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uploadId: string }> },
) {
  const { uploadId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: upload, error } = await supabase
    .from("resume_uploads")
    .select("id, status, error_message, resume_id")
    .eq("id", uploadId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!upload) {
    return NextResponse.json({ error: "Upload not found" }, { status: 404 });
  }

  const status = upload.status as ResumeUploadStatus;

  if (status === "success" && upload.resume_id) {
    return NextResponse.json({
      uploadId: upload.id,
      status,
      resumeId: upload.resume_id,
    });
  }

  if (status === "failed") {
    return NextResponse.json({
      uploadId: upload.id,
      status,
      error: upload.error_message ?? "Import failed",
    });
  }

  return NextResponse.json({
    uploadId: upload.id,
    status: "processing" as const,
  });
}
