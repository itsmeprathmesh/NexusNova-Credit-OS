import { ShieldCheck } from "lucide-react";
import type { RiskBand } from "@/domain/types";
import { formatCurrency } from "@/lib/format";
import { Badge, Metric, Panel, RiskBadge } from "@/components/ui/primitives";
import type { PortfolioHealth, SectorSummary } from "@/services/portfolio-intelligence";

export function ExecutiveCreditBoard({
  health,
  sectors,
  topWarnings
}: {
  health: PortfolioHealth;
  sectors: SectorSummary[];
  topWarnings: number;
}) {
  const topSector = sectors.toSorted((a, b) => b.totalExposure - a.totalExposure).slice(0, 3);
  const watchlistPercent = health.msmeCount > 0 ? Math.round((health.watchlistCount / health.msmeCount) * 100) : 0;
  const concentrationRisk = sectors.some((s) => s.totalExposure > health.totalExposure * 0.4);

  return (
    <Panel title="Executive Credit Board" className="border-t-4 border-t-trust">
      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-trust" />
            <div>
              <p className="text-lg font-semibold text-ink">Portfolio Status</p>
              <p className="text-sm text-muted">
                {health.band === "low"
                  ? "Portfolio is performing within acceptable risk parameters."
                  : health.band === "medium"
                    ? "Portfolio requires active monitoring. Some sectors need attention."
                    : "Portfolio requires immediate management attention. Elevated risk exposure detected."}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Health Score</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-2xl font-semibold text-ink">{health.overallScore}%</span>
                <RiskBadge band={health.band} />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Watchlist</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{health.watchlistCount}</p>
              <p className="text-xs text-muted">{watchlistPercent}% of portfolio</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Total Exposure</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{formatCurrency(health.totalExposure)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Net Limit Change</p>
              <p className={`mt-1 text-2xl font-semibold ${health.limitExpansionTotal >= health.limitReductionTotal ? "text-growth" : "text-danger"}`}>
                {formatCurrency(health.limitExpansionTotal - health.limitReductionTotal)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Top Sectors by Exposure</p>
            <div className="space-y-2">
              {topSector.map((s) => (
                <div key={s.sector} className="flex items-center justify-between rounded-md border border-line px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ink">{s.sector}</span>
                    <Badge>{s.count}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink">{formatCurrency(s.totalExposure)}</span>
                    <RiskBadge band={s.dominantBand} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Flags</p>
            <div className="mt-2 space-y-1.5 text-sm">
              <Flag label="Concentration risk" active={concentrationRisk} detail="Single sector exceeds 40% of portfolio" />
              <Flag label="Early warnings" active={topWarnings > 0} detail={`${topWarnings} active warnings require review`} />
              <Flag label="Limit contraction" active={health.limitReductionTotal > 0} detail={`${formatCurrency(health.limitReductionTotal)} in limit reductions`} />
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function Flag({ label, active, detail }: { label: string; active: boolean; detail: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className={`mt-1 block h-2 w-2 shrink-0 rounded-full ${active ? "bg-caution" : "bg-growth"}`} />
      <div>
        <span className={`font-medium ${active ? "text-ink" : "text-muted"}`}>{label}</span>
        <span className="ml-2 text-muted">— {detail}</span>
      </div>
    </div>
  );
}
