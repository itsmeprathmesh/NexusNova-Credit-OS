"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Bot, Clock, Sparkles, Activity } from "lucide-react";
import { applications, documents, financialSignals, msmes } from "@/data/mock-data";
import { calculateCustomerReadiness } from "@/services/customer-support";
import { computeOverallFinancialHealthScore, computeNtcNtbProfile } from "@/services/alternate-data";
import { Badge, Button, Panel, ProgressBar } from "@/components/ui/primitives";
import { GlassPanel } from "@/components/ui/glass-panel";
import { ConfidenceBar } from "@/components/ai/confidence-indicator";
import { RealTimeBadge } from "@/components/financial-health";
import { CustomerTimeline } from "./customer-timeline";
import { NotificationCenter } from "./notification-center";
import { OnboardingJourney } from "./onboarding-journey";

const application = applications[0];
const msme = msmes.find((item) => item.id === application.msmeId)!;
const signals = financialSignals.find((item) => item.msmeId === msme.id)!;
const readiness = calculateCustomerReadiness(
  application,
  documents.filter((document) => document.applicationId === application.id),
  signals
);

const journeyStages = [
  "welcome",
  "business-profile",
  "gst-connected",
  "upi-connected",
  "aa-connected",
  "epfo-connected",
  "health-generated",
  "loan-ready",
  "submitted",
  "officer-review",
  "manager-review",
  "credit-committee",
  "approved",
];

export function ApplicationStatus() {
  const statusLabel = useMemo(() => {
    const labels: Record<string, string> = {
      "new": "New Application",
      "in-review": "Under Review",
      "documents-needed": "Documents Required",
      "escalated": "Escalated",
      "approved": "Approved",
      "rejected": "Rejected"
    };
    return labels[application.status] || application.status;
  }, []);

  const statusTone = useMemo(() => {
    if (application.status === "approved") return "success" as const;
    if (application.status === "rejected") return "danger" as const;
    if (application.status === "escalated" || application.status === "documents-needed") return "warning" as const;
    return "info" as const;
  }, []);

  const progressValue = useMemo(() => {
    const map: Record<string, number> = {
      "new": 10,
      "in-review": 40,
      "documents-needed": 25,
      "escalated": 60,
      "approved": 95,
      "rejected": 50
    };
    return map[application.status] || 30;
  }, []);

  const healthScore = useMemo(() => computeOverallFinancialHealthScore(msme, signals), []);
  const ntcProfile = useMemo(() => computeNtcNtbProfile(msme, signals), []);

  return (
    <div className="space-y-5">
      <GlassPanel className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-trust" />
              <h1 className="text-2xl font-semibold text-ink">Loan Readiness Journey</h1>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">
              Track your progress from alternate data connection to loan approval.
            </p>
          </div>
          <RealTimeBadge />
        </div>
      </GlassPanel>

      <div className="flex items-center gap-2 rounded-xl border border-trust/20 bg-trust-light/30 px-4 py-3">
        <Sparkles className="h-4 w-4 text-trust" />
        <span className="text-xs text-muted">
          Your Financial Health Score is <span className="font-semibold text-ink">{healthScore.score}/100</span>.
          You are assessed as <span className="font-semibold text-ink">{ntcProfile.creditProfile}</span> —
          {ntcProfile.alternateDataAvailable ? " eligible for alternate data assessment." : " additional data may be required."}
        </span>
      </div>

      <Panel title="Application Status" action={<Badge tone={statusTone}>{statusLabel}</Badge>}>
        <ProgressBar value={progressValue} className="mt-2" />
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>Submitted</span>
          <span>Review</span>
          <span>Decision</span>
        </div>
      </Panel>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <OnboardingJourney stages={journeyStages} activeStage="submitted" />
        <div className="space-y-4">
          <div className="rounded-xl border border-trust/20 bg-trust-light/20 p-4">
            <p className="text-sm font-semibold text-trust">Financial Health</p>
            <p className="mt-2 text-3xl font-bold text-ink">{healthScore.score}<span className="text-sm text-muted">/100</span></p>
            <ConfidenceBar score={healthScore.confidence} className="mt-2" />
            <p className="mt-1 text-xs text-muted">AI Confidence {healthScore.confidence}%</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-sm font-semibold text-ink">Current Stage</p>
            <p className="mt-1 text-sm text-muted">
              Your application has been submitted and is awaiting the next review step.
            </p>
          </div>
        </div>
      </div>

      <CustomerTimeline applicationId={application.id} status={application.status} />

      <NotificationCenter />

      <Panel title="Next Steps For You">
        <div className="space-y-3">
          {readiness.nextActions.length > 0 ? (
            readiness.nextActions.map((action) => (
              <div key={action} className="flex items-start gap-3 rounded-xl border border-white/[0.06] p-4">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-caution" />
                <div>
                  <p className="font-semibold text-ink">{action}</p>
                  <p className="mt-1 text-sm text-muted">Completing this helps AI assess your application faster.</p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-growth/20 bg-growth/5 p-4">
              <p className="font-semibold text-growth">No pending tasks</p>
              <p className="mt-1 text-sm text-muted">All required information has been submitted. The bank will proceed with the review.</p>
            </div>
          )}
        </div>
      </Panel>

      <Button type="button" className="w-full" onClick={() => window.open("/customer/support", "_self")}>
        <Bot className="h-4 w-4" />
        Ask AI about your application status
      </Button>
    </div>
  );
}
