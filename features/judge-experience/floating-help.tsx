"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none"
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
            className="fixed bottom-20 right-4 z-50 flex max-h-[80vh] w-[380px] flex-col overflow-hidden rounded-2xl border border-white/20 bg-white shadow-glow sm:right-6 sm:w-[420px] lg:bottom-24"
            role="dialog"
            aria-label="Judge Guide Panel"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-line/50 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-trust/10">
                  <Eye className="h-4 w-4 text-trust" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-ink">Judge Guide</h2>
                  <p className="text-[10px] text-muted">NexusNova Credit Intelligence OS</p>
                </div>
              </div>
              <button
                onClick={closeHelp}
                className="rounded-md p-1.5 text-muted transition-colors hover:bg-slate-100 hover:text-ink"
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
                    className="w-full rounded-lg border border-line bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-trust focus:outline-none focus:ring-1 focus:ring-trust"
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
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink transition-colors hover:bg-slate-50"
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
                    <div className="mb-4 rounded-xl border border-trust/20 bg-trust/[0.03] p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-ink">{guide.title}</h3>
                        <span className="flex items-center gap-1 rounded-full bg-trust/10 px-2 py-0.5 text-[10px] font-medium text-trust">
                          <Clock className="h-3 w-3" />
                          {guide.estimatedTime}
                        </span>
                      </div>
                      <p className="mb-3 text-xs leading-relaxed text-muted">{guide.purpose}</p>

                      {guide.aiFeatures.length > 0 && (
                        <div className="mb-2">
                          <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-trust">
                            <Brain className="h-3 w-3" />
                            AI Features
                          </p>
                          <ul className="space-y-0.5">
                            {guide.aiFeatures.map((f, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-muted">
                                <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-trust/50" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mb-2">
                        <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-ink">
                          <MapPin className="h-3 w-3" />
                          Judge Observations
                        </p>
                        <ul className="space-y-0.5">
                          {guide.judgeObservations.map((obs, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs text-muted">
                              <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-growth/50" />
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
                    </div>
                  )}

                  <div className="mb-4 flex items-center justify-between rounded-lg border border-line/50 p-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-caution" />
                      <span className="text-sm font-medium text-ink">Judge Mode</span>
                    </div>
                    <button
                      onClick={toggleJudgeMode}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        isJudgeMode ? "bg-trust" : "bg-slate-300"
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
                    <div className="mb-4 rounded-lg border border-amber-200/50 bg-amber-50/50 p-3">
                      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-800">
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
                            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-amber-900 transition-colors hover:bg-amber-100/50"
                          >
                            <span className="rounded bg-amber-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-800">
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
                      <span className="text-xs font-medium text-trust">{checklistProgress}%</span>
                    </div>
                    <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-trust transition-all duration-500"
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
                                ? "text-muted hover:bg-slate-50"
                                : "text-ink hover:bg-slate-50"
                            }`}
                          >
                            {done ? (
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-growth" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                            )}
                            <span className={done ? "line-through" : ""}>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => {
                        startTour();
                        closeHelp();
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-trust px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-trust/90 active:scale-[0.97]"
                    >
                      <Eye className="h-4 w-4" />
                      Start Guided Tour ({CHECKLIST.length} stops)
                    </button>
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
              className="flex h-14 w-14 items-center justify-center rounded-full bg-trust text-white shadow-lg transition-all hover:bg-[#1a526a] active:scale-[0.95]"
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
