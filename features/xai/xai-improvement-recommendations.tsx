"use client";

import { motion } from "motion/react";
import { ArrowUp, Lightbulb, TrendingUp } from "lucide-react";
import type { FinancialSignals } from "@/domain/types";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/primitives";
import { computeAlternateDataSignals } from "@/services/alternate-data";

export interface Improvement {
  category: string;
  action: string;
  impact: "high" | "medium" | "low";
  reason: string;
}

const impactColors = {
  high: "bg-trust text-canvas",
  medium: "bg-caution-light text-caution",
  low: "bg-white/[0.04] text-muted",
} as const;

export function ImprovementRecommendations({
  improvements,
  score,
  className,
}: {
  improvements: Improvement[];
  score: number;
  className?: string;
}) {
  if (score >= 80) {
    return (
      <GlassPanel className={cn("p-6 border-growth/20", className)}>
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-growth/10 text-growth">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Strong Financial Health</p>
            <p className="text-xs text-muted">
              Your alternate data profile is robust. Continue maintaining GST compliance and
              UPI transaction consistency.
            </p>
          </div>
        </div>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className={cn("p-6", className)}>
      <div className="flex items-center gap-2.5">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-caution-light text-caution">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">How to Improve Your Score</p>
          <p className="text-xs text-muted">
            Based on your alternate data profile, these actions would have the highest impact.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {improvements.map((imp, i) => (
          <motion.div
            key={imp.category}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
          >
            <div className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", impactColors[imp.impact])}>
              <ArrowUp className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-ink">{imp.action}</p>
                <Badge
                  tone={imp.impact === "high" ? "success" : imp.impact === "medium" ? "warning" : "neutral"}
                  className="text-[10px] px-1.5 py-0"
                >
                  {imp.impact} impact
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted">{imp.reason}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassPanel>
  );
}

export function computeImprovements(signals: FinancialSignals): Improvement[] {
  const altSignals = computeAlternateDataSignals(signals);
  const improvements: Improvement[] = [];
  const gstMetrics = altSignals.find((d) => d.source === "gst")?.metrics || [];
  const upiMetrics = altSignals.find((d) => d.source === "upi")?.metrics || [];
  const epfoMetrics = altSignals.find((d) => d.source === "epfo")?.metrics || [];

  const gstGrowth = gstMetrics.find((m) => m.label === "Growth")?.value || "0%";
  const gstGrowthVal = parseInt(gstGrowth);
  if (gstGrowthVal < 15) {
    improvements.push({
      category: "gst",
      action: "Increase GST filing consistency",
      impact: "high",
      reason: "More consistent GST returns improve compliance signal and visibility.",
    });
  }

  const upiStability = parseInt(upiMetrics.find((m) => m.label === "Stability")?.value || "0");
  if (upiStability < 90) {
    improvements.push({
      category: "upi",
      action: "Improve UPI transaction stability",
      impact: "high",
      reason: "Stable digital collections demonstrate reliable cash flow cycles.",
    });
  }

  if (signals.failedTransactions > 3) {
    improvements.push({
      category: "banking",
      action: "Reduce failed transactions",
      impact: "high",
      reason: `${signals.failedTransactions} failed transactions indicate potential cash flow stress.`,
    });
  }

  if (signals.customerConcentrationPercent > 35) {
    improvements.push({
      category: "concentration",
      action: "Diversify customer base",
      impact: "medium",
      reason: `${signals.customerConcentrationPercent}% revenue from top customer — diversify to reduce concentration risk.`,
    });
  }

  const epfoEmployees = epfoMetrics.find((m) => m.label === "Employees")?.value || "0";
  if (parseInt(epfoEmployees) < 10) {
    improvements.push({
      category: "epfo",
      action: "Register additional employees through EPFO",
      impact: "medium",
      reason: "Formal payroll data strengthens business stability assessment.",
    });
  }

  if (signals.averageMonthlyBalance < 500000) {
    improvements.push({
      category: "banking",
      action: "Maintain higher average account balance",
      impact: "medium",
      reason: "Higher balances improve liquidity assessment and repayment confidence.",
    });
  }

  improvements.push({
    category: "data",
    action: "Connect more verified alternate data sources",
    impact: "low",
    reason: "Additional data sources increase Credit Visibility Score and AI confidence.",
  });

  return improvements;
}
