"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Eye, Target, TrendingUp, ChevronDown, Lightbulb } from "lucide-react";
import { useDemoMode } from "@/contexts/demo-mode";
import { useJudge } from "@/features/judge-experience";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";

interface DemoPageEntry {
  step: number;
  id: string;
  title: string;
  purpose: string;
  businessValue: string;
  role: string;
}

const DEMO_STORY: DemoPageEntry[] = [
  { step: 1, id: "landing", title: "Landing", purpose: "Introduce NexusNova and the problem it solves for MSME lending.", businessValue: "Sets the stage for the entire demo narrative.", role: "judge" },
  { step: 2, id: "problem", title: "Problem Statement", purpose: "60% of MSMEs are credit-invisible — no ITR, no score, no access.", businessValue: "Unlocks a ₹50 lakh crore lending opportunity.", role: "judge" },
  { step: 3, id: "why-traditional", title: "Why Traditional Lending Fails", purpose: "Traditional credit assessment excludes businesses without formal financials.", businessValue: "Shows why alternate data is the only scalable solution.", role: "judge" },
  { step: 4, id: "alternate-data", title: "How Alternate Data Solves It", purpose: "GST, UPI, AA, EPFO, and utility data replace ITRs.", businessValue: "Assess credit-invisible MSMEs with 96% confidence.", role: "judge" },
  { step: 5, id: "customer-register", title: "Customer Registration", purpose: "MSME registers with zero paperwork and zero branch visit.", businessValue: "70% reduction in customer acquisition cost.", role: "customer" },
  { step: 6, id: "alternate-data-consent", title: "Alternate Data Consent", purpose: "Customer consents to data access — GDPR-compliant, transparent.", businessValue: "Builds trust through informed, revocable consent.", role: "customer" },
  { step: 7, id: "document-upload", title: "Document Upload", purpose: "AI-powered document intelligence extracts and verifies data instantly.", businessValue: "Eliminates manual document processing overhead.", role: "customer" },
  { step: 8, id: "loan-application", title: "Loan Application", purpose: "AI-pre-filled application reduces customer effort to under 5 minutes.", businessValue: "90% reduction in application abandonment rate.", role: "customer" },
  { step: 9, id: "financial-health-card", title: "AI Financial Health Card", purpose: "Unified health score, risk band, credit limit — replacing 20 pages of analysis.", businessValue: "Single-page credit decision in under 60 seconds.", role: "loan-officer" },
  { step: 10, id: "explainable-ai", title: "Explainable AI", purpose: "Every AI decision includes factor contribution, confidence, and recommendations.", businessValue: "Satisfies RBI guidelines on responsible AI.", role: "loan-officer" },
  { step: 11, id: "customer-360", title: "Customer 360", purpose: "Complete view of the MSME — financial health, documents, timeline, notes.", businessValue: "One workspace replaces 5 banking systems.", role: "loan-officer" },
  { step: 12, id: "credit-memo", title: "Credit Memo", purpose: "AI-generated bank-grade memo with risk assessment and recommendation.", businessValue: "Saves 3-4 hours per application.", role: "loan-officer" },
  { step: 13, id: "manager-approval", title: "Manager Approval", purpose: "Manager reviews, approves/rejects with full AI rationale visible.", businessValue: "Full audit trail for every decision.", role: "manager" },
  { step: 14, id: "portfolio-dashboard", title: "Portfolio Dashboard", purpose: "Enterprise portfolio monitoring with risk heatmaps and early warnings.", businessValue: "Catches potential NPAs 2-3 months earlier.", role: "manager" },
  { step: 15, id: "executive-dashboard", title: "Executive Dashboard", purpose: "Board-ready dashboards with portfolio KPIs and inclusion metrics.", businessValue: "Real-time executive visibility.", role: "executive" },
  { step: 16, id: "financial-inclusion-impact", title: "Financial Inclusion Impact", purpose: "Show how many previously credit-invisible MSMEs now have access.", businessValue: "Demonstrates measurable social impact.", role: "executive" },
  { step: 17, id: "business-impact", title: "Business Impact", purpose: "5 days → 2 hours. 60% market expansion. 80% cost reduction.", businessValue: "ROI within 6 months.", role: "judge" },
  { step: 18, id: "demo-complete", title: "Demo Complete", purpose: "Summary of everything covered and next steps.", businessValue: "Clear call to action for deployment.", role: "judge" },
];

