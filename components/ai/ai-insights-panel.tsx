"use client";

import { ArrowDown, ArrowUp, Minus, TrendingUp, AlertTriangle, BarChart3, Lightbulb, DollarSign } from "lucide-react";
import type { FinancialSignals, IntelligenceResult } from "@/domain/types";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Panel, ProgressBar, RiskBadge } from "@/components/ui/primitives";

function computeRevenueTrend(signals: FinancialSignals) {
  const revs = signals.monthlyRevenue;
  if (revs.length < 2) return { trend: "stable" as const, pct: 0 };
  const recent = revs.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const prior = revs.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  const pct = prior > 0 ? Math.round(((recent - prior) / prior) * 100) : 0;
  const trend = pct > 5 ? "up" : pct < -5 ? "down" : "stable";
  return { trend, pct };
}

function computeGstAnomalies(signals: FinancialSignals) {
  const discrepancies: { period: string; gst: number; revenue: number; diff: number }[] = [];
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const offset = new Date().getMonth() - (signals.monthlyRevenue.length - 1);
  for (let i = 0; i < signals.monthlyRevenue.length; i++) {
    const rev = signals.monthlyRevenue[i];
    const gst = signals.gstTurnover[i];
    if (rev > 0) {
      const diff = Math.round(Math.abs(gst - rev * 0.9) / rev * 100);
      if (diff > 15) {
        const monthIndex = ((offset + i) % 12 + 12) % 12;
        discrepancies.push({ period: monthLabels[monthIndex], gst, revenue: rev, diff });
      }
    }
  }
  return discrepancies;
}

function computeRiskDrivers(signals: FinancialSignals): { label: string; severity: "low" | "medium" | "high"; detail: string }[] {
  const drivers: { label: string; severity: "low" | "medium" | "high"; detail: string }[] = [];

  if (signals.failedTransactions > 5) {
    drivers.push({ label: "Failed Transactions", severity: "high", detail: `${signals.failedTransactions} failed transactions indicate potential cash flow stress.` });
  } else if (signals.failedTransactions > 2) {
    drivers.push({ label: "Failed Transactions", severity: "medium", detail: `${signals.failedTransactions} failed transactions observed.` });
  }

  if (signals.customerConcentrationPercent > 60) {
    drivers.push({ label: "Concentration Risk", severity: "high", detail: `${signals.customerConcentrationPercent}% revenue from single customer — high dependency risk.` });
  } else if (signals.customerConcentrationPercent > 35) {
    drivers.push({ label: "Concentration Risk", severity: "medium", detail: `${signals.customerConcentrationPercent}% customer concentration warrants monitoring.` });
  }

  if (signals.existingObligations > signals.averageMonthlyBalance * 0.5) {
    drivers.push({ label: "Debt Burden", severity: "high", detail: `Existing obligations (${formatCurrency(signals.existingObligations)}) exceed 50% of avg balance.` });
  } else if (signals.existingObligations > signals.averageMonthlyBalance * 0.3) {
    drivers.push({ label: "Debt Burden", severity: "medium", detail: `Obligations at ${formatCurrency(signals.existingObligations)} relative to balance.` });
  }

  const revenue = signals.monthlyRevenue;
  if (revenue.length >= 3) {
    const volatility = Math.max(...revenue) - Math.min(...revenue);
    const avg = revenue.reduce((a, b) => a + b, 0) / revenue.length;
    if (volatility > avg * 0.4) {
      drivers.push({ label: "Revenue Volatility", severity: "medium", detail: `Monthly revenue varies by >40% — seasonal or cyclical business.` });
    }
  }

  return drivers;
}

