"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import {
  BadgeCheck,
  Brain,
  CreditCard,
  FileSearch,
  ShieldAlert,
  UserCheck,
  XCircle,
} from "lucide-react";
import type { FinancialSignals, MsmeProfile } from "@/domain/types";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/primitives";
import { computeNtcNtbProfile } from "@/services/alternate-data";

export function NtcDetection({
  msme,
  signals,
  className,
}: {
  msme: MsmeProfile;
  signals: FinancialSignals;
  className?: string;
}) {
  const profile = useMemo(
    () => computeNtcNtbProfile(msme, signals),
    [msme, signals]
  );

  const items = [
    {
      label: "Credit Profile",
      value: profile.creditProfile,
      icon: CreditCard,
      good: profile.isNtc || profile.isNtb,
    },
    {
      label: "Description",
      value: profile.description,
      icon: FileSearch,
      good: !profile.isNtc && !profile.isNtb,
    },
    {
      label: "Alternate Data Available",
      value: profile.alternateDataAvailable ? "Yes" : "No",
      icon: BadgeCheck,
      good: profile.alternateDataAvailable,
    },
    {
      label: "Eligible for AI Assessment",
      value: profile.eligibleForAiAssessment ? "Yes" : "No",
      icon: Brain,
      good: profile.eligibleForAiAssessment,
    },
  ];

  return (
    <GlassPanel className={cn("p-6", className)}>
      <div className="flex items-center gap-2.5">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-trust-light text-trust">
          <UserCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">
            NTC / NTB Detection
          </p>
          <p className="text-[10px] text-muted">
            Credit profile assessment for credit-invisible MSMEs
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-4",
                item.good
                  ? "border-trust/20 bg-trust-light/20"
                  : "border-white/[0.06] bg-white/[0.02]"
              )}
            >
              <div
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                  item.good ? "bg-trust-light text-trust" : "bg-white/[0.04] text-muted"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted">{item.label}</p>
                <p
                  className={cn(
                    "mt-0.5 text-sm font-semibold",
                    item.good ? "text-ink" : "text-muted"
                  )}
                >
                  {item.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {profile.why && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-4 rounded-lg border border-trust/20 bg-trust-light/20 p-3"
        >
          <p className="flex items-start gap-2 text-xs leading-relaxed text-muted">
            <Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-trust" />
            {profile.why}
          </p>
        </motion.div>
      )}
    </GlassPanel>
  );
}
