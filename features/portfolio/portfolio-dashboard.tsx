import Link from "next/link";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import { msmes, portfolio } from "@/data/mock-data";
import type { UserRole } from "@/domain/types";
import { formatCurrency } from "@/lib/format";
import { Metric, Panel, RiskBadge } from "@/components/ui/primitives";
import { RiskHeatmap, SimpleBarChart } from "@/components/ui/charts";

function getMsme(msmeId: string) {
  return msmes.find((item) => item.id === msmeId)!;
}

export function PortfolioDashboard({ role }: { role: UserRole }) {
  const enriched = portfolio.map((item) => {
    const msme = getMsme(item.msmeId);
    return { ...item, name: msme.name, branch: msme.branch, sector: msme.sector };
  });
  const totalExposure = portfolio.reduce((sum, item) => sum + item.exposure, 0);
  const exposureBySector = enriched.map((item) => ({ name: item.sector, exposure: item.exposure / 100000 }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Panel>
          <Metric label="Total Exposure" value={formatCurrency(totalExposure)} hint="Monitored MSME portfolio" />
        </Panel>
        <Panel>
          <Metric label="Limit Expansion" value={formatCurrency(650000)} hint="Net dynamic limit increase" />
        </Panel>
        <Panel>
          <Metric label="Early Warnings" value={enriched.flatMap((item) => item.earlyWarnings).length} hint="Active alerts" />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Risk Heatmap">
          <RiskHeatmap items={enriched} />
        </Panel>
        <Panel title="Sector Exposure">
          <SimpleBarChart data={exposureBySector} xKey="name" yKey="exposure" />
          <p className="mt-2 text-xs text-muted">Values shown in lakh INR for dashboard readability.</p>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Early Warning Alerts">
          <div className="space-y-3">
            {enriched.flatMap((item) =>
              item.earlyWarnings.map((warning) => (
                <Link
                  key={`${item.msmeId}-${warning}`}
                  href={`/portfolio/${item.msmeId}?role=${role}`}
                  className="flex items-start justify-between gap-4 rounded-lg border border-line p-4 transition hover:border-trust hover:bg-slate-50"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="mt-1 text-sm text-muted">{warning}</p>
                  </div>
                  <RiskBadge band={item.riskBand} />
                </Link>
              ))
            )}
          </div>
        </Panel>

        <Panel title="Dynamic Credit Limit Changes">
          <div className="space-y-3">
            {enriched.map((item) => {
              const positive = item.dynamicLimitDelta >= 0;
              const Icon = positive ? TrendingUp : TrendingDown;

              return (
                <Link
                  key={item.msmeId}
                  href={`/portfolio/${item.msmeId}?role=${role}`}
                  className="flex items-center justify-between gap-4 rounded-lg border border-line p-4 transition hover:border-trust hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={positive ? "h-5 w-5 text-growth" : "h-5 w-5 text-danger"} />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted">{item.branch}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <p className={positive ? "font-semibold text-growth" : "font-semibold text-danger"}>
                      {positive ? "+" : ""}
                      {formatCurrency(item.dynamicLimitDelta)}
                    </p>
                    <ArrowUpRight className="h-4 w-4 text-trust" />
                  </div>
                </Link>
              );
            })}
          </div>
        </Panel>
      </div>

      <Panel title="Sector And Branch Exposure">
        <div className="overflow-hidden rounded-lg border border-line">
          <div className="grid grid-cols-[1.1fr_1fr_1fr_0.8fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
            <span>MSME</span>
            <span>Sector</span>
            <span>Branch</span>
            <span>Exposure</span>
          </div>
          <div className="divide-y divide-line">
            {enriched.map((item) => (
              <Link
                key={item.msmeId}
                href={`/portfolio/${item.msmeId}?role=${role}`}
                className="grid grid-cols-[1.1fr_1fr_1fr_0.8fr] gap-4 px-4 py-3 text-sm transition hover:bg-slate-50"
              >
                <span className="font-semibold">{item.name}</span>
                <span>{item.sector}</span>
                <span>{item.branch}</span>
                <span>{formatCurrency(item.exposure)}</span>
              </Link>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}