function computeCreditOpportunities(signals: FinancialSignals): { label: string; description: string; potential: string }[] {
  const opportunities: { label: string; description: string; potential: string }[] = [];

  const revenue = signals.monthlyRevenue;
  if (revenue.length >= 3) {
    const recent = revenue.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const prior = revenue.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    if (recent > prior * 1.1) {
      opportunities.push({ label: "Growth Trajectory", description: "Revenue is trending upward, indicating capacity for higher credit limits.", potential: "+15-25% limit" });
    }
  }

  if (signals.averageMonthlyBalance > signals.existingObligations * 2) {
    opportunities.push({ label: "Healthy Liquidity", description: "Average balance comfortably covers existing obligations.", potential: "Lower rate eligible" });
  }

  if (signals.customerConcentrationPercent < 30) {
    opportunities.push({ label: "Diversified Revenue", description: "Well-diversified customer base reduces concentration risk.", potential: "Favorable terms" });
  }

  if (signals.failedTransactions === 0) {
    opportunities.push({ label: "Clean Payment History", description: "No failed transactions in the review period.", potential: "Expedited processing" });
  }

  return opportunities;
}

export function AIInsightsPanel({ signals, health }: { signals: FinancialSignals; health?: IntelligenceResult }) {
  const trend = computeRevenueTrend(signals);
  const anomalies = computeGstAnomalies(signals);
  const riskDrivers = computeRiskDrivers(signals);
  const opportunities = computeCreditOpportunities(signals);

  return (
    <Panel title="AI Insights">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-lg border border-line/60 p-4">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                <TrendingUp className="h-3.5 w-3.5" />
                Revenue Trend
              </p>
              {trend.trend === "up" ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-growth">
                  <ArrowUp className="h-3.5 w-3.5" /> {trend.pct}%
                </span>
              ) : trend.trend === "down" ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-danger">
                  <ArrowDown className="h-3.5 w-3.5" /> {trend.pct}%
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-semibold text-muted">
                  <Minus className="h-3.5 w-3.5" /> Stable
                </span>
              )}
            </div>
            <ProgressBar
              value={Math.min(100, Math.round(signals.monthlyRevenue.slice(-1)[0] / 100000))}
              className="mt-3"
            />
            <p className="mt-2 text-xs text-muted">
              QoQ comparison based on last {signals.monthlyRevenue.length} months of data
            </p>
          </div>

          <div className="rounded-lg border border-line/60 p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              <AlertTriangle className="h-3.5 w-3.5" />
              GST Anomalies
            </p>
            {anomalies.length > 0 ? (
              <div className="mt-3 space-y-2">
                {anomalies.slice(0, 3).map((a) => (
                  <div key={a.period} className="flex items-center justify-between text-sm">
                    <span className="text-muted">{a.period}</span>
                    <span className="font-medium text-caution">{a.diff}% deviation</span>
                  </div>
                ))}
                {anomalies.length > 3 && (
                  <p className="text-xs text-muted">+{anomalies.length - 3} more periods with discrepancies</p>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-growth">No significant GST inconsistencies detected.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-line/60 p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              <BarChart3 className="h-3.5 w-3.5" />
              Risk Drivers
            </p>
            {riskDrivers.length > 0 ? (
              <div className="mt-3 space-y-2">
                {riskDrivers.map((driver) => (
                  <div key={driver.label} className="flex items-start gap-2 text-sm">
                    <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${driver.severity === "high" ? "bg-danger" : driver.severity === "medium" ? "bg-caution" : "bg-trust"}`} />
                    <div>
                      <p className="font-medium text-ink">{driver.label}</p>
                      <p className="text-xs text-muted">{driver.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-growth">No significant risk drivers identified.</p>
            )}
          </div>

          <div className="rounded-lg border border-line/60 p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              <Lightbulb className="h-3.5 w-3.5" />
              Credit Opportunities
            </p>
            {opportunities.length > 0 ? (
              <div className="mt-3 space-y-2">
                {opportunities.map((opp) => (
                  <div key={opp.label} className="flex items-start gap-2 text-sm">
                    <DollarSign className="mt-0.5 h-3.5 w-3.5 shrink-0 text-growth" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-ink">{opp.label}</p>
                        <span className="rounded-full bg-growth/10 px-1.5 py-0.5 text-[10px] font-semibold text-growth">{opp.potential}</span>
                      </div>
                      <p className="text-xs text-muted">{opp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">No additional credit opportunities identified at this time.</p>
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
}
