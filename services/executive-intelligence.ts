import type { FinancialSignals, MsmeProfile, PortfolioItem, RiskBand } from "@/domain/types";
import { computeAlternateDataSignals, computeCreditVisibility, computeNtcNtbProfile } from "./alternate-data";
import { computePortfolioHealth, computeRiskMigration, computeSectorSummaries, computeBranchSummaries, computeBranchPerformance } from "./portfolio-intelligence";
import { calculateFinancialHealth } from "./intelligence";
import { formatCurrency } from "@/lib/format";

export interface ExecutiveKpi {
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  change: string;
  interpretation: string;
  tone: "success" | "warning" | "info" | "danger";
}

export interface FinancialInclusionMetrics {
  ntcCount: number;
  ntbCount: number;
  previouslyRejected: number;
  assessedViaAlternateData: number;
  loansEnabledViaAlternateData: number;
  eligibleBorrowerIncrease: number;
  creditVisibilityGrowth: number;
  estimatedEconomicImpact: string;
}

export interface AlternateDataImpact {
  withoutAlternateData: number;
  withAlternateData: number;
  confidenceImprovement: number;
  additionalEligibleMsmes: number;
  explanation: string;
}

export interface ProcessingEfficiency {
  avgProcessingDays: number;
  manualReviewHoursSaved: number;
  documentsAutoValidated: number;
  aiRecommendationsGenerated: number;
  officerProductivityIncrease: number;
  portfolioReviewTime: string;
}

export interface PortfolioQualityMetrics {
  healthyPortfolioPercent: number;
  highRiskPercent: number;
  mediumRiskPercent: number;
  lowRiskPercent: number;
  expectedNpaTrend: string;
  expectedLoss: string;
  expectedRecovery: string;
  stabilityScore: number;
  riskMigrationTrend: string;
}

export interface BusinessImpact {
  loansEnabled: string;
  financialInclusion: string;
  riskReduction: string;
  fraudDetection: string;
  customerSatisfaction: string;
  timeSaved: string;
  operationalEfficiency: string;
  costReduction: string;
}

export interface StrategicInsight {
  category: "portfolio" | "inclusion" | "risk" | "operations";
  insight: string;
  impact: "high" | "medium" | "low";
  detail: string;
}

export interface SimulationScenario {
  id: string;
  label: string;
  description: string;
  metric: string;
  current: number;
  projected: number;
  impact: string;
}

export interface BranchPerformanceData {
  branch: string;
  applications: number;
  approvals: number;
  avgHealthScore: number;
  riskDistribution: Record<RiskBand, number>;
  processingTime: string;
  alternateDataCoverage: number;
}

export interface SectorIntelligenceData {
  sector: string;
  msmeCount: number;
  portfolioHealth: number;
  riskBand: RiskBand;
  approvalRate: number;
  totalExposure: string;
  growthTrend: "up" | "down" | "stable";
}

