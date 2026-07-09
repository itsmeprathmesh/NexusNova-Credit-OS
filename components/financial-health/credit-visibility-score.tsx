"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, Eye, Info } from "lucide-react";
import type { FinancialSignals, MsmeProfile } from "@/domain/types";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge, ProgressBar } from "@/components/ui/primitives";
import { ConfidenceBar } from "@/components/ai/confidence-indicator";
import { computeCreditVisibility } from "@/services/alternate-data";

const factorColors = [
  "bg-growth",
  "bg-trust",
  "bg-caution",
  "bg-blue-500",
  "bg-violet-500",
] as const;

export function CreditVisibilityScore({
  msme,
  signals,
  className,
}: {
  msme: MsmeProfile;
  signals: FinancialSignals;
  className?: string;
}) {
  const visibility = useMemo(
    () => computeCreditVisibility(signals, msme),
    [msme, signals]
  );

  return (
    <GlassPanel className={cn("p-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-trust-light text-trust">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">
              Credit Visibility Score
            </p>
            <p className="text-[10px] text-muted">
              How much alternate data is available for assessment
            </p>
          </div>
        </div>
        <div className="text-right">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="text-4xl font-bold text-trust"
          >
            {visibility.overallScore}%
          </motion.span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {visibility.factors.map((factor, i) => (
          <motion.div
            key={factor.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink">
                {factor.label}
              </span>
              <span className="text-xs font-semibold text-muted">
                {factor.score}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className={cn("h-full rounded-full", factorColors[i])}
                initial={{ width: 0 }}
                animate={{ width: `${factor.score}%` }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              />
            </div>
            <p className="text-[10px] text-muted/70">{factor.detail}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-trust" />
          <p className="text-xs leading-relaxed text-muted">
            {visibility.explanation}
          </p>
        </div>
      </div>
    </GlassPanel>
  );
}
