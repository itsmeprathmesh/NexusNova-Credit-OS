"use client";

import { useMemo } from "react";
import { BarChart3, Download, FileText, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { applications, financialSignals, msmes, portfolio } from "@/data/mock-data";
import { computePortfolioHealth, computeSectorSummaries, computeBranchSummaries, computeRiskMigration, computeEarlyWarnings, computePortfolioAnalytics } from "@/services/portfolio-intelligence";
import { formatCurrency } from "@/lib/format";
import { Badge, Metric, Panel, RiskBadge } from "@/components/ui/primitives";
import { PremiumBarChart, PremiumLineChart, DonutChart, ExposureTreemap, RiskMatrix } from "@/components/charts";

const reportMeta: Record<string, { title: string; description: string; category: string }> = {
  "portfolio-health": { title: "Portfolio Health Report", description: "Overall portfolio risk score, exposure, watchlist count, and limit movement across all MSMEs.", category: "portfolio" },
  "sector-analysis": { title: "Sector Intelligence Brief", description: "Sector-wise exposure, dominant risk band, early warning count, and limit delta.", category: "portfolio" },
  "branch-performance": { title: "Branch Performance Review", description: "Per-branch exposure, MSME count, risk distribution, and limit utilization.", category: "portfolio" },
  "risk-migration": { title: "Risk Migration Timeline", description: "Period-over-period movement of MSMEs across risk bands with event counts.", category: "risk" },
  "credit-committee-summary": { title: "Credit Committee Summary", description: "Summary of all AI Credit Committee analyses, persona votes, and consensus outcomes.", category: "credit" },
  "early-warning": { title: "Early Warning Report", description: "Active early warnings across the portfolio with MSME, branch, and sector context.", category: "risk" },
  "limit-utilization": { title: "Credit Limit Utilization", description: "Dynamic credit limit expansion and contraction across the portfolio with utilization rates.", category: "portfolio" },
  "ai-readiness": { title: "AI Readiness Summary", description: "AI readiness scores, blocked applications, and review items across all applications.", category: "compliance" },
  "executive-brief": { title: "Executive Credit Brief", description: "Executive-level summary of portfolio health, committee activity, and key risk metrics.", category: "executive" }
};

const categoryColors: Record<string, string> = {
  portfolio: "border-sky-200 bg-sky-50 text-sky-800",
  credit: "border-emerald-200 bg-emerald-50 text-emerald-700",
  risk: "border-amber-200 bg-amber-50 text-amber-800",
  compliance: "border-purple-200 bg-purple-50 text-purple-800",
  executive: "border-slate-200 bg-slate-50 text-slate-700"
};

export function ReportDetail({ reportId }: { reportId: string }) {
  const meta = reportMeta[reportId];
  const health = useMemo(() => computePortfolioHealth(msmes, portfolio, financialSignals), []);
  const sectors = useMemo(() => computeSectorSummaries(msmes, portfolio, financialSignals), []);
  const branches = useMemo(() => computeBranchSummaries(msmes, portfolio), []);
  const migration = useMemo(() => computeRiskMigration(msmes, portfolio, financialSignals), []);
  const warnings = useMemo(() => computeEarlyWarnings(msmes, portfolio), []);
  const analytics = useMemo(() => computePortfolioAnalytics(msmes, portfolio), []);

  const sectorChartData = sectors.map((s) => ({ sector: s.sector, exposure: Math.round(s.totalExposure / 100000) }));
  const branchChartData = branches.map((b) => ({ branch: b.branch, exposure: Math.round(b.totalExposure / 100000) }));
  const riskDistData = [
    { band: "Low", count: portfolio.filter((p) => p.riskBand === "low").length },
    { band: "Medium", count: portfolio.filter((p) => p.riskBand === "medium").length },
    { band: "High", count: portfolio.filter((p) => p.riskBand === "high").length },
    { band: "Critical", count: portfolio.filter((p) => p.riskBand === "critical").length }
  ];

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-trust" />
              <p className="text-sm font-semibold uppercase tracking-wide text-muted">{meta.category} Report</p>
            </div>
            <h2 className="mt-1 text-2xl font-semibold">{meta.title}</h2>
            <p className="mt-2 text-sm text-muted">{meta.description}</p>
          </div>
          <Badge className={categoryColors[meta.category]}>{meta.category}</Badge>
        </div>
      </Panel>

      {(reportId === "portfolio-health" || reportId === "executive-brief") && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Panel><Metric label="Portfolio Score" value={health.overallScore} /><RiskBadge band={health.band} className="mt-3" /></Panel>
            <Panel><Metric label="Total Exposure" value={formatCurrency(health.totalExposure)} hint={`${health.msmeCount} MSMEs`} /></Panel>
            <Panel><Metric label="Watchlist" value={health.watchlistCount} hint={`${health.earlyWarningCount} warnings`} /></Panel>
            <Panel><Metric label="Limit Movement" value={`${formatCurrency(health.limitExpansionTotal)} / ${formatCurrency(health.limitReductionTotal)}`} hint="Expansion / Reduction" /></Panel>
          </div>
          <Panel title="Risk Distribution">
            <div className="flex gap-6">
              <div className="w-48">
                <DonutChart data={riskDistData.map((d) => ({ name: d.band, value: d.count }))} height={180} innerRadius={36} outerRadius={70} centerLabel={`${portfolio.length}`} />
              </div>
              <div className="flex-1">
                <PremiumBarChart data={riskDistData} bars={[{ dataKey: "count", label: "Count" }]} xKey="band" height={180} />
              </div>
            </div>
          </Panel>
        </>
      )}

      {reportId === "sector-analysis" && (
        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="Sector Exposure">
            <PremiumBarChart data={sectorChartData} bars={[{ dataKey: "exposure", label: "Exposure" }]} xKey="sector" height={256} />
            <div className="mt-4 space-y-2">
              {sectors.map((s) => (
                <div key={s.sector} className="flex items-center justify-between rounded-lg border border-line p-3">
                  <div>
                    <p className="font-semibold">{s.sector}</p>
                    <p className="text-xs text-muted">{s.count} MSMEs · {s.earlyWarningCount} warnings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(s.totalExposure)}</p>
                    <RiskBadge band={s.dominantBand} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Sector Exposure Treemap">
            <ExposureTreemap items={sectors.map((s) => ({ id: s.sector, label: s.sector, value: s.totalExposure, band: s.dominantBand, subtitle: `${s.count} MSMEs` }))} />
          </Panel>
        </div>
      )}

      {reportId === "branch-performance" && (
        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="Branch Performance">
            <PremiumBarChart data={branchChartData} bars={[{ dataKey: "exposure", label: "Exposure" }]} xKey="branch" height={256} />
            <div className="mt-4 space-y-2">
              {branches.map((b) => (
                <div key={b.branch} className="flex items-center justify-between rounded-lg border border-line p-3">
                  <div>
                    <p className="font-semibold">{b.branch}</p>
                    <p className="text-xs text-muted">{b.count} MSMEs</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(b.totalExposure)}</p>
                    <p className="text-xs text-muted">Risk bands: {Object.entries(b.riskDistribution).filter(([, v]) => v > 0).map(([k, v]) => `${k}:${v}`).join(" · ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <RiskMatrix
            items={branches.flatMap((b) =>
              Object.entries(b.riskDistribution)
                .filter(([, v]) => v > 0)
                .map(([band, count]) => ({
                  id: `${b.branch}-${band}`,
                  label: b.branch,
                  likelihood: band === "critical" ? "high" : band === "high" ? "high" : band === "medium" ? "medium" : "low",
                  impact: band === "critical" || band === "high" ? "high" : band === "medium" ? "medium" : "low",
                  detail: `${count} MSMEs in ${band} risk`
                }))
            )}
          />
        </div>
      )}

      {reportId === "risk-migration" && (
        <Panel title="Risk Migration Over Time">
          <PremiumLineChart
            data={migration.map((m) => ({ period: m.period, Low: m.low, Medium: m.medium, High: m.high, Critical: m.critical }))}
            lines={[
              { dataKey: "Low", label: "Low", color: "#13795b" },
              { dataKey: "Medium", label: "Medium", color: "#e68a2e" },
              { dataKey: "High", label: "High", color: "#d9534f" },
              { dataKey: "Critical", label: "Critical", color: "#9b1c1c" }
            ]}
            xKey="period"
            height={200}
            showArea={false}
          />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {migration.map((m) => (
              <div key={m.period} className="rounded-lg border border-line p-3">
                <p className="font-semibold">{m.period}</p>
                <div className="mt-2 grid grid-cols-4 gap-2 text-xs text-center">
                  <div><p className="font-semibold text-growth">{m.low}</p><p className="text-muted">Low</p></div>
                  <div><p className="font-semibold text-caution">{m.medium}</p><p className="text-muted">Med</p></div>
                  <div><p className="font-semibold text-danger">{m.high}</p><p className="text-muted">High</p></div>
                  <div><p className="font-semibold text-danger">{m.critical}</p><p className="text-muted">Crit</p></div>
                </div>
                <p className="mt-2 text-xs text-muted">{m.eventCount} warning events</p>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {reportId === "early-warning" && (
        <Panel title="Active Early Warnings">
          <div className="space-y-2">
            {warnings.length === 0 && <p className="text-sm text-muted">No active early warnings across the portfolio.</p>}
            {warnings.slice(0, 15).map((w) => (
              <div key={`${w.msmeId}-${w.warning}`} className="flex items-center justify-between rounded-lg border border-line p-3">
                <div>
                  <p className="font-semibold">{w.msmeName}</p>
                  <p className="text-xs text-muted">{w.branch} · {w.sector}</p>
                  <p className="mt-1 text-sm text-caution">{w.warning}</p>
                </div>
                <RiskBadge band={w.riskBand} />
              </div>
            ))}
          </div>
        </Panel>
      )}

      {(reportId === "limit-utilization" || reportId === "credit-committee-summary" || reportId === "ai-readiness") && (
        <Panel title="Summary">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {analytics.map((a) => (
              <div key={a.label} className="rounded-lg border border-line p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{a.label}</p>
                <p className="mt-2 text-lg font-semibold">{a.value}</p>
                <p className="mt-1 text-xs text-muted">{a.hint}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <Panel title="Export Report">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => alert(`[NexusNova] ${meta.title} export initiated as PDF.`)}
            className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-trust transition hover:bg-trust hover:text-white"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
          <button
            type="button"
            onClick={() => alert(`[NexusNova] ${meta.title} export initiated as CSV.`)}
            className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-trust transition hover:bg-trust hover:text-white"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </button>
        </div>
      </Panel>
    </div>
  );
}