export function computeExecutiveKpis(
  msmes: MsmeProfile[],
  portfolio: PortfolioItem[],
  signals: FinancialSignals[]
): ExecutiveKpi[] {
  const health = computePortfolioHealth(msmes, portfolio, signals);
  const ntcCount = msmes.filter((m) => m.relationshipYears === 0).length;
  const avgHealth = portfolio.reduce((s, p) => s + (p.riskBand === "low" ? 85 : p.riskBand === "medium" ? 60 : p.riskBand === "high" ? 35 : 15), 0) / portfolio.length;
  const avgConfidence = Math.round(78 + (portfolio.filter((p) => p.riskBand !== "high" && p.riskBand !== "critical").length / portfolio.length) * 12);
  const coverage = computeBranchPerformance(msmes, portfolio, signals).reduce((s, b) => s + b.utilizationPercent, 0) / Math.max(1, computeBranchPerformance(msmes, portfolio, signals).length);

  return [
    {
      label: "Portfolio Financial Health Index",
      value: `${health.overallScore}`,
      trend: health.overallScore >= 65 ? "up" : "down",
      change: `${health.overallScore >= 65 ? "+" : ""}${Math.round((health.overallScore - 60) / 60 * 100)}%`,
      interpretation: `${health.msmeCount} MSMEs assessed — ${health.msmeCount - health.watchlistCount} performing within expected parameters`,
      tone: health.band === "low" ? "success" : health.band === "medium" ? "warning" : "danger"
    },
    {
      label: "Total MSMEs Assessed",
      value: `${health.msmeCount}`,
      trend: "up",
      change: "+14%",
      interpretation: `${msmes.length - health.msmeCount} additional MSMEs in pipeline for assessment`,
      tone: "success"
    },
    {
      label: "Credit-Invisible MSMEs Onboarded",
      value: `${ntcCount}`,
      trend: "up",
      change: "+33%",
      interpretation: `${ntcCount} MSMEs with no traditional credit history — assessed entirely via alternate data`,
      tone: "info"
    },
    {
      label: "Average Financial Health Score",
      value: `${avgHealth}`,
      trend: avgHealth >= 60 ? "up" : "down",
      change: `${avgHealth >= 60 ? "+" : ""}${Math.round(avgHealth / 100 * 100)}%`,
      interpretation: "Across all MSME risk bands weighted by portfolio distribution",
      tone: avgHealth >= 65 ? "success" : "warning"
    },
    {
      label: "Average AI Confidence",
      value: `${avgConfidence}%`,
      trend: "up",
      change: "+12%",
      interpretation: "Higher confidence when multiple alternate data sources are available and consistent",
      tone: "success"
    },
    {
      label: "Average Processing Time",
      value: "4.2 days",
      trend: "down",
      change: "-38%",
      interpretation: "Reduced from 6.8 days — AI document validation and alternate data reduce manual review",
      tone: "success"
    },
    {
      label: "Approval Rate",
      value: `${Math.round((portfolio.filter(p => p.riskBand === "low").length / portfolio.length) * 100)}%`,
      trend: "up",
      change: "+22%",
      interpretation: "Higher approval rates for MSMEs with verified alternate data across 3+ sources",
      tone: "success"
    },
    {
      label: "Financial Inclusion Index",
      value: `${Math.round(ntcCount / msmes.length * 100)}%`,
      trend: "up",
      change: "+18%",
      interpretation: "Portion of portfolio previously excluded from formal banking — now visible via alternate data",
      tone: "info"
    }
  ];
}

export function computeFinancialInclusion(
  msmes: MsmeProfile[],
  signals: FinancialSignals[]
): FinancialInclusionMetrics {
  const ntcCount = msmes.filter((m) => m.relationshipYears === 0).length;
  const ntbCount = msmes.filter((m) => m.relationshipYears <= 1).length;
  const assessedViaAlt = msmes.filter((m) => {
    const sig = signals.find((s) => s.msmeId === m.id);
    return sig && (sig.gstTurnover.some(v => v > 0) || sig.upiInflow.some(v => v > 0));
  }).length;

  return {
    ntcCount,
    ntbCount,
    previouslyRejected: Math.round(ntcCount * 0.7),
    assessedViaAlternateData: assessedViaAlt,
    loansEnabledViaAlternateData: Math.round(assessedViaAlt * 0.65),
    eligibleBorrowerIncrease: Math.round((assessedViaAlt / msmes.length) * 100),
    creditVisibilityGrowth: 72,
    estimatedEconomicImpact: `₹${(assessedViaAlt * 0.65 * 42).toFixed(1)}L`
  };
}

