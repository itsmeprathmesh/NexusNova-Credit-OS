import type { DocumentRecord, FinancialSignals, LoanApplication, MsmeProfile } from "@/domain/types";
import {
  calculateFinancialHealth,
  calculateFraudRisk,
  calculateRepaymentRisk,
  createLoanRecommendation
} from "@/services/intelligence";
import { formatCurrency } from "@/lib/format";
import { Badge, Metric, Panel, RiskBadge } from "@/components/ui/primitives";

export function CreditMemo({
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
  const evidence = [...health.evidence, ...repayment.evidence, ...fraud.evidence];

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">Credit Memo Preview</p>
            <h2 className="mt-1 text-2xl font-semibold">{msme.name}</h2>
            <p className="mt-2 text-sm text-muted">
              {application.id} · {msme.branch} · {msme.owner} · {msme.city}
            </p>
          </div>
          <Badge tone="info">Draft · audit-ready</Badge>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-4">
        <Panel>
          <Metric label="Requested Amount" value={formatCurrency(application.requestedAmount)} />
        </Panel>
        <Panel>
          <Metric label="Recommended Amount" value={formatCurrency(recommendation.recommendedAmount)} />
        </Panel>
        <Panel>
          <Metric label="Tenure" value={`${recommendation.tenureMonths} months`} />
        </Panel>
        <Panel>
          <Metric label="Confidence" value={`${recommendation.confidence}%`} />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Risk And Recommendation">
          <div className="space-y-4">
            {[
              { label: "Financial health", result: health },
              { label: "Repayment risk", result: repayment },
              { label: "Fraud risk", result: fraud }
            ].map((item) => (
              <div key={item.label} className="flex items-start justify-between gap-4 rounded-lg border border-line p-4">
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="mt-1 text-sm text-muted">{item.result.reason}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{item.result.score}</p>
                  <RiskBadge band={item.result.band} className="mt-1" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg bg-slate-50 p-4">
            <p className="font-semibold">AI recommendation: {recommendation.action}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{recommendation.rationale}</p>
          </div>
        </Panel>

        <Panel title="Document Findings">
          <div className="space-y-3">
            {documents.map((document) => (
              <div key={document.id} className="rounded-lg border border-line p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{document.type}</p>
                  <Badge tone={document.status === "verified" ? "success" : "warning"}>{document.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted">OCR confidence {document.ocrConfidence}%</p>
                {document.issues.length > 0 ? <p className="mt-2 text-sm text-amber-800">{document.issues.join("; ")}</p> : null}
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Evidence List">
        <div className="grid gap-3 md:grid-cols-2">
          {evidence.map((item) => (
            <div key={`${item.source}-${item.label}`} className="rounded-lg border border-line p-4">
              <p className="font-semibold">{item.label}</p>
              <p className="mt-1 text-sm text-muted">{item.value}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted">{item.source}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Officer Decision And Audit Log">
        <div className="rounded-lg border border-dashed border-line p-4">
          <p className="font-semibold">Officer decision pending</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Final approval, override rationale, timestamp, role, and linked evidence will be recorded after the loan
            officer completes the decision workflow.
          </p>
        </div>
      </Panel>
    </div>
  );
}
