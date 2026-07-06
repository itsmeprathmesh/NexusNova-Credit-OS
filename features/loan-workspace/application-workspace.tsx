"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Scale, XCircle } from "lucide-react";
import type { DecisionAction, DocumentRecord, FinancialSignals, LoanApplication, MsmeProfile, RiskBand } from "@/domain/types";
import {
  calculateAiReadiness,
  calculateBusinessGrowthForecast,
  calculateCashFlowForecast,
  calculateDynamicCreditLimit,
  calculateFinancialHealth,
  calculateFraudRisk,
  calculateRepaymentRisk,
  createLoanRecommendation,
  getDocumentIntelligence,
  type AiReadiness
} from "@/services/intelligence";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Badge, Button, Metric, Panel, ProgressBar, RiskBadge } from "@/components/ui/primitives";
import { AiReadinessPanel } from "./ai-readiness-panel";
import { BusinessForecastPanel } from "./business-forecast-panel";
import { StressSimulatorPanel } from "./stress-simulator-panel";
import { ExplainabilityPanel } from "./explainability-panel";
import { RecommendationCard } from "./recommendation-card";

const actions: { value: DecisionAction; label: string }[] = [
  { value: "approve", label: "Approve" },
  { value: "reduce", label: "Reduce Amount" },
  { value: "reject", label: "Reject" },
  { value: "request-documents", label: "Request Documents" },
  { value: "escalate", label: "Escalate" }
];

type TimelineEntry = {
  period: string;
  revenue: number;
  gst: number;
  cashFlow: number;
  upi: number;
  riskScore: number;
  band: RiskBand;
  confidence: number;
};

