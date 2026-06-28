const MARGIN_IN = 0.5;
const PAGE_WIDTH_IN = 8.5;
const PAGE_HEIGHT_IN = 11;

export function pageContentHeightIn(): number {
  return PAGE_HEIGHT_IN - MARGIN_IN * 2;
}

async function loadPdfLibraries() {
  const [html2canvasMod, jspdfMod] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);

  const html2canvas = html2canvasMod.default;
  const { jsPDF } = jspdfMod;

  if (typeof html2canvas !== "function" || typeof jsPDF !== "function") {
    throw new Error("PDF libraries failed to load");
  }

  return { html2canvas, jsPDF };
}

export async function downloadPreviewPdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const { html2canvas, jsPDF } = await loadPdfLibraries();

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
  container.style.background = "#ffffff";
  container.style.width = "8.5in";
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const printableWidth = PAGE_WIDTH_IN - MARGIN_IN * 2;
    const printableHeight = pageContentHeightIn();
    const imgWidth = printableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    const pdf = new jsPDF({
      unit: "in",
      format: "letter",
      orientation: "portrait",
    });

    let heightLeft = imgHeight;
    pdf.addImage(imgData, "JPEG", MARGIN_IN, MARGIN_IN, imgWidth, imgHeight);
    heightLeft -= printableHeight;

    while (heightLeft > 0) {
      const position = MARGIN_IN - (imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", MARGIN_IN, position, imgWidth, imgHeight);
      heightLeft -= printableHeight;
    }

    pdf.save(filename);
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
