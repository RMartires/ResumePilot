/** @type {Promise<typeof html2pdf> | null} */
let html2pdfPromise = null;

function loadHtml2Pdf() {
  if (window.html2pdf) return Promise.resolve(window.html2pdf);
  if (html2pdfPromise) return html2pdfPromise;

  html2pdfPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.onload = () => resolve(window.html2pdf);
    script.onerror = () => reject(new Error("Failed to load PDF library"));
    document.head.appendChild(script);
  });
  return html2pdfPromise;
}

/**
 * Export the live preview element as a downloadable PDF.
 * @param {HTMLElement} element
 * @param {string} filename
 */
export async function downloadPreviewPdf(element, filename) {
  const html2pdf = await loadHtml2Pdf();

  const clone = /** @type {HTMLElement} */ (element.cloneNode(true));
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
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
        },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      })
      .from(clone)
      .save();
  } finally {
    document.body.removeChild(container);
  }
}
