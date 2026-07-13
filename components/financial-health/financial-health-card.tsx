"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Activity, BadgeCheck, Brain, ChevronDown, UserCheck } from "lucide-react";
import type { FinancialSignals, MsmeProfile } from "@/domain/types";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-panel";
import { Badge, Metric } from "@/components/ui/primitives";
import { RealTimeBadge, LastUpdatedBadge } from "./real-time-badge";
import {
  computeAlternateDataSignals,
  computeCreditVisibility,
  computeNtcNtbProfile,
  computeOverallFinancialHealthScore,
  getFundingReadiness,
} from "@/services/alternate-data";
import {
  FactorContribution,
  computeFactorContributions,
  ImprovementRecommendations,
  computeImprovements,
  ConfidenceExplanation,
  getConfidenceExplanation,
  DataTimeline,
} from "@/features/xai";

export function FinancialHealthCard({
  msme,
  signals,
  className,
}: {
  msme: MsmeProfile;
  signals: FinancialSignals;
  className?: string;
}) {
  const healthScore = useMemo(
    () => computeOverallFinancialHealthScore(msme, signals),
    [msme, signals]
  );
  const visibility = useMemo(
    () => computeCreditVisibility(signals, msme),
    [msme, signals]
  );
  const ntcProfile = useMemo(
    () => computeNtcNtbProfile(msme, signals),
    [msme, signals]
  );
  const fundingReadiness = useMemo(
    () => getFundingReadiness(healthScore.score),
    [healthScore.score]
  );

  const factors = useMemo(() => {
    const reasons: { label: string; good: boolean }[] = [];
    const altData = computeAlternateDataSignals(signals);
    const gstMetrics = altData.find((d) => d.source === "gst")?.metrics || [];
    const upiMetrics = altData.find((d) => d.source === "upi")?.metrics || [];
    const aaMetrics =
      altData.find((d) => d.source === "account-aggregator")?.metrics || [];
    const epfoMetrics = altData.find((d) => d.source === "epfo")?.metrics || [];

    gstMetrics.forEach((m) => {
      if (m.sentiment === "positive")
        reasons.push({ label: m.label === "Growth" ? "GST growing" : `GST ${m.label}`, good: true });
    });
    upiMetrics.forEach((m) => {
      if (m.sentiment === "positive")
        reasons.push({ label: "Consistent UPI collections", good: true });
    });
    if (aaMetrics.some((m) => m.sentiment === "positive"))
      reasons.push({ label: "Positive cash flow", good: true });
    if (epfoMetrics.some((m) => m.sentiment === "positive"))
      reasons.push({ label: "Payroll stable", good: true });
    if (signals.monthlyRevenue.length > 0) {
      const trend =
        signals.monthlyRevenue[signals.monthlyRevenue.length - 1] -
        signals.monthlyRevenue[0];
      if (trend > 0) reasons.push({ label: "Healthy receivables", good: true });
    }
    return reasons;
  }, [signals]);

  const factorContributions = useMemo(
    () => computeFactorContributions(signals),
    [signals]
  );
  const improvements = useMemo(
    () => computeImprovements(signals),
    [signals]
  );
  const confidenceExplanation = useMemo(
    () => getConfidenceExplanation(healthScore.confidence),
    [healthScore.confidence]
  );
  const [showTimeline, setShowTimeline] = useState(false);

  return (
    <GlassCard className={cn("overflow-hidden", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-trust text-canvas shadow-glow">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Financial Health Card</p>
            <p className="text-xs text-muted">{msme.name}</p>
          </div>
        </div>
        <RealTimeBadge />
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Financial Health Score"
          value={
            <span className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-trust">
                {healthScore.score}
              </span>
              <span className="text-lg text-muted">/ 100</span>
            </span>
          }
          hint={`AI Confidence ${healthScore.confidence}%`}
        />

        <Metric
          label="Credit Visibility"
          value={
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-ink">
                {visibility.overallScore}%
              </span>
              <Badge
                tone={
                  visibility.overallScore >= 75
                    ? "success"
                    : visibility.overallScore >= 55
                      ? "warning"
                      : "info"
                }
                className="text-[10px]"
              >
                {visibility.overallScore >= 75
                  ? "High"
                  : visibility.overallScore >= 55
                    ? "Medium"
                    : "Low"}
              </Badge>
            </div>
          }
          hint={visibility.explanation}
        />

        <Metric
          label="Funding Readiness"
          value={
            <Badge
              tone={fundingReadiness.tone}
              className="text-sm font-semibold"
            >
              {fundingReadiness.label}
            </Badge>
          }
          hint="Based on alternate data assessment"
        />

        <Metric
          label="Credit Profile"
          value={
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-ink">
                {ntcProfile.creditProfile}
              </span>
            </div>
          }
          hint={ntcProfile.description}
        />
      </div>

      {ntcProfile.alternateDataAvailable && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl border border-trust/20 bg-trust-light/30 px-4 py-3"
        >
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-trust" />
              <span className="text-muted">Alternate Data Available</span>
              <BadgeCheck className="h-3.5 w-3.5 text-trust" />
            </span>
            <span className="flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5 text-trust" />
              <span className="text-muted">Eligible for AI Assessment</span>
              <BadgeCheck className="h-3.5 w-3.5 text-trust" />
            </span>
          </div>
        </motion.div>
      )}

      <div className="mt-5 space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Why this score?
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {factors.map((f) => (
            <span
              key={f.label}
              className="flex items-center gap-1 text-xs text-muted"
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  f.good ? "bg-growth" : "bg-caution"
                )}
              />
              {f.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <FactorContribution factors={factorContributions} />
      </div>

      <div className="mt-5">
        <ImprovementRecommendations improvements={improvements} score={healthScore.score} />
      </div>

      <div className="mt-5">
        <ConfidenceExplanation
          score={healthScore.confidence}
          label={confidenceExplanation.label}
          explanation={confidenceExplanation.explanation}
          factors={confidenceExplanation.factors}
        />
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={() => setShowTimeline(!showTimeline)}
          className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm font-semibold text-ink transition hover:bg-white/[0.04]"
        >
          <span>Alternate Data Sync Timeline</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted transition-transform",
              showTimeline && "rotate-180"
            )}
          />
        </button>
        {showTimeline && (
          <div className="mt-3">
            <DataTimeline signals={signals} />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
        <div className="flex items-center gap-4">
          <div className="text-xs text-muted">
            <span className="font-medium text-ink">NTC/NTB:</span>{" "}
            {ntcProfile.creditProfile}
          </div>
          <div className="text-xs text-muted">
            <span className="font-medium text-ink">Confidence:</span>{" "}
            {healthScore.confidence}%
          </div>
        </div>
        <LastUpdatedBadge />
      </div>
    </GlassCard>
  );
}
