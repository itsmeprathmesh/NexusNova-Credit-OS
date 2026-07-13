"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import {
  FileText,
  Smartphone,
  Building2,
  Users,
  Lightbulb,
  ArrowUp,
  Zap,
} from "lucide-react";
import type { FinancialSignals } from "@/domain/types";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/primitives";
import { LastUpdatedBadge } from "./real-time-badge";
import { computeAlternateDataSignals } from "@/services/alternate-data";

const sourceIcons = {
  gst: FileText,
  upi: Smartphone,
  "account-aggregator": Building2,
  epfo: Users,
  utility: Zap,
} as const;

const sourceGradients = {
  gst: "from-blue-500/20 to-purple-500/5",
  upi: "from-green-500/20 to-emerald-500/5",
  "account-aggregator": "from-orange-500/20 to-amber-500/5",
  epfo: "from-violet-500/20 to-purple-500/5",
  utility: "from-cyan-500/20 to-teal-500/5",
} as const;

export function AlternateDataGrid({
  signals,
  className,
}: {
  signals: FinancialSignals;
  className?: string;
}) {
  const dataSignals = useMemo(
    () => computeAlternateDataSignals(signals),
    [signals]
  );

  return (
    <section className={className}>
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-trust" />
          <h2 className="text-lg font-semibold text-ink">
            Alternate Data Intelligence
          </h2>
        </div>
        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-muted">
          Traditional lending depends on ITRs, audited financials, and long
          credit history — documents many MSMEs don&apos;t have. Our AI evaluates
          verified alternate business signals including GST filings, UPI
          collections, EPFO payroll, utility payments, and banking behaviour to
          generate a trusted financial profile for every MSME.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {dataSignals.map((signal, i) => {
          const Icon = sourceIcons[signal.source];
          return (
            <motion.div
              key={signal.source}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            >
              <GlassPanel className="h-full p-5">
                <div className="flex items-center gap-2.5">
                  <div
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br",
                      sourceGradients[signal.source],
                      "border border-white/[0.06]"
                    )}
                  >
                    <Icon className="h-4 w-4 text-ink" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {signal.label}
                    </p>
                    <Badge
                      tone={
                        signal.status === "connected" ? "success" : "warning"
                      }
                      className="text-[10px] px-1.5 py-0"
                    >
                      {signal.status === "connected" ? "Connected" : "Pending"}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {signal.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs text-muted">
                        {metric.label}
                      </span>
                      <span
                        className={cn(
                          "flex items-center gap-1 text-xs font-semibold",
                          metric.sentiment === "positive"
                            ? "text-growth"
                            : metric.sentiment === "negative"
                              ? "text-danger"
                              : "text-muted"
                        )}
                      >
                        {metric.sentiment === "positive" && (
                          <ArrowUp className="h-3 w-3" />
                        )}
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 border-t border-white/[0.06] pt-3">
                  <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-muted/80">
                    <span className="mt-0.5 shrink-0">
                      <Lightbulb className="h-3 w-3 text-trust/60" />
                    </span>
                    {signal.explainer}
                  </p>
                </div>

                <div className="mt-3">
                  <LastUpdatedBadge label="Synced" />
                </div>
              </GlassPanel>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
