## Summary

Refresh the ProdGuard MVP UI with a **PNC-inspired** palette (navy base, orange accent) and a clearer layout: hero header, stepped cards, two-column workspace, and improved risk flag styling.

## What changed

- **`src/styles.css`**: New CSS variables and theme (navy backgrounds, orange `#f58025` / `#f8a35f` accents, borders, chips, buttons, score pill, risk panels).
- **`index.html`** (from earlier UI pass on this line of work): Product-style layout with Idea Intake, Risk flags, and editable PRD column.

## How to verify

1. `npm install` and `npm run dev` (or open `index.html`).
2. Confirm colors match the intended PNC-style branding and layout is readable on narrow viewports.

## Suggested merge order

Merge this PR **before** the PDF PR if you want history to show UI first; the PDF branch already includes these UI commits.

## Notes

This is a visual/branding update only; generation and risk logic are unchanged on this branch relative to the shared baseline.
