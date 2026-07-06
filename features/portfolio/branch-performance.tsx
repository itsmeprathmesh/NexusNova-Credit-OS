import { formatCurrency, formatPercent } from "@/lib/format";
import { Badge, Panel, ProgressBar, RiskBadge } from "@/components/ui/primitives";
import type { BranchPerformanceMetric } from "@/services/portfolio-intelligence";

export function BranchPerformance({ branches }: { branches: BranchPerformanceMetric[] }) {
  if (branches.length === 0) {
    return (
      <Panel title="Branch Performance">
        <p className="text-sm text-muted">No branch performance data available.</p>
      </Panel>
    );
  }

  return (
    <Panel title="Branch Performance">
      <div className="space-y-4">
        {branches.map((branch) => {
          const limitTone = branch.limitDelta >= 0 ? ("success" as const) : ("danger" as const);
          return (
            <div key={branch.branch} className="rounded-lg border border-line p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-ink">{branch.branch}</p>
                  <p className="text-xs text-muted">
                    {branch.msmeCount} MSME{branch.msmeCount > 1 ? "s" : ""} · {branch.healthyCount} healthy · {branch.watchlistCount} watchlist
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={limitTone}>
                    {branch.limitDelta >= 0 ? "+" : ""}{formatCurrency(branch.limitDelta)}
                  </Badge>
                  <span className="text-sm font-semibold text-ink">{formatCurrency(branch.exposure)}</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {(["low", "medium", "high"] as const).map((band) => {
                  const count = branch.riskDistribution[band] ?? 0;
                  return (
                    <div key={band} className="text-center">
                      <RiskBadge band={band === "high" ? "high" : band === "low" ? "low" : "medium"} />
                      <p className="mt-1 text-lg font-semibold text-ink">{count}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Avg utilization</span>
                  <span>{formatPercent(branch.utilizationPercent)}</span>
                </div>
                <ProgressBar value={branch.utilizationPercent} className="mt-1" />
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
