"use client";

import Link from "next/link";
import type { RiskBand } from "@/domain/types";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type HeatmapItem = {
  id: string;
  label: string;
  value: number;
  band: RiskBand;
  href?: string;
  subtitle?: string;
};

const intensity: Record<RiskBand, { bg: string; text: string; border: string }> = {
  low: { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  medium: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  high: { bg: "bg-orange-50", text: "text-orange-800", border: "border-orange-200" },
  critical: { bg: "bg-red-50", text: "text-red-800", border: "border-red-200" }
};

export function PortfolioHeatmap({
  items,
  role,
  columns = 4,
  className
}: {
  items: HeatmapItem[];
  role?: string;
  columns?: number;
  className?: string;
}) {
  const colClass = {
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    5: "sm:grid-cols-3 lg:grid-cols-5"
  };

  return (
    <div className={cn("grid gap-2", colClass[columns as keyof typeof colClass] ?? "sm:grid-cols-4", className)}>
      {items.map((item) => {
        const style = intensity[item.band];
        const card = (
          <div
            className={cn(
              "rounded-lg border p-3 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-elevated",
              style.bg,
              style.border
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <p className={cn("truncate text-sm font-semibold", style.text)}>{item.label}</p>
              <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase", style.bg, style.text)}>
                {item.band}
              </span>
            </div>
            <p className={cn("mt-2 text-lg font-bold", style.text)}>{formatCurrency(item.value)}</p>
            {item.subtitle && (
              <p className={cn("mt-1 truncate text-[11px] opacity-70", style.text)}>{item.subtitle}</p>
            )}
          </div>
        );
        return item.href ? (
          <Link key={item.id} href={item.href}>
            {card}
          </Link>
        ) : (
          <div key={item.id}>{card}</div>
        );
      })}
    </div>
  );
}
