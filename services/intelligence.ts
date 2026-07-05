import { documents } from "@/data/mock-data";
import type {
  FinancialSignals,
  IntelligenceResult,
  LoanApplication,
  LoanRecommendation,
  MsmeProfile,
  RiskBand
} from "@/domain/types";

export type StressInput = {
  revenueDropPercent: number;
  emiIncreasePercent: number;
  receivableDelayDays: number;
};

export type CreditLimitRange = {
  lowerLimit: number;
  safeLimit: number;
  upperLimit: number;
};

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function trend(values: number[]) {
  return values[values.length - 1] - values[0];
}

function riskBand(score: number): RiskBand {
  if (score >= 78) return "low";
  if (score >= 58) return "medium";
  if (score >= 38) return "high";
  return "critical";
}

export function calculateFinancialHealth(msme: MsmeProfile, signals: FinancialSignals): IntelligenceResult {
  const revenueTrend = trend(signals.monthlyRevenue);
  const gstTrend = trend(signals.gstTurnover);
  const revenueScore = revenueTrend > 0 ? 28 : 14;
  const gstScore = gstTrend > 0 ? 22 : 10;
  const balanceScore = signals.averageMonthlyBalance > signals.existingObligations * 2 ? 22 : 12;
  const concentrationScore = signals.customerConcentrationPercent < 45 ? 18 : 8;
  const ageScore = Math.min(10, msme.businessAgeYears);
  const score = Math.min(100, revenueScore + gstScore + balanceScore + concentrationScore + ageScore);

  return {
    score,
    band: riskBand(score),
    confidence: 86,
    reason: "Financial health is supported by cash-flow stability, GST turnover alignment, and operating history.",
    positiveFactors: [
      "Revenue trend is positive",
      "GST turnover aligns with declared business scale",
      "Business has operating history"
    ],
    negativeFactors: signals.failedTransactions > 5 ? ["Recent failed transactions require review"] : [],
    uncertainty: "Bank statement anomalies should be matched against invoices before final sanction.",
    evidence: [
      {
        label: "Six-month revenue trend",
        value: revenueTrend > 0 ? "Positive" : "Negative",
        source: "Bank statement summary",
        sentiment: revenueTrend > 0 ? "positive" : "negative"
      },
      {
        label: "GST turnover trend",
        value: gstTrend > 0 ? "Improving" : "Declining",
        source: "GST returns",
        sentiment: gstTrend > 0 ? "positive" : "negative"
      },
      {
        label: "Customer concentration",
        value: `${signals.customerConcentrationPercent}%`,
        source: "Alternative data engine",
        sentiment: signals.customerConcentrationPercent < 45 ? "positive" : "negative"
      }
    ]
  };
}

export function calculateRepaymentRisk(signals: FinancialSignals): IntelligenceResult {
  const monthlyRevenue = average(signals.monthlyRevenue);
  const emiCoverage = monthlyRevenue / Math.max(signals.existingObligations, 1);
  const volatility = Math.max(...signals.monthlyRevenue) - Math.min(...signals.monthlyRevenue);
  const volatilityPercent = (volatility / monthlyRevenue) * 100;
  const score = Math.max(0, Math.min(100, 96 - signals.failedTransactions * 2 - volatilityPercent - (emiCoverage < 4 ? 16 : 0)));

  return {
    score,
    band: riskBand(score),
    confidence: 82,
    reason: "Repayment risk reflects EMI coverage, failed transactions, and cash-flow volatility.",
    positiveFactors: [`Estimated EMI coverage is ${emiCoverage.toFixed(1)}x`],
    negativeFactors: signals.failedTransactions > 0 ? [`${signals.failedTransactions} failed transactions in recent bank data`] : [],
    uncertainty: "Receivable ageing is simulated and should be verified with invoice-level data in production.",
    evidence: [
      {
        label: "Average monthly revenue",
        value: `INR ${Math.round(monthlyRevenue).toLocaleString("en-IN")}`,
        source: "Bank statement summary",
        sentiment: "positive"
      },
      {
        label: "Cash-flow volatility",
        value: `${Math.round(volatilityPercent)}%`,
        source: "Cash-flow analysis",
        sentiment: volatilityPercent < 18 ? "positive" : "negative"
      }
    ]
  };
}

