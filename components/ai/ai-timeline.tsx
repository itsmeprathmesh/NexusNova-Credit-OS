"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, FileText, LineChart, Search, ShieldCheck, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

type AiTimelineStage = {
  id: string;
  label: string;
  status: "complete" | "active" | "pending" | "skipped";
  detail?: string;
};

const stageIcons: Record<string, typeof UserRound> = {
  customer: UserRound,
  documents: FileText,
  financial: LineChart,
  fraud: Search,
  recommendation: ShieldCheck,
  officer: Clock
};

const defaultStages: AiTimelineStage[] = [
  { id: "customer", label: "Customer", status: "complete", detail: "Application received" },
  { id: "documents", label: "Documents", status: "complete", detail: "OCR & validation passed" },
  { id: "financial", label: "Financial Analysis", status: "complete", detail: "Health & repayment scored" },
  { id: "fraud", label: "Fraud", status: "complete", detail: "No indicators found" },
  { id: "recommendation", label: "Recommendation", status: "active", detail: "AI generating decision" },
  { id: "officer", label: "Officer Review", status: "pending", detail: "Awaiting human decision" }
];

export function AITimeline({ stages = defaultStages, className }: { stages?: AiTimelineStage[]; className?: string }) {
  return (
    <div className={cn("space-y-0", className)}>
      {stages.map((stage, index) => {
        const Icon = stageIcons[stage.id] || Circle;
        const isComplete = stage.status === "complete";
        const isActive = stage.status === "active";
        const isSkipped = stage.status === "skipped";
        const isLast = index === stages.length - 1;

        return (
          <div key={stage.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <motion.div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2",
                  isComplete && "border-growth bg-growth/10",
                  isActive && "border-trust bg-trust/10",
                  isSkipped && "border-muted bg-slate-50",
                  !isComplete && !isActive && !isSkipped && "border-line bg-white"
                )}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.08, duration: 0.25 }}
              >
                {isComplete ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: index * 0.08 }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-growth" />
                  </motion.div>
                ) : isActive ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  >
                    <Clock className="h-3.5 w-3.5 text-trust" />
                  </motion.div>
                ) : (
                  <Icon className="h-3.5 w-3.5 text-muted" />
                )}
              </motion.div>
              {!isLast && (
                <div
                  className={cn(
                    "mt-1 w-0.5 flex-1",
                    isComplete ? "bg-growth/30" : "bg-line"
                  )}
                  style={{ minHeight: "20px" }}
                />
              )}
            </div>
            <div className={cn("pb-4", isLast && "pb-0")}>
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, duration: 0.2 }}
              >
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
                {isActive && (
                  <motion.span
                    className="inline-flex items-center gap-1 rounded-full bg-trust/10 px-2 py-0.5 text-[10px] font-semibold text-trust"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-trust" />
                    Processing
                  </motion.span>
                )}
                {isComplete && <CheckCircle2 className="h-3 w-3 text-growth" />}
              </motion.div>
              {stage.detail && (
                <p className="mt-0.5 text-xs text-muted">{stage.detail}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
