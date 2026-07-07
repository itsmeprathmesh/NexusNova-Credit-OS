"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  BriefcaseBusiness,
  ClipboardList,
  Eye,
  FileText,
  LayoutDashboard,
  MonitorPlay,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import type { UserRole } from "@/domain/types";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/ui/search-bar";
import { NotificationCenter } from "@/components/ui/notification-center";
import { UserMenu } from "@/components/ui/user-menu";
import { QuickActions } from "@/components/ui/quick-actions";
import { useDemoMode } from "@/contexts/demo-mode";
import { useJudge, FeatureDiscoveryBar, RecommendedNext } from "@/features/judge-experience";

const navItems = [
  { href: "/command-center", label: "Command Center", icon: LayoutDashboard, highlight: "AI Hub" },
  { href: "/applications", label: "Applications", icon: ClipboardList, highlight: "Explainable AI" },
  { href: "/portfolio", label: "Portfolio", icon: BriefcaseBusiness, highlight: "Analytics" },
  { href: "/audit", label: "Audit", icon: FileText, highlight: "Compliance" },
  { href: "/reporting", label: "Reporting", icon: BarChart3, highlight: "Reports" },
];

const roleLabels: Record<UserRole, string> = {
  "loan-officer": "Loan Officer",
  manager: "Manager",
};

export function AppShell({
  children,
  active,
  role = "loan-officer",
}: {
  children: ReactNode;
  active: "command-center" | "applications" | "portfolio" | "audit" | "reporting";
  role?: UserRole;
}) {
  const { isDemoMode, toggleDemoMode, startOnboarding, toggleShortcuts } = useDemoMode();
  const { isJudgeMode, toggleJudgeMode, openHelp, startTour, newFeatures, markFeatureViewed } =
    useJudge();

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <aside
        aria-label="Sidebar navigation"
        className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-line/50 bg-white/95 px-4 py-5 shadow-panel backdrop-blur-xl lg:block"
      >
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-trust text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">NexusNova</p>
            <p className="text-xs text-muted">Credit Intelligence OS</p>
          </div>
        </Link>

        <nav aria-label="Main navigation" className="mt-8 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const selected = active === item.href.slice(1);

            return (
              <Link
                key={item.href}
                href={`${item.href}?role=${role}`}
                className={cn(
                  "group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  selected
                    ? "bg-trust-light text-trust"
                    : "text-muted hover:bg-slate-50 hover:text-ink"
                )}
                aria-current={selected ? "page" : undefined}
              >
                {selected && (
                  <span
                    className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-trust"
                    aria-hidden="true"
                  />
                )}
                <Icon
                  className={cn(
                    "h-4 w-4 transition-transform duration-150",
                    !selected && "group-hover:scale-110"
                  )}
                  aria-hidden="true"
                />
                <span className="flex-1">{item.label}</span>
                {isDemoMode && !selected && (
                  <span className="rounded bg-trust/10 px-1.5 py-0.5 text-[10px] font-medium text-trust">
                    {item.highlight}
                  </span>
                )}
                {isDemoMode && selected && (
                  <span className="flex h-2 w-2">
                    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-trust/40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-trust" />
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-line bg-slate-50 p-3 transition-colors hover:bg-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Active Role
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">
            {roleLabels[role]}
          </p>
          <p className="mt-2 text-xs text-muted">Bank-confidential data</p>
          {isDemoMode && (
            <div className="mt-2 flex items-center gap-1.5 border-t border-line/50 pt-2">
              <span className="flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-1.5 w-1.5 animate-ping rounded-full bg-growth" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-growth" />
              </span>
              <span className="text-[10px] font-medium text-growth">
                Demo Environment
              </span>
            </div>
          )}
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-line bg-white/90 px-4 py-2.5 backdrop-blur-md sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="hidden min-w-0 lg:block">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                IDBI Innovate 2026 PS-3
              </p>
              <h1 className="text-sm font-semibold text-ink">
                NexusNova Credit Intelligence OS
              </h1>
            </div>
            <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
              {isDemoMode && (
                <button
                  onClick={startTour}
                  className="flex items-center gap-1.5 rounded-lg border border-trust/20 bg-trust/5 px-3 py-1.5 text-xs font-medium text-trust transition-all hover:bg-trust/10 active:scale-[0.97]"
                  aria-label="Start guided tour"
                >
                  <MonitorPlay className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Tour</span>
                </button>
              )}
              <button
                onClick={openHelp}
                className="flex items-center gap-1.5 rounded-lg border border-trust/20 bg-trust/5 px-3 py-1.5 text-xs font-medium text-trust transition-all hover:bg-trust/10 active:scale-[0.97]"
                aria-label="Open judge guide"
              >
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Guide</span>
              </button>
              <button
                onClick={toggleJudgeMode}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.97]",
                  isJudgeMode
                    ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                    : "border-line bg-slate-50 text-muted hover:bg-slate-100 hover:text-ink"
                )}
                aria-label={isJudgeMode ? "Disable judge mode" : "Enable judge mode"}
              >
                <Eye className={cn("h-3.5 w-3.5", isJudgeMode && "text-amber-600")} aria-hidden="true" />
                <span>{isJudgeMode ? "Judge On" : "Judge"}</span>
              </button>
              <button
                onClick={toggleDemoMode}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.97]",
                  isDemoMode
                    ? "border-trust/30 bg-trust/10 text-trust hover:bg-trust/15"
                    : "border-line bg-slate-50 text-muted hover:bg-slate-100 hover:text-ink"
                )}
                aria-label={isDemoMode ? "Exit demo mode" : "Enter demo mode"}
              >
                <Sparkles
                  className={cn("h-3.5 w-3.5", isDemoMode && "text-trust")}
                  aria-hidden="true"
                />
                <span>{isDemoMode ? "Demo On" : "Demo"}</span>
              </button>
              <SearchBar />
              <NotificationCenter />
              <div className="hidden sm:flex flex-wrap items-center gap-2 text-xs font-medium">
                <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-amber-800">
                  1 urgent
                </span>
                <span className="rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-sky-800">
                  {roleLabels[role]}
                </span>
                <span className="hidden rounded-md border border-line bg-slate-50 px-2 py-1 text-muted md:inline">
                  Confidential
                </span>
              </div>
              <UserMenu currentRole={role} />
            </div>
          </div>
        </header>

        <PageTransition>
          <div id="main-content">
            <FeatureDiscoveryBar />
            {children}
            <RecommendedNext />
          </div>
        </PageTransition>
      </div>

      <QuickActions />
    </div>
  );
}

function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </motion.div>
  );
}