export function calculateFraudRisk(applicationId: string, signals: FinancialSignals): IntelligenceResult {
  const docs = documents.filter((document) => document.applicationId === applicationId);
  const issues = docs.flatMap((document) => document.issues);
  const lowConfidenceDocs = docs.filter((document) => document.ocrConfidence < 85);
  const riskScore = Math.min(
    100,
    28 + issues.length * 16 + lowConfidenceDocs.length * 12 + (signals.customerConcentrationPercent > 50 ? 18 : 0)
  );

  return {
    score: riskScore,
    band: riskScore >= 72 ? "high" : riskScore >= 48 ? "medium" : "low",
    confidence: 78,
    reason: "Fraud risk is based on document confidence, mismatch indicators, and transaction pattern anomalies.",
    positiveFactors: ["PAN and GST identifiers are consistent"],
    negativeFactors: issues.length > 0 ? issues : ["No major document mismatch detected"],
    uncertainty: "Invoice-level matching is simulated in v1.",
    evidence: [
      {
        label: "Document review issues",
        value: `${issues.length}`,
        source: "Document intelligence",
        sentiment: issues.length ? "negative" : "positive"
      },
      {
        label: "Low-confidence documents",
        value: `${lowConfidenceDocs.length}`,
        source: "Document OCR",
        sentiment: lowConfidenceDocs.length ? "negative" : "positive"
      }
    ]
  };
}

export function calculateDynamicCreditLimit(signals: FinancialSignals): CreditLimitRange {
  const averageRevenue = average(signals.monthlyRevenue);
  const volatility = Math.max(...signals.monthlyRevenue) - Math.min(...signals.monthlyRevenue);
  const volatilityPenalty = volatility * 0.35;
  const concentrationPenalty = signals.customerConcentrationPercent > 45 ? averageRevenue * 0.12 : 0;
  const safeLimit = Math.max(
    500000,
    Math.round(averageRevenue * 1.8 - volatilityPenalty - concentrationPenalty - signals.existingObligations)
  );

  return {
    safeLimit,
    upperLimit: Math.round(safeLimit * 1.18),
    lowerLimit: Math.round(safeLimit * 0.82)
  };
}

export function createLoanRecommendation(
  application: LoanApplication,
  msme: MsmeProfile,
  signals: FinancialSignals
): LoanRecommendation {
  const health = calculateFinancialHealth(msme, signals);
  const repayment = calculateRepaymentRisk(signals);
  const limit = calculateDynamicCreditLimit(signals);
  const recommendedAmount = Math.min(application.requestedAmount, limit.safeLimit);
  const action = health.band === "low" && repayment.band === "low" ? "approve" : recommendedAmount < application.requestedAmount ? "reduce" : "escalate";

  return {
    action,
    recommendedAmount,
    tenureMonths: 36,
    confidence: Math.min(health.confidence, repayment.confidence),
    conditions: ["Verify two large bank credits against invoices", "Review GST filing continuity before sanction"],
    mitigants: ["Sanction below dynamic credit limit", "Monthly monitoring for first two quarters"],
    rationale: "Recommendation balances positive operating trend with bank statement review items and repayment buffer."
  };
}

export function runStressScenario(signals: FinancialSignals, stress: StressInput): CreditLimitRange {
  const stressedSignals: FinancialSignals = {
    ...signals,
    monthlyRevenue: signals.monthlyRevenue.map((value) => Math.round(value * (1 - stress.revenueDropPercent / 100))),
    existingObligations: Math.round(signals.existingObligations * (1 + stress.emiIncreasePercent / 100) + stress.receivableDelayDays * 2500)
  };

  return calculateDynamicCreditLimit(stressedSignals);
}
