import type { FinancialSignals, IntelligenceResult } from "@/domain/types";
import { formatPercent } from "@/lib/format";
import { Metric, Panel, ProgressBar, RiskBadge } from "@/components/ui/primitives";
import { PremiumLineChart } from "@/components/charts";

function projectedCashFlow(signals: FinancialSignals) {
  const data = signals.monthlyRevenue;
  const avg = data.reduce((s, v) => s + v, 0) / data.length;
  const growthRate = data.length > 1 ? (data[data.length - 1] - data[0]) / data[0] : 0;
  const projected = [];
  for (let i = 0; i < 3; i++) {
    const nextValue = Math.round(avg * (1 + growthRate * (i + 2)));
    projected.push({ month: `Proj ${i + 1}`, revenue: nextValue / 100000 });
  }
  return projected;
}

export function BusinessForecastPanel({
  signals,
  growth,
  cashFlow
}: {
  signals: FinancialSignals;
  growth: IntelligenceResult;
  cashFlow: IntelligenceResult;
}) {
  const historical = signals.monthlyRevenue.map((value, index) => ({
    month: `M${index + 1}`,
    revenue: value / 100000
  }));
  const projected = projectedCashFlow(signals);
  const chartData = [...historical, ...projected];

  return (
    <Panel title="Business & Cash Flow Forecast">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Business Growth</p>
          <div className="grid grid-cols-3 gap-3">
            <Metric label="Growth Score" value={growth.score} />
            <Metric label="Confidence" value={`${growth.confidence}%`} />
            <Metric label="Outlook" value={<RiskBadge band={growth.band} />} />
          </div>
          <div>
            <ProgressBar value={growth.score} className="mt-1" />
            <p className="mt-2 text-sm text-muted">{growth.reason}</p>
          </div>
          {growth.positiveFactors.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Key drivers</p>
              <ul className="space-y-1">
                {growth.positiveFactors.map((factor) => (
                  <li key={factor} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-growth" />
                    <span className="text-muted">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Cash Flow Stability</p>
          <div className="grid grid-cols-3 gap-3">
            <Metric label="Stability" value={cashFlow.score} />
            <Metric label="Volatility" value={formatPercent(cashFlow.negativeFactors.find((f) => f.includes("volatility")) ? 18 : signals.monthlyRevenue.reduce((max, v) => Math.max(max, v), 0) > 0 ? Math.round((Math.max(...signals.monthlyRevenue) - Math.min(...signals.monthlyRevenue)) / (signals.monthlyRevenue.reduce((s, v) => s + v, 0) / signals.monthlyRevenue.length) * 100) : 0)} />
            <Metric label="Confidence" value={`${cashFlow.confidence}%`} />
          </div>
          <p className="mb-2 text-sm text-muted">{cashFlow.reason}</p>
          <PremiumLineChart data={chartData} lines={[{ dataKey: "revenue", label: "Revenue" }]} xKey="month" showArea />
          <p className="text-xs text-muted">Actual (M1–M6) and projected cash flow in lakh INR.</p>
        </div>
      </div>
    </Panel>
  );
}
