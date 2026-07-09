"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, ChevronDown, Scale, XCircle } from "lucide-react";
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
  type AiReadiness
} from "@/services/intelligence";
import { formatCurrency, formatPercent } from "@/lib/format";
import { useDemoMode } from "@/contexts/demo-mode";
import { cn } from "@/lib/utils";
import { AiTooltip } from "@/features/judge-experience";
import {
  DecisionTrace,
  LoanEligibilityExplanation,
  getDemoLoanEligibility,
} from "@/features/xai";
import { Badge, Button, Metric, Panel, ProgressBar, RiskBadge } from "@/components/ui/primitives";
import { AiReadinessPanel } from "./ai-readiness-panel";
import { AiCreditCommittee } from "./ai-credit-committee";
import { requestDocument } from "@/services/app-data";
import { BusinessForecastPanel } from "./business-forecast-panel";
import { StressSimulatorPanel } from "./stress-simulator-panel";
import { ExplainabilityPanel } from "./explainability-panel";
import { RecommendationCard } from "./recommendation-card";
import { AICompleted, AIWarning } from "@/components/ai/ai-status";
import { AIThinkingPanel } from "@/components/ai/ai-thinking";
import { ConfidenceIndicators } from "@/components/ai/confidence-indicator";
import { AIRecommendationCard } from "@/components/ai/ai-recommendation-card";
import { AIInsightsPanel } from "@/components/ai/ai-insights-panel";
import { AITimeline } from "@/components/ai/ai-timeline";
import { DonutChart } from "@/components/charts";

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

  const loanEligibility = useMemo(() => getDemoLoanEligibility(), []);
  const [decision, setDecision] = useState<DecisionAction>(recommendation.action);
  const [rationale, setRationale] = useState("");
  const [showDecisionTrace, setShowDecisionTrace] = useState(false);
  const overrideRequired = decision !== recommendation.action;
  const canRecord = !overrideRequired || rationale.trim().length > 0;
  const { isDemoMode, triggerConfetti } = useDemoMode();

  useEffect(() => {
    if (isDemoMode && (decision === "approve" || decision === "reduce")) {
      triggerConfetti();
    }
  }, [decision, isDemoMode, triggerConfetti]);

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

      <AIThinkingPanel isAnalyzing={false} />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel title={<span className="inline-flex items-center gap-2">Credit Intelligence Summary <AiTooltip tooltipKey="financial-health" icon="brain" /></span>}>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-line p-4">
              <Metric label={<span className="inline-flex items-center gap-1">Financial Health <AiTooltip tooltipKey="financial-health" /></span>} value={health.score} hint={health.reason} />
              <ProgressBar value={health.score} className="mt-4" />
              <RiskBadge band={health.band} className="mt-3" />
            </div>
            <div className="rounded-lg border border-line p-4">
              <Metric label={<span className="inline-flex items-center gap-1">Repayment Risk <AiTooltip tooltipKey="repayment-risk" /></span>} value={repayment.score} hint={repayment.reason} />
              <ProgressBar value={repayment.score} className="mt-4" />
              <RiskBadge band={repayment.band} className="mt-3" />
            </div>
            <div className="rounded-lg border border-line p-4">
              <Metric label={<span className="inline-flex items-center gap-1">Fraud Risk <AiTooltip tooltipKey="fraud-risk" /></span>} value={fraud.score} hint={fraud.reason} />
              <ProgressBar value={fraud.score} className="mt-4" />
              <RiskBadge band={fraud.band} className="mt-3" />
            </div>
          </div>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <div className="grid gap-4 md:grid-cols-3">
              <Metric label="Lower Limit" value={formatCurrency(baseLimit.lowerLimit)} />
              <Metric label="Safe Limit" value={formatCurrency(baseLimit.safeLimit)} />
              <Metric label="Upper Limit" value={formatCurrency(baseLimit.upperLimit)} />
            </div>
            <div className="space-y-4">
              <ConfidenceIndicators
                metrics={[
                  { label: "Financial Health", score: health.confidence },
                  { label: "Repayment Risk", score: repayment.confidence },
                  { label: "Fraud Risk", score: fraud.confidence },
                  { label: "Document Intelligence", score: readiness.score },
                  { label: "Overall Recommendation", score: recommendation.confidence }
                ]}
              />
              <DonutChart
                data={[
                  { name: "Financial Health", value: health.confidence, color: "#215f7a" },
                  { name: "Repayment Risk", value: repayment.confidence, color: "#13795b" },
                  { name: "Fraud Risk", value: fraud.confidence, color: "#e68a2e" },
                  { name: "Document Intel", value: readiness.score, color: "#7c3aed" }
                ]}
                height={140}
                innerRadius={34}
                outerRadius={58}
                centerLabel={`${Math.round((health.confidence + repayment.confidence + fraud.confidence + readiness.score) / 4)}%`}
              />
            </div>
          </div>
        </Panel>

        <div className="space-y-6">
          <AIRecommendationCard recommendation={recommendation} health={health} />
          <LoanEligibilityExplanation eligibility={loanEligibility} />
        </div>
      </div>

      <Panel title="Alternate Data Intelligence">
        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Avg Monthly Balance" value={formatCurrency(signals.averageMonthlyBalance)} />
          <Metric label="Obligations" value={formatCurrency(signals.existingObligations)} />
          <Metric label="Failed Transactions" value={signals.failedTransactions} />
          <Metric label="Customer Concentration" value={formatPercent(signals.customerConcentrationPercent)} />
        </div>
      </Panel>

      <AIInsightsPanel signals={signals} health={health} />

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

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowDecisionTrace(!showDecisionTrace)}
          className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 text-sm font-semibold text-ink transition hover:bg-white/[0.04]"
        >
          <span>How AI Reached This Decision</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted transition-transform",
              showDecisionTrace && "rotate-180"
            )}
          />
        </button>
        {showDecisionTrace && <DecisionTrace activeStep="recommendation" />}
      </div>

      <Panel title="AI Readiness Gate" action={<Badge tone={readiness.readyLabel === "AI-ready" ? "success" : readiness.readyLabel === "review-needed" ? "warning" : "danger"}>{readiness.score}% readiness</Badge>}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {readiness.readyLabel === "AI-ready" ? (
              <span className="inline-flex items-center gap-2"><AICompleted label="AI Ready"><>AI analysis is complete. The officer can proceed with the decision.</></AICompleted></span>
            ) : readiness.readyLabel === "review-needed" ? (
              <span className="inline-flex items-center gap-2"><AIWarning label="Needs Manual Review"><>Review items exist. Manual officer assessment is required before proceeding.</></AIWarning></span>
            ) : (
              <span className="inline-flex items-center gap-2"><AlertTriangle className="h-8 w-8 text-danger" /><div><p className="text-lg font-semibold text-danger">Blocked</p><p className="text-sm text-muted">Missing documents are blocking AI analysis.</p></div></span>
            )}
          </div>
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

      <AiCreditCommittee application={application} msme={msme} signals={signals} />

      <Panel title="Intelligence Timeline">
        <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
          <AITimeline
            stages={[
              { id: "customer", label: "Customer", status: "complete", detail: "Application received" },
              { id: "documents", label: "Documents", status: "complete", detail: `${documents.length} documents uploaded` },
              { id: "financial", label: "Financial Analysis", status: "complete", detail: `${formatPercent(health.score)} health, ${formatPercent(repayment.score)} repayment` },
              { id: "fraud", label: "Fraud", status: "complete", detail: `${formatPercent(fraud.score)} risk score` },
              { id: "recommendation", label: "Recommendation", status: "complete", detail: `${recommendation.action}` },
              { id: "officer", label: "Officer Review", status: "pending", detail: "Awaiting decision" }
            ]}
          />
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
        </div>
      </Panel>

      <Panel title="Human Decision Workflow" action={<div className="flex flex-wrap gap-2"><Link className="text-sm font-semibold text-trust" href={`/applications/${application.id}/memo`}>Preview memo</Link><Link className="text-sm font-semibold text-trust" href={`/applications/${application.id}/production-memo`}>Production memo</Link><Link className="text-sm font-semibold text-trust" href={`/applications/${application.id}/timeline`}>Timeline</Link></div>}>
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm text-muted">
              AI committee consensus: <strong className="text-ink">{recommendation.action}</strong> for{" "}
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
            <div className="mt-4 rounded-lg border border-dashed border-trust/30 bg-trust/[0.02] p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Customer Handoff</p>
              <p className="mt-1 text-xs text-muted">Request missing documents from the customer. They will see this request immediately on their portal.</p>
              {readiness.missingDocuments.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {readiness.missingDocuments.map((docType) => (
                    <button
                      key={docType}
                      type="button"
                      onClick={() => {
                        requestDocument(application.id, [docType], "Please upload this document for verification.");
                        alert(`Document request sent to customer for: ${docType}`);
                      }}
                      className="rounded-md border border-line bg-white px-2.5 py-1 text-xs font-semibold text-trust hover:bg-trust hover:text-white"
                    >
                      Request {docType}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-xs text-growth">All documents are present. No customer handoff needed.</p>
              )}
            </div>

            <div className="mt-6 rounded-xl border border-trust/20 bg-trust-light/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Officer Decision Support</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-growth">Top Positive Factors</p>
                  <ul className="mt-2 space-y-1">
                    {health.band === "low" ? (
                      <>
                        <li className="flex items-start gap-1.5 text-xs text-muted"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-growth" />Stable revenue trend across 6 months</li>
                        <li className="flex items-start gap-1.5 text-xs text-muted"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-growth" />GST compliance score above threshold</li>
                        <li className="flex items-start gap-1.5 text-xs text-muted"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-growth" />UPI collections indicate active business</li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-1.5 text-xs text-muted"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-growth" />Digital payment behaviour verified</li>
                        <li className="flex items-start gap-1.5 text-xs text-muted"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-growth" />Alternate data coverage across 4+ sources</li>
                      </>
                    )}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-caution">Top Concerns</p>
                  <ul className="mt-2 space-y-1">
                    {signals.customerConcentrationPercent > 35 ? (
                      <li className="flex items-start gap-1.5 text-xs text-muted"><AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-caution" />High customer concentration ({signals.customerConcentrationPercent}%)</li>
                    ) : null}
                    {signals.failedTransactions > 3 ? (
                      <li className="flex items-start gap-1.5 text-xs text-muted"><AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-caution" />Failed transactions ({signals.failedTransactions}) indicate cash flow stress</li>
                    ) : null}
                    {health.band !== "low" ? (
                      <li className="flex items-start gap-1.5 text-xs text-muted"><AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-caution" />Financial health score needs improvement</li>
                    ) : (
                      <li className="flex items-start gap-1.5 text-xs text-muted"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-growth" />No significant concerns identified</li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-4">
                <div className="flex-1">
                  <p className="text-xs font-medium text-ink">Suggested Questions</p>
                  <ul className="mt-1 space-y-0.5">
                    <li className="text-xs text-muted">• What is the repayment source for this loan?</li>
                    <li className="text-xs text-muted">• Are there any pending litigations?</li>
                    <li className="text-xs text-muted">• How long has the business been operating?</li>
                  </ul>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-ink">Recommended Actions</p>
                  <ul className="mt-1 space-y-0.5">
                    <li className="text-xs text-muted">• {recommendation.action === "approve" ? "Proceed with standard KYC verification" : "Request additional documents before decision"}</li>
                    <li className="text-xs text-muted">• Verify bank statement for large credits</li>
                    <li className="text-xs text-muted">• Check GST return consistency with bank data</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-trust/10 bg-white/[0.02] px-3 py-2">
                <span className="text-xs text-muted">Approval Confidence:</span>
                <span className="text-sm font-bold text-trust">{recommendation.confidence}%</span>
              </div>
            </div>

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
                    {overrideRequired ? `Rationale: ${rationale}` : "Decision aligns with AI committee consensus."}
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
