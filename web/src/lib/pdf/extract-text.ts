import { extractText, getDocumentProxy } from "unpdf";
import { PdfExtractError } from "@/lib/pdf/validation";

export { PdfExtractError } from "@/lib/pdf/validation";

export async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  const rawText = Array.isArray(text) ? text.join("\n") : text;
  const normalized = rawText.replace(/\s+/g, " ").trim();

  if (!normalized) {
    throw new PdfExtractError(
      "Could not read text from this PDF. Use a text-based PDF export or re-export from ResumePilot.",
    );
  }

  return rawText.trim();
}
