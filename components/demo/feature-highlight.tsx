"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Sparkles, Brain, BarChart3, ShieldCheck, Zap, Eye } from "lucide-react";
import { useDemoMode } from "@/contexts/demo-mode";

const iconMap = {
  ai: Brain,
  analytics: BarChart3,
  shield: ShieldCheck,
  sparkle: Sparkles,
  zap: Zap,
  eye: Eye,
} as const;

type HighlightIcon = keyof typeof iconMap;

interface FeatureHighlightProps {
  label: string;
  icon?: HighlightIcon;
  className?: string;
  variant?: "badge" | "pill" | "inline";
}

const variants = {
  badge:
    "rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
  pill: "rounded-full px-3 py-1 text-xs font-medium",
  inline: "text-xs font-medium",
};

const colorVariants = {
  ai: "bg-trust/10 text-trust border-trust/20",
  analytics: "bg-growth/10 text-growth border-growth/20",
  shield: "bg-caution/10 text-caution border-caution/20",
  sparkle: "bg-trust/10 text-trust border-trust/20",
  zap: "bg-amber-50 text-amber-800 border-amber-200",
  eye: "bg-sky-50 text-sky-800 border-sky-200",
};

export function FeatureHighlight({
  label,
  icon = "sparkle",
  className,
  variant = "badge",
}: FeatureHighlightProps) {
  const { isDemoMode } = useDemoMode();
  const Icon = iconMap[icon];

  return (
    <motion.span
      initial={isDemoMode ? { opacity: 0, scale: 0.8 } : undefined}
      animate={isDemoMode ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "inline-flex items-center gap-1 border",
        variants[variant],
        colorVariants[icon],
        className
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      <span>{label}</span>
    </motion.span>
  );
}

export function DemoFeatureBadge({ children }: { children: ReactNode }) {
  const { isDemoMode } = useDemoMode();
  if (!isDemoMode) return <>{children}</>;
  return (
    <div className="relative">
      <div className="absolute -right-1.5 -top-1.5 z-10">
        <span className="flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-trust/40" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-trust" />
        </span>
      </div>
      {children}
    </div>
  );
}
