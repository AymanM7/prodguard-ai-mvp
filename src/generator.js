import { prdSections } from "./schema.js";

function extractGoals(input) {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.slice(0, 3).map((line, idx) => `- G${idx + 1}: ${line}`);
}

function inferUsers(input) {
  const lower = input.toLowerCase();
  const users = ["Product Managers", "Product Owners", "Business Analysts"];
  if (lower.includes("engineer") || lower.includes("handoff")) users.push("Engineering Managers");
  if (lower.includes("patient") || lower.includes("health")) users.push("Compliance Officer");
  return [...new Set(users)];
}

export function generatePrdDraft(rawInput) {
  const trimmed = rawInput.trim();
  const users = inferUsers(trimmed);
  const goals = extractGoals(trimmed);

  const sections = {
    Overview: `ProdGuard draft for: ${trimmed.slice(0, 120) || "New feature concept"}`,
    Problem:
      "Current requirements are fragmented and ambiguous, increasing delivery and compliance risk in regulated environments.",
    Goals: goals.length ? goals.join("\n") : "- Define clear scope\n- Reduce ambiguity\n- Improve launch readiness",
    "Target Users": users.map((u) => `- ${u}`).join("\n"),
    Scope:
      "- In: Idea intake, draft PRD generation, user stories, risk flags, export\n- Out: Approval workflows, advanced integrations",
    Requirements:
      "- System must convert rough notes into structured PRD sections.\n- System must produce user stories with acceptance criteria.\n- System must flag likely compliance and privacy gaps.",
    "Non-Functional Requirements":
      "- First draft returned quickly for hackathon usage.\n- Output structure stays consistent and editable.\n- Export works to Markdown and PDF.",
    Dependencies:
      "- Browser file APIs\n- Download capability for local exports\n- Team review before production use",
    Risks:
      "- Ambiguous wording may reduce implementation quality.\n- Missing failure states may impact launch quality.\n- Regulatory assumptions may be incomplete.",
    "Success Metrics":
      "- Time-to-first-draft reduced.\n- PRD completeness score >= 75.\n- Risk flags acknowledged before export."
  };

  const missingSections = prdSections.filter((key) => !sections[key]);
  if (missingSections.length) {
    throw new Error(`Missing generated sections: ${missingSections.join(", ")}`);
  }
  return sections;
}

export function generateStories(prdSectionsMap) {
  const reqSummary = prdSectionsMap.Requirements || "Core feature requirements";
  return {
    epics: [
      {
        title: "Epic 1: Idea Intake",
        stories: [
          {
            story: "As a PM, I want to paste or upload notes so that raw ideas are captured in one place.",
            acceptanceCriteria: [
              "Given rough input text, when I click generate, then the system normalizes the input.",
              "Given uploaded notes, when parsing is complete, then text is merged into the draft context.",
              "Given invalid file types, when upload occurs, then user sees a clear validation message."
            ]
          },
          {
            story: "As a PM, I want transparent input handling so that I can trust generated output.",
            acceptanceCriteria: [
              "Input source count is displayed.",
              "Combined input remains editable before generation.",
              "Generation fails gracefully with a clear error state."
            ]
          }
        ],
        edgeCases: ["Empty input", "Conflicting statements across uploaded files"],
        testScenarios: ["Upload notes + freeform text", "Generate with minimal one-line input"]
      },
      {
        title: "Epic 2: PRD and Story Generation",
        stories: [
          {
            story: "As a PM, I want a structured PRD draft so that engineering receives complete context.",
            acceptanceCriteria: [
              "Draft includes overview, goals, users, requirements, risks, and metrics.",
              "Each section is human-readable and editable.",
              "The generated content references intent from source input."
            ]
          },
          {
            story: "As an Engineering Manager, I want clear acceptance criteria so that implementation is testable.",
            acceptanceCriteria: [
              "User stories are grouped under epics.",
              "Every story includes at least three acceptance criteria.",
              "Edge cases and test scenarios are listed."
            ]
          }
        ],
        edgeCases: ["Highly vague input", "Overly long notes input"],
        testScenarios: ["Generate from transcript-like notes", "Generate from bullet-point business ask"]
      },
      {
        title: "Epic 3: Risk Review and Export",
        stories: [
          {
            story: "As a PM in a regulated domain, I want compliance warnings so that I can reduce rollout risk.",
            acceptanceCriteria: [
              "Risk panel lists warnings with rationale.",
              "Warnings update when regenerated output changes.",
              "Missing privacy/retention/audit cues are detectable."
            ]
          },
          {
            story: "As a PM, I want export options so that I can share outputs with stakeholders.",
            acceptanceCriteria: [
              "User can export markdown with all sections.",
              "User can export PDF for review packs.",
              "Edited content is what gets exported."
            ]
          }
        ],
        edgeCases: ["No risks identified case", "Very high-risk output case"],
        testScenarios: ["Markdown export after manual edits", "PDF export from final draft"]
      }
    ],
    requirementReference: reqSummary
  };
}

export function formatPackage(prdMap, storyBundle, score) {
  const prdText = Object.entries(prdMap)
    .map(([title, content]) => `## ${title}\n${content}`)
    .join("\n\n");

  const storiesText = storyBundle.epics
    .map((epic) => {
      const stories = epic.stories
        .map((s) => {
          const criteria = s.acceptanceCriteria.map((c) => `  - ${c}`).join("\n");
          return `- ${s.story}\n${criteria}`;
        })
        .join("\n");
      const edgeCases = epic.edgeCases.map((e) => `- ${e}`).join("\n");
      const tests = epic.testScenarios.map((t) => `- ${t}`).join("\n");
      return `### ${epic.title}\n${stories}\n\nEdge Cases\n${edgeCases}\n\nTest Scenarios\n${tests}`;
    })
    .join("\n\n");

  return `# ProdGuard AI Generated PRD Package

## PRD Quality Score
- Overall: ${score.overall}
- Clarity: ${score.clarity}
- Completeness: ${score.completeness}
- Risk: ${score.risk}
- Launch Readiness: ${score.launchReadiness}

# Structured PRD
${prdText}

# User Stories and Acceptance Criteria
${storiesText}
`;
}
