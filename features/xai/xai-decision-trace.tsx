"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowDown,
  BarChart3,
  Brain,
  CheckCircle2,
  Database,
  FileSearch,
  ShieldCheck,
  Target,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/primitives";

const traceSteps = [
  {
    id: "raw-data",
    label: "Raw Alternate Data",
    icon: Database,
    detail: "GST returns, UPI transactions, AA banking data, EPFO payroll, utility bills",
    color: "from-blue-500/20 to-blue-500/5",
    textColor: "text-blue-400",
  },
  {
    id: "validation",
    label: "Data Validation",
    icon: FileSearch,
    detail: "Cross-source consistency checks, anomaly detection, format verification",
    color: "from-cyan-500/20 to-cyan-500/5",
    textColor: "text-cyan-400",
  },
  {
    id: "features",
    label: "Feature Engineering",
    icon: BarChart3,
    detail: "Revenue trends, GST compliance scores, UPI stability index, payroll consistency",
    color: "from-green-500/20 to-green-500/5",
    textColor: "text-green-400",
  },
  {
    id: "analysis",
    label: "Financial Behaviour Analysis",
    icon: Activity,
    detail: "Cash flow patterns, repayment capacity, growth trajectory, operational stability",
    color: "from-violet-500/20 to-violet-500/5",
    textColor: "text-violet-400",
  },
  {
    id: "risk",
    label: "Risk Model",
    icon: ShieldCheck,
    detail: "Multi-factor risk scoring, fraud detection, concentration analysis",
    color: "from-orange-500/20 to-orange-500/5",
    textColor: "text-orange-400",
  },
  {
    id: "xai",
    label: "Explainability Engine",
    icon: Brain,
    detail: "Factor contribution analysis, confidence scoring, recommendation generation",
    color: "from-trust/20 to-trust/5",
    textColor: "text-trust",
  },
  {
    id: "health-card",
    label: "Financial Health Card",
    icon: Target,
    detail: "Unified credit assessment with alternate data intelligence",
    color: "from-growth/20 to-growth/5",
    textColor: "text-growth",
  },
  {
    id: "recommendation",
    label: "Loan Recommendation",
    icon: TrendingUp,
    detail: "Product eligibility, amount recommendation, risk-adjusted terms",
    color: "from-amber-500/20 to-amber-500/5",
    textColor: "text-amber-400",
  },
];

export function DecisionTrace({
  activeStep = "health-card",
  className,
}: {
  activeStep?: string;
  className?: string;
}) {
  const activeIdx = traceSteps.findIndex((s) => s.id === activeStep);

  return (
    <GlassPanel className={cn("p-6", className)}>
      <div className="flex items-center gap-2.5">
        <Brain className="h-5 w-5 text-trust" />
        <h3 className="text-sm font-semibold text-ink">How AI Reached This Decision</h3>
      </div>
      <p className="mt-1 text-xs text-muted">
        Every Financial Health Card follows this pipeline — from raw alternate data to
        explainable credit recommendation.
      </p>

      <div className="mt-5 space-y-0">
        {traceSteps.map((step, index) => {
          const Icon = step.icon;
          const isComplete = activeIdx > index;
          const isActive = activeIdx === index;
          const isPending = activeIdx < index;
          const isLast = index === traceSteps.length - 1;

          return (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <motion.div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl border bg-gradient-to-br transition-all duration-300",
                    step.color,
                    "border-white/[0.06]",
                    isActive && "border-trust/40 shadow-[0_0_12px_rgba(216,255,62,0.15)]"
                  )}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.06, duration: 0.25 }}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-growth" />
                  ) : (
                    <Icon className={cn("h-4 w-4", isActive ? "text-trust" : "text-muted/50")} />
                  )}
                </motion.div>
                {!isLast && (
                  <div
                    className={cn(
                      "mt-1 w-0.5 flex-1 transition-all duration-500",
                      isComplete ? "bg-growth/30" : "bg-white/[0.04]"
                    )}
                    style={{ minHeight: "16px" }}
                  />
                )}
              </div>

              <div className={cn("pb-4", isLast && "pb-0", "flex-1")}>
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      "text-sm font-semibold transition-all",
                      isComplete && "text-growth",
                      isActive && "text-trust",
                      isPending && "text-muted/40"
                    )}
                  >
                    {step.label}
                  </p>
                  {isActive && (
                    <Badge tone="info" className="text-[10px] px-1.5 py-0">
                      <span className="relative flex h-1.5 w-1.5 mr-1">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-trust/40" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-trust" />
                      </span>
                      Active
                    </Badge>
                  )}
                  {isComplete && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-growth" />
                  )}
                </div>
                <p className={cn(
                  "mt-0.5 text-xs",
                  isActive ? "text-muted" : "text-muted/50"
                )}>
                  {step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-trust/20 bg-trust-light/20 p-4">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-muted">
          <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-trust" />
          AI provides recommendations based on alternate data analysis. Final approval remains
          with authorised bank officers who can override any AI suggestion.
        </p>
      </div>
    </GlassPanel>
  );
}
