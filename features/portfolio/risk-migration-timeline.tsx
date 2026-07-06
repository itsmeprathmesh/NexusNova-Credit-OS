import type { RiskMigrationItem } from "@/services/portfolio-intelligence";
import { Panel, RiskBadge } from "@/components/ui/primitives";

const barColors: Record<string, string> = {
  low: "bg-emerald-500",
  medium: "bg-amber-500",
  high: "bg-orange-500",
  critical: "bg-red-500"
};

export function RiskMigrationTimeline({ migration }: { migration: RiskMigrationItem[] }) {
  if (migration.length === 0) {
    return (
      <Panel title="Risk Migration Timeline">
        <p className="text-sm text-muted">No risk migration data available. Add financial signals data to track changes.</p>
      </Panel>
    );
  }

  const totalPerPeriod = migration.map((m) => m.low + m.medium + m.high + m.critical);
  const maxTotal = Math.max(...totalPerPeriod, 1);

  return (
    <Panel title="Risk Migration Timeline" action={<span className="text-xs text-muted">{migration.length} periods</span>}>
      <div className="overflow-hidden rounded-lg border border-line">
        <div className="hidden grid-cols-[0.8fr_1fr_0.6fr] gap-2 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted lg:grid">
          <span>Period</span>
          <span>Distribution</span>
          <span>Events</span>
        </div>
        <div className="divide-y divide-line">
          {migration.map((item) => {
            const total = item.low + item.medium + item.high + item.critical;
            const pct = (value: number) => (total > 0 ? (value / total) * 100 : 0);

            return (
              <div key={item.period} className="grid gap-3 px-4 py-3 text-sm lg:grid-cols-[0.8fr_1fr_0.6fr] lg:items-center">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink">{item.period}</span>
                  <span className="text-xs text-muted">({total})</span>
                </div>
                <div className="flex h-5 overflow-hidden rounded-full bg-slate-100">
                  {(["low", "medium", "high", "critical"] as const).map((band) => {
                    const width = pct(item[band]);
                    if (width === 0) return null;
                    return (
                      <div
                        key={band}
                        className={`transition-all ${barColors[band]}`}
                        style={{ width: `${width}%` }}
                        title={`${band}: ${item[band]}`}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  {item.eventCount > 0 ? (
                    <RiskBadge band={item.eventCount > 2 ? "high" : "medium"} />
                  ) : (
                    <span className="text-xs text-muted">0</span>
                  )}
                  <span className="text-xs text-muted">{item.eventCount > 0 ? `${item.eventCount}` : ""}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}
