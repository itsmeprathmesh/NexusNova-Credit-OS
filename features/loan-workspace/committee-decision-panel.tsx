"use client";

import { useCallback, useState } from "react";
import { Clock, Scale } from "lucide-react";
import type { CommitteeAuditEntry, CommitteeConsensus, DecisionAction, MsmeProfile } from "@/domain/types";
import { formatCurrency } from "@/lib/format";
import { Badge, Button, Panel } from "@/components/ui/primitives";

const actions: { value: DecisionAction; label: string }[] = [
  { value: "approve", label: "Approve" },
  { value: "reduce", label: "Reduce Amount" },
  { value: "reject", label: "Reject" },
  { value: "request-documents", label: "Request Documents" },
  { value: "escalate", label: "Escalate" }
];

function consensusToAction(vote: CommitteeConsensus["finalRecommendation"]): DecisionAction {
  if (vote === "approve") return "approve";
  if (vote === "reject") return "reject";
  return "reduce";
}

export function CommitteeDecisionPanel({
  consensus,
  msme,
  auditLog,
  onRecordDecision
}: {
  consensus: CommitteeConsensus;
  msme: MsmeProfile;
  auditLog: CommitteeAuditEntry[];
  onRecordDecision: (action: DecisionAction, amount: number, rationale: string, overrideRationale: string | null) => void;
}) {
  const aiAction = consensusToAction(consensus.finalRecommendation);
  const [decision, setDecision] = useState<DecisionAction>(aiAction);
  const [amount, setAmount] = useState(consensus.suggestedAmount);
  const [rationale, setRationale] = useState("");
  const overrideRequired = decision !== aiAction;
  const canRecord = !overrideRequired || rationale.trim().length > 0;

  const handleRecord = useCallback(() => {
    if (!canRecord) return;
    onRecordDecision(decision, amount, rationale, overrideRequired ? rationale : null);
  }, [decision, amount, rationale, overrideRequired, canRecord, onRecordDecision]);

  return (
    <div className="space-y-6">
      <Panel title="Officer Decision">
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div>
            <p className="mb-4 text-sm text-muted">
              AI committee recommends <strong className="text-ink">{consensus.finalRecommendation}</strong> with{" "}
              <strong className="text-ink">{consensus.confidence}%</strong> confidence for{" "}
              <strong className="text-ink">{formatCurrency(consensus.suggestedAmount)}</strong>.
            </p>

            <div className="mb-4">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Decision</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {actions.map((action) => (
                  <Button
                    key={action.value}
                    type="button"
                    variant={decision === action.value ? "primary" : "secondary"}
                    onClick={() => setDecision(action.value)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>

            {decision === "reduce" && (
              <div className="mb-4">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted">Revised Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-2 block w-full rounded-md border border-line bg-white p-3 text-sm outline-none focus:border-trust"
                />
              </div>
            )}

            {overrideRequired && (
              <div className="mb-4">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Override Rationale <span className="text-danger">*</span>
                  </span>
                  <textarea
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    className="mt-2 min-h-24 w-full rounded-md border border-line bg-white p-3 text-sm outline-none focus:border-trust"
                    placeholder="Explain why the human decision differs from the AI committee recommendation."
                  />
                </label>
              </div>
            )}

            <Button type="button" onClick={handleRecord} disabled={!canRecord}>
              Record Decision
            </Button>
          </div>

          <div className="rounded-lg border border-line bg-slate-50 p-5">
            <div className="flex items-start gap-3">
              <Scale className="mt-1 h-5 w-5 text-trust" />
              <div>
                <p className="font-semibold text-ink">Decision Comparison</p>
                <div className="mt-4 space-y-3">
                  <div className="rounded-md bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">AI Committee</p>
                    <p className="mt-1 text-sm text-ink">
                      <Badge tone={consensus.finalRecommendation === "approve" ? "success" : consensus.finalRecommendation === "reject" ? "danger" : "warning"}>
                        {consensus.finalRecommendation}
                      </Badge>
                      <span className="ml-2">
                        {formatCurrency(consensus.suggestedAmount)} · {consensus.suggestedTenureMonths}mo · {consensus.confidence}% confidence
                      </span>
                    </p>
                  </div>
                  <div className="rounded-md bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Officer</p>
                    <p className="mt-1 text-sm text-ink">
                      <Badge tone={decision === "approve" ? "success" : decision === "reject" ? "danger" : decision === "reduce" ? "warning" : "info"}>
                        {decision}
                      </Badge>
                      <span className="ml-2">
                        {decision === "reduce" ? formatCurrency(amount) : formatCurrency(consensus.suggestedAmount)}
                      </span>
                    </p>
                    {overrideRequired && rationale && (
                      <p className="mt-2 text-sm italic text-muted">Override: {rationale}</p>
                    )}
                    {!overrideRequired && (
                      <p className="mt-2 text-sm text-muted">Officer aligned with AI recommendation</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Audit Trail" action={<Button variant="ghost" type="button" onClick={() => window.print()}>Export</Button>}>
        {auditLog.length === 0 ? (
          <div className="flex items-center gap-3 rounded-lg border border-line bg-slate-50 p-4">
            <Clock className="h-5 w-5 text-muted" />
            <p className="text-sm text-muted">No actions recorded yet. Use the decision panel above to record the first entry.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-line">
            <div className="hidden grid-cols-[0.5fr_1fr_1.2fr_3fr_1.5fr] gap-2 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted lg:grid">
              <span>Timestamp</span>
              <span>Actor</span>
              <span>Role</span>
              <span>Action</span>
              <span>Details</span>
            </div>
            <div className="divide-y divide-line">
              {auditLog.map((entry) => (
                <div
                  key={entry.id}
                  className="grid gap-2 px-4 py-3 text-sm lg:grid-cols-[0.5fr_1fr_1.2fr_3fr_1.5fr] lg:items-center"
                >
                  <span className="font-mono text-xs text-muted">
                    {new Date(entry.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="font-semibold text-ink">{entry.actor}</span>
                  <Badge>{entry.role}</Badge>
                  <span className="text-muted">{entry.action}</span>
                  <span className="text-xs text-muted">{entry.details}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
