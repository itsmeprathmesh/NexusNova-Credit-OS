"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Eye, Sparkles } from "lucide-react";
import { useJudge } from "./guide-provider";
import { TOUR_STEPS } from "./guide-config";
import { useRouter } from "next/navigation";

export function TourEngine() {
  const { tourActive, tourStep, tourTotalSteps, nextTourStep, prevTourStep, endTour } =
    useJudge();
  const router = useRouter();
  const step = TOUR_STEPS[tourStep];

  const handleNext = useCallback(() => {
    if (tourStep < TOUR_STEPS.length - 1) {
      const nextStep = TOUR_STEPS[tourStep + 1];
      if (nextStep) {
        const guideMap: Record<string, string> = {
          home: "/",
          "customer-dashboard": "/customer/dashboard",
          "customer-apply": "/customer/apply",
          "customer-documents": "/customer/documents",
          "customer-status": "/customer/status",
          applications: "/applications?role=loan-officer",
          "application-workspace": "/applications/app-1001?role=loan-officer",
          "production-memo": "/applications/app-1001/production-memo?role=loan-officer",
          timeline: "/applications/app-1001/timeline?role=loan-officer",
          "command-center": "/command-center?role=loan-officer",
          portfolio: "/portfolio?role=manager",
          "portfolio-msme": "/portfolio/MSME001?role=manager",
          audit: "/audit?role=manager",
          reporting: "/reporting?role=manager",
          "executive-dashboard": "/reporting/executive?role=manager",
        };
        const targetPath = guideMap[nextStep.pageId];
        if (targetPath) router.push(targetPath);
      }
    }
    nextTourStep();
  }, [tourStep, nextTourStep, router]);

  useEffect(() => {
    if (!tourActive) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") endTour();
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleNext();
      }
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") {
        if (tourStep > 0) prevTourStep();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [tourActive, tourStep, handleNext, prevTourStep, endTour]);

  if (!tourActive || !step) return null;

  const isLast = tourStep >= TOUR_STEPS.length - 1;

  return (
    <AnimatePresence>
      {tourActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 pb-12 sm:items-center sm:pb-0"
          onClick={(e) => {
            if (e.target === e.currentTarget) endTour();
          }}
          role="dialog"
          aria-label="Product tour"
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
              onClick={endTour}
              className="absolute right-4 top-4 rounded-md p-1 text-muted transition-colors hover:bg-slate-100 hover:text-ink"
              aria-label="Exit tour"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-3 flex items-center gap-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full bg-trust/10 text-xs font-bold text-trust"
                aria-hidden="true"
              >
                {tourStep + 1}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-trust">
                Step {tourStep + 1} of {tourTotalSteps}
              </span>
              <span className="ml-auto rounded-full bg-trust/5 px-2 py-0.5 text-[10px] font-medium text-muted">
                Press Enter
              </span>
            </div>

            <h2 className="text-lg font-semibold text-ink">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {TOUR_STEPS.slice(0, Math.min(TOUR_STEPS.length, 15)).map(
                  (_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === tourStep
                          ? "w-5 bg-trust"
                          : i < tourStep
                            ? "w-1.5 bg-trust/40"
                            : "w-1.5 bg-slate-200"
                      }`}
                    />
                  )
                )}
              </div>

              <div className="flex items-center gap-2">
                {tourStep > 0 && (
                  <button
                    onClick={prevTourStep}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-slate-100 hover:text-ink"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                )}
                {!isLast ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1 rounded-lg bg-trust px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-trust/90 active:scale-[0.97]"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={endTour}
                    className="flex items-center gap-1 rounded-lg bg-growth px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-growth/90 active:scale-[0.97]"
                  >
                    <Sparkles className="h-4 w-4" />
                    Complete Tour
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