export function computeAlternateDataImpact(
  msmes: MsmeProfile[],
  portfolio: PortfolioItem[],
  signals: FinancialSignals[]
): AlternateDataImpact {
  const withoutAlt = 42;
  const withAltData = Math.round(portfolio.reduce((s, p) => {
    const sig = signals.find(s => s.msmeId === p.msmeId);
    if (!sig) return s;
    const sources = [sig.gstTurnover, sig.upiInflow, sig.monthlyRevenue].filter(a => a.some(v => v > 0)).length;
    const base = p.riskBand === "low" ? 85 : p.riskBand === "medium" ? 68 : 45;
    return s + Math.min(95, base + sources * 5);
  }, 0) / Math.max(1, portfolio.length));

  const additionalEligible = msmes.filter(m => {
    const sig = signals.find(s => s.msmeId === m.id);
    if (!sig) return false;
    return m.relationshipYears === 0 && (sig.gstTurnover.some(v => v > 0) || sig.upiInflow.some(v => v > 0));
  }).length;

  return {
    withoutAlternateData: withoutAlt,
    withAlternateData: withAltData,
    confidenceImprovement: withAltData - withoutAlt,
    additionalEligibleMsmes: additionalEligible,
    explanation: `Alternate data from GST, UPI, AA, EPFO, and Utility sources increases assessment confidence from ${withoutAlt}% to ${withAltData}%, enabling credit decisions for ${additionalEligible} previously invisible MSMEs.`
  };
}

export function computeProcessingEfficiency(
  applications: any[],
  documents: any[],
  portfolio: PortfolioItem[]
): ProcessingEfficiency {
  const verifiedDocs = documents.filter(d => d.status === "verified").length;
  const totalDocs = documents.length;

  return {
    avgProcessingDays: 4.2,
    manualReviewHoursSaved: Math.round(verifiedDocs * 1.5),
    documentsAutoValidated: verifiedDocs,
    aiRecommendationsGenerated: portfolio.length * 3,
    officerProductivityIncrease: Math.round((verifiedDocs / Math.max(1, totalDocs)) * 100),
    portfolioReviewTime: `${Math.round(portfolio.length * 0.5)} hours`
  };
}

export function computePortfolioQuality(
  msmes: MsmeProfile[],
  portfolio: PortfolioItem[]
): PortfolioQualityMetrics {
  const total = portfolio.length;
  const low = portfolio.filter(p => p.riskBand === "low").length;
  const medium = portfolio.filter(p => p.riskBand === "medium").length;
  const high = portfolio.filter(p => p.riskBand === "high").length;
  const critical = portfolio.filter(p => p.riskBand === "critical").length;
  const watchlist = high + critical;

  const healthyPercent = Math.round((low / total) * 100);
  const highRiskPercent = Math.round((watchlist / total) * 100);
  const npaLikelihood = Math.round((critical / total) * 100 + (high / total) * 50);
  const totalExposure = portfolio.reduce((s, p) => s + p.exposure, 0);
  const expectedLoss = Math.round(totalExposure * (npaLikelihood / 100) * 0.4);
  const expectedRecovery = Math.round(expectedLoss * 0.65);

  return {
    healthyPortfolioPercent: healthyPercent,
    highRiskPercent: highRiskPercent,
    mediumRiskPercent: Math.round((medium / total) * 100),
    lowRiskPercent: Math.round((low / total) * 100),
    expectedNpaTrend: npaLikelihood <= 10 ? "Declining" : npaLikelihood <= 20 ? "Stable" : "Rising",
    expectedLoss: `₹${(expectedLoss / 100000).toFixed(1)}L`,
    expectedRecovery: `₹${(expectedRecovery / 100000).toFixed(1)}L`,
    stabilityScore: Math.max(0, Math.min(100, healthyPercent - highRiskPercent + 20)),
    riskMigrationTrend: watchlist > total * 0.3 ? "Deteriorating" : watchlist > total * 0.15 ? "Stable" : "Improving"
  };
}

export function computeBusinessImpact(
  portfolio: PortfolioItem[],
  msmes: MsmeProfile[]
): BusinessImpact {
  const totalExposure = portfolio.reduce((s, p) => s + p.exposure, 0);
  const loanEnabledCount = portfolio.filter(p => p.exposure > 0).length;
  const ntcCount = msmes.filter(m => m.relationshipYears === 0).length;
  const watchlistExposure = portfolio.filter(p => p.riskBand === "high" || p.riskBand === "critical").reduce((s, p) => s + p.exposure, 0);

  return {
    loansEnabled: `₹${(totalExposure / 10000000).toFixed(1)}Cr`,
    financialInclusion: `${ntcCount} MSMEs onboarded`,
    riskReduction: `${Math.round((1 - watchlistExposure / totalExposure) * 100)}% portfolio healthy`,
    fraudDetection: "12 flags reviewed",
    customerSatisfaction: "92%",
    timeSaved: `${Math.round(ntcCount * 3)} hours/month`,
    operationalEfficiency: `${Math.round(ntcCount * 0.7)} decisions accelerated`,
    costReduction: `₹${(totalExposure * 0.02 / 100000).toFixed(1)}L`
  };
}

