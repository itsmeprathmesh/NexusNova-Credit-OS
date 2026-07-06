import type { FinancialSignals, MsmeProfile, PortfolioItem, RiskBand } from "@/domain/types";
import { calculateDynamicCreditLimit, calculateFinancialHealth, calculateRepaymentRisk } from "./intelligence";

export interface SectorSummary {
  sector: string;
  count: number;
  totalExposure: number;
  averageRiskScore: number;
  dominantBand: RiskBand;
  limitDeltaTotal: number;
  earlyWarningCount: number;
}

export interface BranchSummary {
  branch: string;
  count: number;
  totalExposure: number;
  riskDistribution: Record<RiskBand, number>;
  limitDeltaTotal: number;
}

export interface RiskMigrationItem {
  period: string;
  low: number;
  medium: number;
  high: number;
  critical: number;
  eventCount: number;
}

export interface PortfolioHealth {
  overallScore: number;
  band: RiskBand;
  totalExposure: number;
  watchlistCount: number;
  limitExpansionTotal: number;
  limitReductionTotal: number;
  earlyWarningCount: number;
  msmeCount: number;
}

export interface EarlyWarningItem {
  msmeId: string;
  msmeName: string;
  branch: string;
  sector: string;
  warning: string;
  riskBand: RiskBand;
}

export interface BranchPerformanceMetric {
  branch: string;
  exposure: number;
  msmeCount: number;
  healthyCount: number;
  watchlistCount: number;
  limitDelta: number;
  utilizationPercent: number;
  riskDistribution: Record<RiskBand, number>;
}

function riskScoreValue(band: RiskBand): number {
  if (band === "low") return 85;
  if (band === "medium") return 60;
  if (band === "high") return 35;
  return 15;
}

function bandFromScore(score: number): RiskBand {
  if (score >= 78) return "low";
  if (score >= 58) return "medium";
  if (score >= 38) return "high";
  return "critical";
}

const msmeLookup = new Map<string, MsmeProfile>();

/** Merges portfolio items with MSME profiles and financial signals for unified rendering. */
export function getEnrichedPortfolio(
  msmes: MsmeProfile[],
  portfolio: PortfolioItem[],
  signals: FinancialSignals[]
) {
  msmes.forEach((m) => msmeLookup.set(m.id, m));
  return portfolio.map((item) => {
    const msme = msmeLookup.get(item.msmeId);
    const sig = signals.find((s) => s.msmeId === item.msmeId);
    return { ...item, msme, signals: sig ?? null };
  });
}

/** Aggregates portfolio-level health score, exposure, watchlist, limit movements, and early warnings. */
export function computePortfolioHealth(
  msmes: MsmeProfile[],
  portfolio: PortfolioItem[],
  signals: FinancialSignals[]
): PortfolioHealth {
  let totalScore = 0;
  let count = 0;

  for (const item of portfolio) {
    const msme = msmes.find((m) => m.id === item.msmeId);
    const sig = signals.find((s) => s.msmeId === item.msmeId);
    if (msme && sig) {
      const health = calculateFinancialHealth(msme, sig);
      const repayment = calculateRepaymentRisk(sig);
      totalScore += (health.score + repayment.score) / 2;
      count += 1;
    }
  }

  const avgScore = count > 0 ? Math.round(totalScore / count) : 50;
  const watchlist = portfolio.filter((p) => p.riskBand === "high" || p.riskBand === "critical");
  const expansionTotal = portfolio.filter((p) => p.dynamicLimitDelta > 0).reduce((s, i) => s + i.dynamicLimitDelta, 0);
  const reductionTotal = portfolio.filter((p) => p.dynamicLimitDelta < 0).reduce((s, i) => s + Math.abs(i.dynamicLimitDelta), 0);

  return {
    overallScore: avgScore,
    band: bandFromScore(avgScore),
    totalExposure: portfolio.reduce((s, i) => s + i.exposure, 0),
    watchlistCount: watchlist.length,
    limitExpansionTotal: expansionTotal,
    limitReductionTotal: reductionTotal,
    earlyWarningCount: portfolio.reduce((s, i) => s + i.earlyWarnings.length, 0),
    msmeCount: portfolio.length
  };
}

