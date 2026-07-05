import Link from "next/link";
import { ArrowRight, FileUp, UploadCloud } from "lucide-react";
import { applications, documents, financialSignals } from "@/data/mock-data";
import type { DocumentType } from "@/domain/types";
import { calculateCustomerReadiness } from "@/services/customer-support";
import { Badge, Panel } from "@/components/ui/primitives";

const requiredDocuments: DocumentType[] = ["GST Returns", "Bank Statement", "Udyam", "PAN", "ITR", "Financial Statement"];
const application = applications[0];
const applicationDocuments = documents.filter((document) => document.applicationId === application.id);
const signals = financialSignals[0];

function statusFor(type: DocumentType) {
  return applicationDocuments.find((document) => document.type === type);
}

export function DocumentCenter() {
  const readiness = calculateCustomerReadiness(application, applicationDocuments, signals);

  return (
    <div className="space-y-5">
      <Panel>
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-100 text-trust">
            <UploadCloud className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Document center</h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              Upload documents requested by the bank. This prototype simulates upload status and review issues.
            </p>
          </div>
        </div>
      </Panel>

      <div className="grid gap-3">
        {requiredDocuments.map((type) => {
          const record = statusFor(type);
          const missing = !record;
          return (
            <Panel key={type}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <FileUp className={missing ? "mt-1 h-5 w-5 text-amber-600" : "mt-1 h-5 w-5 text-trust"} />
                  <div>
                    <p className="font-semibold">{type}</p>
                    <p className="mt-1 text-sm text-muted">
                      {record ? `OCR confidence ${record.ocrConfidence}%` : "Not uploaded yet"}
                    </p>
                    {record?.issues.length ? <p className="mt-2 text-sm text-amber-800">{record.issues.join("; ")}</p> : null}
                  </div>
                </div>
                <Badge tone={missing ? "warning" : record.status === "verified" ? "success" : "warning"}>
                  {missing ? "missing" : record.status}
                </Badge>
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel title="BANK AI Readiness Tasks">
        <div className="space-y-2">
          {readiness.nextActions.map((action) => (
            <p key={action} className="rounded-lg bg-slate-50 p-3 text-sm font-medium">
              {action}
            </p>
          ))}
        </div>
        <Link
          href="/customer/status"
          className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-trust px-4 text-sm font-semibold text-white"
        >
          Track application status
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Panel>
    </div>
  );
}
