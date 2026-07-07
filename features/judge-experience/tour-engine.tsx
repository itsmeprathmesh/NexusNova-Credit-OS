"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Eye, Sparkles } from "lucide-react";
import { useJudge } from "./guide-provider";
import { TOUR_STEPS } from "./guide-config";
import { useRouter, usePathname } from "next/navigation";
import { useOnboarding } from "./onboarding-provider";

const GUIDE_MAP: Record<string, string> = {
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

function SpotlightOverlay({ selector, stepId }: { selector?: string; stepId: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [winSize, setWinSize] = useState({ w: 0, h: 0 });
  const retryCount = useRef(0);

  useEffect(() => {
    const sel = selector;
    if (!sel) {
      console.log("Tour Step", stepId, " — selector not configured, skipping spotlight");
      return;
    }
    const qs = sel!;
    function update() {
      setWinSize({ w: window.innerWidth, h: window.innerHeight });
      const el = document.querySelector(qs);
      if (el) {
        setRect(el.getBoundingClientRect());
        console.log("Tour Step", stepId, GUIDE_MAP[stepId] ?? "unknown", qs, "found");
      }
    }
    update();
    if (!rect) {
      const interval = setInterval(() => {
        const el = document.querySelector(qs);
        if (el) {
          setRect(el.getBoundingClientRect());
          retryCount.current = 0;
          clearInterval(interval);
          console.log("Tour Step", stepId, GUIDE_MAP[stepId] ?? "unknown", qs, "found (retry)");
        }
        retryCount.current++;
        if (retryCount.current > 8) {
          clearInterval(interval);
          console.log("Tour Step", stepId, GUIDE_MAP[stepId] ?? "unknown", qs, "not found — skipping spotlight");
        }
      }, 500);
      return () => clearInterval(interval);
    }
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [selector, stepId]);

  if (!rect) return null;

  const pad = 8;

  return (
    <>
      <div
        className="fixed z-40 pointer-events-none bg-black/45"
        style={{ top: 0, left: 0, right: 0, height: Math.max(0, rect.top - pad) }}
      />
      <div
        className="fixed z-40 pointer-events-none bg-black/45"
        style={{ bottom: 0, left: 0, right: 0, height: Math.max(0, winSize.h - rect.bottom - pad) }}
      />
      <div
        className="fixed z-40 pointer-events-none bg-black/45"
        style={{ top: Math.max(0, rect.top - pad), left: 0, width: Math.max(0, rect.left - pad), height: rect.height + pad * 2 }}
      />
      <div
        className="fixed z-40 pointer-events-none bg-black/45"
        style={{ top: Math.max(0, rect.top - pad), right: 0, width: Math.max(0, winSize.w - rect.right - pad), height: rect.height + pad * 2 }}
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
  const pathname = usePathname();
  const step = TOUR_STEPS[tourStep];
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const navigatingRef = useRef<string | null>(null);

  const handleNext = useCallback(() => {
    if (tourStep >= TOUR_STEPS.length - 1) return;
    const nextStep = TOUR_STEPS[tourStep + 1];
    if (!nextStep) return;
    const targetPath = GUIDE_MAP[nextStep.pageId];
    if (!targetPath) {
      console.log("Tour Step", nextStep.pageId, " — no route mapped, advancing without navigation");
      nextTourStep();
      return;
    }
    const normalizedTarget = targetPath.split("?")[0];
    const normalizedCurrent = pathname.split("?")[0];
    if (normalizedTarget === normalizedCurrent) {
      console.log("Tour Step", nextStep.pageId, targetPath, " — already on page, advancing");
      nextTourStep();
      return;
    }
    console.log("Tour Step", nextStep.pageId, targetPath, " — navigating");
    setNavigatingTo(nextStep.pageId);
    navigatingRef.current = nextStep.pageId;
    router.push(targetPath);
  }, [tourStep, nextTourStep, pathname, router]);

  const handleFinish = useCallback(() => {
    endTour();
    setTimeout(() => openFinish(), 300);
  }, [endTour, openFinish]);

  useEffect(() => {
    if (!navigatingTo) return;
    const expectedPath = GUIDE_MAP[navigatingTo];
    if (!expectedPath) {
      setNavigatingTo(null);
      nextTourStep();
      return;
    }
    const normalizedTarget = expectedPath.split("?")[0];
    const normalizedCurrent = pathname.split("?")[0];
    if (normalizedCurrent === normalizedTarget) {
      console.log("Tour Step", navigatingTo, expectedPath, " — page loaded, advancing");
      setNavigatingTo(null);
      navigatingRef.current = null;
      nextTourStep();
    }
  }, [pathname, navigatingTo, nextTourStep]);

  useEffect(() => {
    if (!navigatingTo) return;
    const timer = setTimeout(() => {
      console.log("Tour Step", navigatingTo, " — navigation timeout, continuing");
      setNavigatingTo(null);
      navigatingRef.current = null;
      nextTourStep();
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigatingTo, nextTourStep]);

  useEffect(() => {
    if (!tourActive) return;
    function handleKey(e: KeyboardEvent) {
      if (navigatingTo) return;
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
        if (tourStep > 0 && !navigatingTo) prevTourStep();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [tourActive, tourStep, handleNext, prevTourStep, endTour, handleFinish, navigatingTo]);

  if (!tourActive || !step) return null;

  if (navigatingTo) {
    const targetPath = GUIDE_MAP[navigatingTo] ?? "Unknown";
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          role="dialog"
          aria-label="Loading next tour step"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="mx-4 flex items-center gap-3 rounded-xl border border-white/20 bg-white px-5 py-3 shadow-glow"
          >
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-trust border-t-transparent" />
            <span className="text-sm text-muted">Loading {targetPath}…</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const isLast = tourStep >= TOUR_STEPS.length - 1;
  const showSpotlight = !!step.highlightSelector;

  console.log("Tour Step", step.pageId, GUIDE_MAP[step.pageId] ?? "unknown", step.highlightSelector ?? "none", "rendering");

  return (
    <AnimatePresence>
      {tourActive && (
        <>
          {showSpotlight && <SpotlightOverlay selector={step.highlightSelector} stepId={step.pageId} />}
          {!showSpotlight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40"
              onClick={(e) => { if (e.target === e.currentTarget) endTour(); }}
            />
          )}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 flex justify-center pb-6 sm:pb-8"
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
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-trust/10 text-xs font-bold text-trust" aria-hidden="true">
                  {tourStep + 1}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-trust">
                  Step {tourStep + 1} of {tourTotalSteps}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-ink">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              {step.businessValue && (
                <p className="mt-2 text-xs leading-relaxed text-trust/70 bg-trust/5 rounded-lg px-3 py-2">
                  <span className="font-semibold">Business Value:</span> {step.businessValue}
                </p>
              )}
              {step.whyJudgeCares && (
                <p className="mt-1.5 text-xs leading-relaxed text-caution/80 bg-caution/5 rounded-lg px-3 py-2">
                  <span className="font-semibold"><Eye className="h-3 w-3 inline mr-0.5 -mt-0.5" />Why Judges Care:</span> {step.whyJudgeCares}
                </p>
              )}
              {step.innovationHighlight && (
                <p className="mt-1.5 text-xs leading-relaxed text-growth/80 bg-growth/5 rounded-lg px-3 py-2">
                  <span className="font-semibold"><Sparkles className="h-3 w-3 inline mr-0.5 -mt-0.5" />Innovation Highlight:</span> {step.innovationHighlight}
                </p>
              )}
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {TOUR_STEPS.slice(0, Math.min(TOUR_STEPS.length, 15)).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === tourStep ? "w-5 bg-trust" : i < tourStep ? "w-1.5 bg-trust/40" : "w-1.5 bg-slate-200"
                      }`}
                    />
                  ))}
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
                      Next <ChevronRight className="h-4 w-4" />
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
