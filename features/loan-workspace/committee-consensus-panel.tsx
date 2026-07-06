import { CheckCircle2, MinusCircle, XCircle } from "lucide-react";
import type { CommitteeConsensus } from "@/domain/types";
import { formatCurrency } from "@/lib/format";
import { Badge, Metric, Panel, ProgressBar } from "@/components/ui/primitives";

function consensusTone(vote: CommitteeConsensus["finalRecommendation"]) {
  if (vote === "approve") return "success" as const;
  if (vote === "reject") return "danger" as const;
  return "warning" as const;
}

function consensusLabel(vote: CommitteeConsensus["finalRecommendation"]) {
  if (vote === "approve") return "Approve";
  if (vote === "reject") return "Reject";
  return "Conditional";
}

export function CommitteeConsensusPanel({ consensus }: { consensus: CommitteeConsensus }) {
  return (
    <Panel title="Committee Consensus">
      <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-line p-5 text-center">
            <Badge tone={consensusTone(consensus.finalRecommendation)} className="mb-3 text-sm">
              {consensusLabel(consensus.finalRecommendation)}
            </Badge>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Consensus Confidence</p>
            <p className="mt-1 text-3xl font-semibold text-ink">{consensus.confidence}%</p>
            <ProgressBar value={consensus.confidence} className="mt-3" />
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-line p-3">
              <CheckCircle2 className="mx-auto h-5 w-5 text-growth" />
              <p className="mt-1 text-lg font-semibold text-ink">{consensus.voteBreakdown.approve}</p>
              <p className="text-xs text-muted">Approve</p>
            </div>
            <div className="rounded-lg border border-line p-3">
              <MinusCircle className="mx-auto h-5 w-5 text-caution" />
              <p className="mt-1 text-lg font-semibold text-ink">{consensus.voteBreakdown.conditional}</p>
              <p className="text-xs text-muted">Conditional</p>
            </div>
            <div className="rounded-lg border border-line p-3">
              <XCircle className="mx-auto h-5 w-5 text-danger" />
              <p className="mt-1 text-lg font-semibold text-ink">{consensus.voteBreakdown.reject}</p>
              <p className="text-xs text-muted">Reject</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Metric label="Suggested Amount" value={formatCurrency(consensus.suggestedAmount)} />
            <Metric label="Suggested Tenure" value={`${consensus.suggestedTenureMonths} months`} />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Conditions</p>
            <ul className="space-y-1.5">
              {consensus.conditions.map((condition) => (
                <li key={condition} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-trust" />
                  <span className="text-muted">{condition}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Panel>
  );
}
