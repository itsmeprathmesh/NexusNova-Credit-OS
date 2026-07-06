import type { LoanHistoryRecord, PreviousCreditDecision } from "@/domain/types";
import { formatCurrency } from "@/lib/format";
import { Badge, Panel } from "@/components/ui/primitives";

function statusTone(status: LoanHistoryRecord["status"]) {
  if (status === "active") return "success" as const;
  if (status === "watchlist") return "warning" as const;
  return "neutral" as const;
}

function decisionTone(
  action: PreviousCreditDecision["action"]
) {
  if (action === "approve") return "success" as const;
  if (action === "reduce") return "warning" as const;
  if (action === "reject") return "danger" as const;
  return "info" as const;
}

export function LoanHistoryTable({
  loans,
  decisions
}: {
  loans: LoanHistoryRecord[];
  decisions: PreviousCreditDecision[];
}) {
  if (loans.length === 0 && decisions.length === 0) {
    return (
      <Panel title="Previous Loan History">
        <p className="text-sm text-muted">No loan history available for this MSME.</p>
      </Panel>
    );
  }

  return (
    <Panel title="Previous Loan History">
      {loans.length > 0 && (
        <div className="mb-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Sanctioned facilities</p>
          <div className="overflow-hidden rounded-lg border border-line">
            <div className="hidden grid-cols-[1.2fr_0.8fr_0.8fr_0.6fr_0.6fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted lg:grid">
              <span>Product</span>
              <span>Sanctioned</span>
              <span>Outstanding</span>
              <span>Status</span>
              <span>Tenure</span>
            </div>
            <div className="divide-y divide-line">
              {loans.map((loan) => (
                <div
                  key={loan.id}
                  className="grid gap-3 px-4 py-3 text-sm lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.6fr_0.6fr] lg:items-center"
                >
                  <div>
                    <p className="font-semibold">{loan.product}</p>
                    <p className="text-xs text-muted">{loan.sanctionedDate}</p>
                  </div>
                  <p className="font-semibold">{formatCurrency(loan.sanctionedAmount)}</p>
                  <p className="font-semibold">{formatCurrency(loan.outstanding)}</p>
                  <Badge tone={statusTone(loan.status)}>{loan.status}</Badge>
                  <span className="text-sm text-muted">{loan.tenureMonths}m</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {decisions.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Previous decisions</p>
          <div className="overflow-hidden rounded-lg border border-line">
            <div className="hidden grid-cols-[0.7fr_0.8fr_1.2fr_0.7fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted lg:grid">
              <span>Date</span>
              <span>Action</span>
              <span>Rationale</span>
              <span>AI aligned</span>
            </div>
            <div className="divide-y divide-line">
              {decisions.map((decision) => (
                <div
                  key={decision.id}
                  className="grid gap-3 px-4 py-3 text-sm lg:grid-cols-[0.7fr_0.8fr_1.2fr_0.7fr] lg:items-center"
                >
                  <span className="text-xs text-muted">{decision.date}</span>
                  <Badge tone={decisionTone(decision.action)}>{decision.action}</Badge>
                  <p className="text-xs text-muted">{decision.rationale}</p>
                  <span className="text-xs font-semibold">
                    {decision.aiRecommendation === decision.action ? "Yes" : "No"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}
