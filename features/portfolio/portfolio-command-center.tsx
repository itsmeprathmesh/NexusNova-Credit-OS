import { AlertTriangle, BriefcaseBusiness, IndianRupee, TrendingDown, TrendingUp } from "lucide-react";
import type { UserRole } from "@/domain/types";
import { formatCurrency } from "@/lib/format";
import { Badge, Metric, Panel, ProgressBar, RiskBadge } from "@/components/ui/primitives";
import type { PortfolioHealth } from "@/services/portfolio-intelligence";

export function PortfolioCommandCenter({ health, role }: { health: PortfolioHealth; role: UserRole }) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-ink">Portfolio Command Center</h2>
          <p className="text-sm text-muted">{role === "manager" ? "Manager" : "Officer"} view across {health.msmeCount} monitored MSMEs</p>
        </div>
        <Badge tone={health.band === "low" ? "success" : health.band === "medium" ? "warning" : "danger"}>
          Portfolio Health: {health.overallScore}%
        </Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Panel>
          <Metric label="Total Portfolio Exposure" value={formatCurrency(health.totalExposure)} hint={`${health.msmeCount} MSMEs monitored`} />
          <ProgressBar value={Math.min(100, Math.round(health.totalExposure / 200000))} className="mt-3" />
        </Panel>
        <Panel>
          <Metric label="Portfolio Health Score" value={`${health.overallScore}%`} hint={`${health.band} risk band`} />
          <ProgressBar value={health.overallScore} className="mt-3" />
        </Panel>
        <Panel>
          <div className="flex items-start justify-between">
            <Metric label="Watchlist MSMEs" value={health.watchlistCount} hint="High or critical risk" />
            <AlertTriangle className="mt-1 h-5 w-5 text-caution" />
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-muted">Early warnings:</span>
            <Badge tone={health.earlyWarningCount > 0 ? "warning" : "success"}>{health.earlyWarningCount}</Badge>
          </div>
        </Panel>
        <Panel>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">Limit Changes</span>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1 text-growth">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {formatCurrency(health.limitExpansionTotal)}
                </span>
                <span className="text-muted">/</span>
                <span className="flex items-center gap-1 text-danger">
                  <TrendingDown className="h-3.5 w-3.5" />
                  {formatCurrency(health.limitReductionTotal)}
                </span>
              </div>
            </div>
            <RiskBadge band={health.band} />
          </div>
        </Panel>
      </div>
    </div>
  );
}
