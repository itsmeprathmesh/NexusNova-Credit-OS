"use client";

import { useMemo } from "react";
import { AlertTriangle, BarChart3, ShieldCheck, TrendingUp } from "lucide-react";
import { applications, financialSignals, msmes, portfolio } from "@/data/mock-data";
import { computePortfolioHealth, computeSectorSummaries, computeBranchSummaries, getEnrichedPortfolio } from "@/services/portfolio-intelligence";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Badge, Metric, Panel, ProgressBar, RiskBadge } from "@/components/ui/primitives";
import { PremiumBarChart, PremiumLineChart, DonutChart, SectorComparisonChart, ExposureTreemap } from "@/components/charts";

export function ExecutiveDashboard() {
  const enriched = useMemo(() => getEnrichedPortfolio(msmes, portfolio, financialSignals), []);
  const health = useMemo(() => computePortfolioHealth(msmes, portfolio, financialSignals), []);
  const sectors = useMemo(() => computeSectorSummaries(msmes, portfolio, financialSignals), []);
  const branches = useMemo(() => computeBranchSummaries(msmes, portfolio), []);
  const activeApps = applications.filter((a) => a.status === "new" || a.status === "in-review");
  const committeeReady = applications.filter((a) => a.status !== "approved" && a.status !== "rejected").length;

  const sectorChartData = sectors.map((s) => ({ sector: s.sector, exposure: Math.round(s.totalExposure / 100000), msmes: s.count }));
  const branchChartData = branches.map((b) => ({ branch: b.branch, exposure: Math.round(b.totalExposure / 100000) }));
  const riskDistData = [
    { band: "Low", count: enriched.filter((e) => e.riskBand === "low").length },
    { band: "Medium", count: enriched.filter((e) => e.riskBand === "medium").length },
    { band: "High", count: enriched.filter((e) => e.riskBand === "high").length },
    { band: "Critical", count: enriched.filter((e) => e.riskBand === "critical").length }
  ];
  const donutData = riskDistData.map((d) => ({ name: d.band, value: d.count }));

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-trust" />
              <p className="text-sm font-semibold uppercase tracking-wide text-muted">Executive Overview</p>
            </div>
            <h2 className="mt-1 text-2xl font-semibold">Executive Credit Dashboard</h2>
            <p className="mt-2 text-sm text-muted">
              Portfolio of {health.msmeCount} MSMEs across {sectors.length} sectors and {branches.length} branches
            </p>
          </div>
          <RiskBadge band={health.band} />
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Panel>
          <Metric label="Portfolio Health Score" value={health.overallScore} />
          <ProgressBar value={health.overallScore} className="mt-4" />
          <RiskBadge band={health.band} className="mt-3" />
        </Panel>
        <Panel>
          <Metric label="Total Exposure" value={formatCurrency(health.totalExposure)} hint={`Across ${health.msmeCount} MSMEs`} />
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-growth" />
            <span className="text-xs text-muted">Limit expansion: {formatCurrency(health.limitExpansionTotal)}</span>
          </div>
        </Panel>
        <Panel>
          <Metric label="Watchlist" value={health.watchlistCount} hint={`Of ${health.msmeCount} MSMEs monitored`} />
          <div className="mt-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-caution" />
            <span className="text-xs text-muted">{health.earlyWarningCount} active warnings</span>
          </div>
        </Panel>
        <Panel>
          <Metric label="Pipeline Activity" value={activeApps.length} hint={`${committeeReady} awaiting committee`} />
          <div className="mt-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-trust" />
            <span className="text-xs text-muted">{health.msmeCount - health.watchlistCount} healthy MSMEs</span>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Risk Distribution">
          <div className="grid grid-cols-4 gap-3">
            {riskDistData.map((item) => (
              <div key={item.band} className="rounded-lg border border-line p-3 text-center">
                <p className="text-2xl font-semibold">{item.count}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">{item.band}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 h-40">
            <DonutChart data={donutData} height={160} innerRadius={40} outerRadius={65} centerLabel={`${enriched.length}`} />
          </div>
        </Panel>

        <Panel title="Sector Exposure">
          <div className="h-48">
            <SectorComparisonChart data={sectors.map((s) => ({ sector: s.sector, exposure: Math.round(s.totalExposure / 100000), count: s.count, avgScore: s.averageRiskScore }))} />
          </div>
          <div className="mt-4 space-y-2">
            {sectors.slice(0, 4).map((s) => (
              <div key={s.sector} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{s.sector}</span>
                  <Badge tone={s.dominantBand === "low" ? "success" : s.dominantBand === "medium" ? "warning" : "danger"}>{s.dominantBand}</Badge>
                </div>
                <span className="text-muted">{formatCurrency(s.totalExposure)}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Sector Exposure Treemap">
          <ExposureTreemap
            items={sectors.map((s) => ({ id: s.sector, label: s.sector, value: s.totalExposure, band: s.dominantBand, subtitle: `${s.count} MSMEs` }))}
            maxHeight={320}
          />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Branch Performance">
          <div className="h-48">
            <PremiumBarChart data={branchChartData} bars={[{ dataKey: "exposure", label: "Exposure" }]} xKey="branch" height={192} />
          </div>
          <div className="mt-4 space-y-2">
            {branches.slice(0, 4).map((b) => (
              <div key={b.branch} className="flex items-center justify-between text-sm">
                <span className="font-medium">{b.branch}</span>
                <span className="text-muted">{b.count} MSMEs · {formatCurrency(b.totalExposure)}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Portfolio Activity Summary">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-line p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Limit Expansion</p>
              <p className="mt-2 text-xl font-semibold text-growth">{formatCurrency(health.limitExpansionTotal)}</p>
              <p className="mt-1 text-xs text-muted">Credit limit increases</p>
            </div>
            <div className="rounded-lg border border-line p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Limit Reduction</p>
              <p className="mt-2 text-xl font-semibold text-danger">{formatCurrency(health.limitReductionTotal)}</p>
              <p className="mt-1 text-xs text-muted">Credit limit decreases</p>
            </div>
            <div className="rounded-lg border border-line p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Early Warnings</p>
              <p className="mt-2 text-xl font-semibold text-caution">{health.earlyWarningCount}</p>
              <p className="mt-1 text-xs text-muted">Active across portfolio</p>
            </div>
            <div className="rounded-lg border border-line p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Committee Pipeline</p>
              <p className="mt-2 text-xl font-semibold text-trust">{committeeReady}</p>
              <p className="mt-1 text-xs text-muted">Awaiting review</p>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Export This Dashboard">
        <div className="flex flex-wrap gap-3">
          {["Download as PDF", "Download as CSV", "Print View"].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => alert(`[NexusNova] ${label} initiated. In production, this would download the file.`)}
              className="rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-trust transition hover:bg-trust hover:text-white"
            >
              {label}
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
}