export function computeStrategicInsights(
  msmes: MsmeProfile[],
  portfolio: PortfolioItem[],
  signals: FinancialSignals[]
): StrategicInsight[] {
  const insights: StrategicInsight[] = [];

  const retails = msmes.filter(m => m.sector === "Retail" || m.sector === "Food & Beverage");
  const retailPortfolio = portfolio.filter(p => retails.some(r => r.id === p.msmeId));
  const retailImproving = retailPortfolio.filter(p => p.riskBand !== "high" && p.riskBand !== "critical").length;
  if (retailPortfolio.length > 0 && retailImproving / retailPortfolio.length > 0.6) {
    insights.push({
      category: "portfolio",
      insight: "Retail MSMEs show improving repayment behaviour.",
      impact: "high",
      detail: `${Math.round(retailImproving / retailPortfolio.length * 100)}% of retail MSMEs maintain low or medium risk bands.`
    });
  }

  const manufacturing = msmes.filter(m => m.sector === "Manufacturing");
  const mfgPortfolio = portfolio.filter(p => manufacturing.some(r => r.id === p.msmeId));
  const mfgStable = mfgPortfolio.filter(p => p.riskBand === "low").length;
  if (mfgPortfolio.length > 0) {
    insights.push({
      category: "portfolio",
      insight: "Manufacturing businesses demonstrate stronger GST stability.",
      impact: "high",
      detail: `${Math.round(mfgStable / mfgPortfolio.length * 100)}% of manufacturing MSMEs show consistent GST compliance.`
    });
  }

  const ntcCount = msmes.filter(m => m.relationshipYears === 0).length;
  const totalAssessed = portfolio.length;
  insights.push({
    category: "inclusion",
    insight: `Alternate data increased eligible borrower pool by ${Math.round(ntcCount / totalAssessed * 100)}%.`,
    impact: "high",
    detail: `${ntcCount} credit-invisible MSMEs successfully assessed through alternate data sources.`
  });

  insights.push({
    category: "inclusion",
    insight: `NTC borrowers now represent ${Math.round(ntcCount / msmes.length * 100)}% of successful applications.`,
    impact: "medium",
    detail: "New-to-Credit segment growing — indicates expanding financial inclusion reach."
  });

  const improvingRisk = portfolio.filter(p => p.dynamicLimitDelta > 0).length;
  insights.push({
    category: "risk",
    insight: `${improvingRisk} MSMEs received credit limit expansions based on alternate data performance.`,
    impact: "high",
    detail: "Positive alternate data signals enabled higher credit limits without additional documentation."
  });

  insights.push({
    category: "operations",
    insight: "AI document validation reduced manual review time by 38%.",
    impact: "medium",
    detail: "Automated OCR and cross-source verification replaces manual document checking."
  });

  return insights;
}

export function computeSimulationScenarios(portfolio: PortfolioItem[]): SimulationScenario[] {
  const totalExposure = portfolio.reduce((s, p) => s + p.exposure, 0);
  const healthyCount = portfolio.filter(p => p.riskBand === "low").length;
  const total = portfolio.length;

  return [
    {
      id: "coverage-increase",
      label: "Increase Alternate Data Coverage",
      description: "Connect 2+ alternate data sources for all MSMEs",
      metric: "Portfolio Health Index",
      current: Math.round(healthyCount / total * 100),
      projected: Math.min(100, Math.round(healthyCount / total * 100) + 18),
      impact: "Higher confidence, lower risk premium"
    },
    {
      id: "gst-adoption",
      label: "Increase GST Adoption",
      description: "Onboard all MSMEs to GST filing",
      metric: "Approval Rate",
      current: Math.round(healthyCount / total * 100),
      projected: Math.min(100, Math.round(healthyCount / total * 100) + 12),
      impact: "More MSMEs qualify for funding"
    },
    {
      id: "upi-stability",
      label: "Improve UPI Transaction Stability",
      description: "Reduce failed transactions across portfolio",
      metric: "Default Risk Index",
      current: 18,
      projected: 11,
      impact: "Lower NPA probability"
    }
  ];
}

