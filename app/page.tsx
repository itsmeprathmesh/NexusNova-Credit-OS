"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  ClipboardCheck,
  Eye,
  MonitorPlay,
  PlayCircle,
  Sparkles,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { seedDemoData, isSeeded } from "@/services/demo-seed";
import { computePortfolioHealth, computeSectorSummaries } from "@/services/portfolio-intelligence";
import { applications, financialSignals, msmes, portfolio } from "@/data/mock-data";
import { FadeInView, ScaleInView, SlideUpView, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { GlassCard, GlassPanel } from "@/components/ui/glass-panel";
import { CountUp } from "@/components/ui/count-up";
import { Badge } from "@/components/ui/primitives";
import { FeatureHighlight } from "@/components/demo/feature-highlight";
import { useDemoMode } from "@/contexts/demo-mode";
import { useJudge, FeatureDiscoveryBar, RecommendedNext } from "@/features/judge-experience";

const roles = [
  {
    label: "Customer",
    href: "/customer/login",
    icon: UserRound,
    description: "Apply for a loan, upload documents, track status, and get BANK AI support.",
  },
  {
    label: "Loan Officer",
    href: "/command-center?role=loan-officer",
    icon: ClipboardCheck,
    description:
      "Review urgent MSME loan cases, inspect evidence, run stress scenarios, and record decisions.",
  },
  {
    label: "Manager",
    href: "/command-center?role=manager",
    icon: BriefcaseBusiness,
    description:
      "Monitor portfolio risk, early warnings, exposure drift, and dynamic credit limit changes.",
  },
];

export default function HomePage() {
  const { isDemoMode, enableDemoMode } = useDemoMode();
  const { startTour, toggleJudgeMode } = useJudge();
  const demoActive = isDemoMode || isSeeded();

  const handleDemo = useCallback(() => {
    seedDemoData();
    enableDemoMode();
  }, [enableDemoMode]);

  const handleFullDemo = useCallback(() => {
    seedDemoData();
    enableDemoMode();
    toggleJudgeMode();
    setTimeout(() => startTour(), 500);
  }, [enableDemoMode, toggleJudgeMode, startTour]);

  const health = useMemo(
    () => computePortfolioHealth(msmes, portfolio, financialSignals),
    []
  );
  const sectors = useMemo(
    () => computeSectorSummaries(msmes, portfolio, financialSignals),
    []
  );
  const activeApps = applications.filter(
    (a) => a.status === "new" || a.status === "in-review"
  ).length;

  const liveMetrics = [
    {
      label: "Portfolio Exposure",
      value: health.totalExposure,
      format: true,
      hint: `${health.msmeCount} MSMEs`,
    },
    {
      label: "Risk Score",
      value: health.overallScore,
      suffix: "%",
      hint: health.band,
    },
    {
      label: "Sectors Covered",
      value: sectors.length,
      hint: "Industry verticals",
    },
    {
      label: "Active Pipeline",
      value: activeApps,
      hint: "Applications in review",
    },
  ];

  return (
    <main className="min-h-screen bg-canvas text-ink relative">
      <div className="noise-overlay fixed inset-0 z-0 pointer-events-none" />
      <div className="bg-hero-gradient relative z-10">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-trust text-canvas shadow-glow">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-ink">NexusNova OS</span>
            {isDemoMode && (
              <FeatureHighlight label="Demo" icon="zap" className="ml-2" />
            )}
          </div>
          <div className="flex items-center gap-2">
            {demoActive && (
              <button
                onClick={startTour}
                className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-sm font-medium text-muted transition-all hover:bg-white/[0.08] hover:text-ink active:scale-[0.97]"
              >
                <MonitorPlay className="h-4 w-4" />
                <span className="hidden sm:inline">Guided Tour</span>
              </button>
            )}
            <Link
              href="/command-center"
              className="btn-secondary text-sm"
            >
              Staff Login
            </Link>
          </div>
        </header>

        <section className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-16 pt-16 sm:px-6 lg:px-10 lg:pt-24">
          <FadeInView>
            <Badge tone="info" pill className="mb-6">
              IDBI Innovate 2026 PS-3
            </Badge>
          </FadeInView>

          <ScaleInView delay={0.1}>
            <h1 className="max-w-4xl text-center text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Credit Intelligence{" "}
              <span className="text-gradient">
                Operating System
              </span>
            </h1>
          </ScaleInView>

          <FadeInView delay={0.2}>
            <p className="mt-6 max-w-2xl text-center text-lg leading-8 text-muted">
              A banking-grade MSME lending workspace with explainable AI, human
              decision controls, portfolio intelligence, and enterprise audit.
            </p>
          </FadeInView>

          <StaggerContainer className="mt-12 grid w-full gap-5 md:grid-cols-4">
            {liveMetrics.map((metric) => (
              <StaggerItem key={metric.label}>
                <GlassCard className="text-center card-glow">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted/80">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-4xl font-bold text-ink tracking-tight">
                    {metric.format ? (
                      <span>
                        <CountUp value={Math.round(metric.value / 100000)} />
                        <span className="text-xl text-muted">L</span>
                      </span>
                    ) : (
                      <CountUp value={metric.value} suffix={metric.suffix ?? ""} />
                    )}
                  </p>
                  <p className="mt-1.5 text-xs text-muted">{metric.hint}</p>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-10 relative z-10">
        <FeatureDiscoveryBar />
        {isDemoMode && (
          <FadeInView>
            <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-trust/20 bg-trust-light/40 px-5 py-4">
              <Sparkles className="h-5 w-5 text-trust" aria-hidden="true" />
              <span className="text-sm font-medium text-ink">
                Demo mode active — all features are fully functional with
                pre-seeded data.
              </span>
              <button
                onClick={startTour}
                className="ml-auto flex items-center gap-1.5 rounded-xl bg-trust px-4 py-1.5 text-xs font-semibold text-canvas shadow-glow transition-all hover:shadow-[0_0_30px_rgba(216,255,62,0.25)] active:scale-[0.97]"
              >
                <MonitorPlay className="h-3.5 w-3.5" />
                Take the Tour
              </button>
            </div>
          </FadeInView>
        )}

        <StaggerContainer className="grid gap-6 md:grid-cols-3">
          {roles.map((role, i) => {
            const Icon = role.icon;
            const highlights = [
              { icon: "ai" as const, label: "AI-Powered" },
              { icon: "analytics" as const, label: "Real-time" },
              { icon: "shield" as const, label: "Secure" },
            ];
            return (
              <StaggerItem key={role.label}>
                <Link href={role.href} className="group block">
                  <GlassPanel variant="strong" className="p-7 card-glow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-trust-light text-trust transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-6 w-6" />
                      </div>
                      <ArrowRight className="mt-1 h-5 w-5 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-trust" />
                    </div>
                    <div className="mt-5 flex items-center gap-2">
                      <h2 className="text-2xl font-bold">{role.label}</h2>
                      {isDemoMode && (
                        <FeatureHighlight
                          label={highlights[i].label}
                          icon={highlights[i].icon}
                        />
                      )}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-muted">
                      {role.description}
                    </p>
                  </GlassPanel>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <SlideUpView delay={0.3}>
          <GlassPanel variant="strong" className="mt-8 p-7 card-glow">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <PlayCircle
                  className={`h-10 w-10 ${demoActive ? "text-growth" : "text-trust"}`}
                />
                <div>
                  <p className="text-lg font-semibold text-ink">
                    {demoActive ? "Demo data is active" : "Demo Mode"}
                  </p>
                  <p className="text-sm text-muted">
                    {demoActive
                      ? "Complete workflow seeded. Explore Customer Portal, Loan Officer Workspace, and Portfolio."
                      : "Seed realistic data to experience the complete workflow in under five minutes."}
                  </p>
                </div>
              </div>
              {!demoActive && (
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleDemo}
                    className="btn-secondary min-h-10"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Launch Demo
                  </button>
                  <button
                    type="button"
                    onClick={handleFullDemo}
                    className="btn-primary min-h-10"
                  >
                    <Eye className="h-4 w-4" />
                    Start Full Demo
                  </button>
                </div>
              )}
            </div>
            {demoActive && (
              <StaggerContainer className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    label: "Customer",
                    href: "/customer/dashboard",
                    desc: "View pre-seeded application",
                    icon: UserRound,
                  },
                  {
                    label: "Officer",
                    href: "/applications/app-1001?role=loan-officer",
                    desc: "Review AI + committee analysis",
                    icon: ClipboardCheck,
                  },
                  {
                    label: "Manager",
                    href: "/portfolio?role=manager",
                    desc: "Portfolio intelligence dashboard",
                    icon: TrendingUp,
                  },
                ].map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <StaggerItem key={item.label}>
                      <Link
                        href={item.href}
                        className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-trust/20 hover:shadow-glow"
                      >
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-trust-light text-trust transition-transform group-hover:scale-110">
                          <ItemIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-trust">
                            {item.label}
                          </p>
                          <p className="text-xs text-muted">{item.desc}</p>
                        </div>
                      </Link>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            )}
          </GlassPanel>
        </SlideUpView>

        <RecommendedNext />

        <FadeInView delay={0.4}>
          <footer className="mt-16 text-center text-sm text-muted">
            <p>
              NexusNova Credit Intelligence OS · IDBI Innovate 2026 PS-3 · Bank
              Confidential
            </p>
          </footer>
        </FadeInView>
      </section>
    </main>
  );
}
