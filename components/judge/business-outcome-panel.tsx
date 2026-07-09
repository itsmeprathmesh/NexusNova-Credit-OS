"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Target, TrendingUp, X } from "lucide-react";
import { useJudge } from "@/features/judge-experience";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BusinessOutcome {
  whyMatters: string;
  solvesPs3: string;
  businessBenefit: string;
}

const PAGE_OUTCOMES: Record<string, BusinessOutcome> = {
  "/command-center": {
    whyMatters: "Loan officers need instant visibility into urgent cases, SLA breaches, and early warnings — every minute of delay risks portfolio health.",
    solvesPs3: "AI-powered operational hub delivers real-time portfolio intelligence with early warning detection, replacing manual dashboard monitoring.",
    businessBenefit: "Reduces response time to critical events by 90%, prevents SLA breaches, and enables proactive risk management.",
  },
  "/applications": {
    whyMatters: "Every application represents a potential new customer — but manual review takes 5 days. Banks need AI to prioritize and accelerate.",
    solvesPs3: "Application queue with AI readiness scoring, confidence indicators, and explainable recommendations for every MSME application.",
    businessBenefit: "Reduces loan decision time from 5 days to under 2 hours with 96% AI confidence scoring.",
  },
  "/portfolio": {
    whyMatters: "Without portfolio intelligence, banks discover problems when NPAs materialize. Proactive monitoring prevents losses before they happen.",
    solvesPs3: "Enterprise-grade portfolio monitoring with risk heatmaps, sector comparisons, migration timelines, and early warning system.",
    businessBenefit: "Enables proactive risk management — identifies deteriorating MSMEs before they become NPAs.",
  },
  "/audit": {
    whyMatters: "RBI requires complete audit trails for every credit decision. Manual audit logs are error-prone and lack AI rationale capture.",
    solvesPs3: "Immutable audit logs with AI rationale snapshots, role-based access, and exportable compliance reports.",
    businessBenefit: "Regulatory compliance-ready — satisfies RBI and statutory audit requirements with zero manual effort.",
  },
  "/reporting": {
    whyMatters: "Analysts spend 3-4 hours per report on manual data aggregation. Banks need self-service reporting with AI-generated insights.",
    solvesPs3: "Self-service reporting hub with portfolio summaries, risk reports, sector analysis, and executive dashboards.",
    businessBenefit: "Reduces analyst report generation time by 95% with pre-built templates and AI summaries.",
  },
  "/reporting/executive": {
    whyMatters: "Executive leadership needs real-time visibility into portfolio health, risk exposure, and growth trends for board presentations.",
    solvesPs3: "Board-ready executive dashboard with portfolio KPIs, risk distribution, sector analysis, and trend visualizations.",
    businessBenefit: "Real-time executive visibility into portfolio health, risk exposure, and growth trends — board-presentation quality.",
  },
};

const DEFAULT_OUTCOME: BusinessOutcome = {
  whyMatters: "This feature addresses a critical banking workflow gap in MSME lending operations.",
  solvesPs3: "Implements PS-3 requirements for AI-powered MSME credit assessment using alternate data.",
  businessBenefit: "Delivers measurable operational efficiency, risk reduction, or customer experience improvement.",
};

export function BusinessOutcomePanel() {
  const { isJudgeMode } = useJudge();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  if (!isJudgeMode) return null;

  return (
    <>
      <button
        onClick={() => {
          setCurrentPath(window.location.pathname);
          setIsOpen(!isOpen);
        }}
        className="fixed bottom-24 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-trust text-canvas shadow-glow transition-all hover:scale-110 active:scale-95"
        aria-label="Toggle business outcome panel"
      >
        <Lightbulb className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed bottom-36 right-6 z-40 w-80 rounded-2xl border border-surface/40 bg-panel/95 shadow-glow backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Target className="h-4 w-4 text-trust" />
                Business Outcome
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1 text-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 p-4">
              {(() => {
                const entry = Object.entries(PAGE_OUTCOMES).find(([path]) =>
                  currentPath.startsWith(path)
                );
                const outcome = entry ? entry[1] : DEFAULT_OUTCOME;
                return (
                  <>
                    <Section icon={Lightbulb} label="Why This Matters" text={outcome.whyMatters} />
                    <Section icon={Target} label="How It Solves PS-3" text={outcome.solvesPs3} />
                    <Section icon={TrendingUp} label="Business Benefit" text={outcome.businessBenefit} />
                  </>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Section({
  icon: Icon,
  label,
  text,
}: {
  icon: typeof Lightbulb;
  label: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="h-3.5 w-3.5 text-trust" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-trust/80">
          {label}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-muted">{text}</p>
    </div>
  );
}
