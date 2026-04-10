import { generatePrdDraft, generateStories, formatPackage } from "./generator.js";
import { reviewRisks, scorePrd } from "./risk.js";
import { exportMarkdown, exportPdf } from "./export.js";
import { fintechExample, healthcareExample } from "./examples.js";

const ideaInput = document.getElementById("ideaInput");
const notesUpload = document.getElementById("notesUpload");
const uploadMeta = document.getElementById("uploadMeta");
const generateBtn = document.getElementById("generateBtn");
const outputEditor = document.getElementById("outputEditor");
const riskList = document.getElementById("riskList");
const scorePill = document.getElementById("scorePill");
const exportMdBtn = document.getElementById("exportMdBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");
const loadFintechExampleBtn = document.getElementById("loadFintechExampleBtn");
const loadHealthcareExampleBtn = document.getElementById("loadHealthcareExampleBtn");

let uploadedTextCache = "";
renderRisks([]);

notesUpload.addEventListener("change", async (event) => {
  const files = Array.from(event.target.files || []);
  if (!files.length) {
    uploadMeta.textContent = "";
    uploadedTextCache = "";
    return;
  }

  const chunks = [];
  for (const f of files) {
    const text = await f.text();
    chunks.push(`\n[File: ${f.name}]\n${text}`);
  }
  uploadedTextCache = chunks.join("\n");
  uploadMeta.textContent = `${files.length} file(s) loaded and ready for generation.`;
});

function renderRisks(warnings) {
  riskList.innerHTML = "";
  if (!warnings.length) {
    const li = document.createElement("li");
    li.textContent = "No major compliance or ambiguity warnings found in current draft.";
    li.className = "risk-ok";
    riskList.appendChild(li);
    return;
  }
  warnings.forEach((warning) => {
    const li = document.createElement("li");
    li.textContent = warning;
    li.className = "risk-warning";
    riskList.appendChild(li);
  });
}

function runGeneration() {
  const mergedInput = `${ideaInput.value.trim()}\n${uploadedTextCache}`.trim();
  if (!mergedInput) {
    alert("Please add a feature idea or upload notes first.");
    return;
  }

  const prd = generatePrdDraft(mergedInput);
  const stories = generateStories(prd);
  const initialBody = formatPackage(prd, stories, {
    overall: 0,
    clarity: 0,
    completeness: 0,
    risk: 0,
    launchReadiness: 0
  });
  const warnings = reviewRisks(initialBody);
  const score = scorePrd(initialBody, warnings.length);
  const finalBody = formatPackage(prd, stories, score);

  outputEditor.value = finalBody;
  renderRisks(warnings);
  scorePill.textContent = `Quality Score: ${score.overall}/100`;
}

generateBtn.addEventListener("click", runGeneration);

outputEditor.addEventListener("input", () => {
  const text = outputEditor.value;
  const warnings = reviewRisks(text);
  const score = scorePrd(text, warnings.length);
  renderRisks(warnings);
  scorePill.textContent = `Quality Score: ${score.overall}/100`;
});

exportMdBtn.addEventListener("click", () => {
  if (!outputEditor.value.trim()) {
    alert("Generate content before exporting.");
    return;
  }
  exportMarkdown(outputEditor.value);
});

exportPdfBtn.addEventListener("click", () => {
  if (!outputEditor.value.trim()) {
    alert("Generate content before exporting.");
    return;
  }
  exportPdf(outputEditor.value);
});

loadFintechExampleBtn.addEventListener("click", () => {
  ideaInput.value = fintechExample;
});

loadHealthcareExampleBtn.addEventListener("click", () => {
  ideaInput.value = healthcareExample;
});
