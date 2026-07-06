import type { CommitteeConsensus, FinancialSignals, LoanApplication, MsmeProfile, PersonaRecommendation } from "@/domain/types";
import {
  calculateAiReadiness,
  calculateBusinessGrowthForecast,
  calculateCashFlowForecast,
  calculateFinancialHealth,
  calculateFraudRisk,
  calculateRepaymentRisk,
  createLoanRecommendation
} from "./intelligence";

function personaVoteFromScore(score: number, rejectThreshold: number, approveThreshold: number) {
  if (score < rejectThreshold) return "reject" as const;
  if (score >= approveThreshold) return "approve" as const;
  return "conditional" as const;
}

export function runRiskOfficerAnalysis(msme: MsmeProfile, signals: FinancialSignals): PersonaRecommendation {
  const repayment = calculateRepaymentRisk(signals);
  const fraud = calculateFraudRisk(msme.id, signals);
  const health = calculateFinancialHealth(msme, signals);
  const minScore = Math.min(repayment.score, 100 - fraud.score, health.score);
  const vote = personaVoteFromScore(minScore, 40, 72);
  const concerns: string[] = [];
  if (repayment.band === "critical" || repayment.band === "high") concerns.push(`Repayment risk is ${repayment.band} with ${repayment.score}% score`);
  if (fraud.band !== "low") concerns.push(`Fraud risk indicators detected at ${fraud.score}%`);
  if (signals.failedTransactions > 5) concerns.push(`${signals.failedTransactions} failed transactions in recent banking history`);

  return {
    personaId: "risk-officer",
    label: "Risk Officer AI",
    recommendation: vote,
    confidence: Math.round((repayment.confidence + fraud.confidence + health.confidence) / 3),
    evidence: [
      `Repayment risk score: ${repayment.score}% (${repayment.band})`,
      `Fraud risk score: ${fraud.score}% (${fraud.band})`,
      `Financial health score: ${health.score}% (${health.band})`,
      `Existing obligations: INR ${signals.existingObligations.toLocaleString("en-IN")}`
    ],
    keyConcerns: concerns.length > 0 ? concerns : ["No material risk concerns identified"],
    suggestedActions: vote === "reject"
      ? ["Decline application based on repayment and fraud indicators", "Schedule a discussion with the relationship manager"]
      : vote === "conditional"
        ? ["Seek additional collateral or guarantee", "Implement quarterly covenant monitoring", "Require invoice-level reconciliation"]
        : ["Proceed with standard sanction process", "Set up monthly portfolio review"]
  };
}

export function runBusinessGrowthAnalysis(msme: MsmeProfile, signals: FinancialSignals): PersonaRecommendation {
  const growth = calculateBusinessGrowthForecast(signals);
  const cashFlow = calculateCashFlowForecast(signals);
  const health = calculateFinancialHealth(msme, signals);
  const minScore = Math.min(growth.score, cashFlow.score, health.score);
  const vote = personaVoteFromScore(minScore, 38, 75);

  return {
    personaId: "business-growth",
    label: "Business Growth AI",
    recommendation: vote,
    confidence: Math.round((growth.confidence + cashFlow.confidence + health.confidence) / 3),
    evidence: [
      `Business growth forecast: ${growth.score}% (${growth.band})`,
      `Cash flow forecast: ${cashFlow.score}% (${cashFlow.band})`,
      `Financial health score: ${health.score}% (${health.band})`,
      `Business vintage: ${msme.businessAgeYears} years`
    ],
    keyConcerns: growth.score < 58
      ? [`Growth trajectory is ${growth.band} at ${growth.score}%`]
      : cashFlow.score < 58
        ? [`Cash flow stability is ${cashFlow.band} at ${cashFlow.score}%`]
        : ["Business fundamentals appear stable"],
    suggestedActions: vote === "reject"
      ? ["Recommend working capital restructuring before fresh lending", "Explore alternate funding through government schemes"]
      : vote === "conditional"
        ? ["Phase disbursement against revenue milestones", "Offer moratorium period on principal repayment"]
        : ["Standard term sheet with competitive pricing", "Cross-sell digital banking and CMS"]
  };
}

export function runComplianceAnalysis(applicationId: string, signals: FinancialSignals): PersonaRecommendation {
  const readiness = calculateAiReadiness(applicationId);
  const fraud = calculateFraudRisk(applicationId, signals);
  const vote = readiness.readyLabel === "blocked"
    ? "reject"
    : readiness.readyLabel === "review-needed" || fraud.band !== "low"
      ? "conditional"
      : "approve";

  const concerns: string[] = [];
  if (readiness.missingDocuments.length > 0) concerns.push(`Missing documents: ${readiness.missingDocuments.join(", ")}`);
  if (readiness.reviewItems.length > 0) concerns.push(`${readiness.reviewItems.length} review items requiring manual attention`);
  if (fraud.band !== "low") concerns.push(`Fraud risk flagged at ${fraud.score}%`);

  return {
    personaId: "compliance",
    label: "Compliance AI",
    recommendation: vote,
    confidence: readiness.readyLabel === "AI-ready" ? 92 : readiness.readyLabel === "review-needed" ? 68 : 45,
    evidence: [
      `AI readiness score: ${readiness.score}% (${readiness.readyLabel})`,
      `Fraud risk score: ${fraud.score}% (${fraud.band})`,
      `Missing documents: ${readiness.missingDocuments.length}`,
      `Review items: ${readiness.reviewItems.length}`
    ],
    keyConcerns: concerns.length > 0 ? concerns : ["All compliance checks passed"],
    suggestedActions: vote === "reject"
      ? ["Collect all outstanding documents before proceeding", "Flag for mandatory compliance review"]
      : vote === "conditional"
        ? ["Resolve review items before disbursement", "Obtain compliance sign-off on flagged items"]
        : ["Clear compliance — no further action required", "Proceed to sanction"]
  };
}

export function computeCommitteeConsensus(
  personas: PersonaRecommendation[],
  application: LoanApplication,
  msme: MsmeProfile,
  signals: FinancialSignals
): CommitteeConsensus {
  const votes = personas.map((p) => p.recommendation);
  const approveCount = votes.filter((v) => v === "approve").length;
  const conditionalCount = votes.filter((v) => v === "conditional").length;
  const rejectCount = votes.filter((v) => v === "reject").length;

  let finalRecommendation: "approve" | "conditional" | "reject";
  if (rejectCount >= 2) finalRecommendation = "reject";
  else if (approveCount >= 2) finalRecommendation = "approve";
  else finalRecommendation = "conditional";

  const avgConfidence = Math.round(personas.reduce((sum, p) => sum + p.confidence, 0) / personas.length);
  const baseRecommendation = createLoanRecommendation(application, msme, signals);
  const allConcerns = personas.flatMap((p) => p.keyConcerns);
  const conditions = [
    ...baseRecommendation.conditions,
    ...allConcerns.slice(0, 3).map((c) => `Address: ${c.toLowerCase()}`)
  ];

  return {
    finalRecommendation,
    confidence: avgConfidence,
    suggestedAmount: baseRecommendation.recommendedAmount,
    suggestedTenureMonths: baseRecommendation.tenureMonths,
    conditions: [...new Set(conditions)],
    voteBreakdown: { approve: approveCount, conditional: conditionalCount, reject: rejectCount },
    generatedAt: new Date().toISOString()
  };
}
