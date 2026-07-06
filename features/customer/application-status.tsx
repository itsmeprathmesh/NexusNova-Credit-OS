"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Bot, Clock } from "lucide-react";
import { applications, documents, financialSignals } from "@/data/mock-data";
import { calculateCustomerReadiness } from "@/services/customer-support";
import { Badge, Button, Panel, ProgressBar } from "@/components/ui/primitives";
import { CustomerTimeline } from "./customer-timeline";
import { NotificationCenter } from "./notification-center";

const application = applications[0];
const readiness = calculateCustomerReadiness(
  application,
  documents.filter((document) => document.applicationId === application.id),
  financialSignals[0]
);

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

  return (
    <div className="space-y-5">
      <Panel>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Application status</h1>
            <p className="mt-2 text-sm leading-6 text-muted">Track your MSME loan request from submission to bank decision.</p>
          </div>
          <Badge tone={statusTone}>{statusLabel}</Badge>
        </div>
        <ProgressBar value={progressValue} className="mt-5" />
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>Submitted</span>
          <span>Review</span>
          <span>Decision</span>
        </div>
      </Panel>

      <CustomerTimeline applicationId={application.id} status={application.status} />

      <NotificationCenter />

      <Panel title="Bank Tasks For You">
        <div className="space-y-3">
          {readiness.nextActions.length > 0 ? (
            readiness.nextActions.map((action) => (
              <div key={action} className="flex items-start gap-3 rounded-xl border border-line p-4">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-caution" />
                <div>
                  <p className="font-semibold text-ink">{action}</p>
                  <p className="mt-1 text-sm text-muted">Completing this can reduce review friction.</p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-line bg-growth/5 p-4">
              <p className="font-semibold text-growth">No pending tasks</p>
              <p className="mt-1 text-sm text-muted">All required information has been submitted. The bank will proceed with the review.</p>
            </div>
          )}
        </div>
      </Panel>

      <Button type="button" className="w-full" onClick={() => window.open("/customer/support", "_self")}>
        <Bot className="h-4 w-4" />
        Ask BANK AI about this status
      </Button>
    </div>
  );
}
