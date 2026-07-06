"use client";

import { useMemo } from "react";
import { CheckCircle2, Circle, Clock, Dot } from "lucide-react";
import type { TimelineStage } from "@/domain/types";
import { getTimelineStages } from "@/services/app-data";
import { cn } from "@/lib/utils";
import { Badge, Panel } from "@/components/ui/primitives";

const stageIcons: Record<string, typeof Circle> = {
  submitted: CheckCircle2,
  documents: CheckCircle2,
  ocr: CheckCircle2,
  validation: CheckCircle2,
  "ai-review": CheckCircle2,
  committee: CheckCircle2,
  officer: CheckCircle2,
  manager: CheckCircle2,
  approved: CheckCircle2
};

export function CustomerTimeline({ applicationId, status }: { applicationId: string; status: string }) {
  const stages = useMemo(() => getTimelineStages(applicationId, status), [applicationId, status]);
  const completedCount = stages.filter((s) => s.status === "complete").length;
  const totalCount = stages.length;

  if (stages.length === 0) {
    return (
      <Panel title="Application Timeline">
        <p className="text-sm text-muted">Timeline will appear once the application is submitted.</p>
      </Panel>
    );
  }

  return (
    <Panel title="Application Timeline" action={<Badge tone="info">{completedCount}/{totalCount} stages</Badge>}>
      <div className="space-y-0">
        {stages.map((stage, index) => {
          const Icon = stageIcons[stage.id] || Circle;
          const isComplete = stage.status === "complete";
          const isActive = stage.status === "active";
          const isSkipped = stage.status === "skipped";
          const isLast = index === stages.length - 1;

          return (
            <div key={stage.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2",
                    isComplete && "border-growth bg-growth/10",
                    isActive && "border-trust bg-trust/10",
                    isSkipped && "border-muted bg-slate-50",
                    !isComplete && !isActive && !isSkipped && "border-line bg-white"
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-growth" />
                  ) : isActive ? (
                    <Clock className="h-4 w-4 text-trust" />
                  ) : isSkipped ? (
                    <Dot className="h-5 w-5 text-muted" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted" />
                  )}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "mt-1 w-0.5 flex-1",
                      isComplete ? "bg-growth/30" : "bg-line"
                    )}
                    style={{ minHeight: "24px" }}
                  />
                )}
              </div>
              <div className={cn("pb-6", isLast && "pb-0")}>
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isComplete && "text-growth",
                      isActive && "text-trust",
                      isSkipped && "text-muted line-through",
                      !isComplete && !isActive && !isSkipped && "text-muted"
                    )}
                  >
                    {stage.label}
                  </p>
                  {isActive && <Badge tone="info">In progress</Badge>}
                  {isComplete && stage.timestamp && (
                    <span className="text-xs text-muted">
                      {new Date(stage.timestamp).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    </span>
                  )}
                  {isSkipped && <Badge tone="neutral">Skipped</Badge>}
                </div>
                <p className="mt-1 text-xs text-muted">{stage.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
