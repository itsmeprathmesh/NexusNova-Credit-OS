import Link from "next/link";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import type { PortfolioItem, UserRole } from "@/domain/types";
import { formatCurrency } from "@/lib/format";
import { Badge, Panel } from "@/components/ui/primitives";

export function CreditLimitMonitor({
  enriched,
  role
}: {
  enriched: Array<PortfolioItem & { name: string; branch: string }>;
  role: UserRole;
}) {
  const expanding = enriched.filter((item) => item.dynamicLimitDelta > 0);
  const contracting = enriched.filter((item) => item.dynamicLimitDelta < 0);
  const stable = enriched.filter((item) => item.dynamicLimitDelta === 0);

  if (enriched.length === 0) {
    return (
      <Panel title="Dynamic Credit Limit Monitor">
        <p className="text-sm text-muted">No credit limit data available.</p>
      </Panel>
    );
  }

  const limitSegments = [
    { label: "Expanding", count: expanding.length, items: expanding, icon: TrendingUp, tone: "success" as const },
    { label: "Contracting", count: contracting.length, items: contracting, icon: TrendingDown, tone: "danger" as const },
    { label: "Stable", count: stable.length, items: stable, tone: "neutral" as const }
  ].filter((s) => s.count > 0);

  return (
    <Panel title="Dynamic Credit Limit Monitor" action={
      <div className="flex gap-2 text-xs">
        <Badge tone="success">{expanding.length} ↑</Badge>
        <Badge tone="danger">{contracting.length} ↓</Badge>
        <Badge>{stable.length} →</Badge>
      </div>
    }>
      <div className="space-y-4">
        {limitSegments.map((segment) => (
          <div key={segment.label}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{segment.label}</p>
            <div className="space-y-2">
              {segment.items.map((item) => {
                const positive = item.dynamicLimitDelta >= 0;
                const Icon = segment.icon ?? (positive ? TrendingUp : TrendingDown);

                return (
                  <Link
                    key={item.msmeId}
                    href={`/portfolio/${item.msmeId}?role=${role}`}
                    className="flex items-center justify-between gap-4 rounded-lg border border-line p-3 transition hover:border-trust hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={positive ? "h-5 w-5 text-growth" : "h-5 w-5 text-danger"} />
                      <div>
                        <p className="text-sm font-semibold text-ink">{item.name}</p>
                        <p className="text-xs text-muted">{item.branch} · {formatCurrency(item.exposure)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <span className={positive ? "text-sm font-semibold text-growth" : "text-sm font-semibold text-danger"}>
                        {positive ? "+" : ""}{formatCurrency(item.dynamicLimitDelta)}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-trust" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
