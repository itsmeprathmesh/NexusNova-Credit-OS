"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, ClipboardCheck, PlayCircle, UserRound } from "lucide-react";
import { seedDemoData, isSeeded } from "@/services/demo-seed";
import { FadeInView, SlideUpView, StaggerContainer, StaggerItem } from "@/components/ui/motion";

const roles = [
  {
    label: "Customer",
    href: "/customer/login",
    icon: UserRound,
    description: "Apply for a loan, upload documents, track status, and get BANK AI support."
  },
  {
    label: "Loan Officer",
    href: "/command-center?role=loan-officer",
    icon: ClipboardCheck,
    description: "Review urgent MSME loan cases, inspect evidence, run stress scenarios, and record decisions."
  },
  {
    label: "Manager",
    href: "/command-center?role=manager",
    icon: BriefcaseBusiness,
    description: "Monitor portfolio risk, early warnings, exposure drift, and dynamic credit limit changes."
  }
];

export default function HomePage() {
  const [demoActive, setDemoActive] = useState(isSeeded());

  const handleDemo = useCallback(() => {
    seedDemoData();
    setDemoActive(true);
  }, []);

  return (
    <main className="min-h-screen bg-canvas px-4 py-8 text-ink sm:px-6 lg:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center">
        <FadeInView>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-trust">IDBI Innovate 2026 PS-3</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">NexusNova Credit Intelligence OS</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              A banking-grade MSME lending workspace for explainable credit intelligence, human decision controls, and
              portfolio early warnings.
            </p>
          </div>
        </FadeInView>

        <StaggerContainer className="mt-8 grid gap-4 md:grid-cols-3">
          {roles.map((role) => {
            const Icon = role.icon;

            return (
              <StaggerItem key={role.label}>
                <Link href={role.href} className="group block rounded-lg border border-line bg-white p-6 shadow-panel transition-all duration-200 hover:-translate-y-1 hover:shadow-elevated">
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-lg bg-slate-100 text-trust transition-transform duration-200 group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted transition-all duration-200 group-hover:translate-x-1 group-hover:text-trust" />
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold">{role.label}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted">{role.description}</p>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <SlideUpView delay={0.3}>
          <div className="mt-6 rounded-lg border border-line bg-white p-5 shadow-panel transition-all duration-200 hover:shadow-elevated">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <PlayCircle className={`h-8 w-8 ${demoActive ? "text-growth" : "text-trust"}`} />
                <div>
                  <p className="font-semibold text-ink">{demoActive ? "Demo data is active" : "Demo Mode"}</p>
                  <p className="text-sm text-muted">
                    {demoActive
                      ? "Complete workflow seeded. Explore the Customer Portal, Loan Officer Workspace, and Portfolio."
                      : "Seed the application with realistic data to experience the complete workflow in under five minutes."}
                  </p>
                </div>
              </div>
              {!demoActive && (
                <button
                  type="button"
                  onClick={handleDemo}
                  className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-trust px-6 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#1a526a] active:scale-[0.97]"
                >
                  <PlayCircle className="h-4 w-4" />
                  Launch Demo Mode
                </button>
              )}
            </div>
            {demoActive && (
              <StaggerContainer className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Customer", href: "/customer/dashboard", desc: "View pre-seeded application" },
                  { label: "Officer", href: "/applications/app-1001?role=loan-officer", desc: "Review AI + committee analysis" },
                  { label: "Manager", href: "/portfolio?role=manager", desc: "Portfolio intelligence dashboard" }
                ].map((item) => (
                  <StaggerItem key={item.label}>
                    <Link href={item.href} className="block rounded-lg border border-line p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-trust hover:shadow-sm">
                      <p className="font-semibold text-trust">{item.label}</p>
                      <p className="mt-1 text-xs text-muted">{item.desc}</p>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </SlideUpView>
      </section>
    </main>
  );
}
