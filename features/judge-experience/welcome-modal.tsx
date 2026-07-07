"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Sparkles,
  Braces,
  BarChart,
  Shield,
  FileText,
  Users,
  Clock,
  Monitor,
  CheckCircle,
  X,
} from "lucide-react";
import { useOnboarding } from "./onboarding-provider";
import { TOUR_STEPS } from "./guide-config";

const FEATURE_ICONS: Record<string, typeof Eye> = {
  "Welcome to NexusNova": Monitor,
  "Customer Dashboard": Users,
  "Loan Application": FileText,
  "Document Upload": Braces,
  "Application Tracker": Clock,
  "Command Center": Monitor,
  "Application Workspace": Eye,
  "Production Credit Memo": FileText,
  "Customer 360": Users,
  "Portfolio Intelligence": BarChart,
  "Audit Trail": Shield,
  "Reporting Center": FileText,
  "Executive Dashboard": BarChart,
};

export function WelcomeModal() {
  const { showWelcome, dismissWelcome, startOnboardingTour } = useOnboarding();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const totalEstimatedMinutes = TOUR_STEPS.reduce((acc, s) => {
    const min = parseInt(s.estimatedTime ?? "30");
    return acc + min;
  }, 0);
  const estimatedTotal = Math.ceil(totalEstimatedMinutes / 60);

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) dismissWelcome(dontShowAgain);
          }}
          role="dialog"
          aria-label="Welcome to NexusNova"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/20 bg-white shadow-glow"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-trust/[0.02] via-transparent to-growth/[0.02] pointer-events-none" />

            <div className="relative px-6 pt-8 pb-4">
              <button
                onClick={() => dismissWelcome(dontShowAgain)}
                className="absolute right-4 top-4 rounded-md p-1.5 text-muted transition-colors hover:bg-slate-100 hover:text-ink"
                aria-label="Close welcome"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col items-center text-center mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-trust/10 mb-4">
                  <Eye className="h-7 w-7 text-trust" />
                </div>
                <h1 className="text-xl font-semibold text-ink">
                  Welcome to the Judge Experience
                </h1>
                <p className="mt-2 text-sm text-muted max-w-sm leading-relaxed">
                  Explore NexusNova Credit Intelligence OS through a curator-led
                  tour designed for IDBI Innovate 2026 judges.
                </p>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-2">
                {TOUR_STEPS.slice(0, 8).map((step) => {
                  const Icon = FEATURE_ICONS[step.title] ?? Sparkles;
                  return (
                    <div
                      key={step.pageId}
                      className="flex items-center gap-2 rounded-lg border border-line/40 bg-slate-50/50 px-3 py-2"
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-trust/70" />
                      <span className="text-[11px] font-medium text-ink truncate">
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-4 mb-5 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  ~{estimatedTotal} min
                </span>
                <span className="flex items-center gap-1">
                  <Monitor className="h-3.5 w-3.5" />
                  {TOUR_STEPS.length} pages
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  8 AI features
                </span>
              </div>

              <label className="flex items-center justify-center gap-2 mb-5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="h-4 w-4 rounded border-line text-trust focus:ring-trust"
                />
                <span className="text-xs text-muted">
                  Don&apos;t show this again
                </span>
              </label>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => startOnboardingTour()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-trust px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-trust/90 active:scale-[0.98]"
                >
                  <Eye className="h-4 w-4" />
                  Start Guided Tour
                </button>
                <button
                  onClick={() => dismissWelcome(dontShowAgain)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-2.5 text-sm font-medium text-muted transition-all hover:bg-slate-50 hover:text-ink active:scale-[0.98]"
                >
                  Explore on My Own
                </button>
              </div>
            </div>

            <div className="border-t border-line/30 px-6 py-3">
              <p className="text-[10px] text-center text-muted/60">
                NexusNova Credit Intelligence OS · IDBI Innovate 2026 PS-3
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
