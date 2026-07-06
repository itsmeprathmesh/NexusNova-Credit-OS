"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { RiskBand } from "@/domain/types";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type TreemapItem = {
  id: string;
  label: string;
  value: number;
  band?: RiskBand;
  href?: string;
  subtitle?: string;
};

const bandBg: Record<string, string> = {
  low: "bg-emerald-50 border-emerald-200 text-emerald-800",
  medium: "bg-amber-50 border-amber-200 text-amber-800",
  high: "bg-orange-50 border-orange-200 text-orange-800",
  critical: "bg-red-50 border-red-200 text-red-800",
  default: "bg-slate-50 border-line text-ink"
};

export function ExposureTreemap({
  items,
  className,
  maxHeight = 400
}: {
  items: TreemapItem[];
  className?: string;
  maxHeight?: number;
}) {
  const total = useMemo(() => items.reduce((s, i) => s + i.value, 0), [items]);
  const sorted = useMemo(() => [...items].sort((a, b) => b.value - a.value), [items]);

  return (
    <div className={cn("overflow-hidden rounded-xl border border-line/60", className)} style={{ maxHeight }}>
      <div className="flex flex-wrap">
        {sorted.map((item) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          const bg = bandBg[item.band ?? "default"];
          const content = (
            <div
              className={cn(
                "group relative flex flex-col justify-end border border-line/30 p-2.5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm",
                bg
              )}
              style={{ flex: `${pct} 0 auto`, minWidth: pct > 30 ? "40%" : pct > 15 ? "25%" : "15%" }}
            >
              <p className="truncate text-xs font-semibold">{item.label}</p>
              <p className="mt-0.5 text-[11px] font-medium opacity-80">{formatCurrency(item.value)}</p>
              {item.subtitle && (
                <p className="mt-0.5 truncate text-[10px] opacity-60">{item.subtitle}</p>
              )}
              <p className="mt-1 text-[10px] font-medium opacity-70">{pct.toFixed(1)}%</p>
            </div>
          );
          return item.href ? (
            <Link key={item.id} href={item.href} className={cn(pct < 10 && "flex-[0_0_10%]")}>
              {content}
            </Link>
          ) : (
            <div key={item.id} className={cn(pct < 10 && "flex-[0_0_10%]")}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
