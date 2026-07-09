"use client";

import { useMemo } from "react";
import {
  ArrowUp,
  ArrowDown,
  Brain,
  CheckCircle2,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Target,
  BarChart3,
  Sparkles,
} from "lucide-react";
import type { FinancialSignals } from "@/domain/types";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge, ProgressBar, Metric } from "@/components/ui/primitives";
import { ConfidenceBar } from "@/components/ai/confidence-indicator";
import { RealTimeBadge } from "@/components/financial-health";
import { computeAlternateDataSignals } from "@/services/alternate-data";

export type LoanReadinessData = {
  score: number;
  label: string;
  recommendation: string;
  strengths: { label: string; detail: string }[];
  improvements: { label: string; detail: string }[];
  nextActions: { action: string; reason: string }[];
};

export function LoanReadinessPanel({
  readiness,
  signals,
  className,
}: {
  readiness: LoanReadinessData;
  signals: FinancialSignals;
  className?: string;
}) {
  const altSignals = useMemo(() => computeAlternateDataSignals(signals), [signals]);

  const tone = readiness.score >= 75 ? "success" : readiness.score >= 55 ? "warning" : "info";

  return (
    <GlassPanel className={cn("p-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-trust-light text-trust">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Loan Readiness</p>
            <p className="text-[10px] text-muted">AI-powered eligibility assessment</p>
          </div>
        </div>
        <RealTimeBadge />
      </div>

      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-ink">{readiness.score}</span>
            <span className="text-lg text-muted">/ 100</span>
            <Badge tone={tone} className="text-[10px]">{readiness.label}</Badge>
          </div>
          <ProgressBar value={readiness.score} className="mt-3" />
          <p className="mt-2 text-sm text-muted leading-relaxed">{readiness.recommendation}</p>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-growth/20 bg-growth-light/20 p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-growth" />
              <p className="text-xs font-semibold uppercase tracking-wide text-growth">Strengths</p>
            </div>
            <div className="mt-2 space-y-1.5">
              {readiness.strengths.map((s) => (
                <div key={s.label} className="flex items-start gap-2 text-xs text-muted">
                  <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-growth" />
                  <span><span className="font-medium text-ink">{s.label}</span> — {s.detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-caution/20 bg-caution-light/20 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-caution" />
              <p className="text-xs font-semibold uppercase tracking-wide text-caution">Suggested Improvements</p>
            </div>
            <div className="mt-2 space-y-1.5">
              {readiness.improvements.map((imp) => (
                <div key={imp.label} className="flex items-start gap-2 text-xs text-muted">
                  <ArrowUp className="mt-0.5 h-3 w-3 shrink-0 text-caution" />
                  <span><span className="font-medium text-ink">{imp.label}</span> — {imp.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-trust" />
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Recommended Next Actions</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {readiness.nextActions.map((action) => (
            <div
              key={action.action}
              className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-trust-light text-trust">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{action.action}</p>
                <p className="mt-0.5 text-[10px] text-muted">{action.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-4 rounded-lg border border-trust/20 bg-trust-light/20 p-4">
        {altSignals.slice(0, 3).map((signal) => (
          <div key={signal.source} className="flex items-center gap-2 text-xs text-muted">
            <BarChart3 className="h-3 w-3 text-trust" />
            <span className="font-medium text-ink">{signal.label}</span>
            <span>— {signal.metrics[0]?.value}</span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

export function computeDemoReadiness(signals: FinancialSignals): LoanReadinessData {
  const score = 82;
  const strengths = [
    { label: "Revenue Growth", detail: "6-month revenue trend is positive (+16%)" },
    { label: "GST Compliance", detail: "Returns filed consistently with 98% compliance" },
    { label: "UPI Collections", detail: "Stable digital receipts indicate healthy cash cycles" },
    { label: "Payroll Health", detail: "EPFO data confirms formal employment" },
  ];
  const improvements = [
    { label: "Invoice Matching", detail: "Two large credits need invoice-level support" },
    { label: "Customer Concentration", detail: "Top buyer accounts for 38% of revenue" },
    { label: "Failed Transactions", detail: "7 failed transactions — review payment discipline" },
  ];
  const nextActions = [
    { action: "Connect GST", reason: "Verify GST returns for stronger compliance signal" },
    { action: "Link Account Aggregator", reason: "Enrich banking data for cash flow analysis" },
    { action: "Review AI Suggestions", reason: "Address invoice matching before officer review" },
  ];

  return { score, label: "Eligible", recommendation: "Your business is eligible for working capital financing based on alternate data assessment.", strengths, improvements, nextActions };
}
