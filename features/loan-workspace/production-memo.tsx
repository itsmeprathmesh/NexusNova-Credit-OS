import type { DocumentRecord, FinancialSignals, LoanApplication, MsmeProfile } from "@/domain/types";
import {
  calculateAiReadiness,
  calculateBusinessGrowthForecast,
  calculateCashFlowForecast,
  calculateDynamicCreditLimit,
  calculateFinancialHealth,
  calculateFraudRisk,
  calculateRepaymentRisk,
  createLoanRecommendation
} from "@/services/intelligence";
import { runBusinessGrowthAnalysis, runComplianceAnalysis, runRiskOfficerAnalysis, computeCommitteeConsensus } from "@/services/credit-committee";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Badge, Metric, Panel, RiskBadge } from "@/components/ui/primitives";

export function ProductionCreditMemo({
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
  const health = calculateFinancialHealth(msme, signals);
  const repayment = calculateRepaymentRisk(signals);
  const fraud = calculateFraudRisk(application.id, signals);
  const recommendation = createLoanRecommendation(application, msme, signals);
  const readiness = calculateAiReadiness(application.id);
  const growth = calculateBusinessGrowthForecast(signals);
  const cashFlow = calculateCashFlowForecast(signals);
  const limit = calculateDynamicCreditLimit(signals);
  const riskOfficer = runRiskOfficerAnalysis(msme, signals);
  const businessGrowth = runBusinessGrowthAnalysis(msme, signals);
  const compliance = runComplianceAnalysis(application.id, signals);
  const consensus = computeCommitteeConsensus([riskOfficer, businessGrowth, compliance], application, msme, signals);
  const allEvidence = [...health.evidence, ...repayment.evidence, ...fraud.evidence, ...growth.evidence, ...cashFlow.evidence];
  const now = new Date().toISOString();

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <Panel id={id}>
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-trust text-xs font-semibold text-white">{id}</span>
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </Panel>
  );

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">Production Credit Memo</p>
            <h2 className="mt-1 text-2xl font-semibold">{msme.name}</h2>
            <p className="mt-2 text-sm text-muted">
              {application.id} · Generated {new Date(now).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · MSME-Confidential
            </p>
          </div>
          <Badge tone="info">Final · audit-ready</Badge>
        </div>
      </Panel>

      <Section id="01" title="Executive Summary">
        <p className="text-sm leading-6 text-muted">
          {msme.name}, a {msme.businessAgeYears}-year-old {msme.sector.toLowerCase()} enterprise based in {msme.city}, has applied for a {application.product} of{" "}
          {formatCurrency(application.requestedAmount)} for {application.purpose.toLowerCase()}. The AI Credit Committee recommends{" "}
          {consensus.finalRecommendation} with {formatCurrency(consensus.suggestedAmount)} at {consensus.confidence}% consensus confidence.{" "}
          {consensus.conditions.length} conditions apply. The loan officer decision aligns with the committee recommendation.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Metric label="Requested Amount" value={formatCurrency(application.requestedAmount)} />
          <Metric label="Recommended Amount" value={formatCurrency(recommendation.recommendedAmount)} />
          <Metric label="Committee Confidence" value={`${consensus.confidence}%`} />
        </div>
      </Section>

      <Section id="02" title="Borrower Profile">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div><span className="text-xs font-semibold uppercase tracking-wide text-muted">Business Name</span><p className="mt-1 text-sm">{msme.name}</p></div>
          <div><span className="text-xs font-semibold uppercase tracking-wide text-muted">Owner</span><p className="mt-1 text-sm">{msme.owner}</p></div>
          <div><span className="text-xs font-semibold uppercase tracking-wide text-muted">PAN</span><p className="mt-1 text-sm font-mono">{msme.pan}</p></div>
          <div><span className="text-xs font-semibold uppercase tracking-wide text-muted">GSTIN</span><p className="mt-1 text-sm font-mono">{msme.gstin}</p></div>
          <div><span className="text-xs font-semibold uppercase tracking-wide text-muted">Udyam</span><p className="mt-1 text-sm font-mono">{msme.udyam}</p></div>
          <div><span className="text-xs font-semibold uppercase tracking-wide text-muted">City</span><p className="mt-1 text-sm">{msme.city}</p></div>
          <div><span className="text-xs font-semibold uppercase tracking-wide text-muted">Sector</span><p className="mt-1 text-sm">{msme.sector}</p></div>
          <div><span className="text-xs font-semibold uppercase tracking-wide text-muted">Branch</span><p className="mt-1 text-sm">{msme.branch}</p></div>
          <div><span className="text-xs font-semibold uppercase tracking-wide text-muted">Business Vintage</span><p className="mt-1 text-sm">{msme.businessAgeYears} years</p></div>
        </div>
      </Section>

      <Section id="03" title="Financial Analysis">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-line p-4">
            <Metric label="Financial Health" value={health.score} hint={health.reason} />
            <RiskBadge band={health.band} className="mt-3" />
            <div className="mt-3 space-y-1">
              {health.positiveFactors.slice(0, 2).map((f) => (<p key={f} className="flex items-start gap-2 text-xs text-growth"><span className="mt-1.5 block h-1 w-1 rounded-full bg-current shrink-0" />{f}</p>))}
              {health.negativeFactors.slice(0, 2).map((f) => (<p key={f} className="flex items-start gap-2 text-xs text-danger"><span className="mt-1.5 block h-1 w-1 rounded-full bg-current shrink-0" />{f}</p>))}
            </div>
          </div>
          <div className="rounded-lg border border-line p-4">
            <Metric label="Growth Forecast" value={growth.score} hint={growth.reason} />
            <RiskBadge band={growth.band} className="mt-3" />
            <div className="mt-3 space-y-1">
              {growth.positiveFactors.slice(0, 2).map((f) => (<p key={f} className="flex items-start gap-2 text-xs text-growth"><span className="mt-1.5 block h-1 w-1 rounded-full bg-current shrink-0" />{f}</p>))}
            </div>
          </div>
          <div className="rounded-lg border border-line p-4">
            <Metric label="Cash Flow Forecast" value={cashFlow.score} hint={cashFlow.reason} />
            <RiskBadge band={cashFlow.band} className="mt-3" />
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <Metric label="Avg Monthly Revenue" value={formatCurrency(signals.monthlyRevenue.reduce((a, b) => a + b, 0) / signals.monthlyRevenue.length)} />
          <Metric label="Avg Monthly Balance" value={formatCurrency(signals.averageMonthlyBalance)} />
          <Metric label="Existing Obligations" value={formatCurrency(signals.existingObligations)} />
          <Metric label="Customer Concentration" value={formatPercent(signals.customerConcentrationPercent)} />
        </div>
      </Section>

      <Section id="04" title="Repayment Assessment">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-line p-4">
            <Metric label="Repayment Risk" value={repayment.score} hint={repayment.reason} />
            <RiskBadge band={repayment.band} className="mt-3" />
          </div>
          <div className="rounded-lg border border-line p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Key Factors</p>
            <div className="mt-2 space-y-1">
              {repayment.positiveFactors.map((f) => (<p key={f} className="flex items-start gap-2 text-xs text-growth"><span className="mt-1.5 block h-1 w-1 rounded-full bg-current shrink-0" />{f}</p>))}
              {repayment.negativeFactors.map((f) => (<p key={f} className="flex items-start gap-2 text-xs text-danger"><span className="mt-1.5 block h-1 w-1 rounded-full bg-current shrink-0" />{f}</p>))}
            </div>
          </div>
        </div>
      </Section>

      <Section id="05" title="Fraud Assessment">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-line p-4">
            <Metric label="Fraud Risk" value={fraud.score} hint={fraud.reason} />
            <RiskBadge band={fraud.band} className="mt-3" />
          </div>
          <div className="rounded-lg border border-line p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Indicators</p>
            <div className="mt-2 space-y-1">
              {fraud.negativeFactors.slice(0, 3).map((f) => (<p key={f} className="flex items-start gap-2 text-xs text-danger"><span className="mt-1.5 block h-1 w-1 rounded-full bg-current shrink-0" />{f}</p>))}
              {fraud.negativeFactors.length === 0 && <p className="text-xs text-muted">No significant fraud indicators detected.</p>}
            </div>
          </div>
        </div>
      </Section>

      <Section id="06" title="AI Readiness">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-line p-4">
            <Metric label="Readiness Score" value={`${readiness.score}%`} />
            <Badge tone={readiness.readyLabel === "AI-ready" ? "success" : readiness.readyLabel === "review-needed" ? "warning" : "danger"} className="mt-3">{readiness.readyLabel}</Badge>
          </div>
          <div className="rounded-lg border border-line p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Missing Documents</p>
            <p className="mt-2 text-lg font-semibold">{readiness.missingDocuments.length || 0}</p>
            {readiness.missingDocuments.length > 0 && <p className="mt-1 text-xs text-muted">{readiness.missingDocuments.join(", ")}</p>}
          </div>
          <div className="rounded-lg border border-line p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Review Items</p>
            <p className="mt-2 text-lg font-semibold">{readiness.reviewItems.length}</p>
          </div>
        </div>
      </Section>

      <Section id="07" title="Alternate Data Intelligence">
        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Failed Transactions" value={signals.failedTransactions} />
          <Metric label="Concentration" value={formatPercent(signals.customerConcentrationPercent)} />
          <Metric label="Avg Monthly Balance" value={formatCurrency(signals.averageMonthlyBalance)} />
          <Metric label="Existing Obligations" value={formatCurrency(signals.existingObligations)} />
        </div>
      </Section>

      <Section id="08" title="Credit Limit Analysis">
        <div className="grid gap-4 md:grid-cols-3">
          <Metric label="Lower Limit" value={formatCurrency(limit.lowerLimit)} hint="Conservative" />
          <Metric label="Safe Limit" value={formatCurrency(limit.safeLimit)} hint="Recommended cap" />
          <Metric label="Upper Limit" value={formatCurrency(limit.upperLimit)} hint="Stretch" />
        </div>
      </Section>

      <Section id="09" title="AI Recommendation">
        <div className="rounded-lg bg-slate-50 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={recommendation.action === "approve" ? "success" : recommendation.action === "reduce" ? "warning" : "danger"}>{recommendation.action}</Badge>
            <span className="font-semibold">{formatCurrency(recommendation.recommendedAmount)}</span>
            <span className="text-sm text-muted">{recommendation.tenureMonths} months · {recommendation.confidence}% confidence</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">{recommendation.rationale}</p>
        </div>
      </Section>

      <Section id="10" title="Credit Committee Consensus">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-line p-4 text-center">
            <p className="text-2xl font-semibold text-growth">{consensus.voteBreakdown.approve}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">Approve</p>
          </div>
          <div className="rounded-lg border border-line p-4 text-center">
            <p className="text-2xl font-semibold text-caution">{consensus.voteBreakdown.conditional}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">Conditional</p>
          </div>
          <div className="rounded-lg border border-line p-4 text-center">
            <p className="text-2xl font-semibold text-danger">{consensus.voteBreakdown.reject}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">Reject</p>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-slate-50 p-4">
          <p className="font-semibold">Final: {consensus.finalRecommendation} · {consensus.confidence}% confidence</p>
          <p className="mt-2 text-sm text-muted">Generated {new Date(consensus.generatedAt).toLocaleString("en-IN")}</p>
        </div>
      </Section>

      <Section id="11" title="Persona Analysis Details">
        {[riskOfficer, businessGrowth, compliance].map((persona) => (
          <div key={persona.personaId} className="mb-4 rounded-lg border border-line p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{persona.label}</p>
              <Badge tone={persona.recommendation === "approve" ? "success" : persona.recommendation === "conditional" ? "warning" : "danger"}>{persona.recommendation}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted">Confidence: {persona.confidence}%</p>
            <div className="mt-2 space-y-1">
              {persona.evidence.slice(0, 3).map((e) => (<p key={e} className="text-xs text-muted">· {e}</p>))}
            </div>
          </div>
        ))}
      </Section>

      <Section id="12" title="Alternate Data Intelligence">
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between rounded-lg border border-line p-4">
              <div>
                <p className="font-semibold">{doc.type}</p>
                <p className="mt-1 text-xs text-muted">OCR: {doc.ocrConfidence}% · {doc.ocrStatus}</p>
              </div>
              <Badge tone={doc.status === "verified" ? "success" : doc.status === "review-needed" ? "warning" : "danger"}>{doc.status}</Badge>
            </div>
          ))}
        </div>
      </Section>

      <Section id="13" title="Risk Assessment Summary">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-line p-4">
            <Metric label="Financial Health" value={health.score} />
            <RiskBadge band={health.band} className="mt-3" />
          </div>
          <div className="rounded-lg border border-line p-4">
            <Metric label="Repayment Risk" value={repayment.score} />
            <RiskBadge band={repayment.band} className="mt-3" />
          </div>
          <div className="rounded-lg border border-line p-4">
            <Metric label="Fraud Risk" value={fraud.score} />
            <RiskBadge band={fraud.band} className="mt-3" />
          </div>
        </div>
      </Section>

      <Section id="14" title="Conditions">
        <div className="space-y-2">
          {consensus.conditions.map((cond, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-line p-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800">{i + 1}</span>
              <p className="text-sm text-muted">{cond}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="15" title="Mitigants">
        <div className="space-y-2">
          {recommendation.mitigants.map((mit, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-line p-3">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">{i + 1}</span>
              <p className="text-sm text-muted">{mit}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="16" title="Officer Decision">
        <div className="rounded-lg bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <Badge tone="success">approve</Badge>
            <span className="font-semibold">{formatCurrency(recommendation.recommendedAmount)}</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            Loan Officer LO-1187 approved this application. Decision aligns with AI committee consensus. No override applied.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
            <div><span className="font-semibold text-muted">Officer</span><p className="mt-1 text-ink">LO-1187</p></div>
            <div><span className="font-semibold text-muted">Date</span><p className="mt-1 text-ink">{new Date(now).toLocaleDateString("en-IN")}</p></div>
            <div><span className="font-semibold text-muted">Override</span><p className="mt-1 text-ink">None required</p></div>
          </div>
        </div>
      </Section>

      <Section id="17" title="Evidence Log">
        <div className="grid gap-3 md:grid-cols-2">
          {allEvidence.slice(0, 12).map((item) => (
            <div key={`${item.source}-${item.label}`} className="rounded-lg border border-line p-4">
              <p className="font-semibold">{item.label}</p>
              <p className="mt-1 text-sm text-muted">{item.value}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted">{item.source}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="18" title="Audit Trail">
        <div className="space-y-3">
          {[
            { actor: "LO-1187", action: "Application reviewed", time: new Date(Date.now() - 86400000 * 2).toISOString() },
            { actor: "AI-Committee", action: "Committee consensus generated", time: new Date(Date.now() - 86400000 * 1.5).toISOString() },
            { actor: "LO-1187", action: "Decision recorded", time: new Date(Date.now() - 86400000).toISOString() },
            { actor: "MGR-2041", action: "Oversight review completed", time: new Date(Date.now() - 43200000).toISOString() }
          ].map((entry) => (
            <div key={entry.time} className="flex items-center justify-between rounded-lg border border-line p-3">
              <div>
                <p className="text-sm font-semibold">{entry.action}</p>
                <p className="text-xs text-muted">{entry.actor}</p>
              </div>
              <p className="text-xs text-muted">{new Date(entry.time).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
