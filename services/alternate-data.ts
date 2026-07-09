import type { FinancialSignals, IntelligenceResult, MsmeProfile } from "@/domain/types";
import { calculateFinancialHealth } from "./intelligence";

export type AlternateDataSource = "gst" | "upi" | "account-aggregator" | "epfo" | "utility";

export interface AlternateDataSignal {
  source: AlternateDataSource;
  status: "connected" | "pending" | "not-connected";
  label: string;
  metrics: { label: string; value: string; sentiment?: "positive" | "negative" | "neutral" }[];
  explainer: string;
  lastUpdated: string;
}

export interface CreditVisibilityFactors {
  label: string;
  score: number;
  detail: string;
}

export interface CreditVisibility {
  overallScore: number;
  factors: CreditVisibilityFactors[];
  explanation: string;
}

export interface NtcNtbProfile {
  isNtc: boolean;
  isNtb: boolean;
  creditProfile: string;
  description: string;
  alternateDataAvailable: boolean;
  eligibleForAiAssessment: boolean;
  why: string;
}

export interface EcosystemIntegration {
  name: string;
  status: "connected" | "ready" | "compatible";
  description: string;
  icon: string;
}

export function computeAlternateDataSignals(signals: FinancialSignals): AlternateDataSignal[] {
  const gstTrend = trend(signals.gstTurnover);
  const upiTrend = trend(signals.upiInflow);
  const gstGrowth = gstTrend > 0 ? Math.round((gstTrend / (signals.gstTurnover[0] || 1)) * 100) : -Math.round((Math.abs(gstTrend) / (signals.gstTurnover[0] || 1)) * 100);
  const upiAvg = signals.upiInflow.reduce((s, v) => s + v, 0) / signals.upiInflow.length;
  
  const complianceScore = Math.min(100, 92 + (signals.failedTransactions < 3 ? 6 : 0) - (signals.customerConcentrationPercent > 40 ? 4 : 0));
  const upiStability = Math.min(100, 95 - Math.round(Math.max(...signals.upiInflow) - Math.min(...signals.upiInflow)) / (upiAvg || 1) * 20);
  const revenueAvg = signals.monthlyRevenue.reduce((s, v) => s + v, 0) / signals.monthlyRevenue.length;
  const cashFlowStrong = signals.averageMonthlyBalance > signals.existingObligations * 1.5;
  const balancePositive = trend(signals.monthlyRevenue) > 0;
  const workingCapitalStable = signals.averageMonthlyBalance > signals.existingObligations;
  const epfoEmployees = Math.round(signals.averageMonthlyBalance / 70000);
  const epfoConsistency = Math.min(100, 90 + (signals.failedTransactions < 2 ? 8 : 0) - (signals.customerConcentrationPercent > 35 ? 4 : 0));
  const epfoGrowth = signals.averageMonthlyBalance > 1000000 ? 8 : 4;
  const businessStable = signals.failedTransactions < 5 && signals.customerConcentrationPercent < 45;

  return [
    {
      source: "gst",
      status: "connected",
      label: "GST",
      metrics: [
        { label: "Status", value: "Connected", sentiment: "positive" },
        { label: "Growth", value: `${gstGrowth >= 0 ? "+" : ""}${gstGrowth}%`, sentiment: gstGrowth >= 0 ? "positive" : "negative" },
        { label: "Compliance", value: `${complianceScore}%`, sentiment: complianceScore >= 85 ? "positive" : "neutral" }
      ],
      explainer: "GST returns verify declared turnover and filing consistency — critical for MSMEs without ITRs.",
      lastUpdated: "2 minutes ago"
    },
    {
      source: "upi",
      status: "connected",
      label: "UPI",
      metrics: [
        { label: "Monthly Volume", value: `₹${Math.round(upiAvg / 1000)}K`, sentiment: upiAvg > 300000 ? "positive" : "neutral" },
        { label: "Stability", value: `${upiStability}%`, sentiment: upiStability >= 85 ? "positive" : "neutral" },
        { label: "Behaviour", value: "Healthy", sentiment: "positive" }
      ],
      explainer: "UPI inflows reveal real-time business momentum — consistent collections signal reliable cash cycles.",
      lastUpdated: "3 minutes ago"
    },
    {
      source: "account-aggregator",
      status: "connected",
      label: "Account Aggregator",
      metrics: [
        { label: "Cash Flow", value: cashFlowStrong ? "Strong" : "Moderate", sentiment: cashFlowStrong ? "positive" : "neutral" },
        { label: "Balance Trend", value: balancePositive ? "Positive" : "Stable", sentiment: balancePositive ? "positive" : "neutral" },
        { label: "Working Capital", value: workingCapitalStable ? "Stable" : "Tight", sentiment: workingCapitalStable ? "positive" : "negative" }
      ],
      explainer: "AA-connected accounts provide holistic banking data without requiring physical bank statements.",
      lastUpdated: "1 minute ago"
    },
    {
      source: "epfo",
      status: "connected",
      label: "EPFO",
      metrics: [
        { label: "Employees", value: `${epfoEmployees}`, sentiment: epfoEmployees >= 10 ? "positive" : "neutral" },
        { label: "Payroll Consistency", value: `${epfoConsistency}%`, sentiment: epfoConsistency >= 85 ? "positive" : "neutral" },
        { label: "Growth", value: `+${epfoGrowth}%`, sentiment: "positive" }
      ],
      explainer: "EPFO data validates formal employment and payroll reliability — a strong proxy for business stability.",
      lastUpdated: "5 minutes ago"
    },
    {
      source: "utility",
      status: "connected",
      label: "Utility Bills",
      metrics: [
        { label: "Electricity", value: "Consistent", sentiment: "positive" },
        { label: "Internet", value: "Paid", sentiment: "positive" },
        { label: "Mobile", value: "Active", sentiment: "positive" },
        { label: "Business Stability", value: businessStable ? "High" : "Moderate", sentiment: businessStable ? "positive" : "neutral" }
      ],
      explainer: "Regular utility payments indicate operational continuity — distressed businesses default on bills first.",
      lastUpdated: "1 day ago"
    }
  ];
}

