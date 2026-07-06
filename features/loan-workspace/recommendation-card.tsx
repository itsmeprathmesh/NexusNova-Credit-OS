import type { IntelligenceResult, LoanRecommendation } from "@/domain/types";
import { formatCurrency } from "@/lib/format";
import { Badge, Metric, Panel, RiskBadge } from "@/components/ui/primitives";

function actionTone(action: LoanRecommendation["action"]) {
  if (action === "approve") return "success" as const;
  if (action === "reduce") return "warning" as const;
  if (action === "reject") return "danger" as const;
  return "info" as const;
}

function actionLabel(action: LoanRecommendation["action"]) {
  const labels: Record<LoanRecommendation["action"], string> = {
    approve: "Approve",
    reduce: "Reduce Amount",
    reject: "Reject",
    "request-documents": "Request Documents",
    escalate: "Escalate"
  };
  return labels[action];
}

export function RecommendationCard({
  recommendation,
  health
}: {
  recommendation: LoanRecommendation;
  health: IntelligenceResult;
}) {
  return (
    <Panel title="AI Recommendation">
      <div className="space-y-5">
        <div className="rounded-lg border-2 border-line p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Recommendation</p>
              <div className="mt-2 flex items-center gap-3">
                <Badge tone={actionTone(recommendation.action)} className="text-sm">
                  {actionLabel(recommendation.action)}
                </Badge>
                <span className="text-2xl font-semibold text-ink">
                  {formatCurrency(recommendation.recommendedAmount)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-right">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Tenure</p>
                <p className="mt-1 text-sm font-semibold">{recommendation.tenureMonths} months</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Confidence</p>
                <p className="mt-1 text-sm font-semibold">{recommendation.confidence}%</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <p className="text-xs text-muted">Business outlook:</p>
            <RiskBadge band={health.band} />
          </div>

          <p className="mt-4 text-sm leading-6 text-muted">{recommendation.rationale}</p>
        </div>

        {recommendation.conditions.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Conditions</p>
            <ul className="space-y-1">
              {recommendation.conditions.map((condition) => (
                <li key={condition} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-trust" />
                  <span className="text-muted">{condition}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {recommendation.mitigants.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Mitigants</p>
            <ul className="space-y-1">
              {recommendation.mitigants.map((mitigant) => (
                <li key={mitigant} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-growth" />
                  <span className="text-muted">{mitigant}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Panel>
  );
}
