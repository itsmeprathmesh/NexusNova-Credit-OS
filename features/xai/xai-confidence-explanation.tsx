"use client";

import { motion } from "framer-motion";
import { Brain, CheckCircle2, Info, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge, ProgressBar } from "@/components/ui/primitives";
import { ConfidenceBar } from "@/components/ai/confidence-indicator";

export function ConfidenceExplanation({
  score,
  label,
  explanation,
  factors,
  className,
}: {
  score: number;
  label: string;
  explanation: string;
  factors: { label: string; status: "positive" | "negative" | "neutral" }[];
  className?: string;
}) {
  const tone = score >= 80 ? "success" : score >= 60 ? "warning" : "info";

  return (
    <GlassPanel className={cn("p-6", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "grid h-10 w-10 place-items-center rounded-xl",
              tone === "success" && "bg-growth/10 text-growth",
              tone === "warning" && "bg-caution-light text-caution",
              tone === "info" && "bg-trust-light text-trust"
            )}
          >
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">AI Confidence</p>
            <p className="text-[10px] text-muted">{label}</p>
          </div>
        </div>
        <div className="text-right">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className={cn(
              "text-3xl font-bold",
              tone === "success" && "text-growth",
              tone === "warning" && "text-caution",
              tone === "info" && "text-trust"
            )}
          >
            {score}%
          </motion.span>
        </div>
      </div>

      <ConfidenceBar score={score} className="mt-3" />

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-trust/20 bg-trust-light/20 p-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-trust" />
        <p className="text-xs leading-relaxed text-muted">{explanation}</p>
      </div>

      <div className="mt-4 space-y-2">
        {factors.map((factor) => (
          <div
            key={factor.label}
            className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
          >
            <span className="text-xs text-ink">{factor.label}</span>
            {factor.status === "positive" ? (
              <span className="flex items-center gap-1 text-xs font-medium text-growth">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </span>
            ) : factor.status === "negative" ? (
              <span className="flex items-center gap-1 text-xs font-medium text-caution">
                <ShieldCheck className="h-3 w-3" />
                Limited
              </span>
            ) : (
              <span className="text-xs text-muted">Available</span>
            )}
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

export function getConfidenceExplanation(score: number): {
  label: string;
  explanation: string;
  factors: { label: string; status: "positive" | "negative" | "neutral" }[];
} {
  if (score >= 80) {
    return {
      label: "High Confidence",
      explanation:
        "High confidence because multiple verified alternate data sources (GST, UPI, AA, EPFO) agree on the assessment. The AI has sufficient cross-validated data to make a reliable prediction.",
      factors: [
        { label: "GST Returns", status: "positive" },
        { label: "UPI Transactions", status: "positive" },
        { label: "Account Aggregator", status: "positive" },
        { label: "EPFO Payroll", status: "positive" },
        { label: "Traditional Documents", status: "neutral" },
      ],
    };
  }
  if (score >= 60) {
    return {
      label: "Moderate Confidence",
      explanation:
        "Moderate confidence — some alternate data sources are available but the assessment would benefit from additional data points. Connecting more sources will improve confidence.",
      factors: [
        { label: "GST Returns", status: "positive" },
        { label: "UPI Transactions", status: "positive" },
        { label: "Account Aggregator", status: "neutral" },
        { label: "EPFO Payroll", status: "negative" },
        { label: "Traditional Documents", status: "neutral" },
      ],
    };
  }
  return {
    label: "Low Confidence",
    explanation:
      "Lower confidence because fewer data sources are available. The AI recommends connecting additional alternate data sources before making a final assessment.",
    factors: [
      { label: "GST Returns", status: "neutral" },
      { label: "UPI Transactions", status: "negative" },
      { label: "Account Aggregator", status: "negative" },
      { label: "EPFO Payroll", status: "negative" },
      { label: "Traditional Documents", status: "neutral" },
    ],
  };
}
