"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, Circle, Clock, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIAnalyzing({ label = "AI Analysis in Progress" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-trust/10"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      >
        <RefreshCw className="h-4 w-4 text-trust" />
      </motion.div>
      <div>
        <motion.p
          className="text-sm font-semibold text-trust"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          {label}
        </motion.p>
        <div className="mt-1 flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-trust/40"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AICompleted({ label = "Analysis Complete", children }: { label?: string; children?: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-growth/10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <CheckCircle2 className="h-4 w-4 text-growth" />
      </motion.div>
      <div>
        <p className="text-sm font-semibold text-growth">{label}</p>
        {children && <p className="mt-0.5 text-xs text-muted">{children}</p>}
      </div>
    </div>
  );
}

export function AIWarning({ label = "Attention Required", children }: { label?: string; children?: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-caution/10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <AlertTriangle className="h-4 w-4 text-caution" />
      </motion.div>
      <div>
        <p className="text-sm font-semibold text-caution">{label}</p>
        {children && <p className="mt-0.5 text-xs text-muted">{children}</p>}
      </div>
    </div>
  );
}

export function AIReviewRequired({ label = "Human Review Required" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50/50 p-3">
      <motion.div
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-100"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <Clock className="h-4 w-4 text-amber-700" />
      </motion.div>
      <div>
        <p className="text-sm font-semibold text-amber-800">{label}</p>
        <p className="mt-0.5 text-xs text-amber-700">Decision requires manual officer assessment before proceeding.</p>
      </div>
    </div>
  );
}

export function AIThinkingDots() {
  return (
    <span className="inline-flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1 w-1 rounded-full bg-current"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

export function AIBadge({ tone, children }: { tone: "analyzing" | "complete" | "warning" | "review"; children: ReactNode }) {
  const styles = {
    analyzing: "bg-trust/10 text-trust border-trust/20",
    complete: "bg-growth/10 text-growth border-growth/20",
    warning: "bg-caution/10 text-caution border-caution/20",
    review: "bg-amber-50 text-amber-800 border-amber-200"
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold", styles[tone])}>
      {tone === "analyzing" && <RefreshCw className="h-3 w-3 animate-spin" />}
      {tone === "complete" && <CheckCircle2 className="h-3 w-3" />}
      {tone === "warning" && <AlertTriangle className="h-3 w-3" />}
      {tone === "review" && <Clock className="h-3 w-3" />}
      {children}
    </span>
  );
}
