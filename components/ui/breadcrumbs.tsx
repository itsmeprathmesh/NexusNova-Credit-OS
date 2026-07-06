"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronRight, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const labelMap: Record<string, string> = {
  "command-center": "Command Center",
  applications: "Applications",
  portfolio: "Portfolio",
  audit: "Audit Center",
  reporting: "Reporting",
  executive: "Executive Dashboard",
  memo: "Credit Memo",
  "production-memo": "Production Memo",
  timeline: "Decision Timeline",
  customer: "Customer Portal",
  dashboard: "Dashboard",
  business: "Business Registration",
  apply: "Apply",
  documents: "Documents",
  support: "AI Support",
  login: "Login",
  register: "Register",
  status: "Application Status"
};

export function Breadcrumbs({ className }: { className?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    const hrefWithRole = role ? `${href}?role=${role}` : href;
    crumbs.push({ label, href: hrefWithRole });
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5 text-xs text-muted", className)}>
      <Link href="/" className="transition-colors hover:text-ink">
        <LayoutDashboard className="h-3.5 w-3.5" />
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3" />
          {i === crumbs.length - 1 ? (
            <span className="font-medium text-ink" aria-current="page">
              {crumb.label}
            </span>
          ) : (
            <Link href={crumb.href} className="transition-colors hover:text-ink">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
