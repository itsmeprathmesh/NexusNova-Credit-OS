"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getGuide } from "@/features/judge-experience/guide-config";

export function RelatedFeatures({ className }: { className?: string }) {
  const pathname = usePathname();
  const guide = getGuide(pathname);

  if (!guide || !guide.relatedPages || guide.relatedPages.length === 0) return null;

  return (
    <div className={cn("rounded-xl border border-white/[0.06] bg-white/[0.02] p-4", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-3">Related Tools & Features</p>
      <div className="flex flex-wrap gap-2">
        {guide.relatedPages.map((page) => (
          <Link
            key={page.path}
            href={page.path}
            className="group inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-muted transition-all hover:border-trust/20 hover:bg-trust-light/10 hover:text-trust active:scale-[0.97]"
          >
            {page.label}
            <ArrowRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
