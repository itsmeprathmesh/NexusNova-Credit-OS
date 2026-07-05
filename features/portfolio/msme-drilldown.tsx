import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { applications, financialSignals } from "@/data/mock-data";
import type { MsmeProfile, PortfolioItem, UserRole } from "@/domain/types";
import {
  calculateDynamicCreditLimit,
  calculateFinancialHealth,
  calculateRepaymentRisk
} from "@/services/intelligence";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Badge, Metric, Panel, RiskBadge } from "@/components/ui/primitives";
import { SimpleLineChart } from "@/components/ui/charts";

export function MsmeDrilldown({ msme, portfolioItem, role }: { msme: MsmeProfile; portfolioItem: PortfolioItem; role: UserRole }) {
  const signals = financialSignals.find((item) => item.msmeId === msme.id);
  const application = applications.find((item) => item.msmeId === msme.id);

  if (!signals) {
    return (
      <Panel title={msme.name}>
        <p className="text-sm text-muted">No financial signals are available for this MSME in the v1 data set.</p>
      </Panel>
    );
  }

  const health = calculateFinancialHealth(msme, signals);
  const repayment = calculateRepaymentRisk(signals);
  const limit = calculateDynamicCreditLimit(signals);
  const revenueTrend = signals.monthlyRevenue.map((value, index) => ({ month: `M${index + 1}`, revenue: value / 100000 }));

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold">{msme.name}</h2>
              <RiskBadge band={portfolioItem.riskBand} />
            </div>
            <p className="mt-2 text-sm text-muted">
              {msme.owner} · {msme.sector} · {msme.city} · {msme.branch}
            </p>
            <p className="mt-1 text-sm text-muted">
              Relationship {msme.relationshipYears} years · Business age {msme.businessAgeYears} years
            </p>
          </div>
          {application ? (
            <Link
              href={`/applications/${application.id}?role=${role}`}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-trust px-4 py-2 text-sm font-semibold text-white"
            >
              Open loan case
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-4">
        <Panel>
          <Metric label="Exposure" value={formatCurrency(portfolioItem.exposure)} />
        </Panel>
        <Panel>
          <Metric label="Safe Limit" value={formatCurrency(limit.safeLimit)} />
        </Panel>
        <Panel>
          <Metric label="Limit Delta" value={formatCurrency(portfolioItem.dynamicLimitDelta)} />
        </Panel>
        <Panel>
          <Metric label="Concentration" value={formatPercent(signals.customerConcentrationPercent)} />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Risk Timeline">
          <SimpleLineChart data={revenueTrend} xKey="month" yKey="revenue" />
          <p className="mt-2 text-xs text-muted">Monthly revenue trend shown in lakh INR.</p>
        </Panel>

        <Panel title="Early Warning Explanations">
          <div className="space-y-3">
            {portfolioItem.earlyWarnings.length > 0 ? (
              portfolioItem.earlyWarnings.map((warning) => (
                <div key={warning} className="rounded-lg border border-line p-4">
                  <Badge tone="warning">Watchlist</Badge>
                  <p className="mt-3 font-semibold">{warning}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    This alert is linked to transaction volatility, GST trend, and dynamic limit movement for the monitored
                    account.
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-line p-4">
                <Badge tone="success">Stable</Badge>
                <p className="mt-3 text-sm text-muted">No active early warning signals for this MSME.</p>
              </div>
            )}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Dynamic Limit Movement">
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric label="Lower" value={formatCurrency(limit.lowerLimit)} />
            <Metric label="Safe" value={formatCurrency(limit.safeLimit)} />
            <Metric label="Upper" value={formatCurrency(limit.upperLimit)} />
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            Limit movement reflects observed inflows, monthly volatility, existing obligations, and customer concentration.
          </p>
        </Panel>

        <Panel title="Evidence References">
          <div className="space-y-3">
            {[...health.evidence, ...repayment.evidence].map((item) => (
              <div key={`${item.source}-${item.label}`} className="rounded-lg border border-line p-4">
                <p className="font-semibold">{item.label}</p>
                <p className="mt-1 text-sm text-muted">{item.value}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted">{item.source}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
