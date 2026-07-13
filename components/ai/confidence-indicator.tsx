"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type ConfidenceMetric = {
  label: string;
  score: number;
  color?: string;
};

function confidenceColor(score: number) {
  if (score >= 80) return "bg-growth";
  if (score >= 60) return "bg-trust";
  if (score >= 40) return "bg-caution";
  return "bg-danger";
}

function confidenceLabel(score: number) {
  if (score >= 80) return "High";
  if (score >= 60) return "Moderate";
  if (score >= 40) return "Low";
  return "Very Low";
}

export function ConfidenceBar({ score, className }: { score: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full rounded-full bg-line", className)}>
      <motion.div
        className={cn("h-full rounded-full", confidenceColor(score))}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </div>
  );
}

export function ConfidenceIndicator({ label, score, showLabel = true }: { label: string; score: number; showLabel?: boolean }) {
  return (
    <div className="space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">{label}</span>
          <span className={cn(
            "text-xs font-semibold",
            score >= 80 ? "text-growth" : score >= 60 ? "text-trust" : score >= 40 ? "text-caution" : "text-danger"
          )}>
            {score}%
          </span>
        </div>
      )}
      <ConfidenceBar score={score} />
      {showLabel && (
        <span className="text-[10px] uppercase tracking-wide text-muted">{confidenceLabel(score)}</span>
      )}
    </div>
  );
}

export function ConfidenceIndicators({ metrics, className }: { metrics: ConfidenceMetric[]; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">Confidence Breakdown</p>
      {metrics.map((metric) => (
        <ConfidenceIndicator key={metric.label} label={metric.label} score={metric.score} />
      ))}
      {metrics.length > 1 && (
        <div className="border-t border-line pt-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">Overall Confidence</span>
            <span className={cn(
              "text-sm font-bold",
              (() => {
                const avg = Math.round(metrics.reduce((s, m) => s + m.score, 0) / metrics.length);
                return avg >= 80 ? "text-growth" : avg >= 60 ? "text-trust" : avg >= 40 ? "text-caution" : "text-danger";
              })()
            )}>
              {Math.round(metrics.reduce((s, m) => s + m.score, 0) / metrics.length)}%
            </span>
          </div>
          <ConfidenceBar score={Math.round(metrics.reduce((s, m) => s + m.score, 0) / metrics.length)} className="mt-2" />
        </div>
      )}
    </div>
  );
}
