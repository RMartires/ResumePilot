import { extractText, getDocumentProxy } from "unpdf";
import { PdfExtractError } from "@/lib/pdf/validation";

export { PdfExtractError } from "@/lib/pdf/validation";

export async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  // Copy bytes — unpdf/pdf.js may detach the underlying ArrayBuffer.
  const bytes = new Uint8Array(buffer.slice(0));

  let pdf;
  try {
    pdf = await getDocumentProxy(bytes);
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "The file may be corrupted.";
    throw new PdfExtractError(
      `Could not open this PDF. ${detail}`,
    );
  }

  let rawText: string;
  try {
    const { text } = await extractText(pdf, { mergePages: true });
    rawText = Array.isArray(text) ? text.join("\n") : text;
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "The file may be encrypted.";
    throw new PdfExtractError(
      `Could not read text from this PDF. ${detail}`,
    );
  }

  const normalized = rawText.replace(/\s+/g, " ").trim();

  if (!normalized) {
    throw new PdfExtractError(
      "Could not read text from this PDF. Use a text-based PDF export or re-export from ResumePilot.",
    );
  }

  return rawText.trim();
}
