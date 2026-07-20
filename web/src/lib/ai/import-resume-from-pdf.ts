import { generateObject, generateText } from "@/lib/ai/langsmith";
import { getImportModel } from "@/lib/ai/openrouter";
import { buildImportResumeSystemPrompt } from "@/lib/ai/prompts/import-resume";
import {
  RESUME_IMPORT_TEMPERATURE,
  resumeImportResponseSchema,
  type ResumeImportResponse,
} from "@/lib/ai/schemas/resume-import-response";

const IMPORT_MAX_OUTPUT_TOKENS = 8192;
const MAX_IMPORT_TEXT_CHARS = 14_000;

function truncateImportText(text: string): string {
  if (text.length <= MAX_IMPORT_TEXT_CHARS) return text;

  const headChars = Math.floor(MAX_IMPORT_TEXT_CHARS * 0.85);
  const tailChars = MAX_IMPORT_TEXT_CHARS - headChars - 48;

  return `${text.slice(0, headChars)}\n\n[... middle of resume omitted for length ...]\n\n${text.slice(-tailChars)}`;
}

function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() ?? trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model response did not contain JSON");
  }
  return JSON.parse(candidate.slice(start, end + 1)) as unknown;
}

async function importViaGenerateObject(
  pdfText: string,
): Promise<ResumeImportResponse> {
  const { object } = await generateObject({
    model: getImportModel(),
    temperature: RESUME_IMPORT_TEMPERATURE,
    maxOutputTokens: IMPORT_MAX_OUTPUT_TOKENS,
    schema: resumeImportResponseSchema,
    system: buildImportResumeSystemPrompt(),
    prompt: `Extract structured resume data from this PDF text:\n\n${pdfText}`,
  });
  return object;
}

async function importViaGenerateText(
  pdfText: string,
): Promise<ResumeImportResponse> {
  const { text } = await generateText({
    model: getImportModel(),
    temperature: RESUME_IMPORT_TEMPERATURE,
    maxOutputTokens: IMPORT_MAX_OUTPUT_TOKENS,
    system: `${buildImportResumeSystemPrompt()}

Respond with a single JSON object only. No markdown fences, no commentary.`,
    prompt: `Extract structured resume data from this PDF text:\n\n${pdfText}`,
  });

  const parsed = resumeImportResponseSchema.safeParse(extractJsonObject(text));
  if (!parsed.success) {
    throw new Error(`Import JSON failed validation: ${parsed.error.message}`);
  }
  return parsed.data;
}

export async function importResumeFromPdfText(
  pdfText: string,
): Promise<ResumeImportResponse> {
  const trimmedText = truncateImportText(pdfText);

  try {
    return await importViaGenerateObject(trimmedText);
  } catch (firstError) {
    console.warn(
      "[import-pdf] generateObject failed, retrying via generateText",
      firstError,
    );
    try {
      return await importViaGenerateText(trimmedText);
    } catch (secondError) {
      console.error("[import-pdf] generateText fallback failed", secondError);
      throw firstError;
    }
  }
}
