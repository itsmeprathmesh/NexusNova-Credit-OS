import Link from "next/link";
import type { ReactNode } from "react";
import { Bot, Building2, ClipboardList, FileText, Home, IndianRupee, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const customerNav = [
  { href: "/customer/dashboard", label: "Home", icon: Home },
  { href: "/customer/business", label: "Business", icon: Building2 },
  { href: "/customer/apply", label: "Apply", icon: IndianRupee },
  { href: "/customer/documents", label: "Docs", icon: FileText },
  { href: "/customer/support", label: "AI", icon: Bot }
];

export function CustomerShell({
  children,
  active
}: {
  children: ReactNode;
  active: "dashboard" | "business" | "apply" | "documents" | "status" | "support";
}) {
  return (
    <div className="min-h-screen bg-canvas pb-24 text-ink md:pb-0">
      <header className="sticky top-0 z-20 px-4 pt-4">
        <div className="glass-surface mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl px-5 py-3 shadow-glass">
          <Link href="/customer/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-trust text-canvas shadow-glow">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">NexusNova Bank</p>
              <p className="text-xs text-muted">MSME Customer Portal</p>
            </div>
          </Link>
          <Link
            href="/customer/status"
            className="btn-secondary min-h-10 text-xs"
          >
            <ClipboardList className="h-4 w-4" />
            Track status
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 animate-fade-in">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.06] bg-surface/90 px-2 py-2 backdrop-blur-xl md:hidden shadow-[0_-12px_30px_rgba(0,0,0,0.3)]">
        <div className="grid grid-cols-5 gap-1">
          {customerNav.map((item) => {
            const Icon = item.icon;
            const selected = active === item.href.split("/").pop();

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold transition-all duration-200",
                  selected ? "bg-trust-light text-trust" : "text-muted hover:bg-white/[0.04] hover:text-ink"
                )}
              >
                <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
