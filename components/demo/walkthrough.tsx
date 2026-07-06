"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useDemoMode } from "@/contexts/demo-mode";

export function WalkthroughOverlay() {
  const {
    isOnboardingActive,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    endOnboarding,
  } = useDemoMode();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isOnboardingActive) {
      setTargetRect(null);
      return;
    }

    const targets = [
      "",
      '[href="/command-center"]',
      '[href="/applications"]',
      '[href="/portfolio"]',
      '[href="/audit"]',
      "",
    ];

    const sel = targets[currentStep];
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
  }, [currentStep, isOnboardingActive]);

  if (!isOnboardingActive) return null;

  return (
    <AnimatePresence>
      {isOnboardingActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 pb-12 sm:items-center sm:pb-0"
          onClick={(e) => {
            if (e.target === e.currentTarget) endOnboarding();
          }}
          role="dialog"
          aria-label="Feature walkthrough"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative mx-4 w-full max-w-lg rounded-2xl border border-white/20 bg-white p-6 shadow-glow sm:mx-0"
          >
            <button
              onClick={endOnboarding}
              className="absolute right-4 top-4 rounded-md p-1 text-muted transition-colors hover:bg-slate-100 hover:text-ink"
              aria-label="Close walkthrough"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-3 flex items-center gap-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full bg-trust/10 text-xs font-bold text-trust"
                aria-hidden="true"
              >
                {currentStep + 1}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-trust">
                {currentStep === 0
                  ? "Welcome"
                  : currentStep === totalSteps - 1
                    ? "You're Ready"
                    : `Feature ${currentStep} of ${totalSteps - 2}`}
              </span>
            </div>

            <h2 className="text-lg font-semibold text-ink">
              {currentStep === 0
                ? "Welcome to NexusNova"
                : currentStep === totalSteps - 1
                  ? "Pro Tips"
                  : stepTitles[currentStep]}
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted">
              {stepDescriptions[currentStep]}
            </p>

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
                {currentStep < totalSteps - 1 ? (
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
                    Get Started
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

const stepTitles: Record<number, string> = {
  1: "Command Center",
  2: "Smart Application Review",
  3: "Portfolio Intelligence",
  4: "Audit Trail",
};

const stepDescriptions: Record<number, string> = {
  0: "An AI-powered MSME lending intelligence platform built for IDBI Innovate 2026. Explore AI-driven recommendations, enterprise visualizations, and complete audit trails — all in one place.",
  1: "The Command Center gives you a real-time operational hub with AI-powered alerts, pending task summaries, and quick-decision widgets. Press 1 to jump here anytime.",
  2: "Every loan application includes full AI explainability — confidence scores, risk factor breakdowns, improvement suggestions, and a simulated credit committee with multiple reviewer personas.",
  3: "Portfolio Intelligence delivers enterprise-grade visualizations: risk heatmaps, sector comparisons, exposure treemaps, risk migration timelines, and branch performance analytics.",
  4: "The Audit Trail ensures complete compliance with timestamps, AI rationale snapshots, role-based access logs, and exportable reports for regulatory review.",
  5: "Press ? anytime for keyboard shortcuts, D to toggle demo mode, and ⌘K (Ctrl+K on Windows) for instant search across MSMEs, applications, and reports.",
};
