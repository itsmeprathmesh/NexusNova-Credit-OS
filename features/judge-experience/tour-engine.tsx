"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sparkles,
  Clock,
  UserRound,
  Play,
  Pause,
  Info,
} from "lucide-react";
import { useJudge } from "./guide-provider";
import { TOUR_STEPS, GUIDE_MAP, TOUR_ROLE_MAP } from "./guide-config";
import { useRouter, usePathname } from "next/navigation";
import { useDemoSession } from "@/contexts/demo-session";

// ─── Helpers ──────────────────────────────────────────────

const ROLE_DISPLAY: Record<string, { label: string; icon: string }> = {
  customer: { label: "Customer", icon: "👤" },
  "loan-officer": { label: "Loan Officer", icon: "📋" },
  manager: { label: "Manager", icon: "📊" },
  executive: { label: "Executive", icon: "🏛️" },
};

function normalizePath(p: string) {
  return p.split("?")[0].split("#")[0];
}

/** Same base path (ignoring query params unless they have view=) */
function pathsMatch(a: string, b: string) {
  const baseA = a.split("?")[0];
  const baseB = b.split("?")[0];
  if (baseA !== baseB) return false;
  const qA = new URLSearchParams(a.split("?")[1] || "");
  const qB = new URLSearchParams(b.split("?")[1] || "");
  return qA.get("view") === qB.get("view");
}

function getEstimatedRemaining(currentIndex: number, total: number) {
  const remaining = total - currentIndex - 1;
  if (remaining <= 0) return "Complete!";
  const avgSecs = 30;
  const totalMin = Math.ceil((remaining * avgSecs) / 60);
  if (totalMin >= 1) return `~${totalMin} min remaining`;
  return `~${remaining * avgSecs} sec remaining`;
}

// ─── Spotlight ────────────────────────────────────────────

