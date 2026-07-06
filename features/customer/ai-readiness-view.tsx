import { AlertTriangle, CheckCircle2, FileWarning } from "lucide-react";
import type { AiReadiness } from "@/services/intelligence";
import type { CustomerReadiness } from "@/services/customer-support";
import { formatCurrency } from "@/lib/format";
import { Badge, Panel, ProgressBar } from "@/components/ui/primitives";

export function AiReadinessView({
  customerReadiness,
  aiReadiness
}: {
  customerReadiness: CustomerReadiness;
  aiReadiness: AiReadiness | null;
}) {
  type Tone = "success" | "warning" | "danger" | "info";

  function readinessTone(score: number, label: AiReadiness["readyLabel"] | null): Tone {
    if (label === "blocked") return "danger";
    if (label === "review-needed") return "warning";
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "danger";
  }

  const blocks: { label: string; score: number; items: string[]; tone: Tone }[] = [
    {
      label: "Application Readiness",
      score: customerReadiness.score,
      items: customerReadiness.nextActions.slice(0, 2),
      tone: readinessTone(customerReadiness.score, null)
    },
    {
      label: "Document Readiness",
      score: aiReadiness ? aiReadiness.score : customerReadiness.score,
      items: customerReadiness.missingDocuments.length > 0
        ? customerReadiness.missingDocuments.map((d) => `Missing: ${d}`)
        : customerReadiness.reviewItems.slice(0, 2),
      tone: readinessTone(customerReadiness.score, null)
    },
    {
      label: "Financial Readiness",
      score: Math.round((customerReadiness.score + 70) / 2),
      items: customerReadiness.estimatedEligibleAmount > 0
        ? [`Estimated eligible: ${formatCurrency(customerReadiness.estimatedEligibleAmount)}`]
        : ["Financial data under review"],
      tone: "info"
    },
    {
      label: "Compliance Readiness",
      score: aiReadiness?.readyLabel === "AI-ready" ? 95 : aiReadiness?.readyLabel === "review-needed" ? 65 : 45,
      items: aiReadiness?.readyLabel !== "AI-ready"
        ? (aiReadiness?.reviewItems ?? ["Compliance review pending"]).slice(0, 2)
        : ["All compliance checks passed"],
      tone: readinessTone(45, aiReadiness?.readyLabel ?? null)
    }
  ];

  return (
    <Panel title="AI Readiness Breakdown">
      <div className="grid gap-4 sm:grid-cols-2">
        {blocks.map((block) => (
          <div key={block.label} className="rounded-lg border border-line p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{block.label}</p>
              <Badge tone={block.tone}>{block.score}%</Badge>
            </div>
            <ProgressBar value={block.score} className="mt-3" />
            <div className="mt-3 space-y-1.5">
              {block.items.map((item) => (
                <p key={item} className="flex items-start gap-2 text-xs text-muted">
                  {item.startsWith("Missing") || item.startsWith("Compliance review")
                    ? <FileWarning className="mt-0.5 h-3.5 w-3.5 shrink-0 text-caution" />
                    : item.startsWith("All")
                      ? <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-growth" />
                      : <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-trust" />
                  }
                  {item}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
