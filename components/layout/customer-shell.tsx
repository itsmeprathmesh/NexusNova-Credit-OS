"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, type ReactNode } from "react";
import {
  Activity,
  Bot,
  Building2,
  ClipboardList,
  Bell,
  FileText,
  IndianRupee,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BusinessOutcomePanel } from "@/components/judge/business-outcome-panel";
import { CustomerGuard } from "@/components/auth/customer-guard";
import { useCustomerAuth } from "@/contexts/customer-auth-context";

const customerNav = [
  { href: "/customer/dashboard", label: "Dashboard", icon: Activity },
  { href: "/customer/business", label: "Business Profile", icon: Building2 },
  { href: "/customer/apply", label: "Loan Application", icon: IndianRupee },
  { href: "/customer/documents", label: "Document Upload", icon: FileText },
  { href: "/customer/status", label: "Application Tracker", icon: ClipboardList },
  { href: "/customer/support", label: "AI Assistant", icon: Bot },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function CustomerShell({
  children,
  active
}: {
  children: ReactNode;
  active: "dashboard" | "business" | "apply" | "documents" | "status" | "support" | "notifications" | "settings" | "profile";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useCustomerAuth();

  const handleLogout = useCallback(() => {
    logout();
    router.push("/customer/login");
  }, [logout, router]);

  return (
    <CustomerGuard>
      <div className="min-h-screen bg-canvas pb-24 text-ink md:pb-0">
        <header className="sticky top-0 z-20 px-4 pt-3">
          <div className="glass-surface mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl px-5 py-3 shadow-glass">
            <Link href="/customer/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-80" aria-label="NexusNova Home">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-trust text-canvas shadow-glow">
                <Activity className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">NexusNova</p>
                <p className="text-xs text-muted truncate">Financial Health Card</p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/customer/status"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-ink transition-all hover:bg-white/[0.08] active:scale-[0.97]"
              >
                <ClipboardList className="h-4 w-4" />
                Track journey
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="grid h-9 w-9 place-items-center rounded-xl text-muted transition-all hover:bg-white/[0.06] hover:text-danger active:scale-[0.95]"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <main id="main-content" className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>

        <BusinessOutcomePanel />
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.06] bg-surface/95 px-2 py-2 backdrop-blur-xl md:hidden shadow-[0_-12px_30px_rgba(0,0,0,0.3)]" aria-label="Mobile navigation">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {customerNav.map((item) => {
              const Icon = item.icon;
              const selected = active === item.href.split("/").pop();

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-3 text-[11px] font-semibold transition-all duration-200",
                    selected ? "bg-trust-light text-trust" : "text-muted hover:bg-white/[0.04] hover:text-ink"
                  )}
                  aria-current={selected ? "page" : undefined}
                >
                  <Icon className={cn("h-5 w-5 transition-transform duration-200", selected && "scale-110")} aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </CustomerGuard>
  );
}
