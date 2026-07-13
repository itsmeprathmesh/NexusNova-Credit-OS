"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getGuide } from "@/features/judge-experience/guide-config";

interface Action {
  label: string;
  path: string;
  icon: string;
  variant?: "primary" | "secondary" | "ghost";
}

const PAGE_ACTIONS: Record<string, Action[]> = {
  "/command-center": [
    { label: "View Application Queue", path: "/applications", icon: "list", variant: "primary" },
    { label: "Review Portfolio", path: "/portfolio", icon: "pie", variant: "secondary" },
    { label: "Check Reports", path: "/reporting", icon: "file", variant: "ghost" },
  ],
  "/applications": [
    { label: "Open Application", path: "/applications/app-1001", icon: "eye", variant: "primary" },
    { label: "Command Center", path: "/command-center", icon: "home", variant: "ghost" },
  ],
  "/applications/[id]": [
    { label: "Generate Credit Memo", path: "/applications/app-1001/production-memo", icon: "file", variant: "primary" },
    { label: "View Timeline", path: "/applications/app-1001/timeline", icon: "clock", variant: "secondary" },
    { label: "Customer 360", path: "/portfolio/msme-aurora", icon: "user", variant: "ghost" },
  ],
  "/applications/[id]/production-memo": [
    { label: "Approve Application", path: "/applications/app-1001", icon: "check", variant: "primary" },
    { label: "View Timeline", path: "/applications/app-1001/timeline", icon: "clock", variant: "secondary" },
    { label: "Application Workspace", path: "/applications/app-1001", icon: "briefcase", variant: "ghost" },
  ],
  "/applications/[id]/memo": [
    { label: "Generate Production Memo", path: "/applications/app-1001/production-memo", icon: "file", variant: "primary" },
    { label: "View Application", path: "/applications/app-1001", icon: "eye", variant: "secondary" },
    { label: "View Timeline", path: "/applications/app-1001/timeline", icon: "clock", variant: "ghost" },
  ],
  "/applications/[id]/timeline": [
    { label: "View Application", path: "/applications/app-1001", icon: "eye", variant: "primary" },
    { label: "Production Memo", path: "/applications/app-1001/production-memo", icon: "file", variant: "secondary" },
  ],
  "/portfolio": [
    { label: "Drill Down to MSME", path: "/portfolio/msme-aurora", icon: "user", variant: "primary" },
    { label: "View Audit Trail", path: "/audit", icon: "shield", variant: "secondary" },
    { label: "Command Center", path: "/command-center", icon: "home", variant: "ghost" },
  ],
  "/portfolio/[msmeId]": [
    { label: "View Application", path: "/applications/app-1001", icon: "eye", variant: "primary" },
    { label: "Portfolio Overview", path: "/portfolio", icon: "pie", variant: "secondary" },
  ],
  "/reporting": [
    { label: "Executive Dashboard", path: "/reporting/executive", icon: "trending", variant: "primary" },
    { label: "View Audit Trail", path: "/audit", icon: "shield", variant: "secondary" },
  ],
  "/reporting/executive": [
    { label: "Portfolio Intelligence", path: "/portfolio", icon: "pie", variant: "primary" },
    { label: "Reports Overview", path: "/reporting", icon: "file", variant: "secondary" },
  ],
  "/audit": [
    { label: "View Reports", path: "/reporting", icon: "file", variant: "primary" },
    { label: "Command Center", path: "/command-center", icon: "home", variant: "ghost" },
  ],
  "/customer/dashboard": [
    { label: "Apply for Loan", path: "/customer/apply", icon: "plus", variant: "primary" },
    { label: "View Status", path: "/customer/status", icon: "clock", variant: "secondary" },
    { label: "Contact Support", path: "/customer/support", icon: "help", variant: "ghost" },
  ],
  "/customer/business": [
    { label: "Continue to Apply", path: "/customer/apply", icon: "arrow", variant: "primary" },
    { label: "Back to Dashboard", path: "/customer/dashboard", icon: "home", variant: "ghost" },
  ],
  "/customer/apply": [
    { label: "Upload Documents", path: "/customer/documents", icon: "upload", variant: "primary" },
    { label: "View Dashboard", path: "/customer/dashboard", icon: "home", variant: "ghost" },
  ],
  "/customer/documents": [
    { label: "Track Application", path: "/customer/status", icon: "clock", variant: "primary" },
    { label: "Dashboard", path: "/customer/dashboard", icon: "home", variant: "ghost" },
  ],
  "/customer/status": [
    { label: "Contact Support", path: "/customer/support", icon: "help", variant: "primary" },
    { label: "Dashboard", path: "/customer/dashboard", icon: "home", variant: "ghost" },
  ],
  "/customer/support": [
    { label: "View Applications", path: "/customer/status", icon: "clock", variant: "primary" },
    { label: "Dashboard", path: "/customer/dashboard", icon: "home", variant: "ghost" },
  ],
  "/settings": [
    { label: "View Profile", path: "/profile", icon: "user", variant: "primary" },
    { label: "Help Center", path: "/help", icon: "help", variant: "ghost" },
  ],
  "/notifications": [
    { label: "Command Center", path: "/command-center", icon: "home", variant: "primary" },
    { label: "Settings", path: "/settings", icon: "settings", variant: "ghost" },
  ],
  "/help": [
    { label: "Settings", path: "/settings", icon: "settings", variant: "primary" },
    { label: "Profile", path: "/profile", icon: "user", variant: "ghost" },
  ],
  "/profile": [
    { label: "Settings", path: "/settings", icon: "settings", variant: "primary" },
    { label: "Help Center", path: "/help", icon: "help", variant: "ghost" },
  ],
};

const iconMap: Record<string, string> = {
  list: "→", pie: "◆", file: "📄", eye: "👁", home: "⌂",
  clock: "⏱", user: "👤", check: "✓", briefcase: "💼",
  trending: "📈", shield: "🛡", plus: "+", help: "?",
  arrow: "→", upload: "↑", settings: "⚙",
};

function matchDynamicRoute(path: string, pattern: string): boolean {
  const patternParts = pattern.split("/");
  const pathParts = path.split("/");
  if (patternParts.length !== pathParts.length) return false;
  return patternParts.every((p, i) => p.startsWith("[") || p === pathParts[i]);
}

function findActions(pathname: string): Action[] {
  const normalized = pathname.split("?")[0];
  if (PAGE_ACTIONS[normalized]) return PAGE_ACTIONS[normalized];
  for (const [pattern, actions] of Object.entries(PAGE_ACTIONS)) {
    if (pattern.includes("[") && matchDynamicRoute(normalized, pattern)) {
      return actions;
    }
  }
  return [];
}

export function SmartActionBar({ className }: { className?: string }) {
  const pathname = usePathname();
  const actions = findActions(pathname);

  if (actions.length === 0) return null;

  const variantStyles = {
    primary:
      "bg-trust text-canvas hover:bg-trust/90 shadow-[0_0_12px_rgba(216,255,62,0.15)]",
    secondary:
      "border border-white/[0.1] bg-white/[0.04] text-ink hover:bg-white/[0.08]",
    ghost:
      "text-muted hover:text-ink",
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.path}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-all active:scale-[0.97]",
            variantStyles[action.variant ?? "ghost"]
          )}
        >
          <span className="text-[11px]">{iconMap[action.icon] ?? "·"}</span>
          {action.label}
        </Link>
      ))}
    </div>
  );
}