function computeIntelligenceTimeline(signals: FinancialSignals): TimelineEntry[] {
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return signals.monthlyRevenue.map((rev, i) => {
    const gst = signals.gstTurnover[i];
    const upi = signals.upiInflow[i];
    const avg = signals.monthlyRevenue.reduce((s, v) => s + v, 0) / signals.monthlyRevenue.length;
    const volatility = Math.max(...signals.monthlyRevenue) - Math.min(...signals.monthlyRevenue);
    const dropPenalty = rev < avg * 0.9 ? 15 : 0;
    const failedPenalty = signals.failedTransactions > 5 ? 8 : 0;
    const score = Math.max(10, Math.min(100, 75 - dropPenalty - failedPenalty));
    let band: RiskBand;
    if (score >= 78) band = "low";
    else if (score >= 58) band = "medium";
    else if (score >= 38) band = "high";
    else band = "critical";
    const confidence = Math.round(80 - Math.abs(rev - avg) / avg * 20);
    const monthIndex = new Date().getMonth() - (signals.monthlyRevenue.length - 1 - i);
    return {
      period: monthLabels[((monthIndex % 12) + 12) % 12],
      revenue: Math.round(rev / 100000),
      gst: Math.round(gst / 100000),
      cashFlow: Math.round(rev / 100000),
      upi: Math.round(upi / 100000),
      riskScore: score,
      band,
      confidence: Math.max(50, Math.min(95, confidence))
    };
  });
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
  const readiness = useMemo(() => calculateAiReadiness(application.id), [application.id]);
  const growth = useMemo(() => calculateBusinessGrowthForecast(signals), [signals]);
  const cashFlow = useMemo(() => calculateCashFlowForecast(signals), [signals]);
  const timeline = useMemo(() => computeIntelligenceTimeline(signals), [signals]);

  const [decision, setDecision] = useState<DecisionAction>(recommendation.action);
  const [rationale, setRationale] = useState("");
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

      <AiReadinessPanel readiness={readiness} />

      <BusinessForecastPanel signals={signals} growth={growth} cashFlow={cashFlow} />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
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

        <RecommendationCard recommendation={recommendation} health={health} />
      </div>

      <Panel title="Alternate Data Intelligence">
        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Avg Monthly Balance" value={formatCurrency(signals.averageMonthlyBalance)} />
          <Metric label="Obligations" value={formatCurrency(signals.existingObligations)} />
          <Metric label="Failed Transactions" value={signals.failedTransactions} />
          <Metric label="Customer Concentration" value={formatPercent(signals.customerConcentrationPercent)} />
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <ExplainabilityPanel
          results={[
            { label: "Financial Health", result: health },
            { label: "Repayment Risk", result: repayment },
            { label: "Fraud Risk", result: fraud }
          ]}
        />

        <StressSimulatorPanel application={application} msme={msme} signals={signals} />
      </div>

      <Panel title="AI Readiness Gate">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {readiness.readyLabel === "AI-ready" ? (
              <CheckCircle2 className="h-8 w-8 text-growth" />
            ) : readiness.readyLabel === "review-needed" ? (
              <AlertTriangle className="h-8 w-8 text-caution" />
            ) : (
              <XCircle className="h-8 w-8 text-danger" />
            )}
            <div>
              <p className="text-lg font-semibold">
                {readiness.readyLabel === "AI-ready"
                  ? "AI Ready"
                  : readiness.readyLabel === "review-needed"
                    ? "Needs Manual Review"
                    : "Blocked"}
              </p>
              <p className="text-sm text-muted">
                {readiness.readyLabel === "AI-ready"
                  ? "AI analysis is complete. The officer can proceed with the decision."
                  : readiness.readyLabel === "review-needed"
                    ? "Review items exist. Manual officer assessment is required before proceeding."
                    : "Missing documents are blocking AI analysis. Collect documents before proceeding."}
              </p>
            </div>
          </div>
          <Badge tone={readiness.readyLabel === "AI-ready" ? "success" : readiness.readyLabel === "review-needed" ? "warning" : "danger"}>
            {readiness.score}% readiness
          </Badge>
        </div>
        {readiness.reviewItems.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Review summary</p>
            {readiness.reviewItems.slice(0, 3).map((item) => (
              <p key={item} className="flex items-start gap-2 text-sm text-muted">
                <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-caution" />
                {item}
              </p>
            ))}
            {readiness.reviewItems.length > 3 && (
              <p className="text-xs text-muted">+{readiness.reviewItems.length - 3} more items</p>
            )}
          </div>
        )}
      </Panel>

      <Panel title="Intelligence Timeline">
        <div className="overflow-hidden rounded-lg border border-line">
          <div className="hidden grid-cols-[0.6fr_0.8fr_0.8fr_0.8fr_0.8fr_0.8fr_0.8fr] gap-2 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted lg:grid">
            <span>Period</span>
            <span>Revenue</span>
            <span>GST</span>
            <span>Cash Flow</span>
            <span>UPI</span>
            <span>Risk</span>
            <span>Confidence</span>
          </div>
          <div className="divide-y divide-line">
            {timeline.map((entry) => (
              <div
                key={entry.period}
                className="grid gap-2 px-4 py-3 text-sm lg:grid-cols-[0.6fr_0.8fr_0.8fr_0.8fr_0.8fr_0.8fr_0.8fr] lg:items-center"
              >
                <span className="font-semibold">{entry.period}</span>
                <span className="text-muted">₹{entry.revenue}L</span>
                <span className="text-muted">₹{entry.gst}L</span>
                <span className="text-muted">₹{entry.cashFlow}L</span>
                <span className="text-muted">₹{entry.upi}L</span>
                <RiskBadge band={entry.band} />
                <span className="text-muted">{entry.confidence}%</span>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Panel title="Human Decision Workflow" action={<Link className="text-sm font-semibold text-trust" href={`/applications/${application.id}/memo`}>Preview memo</Link>}>
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm text-muted">
              AI recommendation: <strong className="text-ink">{recommendation.action}</strong> for{" "}
              <strong className="text-ink">{formatCurrency(recommendation.recommendedAmount)}</strong>.
              {readiness.readyLabel !== "AI-ready" && (
                <span className="ml-2 text-caution">(Manual review required)</span>
              )}
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
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">What would improve this recommendation</p>
              {readiness.missingDocuments.length > 0 && (
                <p className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-trust" />
                  Collect missing documents: {readiness.missingDocuments.join(", ")}
                </p>
              )}
              {health.band !== "low" && (
                <p className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-trust" />
                  Strengthen financial health by reducing customer concentration and failed transactions.
                </p>
              )}
              <p className="flex items-start gap-2 text-sm text-muted">
                <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-trust" />
                Invoice-level matching for large bank credits will increase AI confidence.
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-line bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <Scale className="mt-1 h-5 w-5 text-trust" />
              <div>
                <p className="font-semibold">Officer decision</p>
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
