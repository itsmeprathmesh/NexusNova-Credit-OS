import { useMemo } from "react";
import { AlertTriangle, CheckCircle2, FileWarning } from "lucide-react";
import type { AiReadiness } from "@/services/intelligence";
import { Badge, Panel, ProgressBar } from "@/components/ui/primitives";

function readinessTone(label: AiReadiness["readyLabel"]) {
  if (label === "AI-ready") return "success" as const;
  if (label === "review-needed") return "warning" as const;
  return "danger" as const;
}

export function AiReadinessPanel({ readiness }: { readiness: AiReadiness }) {
  return (
    <Panel title="AI Readiness Assessment">
      <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
        <div className="space-y-4">
          <div className="rounded-lg border border-line p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">AI Readiness</p>
            <p className="mt-2 text-4xl font-semibold text-ink">{readiness.score}%</p>
            <ProgressBar value={readiness.score} className="mt-3" />
            <Badge tone={readinessTone(readiness.readyLabel)} className="mt-3">
              {readiness.readyLabel}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          {readiness.missingDocuments.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Missing documents</p>
              <div className="space-y-2">
                {readiness.missingDocuments.map((doc) => (
                  <div key={doc} className="flex items-center gap-2 text-sm">
                    <FileWarning className="h-4 w-4 text-danger" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {readiness.reviewItems.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Review items</p>
              <div className="space-y-2">
                {readiness.reviewItems.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-caution" />
                    <span className="text-muted">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {readiness.readyLabel === "AI-ready" && (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-growth" />
              <span className="text-muted">All documents verified. AI analysis can proceed.</span>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
