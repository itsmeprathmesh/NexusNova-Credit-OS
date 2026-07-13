"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Eye, Sparkles } from "lucide-react";
import { useJudge } from "./guide-provider";

export function JudgeHighlight({
  children,
  label,
  className,
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  const { isJudgeMode } = useJudge();

  if (!isJudgeMode) return <>{children}</>;

  return (
    <div className={cn("relative", className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute -right-1.5 -top-1.5 z-10"
      >
        <span className="flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-trust/50" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-trust" />
        </span>
      </motion.div>
      <div className="rounded-lg ring-1 ring-trust/20">
        {children}
      </div>
    </div>
  );
}

export function JudgeBadge({
  label,
  icon,
  className,
}: {
  label: string;
  icon?: "eye" | "sparkle";
  className?: string;
}) {
  const { isJudgeMode } = useJudge();
  const Icon = icon === "sparkle" ? Sparkles : Eye;

  if (!isJudgeMode) return null;

  return (
    <motion.span
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-trust/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-trust",
        className
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {label}
    </motion.span>
  );
}
