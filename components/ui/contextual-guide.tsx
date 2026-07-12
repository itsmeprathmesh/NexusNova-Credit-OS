"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { getGuide } from "@/features/judge-experience/guide-config";
import { Lightbulb, X, ChevronRight, Sparkles } from "lucide-react";
import type { UserRole } from "@/domain/types";

const roleLabels: Record<UserRole, string> = {
  "loan-officer": "Loan Officer",
  manager: "Manager",
};

export function ContextualGuide() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem("nexusnova-guide-dismissed");
      return new Set<string>(raw ? JSON.parse(raw) : []);
    } catch { return new Set<string>(); }
  });
  const [expanded, setExpanded] = useState(false);

  const guide = getGuide(pathname);
  const role = user?.role ?? "loan-officer";
  const storageKey = guide?.id || pathname;

  // Reset expand when page changes
  useEffect(() => { setExpanded(false); }, [pathname]);

  if (!guide) return null;
  if (dismissed.has(storageKey)) return null;
  if (pathname === "/" || pathname.startsWith("/customer/") || pathname.startsWith("/staff-login")) return null;

  const handleDismiss = () => {
    const next = new Set(dismissed);
    next.add(storageKey);
    setDismissed(next);
    try { localStorage.setItem("nexusnova-guide-dismissed", JSON.stringify(Array.from(next))); } catch {}
  };

  return (
    <div className="fixed bottom-24 right-6 z-40 max-w-xs">
      <AnimatePresence>
        {!expanded ? (
          <motion.button
            key="badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setExpanded(true)}
            className="flex items-center gap-2 rounded-2xl border border-trust/20 bg-panel/95 px-4 py-2.5 shadow-glow backdrop-blur-2xl transition-all hover:border-trust/40 active:scale-[0.97]"
            title={guide.title}
          >
            <Lightbulb className="h-4 w-4 text-trust" />
            <span className="text-xs font-medium text-ink truncate max-w-[160px]">{guide.title}</span>
          </motion.button>
        ) : (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-72 rounded-2xl border border-white/[0.08] bg-panel shadow-glass backdrop-blur-2xl"
          >
            <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-trust-light text-trust">
                  <Lightbulb className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{guide.title}</p>
                  {guide.estimatedTime && (
                    <p className="text-[10px] text-muted">{guide.estimatedTime}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleDismiss}
                className="shrink-0 rounded-md p-1 text-muted hover:bg-white/[0.06] hover:text-ink"
                aria-label="Dismiss guide"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="px-4 pb-4 space-y-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-0.5">Used By</p>
                <p className="text-xs font-medium text-ink">{roleLabels[role]}</p>
              </div>

              {guide.purpose && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-0.5">Purpose</p>
                  <p className="text-xs text-muted leading-relaxed">{guide.purpose}</p>
                </div>
              )}

              {guide.businessValue && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-0.5">PS-3 Alignment</p>
                  <p className="text-xs text-trust leading-relaxed">{guide.businessValue}</p>
                </div>
              )}

              {guide.aiFeatures && guide.aiFeatures.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {guide.aiFeatures.slice(0, 2).map((f) => (
                    <span key={f} className="rounded-md bg-trust-light/10 px-1.5 py-0.5 text-[9px] font-medium text-trust">{f}</span>
                  ))}
                  {guide.aiFeatures.length > 2 && (
                    <span className="text-[9px] text-muted">+{guide.aiFeatures.length - 2} more</span>
                  )}
                </div>
              )}

              {guide.relatedPages && guide.relatedPages.length > 0 && (
                <div className="pt-1 border-t border-white/[0.06]">
                  <p className="text-[10px] font-semibold text-muted mb-1">Related Features</p>
                  <div className="space-y-0.5">
                    {guide.relatedPages.slice(0, 3).map((p) => (
                      <a
                        key={p.path}
                        href={p.path}
                        className="flex items-center gap-1 text-xs text-muted hover:text-trust transition-colors"
                      >
                        <ChevronRight className="h-2.5 w-2.5" />
                        {p.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
