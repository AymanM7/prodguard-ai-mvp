## Summary

Upgrade PDF export from a **print-only** flow to a **real downloadable PDF** with multipage text, wrapping, header branding, and page numbers—plus a **print fallback** if the PDF library cannot load.

## What changed

- **`src/export.js`**
  - Primary path: dynamic import of **jsPDF** (`jspdf@2.5.2` via `esm.sh`), A4 pages, `splitTextToSize` wrapping, automatic pagination, orange header bar, footer page numbers, `doc.save(...)`.
  - Fallback: if the CDN import fails, uses the previous **new window + print** behavior so users are not blocked offline.
- **`src/app.js`**: `Export PDF` handler is `async` and awaits `exportPdf()` with basic error surfacing.

## Dependencies / runtime

- **Network**: first-time PDF generation loads jsPDF from `https://esm.sh/jspdf@2.5.2`. No `npm` dependency on jsPDF (keeps the repo small); install is only for Vite.

## How to verify

1. `npm run dev`, generate a PRD package, click **Export PDF**.
2. Confirm a `.pdf` file downloads and long content spans multiple pages with page numbers.
3. (Optional) Block the CDN or go offline and confirm print fallback still appears.

## Branch relationship

This branch **fast-forwarded** `feature/ui-redesign`, so it includes the PNC UI theme plus PDF upgrades. If `feature/ui-redesign` is merged to `main` first, merging this PR should bring in mainly the PDF/export commits on top.

## Dev server (also on this branch)

- **`package.json`**, **`vite.config.js`**, **`.gitignore`**: `npm run dev` → [http://localhost:5173](http://localhost:5173)
- **`README.md`**: updated run instructions