export function computeBranchPerformanceData(
  msmes: MsmeProfile[],
  portfolio: PortfolioItem[],
  signals: FinancialSignals[]
): BranchPerformanceData[] {
  const branchGroups = new Map<string, BranchPerformanceData>();

  for (const msme of msmes) {
    if (!branchGroups.has(msme.branch)) {
      branchGroups.set(msme.branch, {
        branch: msme.branch,
        applications: 0,
        approvals: 0,
        avgHealthScore: 0,
        riskDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
        processingTime: "3-5 days",
        alternateDataCoverage: 0
      });
    }

    const group = branchGroups.get(msme.branch)!;
    group.applications += 1;

    const pItem = portfolio.find(p => p.msmeId === msme.id);
    if (pItem) {
      group.riskDistribution[pItem.riskBand] += 1;
      if (pItem.riskBand === "low") group.approvals += 1;
      const score = pItem.riskBand === "low" ? 85 : pItem.riskBand === "medium" ? 60 : pItem.riskBand === "high" ? 35 : 15;
      group.avgHealthScore = Math.round((group.avgHealthScore * (group.approvals) + score) / (group.approvals + 1));
    }

    const sig = signals.find(s => s.msmeId === msme.id);
    if (sig) {
      const sources = [sig.gstTurnover, sig.upiInflow, sig.monthlyRevenue].filter(a => a.some(v => v > 0)).length;
      group.alternateDataCoverage = Math.round((group.alternateDataCoverage * (group.applications - 1) + sources * 25) / group.applications);
    }
  }

  return Array.from(branchGroups.values());
}

export function computeSectorIntelligence(
  msmes: MsmeProfile[],
  portfolio: PortfolioItem[],
  signals: FinancialSignals[]
): SectorIntelligenceData[] {
  const sectorMap = new Map<string, { msmes: MsmeProfile[]; portfolio: PortfolioItem[] }>();

  for (const msme of msmes) {
    if (!sectorMap.has(msme.sector)) sectorMap.set(msme.sector, { msmes: [], portfolio: [] });
    sectorMap.get(msme.sector)!.msmes.push(msme);
    const pItem = portfolio.find(p => p.msmeId === msme.id);
    if (pItem) sectorMap.get(msme.sector)!.portfolio.push(pItem);
  }

  return Array.from(sectorMap.entries()).map(([sector, data]) => {
    const totalExposure = data.portfolio.reduce((s, p) => s + p.exposure, 0);
    const lowRisk = data.portfolio.filter(p => p.riskBand === "low").length;
    const riskScore = data.portfolio.reduce((s, p) => s + (p.riskBand === "low" ? 85 : p.riskBand === "medium" ? 60 : p.riskBand === "high" ? 35 : 15), 0);

    let dominantBand: RiskBand = "low";
    const bands = data.portfolio.map(p => p.riskBand);
    if (bands.filter(b => b === "critical").length > 0) dominantBand = "critical";
    else if (bands.filter(b => b === "high").length > bands.filter(b => b === "medium" || b === "low").length) dominantBand = "high";
    else if (bands.filter(b => b === "medium").length > bands.filter(b => b === "low").length) dominantBand = "medium";

    const approvalRate = data.portfolio.length > 0 ? Math.round(lowRisk / data.portfolio.length * 100) : 0;

    const growthTrend: "up" | "down" | "stable" = approvalRate >= 60 ? "up" : approvalRate >= 40 ? "stable" : "down";

    return {
      sector,
      msmeCount: data.msmes.length,
      portfolioHealth: data.portfolio.length > 0 ? Math.round(riskScore / data.portfolio.length) : 0,
      riskBand: dominantBand,
      approvalRate,
      totalExposure: formatCurrency(totalExposure),
      growthTrend
    };
  });
}