function SpotlightOverlay({ selector, stepId }: { selector?: string; stepId: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [winSize, setWinSize] = useState({ w: 0, h: 0 });
  const retryCount = useRef(0);
  const maxRetries = 15;

  useEffect(() => {
    if (!selector) return;
    function update() {
      setWinSize({ w: window.innerWidth, h: window.innerHeight });
      const el = document.querySelector(selector!);
      if (el) setRect(el.getBoundingClientRect());
    }
    update();
    if (!rect) {
      const interval = setInterval(() => {
        const el = document.querySelector(selector!);
        if (el) {
          setRect(el.getBoundingClientRect());
          clearInterval(interval);
          retryCount.current = 0;
        }
        retryCount.current++;
        if (retryCount.current >= maxRetries) {
          clearInterval(interval);
          if (process.env.NODE_ENV !== "production") console.warn(`[Tour] Spotlight not found: ${selector} (step ${stepId})`);
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
      <div className="fixed z-40 pointer-events-none bg-black/55" style={{ top: 0, left: 0, right: 0, height: Math.max(0, rect.top - pad) }} />
      <div className="fixed z-40 pointer-events-none bg-black/55" style={{ bottom: 0, left: 0, right: 0, height: Math.max(0, winSize.h - rect.bottom - pad) }} />
      <div className="fixed z-40 pointer-events-none bg-black/55" style={{ top: Math.max(0, rect.top - pad), left: 0, width: Math.max(0, rect.left - pad), height: rect.height + pad * 2 }} />
      <div className="fixed z-40 pointer-events-none bg-black/55" style={{ top: Math.max(0, rect.top - pad), right: 0, width: Math.max(0, winSize.w - rect.right - pad), height: rect.height + pad * 2 }} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="fixed z-40 pointer-events-none"
        style={{ left: rect.left - pad - 3, top: rect.top - pad - 3, width: rect.width + pad * 2 + 6, height: rect.height + pad * 2 + 6 }}
      >
        <div className="h-full w-full rounded-xl border-2 border-trust/70 shadow-[0_0_30px_rgba(216,255,62,0.15)]" />
      </motion.div>
    </>
  );
}

// ─── Floating Progress Bar ────────────────────────────────

function FloatingProgress({
  current,
  total,
  step,
}: {
  current: number;
  total: number;
  step: (typeof TOUR_STEPS)[0];
}) {
  const roleKey = TOUR_ROLE_MAP[step.pageId] || "customer";
  const roleInfo = ROLE_DISPLAY[roleKey] || { label: "Customer", icon: "👤" };
  const pct = Math.round(((current + 1) / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed right-4 top-4 z-50 flex flex-col gap-1.5 rounded-xl border border-white/[0.06] bg-panel/90 px-3 py-2.5 shadow-glow backdrop-blur-2xl min-w-[180px]"
    >
      <div className="flex items-center justify-between text-[10px]">
        <span className="font-semibold text-trust">Step {current + 1} of {total}</span>
        <span className="text-muted">{pct}%</span>
      </div>
      <div className="h-1 rounded-full bg-white/[0.08] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-trust"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <div className="flex items-center justify-between text-[9px] text-muted">
        <span className="flex items-center gap-1">
          <Clock className="h-2.5 w-2.5" />
          {getEstimatedRemaining(current, total)}
        </span>
        <span className="flex items-center gap-1">
          <UserRound className="h-2.5 w-2.5" />
          {roleInfo.label}
        </span>
      </div>
      <p className="text-[9px] text-muted/60 truncate">{step.title}</p>
    </motion.div>
  );
}

// ─── Shortcuts Modal ──────────────────────────────────────

function ShortcutsModal({ onClose }: { onClose: () => void }) {
  const keys = [
    { key: "?", desc: "Open Guide" },
    { key: "Esc", desc: "Close" },
    { key: "N", desc: "Next Step" },
    { key: "P", desc: "Previous Step" },
    { key: "Ctrl+Shift+D", desc: "Toggle Demo Controls" },
    { key: "Space / Enter", desc: "Next Step" },
    { key: "← / →", desc: "Previous / Next" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm rounded-2xl border border-surface/40 bg-panel/95 p-6 shadow-glow backdrop-blur-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-ink">Keyboard Shortcuts</h2>
          <button onClick={onClose} className="rounded-md p-1 text-muted hover:bg-surface/80 hover:text-ink">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2">
          {keys.map((k) => (
            <div key={k.key} className="flex items-center justify-between rounded-lg bg-surface/40 px-3 py-2">
              <kbd className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-trust">{k.key}</kbd>
              <span className="text-xs text-muted">{k.desc}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main TourEngine ──────────────────────────────────────

export function TourEngine() {
  const { tourActive, tourStep, tourTotalSteps, nextTourStep, prevTourStep, endTour, isJudgeMode, toggleJudgeMode } =
    useJudge();
  const { switchDemoRole, isDemoSession } = useDemoSession();
  const router = useRouter();
  const pathname = usePathname();
  const step = TOUR_STEPS[tourStep];
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [paused, setPaused] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const navigatingRef = useRef<string | null>(null);
  const pauseRef = useRef(false);

  // ── Navigation ────────────────────────────────────────

  const doNavigate = useCallback((pageId: string) => {
    const targetPath = GUIDE_MAP[pageId];
    if (!targetPath) {
      if (process.env.NODE_ENV !== "production") console.warn(`[Tour] No route mapped for: ${pageId}`);
      nextTourStep();
      return;
    }
    setNavigatingTo(pageId);
    navigatingRef.current = pageId;
    setLoadingMessage(`Loading ${TOUR_STEPS.find((s) => s.pageId === pageId)?.title || pageId}...`);
    router.push(targetPath);
  }, [router, nextTourStep]);

  const handleNext = useCallback(() => {
    if (paused || !step || navigatingTo) return;
    if (tourStep >= TOUR_STEPS.length - 1) return;

    const nextStep = TOUR_STEPS[tourStep + 1];
    if (!nextStep) return;

    // Switch role before navigating
    const role = TOUR_ROLE_MAP[nextStep.pageId];
    if (role) switchDemoRole(role as any);

    const targetPath = GUIDE_MAP[nextStep.pageId];
    if (!targetPath) {
      nextTourStep();
      return;
    }

    // Check if we're already on this page
    const currentFull = window.location.href;
    const targetUrl = new URL(targetPath, window.location.origin);
    const sameBase = normalizePath(currentFull) === normalizePath(targetUrl.pathname);

    if (sameBase) {
      if (nextStep.highlightSelector) {
        // Wait for selector — even on same page
        if (process.env.NODE_ENV !== "production") console.log(`[Tour] Same page, waiting for selector: ${nextStep.highlightSelector}`);
        setNavigatingTo(nextStep.pageId);
        navigatingRef.current = nextStep.pageId;
      } else {
        nextTourStep();
      }
      return;
    }

    doNavigate(nextStep.pageId);
  }, [tourStep, step, navigatingTo, paused, switchDemoRole, doNavigate, nextTourStep]);

  const handleFinish = useCallback(() => {
    const demoStep = TOUR_STEPS.find((s) => s.pageId === "demo-complete");
    if (demoStep) {
      const targetPath = GUIDE_MAP["demo-complete"];
      if (targetPath && normalizePath(targetPath) !== normalizePath(window.location.href)) {
        doNavigate("demo-complete");
        return;
      }
    }
    endTour();
    router.push("/demo-complete");
  }, [endTour, router, doNavigate]);

  // ── Navigation watcher (page change) ───────────────────

  useEffect(() => {
    if (!navigatingTo) return;
    const expectedPath = GUIDE_MAP[navigatingTo];
    if (!expectedPath) {
      setNavigatingTo(null);
      navigatingRef.current = null;
      nextTourStep();
      return;
    }

    const targetFull = expectedPath.startsWith("http") ? expectedPath : `http://placeholder${expectedPath}`;
    const currentFull = window.location.href;
    const normalizedTarget = normalizePath(new URL(targetFull).pathname);
    const normalizedCurrent = normalizePath(new URL(currentFull).pathname);

    if (normalizedCurrent === normalizedTarget) {
      const nextStepConfig = TOUR_STEPS.find((s) => s.pageId === navigatingTo);
      const selector = nextStepConfig?.highlightSelector;
      if (selector) {
        const el = document.querySelector(selector);
        if (!el) {
          // Wait longer for selector
          return;
        }
      }
      if (process.env.NODE_ENV !== "production") console.log(`[Tour] Page ready: ${navigatingTo}`);
      setNavigatingTo(null);
      navigatingRef.current = null;
      nextTourStep();
    }
  }, [pathname, navigatingTo, nextTourStep]);

  // ── Polling for selector during navigation ─────────────

  useEffect(() => {
    if (!navigatingTo) return;
    const nextStepConfig = TOUR_STEPS.find((s) => s.pageId === navigatingTo);
    const selector = nextStepConfig?.highlightSelector;
    let retries = 0;
    const maxRetries = 20;

    const interval = setInterval(() => {
      if (selector) {
        const el = document.querySelector(selector);
        if (el) {
          if (process.env.NODE_ENV !== "production") console.log(`[Tour] DOM ready: ${navigatingTo} (${selector})`);
          setNavigatingTo(null);
          navigatingRef.current = null;
          nextTourStep();
          clearInterval(interval);
          return;
        }
      } else {
        // No selector needed — just advance if path matches
        const expectedPath = GUIDE_MAP[navigatingTo];
        if (expectedPath) {
          const normalizedTarget = normalizePath(expectedPath);
          const normalizedCurrent = normalizePath(window.location.href);
          if (normalizedCurrent === normalizedTarget) {
            setNavigatingTo(null);
            navigatingRef.current = null;
            nextTourStep();
            clearInterval(interval);
            return;
          }
        }
      }
      retries++;
      if (retries >= maxRetries) {
        if (process.env.NODE_ENV !== "production") console.warn(`[Tour] Timeout waiting for: ${navigatingTo} — advancing anyway`);
        clearInterval(interval);
        setNavigatingTo(null);
        navigatingRef.current = null;
        nextTourStep();
      }
    }, 500);

    return () => { clearInterval(interval); };
  }, [navigatingTo, nextTourStep]);

  // ── Keyboard shortcuts ─────────────────────────────────

  useEffect(() => {
    if (!tourActive && !showShortcuts) return;

    function handleKey(e: KeyboardEvent) {
      // Ctrl+Shift+D always works
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent("toggle-demo-controls"));
        return;
      }

      if (!tourActive) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShowShortcuts((p) => !p);
        return;
      }

      if (showShortcuts) {
        if (e.key === "Escape") { setShowShortcuts(false); }
        return;
      }

      if (navigatingTo || pauseRef.current) return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          endTour();
          break;
        case "n":
        case "N":
        case "ArrowRight":
        case "Enter":
        case " ":
          e.preventDefault();
          if (tourStep >= TOUR_STEPS.length - 1) handleFinish();
          else handleNext();
          break;
        case "p":
        case "P":
        case "ArrowLeft":
          e.preventDefault();
          if (tourStep > 0) prevTourStep();
          break;
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [tourActive, showShortcuts, navigatingTo, tourStep, handleNext, prevTourStep, endTour, handleFinish]);

  // ── Pause/Resume via custom events ─────────────────────

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail?.action === "pause") { setPaused(true); pauseRef.current = true; }
      if (e.detail?.action === "resume") { setPaused(false); pauseRef.current = false; }
      if (e.detail?.action === "toggle") { setPaused((p) => { pauseRef.current = !p; return !p; }); }
    };
    window.addEventListener("demo-pause-toggle", handler as EventListener);
    return () => window.removeEventListener("demo-pause-toggle", handler as EventListener);
  }, []);

  // ── Render ─────────────────────────────────────────────

  if (!tourActive) return showShortcuts ? <ShortcutsModal onClose={() => setShowShortcuts(false)} /> : null;

  // Navigation loading state
  if (navigatingTo) {
    const targetPath = GUIDE_MAP[navigatingTo] ?? "Unknown";
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
          role="dialog"
          aria-label="Loading next tour step"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-4 flex items-center gap-3 rounded-xl border border-surface/40 bg-panel/95 px-5 py-3 shadow-glow backdrop-blur-2xl"
          >
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-trust border-t-transparent" />
            <span className="text-sm text-muted">{loadingMessage}</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!step) return null;

  const isLast = tourStep >= TOUR_STEPS.length - 1;
  const showSpotlight = !!step.highlightSelector;
  const currentRole = TOUR_ROLE_MAP[step.pageId] || "customer";
  const roleInfo = ROLE_DISPLAY[currentRole] || { label: "Customer", icon: "👤" };

  return (
    <AnimatePresence>
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}

      {/* Floating progress */}
      <FloatingProgress current={tourStep} total={tourTotalSteps} step={step} />

      {showSpotlight && <SpotlightOverlay selector={step.highlightSelector} stepId={step.pageId} />}
      {!showSpotlight && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
          onClick={(e) => { if (e.target === e.currentTarget) endTour(); }}
        />
      )}

      {/* Step Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed inset-x-0 bottom-0 z-50 flex justify-center pb-6 sm:pb-8"
        role="dialog"
        aria-label="Product tour"
        aria-modal="true"
      >
        <div className="relative mx-4 w-full max-w-lg rounded-2xl border border-surface/40 bg-panel/95 p-6 shadow-glow backdrop-blur-2xl">
          <button
            onClick={endTour}
            className="absolute right-4 top-4 rounded-md p-1 text-muted transition-colors hover:bg-surface/80 hover:text-ink"
            aria-label="Exit tour"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Role badge */}
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-md border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-trust">
              {roleInfo.icon} {roleInfo.label}
            </span>
            {paused && (
              <span className="rounded-md border border-caution/20 bg-caution/10 px-2 py-0.5 text-[10px] font-medium text-caution">
                Paused
              </span>
            )}
            {isJudgeMode && (
              <span className="rounded-md border border-trust/20 bg-trust/10 px-2 py-0.5 text-[10px] font-medium text-trust">
                Judge Mode
              </span>
            )}
          </div>

          {/* Step indicator */}
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-trust/15 text-xs font-bold text-trust shadow-[0_0_12px_rgba(216,255,62,0.2)]" aria-hidden="true">
              {tourStep + 1}
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-trust">
                  Step {tourStep + 1} of {tourTotalSteps}
                </span>
                <span className="text-[10px] text-muted">
                  {Math.round(((tourStep + 1) / tourTotalSteps) * 100)}%
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-surface">
                <motion.div
                  className="h-full rounded-full bg-trust shadow-[0_0_8px_rgba(216,255,62,0.3)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${((tourStep + 1) / tourTotalSteps) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-ink">{step.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>

          {/* Feature Explanations */}
          {step.businessValue && (
            <div className="mt-3 rounded-lg border border-trust/15 bg-surface/60 px-3 py-2">
              <p className="text-xs leading-relaxed text-trust">
                <span className="font-semibold">PS-3 Impact:</span> {step.businessValue}
              </p>
            </div>
          )}

          {step.simpleExplanation && (
            <div className="mt-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
              <p className="text-xs leading-relaxed text-muted">
                <Info className="h-3 w-3 inline mr-1 -mt-0.5 text-trust" />
                {step.simpleExplanation}
              </p>
            </div>
          )}

          {step.whyJudgeCares && (
            <div className="mt-1.5 rounded-lg border border-caution/15 bg-surface/60 px-3 py-2">
              <p className="text-xs leading-relaxed text-caution">
                <span className="font-semibold"><Eye className="h-3 w-3 inline mr-0.5 -mt-0.5" />Why Judges Care:</span> {step.whyJudgeCares}
              </p>
            </div>
          )}

          {step.innovationHighlight && (
            <div className="mt-1.5 rounded-lg border border-growth/15 bg-surface/60 px-3 py-2">
              <p className="text-xs leading-relaxed text-growth">
                <span className="font-semibold"><Sparkles className="h-3 w-3 inline mr-0.5 -mt-0.5" />Innovation Highlight:</span> {step.innovationHighlight}
              </p>
            </div>
          )}

          {/* Estimated viewing time */}
          {step.estimatedTime && step.estimatedTime !== "—" && (
            <div className="mt-2 flex items-center gap-1 text-[10px] text-muted/60">
              <Clock className="h-3 w-3" />
              Estimated viewing: {step.estimatedTime}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {/* Pause/Resume */}
              {paused ? (
                <button
                  onClick={() => { setPaused(false); pauseRef.current = false; }}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium text-growth transition-colors hover:bg-surface/80"
                  aria-label="Resume tour"
                >
                  <Play className="h-4 w-4" />
                  Resume
                </button>
              ) : (
                <button
                  onClick={() => { setPaused(true); pauseRef.current = true; }}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface/80 hover:text-ink"
                  aria-label="Pause tour"
                >
                  <Pause className="h-4 w-4" />
                  Pause
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {tourStep > 0 && (
                <button
                  onClick={prevTourStep}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface/80 hover:text-ink"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
              )}
              {!isLast ? (
                <button
                  onClick={handleNext}
                  disabled={paused}
                  className="flex items-center gap-1 rounded-lg bg-trust px-4 py-2 text-sm font-medium text-canvas shadow-sm shadow-trust/20 transition-all hover:bg-trust/90 hover:shadow-trust/30 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  disabled={paused}
                  className="flex items-center gap-1 rounded-lg bg-growth px-4 py-2 text-sm font-medium text-canvas shadow-sm shadow-growth/20 transition-all hover:bg-growth/90 hover:shadow-growth/30 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-4 w-4" />
                  Complete Tour
                </button>
              )}
            </div>
          </div>

          {/* ? shortcut hint */}
          <p className="mt-2 text-center text-[9px] text-muted/40">
            Press <kbd className="rounded border border-white/[0.06] bg-white/[0.04] px-1 py-0 text-[8px] font-mono">?</kbd> for keyboard shortcuts
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
