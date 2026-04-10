# ProdGuard AI MVP

Hackathon MVP for turning rough feature ideas into a structured PRD package with risk/compliance awareness.

## What is included
- Separate product PRD: `ProdGuard_AI_PRD.md`
- Single-page MVP UI:
  - input + notes upload
  - structured PRD generation
  - user stories + acceptance criteria
  - risk/compliance flags panel
  - editable output
  - export to Markdown and printable PDF flow

## Run locally

**Dev server (recommended)**

```powershell
cd "c:\Users\Ayman\OneDrive\Desktop\PNC"
npm install
npm run dev
```

Vite prints a local URL (default [http://localhost:5173](http://localhost:5173)) and can open the browser automatically.

**Without Node**

Open `index.html` in a modern browser, or use `python -m http.server` from this folder.

## Key files
- `index.html` - UI layout
- `src/app.js` - workflow and event handling
- `src/generator.js` - PRD/story generation
- `src/risk.js` - compliance/risk heuristics and scoring
- `src/export.js` - markdown and PDF export helpers
- `src/schema.js` - output structure and scoring schema
- `VALIDATION_RESULTS.md` - fintech/healthcare validation outcomes
