import { documents } from "@/data/mock-data";
import type {
  DecisionAction,
  DocumentRecord,
  DocumentStatus,
  DocumentType,
  FinancialSignals,
  IntelligenceResult,
  LoanApplication,
  LoanRecommendation,
  MsmeProfile,
  OcrStatus,
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

export type AiReadiness = {
  score: number;
  missingDocuments: DocumentType[];
  reviewItems: string[];
  readyLabel: "AI-ready" | "review-needed" | "blocked";
};

export type DocumentIntelligenceItem = {
  type: DocumentType;
  uploadStatus: DocumentStatus;
  ocrStatus: OcrStatus;
  confidence: number;
  validation: DocumentRecord["validationStatus"];
  mismatchWarnings: string[];
  tamperIndicators: string[];
  missingFields: string[];
  extractedFields: Record<string, string>;
  uploadedAt?: string;
};

export type LoanStressInput = {
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  revenueDropPercent: number;
  receivableDelayDays: number;
  seasonalityImpactPercent: number;
};

export type LoanStressResult = {
  emi: number;
  coverageRatio: number;
  dynamicLimit: CreditLimitRange;
  repaymentRisk: IntelligenceResult;
  recommendation: LoanRecommendation;
};

export const requiredDocumentTypes: DocumentType[] = [
  "GST Returns",
  "PAN",
  "Udyam",
  "Bank Statement",
  "ITR",
  "Financial Statement"
];

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

function documentRecordFor(applicationId: string, type: DocumentType): DocumentRecord | undefined {
  return documents.find((document) => document.applicationId === applicationId && document.type === type);
}

function monthlyPayment(principal: number, annualRate: number, tenureMonths: number) {
  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) {
    return Math.round(principal / tenureMonths);
  }

  const factor = (monthlyRate * (1 + monthlyRate) ** tenureMonths) / ((1 + monthlyRate) ** tenureMonths - 1);
  return Math.round(principal * factor);
}

export function getDocumentIntelligence(applicationId: string): DocumentIntelligenceItem[] {
  return requiredDocumentTypes.map((type) => {
    const record = documentRecordFor(applicationId, type);

    if (!record) {
      return {
        type,
        uploadStatus: "missing",
        ocrStatus: "not-started",
        confidence: 0,
        validation: "pending",
        mismatchWarnings: [],
        tamperIndicators: [],
        missingFields: ["Document file"],
        extractedFields: {}
      };
    }

    return {
      type,
      uploadStatus: record.status,
      ocrStatus: record.ocrStatus,
      confidence: record.ocrConfidence,
      validation: record.validationStatus,
      mismatchWarnings: record.mismatchWarnings,
      tamperIndicators: record.tamperIndicators,
      missingFields: record.missingFields,
      extractedFields: record.extractedFields,
      uploadedAt: record.uploadedAt
    };
  });
}

