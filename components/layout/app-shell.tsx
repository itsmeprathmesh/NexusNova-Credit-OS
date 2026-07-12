"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  ClipboardList,
  Clock,
  Eye,
  FileText,
  HelpCircle,
  LayoutDashboard,
  MonitorPlay,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { type ReactNode, useEffect, useRef, useState, useCallback } from "react";
import type { UserRole } from "@/domain/types";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/ui/search-bar";
import { NotificationCenter } from "@/components/ui/notification-center";
import { UserMenu } from "@/components/ui/user-menu";
import { QuickActions } from "@/components/ui/quick-actions";
import { useDemoMode } from "@/contexts/demo-mode";
import { useDemoSession } from "@/contexts/demo-session";
import { useJudge, FeatureDiscoveryBar, RecommendedNext } from "@/features/judge-experience";
import { BusinessOutcomePanel } from "@/components/judge/business-outcome-panel";
import { resetDemoData } from "@/services/demo-seed";
import { useAuth } from "@/contexts/auth-context";
import { AccessDenied } from "@/components/auth/access-denied";
import { ContextualGuide } from "@/components/ui/contextual-guide";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  highlight?: string;
}

interface NavGroup {
  label: string;
  roles: UserRole[];
  items: NavItem[];
  isExecutive?: boolean;
}

const navGroups: NavGroup[] = [
  {
    label: "Workspace",
    roles: ["loan-officer"],
    items: [
      { href: "/command-center", label: "Dashboard", icon: LayoutDashboard, highlight: "AI Hub" },
      { href: "/applications", label: "Applications Queue", icon: ClipboardList, highlight: "AI Ready" },
      { href: "/applications/app-1001", label: "Financial Health Card", icon: Activity, highlight: "AI Score" },
      { href: "/applications/app-1001/production-memo", label: "Credit Memo", icon: FileText, highlight: "Auto-Gen" },
      { href: "/applications/app-1001/timeline", label: "Decision Timeline", icon: Clock, highlight: "Audit Trail" },
    ],
  },
  {
    label: "Intelligence",
    roles: ["loan-officer"],
    items: [
      { href: "/portfolio/msme-aurora", label: "Customer 360", icon: Users, highlight: "Full View" },
      { href: "/notifications", label: "Notifications", icon: Bell, highlight: "Alerts" },
    ],
  },
  {
    label: "Overview",
    roles: ["manager"],
    items: [
      { href: "/command-center", label: "Command Center", icon: LayoutDashboard, highlight: "AI Hub" },
      { href: "/applications", label: "Pending Approvals", icon: ClipboardList, highlight: "Queue" },
      { href: "/portfolio", label: "Portfolio Intelligence", icon: BriefcaseBusiness, highlight: "Analytics" },
      { href: "/portfolio/msme-aurora", label: "Customer 360", icon: Users, highlight: "Drilldown" },
    ],
  },
  {
    label: "Monitoring",
    roles: ["manager"],
    items: [
      { href: "/reporting", label: "Reports", icon: BarChart3, highlight: "Summary" },
      { href: "/reporting/executive", label: "Executive Dashboard", icon: TrendingUp, highlight: "Board" },
      { href: "/audit", label: "Audit Center", icon: FileText, highlight: "Compliance" },
      { href: "/notifications", label: "Notifications", icon: Bell, highlight: "Alerts" },
    ],
  },
];

function getVisibleGroups(role: UserRole): NavGroup[] {
  return navGroups.filter((g) => g.roles.includes(role));
}

function getAllNavItems(role: UserRole): NavItem[] {
  return getVisibleGroups(role).flatMap((g) => g.items);
}

const roleLabels: Record<UserRole, string> = {
  "loan-officer": "Loan Officer",
  manager: "Manager",
};

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function getBranch(): string {
  return "Mumbai Main Branch";
}

