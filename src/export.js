function downloadBlob(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportMarkdown(content) {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  downloadBlob(`prodguard-prd-${stamp}.md`, content, "text/markdown;charset=utf-8");
}

function exportPdfViaPrint(content) {
  const escaped = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>ProdGuard Export</title><style>body{font-family:Arial,sans-serif;white-space:pre-wrap;padding:24px;line-height:1.45;font-size:12px}</style></head><body>${escaped}</body></html>`;
  const win = window.open("", "_blank");
  if (!win) {
    throw new Error("Popup blocked. Allow popups for print fallback, or try again.");
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}

/**
 * Builds a real PDF (multipage, wrapped text, header/footer). Falls back to print if CDN load fails.
 */
export async function exportPdf(content) {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const body = (content || "").replace(/\r\n/g, "\n").trim();
  if (!body) {
    throw new Error("Nothing to export.");
  }

  let jsPDF;
  try {
    const mod = await import("https://esm.sh/jspdf@2.5.2");
    jsPDF = mod.jsPDF;
    if (typeof jsPDF !== "function" && mod.default) {
      jsPDF = typeof mod.default === "function" ? mod.default : mod.default.jsPDF;
    }
  } catch {
    exportPdfViaPrint(content);
    return;
  }

  if (typeof jsPDF !== "function") {
    exportPdfViaPrint(content);
    return;
  }

  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;
  const maxW = pageW - 2 * margin;
  const lineHeight = 4.2;
  const footerH = 10;

  doc.setFillColor(245, 128, 37);
  doc.rect(0, 0, pageW, 9, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text("ProdGuard AI — PRD Package", margin, 6);

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(9);
  const lines = doc.splitTextToSize(body, maxW);
  let y = 14;

  const newContinuationPage = () => {
    doc.addPage();
    doc.setFillColor(245, 128, 37);
    doc.rect(0, 0, pageW, 3, "F");
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(9);
    y = margin;
  };

  for (let i = 0; i < lines.length; i++) {
    if (y + lineHeight > pageH - footerH) {
      newContinuationPage();
    }
    doc.text(lines[i], margin, y);
    y += lineHeight;
  }

  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    doc.text(`Page ${p} of ${total}`, pageW - margin - 22, pageH - 6);
  }

  doc.save(`prodguard-prd-${stamp}.pdf`);
}
