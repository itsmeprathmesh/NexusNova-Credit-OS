"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Bot,
  CheckCircle2,
  ChevronDown,
  FileWarning,
  IndianRupee,
  Activity,
  FileText,
  Smartphone,
  Building2,
  Users,
  Sparkles,
  Handshake,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { applications, documents, financialSignals, msmes } from "@/data/mock-data";
import { calculateCustomerReadiness } from "@/services/customer-support";
import { calculateAiReadiness } from "@/services/intelligence";
import { getUnreadCount, getSession } from "@/services/app-data";
import {
  computeAlternateDataSignals,
  computeOverallFinancialHealthScore,
  computeCreditVisibility,
  computeNtcNtbProfile,
} from "@/services/alternate-data";
import { formatCurrency } from "@/lib/format";
import { Badge, Button, Metric, Panel, ProgressBar } from "@/components/ui/primitives";
import { GlassCard, GlassPanel } from "@/components/ui/glass-panel";
import { FadeInView, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { ConfidenceBar } from "@/components/ai/confidence-indicator";
import { FinancialHealthCard, RealTimeBadge } from "@/components/financial-health";
import {
  DataTimeline,
  ImprovementRecommendations,
  computeImprovements,
  ConfidenceExplanation,
  getConfidenceExplanation,
} from "@/features/xai";
import { AiReadinessView } from "./ai-readiness-view";
import { NotificationCenter } from "./notification-center";
import { CustomerTimeline } from "./customer-timeline";
import { OnboardingJourney, OnboardingWelcome } from "./onboarding-journey";
import { LoanReadinessPanel, computeDemoReadiness } from "./loan-readiness-panel";
import { EducationCards } from "./education-cards";

const application = applications[0];
const msme = msmes.find((item) => item.id === application.msmeId)!;
const signals = financialSignals.find((item) => item.msmeId === msme.id)!;
const applicationDocuments = documents.filter((document) => document.applicationId === application.id);

const journeyStages = [
  "welcome",
  "business-profile",
  "gst-connected",
  "upi-connected",
  "aa-connected",
  "epfo-connected",
  "health-generated",
  "loan-ready",
  "submitted",
  "officer-review",
  "manager-review",
  "credit-committee",
  "approved",
];

const dataSources = [
  { key: "gst", icon: FileText, label: "GST", desc: "Verify turnover & compliance", connected: true },
  { key: "upi", icon: Smartphone, label: "UPI", desc: "Analyse payment collections", connected: true },
  { key: "aa", icon: Building2, label: "Bank (AA)", desc: "Banking data via AA", connected: true },
  { key: "epfo", icon: Users, label: "EPFO", desc: "Payroll & employment", connected: true },
];

export function CustomerDashboard() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showJourney, setShowJourney] = useState(true);
  const [showDataTimeline, setShowDataTimeline] = useState(false);
  const session = getSession();
  const readiness = calculateCustomerReadiness(application, applicationDocuments, signals);
  const aiReadiness = calculateAiReadiness(application.id);
  const unreadCount = useMemo(() => getUnreadCount(), []);

  const healthScore = useMemo(
    () => computeOverallFinancialHealthScore(msme, signals),
    []
  );
  const visibility = useMemo(
    () => computeCreditVisibility(signals, msme),
    []
  );
  const ntcProfile = useMemo(
    () => computeNtcNtbProfile(msme, signals),
    []
  );
  const loanReadiness = useMemo(
    () => computeDemoReadiness(signals),
    []
  );
  const altSignals = useMemo(
    () => computeAlternateDataSignals(signals),
    []
  );
  const improvements = useMemo(
    () => computeImprovements(signals),
    []
  );
  const confidenceExplanation = useMemo(
    () => getConfidenceExplanation(healthScore.confidence),
    []
  );

  return (
    <div className="space-y-6">
      {showJourney && (
        <FadeInView>
          <OnboardingWelcome onStart={() => setShowJourney(false)} />
        </FadeInView>
      )}

      {!showJourney && (
        <>
          <GlassCard className="overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-trust text-canvas shadow-glow">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    Welcome{session.registration ? `, ${session.registration.ownerName}` : ""}
                  </p>
                  <p className="text-xs text-muted">{msme.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RealTimeBadge />
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative rounded-xl border border-white/[0.06] bg-white/[0.04] p-2.5 transition hover:bg-white/[0.08]"
                >
                  <Bell className="h-4 w-4 text-muted" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[8px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-trust/20 bg-trust-light/20 px-4 py-3">
              <Sparkles className="h-4 w-4 text-trust" />
              <p className="text-xs text-muted">
                Your Financial Health Card is ready. AI has analysed your alternate data —
                {ntcProfile.isNtc ? " as a New-to-Credit MSME, you're eligible for alternate data assessment." : " your credit profile is established with strong alternate data coverage."}
              </p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-trust-light/30 border border-trust/20 p-4 text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-muted/80">Financial Health</p>
                <p className="mt-1 text-3xl font-bold text-trust">{healthScore.score}<span className="text-sm text-muted">/100</span></p>
                <ConfidenceBar score={healthScore.confidence} className="mt-2" />
                <p className="mt-1 text-[10px] text-muted">AI Confidence {healthScore.confidence}%</p>
              </div>
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-muted/80">Credit Visibility</p>
                <p className="mt-1 text-3xl font-bold text-ink">{visibility.overallScore}%</p>
                <ConfidenceBar score={visibility.overallScore} className="mt-2" />
                <p className="mt-1 text-[10px] text-muted">Alternate data coverage</p>
              </div>
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-muted/80">Loan Readiness</p>
                <p className="mt-1 text-3xl font-bold text-ink">{readiness.score}%</p>
                <ProgressBar value={readiness.score} className="mt-2" />
                <p className="mt-1 text-[10px] text-muted">{readiness.nextActions.length} action{readiness.nextActions.length !== 1 ? "s" : ""} remaining</p>
              </div>
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-muted/80">Credit Profile</p>
                <p className="mt-1 text-lg font-bold text-ink">{ntcProfile.creditProfile}</p>
                <Badge tone={ntcProfile.alternateDataAvailable ? "success" : "info"} className="mt-1 text-[10px]">
                  {ntcProfile.alternateDataAvailable ? "✓ Alternate Data Eligible" : "Data Pending"}
                </Badge>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {dataSources.map((ds) => {
                const Icon = ds.icon;
                return (
                  <div key={ds.key} className="flex items-center gap-2 rounded-lg border border-trust/20 bg-trust-light/20 px-3 py-2">
                    <Icon className="h-3.5 w-3.5 text-trust" />
                    <span className="text-xs font-medium text-ink">{ds.label}</span>
                    <span className="text-[10px] text-growth">✓</span>
                  </div>
                );
              })}
              <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <Handshake className="h-3.5 w-3.5 text-trust" />
                <span className="text-xs font-medium text-ink">Loan Ready</span>
                <Badge tone="success" className="text-[10px] px-1.5">Assessed</Badge>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/customer/apply"
                className="inline-flex items-center gap-2 rounded-xl bg-trust px-5 py-2.5 text-sm font-semibold text-canvas shadow-glow transition-all hover:shadow-[0_0_30px_rgba(216,255,62,0.25)] active:scale-[0.97]"
              >
                <IndianRupee className="h-4 w-4" />
                Apply for Loan
              </Link>
              <Link
                href="/customer/business"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-white/[0.08] active:scale-[0.97]"
              >
                <Building2 className="h-4 w-4" />
                Update Business Profile
              </Link>
              <Link
                href="/customer/support"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-white/[0.08] active:scale-[0.97]"
              >
                <Bot className="h-4 w-4" />
                Ask AI
              </Link>
            </div>
          </GlassCard>

          {showNotifications && <NotificationCenter />}

          <LoanReadinessPanel readiness={loanReadiness} signals={signals} />

          <Panel title="Your Financial Health Journey" action={<Badge tone="info">8/13 Complete</Badge>}>
            <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
              <OnboardingJourney stages={journeyStages} activeStage="loan-ready" />
              <div>
                <div className="rounded-xl border border-growth/20 bg-growth-light/20 p-4">
                  <p className="text-sm font-semibold text-growth">Latest Milestone</p>
                  <p className="mt-1 text-xs text-muted">
                    Your Financial Health Card has been generated. AI has analysed your alternate data
                    sources and determined you are eligible for AI-powered credit assessment.
                  </p>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {altSignals.slice(0, 4).map((signal) => (
                    <div key={signal.source} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <p className="text-xs font-semibold text-ink">{signal.label}</p>
                      <p className="mt-1 text-[10px] text-muted">{signal.metrics.map((m) => `${m.label}: ${m.value}`).join(" · ")}</p>
                      <p className="mt-2 text-[10px] leading-relaxed text-muted/70">{signal.explainer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowDataTimeline(!showDataTimeline)}
              className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 text-sm font-semibold text-ink transition hover:bg-white/[0.04]"
            >
              <span>Alternate Data Sync Timeline</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted transition-transform",
                  showDataTimeline && "rotate-180"
                )}
              />
            </button>
            {showDataTimeline && <DataTimeline signals={signals} />}
          </div>

          <AiReadinessView customerReadiness={readiness} aiReadiness={aiReadiness} />

          <div className="grid gap-6 md:grid-cols-2">
            <ImprovementRecommendations improvements={improvements} score={healthScore.score} />
            <ConfidenceExplanation
              score={healthScore.confidence}
              label={confidenceExplanation.label}
              explanation={confidenceExplanation.explanation}
              factors={confidenceExplanation.factors}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { href: "/customer/documents", icon: FileText, title: "Business Information", text: "Review submitted business data and documents." },
              { href: "/customer/status", icon: Activity, title: "Application Status", text: "Track your loan readiness and review progress." },
              { href: "/customer/support", icon: Bot, title: "AI Business Support", text: "Get answers about your financial health." }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="group block">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-trust/20 hover:shadow-glow">
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-trust-light text-trust transition-transform group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </div>
                      <ArrowRight className="mt-2 h-4 w-4 text-muted transition-all group-hover:translate-x-1 group-hover:text-trust" />
                    </div>
                    <p className="mt-4 font-semibold text-ink">{item.title}</p>
                    <p className="mt-2 text-xs leading-relaxed text-muted">{item.text}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <Panel title="Current Loan Application">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-ink">{application.product}</p>
                <p className="mt-1 text-sm text-muted">{application.purpose}</p>
              </div>
              <Badge tone="warning">{application.status}</Badge>
            </div>
          </Panel>

          <CustomerTimeline applicationId={application.id} status={application.status} />

          <EducationCards />
        </>
      )}
    </div>
  );
}
