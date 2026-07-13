"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getGuide } from "@/features/judge-experience/guide-config";

const roleStepMap: Record<string, { role: string; step: number; total: number }> = {
  "/": { role: "All", step: 1, total: 1 },
  "/customer/dashboard": { role: "Customer", step: 1, total: 6 },
  "/customer/business": { role: "Customer", step: 2, total: 6 },
  "/customer/apply": { role: "Customer", step: 3, total: 6 },
  "/customer/documents": { role: "Customer", step: 4, total: 6 },
  "/customer/status": { role: "Customer", step: 5, total: 6 },
  "/consumer/support": { role: "Customer", step: 6, total: 6 },
  "/command-center": { role: "Loan Officer", step: 1, total: 6 },
  "/applications": { role: "Loan Officer", step: 2, total: 6 },
  "/applications/[id]": { role: "Loan Officer", step: 3, total: 6 },
  "/applications/[id]/memo": { role: "Loan Officer", step: 4, total: 6 },
  "/applications/[id]/production-memo": { role: "Loan Officer", step: 5, total: 6 },
  "/applications/[id]/timeline": { role: "Loan Officer", step: 6, total: 6 },
  "/portfolio/[msmeId]": { role: "Manager", step: 2, total: 5 },
  "/portfolio": { role: "Manager", step: 3, total: 5 },
  "/audit": { role: "Manager", step: 4, total: 5 },
  "/reporting": { role: "Manager / Executive", step: 1, total: 3 },
  "/reporting/executive": { role: "Executive", step: 2, total: 3 },
  "/settings": { role: "All", step: 1, total: 1 },
  "/notifications": { role: "All", step: 1, total: 1 },
  "/help": { role: "All", step: 1, total: 1 },
  "/profile": { role: "All", step: 1, total: 1 },
};

function matchDynamicRoute(path: string, pattern: string): boolean {
  const patternParts = pattern.split("/");
  const pathParts = path.split("/");
  if (patternParts.length !== pathParts.length) return false;
  return patternParts.every((p, i) => p.startsWith("[") || p === pathParts[i]);
}

function findStep(pathname: string): { role: string; step: number; total: number } | null {
  const normalized = pathname.split("?")[0];
  if (roleStepMap[normalized]) return roleStepMap[normalized];
  for (const [pattern, info] of Object.entries(roleStepMap)) {
    if (pattern.includes("[") && matchDynamicRoute(normalized, pattern)) {
      return info;
    }
  }
  return null;
}

export function PagePurpose({ className }: { className?: string }) {
  const pathname = usePathname();
  const guide = getGuide(pathname);
  const stepInfo = findStep(pathname);

  if (!guide) return null;

  return (
    <div className={cn("rounded-xl border border-white/[0.06] bg-white/[0.02] p-4", className)}>
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">Purpose</p>
          <p className="text-sm text-ink leading-relaxed">{guide.purpose}</p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted pt-1">Business Value</p>
          <p className="text-sm text-ink leading-relaxed">{guide.businessValue}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {stepInfo && (
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-trust/20 bg-trust-light/10 px-2.5 py-1 text-[10px] font-medium text-trust">
              <span className="grid h-3 w-3 place-items-center rounded-full bg-trust/20 text-[7px] font-bold text-trust">
                {stepInfo.step}
              </span>
              Step {stepInfo.step} of {stepInfo.total}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-muted">
            {stepInfo?.role ?? "All"}
          </span>
        </div>
      </div>
    </div>
  );
}
