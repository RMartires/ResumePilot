export type UploadedFile = {
  blob: Blob;
  name: string;
  size: number;
  type: string;
};

/** Read an uploaded file from multipart form data (File or Blob). */
export function getUploadedFile(
  formData: FormData,
  field = "file",
): UploadedFile | null {
  const entry = formData.get(field);
  if (!entry || typeof entry === "string") return null;
  if (typeof entry !== "object" || !("arrayBuffer" in entry)) return null;

  const blob = entry as Blob;
  const name = entry instanceof File && entry.name ? entry.name : "upload.pdf";

  return {
    blob,
    name,
    size: blob.size,
    type: blob.type || "application/octet-stream",
  };
}
