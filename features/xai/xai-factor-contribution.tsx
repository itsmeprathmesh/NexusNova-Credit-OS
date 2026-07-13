"use client";

import { motion } from "motion/react";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import type { FinancialSignals } from "@/domain/types";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/glass-panel";
import { computeAlternateDataSignals } from "@/services/alternate-data";

export interface FactorContribution {
  label: string;
  contribution: number;
  breakdown: { label: string; value: number; good: boolean }[];
  source: "gst" | "upi" | "account-aggregator" | "epfo" | "utility" | "other";
}

const sourceColors = {
  gst: "bg-blue-500",
  upi: "bg-green-500",
  "account-aggregator": "bg-orange-500",
  epfo: "bg-violet-500",
  utility: "bg-cyan-500",
  other: "bg-muted",
} as const;

const sourceLabels = {
  gst: "GST",
  upi: "UPI",
  "account-aggregator": "AA",
  epfo: "EPFO",
  utility: "Utility",
  other: "Other",
} as const;

export function FactorContribution({
  factors,
  title = "Factor Contribution",
  className,
}: {
  factors: FactorContribution[];
  title?: string;
  className?: string;
}) {
  const total = factors.reduce((s, f) => s + f.contribution, 0);

  return (
    <GlassPanel className={cn("p-6", className)}>
      <div className="flex items-center gap-2.5">
        <BarChart3 className="h-5 w-5 text-trust" />
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
      </div>

      <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-white/[0.06]">
        {factors.map((factor) => {
          const pct = Math.round((factor.contribution / total) * 100);
          return (
            <motion.div
              key={factor.label}
              className={cn("h-full transition-all", sourceColors[factor.source])}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              title={`${factor.label}: ${pct}%`}
            />
          );
        })}
      </div>

      <div className="mt-4 space-y-3">
        {factors.map((factor, i) => {
          const pct = Math.round((factor.contribution / total) * 100);
          return (
            <motion.div
              key={factor.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2.5 w-2.5 rounded-full", sourceColors[factor.source])} />
                  <span className="text-sm font-semibold text-ink">{factor.label}</span>
                </div>
                <span className="text-sm font-semibold text-trust">{pct}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className={cn("h-full rounded-full", sourceColors[factor.source])}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {factor.breakdown.map((b) => (
                  <span key={b.label} className="flex items-center gap-1 text-xs text-muted">
                    {b.good ? (
                      <TrendingUp className="h-3 w-3 text-growth" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-danger" />
                    )}
                    {b.label}: <span className="font-medium">{b.value}%</span>
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-muted leading-relaxed">
        This score is based primarily on verified alternate data sources. Higher contributions
        from GST and banking signals indicate reliable compliance and cash flow visibility.
      </p>
    </GlassPanel>
  );
}

export function computeFactorContributions(signals: FinancialSignals): FactorContribution[] {
  const altSignals = computeAlternateDataSignals(signals);
  const gstMetrics = altSignals.find((d) => d.source === "gst")?.metrics || [];
  const upiMetrics = altSignals.find((d) => d.source === "upi")?.metrics || [];
  const aaMetrics = altSignals.find((d) => d.source === "account-aggregator")?.metrics || [];
  const epfoMetrics = altSignals.find((d) => d.source === "epfo")?.metrics || [];
  const utilityMetrics = altSignals.find((d) => d.source === "utility")?.metrics || [];

  return [
    {
      label: "GST",
      contribution: 28,
      source: "gst",
      breakdown: [
        { label: "Filing Consistency", value: gstMetrics.find((m) => m.label === "Compliance")?.value ? 96 : 85, good: true },
        { label: "Growth", value: Math.abs(parseInt(gstMetrics.find((m) => m.label === "Growth")?.value || "0")), good: true },
      ],
    },
    {
      label: "UPI",
      contribution: 22,
      source: "upi",
      breakdown: [
        { label: "Stability", value: parseInt(upiMetrics.find((m) => m.label === "Stability")?.value || "90"), good: true },
        { label: "Volume", value: upiMetrics.length > 0 ? 85 : 0, good: true },
      ],
    },
    {
      label: "Account Aggregator",
      contribution: 25,
      source: "account-aggregator",
      breakdown: [
        { label: "Cash Flow", value: aaMetrics.find((m) => m.label === "Cash Flow")?.value === "Strong" ? 92 : 60, good: true },
        { label: "Working Capital", value: aaMetrics.find((m) => m.label === "Working Capital")?.value === "Stable" ? 88 : 55, good: true },
      ],
    },
    {
      label: "EPFO",
      contribution: 15,
      source: "epfo",
      breakdown: [
        { label: "Payroll", value: parseInt(epfoMetrics.find((m) => m.label === "Payroll Consistency")?.value || "90"), good: true },
        { label: "Coverage", value: epfoMetrics.length > 0 ? 78 : 0, good: true },
      ],
    },
    {
      label: "Utility Bills",
      contribution: 10,
      source: "utility",
      breakdown: [
        { label: "Stability", value: utilityMetrics.find((m) => m.label === "Business Stability")?.value === "High" ? 90 : 60, good: true },
        { label: "Regularity", value: utilityMetrics.length > 0 ? 85 : 0, good: true },
      ],
    },
  ];
}
