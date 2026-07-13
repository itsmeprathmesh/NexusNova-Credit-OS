"use client";

import { motion } from "motion/react";
import {
  CheckCircle2,
  CreditCard,
  IndianRupee,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/primitives";
import { ConfidenceBar } from "@/components/ai/confidence-indicator";

export interface LoanEligibilityData {
  productName: string;
  eligible: boolean;
  reason: string;
  confidence: number;
  factors: { label: string; positive: boolean; detail: string }[];
  suggestedAmount?: string;
}

export function LoanEligibilityExplanation({
  eligibility,
  className,
}: {
  eligibility: LoanEligibilityData;
  className?: string;
}) {
  return (
    <GlassPanel className={cn("p-6", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-trust-light text-trust">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Loan Recommendation</p>
            <p className="text-[10px] text-muted">Why this product was selected</p>
          </div>
        </div>
        <div className="text-right">
          <Badge
            tone={eligibility.eligible ? "success" : "warning"}
            className="text-xs"
          >
            {eligibility.eligible ? "Eligible" : "Conditional"}
          </Badge>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-growth/20 bg-growth-light/20 p-4">
        <p className="text-base font-bold text-ink">{eligibility.productName}</p>
        <p className="mt-1 text-sm text-muted leading-relaxed">{eligibility.reason}</p>
      </div>

      <div className="mt-4 space-y-2">
        {eligibility.factors.map((factor, i) => (
          <motion.div
            key={factor.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
          >
            {factor.positive ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-growth" />
            ) : (
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-caution" />
            )}
            <div>
              <p className="text-sm font-semibold text-ink">{factor.label}</p>
              <p className="text-xs text-muted">{factor.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-trust/20 bg-trust-light/20 p-4">
        <div className="flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-trust" />
          <span className="text-sm text-muted">AI Confidence</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-ink">{eligibility.confidence}%</span>
          <div className="w-24">
            <ConfidenceBar score={eligibility.confidence} />
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

export function getDemoLoanEligibility(): LoanEligibilityData {
  return {
    productName: "Working Capital Term Loan",
    eligible: true,
    reason:
      "Healthy cash flow, stable monthly revenue, strong digital payment behaviour, and low operational risk qualify this MSME for working capital financing.",
    confidence: 94,
    factors: [
      { label: "Cash Flow Health", positive: true, detail: "Average monthly balance comfortably covers obligations" },
      { label: "Revenue Stability", positive: true, detail: "6-month revenue trend is positive with consistent growth" },
      { label: "Digital Payment Behaviour", positive: true, detail: "UPI collections show reliable business activity" },
      { label: "GST Compliance", positive: true, detail: "Returns filed consistently with high compliance score" },
      { label: "Credit History", positive: false, detail: "Limited traditional credit history — offset by alternate data" },
    ],
    suggestedAmount: "₹42,00,000",
  };
}
