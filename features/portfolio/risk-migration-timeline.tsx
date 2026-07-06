import type { RiskMigrationItem } from "@/services/portfolio-intelligence";
import { Panel, RiskBadge } from "@/components/ui/primitives";
import { PremiumBarChart } from "@/components/charts";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

export function RiskMigrationTimeline({ migration }: { migration: RiskMigrationItem[] }) {
  if (migration.length === 0) {
    return (
      <Panel title="Risk Migration Timeline">
        <p className="text-sm text-muted">No risk migration data available. Add financial signals data to track changes.</p>
      </Panel>
    );
  }

  return (
    <Panel title="Risk Migration Timeline" action={<span className="text-xs text-muted">{migration.length} periods</span>}>
      <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
        <PremiumBarChart
          data={migration.map((m) => ({ period: m.period, Low: m.low, Medium: m.medium, High: m.high, Critical: m.critical }))}
          bars={[
            { dataKey: "Low", label: "Low", color: "#13795b" },
            { dataKey: "Medium", label: "Medium", color: "#e68a2e" },
            { dataKey: "High", label: "High", color: "#d9534f" },
            { dataKey: "Critical", label: "Critical", color: "#9b1c1c" }
          ]}
          xKey="period"
          stacked
          height={200}
        />
        <div className="divide-y divide-line overflow-hidden rounded-lg border border-line">
          {migration.map((item) => {
            const total = item.low + item.medium + item.high + item.critical;
            return (
              <div key={item.period} className="grid grid-cols-[0.8fr_1.2fr_0.6fr] gap-3 px-4 py-3 text-sm items-center">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink">{item.period}</span>
                  <span className="text-xs text-muted">({total})</span>
                </div>
                <div className="flex h-5 overflow-hidden rounded-full bg-slate-100">
                  {(["low", "medium", "high", "critical"] as const).map((band) => {
                    const pct = total > 0 ? (item[band] / total) * 100 : 0;
                    if (pct === 0) return null;
                    const colors: Record<string, string> = { low: "bg-emerald-500", medium: "bg-amber-500", high: "bg-orange-500", critical: "bg-red-600" };
                    return <div key={band} className={`transition-all ${colors[band]}`} style={{ width: `${pct}%` }} title={`${band}: ${item[band]}`} />;
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
