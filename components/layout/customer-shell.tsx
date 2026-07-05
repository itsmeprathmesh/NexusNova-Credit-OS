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
      <header className="sticky top-0 z-20 border-b border-line bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link href="/customer/dashboard" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-trust text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">NexusNova Bank</p>
              <p className="text-xs text-muted">MSME Customer Portal</p>
            </div>
          </Link>
          <Link
            href="/customer/status"
            className="hidden min-h-10 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-semibold md:inline-flex"
          >
            <ClipboardList className="h-4 w-4" />
            Track status
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white px-2 py-2 shadow-[0_-12px_30px_rgba(16,19,24,0.08)] md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {customerNav.map((item) => {
            const Icon = item.icon;
            const selected = active === item.href.split("/").pop();

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-semibold text-muted",
                  selected && "bg-slate-100 text-trust"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
