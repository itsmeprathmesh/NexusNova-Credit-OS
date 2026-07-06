import type { LoanHistoryRecord, MsmeProfile } from "@/domain/types";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Badge, Metric, Panel } from "@/components/ui/primitives";

function statusTone(status: LoanHistoryRecord["status"]) {
  if (status === "active") return "success" as const;
  if (status === "watchlist") return "warning" as const;
  return "neutral" as const;
}

function simpleEmi(principal: number, tenureMonths: number): number {
  if (tenureMonths <= 0) return 0;
  return Math.round(principal / tenureMonths);
}

export function CreditExposurePanel({
  activeLoans,
  msme
}: {
  activeLoans: LoanHistoryRecord[];
  msme: MsmeProfile;
}) {
  const totalOutstanding = activeLoans.reduce((sum, loan) => sum + loan.outstanding, 0);
  const totalSanctioned = activeLoans.reduce((sum, loan) => sum + loan.sanctionedAmount, 0);
  const utilizationPercent = totalSanctioned > 0 ? (totalOutstanding / totalSanctioned) * 100 : 0;

  if (activeLoans.length === 0) {
    return (
      <Panel title="Existing Credit Exposure">
        <p className="text-sm text-muted">No active credit facilities for this MSME.</p>
      </Panel>
    );
  }

  return (
    <Panel title="Existing Credit Exposure">
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Total Outstanding" value={formatCurrency(totalOutstanding)} />
        <Metric label="Total Sanctioned" value={formatCurrency(totalSanctioned)} />
        <Metric label="Utilization" value={formatPercent(utilizationPercent)} hint={`Across ${activeLoans.length} facility${activeLoans.length > 1 ? "ies" : "y"}`} />
      </div>

      <div className="mt-5 grid gap-3">
        {activeLoans.map((loan) => {
          const emi = simpleEmi(loan.sanctionedAmount, loan.tenureMonths);
          const utilization = loan.sanctionedAmount > 0
            ? Math.round((loan.outstanding / loan.sanctionedAmount) * 100)
            : 0;

          return (
            <div key={loan.id} className="rounded-lg border border-line p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{loan.product}</p>
                    <Badge tone={statusTone(loan.status)}>{loan.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    Since {loan.sanctionedDate} · {loan.tenureMonths} months tenure
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-right sm:min-w-[320px]">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">Sanctioned</p>
                    <p className="mt-1 text-sm font-semibold">{formatCurrency(loan.sanctionedAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">Outstanding</p>
                    <p className="mt-1 text-sm font-semibold">{formatCurrency(loan.outstanding)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">Utilization</p>
                    <p className="mt-1 text-sm font-semibold">{formatPercent(utilization)}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
                <span>Est. EMI: {formatCurrency(emi)}/month</span>
                <span>Relationship: {msme.relationshipYears} years</span>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
