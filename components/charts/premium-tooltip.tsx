"use client";

import { type TooltipProps } from "recharts";
import { cn } from "@/lib/utils";

type TooltipConfig = Record<string, { label?: string; color?: string; format?: "currency" | "percent" | "number" }>;

export function PremiumTooltip({
  active,
  payload,
  label,
  config
}: TooltipProps<number, string> & { config?: TooltipConfig }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line/60 bg-white px-4 py-3 shadow-elevated backdrop-blur-xl">
      <p className="mb-2 text-xs font-medium text-muted">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry) => {
          const cfg = config?.[entry.dataKey ?? ""];
          const displayLabel = cfg?.label ?? entry.name;
          const color = cfg?.color ?? entry.color;
          let formatted = entry.value?.toLocaleString("en-IN");
          if (cfg?.format === "currency") formatted = `₹${formatted}`;
          if (cfg?.format === "percent") formatted = `${formatted}%`;
          return (
            <div key={entry.dataKey} className="flex items-center justify-between gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-muted">{displayLabel}</span>
              </div>
              <span className="font-semibold text-ink">{formatted}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SimplePremiumTooltip(props: TooltipProps<number, string>) {
  return <PremiumTooltip {...props} />;
}
