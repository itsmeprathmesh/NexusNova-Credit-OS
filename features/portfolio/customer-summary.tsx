import type { MsmeProfile, PortfolioItem, IntelligenceResult } from "@/domain/types";
import { formatCurrency } from "@/lib/format";
import { Badge, Metric, Panel, ProgressBar, RiskBadge } from "@/components/ui/primitives";

export function CustomerSummary({
  msme,
  portfolioItem,
  health
}: {
  msme: MsmeProfile;
  portfolioItem: PortfolioItem;
  health: IntelligenceResult;
}) {
  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold">{msme.name}</h2>
              <RiskBadge band={portfolioItem.riskBand} />
              <Badge tone="info">{msme.relationshipYears}y relationship</Badge>
            </div>
            <p className="mt-2 text-sm text-muted">
              {msme.owner} · {msme.sector} · {msme.city} · {msme.branch}
            </p>
            <p className="mt-1 text-sm text-muted">
              Business age {msme.businessAgeYears} years · PAN {msme.pan} · GSTIN {msme.gstin}
            </p>
          </div>
          <Badge tone="neutral">{msme.id}</Badge>
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Panel>
          <Metric label="Current Exposure" value={formatCurrency(portfolioItem.exposure)} />
        </Panel>
        <Panel>
          <Metric label="Financial Health" value={health.score} hint={health.reason} />
          <ProgressBar value={health.score} className="mt-3" />
          <RiskBadge band={health.band} className="mt-2" />
        </Panel>
        <Panel>
          <Metric label="Limit Delta" value={formatCurrency(portfolioItem.dynamicLimitDelta)} />
        </Panel>
        <Panel>
          <Metric label="Active Alerts" value={portfolioItem.earlyWarnings.length} />
        </Panel>
      </div>
    </div>
  );
}
