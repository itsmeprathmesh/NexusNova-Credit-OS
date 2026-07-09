"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, HelpCircle, Lightbulb, Zap, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExplainProps {
  title: string;
  bankNeed: string;
  msmeBenefit: string;
  problemSolved: string;
  aiContribution: string;
  className?: string;
}

export function FeatureExplainer({
  title,
  bankNeed,
  msmeBenefit,
  problemSolved,
  aiContribution,
  className,
}: ExplainProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-trust/20 bg-trust-light/30 px-3 py-1.5 text-xs font-medium text-trust transition-all hover:bg-trust-light/50 active:scale-95"
        aria-label={`Explain ${title}`}
      >
        <Info className="h-3.5 w-3.5" />
        What is this?
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-surface/40 bg-panel/95 shadow-glow backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <HelpCircle className="h-4 w-4 text-trust" />
                  {title}
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-1 text-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 p-4">
                <Section icon={Lightbulb} label="What is this feature?" text={problemSolved} />
                <Section icon={HelpCircle} label="Why does the bank need it?" text={bankNeed} />
                <Section icon={Zap} label="Why does the MSME benefit?" text={msmeBenefit} />
                <Section icon={Info} label="How does AI contribute?" text={aiContribution} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({
  icon: Icon,
  label,
  text,
}: {
  icon: typeof Info;
  label: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="mb-1 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-trust" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-trust/80">
          {label}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-muted">{text}</p>
    </div>
  );
}
