"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  Eye,
  Clock,
  TrendingUp,
  Award,
} from "lucide-react";
import { useOnboarding } from "./onboarding-provider";

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  color,
}: {
  icon: typeof Sparkles;
  label: string;
  value: number;
  suffix?: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center rounded-xl border border-${color}/20 bg-${color}/5 p-3`}
    >
      <Icon className={`h-5 w-5 text-${color} mb-1`} />
      <span className="text-xl font-bold text-ink">
        {value}
        {suffix ?? ""}
      </span>
      <span className="text-[10px] text-muted text-center leading-tight mt-0.5">
        {label}
      </span>
    </motion.div>
  );
}

export function FinishScreen() {
  const { showFinish, closeFinish, stats } = useOnboarding();

  return (
    <AnimatePresence>
      {showFinish && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeFinish();
          }}
          role="dialog"
          aria-label="Tour complete"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white shadow-glow"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-growth/[0.03] via-transparent to-trust/[0.03] pointer-events-none" />

            <div className="relative px-6 pt-8 pb-6">
              <div className="flex flex-col items-center text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-growth/10 mb-4"
                >
                  <Award className="h-8 w-8 text-growth" />
                </motion.div>
                <h1 className="text-xl font-semibold text-ink">
                  Tour Complete
                </h1>
                <p className="mt-2 text-sm text-muted max-w-xs leading-relaxed">
                  You&apos;ve explored the key features of NexusNova Credit
                  Intelligence OS. Here&apos;s what you covered:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <StatCard
                  icon={Eye}
                  label="Pages Visited"
                  value={stats.pagesVisited}
                  suffix=""
                  color="trust"
                />
                <StatCard
                  icon={Sparkles}
                  label="Features Explored"
                  value={stats.featuresExplored}
                  suffix=""
                  color="caution"
                />
                <StatCard
                  icon={TrendingUp}
                  label="AI Modules Reviewed"
                  value={stats.aiModulesReviewed}
                  suffix=""
                  color="trust"
                />
                <StatCard
                  icon={Clock}
                  label="Manual Hours Saved"
                  value={stats.estimatedHoursSaved}
                  suffix="h"
                  color="growth"
                />
              </div>

              <div className="flex items-center justify-center gap-2 mb-5 rounded-xl border border-growth/20 bg-growth/5 px-4 py-3">
                <CheckCircle2 className="h-5 w-5 text-growth shrink-0" />
                <p className="text-xs text-muted leading-relaxed">
                  This tour demonstrated key differentiators: explainable AI,
                  credit committee simulation, portfolio intelligence, and
                  bank-grade audit trails.
                </p>
              </div>

              <button
                onClick={closeFinish}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-trust px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-trust/90 active:scale-[0.98]"
              >
                <Eye className="h-4 w-4" />
                Continue Exploring
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
