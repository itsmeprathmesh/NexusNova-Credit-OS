import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioItem, RiskBand, UserRole } from "@/domain/types";
import { formatCurrency } from "@/lib/format";
import { Badge, Panel } from "@/components/ui/primitives";

const riskBg: Record<RiskBand, string> = {
  low: "bg-emerald-50 border-emerald-200",
  medium: "bg-amber-50 border-amber-200",
  high: "bg-orange-50 border-orange-200",
  critical: "bg-red-50 border-red-200"
};

const riskText: Record<RiskBand, string> = {
  low: "text-emerald-800",
  medium: "text-amber-800",
  high: "text-orange-800",
  critical: "text-red-800"
};

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
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {enriched.map((item) => (
          <Link
            key={item.msmeId}
            href={`/portfolio/${item.msmeId}?role=${role}`}
            className={`group rounded-lg border-2 p-4 transition hover:shadow-md ${riskBg[item.riskBand]}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={`font-semibold ${riskText[item.riskBand]}`}>{item.name}</p>
                <p className={`mt-1 text-xs opacity-80 ${riskText[item.riskBand]}`}>{item.sector}</p>
              </div>
              <ArrowUpRight className={`h-4 w-4 opacity-0 transition group-hover:opacity-100 ${riskText[item.riskBand]}`} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide ${riskText[item.riskBand]}`}>
                  {item.riskBand} risk
                </p>
                <p className={`mt-1 text-xs ${riskText[item.riskBand]}`}>{item.branch}</p>
              </div>
              <p className={`text-right text-sm font-semibold ${riskText[item.riskBand]}`}>
                {formatCurrency(item.exposure)}
              </p>
            </div>
            {item.earlyWarnings.length > 0 && (
              <div className="mt-3 border-t border-current border-opacity-20 pt-2">
                <p className={`text-xs ${riskText[item.riskBand]}`}>
                  ⚠ {item.earlyWarnings[0]}
                  {item.earlyWarnings.length > 1 && ` +${item.earlyWarnings.length - 1} more`}
                </p>
              </div>
            )}
          </Link>
        ))}
      </div>
    </Panel>
  );
}
