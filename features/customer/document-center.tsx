"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileUp, RefreshCw, UploadCloud, Sparkles, Building2 } from "lucide-react";
import { applications, documents, financialSignals } from "@/data/mock-data";
import type { DocumentType, DocumentUploadStatus } from "@/domain/types";
import { calculateCustomerReadiness } from "@/services/customer-support";
import { addNotification, getOfficerRequests } from "@/services/app-data";
import { Badge, Button, Panel } from "@/components/ui/primitives";
import { GlassPanel } from "@/components/ui/glass-panel";

const requiredDocuments: DocumentType[] = ["GST Returns", "Bank Statement", "Udyam", "PAN", "ITR", "Financial Statement"];
const application = applications[0];
const applicationDocuments = documents.filter((document) => document.applicationId === application.id);
const signals = financialSignals[0];

function statusFor(type: DocumentType) {
  return applicationDocuments.find((document) => document.type === type);
}

export function DocumentCenter() {
  const router = useRouter();
  const [uploading, setUploading] = useState<string | null>(null);
  const readiness = useMemo(() => calculateCustomerReadiness(application, applicationDocuments, signals), []);
  const officerRequests = useMemo(() => getOfficerRequests(application.id), []);

  const requestedTypes = new Set(officerRequests.flatMap((r) => r.documentTypes));

  const handleUpload = (type: DocumentType) => {
    setUploading(type);
    setTimeout(() => {
      setUploading(null);
      addNotification({
        type: "document-verified",
        title: `${type} Uploaded`,
        message: `Your ${type} has been received and sent for verification.`,
        timestamp: new Date().toISOString()
      });
      router.refresh();
    }, 1500);
  };

  return (
    <div className="space-y-5">
      <GlassPanel className="p-6">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-trust-light text-trust">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Business Information Review</h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              Review and upload business information documents. AI will extract key data automatically
              — no manual data entry needed by the bank.
            </p>
          </div>
        </div>
      </GlassPanel>

      <div className="flex items-center gap-2 rounded-xl border border-trust/20 bg-trust-light/30 px-4 py-3">
        <Sparkles className="h-4 w-4 text-trust" />
        <span className="text-xs text-muted">
          Our AI extracts key financial data from every document — turnover, GST filings, bank
          balance, and more. No manual re-entry required.
        </span>
      </div>

      {officerRequests.length > 0 && (
        <div className="rounded-lg border border-caution/30 bg-caution/5 p-4">
          <p className="font-semibold text-caution">Officer Requested Documents</p>
          <p className="mt-1 text-sm text-muted">
            The loan officer has requested the following documents. Please upload them to continue.
          </p>
          <ul className="mt-2 space-y-1">
            {officerRequests.map((req) =>
              req.documentTypes.map((docType) => (
                <li key={docType} className="flex items-center gap-2 text-sm text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-caution" />
                  {docType} — {req.message}
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      <div className="grid gap-3">
        {requiredDocuments.map((type) => {
          const record = statusFor(type);
          const missing = !record;
          const status: DocumentUploadStatus = missing ? "missing" : record.status === "verified" ? "verified" : record.status === "review-needed" ? "under-review" : record.status === "stale" ? "rejected" : "uploaded";
          const isRequested = requestedTypes.has(type);
          const isUploading = uploading === type;

          return (
            <Panel key={type}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  {status === "verified" ? (
                    <CheckCircle2 className="mt-1 h-5 w-5 text-growth" />
                  ) : isUploading ? (
                    <RefreshCw className="mt-1 h-5 w-5 animate-spin text-trust" />
                  ) : (
                    <FileUp className={`mt-1 h-5 w-5 ${isRequested ? "text-caution" : missing ? "text-amber-600" : "text-trust"}`} />
                  )}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-ink">{type}</p>
                      {isRequested && <Badge tone="warning">Officer requested</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {isUploading ? "Uploading..." : record ? `AI confidence ${record.ocrConfidence}%` : "Not uploaded yet"}
                    </p>
                    {record?.issues.length ? <p className="mt-2 text-sm text-caution">{record.issues.join("; ")}</p> : null}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={status === "verified" ? "success" : status === "rejected" ? "danger" : isRequested ? "warning" : "neutral"}>
                    {status === "missing" ? "missing" : status === "verified" ? "verified" : status === "under-review" ? "under review" : status === "rejected" ? "rejected" : "uploaded"}
                  </Badge>
                  {(missing || isRequested) && (
                    <Button type="button" variant="secondary" onClick={() => handleUpload(type)} disabled={isUploading}>
                      {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                  )}
                </div>
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel title="AI Review Summary">
        <div className="space-y-2">
          {readiness.nextActions.slice(0, 4).map((action) => (
            <p key={action} className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3 text-sm font-medium text-ink">
              {action}
            </p>
          ))}
          {readiness.nextActions.length === 0 && (
            <p className="rounded-lg bg-growth/5 border border-growth/20 p-3 text-sm font-medium text-growth">
              All information is in order. AI assessment can proceed.
            </p>
          )}
        </div>
        <div className="mt-5 flex gap-3">
          <Button type="button" onClick={() => router.push("/customer/status")}>
            Track application status
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/customer/support")}>
            Ask AI
          </Button>
        </div>
      </Panel>
    </div>
  );
}
