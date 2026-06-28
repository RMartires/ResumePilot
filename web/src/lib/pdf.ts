export async function downloadPreviewPdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const html2pdf = (await import("html2pdf.js")).default;

  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.boxShadow = "none";
  clone.style.borderRadius = "0";
  clone.style.width = "7.5in";
  clone.style.minHeight = "auto";
  clone.style.maxWidth = "none";

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
  container.style.background = "#fff";
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    await html2pdf()
      .set({
        margin: [0.5, 0.5, 0.5, 0.5],
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      // html2pdf.js types are incomplete
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
      .from(clone)
      .save();
  } finally {
    document.body.removeChild(container);
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  downloadBlob(blob, filename);
}

export function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  downloadBlob(blob, filename);
}