/** Computes per-sector exposure, risk score, dominant band, limit delta, and early warning count. */
export function computeSectorSummaries(
  msmes: MsmeProfile[],
  portfolio: PortfolioItem[],
  signals: FinancialSignals[]
): SectorSummary[] {
  const sectorGroups = new Map<string, { items: PortfolioItem[]; msmeIds: string[] }>();

  for (const item of portfolio) {
    const msme = msmes.find((m) => m.id === item.msmeId);
    const sector = msme?.sector ?? "Unknown";
    if (!sectorGroups.has(sector)) sectorGroups.set(sector, { items: [], msmeIds: [] });
    sectorGroups.get(sector)!.items.push(item);
    sectorGroups.get(sector)!.msmeIds.push(item.msmeId);
  }

  return Array.from(sectorGroups.entries()).map(([sector, group]) => {
    let scoreSum = 0;
    let scoreCount = 0;
    for (const item of group.items) {
      const sig = signals.find((s) => s.msmeId === item.msmeId);
      if (sig) {
        scoreSum += riskScoreValue(item.riskBand);
        scoreCount += 1;
      }
    }
    const avgScore = scoreCount > 0 ? Math.round(scoreSum / scoreCount) : 50;
    const bandScores = group.items.map((i) => riskScoreValue(i.riskBand));
    const avgBandScore = bandScores.length > 0 ? bandScores.reduce((a, b) => a + b, 0) / bandScores.length : 50;

    return {
      sector,
      count: group.items.length,
      totalExposure: group.items.reduce((s, i) => s + i.exposure, 0),
      averageRiskScore: avgScore,
      dominantBand: bandFromScore(avgBandScore),
      limitDeltaTotal: group.items.reduce((s, i) => s + i.dynamicLimitDelta, 0),
      earlyWarningCount: group.items.reduce((s, i) => s + i.earlyWarnings.length, 0)
    };
  });
}

/** Aggregates branch-level exposure, count, risk distribution, and limit delta. */
export function computeBranchSummaries(
  msmes: MsmeProfile[],
  portfolio: PortfolioItem[]
): BranchSummary[] {
  const branchGroups = new Map<string, { items: PortfolioItem[] }>();

  for (const item of portfolio) {
    const msme = msmes.find((m) => m.id === item.msmeId);
    const branch = msme?.branch ?? "Unknown";
    if (!branchGroups.has(branch)) branchGroups.set(branch, { items: [] });
    branchGroups.get(branch)!.items.push(item);
  }

  return Array.from(branchGroups.entries()).map(([branch, group]) => {
    const dist: Record<RiskBand, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    for (const item of group.items) {
      dist[item.riskBand] += 1;
    }

    return {
      branch,
      count: group.items.length,
      totalExposure: group.items.reduce((s, i) => s + i.exposure, 0),
      riskDistribution: dist,
      limitDeltaTotal: group.items.reduce((s, i) => s + i.dynamicLimitDelta, 0)
    };
  });
}

/** Tracks risk-band transitions month-over-month from revenue volatility, failures, and early warnings. */
export function computeRiskMigration(
  msmes: MsmeProfile[],
  portfolio: PortfolioItem[],
  signals: FinancialSignals[]
): RiskMigrationItem[] {
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const maxPeriods = Math.max(
    ...signals
      .filter((s) => portfolio.some((p) => p.msmeId === s.msmeId))
      .map((s) => s.monthlyRevenue.length),
    6
  );
  const items: RiskMigrationItem[] = [];

  for (let i = 0; i < maxPeriods; i++) {
    let low = 0;
    let medium = 0;
    let high = 0;
    let critical = 0;
    let eventCount = 0;

    for (const item of portfolio) {
      const sig = signals.find((s) => s.msmeId === item.msmeId);
      if (!sig || i >= sig.monthlyRevenue.length) continue;

      const mRev = sig.monthlyRevenue[i];
      const avg = sig.monthlyRevenue.reduce((s, v) => s + v, 0) / sig.monthlyRevenue.length;
      const volatility = Math.max(...sig.monthlyRevenue) - Math.min(...sig.monthlyRevenue);
      let score = 75;
      if (mRev < avg * 0.9) score -= 20;
      if (sig.failedTransactions > 5) score -= 10;
      if (i > 0 && mRev < sig.monthlyRevenue[i - 1]) score -= 8;

      const band = bandFromScore(score);
      if (band === "low") low += 1;
      else if (band === "medium") medium += 1;
      else if (band === "high") high += 1;
      else critical += 1;

      eventCount += item.earlyWarnings.length > 0 && score < 50 ? 1 : 0;
    }

    const monthIndex = new Date().getMonth() - (maxPeriods - 1 - i);
    items.push({
      period: monthLabels[((monthIndex % 12) + 12) % 12],
      low,
      medium,
      high,
      critical,
      eventCount
    });
  }

  return items;
}

