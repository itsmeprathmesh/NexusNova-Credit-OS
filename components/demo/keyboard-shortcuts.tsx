"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Keyboard } from "lucide-react";
import { useDemoMode } from "@/contexts/demo-mode";

const GROUPS: { label: string; items: { keys: string; desc: string }[] }[] = [
  {
    label: "Navigation",
    items: [
      { keys: "H", desc: "Go to home" },
      { keys: "P", desc: "Go to Portfolio" },
      { keys: "A", desc: "Go to Applications" },
      { keys: "1–5", desc: "Sidebar sections" },
    ],
  },
  {
    label: "Modes",
    items: [
      { keys: "D", desc: "Toggle demo mode" },
      { keys: "J", desc: "Toggle judge mode" },
    ],
  },
  {
    label: "Actions",
    items: [
      { keys: "Ctrl+K", desc: "Open search" },
      { keys: "?", desc: "Toggle this modal" },
      { keys: "Esc", desc: "Close modals / walkthrough" },
    ],
  },
];

export function KeyboardShortcutsModal() {
  const { showShortcuts, closeShortcuts } = useDemoMode();

  return (
    <AnimatePresence>
      {showShortcuts && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeShortcuts();
          }}
          role="dialog"
          aria-label="Keyboard shortcuts"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-elevated"
          >
            <button
              onClick={closeShortcuts}
              className="absolute right-4 top-4 rounded-md p-1 text-muted transition-colors hover:bg-slate-100 hover:text-ink"
              aria-label="Close shortcuts"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-trust/10">
                <Keyboard className="h-5 w-5 text-trust" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-ink">
                  Keyboard Shortcuts
                </h2>
                <p className="text-xs text-muted">
                  Navigate faster across the platform
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted/60">
                    {group.label}
                  </p>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <div
                        key={item.keys}
                        className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-slate-50"
                      >
                        <span className="text-sm text-muted">{item.desc}</span>
                        <kbd className="rounded-md border border-line bg-slate-50 px-2 py-1 text-xs font-semibold text-ink shadow-sm">
                          {item.keys}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-muted">
              Tip: Press ? anytime to see this modal
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
