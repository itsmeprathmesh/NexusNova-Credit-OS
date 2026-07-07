"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Brain, BarChart3, ShieldCheck, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { AI_TOOLTIPS } from "./guide-config";
import type { AiTooltipData } from "./types";

const iconMap = {
  brain: Brain,
  chart: BarChart3,
  shield: ShieldCheck,
  trend: TrendingUp,
  info: Info,
};

interface AiTooltipProps {
  tooltipKey: string;
  icon?: keyof typeof iconMap;
  className?: string;
  size?: "sm" | "md";
}

export function AiTooltip({
  tooltipKey,
  icon = "info",
  className,
  size = "sm",
}: AiTooltipProps) {
  const [open, setOpen] = useState(false);
  const data = AI_TOOLTIPS[tooltipKey] as AiTooltipData | undefined;
  const Icon = iconMap[icon];

  if (!data) return null;

  const sizeClasses = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className={cn("relative inline-flex", className)}>
      <button
        onClick={() => setOpen((p) => !p)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="rounded-full p-0.5 text-muted transition-colors hover:text-trust"
        aria-label={`Learn more about ${data.label}`}
        type="button"
      >
        <Icon className={sizeClasses} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-xl border border-line bg-white p-4 shadow-elevated"
            role="tooltip"
          >
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-ink">{data.label}</h4>
              <span className="rounded-full bg-trust/10 px-2 py-0.5 text-[10px] font-medium text-trust">
                {data.confidence}%
              </span>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-muted">
              {data.description}
            </p>
            <div className="mb-2">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-trust">
                Data Sources
              </p>
              <ul className="space-y-0.5">
                {data.dataSources.map((src, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-1.5 text-[11px] text-muted"
                  >
                    <span className="block h-1 w-1 rounded-full bg-trust/50" />
                    {src}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[10px] italic text-muted">{data.businessMeaning}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
