"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, FileText, Scale, SlidersHorizontal } from "lucide-react";
import type { DecisionAction, DocumentRecord, FinancialSignals, LoanApplication, MsmeProfile } from "@/domain/types";
import {
  calculateDynamicCreditLimit,
  calculateFinancialHealth,
  calculateFraudRisk,
  calculateRepaymentRisk,
  createLoanRecommendation,
  runStressScenario
} from "@/services/intelligence";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Badge, Button, Metric, Panel, ProgressBar, RiskBadge } from "@/components/ui/primitives";

const actions: { value: DecisionAction; label: string }[] = [
  { value: "approve", label: "Approve" },
  { value: "reduce", label: "Reduce Amount" },
  { value: "reject", label: "Reject" },
  { value: "request-documents", label: "Request Documents" },
  { value: "escalate", label: "Escalate" }
];

function documentTone(status: DocumentRecord["status"]) {
  if (status === "verified") return "success";
  if (status === "review-needed" || status === "stale") return "warning";
  return "danger";
}

export function ApplicationWorkspace({
  application,
  msme,
  documents,
  signals
}: {
  application: LoanApplication;
  msme: MsmeProfile;
  documents: DocumentRecord[];
  signals: FinancialSignals;
}) {
  const health = useMemo(() => calculateFinancialHealth(msme, signals), [msme, signals]);
  const repayment = useMemo(() => calculateRepaymentRisk(signals), [signals]);
  const fraud = useMemo(() => calculateFraudRisk(application.id, signals), [application.id, signals]);
  const recommendation = useMemo(() => createLoanRecommendation(application, msme, signals), [application, msme, signals]);
  const baseLimit = useMemo(() => calculateDynamicCreditLimit(signals), [signals]);
  const [revenueDrop, setRevenueDrop] = useState(10);
  const [emiIncrease, setEmiIncrease] = useState(5);
  const [receivableDelay, setReceivableDelay] = useState(15);
  const [decision, setDecision] = useState<DecisionAction>(recommendation.action);
  const [rationale, setRationale] = useState("");
  const stressedLimit = runStressScenario(signals, {
    revenueDropPercent: revenueDrop,
    emiIncreasePercent: emiIncrease,
    receivableDelayDays: receivableDelay
  });
  const overrideRequired = decision !== recommendation.action;
  const canRecord = !overrideRequired || rationale.trim().length > 0;

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold">{msme.name}</h2>
              <Badge tone="warning">{application.priority}</Badge>
              <Badge tone="info">{application.status}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted">
              {msme.owner} · {msme.city} · {msme.sector} · {msme.branch}
            </p>
            <p className="mt-1 text-sm text-muted">
              PAN {msme.pan} · GSTIN {msme.gstin} · Udyam {msme.udyam}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:min-w-[520px]">
            <Metric label="Requested" value={formatCurrency(application.requestedAmount)} />
            <Metric label="Recommended" value={formatCurrency(recommendation.recommendedAmount)} />
            <Metric label="SLA" value={`${application.slaHoursRemaining}h`} hint="Remaining" />
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel title="Document Intelligence">
          <div className="space-y-3">
            {documents.map((document) => (
              <div key={document.id} className="rounded-lg border border-line p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <FileText className="mt-1 h-5 w-5 text-trust" />
                    <div>
                      <p className="font-semibold">{document.type}</p>
                      <p className="mt-1 text-sm text-muted">OCR confidence {formatPercent(document.ocrConfidence)}</p>
                    </div>
                  </div>
                  <Badge tone={documentTone(document.status)}>{document.status}</Badge>
                </div>
                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  {Object.entries(document.extractedFields).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{key}</dt>
                      <dd className="mt-1 text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
                {document.issues.length > 0 ? (
                  <div className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
                    {document.issues.join("; ")}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Credit Intelligence Summary">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-line p-4">
              <Metric label="Financial Health" value={health.score} hint={health.reason} />
              <ProgressBar value={health.score} className="mt-4" />
              <RiskBadge band={health.band} className="mt-3" />
            </div>
            <div className="rounded-lg border border-line p-4">
              <Metric label="Repayment Risk" value={repayment.score} hint={repayment.reason} />
              <ProgressBar value={repayment.score} className="mt-4" />
              <RiskBadge band={repayment.band} className="mt-3" />
            </div>
            <div className="rounded-lg border border-line p-4">
              <Metric label="Fraud Risk" value={fraud.score} hint={fraud.reason} />
              <ProgressBar value={fraud.score} className="mt-4" />
              <RiskBadge band={fraud.band} className="mt-3" />
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <Metric label="Lower Limit" value={formatCurrency(baseLimit.lowerLimit)} />
            <Metric label="Safe Limit" value={formatCurrency(baseLimit.safeLimit)} />
            <Metric label="Upper Limit" value={formatCurrency(baseLimit.upperLimit)} />
          </div>
        </Panel>
      </div>

      <Panel title="Alternative Data Intelligence">
        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Avg Monthly Balance" value={formatCurrency(signals.averageMonthlyBalance)} />
          <Metric label="Obligations" value={formatCurrency(signals.existingObligations)} />
          <Metric label="Failed Transactions" value={signals.failedTransactions} />
          <Metric label="Customer Concentration" value={formatPercent(signals.customerConcentrationPercent)} />
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Explainability Workbench">
          <div className="space-y-5">
            {[health, repayment, fraud].map((result) => (
              <div key={result.reason} className="rounded-lg border border-line p-4">
                <div className="flex items-center justify-between gap-3">
                  <RiskBadge band={result.band} />
                  <span className="text-sm font-semibold text-muted">{result.confidence}% confidence</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{result.reason}</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {result.evidence.map((evidence) => (
                    <li key={`${result.reason}-${evidence.label}`} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-growth" />
                      <span>
                        <strong>{evidence.label}:</strong> {evidence.value} · {evidence.source}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Stress Simulator" action={<SlidersHorizontal className="h-5 w-5 text-muted" />}>
          <div className="space-y-5">
            {[
              { label: "Revenue drop", value: revenueDrop, setValue: setRevenueDrop, suffix: "%", max: 40 },
              { label: "EMI increase", value: emiIncrease, setValue: setEmiIncrease, suffix: "%", max: 30 },
              { label: "Receivable delay", value: receivableDelay, setValue: setReceivableDelay, suffix: " days", max: 60 }
            ].map((control) => (
              <label key={control.label} className="block">
                <span className="flex justify-between text-sm font-semibold">
                  {control.label}
                  <span>{control.value}{control.suffix}</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={control.max}
                  value={control.value}
                  onChange={(event) => control.setValue(Number(event.target.value))}
                  className="mt-3 w-full accent-trust"
                />
              </label>
            ))}
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="Stressed Lower" value={formatCurrency(stressedLimit.lowerLimit)} />
              <Metric label="Stressed Safe" value={formatCurrency(stressedLimit.safeLimit)} />
              <Metric label="Stressed Upper" value={formatCurrency(stressedLimit.upperLimit)} />
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Human Decision Workflow" action={<Link className="text-sm font-semibold text-trust" href={`/applications/${application.id}/memo`}>Preview memo</Link>}>
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm text-muted">
              AI recommendation: <strong className="text-ink">{recommendation.action}</strong> for{" "}
              <strong className="text-ink">{formatCurrency(recommendation.recommendedAmount)}</strong>.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
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
            {overrideRequired ? (
              <label className="mt-4 block">
                <span className="text-sm font-semibold">Override rationale</span>
                <textarea
                  value={rationale}
                  onChange={(event) => setRationale(event.target.value)}
                  className="mt-2 min-h-28 w-full rounded-md border border-line bg-white p-3 text-sm outline-none focus:border-trust"
                  placeholder="Explain why the human decision differs from the AI recommendation."
                />
              </label>
            ) : null}
          </div>
          <div className="rounded-lg border border-line bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <Scale className="mt-1 h-5 w-5 text-trust" />
              <div>
                <p className="font-semibold">Simulated audit event</p>
                {canRecord ? (
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Loan Officer selected <strong>{decision}</strong> for {msme.name}.{" "}
                    {overrideRequired ? `Rationale: ${rationale}` : "Decision follows AI recommendation."}
                  </p>
                ) : (
                  <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-amber-900">
                    <AlertTriangle className="mt-0.5 h-4 w-4" />
                    Override rationale is required before this decision can enter the audit trail.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