export function calculateAiReadiness(applicationId: string): AiReadiness {
  const review = getDocumentIntelligence(applicationId);
  const missingDocuments = review.filter((item) => item.uploadStatus === "missing").map((item) => item.type);
  const reviewItems = review.flatMap((item) => [
    ...item.mismatchWarnings,
    ...item.tamperIndicators,
    ...item.missingFields.map((field) => `${item.type}: missing ${field}`)
  ]);
  const lowConfidenceCount = review.filter((item) => item.confidence > 0 && item.confidence < 85).length;
  const score = Math.max(25, Math.min(98, 96 - missingDocuments.length * 12 - reviewItems.length * 5 - lowConfidenceCount * 6));
  const readyLabel = missingDocuments.length > 0 ? "blocked" : reviewItems.length > 0 || lowConfidenceCount > 0 ? "review-needed" : "AI-ready";

  return {
    score,
    missingDocuments,
    reviewItems,
    readyLabel
  };
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
  const issues = docs.flatMap((document) => [
    ...document.issues,
    ...document.mismatchWarnings,
    ...document.tamperIndicators
  ]);
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

export function calculateBusinessGrowthForecast(signals: FinancialSignals): IntelligenceResult {
  const revenueTrend = trend(signals.monthlyRevenue);
  const gstTrend = trend(signals.gstTurnover);
  const upiTrend = trend(signals.upiInflow);
  const trendScore = revenueTrend > 0 ? 34 : 14;
  const gstScore = gstTrend > 0 ? 24 : 10;
  const upiScore = upiTrend > 0 ? 18 : 8;
  const concentrationScore = signals.customerConcentrationPercent < 45 ? 16 : 6;
  const stabilityScore = signals.failedTransactions < 8 ? 8 : 3;
  const score = Math.min(100, trendScore + gstScore + upiScore + concentrationScore + stabilityScore);

  return {
    score,
    band: riskBand(score),
    confidence: 80,
    reason: "Business growth forecast is based on revenue direction, GST trend, UPI inflow stability, and concentration risk.",
    positiveFactors: ["Six-month revenue trajectory is improving", "UPI inflows support operating momentum"],
    negativeFactors: signals.customerConcentrationPercent > 35 ? ["Customer concentration should be monitored"] : [],
    uncertainty: "Forecast does not include live bureau, sector, or invoice ageing data in v1.",
    evidence: [
      {
        label: "Revenue movement",
        value: revenueTrend > 0 ? `+INR ${Math.round(revenueTrend).toLocaleString("en-IN")}` : `INR ${Math.round(revenueTrend).toLocaleString("en-IN")}`,
        source: "Alternative data intelligence",
        sentiment: revenueTrend > 0 ? "positive" : "negative"
      },
      {
        label: "GST movement",
        value: gstTrend > 0 ? "Positive filing trend" : "Declining filing trend",
        source: "GST analysis",
        sentiment: gstTrend > 0 ? "positive" : "negative"
      },
      {
        label: "UPI movement",
        value: upiTrend > 0 ? "Stable upward inflows" : "Weakening inflows",
        source: "UPI analysis",
        sentiment: upiTrend > 0 ? "positive" : "negative"
      }
    ]
  };
}

export function calculateCashFlowForecast(signals: FinancialSignals): IntelligenceResult {
  const monthlyRevenue = average(signals.monthlyRevenue);
  const volatility = Math.max(...signals.monthlyRevenue) - Math.min(...signals.monthlyRevenue);
  const volatilityPercent = (volatility / monthlyRevenue) * 100;
  const coverage = monthlyRevenue / Math.max(signals.existingObligations, 1);
  const score = Math.max(0, Math.min(100, 88 - volatilityPercent - signals.failedTransactions * 2 + (coverage > 4 ? 8 : 0)));

  return {
    score,
    band: riskBand(score),
    confidence: 76,
    reason: "Cash-flow forecast weighs monthly inflow consistency, repayment coverage, failed transactions, and volatility.",
    positiveFactors: [`Estimated obligation coverage is ${coverage.toFixed(1)}x`, "Average monthly balance supports near-term liquidity"],
    negativeFactors: volatilityPercent > 15 ? [`Cash-flow volatility is ${Math.round(volatilityPercent)}%`] : [],
    uncertainty: "Receivable ageing and supplier payment delays are simulated in this prototype.",
    evidence: [
      {
        label: "Average monthly inflow",
        value: `INR ${Math.round(monthlyRevenue).toLocaleString("en-IN")}`,
        source: "Cash-flow analysis",
        sentiment: "positive"
      },
      {
        label: "Volatility",
        value: `${Math.round(volatilityPercent)}%`,
        source: "Bank statement summary",
        sentiment: volatilityPercent > 15 ? "negative" : "positive"
      },
      {
        label: "Failed transactions",
        value: `${signals.failedTransactions}`,
        source: "Account conduct",
        sentiment: signals.failedTransactions > 5 ? "negative" : "neutral"
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
  const readiness = calculateAiReadiness(application.id);
  const limit = calculateDynamicCreditLimit(signals);
  const recommendedAmount = Math.min(application.requestedAmount, limit.safeLimit);
  const action =
    readiness.missingDocuments.length > 0
      ? "request-documents"
      : health.band === "critical" || repayment.band === "critical"
        ? "reject"
        : health.band === "low" && repayment.band === "low"
          ? "approve"
          : recommendedAmount < application.requestedAmount
            ? "reduce"
            : "escalate";

  return {
    action,
    recommendedAmount,
    tenureMonths: 36,
    confidence: Math.min(health.confidence, repayment.confidence, readiness.score),
    conditions: [
      "Verify two large bank credits against invoices",
      "Review GST filing continuity before sanction",
      ...readiness.missingDocuments.map((document) => `Collect ${document}`)
    ],
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

export function runLoanStressScenario(
  application: LoanApplication,
  msme: MsmeProfile,
  signals: FinancialSignals,
  stress: LoanStressInput
): LoanStressResult {
  const revenueShock = (stress.revenueDropPercent + stress.seasonalityImpactPercent) / 100;
  const stressedSignals: FinancialSignals = {
    ...signals,
    monthlyRevenue: signals.monthlyRevenue.map((value) => Math.round(value * (1 - revenueShock))),
    gstTurnover: signals.gstTurnover.map((value) => Math.round(value * (1 - stress.revenueDropPercent / 100))),
    existingObligations: signals.existingObligations + stress.receivableDelayDays * 2500
  };
  const emi = monthlyPayment(stress.loanAmount, stress.interestRate, stress.tenureMonths);
  const stressedAverageRevenue = average(stressedSignals.monthlyRevenue);
  const coverageRatio = Number((stressedAverageRevenue / Math.max(stressedSignals.existingObligations + emi, 1)).toFixed(2));
  const dynamicLimit = calculateDynamicCreditLimit(stressedSignals);
  const repaymentRisk = calculateRepaymentRisk(stressedSignals);
  const baseRecommendation = createLoanRecommendation(application, msme, stressedSignals);
  const action: DecisionAction =
    coverageRatio < 1.6
      ? "reject"
      : coverageRatio < 2.2
        ? "escalate"
        : stress.loanAmount > dynamicLimit.safeLimit
          ? "reduce"
          : baseRecommendation.action;

  return {
    emi,
    coverageRatio,
    dynamicLimit,
    repaymentRisk,
    recommendation: {
      ...baseRecommendation,
      action,
      recommendedAmount: Math.min(stress.loanAmount, dynamicLimit.safeLimit),
      tenureMonths: stress.tenureMonths,
      rationale: `Stress scenario coverage is ${coverageRatio}x after revenue, receivable, and seasonality shocks.`
    }
  };
}