const PAGE_MAP: Record<string, string> = {
  "/": "landing",
  "/command-center": "problem",
  "/staff-login": "problem",
  "/customer/register": "customer-register",
  "/customer/business": "alternate-data-consent",
  "/customer/documents": "document-upload",
  "/customer/apply": "loan-application",
  "/customer/status": "financial-health-card",
  "/customer/dashboard": "financial-health-card",
  "/applications": "customer-360",
  "/applications/[id]": "explainable-ai",
  "/applications/[id]/production-memo": "credit-memo",
  "/applications/[id]/memo": "credit-memo",
  "/applications/[id]/timeline": "manager-approval",
  "/portfolio": "portfolio-dashboard",
  "/portfolio/[msmeId]": "portfolio-dashboard",
  "/reporting/executive": "executive-dashboard",
  "/reporting": "financial-inclusion-impact",
  "/business-impact": "business-impact",
  "/demo-complete": "demo-complete",
  "/ps-3-alignment": "business-impact",
};

const ROLE_LABELS: Record<string, string> = {
  customer: "Customer",
  "loan-officer": "Loan Officer",
  manager: "Manager",
  executive: "Executive",
  judge: "Judge",
};

function findStoryEntry(pathname: string): DemoPageEntry | null {
  const base = pathname.split("?")[0];
  const storyId = PAGE_MAP[base];
  if (storyId) return DEMO_STORY.find((s) => s.id === storyId) ?? null;
  const match = base.match(/^\/applications\/([^/]+)/);
  if (match) {
    const subPath = base.replace(match[0], "/applications/[id]");
    const subId = PAGE_MAP[subPath];
    if (subId) return DEMO_STORY.find((s) => s.id === subId) ?? null;
  }
  const portfolioMatch = base.match(/^\/portfolio\/([^/]+)/);
  if (portfolioMatch) {
    return DEMO_STORY.find((s) => s.id === "portfolio-dashboard") ?? null;
  }
  if (base.startsWith("/reporting/executive")) return DEMO_STORY.find((s) => s.id === "executive-dashboard") ?? null;
  if (base.startsWith("/reporting")) return DEMO_STORY.find((s) => s.id === "financial-inclusion-impact") ?? null;
  return null;
}

export function DemoOverlay() {
  const { isDemoMode } = useDemoMode();
  const { isJudgeMode } = useJudge();
  const [showDetails, setShowDetails] = useState(false);
  const pathname = usePathname();

  const entry = useMemo(() => findStoryEntry(pathname), [pathname]);

  if (!isDemoMode || !entry) return null;

  return (
    <div className="mb-6">
      <div className="rounded-2xl border border-white/[0.08] bg-panel/80 backdrop-blur-sm shadow-sm overflow-hidden">
        <div className="px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-trust/20 bg-trust-light/10 px-2 py-0.5 text-[10px] font-semibold text-trust">
                  <Sparkles className="h-3 w-3" />
                  Step {entry.step} of {DEMO_STORY.length}
                </span>
                {entry.role && (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-muted">
                    <Eye className="h-3 w-3" />
                    {ROLE_LABELS[entry.role] ?? entry.role}
                  </span>
                )}
                {isJudgeMode && (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-growth/20 bg-growth/5 px-2 py-0.5 text-[10px] font-medium text-growth">
                    <Target className="h-3 w-3" />
                    Judge Mode
                  </span>
                )}
              </div>
              <h3 className="mt-2 text-sm font-semibold text-ink">{entry.title}</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="shrink-0 rounded-lg p-1.5 text-muted hover:bg-white/[0.06] hover:text-ink transition-colors"
              aria-label={showDetails ? "Hide details" : "Show details"}
            >
              <ChevronDown className={cn("h-4 w-4 transition-transform", showDetails && "rotate-180")} />
            </button>
          </div>

          <AnimatePresence initial={false}>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Lightbulb className="h-3.5 w-3.5 text-trust" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-trust/80">Purpose</span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted">{entry.purpose}</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingUp className="h-3.5 w-3.5 text-growth" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-growth/80">Business Value</span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted">{entry.businessValue}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="h-1 bg-white/[0.06]">
          <div
            className="h-full bg-gradient-to-r from-trust to-growth transition-all duration-500"
            style={{ width: `${(entry.step / DEMO_STORY.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export { DEMO_STORY, PAGE_MAP, type DemoPageEntry };
