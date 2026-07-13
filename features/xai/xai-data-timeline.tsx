"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Clock,
  Database,
  FileText,
  RefreshCw,
  Smartphone,
  Building2,
  Users,
  Zap,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/glass-panel";
import { computeAlternateDataSignals } from "@/services/alternate-data";
import type { FinancialSignals } from "@/domain/types";

const sourceIcons = {
  gst: FileText,
  upi: Smartphone,
  "account-aggregator": Building2,
  epfo: Users,
  utility: Zap,
  ai: Brain,
} as const;

const sourceColors = {
  gst: "text-blue-400 bg-blue-500/10",
  upi: "text-green-400 bg-green-500/10",
  "account-aggregator": "text-orange-400 bg-orange-500/10",
  epfo: "text-violet-400 bg-violet-500/10",
  utility: "text-cyan-400 bg-cyan-500/10",
  ai: "text-trust bg-trust/10",
} as const;

export function DataTimeline({
  signals,
  className,
}: {
  signals?: FinancialSignals;
  className?: string;
}) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  const dataSignals = signals ? computeAlternateDataSignals(signals) : [];

  const timelineItems = [
    ...dataSignals.map((s) => ({
      id: s.source,
      label: s.label,
      detail: s.lastUpdated,
      icon: sourceIcons[s.source] || Database,
      color: sourceColors[s.source] || "text-muted bg-white/[0.04]",
      live: s.lastUpdated.includes("minute") || s.lastUpdated.includes("Live"),
    })),
    {
      id: "ai",
      label: "AI Assessment",
      detail: "Generated now",
      icon: Brain,
      color: sourceColors.ai,
      live: true,
    },
  ];

  return (
    <GlassPanel className={cn("p-6", className)}>
      <div className="flex items-center gap-2.5">
        <Clock className="h-5 w-5 text-trust" />
        <h3 className="text-sm font-semibold text-ink">Alternate Data Timeline</h3>
      </div>
      <p className="mt-1 text-xs text-muted">
        Near real-time data synchronisation from connected sources.
      </p>

      <div className="mt-5 space-y-3">
        {timelineItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
            >
              <div className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", item.color)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-ink">{item.label}</p>
                  {item.live && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-trust/40" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-trust" />
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted">{item.detail}</p>
              </div>
              {item.live ? (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-trust">
                  <RefreshCw className="h-2.5 w-2.5" />
                  Live
                </span>
              ) : (
                <span className="text-[10px] text-muted">
                  <RefreshCw className="mr-0.5 inline h-2.5 w-2.5" />
                  Synced
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </GlassPanel>
  );
}
