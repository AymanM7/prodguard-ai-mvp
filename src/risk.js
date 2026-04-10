import { scoreWeights } from "./schema.js";

const ambiguousTerms = ["fast", "secure", "user-friendly", "easy", "robust", "quickly"];

function hasAny(text, patterns) {
  const lower = text.toLowerCase();
  return patterns.some((p) => lower.includes(p));
}

export function reviewRisks(fullText) {
  const warnings = [];
  const t = fullText.toLowerCase();

  if (!hasAny(t, ["retention", "delete after", "ttl", "data lifecycle"])) {
    warnings.push("No data retention policy mentioned.");
  }
  if (!hasAny(t, ["consent", "lawful basis", "privacy notice"])) {
    warnings.push("Missing consent/privacy language.");
  }
  if (hasAny(t, ["financial", "bank", "account", "transaction", "health", "patient"]) && !hasAny(t, ["encryption", "masking", "access control", "logging"])) {
    warnings.push("Sensitive financial or health data may require added controls.");
  }
  if (!hasAny(t, ["audit", "audit trail", "event log", "traceability"])) {
    warnings.push("Auditability gap detected.");
  }
  if (!hasAny(t, ["failure", "fallback", "error handling", "retry"])) {
    warnings.push("Missing failure states or fallback behavior.");
  }
  if (ambiguousTerms.some((w) => t.includes(w))) {
    warnings.push("Requirement wording appears ambiguous; add measurable definitions.");
  }
  if (!hasAny(t, ["kpi", "metric", "success", "target", "%"])) {
    warnings.push("Unclear success metrics.");
  }
  if (hasAny(t, ["ai", "model", "prediction"]) && !hasAny(t, ["fairness", "bias", "explainability"])) {
    warnings.push("AI feature may need fairness and explainability controls.");
  }

  return warnings;
}

export function scorePrd(fullText, warningCount) {
  const text = fullText.toLowerCase();
  const clarityBase = ambiguousTerms.some((w) => text.includes(w)) ? 65 : 82;
  const completenessBase = ["overview", "problem", "goals", "requirements", "risks", "metrics"]
    .reduce((acc, key) => (text.includes(key) ? acc + 12 : acc), 20);
  const riskScore = Math.max(30, 95 - warningCount * 10);
  const launchReadiness = Math.max(35, Math.min(92, Math.round((clarityBase + completenessBase + riskScore) / 3)));

  const overall = Math.round(
    clarityBase * scoreWeights.clarity +
      completenessBase * scoreWeights.completeness +
      riskScore * scoreWeights.risk +
      launchReadiness * scoreWeights.launchReadiness
  );

  return {
    overall,
    clarity: clarityBase,
    completeness: Math.min(100, completenessBase),
    risk: riskScore,
    launchReadiness
  };
}
