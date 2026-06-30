import { generateObject } from "@/lib/ai/langsmith";
import { getChatModel } from "@/lib/ai/openrouter";
import { buildImportResumeSystemPrompt } from "@/lib/ai/prompts/import-resume";
import {
  RESUME_IMPORT_TEMPERATURE,
  resumeImportResponseSchema,
  type ResumeImportResponse,
} from "@/lib/ai/schemas/resume-import-response";
import { extractPdfText } from "@/lib/pdf/extract-text";

export async function importResumeFromPdf(
  buffer: ArrayBuffer,
): Promise<ResumeImportResponse> {
  const pdfText = await extractPdfText(buffer);

  const { object } = await generateObject({
    model: getChatModel(),
    temperature: RESUME_IMPORT_TEMPERATURE,
    schema: resumeImportResponseSchema,
    system: buildImportResumeSystemPrompt(),
    prompt: `Extract structured resume data from this PDF text:\n\n${pdfText}`,
  });

  return object;
}
