import Link from "next/link";
import { Bot, CheckCircle2, Circle, Clock } from "lucide-react";
import { applications, documents, financialSignals } from "@/data/mock-data";
import { calculateCustomerReadiness } from "@/services/customer-support";
import { Badge, Panel, ProgressBar } from "@/components/ui/primitives";

const application = applications[0];
const readiness = calculateCustomerReadiness(
  application,
  documents.filter((document) => document.applicationId === application.id),
  financialSignals[0]
);

const stages = [
  { label: "Submitted", complete: true },
  { label: "Document review", complete: true },
  { label: "Credit analysis", complete: true },
  { label: "Officer decision", complete: false },
  { label: "Sanction communication", complete: false }
];

export function ApplicationStatus() {
  return (
    <div className="space-y-5">
      <Panel>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Application status</h1>
            <p className="mt-2 text-sm leading-6 text-muted">Track your MSME loan request from submission to bank decision.</p>
          </div>
          <Badge tone="warning">{application.status}</Badge>
        </div>
        <ProgressBar value={68} className="mt-5" />
      </Panel>

      <Panel title="Review Timeline">
        <div className="space-y-4">
          {stages.map((stage) => (
            <div key={stage.label} className="flex items-start gap-3">
              {stage.complete ? <CheckCircle2 className="mt-1 h-5 w-5 text-growth" /> : <Circle className="mt-1 h-5 w-5 text-muted" />}
              <div>
                <p className="font-semibold">{stage.label}</p>
                <p className="mt-1 text-sm text-muted">
                  {stage.complete ? "Completed in the simulated bank workflow." : "Pending bank officer action."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Bank Tasks For You">
        <div className="space-y-3">
          {readiness.nextActions.map((action) => (
            <div key={action} className="flex items-start gap-3 rounded-xl border border-line p-4">
              <Clock className="mt-1 h-5 w-5 text-amber-600" />
              <div>
                <p className="font-semibold">{action}</p>
                <p className="mt-1 text-sm text-muted">Completing this can reduce review friction.</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Link href="/customer/support" className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-trust px-4 text-sm font-semibold text-white">
        <Bot className="h-4 w-4" />
        Ask BANK AI about this status
      </Link>
    </div>
  );
}
