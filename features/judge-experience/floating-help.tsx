"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Search,
  CheckCircle2,
  Circle,
  ChevronRight,
  Clock,
  Sparkles,
  Brain,
  Eye,
  MapPin,
  RefreshCw,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { useJudge } from "./guide-provider";
import { getGuide, CHECKLIST, GUIDES } from "./guide-config";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function FloatingHelp() {
  const {
    isHelpOpen,
    openHelp,
    closeHelp,
    completedPages,
    checklistProgress,
    searchQuery,
    setSearchQuery,
    isJudgeMode,
    toggleJudgeMode,
    startTour,
    newFeatures,
    markFeatureViewed,
  } = useJudge();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const guide = getGuide(pathname);

  const filteredGuides = searchQuery
    ? GUIDES.filter(
        (g) =>
          g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.aiFeatures.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        if (isHelpOpen) closeHelp();
        else openHelp();
      }
      if (e.key === "Escape" && isHelpOpen) {
        closeHelp();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHelpOpen, openHelp, closeHelp]);

  useEffect(() => {
    if (!isHelpOpen) {
      setSearchQuery("");
    }
  }, [isHelpOpen, setSearchQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        if (isHelpOpen) closeHelp();
      }
    }
    if (isHelpOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isHelpOpen, closeHelp]);

  return (
    <>
      <AnimatePresence>
        {isHelpOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:bg-transparent lg:backdrop-blur-none"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isHelpOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed bottom-20 right-4 z-50 flex max-h-[80vh] w-[380px] flex-col overflow-hidden rounded-2xl border border-surface/40 bg-panel/95 shadow-glow backdrop-blur-2xl sm:right-6 sm:w-[420px] lg:bottom-24"
            role="dialog"
            aria-label="Judge Guide Panel"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-line/50 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-trust/15">
                  <Eye className="h-4 w-4 text-trust" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-ink">Judge Guide</h2>
                  <p className="text-[10px] text-muted">NexusNova MSME Financial Health Card</p>
                </div>
              </div>
              <button
                onClick={closeHelp}
                className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface/80 hover:text-ink"
                aria-label="Close guide"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="px-5 py-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search guides..."
                    className="input-dark pl-9"
                    aria-label="Search guides"
                  />
                </div>
              </div>

              {searchQuery ? (
                <div className="px-5 pb-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                    Search results ({filteredGuides.length})
                  </p>
                  {filteredGuides.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted">
                      No guides match your search.
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {filteredGuides.map((g) => (
                        <Link
                          key={g.id}
                          href={g.path}
                          onClick={closeHelp}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink transition-colors hover:bg-surface/60"
                        >
                          <ChevronRight className="h-3.5 w-3.5 text-trust" />
                          <span className="font-medium">{g.title}</span>
                          <span className="ml-auto text-xs text-muted">{g.estimatedTime}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1 px-5 pb-4">
                  {guide && (
                    <div className="mb-4 rounded-xl border border-trust/15 bg-surface/50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-ink">{guide.title}</h3>
                        <span className="flex items-center gap-1 rounded-full bg-trust/15 px-2 py-0.5 text-[10px] font-medium text-trust">
                          <Clock className="h-3 w-3" />
                          {guide.estimatedTime}
                        </span>
                      </div>
                      <p className="mb-3 text-xs leading-relaxed text-muted">{guide.purpose}</p>

                      {guide.aiFeatures.length > 0 && (
                        <div className="mb-2">
                          <p className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-trust">
                            <Brain className="h-3 w-3" />
                            AI Features
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {guide.aiFeatures.map((f, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 rounded-md bg-trust/10 px-2 py-1 text-[10px] font-medium text-trust border border-trust/20 shadow-[0_0_8px_rgba(216,255,62,0.08)]"
                              >
                                <Sparkles className="h-2.5 w-2.5" />
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-2">
                        <p className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-ink">
                          <MapPin className="h-3 w-3" />
                          Judge Observations
                        </p>
                        <ul className="space-y-1">
                          {guide.judgeObservations.map((obs, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-muted">
                              <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-growth shadow-[0_0_6px_rgba(56,217,200,0.4)]" />
                              {obs}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {guide.relatedPages.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {guide.relatedPages.map((rp) => (
                            <Link
                              key={rp.label}
                              href={rp.path}
                              onClick={closeHelp}
                              className="rounded-md border border-line/50 px-2 py-1 text-[10px] text-muted transition-colors hover:border-trust/30 hover:text-trust"
                            >
                              {rp.label}
                            </Link>
                          ))}
                        </div>
                      )}

                      {guide.innovationHighlight && (
                        <div className="mt-3 rounded-lg border border-growth/15 bg-surface/60 p-3">
                          <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-growth">
                            <Lightbulb className="h-3 w-3" />
                            Innovation Highlight
                          </p>
                          <p className="text-xs leading-relaxed text-muted">
                            {guide.innovationHighlight}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mb-4 flex items-center justify-between rounded-lg border border-line/30 bg-surface/40 p-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-caution" />
                      <span className="text-sm font-medium text-ink">Judge Mode</span>
                    </div>
                    <button
                      onClick={toggleJudgeMode}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        isJudgeMode ? "bg-trust" : "bg-line"
                      }`}
                      aria-label="Toggle judge mode"
                      role="switch"
                      aria-checked={isJudgeMode}
                    >
                      <span
                        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                          isJudgeMode ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {newFeatures.length > 0 && (
                    <div className="mb-4 rounded-lg border border-trust/15 bg-trust/[0.03] p-3">
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-trust">
                        <Sparkles className="h-3.5 w-3.5" />
                        What&apos;s New
                      </p>
                      <div className="space-y-1">
                        {newFeatures.map((f) => (
                          <Link
                            key={f.id}
                            href={f.path}
                            onClick={() => {
                              markFeatureViewed(f.id);
                              closeHelp();
                            }}
                            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted transition-colors hover:bg-trust/10 hover:text-ink"
                          >
                            <span className="rounded bg-trust/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-trust">
                              New
                            </span>
                            {f.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                        Demo Checklist
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-trust">{checklistProgress}%</span>
                        <span className="text-[10px] text-muted">
                          ({completedPages.length}/{CHECKLIST.length})
                        </span>
                      </div>
                    </div>
                    <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full rounded-full bg-trust transition-all duration-500 shadow-[0_0_8px_rgba(216,255,62,0.3)]"
                        style={{ width: `${checklistProgress}%` }}
                      />
                    </div>
                    <div className="space-y-0.5">
                      {CHECKLIST.map((item) => {
                        const done = completedPages.includes(item.id);
                        return (
                          <Link
                            key={item.id}
                            href={item.path}
                            onClick={closeHelp}
                            className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${
                              done
                                ? "text-muted hover:bg-surface/60"
                                : "text-ink hover:bg-surface/60"
                            }`}
                          >
                            {done ? (
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-growth" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 shrink-0 text-line" />
                            )}
                            <span className={done ? "line-through text-muted/60" : ""}>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-2">
                    <button
                      onClick={() => {
                        startTour();
                        closeHelp();
                      }}
                      className="btn-primary w-full"
                    >
                      {completedPages.length > 0 ? (
                        <RefreshCw className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      {completedPages.length > 0
                        ? "Restart Guided Tour"
                        : `Start Guided Tour (${CHECKLIST.length} stops)`}
                    </button>
                  </div>

                  <div className="mt-4 rounded-lg border border-line/20 bg-surface/30 p-3">
                    <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                      <HelpCircle className="h-3 w-3" />
                      Tips for Judges
                    </p>
                    <ul className="space-y-1.5">
                      <li className="flex items-start gap-1.5 text-[11px] text-muted">
                        <span className="mt-0.5 block h-1 w-1 shrink-0 rounded-full bg-trust shadow-[0_0_6px_rgba(216,255,62,0.4)]" />
                        Press <kbd className="rounded border border-line/30 bg-surface px-1 text-[9px] font-mono text-ink">?</kbd> to toggle this guide
                      </li>
                      <li className="flex items-start gap-1.5 text-[11px] text-muted">
                        <span className="mt-0.5 block h-1 w-1 shrink-0 rounded-full bg-trust shadow-[0_0_6px_rgba(216,255,62,0.4)]" />
                        Use <kbd className="rounded border border-line/30 bg-surface px-1 text-[9px] font-mono text-ink">←</kbd> <kbd className="rounded border border-line/30 bg-surface px-1 text-[9px] font-mono text-ink">→</kbd> arrows during tour
                      </li>
                      <li className="flex items-start gap-1.5 text-[11px] text-muted">
                        <span className="mt-0.5 block h-1 w-1 shrink-0 rounded-full bg-trust shadow-[0_0_6px_rgba(216,255,62,0.4)]" />
                        Enable Judge Mode for simplified explanations on every page
                      </li>
                      <li className="flex items-start gap-1.5 text-[11px] text-muted">
                        <span className="mt-0.5 block h-1 w-1 shrink-0 rounded-full bg-trust shadow-[0_0_6px_rgba(216,255,62,0.4)]" />
                        Hover over AI badges to see data sources and confidence scores
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
        <AnimatePresence>
          {!isHelpOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openHelp}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-trust text-canvas shadow-[0_0_24px_rgba(216,255,62,0.3)] transition-all hover:bg-trust/90 hover:shadow-[0_0_32px_rgba(216,255,62,0.4)] active:scale-[0.95]"
              aria-label="Open judge guide (press ?)"
            >
              <Eye className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
