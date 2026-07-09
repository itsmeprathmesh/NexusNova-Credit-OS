"use client";

import { CheckCircle2, Clock, Circle, ArrowRight, Activity, FileText, Smartphone, Building2, Users, Zap, BarChart3, Handshake, ClipboardCheck, BriefcaseBusiness, ShieldCheck } from "lucide-react";
import type { TimelineStage } from "@/domain/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/primitives";
import { AIBadge } from "@/components/ai/ai-status";

const journeyIcons: Record<string, typeof Circle> = {
  "welcome": CheckCircle2,
  "business-profile": CheckCircle2,
  "gst-connected": FileText,
  "upi-connected": Smartphone,
  "aa-connected": Building2,
  "epfo-connected": Users,
  "health-generated": Activity,
  "loan-ready": Handshake,
  "submitted": ClipboardCheck,
  "officer-review": CheckCircle2,
  "manager-review": BriefcaseBusiness,
  "credit-committee": BarChart3,
  "approved": ShieldCheck,
};

const journeyLabels: Record<string, string> = {
  "welcome": "Welcome",
  "business-profile": "Understand Your Business",
  "gst-connected": "Connect GST",
  "upi-connected": "Connect UPI",
  "aa-connected": "Connect Bank (AA)",
  "epfo-connected": "Connect EPFO",
  "health-generated": "Financial Health Card",
  "loan-ready": "Loan Ready",
  "submitted": "Application Submitted",
  "officer-review": "Officer Review",
  "manager-review": "Manager Review",
  "credit-committee": "Credit Committee",
  "approved": "Approved",
};

export function OnboardingJourney({
  stages,
  activeStage,
  className,
}: {
  stages: string[];
  activeStage?: string;
  className?: string;
}) {
  const activeIdx = activeStage ? stages.indexOf(activeStage) : -1;

  return (
    <div className={cn("space-y-0", className)}>
      {stages.map((stageId, index) => {
        const Icon = journeyIcons[stageId] || Circle;
        const isComplete = activeIdx > index;
        const isActive = activeIdx === index;
        const isPending = activeIdx < index;
        const isLast = index === stages.length - 1;

        return (
          <div key={stageId} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isComplete && "border-growth bg-growth/10 shadow-[0_0_12px_rgba(74,222,128,0.2)]",
                  isActive && "border-trust bg-trust/10 shadow-[0_0_12px_rgba(216,255,62,0.2)]",
                  isPending && "border-white/[0.08] bg-white/[0.02]"
                )}
              >
                {isComplete ? (
                  <CheckCircle2 className="h-4 w-4 text-growth" />
                ) : isActive ? (
                  <Icon className="h-4 w-4 text-trust" />
                ) : (
                  <Circle className="h-4 w-4 text-muted/40" />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "mt-1 w-0.5 flex-1 transition-all duration-500",
                    isComplete ? "bg-growth/30" : "bg-white/[0.04]"
                  )}
                  style={{ minHeight: "20px" }}
                />
              )}
            </div>
            <div className={cn("pb-4", isLast && "pb-0")}>
              <div className="flex items-center gap-2">
                <p
                  className={cn(
                    "text-sm font-semibold transition-all duration-300",
                    isComplete && "text-growth",
                    isActive && "text-trust",
                    isPending && "text-muted/40"
                  )}
                >
                  {journeyLabels[stageId] || stageId}
                </p>
                {isActive && (
                  <Badge tone="info" className="text-[10px] px-1.5 py-0">
                    <Clock className="h-2.5 w-2.5 mr-0.5" />
                    In Progress
                  </Badge>
                )}
                {isComplete && (
                  <Badge tone="success" className="text-[10px] px-1.5 py-0">Complete</Badge>
                )}
                {stageId === "health-generated" && isComplete && (
                  <AIBadge tone="complete">AI Assessment</AIBadge>
                )}
                {stageId === "loan-ready" && isActive && (
                  <AIBadge tone="analyzing">AI Reviewing</AIBadge>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function OnboardingWelcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-trust/20 via-trust/5 to-transparent border border-trust/20 p-6 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-trust text-canvas shadow-glow mb-4">
        <Activity className="h-7 w-7" />
      </div>
      <h2 className="text-xl font-bold text-ink">Welcome to Your Financial Health Journey</h2>
      <p className="mt-3 max-w-md mx-auto text-sm leading-6 text-muted">
        No ITR? No audited financials? No problem. Connect your business data sources and let AI
        assess your credit worthiness using alternate data — GST, UPI, bank accounts, and more.
      </p>
      <button
        onClick={onStart}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-trust px-6 py-3 text-sm font-semibold text-canvas shadow-glow transition-all hover:shadow-[0_0_30px_rgba(216,255,62,0.25)] active:scale-[0.97]"
      >
        Start Your Journey
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
