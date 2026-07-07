"use client";

import { ArrowUpRight, CheckCircle2, FileText, Lightbulb, Scale, Target, TrendingUp } from "lucide-react";
import type { IntelligenceResult, LoanRecommendation } from "@/domain/types";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import { Badge, Panel, RiskBadge } from "@/components/ui/primitives";
import { ConfidenceBar } from "./confidence-indicator";
import { AIBadge } from "./ai-status";
import { AiTooltip } from "@/features/judge-experience";

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

export function AIRecommendationCard({
  recommendation,
  health
}: {
  recommendation: LoanRecommendation;
  health: IntelligenceResult;
}) {
  return (
    <Panel title={<span className="inline-flex items-center gap-2">AI Recommendation <AiTooltip tooltipKey="financial-health" icon="brain" /></span>} action={<AIBadge tone="complete">AI Generated</AIBadge>}>
      <div className="space-y-5">
        <div className="rounded-lg border-2 border-line/60 p-5 transition-all hover:border-trust/20 hover:shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Decision</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Badge tone={actionTone(recommendation.action)} className="text-sm">
                  {actionLabel(recommendation.action)}
                </Badge>
                <span className="text-2xl font-semibold text-ink">
                  {formatCurrency(recommendation.recommendedAmount)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Tenure</p>
                <p className="mt-0.5 text-sm font-semibold">{recommendation.tenureMonths} months</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Confidence</p>
                <p className="mt-0.5 text-sm font-semibold">{recommendation.confidence}%</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Outlook</p>
                <RiskBadge band={health.band} className="mt-0.5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">Impact</p>
                <p className="mt-0.5 text-sm font-semibold text-growth">
                  <TrendingUp className="mr-0.5 inline h-3.5 w-3.5" />
                  {recommendation.action === "approve" || recommendation.action === "reduce"
                    ? `₹${Math.round(recommendation.recommendedAmount * 0.12 / 100000)}L/yr`
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">Confidence Level</p>
            <ConfidenceBar score={recommendation.confidence} />
          </div>

          <div className="mt-4 flex items-start gap-2">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-trust" />
            <p className="text-sm leading-6 text-muted">{recommendation.rationale}</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              <CheckCircle2 className="h-3.5 w-3.5 text-growth" />
              Conditions
            </p>
            {recommendation.conditions.length > 0 ? (
              <ul className="space-y-1.5">
                {recommendation.conditions.map((condition) => (
                  <li key={condition} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-trust" />
                    <span className="text-muted">{condition}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">No conditions required.</p>
            )}
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
              <Target className="h-3.5 w-3.5 text-growth" />
              Mitigants
            </p>
            {recommendation.mitigants.length > 0 ? (
              <ul className="space-y-1.5">
                {recommendation.mitigants.map((mitigant) => (
                  <li key={mitigant} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-growth" />
                    <span className="text-muted">{mitigant}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">No mitigants identified.</p>
            )}
          </div>
        </div>

        {health.positiveFactors.length > 0 && (
          <div className="rounded-lg border border-growth/20 bg-growth/[0.02] p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-growth">
              <ArrowUpRight className="h-3.5 w-3.5" />
              Positive factors
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {health.positiveFactors.map((f) => (
                <span key={f} className="rounded-md bg-growth/10 px-2 py-1 text-xs text-growth">{f}</span>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-lg border border-line/50 bg-slate-50/50 p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <Scale className="h-3.5 w-3.5" />
            Recommendation Impact Summary
          </p>
          <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-muted">Confidence score</p>
              <p className="font-semibold text-ink">{recommendation.confidence}%</p>
            </div>
            <div>
              <p className="text-muted">Recommended amount</p>
              <p className="font-semibold text-ink">{formatCurrency(recommendation.recommendedAmount)}</p>
            </div>
            <div>
              <p className="text-muted">Business outlook</p>
              <RiskBadge band={health.band} />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-dashed border-trust/30 bg-trust/[0.02] p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-trust">
            <FileText className="h-3.5 w-3.5" />
            What would improve approval?
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            {health.band !== "low"
              ? "Strengthening financial health by reducing customer concentration and failed transactions would improve the recommendation. Invoice-level matching for large bank credits will increase AI confidence."
              : "The application is in strong standing. Continued GST filing consistency and maintaining bank statement health will sustain AI confidence."}
          </p>
        </div>
      </div>
    </Panel>
  );
}
