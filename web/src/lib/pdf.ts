const MARGIN_IN = 0.5;
const PAGE_HEIGHT_IN = 11;

export function pageContentHeightIn(): number {
  return PAGE_HEIGHT_IN - MARGIN_IN * 2;
}

export async function downloadResumePdf(
  resumeId: string,
  filename: string,
): Promise<void> {
  const response = await fetch(`/api/resumes/${resumeId}/export?format=pdf`);

  if (!response.ok) {
    let message = "PDF export failed";
    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error) message = payload.error;
    } catch {
      // Non-JSON error body.
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
