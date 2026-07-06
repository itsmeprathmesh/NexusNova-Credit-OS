"use client";

import { useCallback, useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { CommitteeAuditEntry, DecisionAction, FinancialSignals, LoanApplication, MsmeProfile } from "@/domain/types";
import { CommitteePersonaPanel } from "./committee-persona-panel";
import { CommitteeConsensusPanel } from "./committee-consensus-panel";
import { CommitteeDecisionPanel } from "./committee-decision-panel";
import { computeCommitteeConsensus, runBusinessGrowthAnalysis, runComplianceAnalysis, runRiskOfficerAnalysis } from "@/services/credit-committee";

let auditIdCounter = 0;
function nextAuditId() {
  auditIdCounter += 1;
  return `audit-${Date.now()}-${auditIdCounter}`;
}

export function AiCreditCommittee({
  application,
  msme,
  signals
}: {
  application: LoanApplication;
  msme: MsmeProfile;
  signals: FinancialSignals;
}) {
  const [expanded, setExpanded] = useState(false);
  const [auditLog, setAuditLog] = useState<CommitteeAuditEntry[]>([]);

  const riskOfficer = useMemo(() => runRiskOfficerAnalysis(msme, signals), [msme, signals]);
  const businessGrowth = useMemo(() => runBusinessGrowthAnalysis(msme, signals), [msme, signals]);
  const compliance = useMemo(() => runComplianceAnalysis(application.id, signals), [application.id, signals]);

  const personas = useMemo(() => [riskOfficer, businessGrowth, compliance], [riskOfficer, businessGrowth, compliance]);

  const consensus = useMemo(
    () => computeCommitteeConsensus(personas, application, msme, signals),
    [personas, application, msme, signals]
  );

  const handleRecordDecision = useCallback(
    (action: DecisionAction, amount: number, rationale: string, overrideRationale: string | null) => {
      const now = new Date().toISOString();
      const overrideLabel = overrideRationale ? ` (override: ${overrideRationale})` : "";

      const committeeEntry: CommitteeAuditEntry = {
        id: nextAuditId(),
        actor: "AI Credit Committee",
        role: "system",
        action: `Consensus: ${consensus.finalRecommendation} for ${formatShortAmount(consensus.suggestedAmount)}`,
        details: `${consensus.confidence}% confidence, ${consensus.voteBreakdown.approve}-${consensus.voteBreakdown.conditional}-${consensus.voteBreakdown.reject}`,
        timestamp: consensus.generatedAt
      };

      const officerEntry: CommitteeAuditEntry = {
        id: nextAuditId(),
        actor: "Loan Officer",
        role: "loan-officer",
        action: `Decision: ${action} for ${formatShortAmount(amount)}${overrideLabel}`,
        details: overrideRationale ? `Override from AI recommendation` : `Aligned with AI recommendation`,
        timestamp: now
      };

      setAuditLog((prev) => [committeeEntry, officerEntry, ...prev]);
    },
    [consensus]
  );

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-lg border border-line bg-panel p-4 text-left shadow-sm transition hover:bg-slate-50"
      >
        <div className="flex items-center gap-3">
          {expanded ? <ChevronDown className="h-5 w-5 text-muted" /> : <ChevronRight className="h-5 w-5 text-muted" />}
          <div>
            <p className="font-semibold text-ink">AI Credit Committee</p>
            <p className="text-sm text-muted">
              {expanded ? "Collapse committee view" : `${consensus.finalRecommendation} · ${consensus.confidence}% confidence · ${auditLog.length} audit entries`}
            </p>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <CommitteePersonaPanel recommendation={riskOfficer} />
            <CommitteePersonaPanel recommendation={businessGrowth} />
            <CommitteePersonaPanel recommendation={compliance} />
          </div>

          <CommitteeConsensusPanel consensus={consensus} />

          <CommitteeDecisionPanel
            consensus={consensus}
            msme={msme}
            auditLog={auditLog}
            onRecordDecision={handleRecordDecision}
          />
        </div>
      )}
    </div>
  );
}

function formatShortAmount(amount: number) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${(amount / 1000).toFixed(0)}K`;
}
