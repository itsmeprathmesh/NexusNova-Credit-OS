import { Scale, TrendingUp, Shield } from "lucide-react";
import type { CommitteePersonaId, PersonaRecommendation } from "@/domain/types";
import { Badge, Panel, ProgressBar } from "@/components/ui/primitives";

const personaIcons: Record<CommitteePersonaId, typeof Scale> = {
  "risk-officer": Scale,
  "business-growth": TrendingUp,
  compliance: Shield
};

const personaColors: Record<CommitteePersonaId, string> = {
  "risk-officer": "border-l-orange-500",
  "business-growth": "border-l-emerald-500",
  compliance: "border-l-sky-500"
};

function voteTone(vote: PersonaRecommendation["recommendation"]) {
  if (vote === "approve") return "success" as const;
  if (vote === "reject") return "danger" as const;
  return "warning" as const;
}

function voteLabel(vote: PersonaRecommendation["recommendation"]) {
  if (vote === "approve") return "Approve";
  if (vote === "reject") return "Reject";
  return "Conditional";
}

export function CommitteePersonaPanel({ recommendation }: { recommendation: PersonaRecommendation }) {
  const Icon = personaIcons[recommendation.personaId];

  return (
    <Panel className={`border-l-4 ${personaColors[recommendation.personaId]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
            <Icon className="h-5 w-5 text-ink" />
          </div>
          <div>
            <p className="font-semibold text-ink">{recommendation.label}</p>
            <p className="text-xs text-muted">Confidence: {recommendation.confidence}%</p>
          </div>
        </div>
        <Badge tone={voteTone(recommendation.recommendation)}>{voteLabel(recommendation.recommendation)}</Badge>
      </div>

      <ProgressBar value={recommendation.confidence} className="mt-4" />

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Evidence</p>
          <ul className="mt-1 space-y-0.5">
            {recommendation.evidence.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted">
                <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-trust" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Key Concerns</p>
          <ul className="mt-1 space-y-0.5">
            {recommendation.keyConcerns.map((concern) => (
              <li key={concern} className="flex items-start gap-2 text-sm text-muted">
                <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-caution" />
                {concern}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Suggested Actions</p>
          <ul className="mt-1 space-y-0.5">
            {recommendation.suggestedActions.map((action) => (
              <li key={action} className="flex items-start gap-2 text-sm text-muted">
                <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-growth" />
                {action}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  );
}
