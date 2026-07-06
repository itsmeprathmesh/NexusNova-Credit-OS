import { Panel } from "@/components/ui/primitives";

export function PortfolioAnalytics({
  analytics
}: {
  analytics: { label: string; value: string; hint: string }[];
}) {
  if (analytics.length === 0) {
    return (
      <Panel title="Portfolio Analytics">
        <p className="text-sm text-muted">No analytics data available.</p>
      </Panel>
    );
  }

  return (
    <Panel title="Portfolio Analytics">
      <div className="grid gap-4 sm:grid-cols-2">
        {analytics.map((item) => (
          <div key={item.label} className="rounded-lg border border-line bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-ink">{item.value}</p>
            <p className="mt-1 text-sm text-muted">{item.hint}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
