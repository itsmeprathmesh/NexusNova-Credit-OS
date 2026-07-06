import type { PortfolioItem, UserRole } from "@/domain/types";
import { Badge, Panel } from "@/components/ui/primitives";
import { PortfolioHeatmap } from "@/components/charts";

export function InteractiveRiskHeatmap({
  enriched,
  role
}: {
  enriched: Array<PortfolioItem & { name: string; branch: string; sector: string }>;
  role: UserRole;
}) {
  if (enriched.length === 0) {
    return (
      <Panel title="Risk Heatmap">
        <p className="text-sm text-muted">No portfolio data available to display the risk heatmap.</p>
      </Panel>
    );
  }

  return (
    <Panel title="Interactive Risk Heatmap" action={<Badge tone="info">{enriched.length} MSMEs</Badge>}>
      <PortfolioHeatmap
        items={enriched.map((item) => ({
          id: item.msmeId,
          label: item.name,
          value: item.exposure,
          band: item.riskBand,
          href: `/portfolio/${item.msmeId}?role=${role}`,
          subtitle: `${item.sector} · ${item.branch}${item.earlyWarnings.length > 0 ? ` · ⚠ ${item.earlyWarnings[0]}` : ""}`
        }))}
        columns={3}
      />
    </Panel>
  );
}
