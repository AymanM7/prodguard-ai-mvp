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

export function exportPdf(content) {
  const escaped = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>ProdGuard Export</title><style>body{font-family:Arial,sans-serif;white-space:pre-wrap;padding:24px;line-height:1.4}</style></head><body>${escaped}</body></html>`;
  const win = window.open("", "_blank");
  if (!win) {
    throw new Error("Popup blocked. Please allow popups for PDF export.");
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}