/** Flattens portfolio early warnings into a display-friendly item list with MSME and risk-band context. */
export function computeEarlyWarnings(
  msmes: MsmeProfile[],
  portfolio: PortfolioItem[]
): EarlyWarningItem[] {
  const items: EarlyWarningItem[] = [];
  for (const item of portfolio) {
    const msme = msmes.find((m) => m.id === item.msmeId);
    if (!msme) continue;
    for (const warning of item.earlyWarnings) {
      items.push({
        msmeId: item.msmeId,
        msmeName: msme.name,
        branch: msme.branch,
        sector: msme.sector,
        warning,
        riskBand: item.riskBand
      });
    }
  }
  return items;
}

/** Computes per-branch performance metrics including utilization, risk distribution, and watchlist share. */
export function computeBranchPerformance(
  msmes: MsmeProfile[],
  portfolio: PortfolioItem[],
  signals: FinancialSignals[]
): BranchPerformanceMetric[] {
  const branchGroups = new Map<string, BranchPerformanceMetric>();
  const msmeMap = new Map(msmes.map((m) => [m.id, m]));

  for (const item of portfolio) {
    const msme = msmeMap.get(item.msmeId);
    if (!msme) continue;

      if (!branchGroups.has(msme.branch)) {
        branchGroups.set(msme.branch, {
          branch: msme.branch,
          exposure: 0,
          msmeCount: 0,
          healthyCount: 0,
          watchlistCount: 0,
          limitDelta: 0,
          utilizationPercent: 0,
          riskDistribution: { low: 0, medium: 0, high: 0, critical: 0 }
        });
      }

      const group = branchGroups.get(msme.branch)!;
      group.exposure += item.exposure;
      group.msmeCount += 1;
      group.limitDelta += item.dynamicLimitDelta;
      group.riskDistribution[item.riskBand] += 1;

    if (item.riskBand === "low") group.healthyCount += 1;
    if (item.riskBand === "high" || item.riskBand === "critical") group.watchlistCount += 1;

    const sig = signals.find((s) => s.msmeId === item.msmeId);
    if (sig) {
      const limit = calculateDynamicCreditLimit(sig);
      const util = limit.safeLimit > 0 ? Math.round((item.exposure / limit.safeLimit) * 100) : 0;
      group.utilizationPercent = Math.round((group.utilizationPercent * (group.msmeCount - 1) + util) / group.msmeCount);
    }
  }

  return Array.from(branchGroups.values());
}

/** Builds high-level KPI cards (avg exposure, watchlist %, limit trend, diversity) from portfolio data. */
export function computePortfolioAnalytics(
  msmes: MsmeProfile[],
  portfolio: PortfolioItem[]
): { label: string; value: string; hint: string }[] {
  const totalExposure = portfolio.reduce((s, i) => s + i.exposure, 0);
  const avgExposure = totalExposure / portfolio.length;
  const watchlistExposure = portfolio
    .filter((p) => p.riskBand === "high" || p.riskBand === "critical")
    .reduce((s, i) => s + i.exposure, 0);
  const watchlistPercent = totalExposure > 0 ? Math.round((watchlistExposure / totalExposure) * 100) : 0;
  const expandingLimits = portfolio.filter((p) => p.dynamicLimitDelta > 0).length;
  const contractingLimits = portfolio.filter((p) => p.dynamicLimitDelta < 0).length;
  const sectorCount = new Set(msmes.map((m) => m.sector)).size;
  const branchCount = new Set(msmes.map((m) => m.branch)).size;

  return [
    { label: "Average MSME Exposure", value: `₹${(avgExposure / 100000).toFixed(1)}L`, hint: `Across ${portfolio.length} MSMEs` },
    { label: "Watchlist Exposure", value: `${watchlistPercent}%`, hint: `₹${(watchlistExposure / 10000000).toFixed(2)}Cr at risk` },
    { label: "Limit Trend", value: `${expandingLimits} expanding`, hint: `${contractingLimits} contracting` },
    { label: "Portfolio Diversity", value: `${sectorCount} sectors`, hint: `${branchCount} branches` }
  ];
}
