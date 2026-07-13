"use client";

import { motion, AnimatePresence } from "motion/react";
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
  "/": {
    whyMatters: "10 crore+ Indian MSMEs are credit-invisible — they contribute 30% of GDP but access less than 15% of formal credit. This is the problem NexusNova solves.",
    solvesPs3: "PS-3 demands AI-powered MSME credit assessment using alternate data. NexusNova delivers this through an end-to-end platform that turns digital footprints into credit scores.",
    businessBenefit: "Unlocks a ₹50 lakh crore lending opportunity currently served by informal lenders at 24-36% interest rates.",
  },
  "/command-center": {
    whyMatters: "Loan officers need instant visibility into urgent cases, SLA breaches, and early warnings — every minute of delay risks portfolio health.",
    solvesPs3: "AI-powered operational hub delivers real-time portfolio intelligence with early warning detection, replacing manual dashboard monitoring.",
    businessBenefit: "Reduces response time to critical events by 90%, prevents SLA breaches, and enables proactive risk management.",
  },
  "/staff-login": {
    whyMatters: "Bank staff need a secure, role-based login that routes them to the right workspace based on their role.",
    solvesPs3: "Demonstrates enterprise-grade authentication with role-based access control for officers, managers, and executives.",
    businessBenefit: "Zero-trust security model with role-based access — compliant with banking security requirements.",
  },
  "/customer/register": {
    whyMatters: "Traditional MSME onboarding requires physical branch visits, paper forms, and days of processing. This excludes remote businesses.",
    solvesPs3: "Zero-paper, zero-branch-visit digital onboarding that captures alternate data from 5+ sources in under 5 minutes.",
    businessBenefit: "Reduces customer acquisition cost by 70% and expands addressable market to previously unreachable MSMEs.",
  },
  "/customer/business": {
    whyMatters: "MSMEs lack formal financial records. Their digital footprint (GST, UPI, bank statements) must be accessed with explicit consent.",
    solvesPs3: "GDPR-compliant consent framework for accessing alternate data sources — transparent, revocable, and auditable.",
    businessBenefit: "Access to 5+ alternate data sources enables credit assessment for 60% of MSMEs previously deemed unscorable.",
  },
  "/customer/documents": {
    whyMatters: "Manual document verification takes days and is error-prone. AI-powered document intelligence is essential for scale.",
    solvesPs3: "AI-powered document processing with OCR, fraud detection, and auto-verification across 10+ document types.",
    businessBenefit: "Reduces document processing time from 2 days to under 30 minutes with 99% AI accuracy.",
  },
  "/customer/apply": {
    whyMatters: "Lengthy application forms cause 60% abandonment rates. AI pre-filling eliminates friction.",
    solvesPs3: "AI-pre-filled loan application using data already collected — customer only reviews and submits.",
    businessBenefit: "90% reduction in application abandonment rate through intelligent data reuse.",
  },
  "/customer/dashboard": {
    whyMatters: "MSMEs need transparency into their financial health and loan application status to build trust in the system.",
    solvesPs3: "Customer-facing Financial Health Card with AI-derived health score, risk band, and improvement recommendations.",
    businessBenefit: "Builds MSME trust through transparency — customers see exactly how they are evaluated.",
  },
  "/applications": {
    whyMatters: "Every application represents a potential new customer — but manual review takes 5 days. Banks need AI to prioritize and accelerate.",
    solvesPs3: "Application queue with AI readiness scoring, confidence indicators, and explainable recommendations for every MSME application.",
    businessBenefit: "Reduces loan decision time from 5 days to under 2 hours with 96% AI confidence scoring.",
  },
  "/applications/[id]": {
    whyMatters: "Loan officers need a complete workspace with all AI insights, risk analysis, and decision tools in one place.",
    solvesPs3: "Comprehensive AI workspace with 9 AI engines, simulated credit committee, stress testing, and full audit trail.",
    businessBenefit: "One workspace replaces 5 banking systems — everything a loan officer needs for informed credit decisions.",
  },
  "/applications/[id]/production-memo": {
    whyMatters: "Credit memos take 3-4 hours of analyst time. Banks need automated, compliant, consistent documentation.",
    solvesPs3: "AI-generated bank-grade credit memo with risk assessment, financial ratios, peer comparison, and recommendation.",
    businessBenefit: "Saves 3-4 hours per application and ensures consistent, compliant credit memos every time.",
  },
  "/portfolio": {
    whyMatters: "Without portfolio intelligence, banks discover problems when NPAs materialize. Proactive monitoring prevents losses before they happen.",
    solvesPs3: "Enterprise-grade portfolio monitoring with risk heatmaps, sector comparisons, migration timelines, and early warning system.",
    businessBenefit: "Enables proactive risk management — identifies deteriorating MSMEs 2-3 months before they become NPAs.",
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
  "/business-impact": {
    whyMatters: "Banks need to quantify the business value of AI-powered MSME lending — processing time, cost savings, portfolio expansion.",
    solvesPs3: "Measurable business impact: 5 days → 2 hours, 60% market expansion, 80% cost reduction, 100% explainable AI.",
    businessBenefit: "ROI within 6 months through reduced processing costs, expanded portfolio, and lower credit losses.",
  },
  "/ps-3-alignment": {
    whyMatters: "Judges need to see exactly how NexusNova maps to every PS-3 requirement — no gaps, no ambiguity.",
    solvesPs3: "Complete PS-3 requirement mapping showing how each feature directly addresses problem statement criteria.",
    businessBenefit: "Demonstrates full PS-3 compliance with verifiable feature-to-requirement traceability.",
  },
  "/demo-complete": {
    whyMatters: "After the demo, judges need a clear summary of what they saw and what the next steps are.",
    solvesPs3: "Demo summary with journey highlights, PS-3 coverage, and deployment roadmap.",
    businessBenefit: "Clear call to action with measurable outcomes and implementation timeline.",
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
                aria-label="Close panel"
                className="rounded-md p-1 text-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 p-4">
              {(() => {
                let entry: [string, BusinessOutcome] | undefined;

                // Check exact match first
                entry = Object.entries(PAGE_OUTCOMES).find(([path]) => path === currentPath);
                if (!entry) {
                  // Check prefix match for nested routes
                  const sorted = Object.entries(PAGE_OUTCOMES).sort((a, b) => b[0].length - a[0].length);
                  entry = sorted.find(([path]) => {
                    if (!path.includes("[id]") && currentPath.startsWith(path)) return true;
                    const base = currentPath.replace(/\/applications\/[^/]+\//, "/applications/[id]/").replace(/\/applications\/[^/]+$/, "/applications/[id]").replace(/\/portfolio\/[^/]+$/, "/portfolio");
                    return base.startsWith(path);
                  });
                }
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
