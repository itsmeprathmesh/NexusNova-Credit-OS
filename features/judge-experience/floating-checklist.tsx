"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ListChecks } from "lucide-react";
import { useJudge } from "./guide-provider";
import { CHECKLIST } from "./guide-config";

export function FloatingChecklist() {
  const { completedPages, checklistProgress, openHelp } = useJudge();

  const isComplete = checklistProgress >= 100;

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.button
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={openHelp}
          className="fixed bottom-6 left-6 z-30 flex items-center gap-2 rounded-full border border-white/30 bg-white/90 px-3.5 py-2.5 shadow-md backdrop-blur-md transition-all hover:bg-white hover:shadow-lg active:scale-[0.97]"
          aria-label="Open checklist progress"
        >
          <div className="relative flex h-7 w-7 items-center justify-center">
            <ListChecks className="h-4 w-4 text-trust" />
            <svg
              className="absolute inset-0 h-7 w-7 -rotate-90"
              viewBox="0 0 28 28"
              aria-hidden="true"
            >
              <circle
                cx="14"
                cy="14"
                r="12"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="2.5"
              />
              <circle
                cx="14"
                cy="14"
                r="12"
                fill="none"
                stroke="#215f7a"
                strokeWidth="2.5"
                strokeDasharray={`${2 * Math.PI * 12}`}
                strokeDashoffset={`${2 * Math.PI * 12 * (1 - checklistProgress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
          </div>
          <span className="text-xs font-semibold text-ink whitespace-nowrap">
            {completedPages.length}/{CHECKLIST.length}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
