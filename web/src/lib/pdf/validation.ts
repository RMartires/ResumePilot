const MAX_PDF_BYTES = 10 * 1024 * 1024;
const PDF_MAGIC = "%PDF-";

export class PdfExtractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PdfExtractError";
  }
}

function hasPdfExtension(name: string): boolean {
  return name.toLowerCase().endsWith(".pdf");
}

function hasPdfMimeType(type: string): boolean {
  return type === "application/pdf";
}

const PDF_MAGIC_SCAN_BYTES = 1024;

export function isPdfMagicBytes(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < PDF_MAGIC.length) return false;
  const scanLength = Math.min(buffer.byteLength, PDF_MAGIC_SCAN_BYTES);
  const header = new TextDecoder().decode(new Uint8Array(buffer, 0, scanLength));
  return header.includes(PDF_MAGIC);
}

export function assertPdfMagicBytes(buffer: ArrayBuffer): void {
  if (!isPdfMagicBytes(buffer)) {
    throw new PdfExtractError("Only PDF files are supported.");
  }
}

export function assertUploadedPdf(file: {
  name: string;
  size: number;
  type: string;
}): void {
  const pdfMime = hasPdfMimeType(file.type);
  const pdfExtension = hasPdfExtension(file.name);

  if (!pdfMime && !pdfExtension) {
    throw new PdfExtractError("Only PDF files are supported.");
  }

  if (file.size > MAX_PDF_BYTES) {
    throw new PdfExtractError("PDF must be 10 MB or smaller.");
  }

  if (file.size === 0) {
    throw new PdfExtractError("The PDF file is empty.");
  }
}

export async function assertPdfFile(file: File): Promise<void> {
  assertUploadedPdf({
    name: file.name,
    size: file.size,
    type: file.type,
  });

  const headerBuffer = await file.slice(0, PDF_MAGIC_SCAN_BYTES).arrayBuffer();
  if (!isPdfMagicBytes(headerBuffer)) {
    throw new PdfExtractError("Only PDF files are supported.");
  }
}
