"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";
import { useDemoMode } from "@/contexts/demo-mode";

export function WalkthroughOverlay() {
  const {
    isOnboardingActive,
    currentStep,
    totalSteps,
    demoSteps,
    nextStep,
    prevStep,
    goToStep,
    endOnboarding,
    startOnboarding,
  } = useDemoMode();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isOnboardingActive) {
      setTargetRect(null);
      return;
    }

    const sel = demoSteps[currentStep]?.target;
    if (!sel) {
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(sel);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      setTargetRect(null);
    }
  }, [currentStep, isOnboardingActive, demoSteps]);

  if (!isOnboardingActive) return null;

  const step = demoSteps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <AnimatePresence>
      {isOnboardingActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 pb-8 sm:items-center sm:pb-0"
          onClick={(e) => {
            if (e.target === e.currentTarget) endOnboarding();
          }}
          role="dialog"
          aria-label="Demo walkthrough"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative mx-4 w-full max-w-2xl rounded-2xl border border-white/20 bg-white p-6 shadow-glow sm:mx-0"
          >
            <button
              onClick={endOnboarding}
              className="absolute right-4 top-4 rounded-md p-1 text-muted transition-colors hover:bg-slate-100 hover:text-ink"
              aria-label="Exit walkthrough"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-trust/10 text-xs font-bold text-trust">
                  {currentStep + 1}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-trust">
                  Step {currentStep + 1} of {totalSteps}
                </span>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-muted">
                <Clock className="h-3 w-3" />
                {step?.estimatedTime ?? "30 sec"}
              </span>
            </div>

            <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-slate-200">
              <motion.div
                initial={{ width: `${((currentStep) / totalSteps) * 100}%` }}
                animate={{ width: `${progress}%` }}
                className="h-full rounded-full bg-gradient-to-r from-trust to-growth"
                transition={{ duration: 0.4 }}
              />
            </div>

            <h2 className="text-xl font-bold text-ink">
              {step?.title ?? "Welcome"}
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted">
              {step?.description ?? ""}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-3">
                <div className="flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-trust" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-trust/80">
                    Purpose
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {step?.purpose ?? ""}
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-3">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-growth" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-growth/80">
                    Business Value
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {step?.businessValue ?? ""}
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.04] p-3">
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="h-3.5 w-3.5 text-caution" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-caution/80">
                    Next Action
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {step?.nextAction ?? ""}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToStep(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentStep
                        ? "w-6 bg-trust"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-slate-100 hover:text-ink"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                )}
                {!isLast ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-1 rounded-lg bg-trust px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-trust/90 active:scale-[0.97]"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={endOnboarding}
                    className="flex items-center gap-1 rounded-lg bg-growth px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-growth/90 active:scale-[0.97]"
                  >
                    <Sparkles className="h-4 w-4" />
                    Explore Freely
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
