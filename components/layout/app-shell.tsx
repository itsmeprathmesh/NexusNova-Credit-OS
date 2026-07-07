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
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const { isJudgeMode, toggleJudgeMode, openHelp, startTour } = useJudge();

  return (
    <div className="min-h-screen bg-canvas text-ink relative">
      <div className="noise-overlay fixed inset-0 z-0 pointer-events-none" />

      <aside
        aria-label="Sidebar navigation"
        className="fixed inset-y-0 left-0 z-20 hidden w-[240px] px-3 py-5 lg:block"
      >
        <div className="glass-surface flex h-full flex-col rounded-2xl p-4 shadow-glass">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-trust text-canvas shadow-glow">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">NexusNova</p>
              <p className="text-xs text-muted">Credit Intelligence OS</p>
            </div>
          </Link>

          <nav aria-label="Main navigation" className="mt-8 flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const selected = active === item.href.slice(1);

              return (
                <Link
                  key={item.href}
                  href={`${item.href}?role=${role}`}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    selected
                      ? "bg-trust-light text-trust"
                      : "text-muted hover:bg-white/[0.04] hover:text-ink"
                  )}
                  aria-current={selected ? "page" : undefined}
                >
                  {selected && (
                    <span
                      className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-trust shadow-[0_0_6px_rgba(216,255,62,0.4)]"
                      aria-hidden="true"
                    />
                  )}
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      selected && "text-trust",
                      !selected && "group-hover:scale-110"
                    )}
                    aria-hidden="true"
                  />
                  <span className="flex-1">{item.label}</span>
                  {isDemoMode && !selected && (
                    <span className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-muted">
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

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              Active Role
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">
              {roleLabels[role]}
            </p>
            <p className="mt-1.5 text-xs text-muted/70">Bank-confidential data</p>
            {isDemoMode && (
              <div className="mt-3 flex items-center gap-1.5 border-t border-white/[0.06] pt-3">
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
        </div>
      </aside>

      <div className="lg:pl-[264px] relative z-10">
        <header className="sticky top-0 z-20 px-4 pt-4 sm:px-6">
          <div className="glass-surface flex items-center justify-between gap-3 rounded-2xl px-5 py-3 shadow-glass">
            <div className="hidden min-w-0 lg:block">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
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
                  className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-muted transition-all hover:bg-white/[0.08] hover:text-ink active:scale-[0.97]"
                  aria-label="Start guided tour"
                >
                  <MonitorPlay className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Tour</span>
                </button>
              )}
              <button
                onClick={openHelp}
                className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-muted transition-all hover:bg-white/[0.08] hover:text-ink active:scale-[0.97]"
                aria-label="Open judge guide"
              >
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Guide</span>
              </button>
              <button
                onClick={toggleJudgeMode}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.97]",
                  isJudgeMode
                    ? "border-trust/30 bg-trust-light text-trust"
                    : "border-white/[0.06] bg-white/[0.04] text-muted hover:bg-white/[0.08] hover:text-ink"
                )}
                aria-label={isJudgeMode ? "Disable judge mode" : "Enable judge mode"}
              >
                <Eye className={cn("h-3.5 w-3.5")} aria-hidden="true" />
                <span>{isJudgeMode ? "Judge On" : "Judge"}</span>
              </button>
              <button
                onClick={toggleDemoMode}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.97]",
                  isDemoMode
                    ? "border-trust/30 bg-trust-light text-trust"
                    : "border-white/[0.06] bg-white/[0.04] text-muted hover:bg-white/[0.08] hover:text-ink"
                )}
                aria-label={isDemoMode ? "Exit demo mode" : "Enter demo mode"}
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{isDemoMode ? "Demo On" : "Demo"}</span>
              </button>
              <SearchBar />
              <NotificationCenter />
              <div className="hidden sm:flex flex-wrap items-center gap-2 text-xs font-medium">
                <span className="rounded-xl border border-caution/20 bg-caution-light px-2.5 py-1 text-caution">
                  1 urgent
                </span>
                <span className="rounded-xl border border-trust/20 bg-trust-light px-2.5 py-1 text-trust">
                  {roleLabels[role]}
                </span>
                <span className="hidden rounded-xl border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-muted md:inline">
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </motion.div>
  );
}
