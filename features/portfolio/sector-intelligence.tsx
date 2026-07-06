import { formatCurrency } from "@/lib/format";
import { Badge, Metric, Panel, RiskBadge } from "@/components/ui/primitives";
import type { SectorSummary } from "@/services/portfolio-intelligence";

export function SectorIntelligence({ sectors }: { sectors: SectorSummary[] }) {
  if (sectors.length === 0) {
    return (
      <Panel title="Sector Intelligence">
        <p className="text-sm text-muted">No sector data available for analysis.</p>
      </Panel>
    );
  }

  return (
    <Panel title="Sector Intelligence" action={<Badge tone="info">{sectors.length} sectors</Badge>}>
      <div className="grid gap-4 md:grid-cols-2">
        {sectors.map((sector) => (
          <div key={sector.sector} className="rounded-lg border border-line p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-ink">{sector.sector}</p>
                <p className="text-xs text-muted">{sector.count} MSME{sector.count > 1 ? "s" : ""}</p>
              </div>
              <RiskBadge band={sector.dominantBand} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Metric label="Exposure" value={formatCurrency(sector.totalExposure)} />
              <Metric label="Risk Score" value={`${sector.averageRiskScore}%`} />
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
              <span>
                Limit delta: {sector.limitDeltaTotal >= 0 ? "+" : ""}
                {formatCurrency(sector.limitDeltaTotal)}
              </span>
              <span>Warnings: {sector.earlyWarningCount}</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
