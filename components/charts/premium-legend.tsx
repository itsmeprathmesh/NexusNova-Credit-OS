"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type LegendEntry = { color: string; value: string; dataKey?: string };

export function PremiumLegend({
  payload,
  onToggle,
  className
}: {
  payload?: LegendEntry[];
  onToggle?: (dataKey: string) => void;
  className?: string;
}) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  if (!payload?.length) return null;

  const handleClick = (entry: LegendEntry) => {
    if (!entry.dataKey) return;
    const next = new Set(hidden);
    if (next.has(entry.dataKey)) next.delete(entry.dataKey);
    else next.add(entry.dataKey);
    setHidden(next);
    onToggle?.(entry.dataKey);
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-4 pt-3", className)}>
      {payload.map((entry) => {
        const isHidden = entry.dataKey ? hidden.has(entry.dataKey) : false;
        return (
          <button
            key={entry.value}
            type="button"
            onClick={() => handleClick(entry)}
            className={cn(
              "flex items-center gap-1.5 transition-opacity duration-150",
              isHidden && "opacity-40"
            )}
          >
            <span
              className="h-2.5 w-2.5 rounded-sm transition-transform duration-150 hover:scale-125"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-muted">{entry.value}</span>
          </button>
        );
      })}
    </div>
  );
}
