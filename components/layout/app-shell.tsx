import Link from "next/link";
import { BarChart3, BriefcaseBusiness, ClipboardList, FileText, LayoutDashboard, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { UserRole } from "@/domain/types";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/ui/search-bar";
import { NotificationCenter } from "@/components/ui/notification-center";
import { UserMenu } from "@/components/ui/user-menu";
import { QuickActions } from "@/components/ui/quick-actions";

const navItems = [
  { href: "/command-center", label: "Command Center", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: ClipboardList },
  { href: "/portfolio", label: "Portfolio", icon: BriefcaseBusiness },
  { href: "/audit", label: "Audit", icon: FileText },
  { href: "/reporting", label: "Reporting", icon: BarChart3 }
];

const roleLabels: Record<UserRole, string> = {
  "loan-officer": "Loan Officer",
  manager: "Manager"
};

export function AppShell({
  children,
  active,
  role = "loan-officer"
}: {
  children: ReactNode;
  active: "command-center" | "applications" | "portfolio" | "audit" | "reporting";
  role?: UserRole;
}) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-line bg-white px-4 py-5 shadow-panel lg:block">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-trust text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">NexusNova</p>
            <p className="text-xs text-muted">Credit Intelligence OS</p>
          </div>
        </Link>

        <nav className="mt-8 space-y-0.5">
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
              >
                {selected && (
                  <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-trust" />
                )}
                <Icon className={cn("h-4 w-4 transition-transform duration-150", !selected && "group-hover:scale-110")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-line bg-slate-50 p-3 transition-colors hover:bg-slate-100">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Active Role</p>
          <p className="mt-1 text-sm font-semibold text-ink">{roleLabels[role]}</p>
          <p className="mt-2 text-xs text-muted">Bank-confidential data</p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-line bg-white/90 px-4 py-2.5 backdrop-blur-md sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="hidden min-w-0 lg:block">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">IDBI Innovate 2026 PS-3</p>
              <h1 className="text-sm font-semibold text-ink">NexusNova Credit Intelligence OS</h1>
            </div>
            <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
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

        <PageTransition>{children}</PageTransition>
      </div>

      <QuickActions />
    </div>
  );
}

function PageTransition({ children }: { children: ReactNode }) {
  return (
    <div className="animate-fade-in">
      <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
