import { flushLangSmithTraces } from "@/lib/ai/langsmith";
import { importResumeFromPdfText } from "@/lib/ai/import-resume-from-pdf";
import { parseResumeFromText } from "@/lib/pdf/parse-resume-text";
import { normalizeResume, resumeToJson } from "@/lib/resume";
import {
  markResumeUploadFailed,
  markResumeUploadSuccess,
} from "@/lib/supabase/resume-uploads";
import { createClient } from "@/lib/supabase/server";
import { getErrorMessage } from "@/lib/utils";
import type { Resume } from "@/lib/validations/resume";

const DEFAULT_IMPORTED_TITLE = "Imported Resume";

function titleFromFilename(filename: string): string {
  return filename.replace(/\.pdf$/i, "").trim() || DEFAULT_IMPORTED_TITLE;
}

export type ProcessResumeImportResult = {
  resumeId: string;
  title: string;
  source: "heuristic" | "ai";
};

async function insertResume(
  supabase: Awaited<ReturnType<typeof createClient>>,
  input: {
    userId: string;
    title: string;
    resume: Resume;
    templateId: string | null;
  },
): Promise<string> {
  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: input.userId,
      title: input.title,
      template_id: input.templateId,
      data: input.resume,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id;
}

/**
 * Parse + save resume. Prefers deterministic heuristics (ms); falls back to LLM.
 * Caller must already have persisted the PDF to Storage.
 */
export async function processResumeImport(input: {
  uploadId: string;
  userId: string;
  fileName: string;
  filePath: string;
  pdfText: string;
}): Promise<ProcessResumeImportResult> {
  const supabase = await createClient();

  try {
    const [{ data: defaultTemplate }, heuristic] = await Promise.all([
      supabase.from("templates").select("id").eq("is_default", true).maybeSingle(),
      Promise.resolve(parseResumeFromText(input.pdfText)),
    ]);

    const templateId = defaultTemplate?.id ?? null;

    if (heuristic.confident) {
      const resumeId = await insertResume(supabase, {
        userId: input.userId,
        title: heuristic.title,
        resume: heuristic.resume,
        templateId,
      });
      await markResumeUploadSuccess(supabase, input.uploadId, resumeId);
      return { resumeId, title: heuristic.title, source: "heuristic" };
    }

    const imported = await importResumeFromPdfText(input.pdfText);
    const resume = resumeToJson(normalizeResume(imported.resume));
    const title =
      imported.title.trim() ||
      resume.header.name.trim() ||
      titleFromFilename(input.fileName);

    const resumeId = await insertResume(supabase, {
      userId: input.userId,
      title,
      resume,
      templateId,
    });
    await markResumeUploadSuccess(supabase, input.uploadId, resumeId);
    return { resumeId, title, source: "ai" };
  } catch (error) {
    console.error("[import-pdf] processing failed", input.uploadId, error);
    await markResumeUploadFailed(
      supabase,
      input.uploadId,
      getErrorMessage(error, "Failed to import resume"),
    );
    throw error;
  } finally {
    void flushLangSmithTraces();
  }
}
