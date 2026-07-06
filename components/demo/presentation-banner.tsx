"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useDemoMode } from "@/contexts/demo-mode";

export function PresentationBanner() {
  const { isDemoMode, toggleDemoMode } = useDemoMode();

  return (
    <AnimatePresence>
      {isDemoMode && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="overflow-hidden"
        >
          <div className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-trust/5 via-trust/10 to-growth/5 px-4 py-2.5 text-center text-sm">
            <Sparkles className="h-4 w-4 shrink-0 text-trust" aria-hidden="true" />
            <span className="font-medium text-ink">
              <span className="font-semibold text-trust">Demo Mode</span> — Exploring NexusNova Credit Intelligence OS
            </span>
            <span className="hidden text-xs text-muted sm:inline">
              IDBI Innovate 2026 PS-3
            </span>
            <button
              onClick={toggleDemoMode}
              className="ml-2 rounded-md p-1 text-muted transition-colors hover:bg-white/50 hover:text-ink"
              aria-label="Exit demo mode"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
