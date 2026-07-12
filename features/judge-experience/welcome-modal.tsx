"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Clock, X, CheckCircle2 } from "lucide-react";
import { useOnboarding } from "./onboarding-provider";

const FEATURES = [
  "Customer Journey",
  "Alternate Data Assessment",
  "Financial Health Card",
  "Explainable AI",
  "Credit Memo",
  "Portfolio Intelligence",
  "Executive Analytics",
  "Audit & Reporting",
];

export function WelcomeModal() {
  const { showWelcome, dismissWelcome, startOnboardingTour } = useOnboarding();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) dismissWelcome(dontShowAgain);
          }}
          role="dialog"
          aria-label="Welcome to NexusNova Credit Intelligence OS"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-surface/40 bg-panel/95 shadow-glow backdrop-blur-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-trust/[0.03] via-transparent to-growth/[0.03] pointer-events-none" />

            <div className="relative px-6 pt-8 pb-4">
              <button
                onClick={() => dismissWelcome(dontShowAgain)}
                className="absolute right-4 top-4 rounded-md p-1.5 text-muted transition-colors hover:bg-surface/80 hover:text-ink"
                aria-label="Close welcome"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col items-center text-center mb-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-trust/15 mb-4">
                  <Sparkles className="h-7 w-7 text-trust" />
                </div>
                <h1 className="text-xl font-semibold text-ink">
                  Welcome to NexusNova Credit Intelligence OS
                </h1>
                <p className="mt-2 text-sm text-muted max-w-md leading-relaxed">
                  Experience how AI-powered Financial Health Cards and Alternate Data Intelligence
                  transform MSME credit assessment for New-to-Credit and New-to-Bank enterprises.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 mb-5 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Estimated Demo Duration: ~6–8 minutes
                </span>
              </div>

              {/* Features grid */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {FEATURES.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-trust" />
                    <span className="text-xs text-ink">{f}</span>
                  </div>
                ))}
              </div>

              <label className="flex items-center justify-center gap-2 mb-5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="h-4 w-4 rounded border-line bg-surface text-trust focus:ring-trust"
                />
                <span className="text-xs text-muted">
                  Don&apos;t show again
                </span>
              </label>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => startOnboardingTour()}
                  className="btn-primary w-full"
                >
                  <Sparkles className="h-4 w-4" />
                  Start Guided Demo
                </button>
                <button
                  onClick={() => dismissWelcome(dontShowAgain)}
                  className="btn-secondary w-full"
                >
                  Explore Prototype
                </button>
                <button
                  onClick={() => {
                    dismissWelcome(true);
                  }}
                  className="w-full rounded-xl border border-transparent px-4 py-2.5 text-sm font-medium text-muted transition-all hover:text-ink"
                >
                  Skip
                </button>
              </div>
            </div>

            <div className="border-t border-line/10 px-6 py-3">
              <p className="text-[10px] text-center text-muted/50">
                NexusNova MSME Financial Health Card &middot; IDBI Innovate 2026 PS-3
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
