"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Clock, XCircle } from "lucide-react";
import { getTimelineStages, getOfficerRequests } from "@/services/app-data";
import { Panel } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const stageDetails: Record<string, { label: string; value: string; status: "passed" | "warning" | "failed" | "pending" }[]> = {
  submitted: [
    { label: "Application Form", value: "Completed", status: "passed" },
    { label: "Product Selection", value: "Working Capital Term Loan", status: "passed" },
    { label: "Amount Verification", value: "Within policy limits", status: "passed" }
  ],
  documents: [
    { label: "GST Returns", value: "Uploaded, 92% OCR confidence", status: "passed" },
    { label: "Bank Statement", value: "Uploaded, 88% OCR confidence", status: "passed" },
    { label: "Udyam Certificate", value: "Uploaded, verified", status: "passed" },
    { label: "PAN Card", value: "Uploaded, verified", status: "passed" },
    { label: "ITR", value: "Pending upload", status: "pending" },
    { label: "Financial Statement", value: "Pending upload", status: "pending" }
  ],
  ocr: [
    { label: "Document Scanning", value: "6/6 documents scanned", status: "passed" },
    { label: "Text Extraction", value: "Average 86% confidence", status: "passed" },
    { label: "Field Extraction", value: "48 fields extracted", status: "passed" }
  ],
  validation: [
    { label: "PAN-GSTIN Match", value: "Consistent", status: "passed" },
    { label: "GST Filing vs Bank Statement", value: "Revenue aligns within 12%", status: "passed" },
    { label: "Udyam Validity", value: "Valid registration", status: "passed" }
  ],
  "ai-review": [
    { label: "Financial Health", value: "78/100 - Low risk", status: "passed" },
    { label: "Repayment Risk", value: "72/100 - Medium risk", status: "passed" },
    { label: "Fraud Risk", value: "24/100 - Low risk", status: "passed" },
    { label: "Growth Forecast", value: "82/100 - Positive trajectory", status: "passed" }
  ],
  committee: [
    { label: "Risk Officer AI", value: "Approve - 82% confidence", status: "passed" },
    { label: "Business Growth AI", value: "Approve - 79% confidence", status: "passed" },
    { label: "Compliance AI", value: "Conditional - 68% confidence", status: "passed" },
    { label: "Consensus", value: "Approve - conditions apply", status: "passed" }
  ],
  officer: [
    { label: "Decision Alignment", value: "Aligned with AI", status: "passed" },
    { label: "Override Required", value: "No", status: "passed" },
    { label: "Rationale Recorded", value: "Approved per committee recommendation", status: "passed" }
  ],
  manager: [
    { label: "Oversight Review", value: "Completed", status: "passed" },
    { label: "Override Applied", value: "None", status: "passed" },
    { label: "Portfolio Impact", value: "Within sector limits", status: "passed" }
  ],
  approved: [
    { label: "Sanction Letter", value: "Generated and queued", status: "passed" },
    { label: "Disbursement Instructions", value: "Ready for approval", status: "passed" }
  ]
};

export function DecisionTimeline({ applicationId, status }: { applicationId: string; status: string }) {
  const stages = getTimelineStages(applicationId, status);
  const officerReqs = getOfficerRequests(applicationId);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  const statusIcon = (stageStatus: string) => {
    if (stageStatus === "complete") return <CheckCircle2 className="h-5 w-5 text-growth" />;
    if (stageStatus === "active") return <Clock className="h-5 w-5 text-trust" />;
    if (stageStatus === "skipped") return <XCircle className="h-5 w-5 text-muted" />;
    return <Circle className="h-5 w-5 text-muted" />;
  };

  const statusLine = (stageStatus: string) => {
    if (stageStatus === "complete") return "bg-growth";
    if (stageStatus === "active") return "bg-trust";
    return "bg-line";
  };

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-trust" />
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">Full Lending Timeline</p>
        </div>
        <p className="mt-1 text-sm text-muted">
          Click on any stage to view detailed checkpoints. {stages.filter((s) => s.status === "complete").length} of {stages.length} stages complete.
        </p>
      </Panel>

      <div className="relative">
        <div className="absolute left-6 top-0 h-full w-0.5 bg-line" />
        <div className="space-y-6">
          {stages.map((stage) => {
            const expanded = expandedStage === stage.id;
            const details = stageDetails[stage.id] || [];

            return (
              <div key={stage.id} className="relative">
                <div
                  className={cn(
                    "relative z-10 flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition hover:border-trust/30",
                    expanded ? "border-trust/30 bg-trust/[0.02]" : "border-line bg-white"
                  )}
                  onClick={() => setExpandedStage(expanded ? null : stage.id)}
                >
                  <div className="mt-0.5 shrink-0">{statusIcon(stage.status)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{stage.label}</p>
                      {stage.timestamp && (
                        <span className="text-xs text-muted">
                          {new Date(stage.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted">{stage.detail}</p>
                    {expanded && details.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {details.map((detail) => {
                          const detailIcon = detail.status === "passed" ? "✓" : detail.status === "warning" ? "!" : detail.status === "failed" ? "✗" : "○";
                          const detailColor = detail.status === "passed" ? "text-growth" : detail.status === "warning" ? "text-caution" : detail.status === "failed" ? "text-danger" : "text-muted";
                          return (
                            <div key={detail.label} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className={cn("font-mono text-xs", detailColor)}>{detailIcon}</span>
                                <span className="text-muted">{detail.label}</span>
                              </div>
                              <span className="font-medium text-ink">{detail.value}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {expanded && stage.id === "documents" && officerReqs.length > 0 && (
                      <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Officer Document Requests</p>
                        {officerReqs.map((req, i) => (
                          <div key={i} className="mt-2 text-xs text-amber-800">
                            <p>Requested: {req.documentTypes.join(", ")}</p>
                            <p>Message: {req.message}</p>
                            <p>{new Date(req.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {expanded && details.length === 0 && (
                      <p className="mt-4 text-xs text-muted">No detailed checkpoints available for this stage.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
