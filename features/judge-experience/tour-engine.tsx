"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Eye, Sparkles } from "lucide-react";
import { useJudge } from "./guide-provider";
import { TOUR_STEPS } from "./guide-config";
import { useRouter } from "next/navigation";
import { useOnboarding } from "./onboarding-provider";

function SpotlightOverlay({ selector }: { selector?: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [winSize, setWinSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    function update() {
      if (!selector) {
        setRect(null);
        return;
      }
      setWinSize({ w: window.innerWidth, h: window.innerHeight });
      const el = document.querySelector(selector);
      if (el) {
        setRect(el.getBoundingClientRect());
      } else {
        setRect(null);
        const timer = setTimeout(() => {
          const retry = document.querySelector(selector);
          if (retry) setRect(retry.getBoundingClientRect());
        }, 600);
        return () => clearTimeout(timer);
      }
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [selector]);

  if (!rect) return null;

  const pad = 8;

  return (
    <>
      <div
        className="fixed z-40 pointer-events-none bg-black/45"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: Math.max(0, rect.top - pad),
        }}
      />
      <div
        className="fixed z-40 pointer-events-none bg-black/45"
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          height: Math.max(0, winSize.h - rect.bottom - pad),
        }}
      />
      <div
        className="fixed z-40 pointer-events-none bg-black/45"
        style={{
          top: Math.max(0, rect.top - pad),
          left: 0,
          width: Math.max(0, rect.left - pad),
          height: rect.height + pad * 2,
        }}
      />
      <div
        className="fixed z-40 pointer-events-none bg-black/45"
        style={{
          top: Math.max(0, rect.top - pad),
          right: 0,
          width: Math.max(0, winSize.w - rect.right - pad),
          height: rect.height + pad * 2,
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="fixed z-40 pointer-events-none"
        style={{
          left: rect.left - pad - 3,
          top: rect.top - pad - 3,
          width: rect.width + pad * 2 + 6,
          height: rect.height + pad * 2 + 6,
        }}
      >
        <div className="h-full w-full rounded-xl border-2 border-trust/80 shadow-[0_0_24px_rgba(33,95,122,0.25)]" />
      </motion.div>
    </>
  );
}

export function TourEngine() {
  const { tourActive, tourStep, tourTotalSteps, nextTourStep, prevTourStep, endTour } =
    useJudge();
  const { openFinish } = useOnboarding();
  const router = useRouter();
  const step = TOUR_STEPS[tourStep];
  const cardRef = useRef<HTMLDivElement>(null);

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

  const handleFinish = useCallback(() => {
    endTour();
    setTimeout(() => openFinish(), 300);
  }, [endTour, openFinish]);

  useEffect(() => {
    if (!tourActive) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") endTour();
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (tourStep >= TOUR_STEPS.length - 1) handleFinish();
        else handleNext();
      }
      if (e.key === "ArrowRight") {
        if (tourStep >= TOUR_STEPS.length - 1) handleFinish();
        else handleNext();
      }
      if (e.key === "ArrowLeft") {
        if (tourStep > 0) prevTourStep();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [tourActive, tourStep, handleNext, prevTourStep, endTour, handleFinish]);

  if (!tourActive || !step) return null;

  const isLast = tourStep >= TOUR_STEPS.length - 1;
  const showSpotlight = tourActive && !!step.highlightSelector;

  return (
    <AnimatePresence>
      {tourActive && (
        <>
          {showSpotlight && (
            <SpotlightOverlay selector={step.highlightSelector} />
          )}

          {!showSpotlight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={(e) => {
                if (e.target === e.currentTarget) endTour();
              }}
            />
          )}

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 flex justify-center pb-6 sm:pb-8"
            ref={cardRef}
            role="dialog"
            aria-label="Product tour"
            aria-modal="true"
          >
            <div className="relative mx-4 w-full max-w-lg rounded-2xl border border-white/20 bg-white p-6 shadow-glow">
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
              </div>

              <h2 className="text-lg font-semibold text-ink">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.description}
              </p>

              {step.businessValue && (
                <p className="mt-2 text-xs leading-relaxed text-trust/70 bg-trust/5 rounded-lg px-3 py-2">
                  <span className="font-semibold">Business Value:</span>{" "}
                  {step.businessValue}
                </p>
              )}

              {step.whyJudgeCares && (
                <p className="mt-1.5 text-xs leading-relaxed text-caution/80 bg-caution/5 rounded-lg px-3 py-2">
                  <span className="font-semibold">
                    <Eye className="h-3 w-3 inline mr-0.5 -mt-0.5" />
                    Why Judges Care:
                  </span>{" "}
                  {step.whyJudgeCares}
                </p>
              )}

              {step.innovationHighlight && (
                <p className="mt-1.5 text-xs leading-relaxed text-growth/80 bg-growth/5 rounded-lg px-3 py-2">
                  <span className="font-semibold">
                    <Sparkles className="h-3 w-3 inline mr-0.5 -mt-0.5" />
                    Innovation Highlight:
                  </span>{" "}
                  {step.innovationHighlight}
                </p>
              )}

              <div className="mt-5 flex items-center justify-between">
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
                      onClick={handleFinish}
                      className="flex items-center gap-1 rounded-lg bg-growth px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-growth/90 active:scale-[0.97]"
                    >
                      <Sparkles className="h-4 w-4" />
                      Complete Tour
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