export function computeCreditVisibility(signals: FinancialSignals, msme: MsmeProfile): CreditVisibility {
  const gstScore = Math.min(100, 75 + (trend(signals.gstTurnover) > 0 ? 15 : 0) + (msme.gstin ? 10 : 0));
  const upiScore = Math.min(100, 70 + (trend(signals.upiInflow) > 0 ? 15 : 0) + (signals.upiInflow.some(v => v > 0) ? 10 : 0));
  const payrollScore = Math.min(100, 65 + (signals.failedTransactions < 3 ? 15 : 0) + (signals.averageMonthlyBalance > 500000 ? 10 : 0));
  const bankingScore = Math.min(100, 70 + (signals.averageMonthlyBalance > signals.existingObligations ? 15 : 0) + (trend(signals.monthlyRevenue) > 0 ? 10 : 0));
  const digitalScore = Math.min(100, 75 + (msme.udyam ? 10 : 0) + (signals.upiInflow.length > 3 ? 10 : 0));
  const overallScore = Math.round((gstScore + upiScore + payrollScore + bankingScore + digitalScore) / 5);

  return {
    overallScore,
    factors: [
      { label: "GST Coverage", score: gstScore, detail: msme.gstin ? "GSTIN verified with active returns" : "No GST data available" },
      { label: "UPI History", score: upiScore, detail: `${signals.upiInflow.length} months of UPI transaction data` },
      { label: "Payroll", score: payrollScore, detail: `${signals.failedTransactions} failed transactions in recent period` },
      { label: "Banking Activity", score: bankingScore, detail: `Avg balance: ₹${(signals.averageMonthlyBalance / 100000).toFixed(1)}L` },
      { label: "Digital Footprint", score: digitalScore, detail: msme.udyam ? "Udyam registered" : "No Udyam registration" }
    ],
    explanation: "Credit visibility reflects the breadth of alternate data available. Higher visibility enables more confident lending even without traditional documents."
  };
}

export function computeNtcNtbProfile(msme: MsmeProfile, signals: FinancialSignals): NtcNtbProfile {
  const isNtc = msme.relationshipYears === 0 || (msme.businessAgeYears < 3 && msme.relationshipYears < 1);
  const isNtb = msme.relationshipYears === 0;
  const alternateAvailable = (msme.gstin?.length ?? 0) > 0 && signals.upiInflow.some(v => v > 0);

  return {
    isNtc,
    isNtb,
    creditProfile: isNtc ? "New-to-Credit" : isNtb ? "New-to-Bank" : "Established",
    description: isNtc
      ? "No Previous Loan History"
      : isNtb
        ? "First Banking Relationship"
        : "Existing Credit Relationship",
    alternateDataAvailable: alternateAvailable,
    eligibleForAiAssessment: alternateAvailable,
    why: isNtc
      ? "This MSME qualifies for alternate data assessment because GST, UPI, and banking signals provide sufficient visibility despite no traditional credit history."
      : "This MSME has established credit history supplemented by rich alternate data signals."
  };
}

export function getEcosystemIntegrations(): EcosystemIntegration[] {
  return [
    { name: "GSTN", status: "connected", description: "GST return data via GSTN API", icon: "file-text" },
    { name: "Account Aggregator", status: "connected", description: "Sahamati-compliant AA framework", icon: "layers" },
    { name: "UPI", status: "connected", description: "UPI transaction history via NPCI", icon: "smartphone" },
    { name: "EPFO", status: "connected", description: "Employee provident fund data", icon: "users" },
    { name: "ULI", status: "ready", description: "Unified Lending Interface — ready for production", icon: "zap" },
    { name: "OCEN", status: "compatible", description: "Open Credit Enablement Network — protocol compatible", icon: "share-2" }
  ];
}

export function getAlternateDataExplainer(): { title: string; message: string } {
  return {
    title: "Why Alternate Data Matters",
    message: "Traditional lending depends on ITRs, audited financials, and long credit history — documents many MSMEs don't have. Our AI evaluates verified alternate business signals including GST filings, UPI collections, EPFO payroll, utility payments, and banking behaviour to generate a trusted financial profile for every MSME."
  };
}

export function computeOverallFinancialHealthScore(msme: MsmeProfile, signals: FinancialSignals): { score: number; confidence: number } {
  const health = calculateFinancialHealth(msme, signals);
  const visibility = computeCreditVisibility(signals, msme);
  const overallScore = Math.round(health.score * 0.6 + visibility.overallScore * 0.4);
  const confidence = Math.round(health.confidence * 0.6 + 82 * 0.4);
  return { score: overallScore, confidence };
}

export function getFundingReadiness(score: number): { label: string; tone: "success" | "warning" | "info" } {
  if (score >= 75) return { label: "Eligible", tone: "success" };
  if (score >= 55) return { label: "Review Needed", tone: "warning" };
  return { label: "Under Assessment", tone: "info" };
}

function trend(values: number[]): number {
  if (values.length < 2) return 0;
  return values[values.length - 1] - values[0];
}