export function AppShell({
  children,
  active,
  role = "loan-officer",
  allowedRoles,
}: {
  children: ReactNode;
  active: "command-center" | "applications" | "portfolio" | "audit" | "reporting";
  role?: UserRole;
  allowedRoles?: UserRole[];
}) {
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const { endDemoSession } = useDemoSession();
  const { isJudgeMode, toggleJudgeMode, openHelp, startTour } = useJudge();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastRefresh] = useState("2 min ago");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const navRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const effectiveRole = user?.role ?? role;
  const visibleGroups = getVisibleGroups(effectiveRole);
  const visibleNavItems = getAllNavItems(effectiveRole);
  const canAccess = !allowedRoles || allowedRoles.includes(effectiveRole);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < visibleNavItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : visibleNavItems.length - 1));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      const link = navRef.current?.querySelector<HTMLAnchorElement>(`a[data-nav-index="${focusedIndex}"]`);
      link?.click();
    }
  }, [focusedIndex, visibleNavItems.length]);

  useEffect(() => {
    if (focusedIndex >= 0) {
      const link = navRef.current?.querySelector<HTMLAnchorElement>(`a[data-nav-index="${focusedIndex}"]`);
      link?.focus();
    }
  }, [focusedIndex]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/staff-login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="text-center">
          <RefreshCw className="mx-auto h-6 w-6 animate-spin text-trust" />
          <p className="mt-3 text-sm text-muted">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (!canAccess) {
    return <AccessDenied role={effectiveRole} />;
  }

  return (
    <div className="min-h-screen bg-canvas text-ink relative">
      <div className="noise-overlay fixed inset-0 z-0 pointer-events-none" />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Sidebar navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col bg-surface/95 backdrop-blur-xl border-r border-white/[0.06] transition-all duration-300 ease-out",
          collapsed ? "w-[72px]" : "w-[240px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col px-3 py-4">
          {/* Brand */}
          <div className={cn("flex items-center gap-3 px-2", collapsed && "justify-center")}>
            <Link
              href="/"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-trust text-canvas shadow-glow transition-all hover:shadow-[0_0_30px_rgba(216,255,62,0.25)]"
              aria-label="NexusNova Home"
              title="NexusNova Home"
            >
              <ShieldCheck className="h-5 w-5" />
            </Link>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink truncate">NexusNova</p>
                <p className="text-xs text-muted truncate">MSME Financial Health</p>
              </div>
            )}
          </div>

          {/* Mobile close */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute right-3 top-4 grid h-8 w-8 place-items-center rounded-xl text-muted hover:bg-white/[0.06] hover:text-ink lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Navigation */}
          <nav
            ref={navRef}
            aria-label="Main navigation"
            className="mt-4 flex-1 overflow-y-auto space-y-1"
            onKeyDown={handleKeyDown}
            role="menu"
          >
            {visibleGroups.map((group) => (
              <div key={group.label} className="space-y-0.5">
                {!collapsed && (
                  <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted/60">
                    {group.label}
                  </p>
                )}
                {group.items.map((item, index) => {
                  const Icon = item.icon;
                  const globalIndex = visibleNavItems.indexOf(item);
                  const selected = item.href.split("/")[1] === active || item.href.slice(1) === active;

                  return (
                    <Link
                      key={item.href}
                      href={`${item.href}?role=${role}`}
                      data-nav-index={globalIndex}
                      role="menuitem"
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none",
                        selected
                          ? "bg-trust-light text-trust"
                          : "text-muted hover:bg-white/[0.04] hover:text-ink",
                        collapsed && "justify-center px-2"
                      )}
                      aria-current={selected ? "page" : undefined}
                      tabIndex={focusedIndex === globalIndex ? 0 : -1}
                    >
                      {selected && (
                        <motion.span
                          layoutId="sidebar-active"
                          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-trust shadow-[0_0_8px_rgba(216,255,62,0.5)]"
                          aria-hidden="true"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform duration-200",
                          selected && "text-trust",
                          !selected && "group-hover:scale-110"
                        )}
                        aria-hidden="true"
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {isDemoMode && !selected && item.highlight && (
                            <span className="rounded-lg bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-muted">
                              {item.highlight}
                            </span>
                          )}
                          {isDemoMode && selected && (
                            <span className="flex h-2 w-2 shrink-0">
                              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-trust/40" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-trust" />
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}

            {/* Resources */}
            {!collapsed && (
              <div className="space-y-0.5 mt-3">
                <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted/40">
                  Resources
                </p>
                <Link
                  href="/ps-3-alignment"
                  className="group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-muted transition-all hover:bg-white/[0.04] hover:text-ink"
                >
                  <FileText className="h-3.5 w-3.5 shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  PS-3 Alignment
                </Link>
                <Link
                  href="/business-impact"
                  className="group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-muted transition-all hover:bg-white/[0.04] hover:text-ink"
                >
                  <BarChart3 className="h-3.5 w-3.5 shrink-0 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  Business Impact
                </Link>
              </div>
            )}
          </nav>

          {/* Sidebar collapse toggle */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="mb-3 hidden w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs text-muted transition-all hover:bg-white/[0.04] hover:text-ink lg:flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <>
                <PanelLeftClose className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>

          {/* Active Role */}
          <div className={cn(
            "rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all",
            collapsed ? "p-2" : "p-4"
          )}>
            <div className={cn(collapsed ? "text-center" : "")}>
              {!collapsed && (
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                  Active Role
                </p>
              )}
              <p className={cn("text-sm font-semibold text-ink", collapsed ? "text-[10px] mt-1" : "mt-1")}>
                {roleLabels[role]}
              </p>
              {!collapsed && (
                <p className="mt-1.5 text-xs text-muted/70">MSME-confidential data</p>
              )}
              {isDemoMode && (
                <div className={cn(
                  "flex items-center gap-1.5 border-t border-white/[0.06] pt-3 mt-3",
                  collapsed && "border-t-0 pt-0 mt-2 justify-center"
                )}>
                  <span className="flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-1.5 w-1.5 animate-ping rounded-full bg-growth" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-growth" />
                  </span>
                  {!collapsed && (
                    <span className="text-[10px] font-medium text-growth">Demo Session Active</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      <div className={cn(
        "relative z-10 transition-all duration-300",
        collapsed ? "lg:pl-[96px]" : "lg:pl-[264px]"
      )}>
        <header className="sticky top-0 z-20 px-4 pt-3 sm:px-6">
          <div className="glass-surface flex items-center justify-between gap-2 rounded-2xl px-4 py-2.5 shadow-glass sm:gap-3 sm:px-5 sm:py-3">
            {/* Left: Mobile menu + Brand */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-muted hover:bg-white/[0.06] hover:text-ink lg:hidden"
                aria-label="Open sidebar menu"
              >
                <LayoutDashboard className="h-4 w-4" />
              </button>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                  IDBI Innovate 2026 PS-3
                </p>
                <h1 className="text-sm font-semibold text-ink truncate">
                  NexusNova MSME Financial Health Card
                </h1>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Branch + Time */}
              <div className="hidden items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-muted xl:flex">
                <Clock className="h-3 w-3" aria-hidden="true" />
                <span>{formatTime(currentTime)}</span>
                <span className="text-white/[0.12]">|</span>
                <span className="truncate max-w-[120px]" title={getBranch()}>{getBranch()}</span>
              </div>

              {/* AI Refresh */}
              <div className="hidden items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[10px] text-muted md:flex" title="Last AI model refresh">
                <RefreshCw className="h-3 w-3 text-growth" aria-hidden="true" />
                <span className="hidden sm:inline">AI</span>
                <span>{lastRefresh}</span>
              </div>

              {/* Tour (demo only) */}
              {isDemoMode && (
                <button
                  onClick={startTour}
                  className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-muted transition-all hover:bg-white/[0.08] hover:text-ink active:scale-[0.97]"
                  aria-label="Start guided tour"
                >
                  <MonitorPlay className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Tour</span>
                </button>
              )}

              {/* Help */}
              <Link
                href="/help"
                className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-muted transition-all hover:bg-white/[0.08] hover:text-ink active:scale-[0.97]"
                aria-label="Open help center"
              >
                <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Help</span>
              </Link>

              {/* Judge mode */}
              <button
                onClick={toggleJudgeMode}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-all active:scale-[0.97]",
                  isJudgeMode
                    ? "border-trust/30 bg-trust-light text-trust"
                    : "border-white/[0.06] bg-white/[0.04] text-muted hover:bg-white/[0.08] hover:text-ink"
                )}
                aria-label={isJudgeMode ? "Disable judge mode" : "Enable judge mode"}
              >
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                <span className={cn(isJudgeMode ? "" : "hidden sm:inline")}>
                  {isJudgeMode ? "Judge On" : "Judge"}
                </span>
              </button>

              {/* Demo mode */}
              <button
                onClick={toggleDemoMode}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-medium transition-all active:scale-[0.97]",
                  isDemoMode
                    ? "border-trust/30 bg-trust-light text-trust"
                    : "border-white/[0.06] bg-white/[0.04] text-muted hover:bg-white/[0.08] hover:text-ink"
                )}
                aria-label={isDemoMode ? "Exit demo mode" : "Enter demo mode"}
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span className={isDemoMode ? "" : "hidden sm:inline"}>
                  {isDemoMode ? "Demo On" : "Demo"}
                </span>
              </button>

              {isDemoMode && (
                <button
                  onClick={() => {
                    endDemoSession();
                    window.location.href = "/";
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.04] px-2.5 py-1.5 text-xs font-medium text-muted transition-all hover:bg-white/[0.08] hover:text-ink active:scale-[0.97]"
                  aria-label="Reset demo data"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}

              <div className="h-6 w-px bg-white/[0.06]" aria-hidden="true" />

              <SearchBar />
              <NotificationCenter />

              {/* Role badges */}
              <div className="hidden items-center gap-1.5 sm:flex">
                <span className="rounded-lg border border-caution/20 bg-caution-light/50 px-2 py-1 text-[10px] font-semibold text-caution">
                  1 urgent
                </span>
                <span className="rounded-lg border border-trust/20 bg-trust-light/50 px-2 py-1 text-[10px] font-semibold text-trust">
                  {user?.name ?? roleLabels[role]}
                </span>
              </div>

              <Link
                href="/settings"
                className="grid min-h-9 min-w-9 place-items-center rounded-xl text-muted transition-all duration-200 hover:bg-white/[0.06] hover:text-ink active:scale-[0.95]"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </Link>
              <UserMenu currentRole={user?.role ?? role} user={user} />
            </div>
          </div>
        </header>

        <PageTransition key={pathname}>
          <div id="main-content">
            <FeatureDiscoveryBar />
            {children}
            <RecommendedNext />
          </div>
        </PageTransition>
      </div>

      <BusinessOutcomePanel />
      <QuickActions />
      <ContextualGuide />
    </div>
  );
}

function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <main className="px-4 py-5 sm:px-6 lg:px-8">{children}</main>
    </motion.div>
  );
}
