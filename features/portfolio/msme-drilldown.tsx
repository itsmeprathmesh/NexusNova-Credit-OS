import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Customer360Snapshot, FinancialSignals, LoanApplication, MsmeProfile, PortfolioItem, RiskBand, UserRole } from "@/domain/types";
import { calculateDynamicCreditLimit, calculateFinancialHealth } from "@/services/intelligence";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Panel, RiskBadge } from "@/components/ui/primitives";
import { SimpleLineChart } from "@/components/ui/charts";
import { RelationshipTimeline } from "@/features/loan-workspace/relationship-timeline";
import { CustomerSummary } from "./customer-summary";
import { LoanHistoryTable } from "./loan-history-table";
import { RmNotesPanel } from "./rm-notes-panel";
import { CreditExposurePanel } from "./credit-exposure-panel";

type RiskProgressionItem = {
  month: string;
  score: number;
  band: RiskBand;
  revenue: number;
  reason: string;
};

function computeRiskProgression(signals: FinancialSignals, timelineEvents: { date: string; title: string; summary: string }[]): RiskProgressionItem[] {
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const data = signals.monthlyRevenue;
  const avg = data.reduce((s, v) => s + v, 0) / data.length;
  const result: RiskProgressionItem[] = [];

  for (let i = 0; i < data.length; i++) {
    const revenue = data[i];
    const prevRevenue = i > 0 ? data[i - 1] : revenue;
    const change = ((revenue - prevRevenue) / prevRevenue) * 100;
    let score = 70;
    if (change < -5) score -= 25;
    else if (change < 0) score -= 12;
    else if (change > 5) score += 8;
    if (signals.failedTransactions > 5) score -= 8;
    if (revenue < avg * 0.9) score -= 10;
    score = Math.max(10, Math.min(100, score));

    let band: RiskBand;
    if (score >= 78) band = "low";
    else if (score >= 58) band = "medium";
    else if (score >= 38) band = "high";
    else band = "critical";

    const monthIndex = new Date().getMonth() - (data.length - 1 - i);
    const monthLabel = monthLabels[((monthIndex % 12) + 12) % 12];

    const matchedEvents = timelineEvents.filter((event) => {
      const eventMonth = new Date(event.date).getMonth();
      return eventMonth === ((monthIndex % 12) + 12) % 12;
    });
    const reason = matchedEvents.length > 0
      ? matchedEvents.map((e) => e.title).join("; ")
      : change < -3
        ? `Revenue dropped ${formatPercent(Math.abs(change))} from prior month`
        : change > 3
          ? `Revenue grew ${formatPercent(change)} from prior month`
          : "Revenue stable";

    result.push({
      month: monthLabel,
      score,
      band,
      revenue,
      reason
    });
  }

  return result;
}

export function MsmeDrilldown({
  msme,
  portfolioItem,
  role,
  snapshot,
  signals,
  application
}: {
  msme: MsmeProfile;
  portfolioItem: PortfolioItem;
  role: UserRole;
  snapshot?: Customer360Snapshot;
  signals?: FinancialSignals;
  application?: LoanApplication;
}) {
  if (!signals) {
    return (
      <Panel title={msme.name}>
        <p className="text-sm text-muted">No financial signals are available for this MSME in the v1 data set.</p>
      </Panel>
    );
  }

  const health = calculateFinancialHealth(msme, signals);
  const limit = calculateDynamicCreditLimit(signals);
  const revenueTrend = signals.monthlyRevenue.map((value, index) => ({ month: `M${index + 1}`, revenue: value / 100000 }));

  const activeLoans = snapshot?.loanHistory.filter((loan) => loan.status === "active") ?? [];
  const riskProgression = computeRiskProgression(signals, snapshot?.timeline.map((t) => ({ date: t.date, title: t.title, summary: t.summary })) ?? []);

  return (
    <div className="space-y-6">
      <CustomerSummary msme={msme} portfolioItem={portfolioItem} health={health} />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <Panel
            title="Relationship Timeline"
            action={
              application ? (
                <Link
                  href={`/applications/${application.id}?role=${role}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-trust"
                >
                  Open loan case
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ) : undefined
            }
          >
            <RelationshipTimeline events={snapshot?.timeline ?? []} compact />
          </Panel>

          <CreditExposurePanel activeLoans={activeLoans} msme={msme} />
        </div>

        <div className="space-y-6">
          <Panel title="Risk Timeline">
            <SimpleLineChart data={revenueTrend} xKey="month" yKey="revenue" />
            <p className="mt-2 text-xs text-muted">Monthly revenue trend shown in lakh INR.</p>
            <div className="mt-4 space-y-2">
              {riskProgression.map((item) => (
                <div key={item.month} className="flex items-start gap-3 rounded-lg border border-line p-3">
                  <div className="min-w-[48px] text-center">
                    <p className="text-xs font-semibold uppercase text-muted">{item.month}</p>
                    <RiskBadge band={item.band} className="mt-1" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted">{item.reason}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted">
                      <span>Score: {item.score}</span>
                      <span>Revenue: {formatCurrency(item.revenue)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <LoanHistoryTable
            loans={snapshot?.loanHistory ?? []}
            decisions={snapshot?.previousDecisions ?? []}
          />
        </div>
      </div>

      <RmNotesPanel notes={snapshot?.crmNotes ?? []} />
    </div>
  );
}
