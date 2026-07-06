"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  ClipboardCheck,
  PlayCircle,
  Sparkles,
  TrendingUp,
  UserRound,
  MonitorPlay,
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
  const { isDemoMode, enableDemoMode, startOnboarding } = useDemoMode();
  const demoActive = isDemoMode || isSeeded();

  const handleDemo = useCallback(() => {
    seedDemoData();
    enableDemoMode();
  }, [enableDemoMode]);

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
    <main className="min-h-screen bg-canvas text-ink">
      <div className="bg-hero-gradient">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-trust text-white shadow-sm">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold">NexusNova OS</span>
            {isDemoMode && (
              <FeatureHighlight label="Demo" icon="zap" className="ml-2" />
            )}
          </div>
          <div className="flex items-center gap-2">
            {demoActive && (
              <button
                onClick={startOnboarding}
                className="flex items-center gap-1.5 rounded-lg border border-trust/20 bg-trust/5 px-3 py-2 text-sm font-medium text-trust transition-all hover:bg-trust/10 active:scale-[0.97]"
              >
                <MonitorPlay className="h-4 w-4" />
                <span className="hidden sm:inline">Guided Tour</span>
              </button>
            )}
            <Link
              href="/command-center"
              className="rounded-lg border border-line bg-white/70 px-4 py-2 text-sm font-semibold text-ink backdrop-blur-sm transition-all duration-150 hover:bg-white active:scale-[0.97]"
            >
              Staff Login
            </Link>
          </div>
        </header>

        <section className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-12 pt-12 sm:px-6 lg:px-10 lg:pt-20">
          <FadeInView>
            <Badge tone="info" className="mb-6">
              IDBI Innovate 2026 PS-3
            </Badge>
          </FadeInView>

          <ScaleInView delay={0.1}>
            <h1 className="max-w-4xl text-center text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Credit Intelligence{" "}
              <span className="bg-gradient-to-r from-trust via-growth to-caution bg-clip-text text-transparent">
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

          <StaggerContainer className="mt-10 grid w-full gap-4 md:grid-cols-4">
            {liveMetrics.map((metric) => (
              <StaggerItem key={metric.label}>
                <GlassCard className="text-center">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-ink">
                    {metric.format ? (
                      <span>
                        <CountUp value={Math.round(metric.value / 100000)} />
                        <span className="text-lg text-muted">L</span>
                      </span>
                    ) : (
                      <CountUp value={metric.value} suffix={metric.suffix ?? ""} />
                    )}
                  </p>
                  <p className="mt-1 text-xs text-muted">{metric.hint}</p>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-10">
        {isDemoMode && (
          <FadeInView>
            <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-trust/20 bg-trust/5 px-5 py-4">
              <Sparkles className="h-5 w-5 text-trust" aria-hidden="true" />
              <span className="text-sm font-medium text-ink">
                Demo mode active — all features are fully functional with
                pre-seeded data.
              </span>
              <button
                onClick={startOnboarding}
                className="ml-auto flex items-center gap-1.5 rounded-lg bg-trust px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-trust/90 active:scale-[0.97]"
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
                  <GlassPanel variant="strong" className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-trust-light text-trust transition-transform duration-200 group-hover:scale-110">
                        <Icon className="h-6 w-6" />
                      </div>
                      <ArrowRight className="mt-1 h-5 w-5 text-muted transition-all duration-200 group-hover:translate-x-1 group-hover:text-trust" />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <h2 className="text-2xl font-semibold">{role.label}</h2>
                      {isDemoMode && (
                        <FeatureHighlight
                          label={highlights[i].label}
                          icon={highlights[i].icon}
                        />
                      )}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted">
                      {role.description}
                    </p>
                  </GlassPanel>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <SlideUpView delay={0.3}>
          <GlassPanel variant="strong" className="mt-8 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <PlayCircle
                  className={`h-8 w-8 ${demoActive ? "text-growth" : "text-trust"}`}
                />
                <div>
                  <p className="font-semibold text-ink">
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
                <button
                  type="button"
                  onClick={handleDemo}
                  className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-trust px-6 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#1a526a] active:scale-[0.97]"
                >
                  <PlayCircle className="h-4 w-4" />
                  Launch Demo Mode
                </button>
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
                        className="group flex items-center gap-3 rounded-xl border border-line/50 bg-white/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-trust/30 hover:shadow-elevated"
                      >
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-trust-light text-trust transition-transform group-hover:scale-110">
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
