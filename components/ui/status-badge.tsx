import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type StatusTone = "neutral" | "success" | "warning" | "danger" | "info" | "purple" | "slate";

type StatusVariant = "filled" | "outlined" | "subtle" | "dot";

type Size = "sm" | "md" | "lg";

const toneStyles: Record<StatusTone, Record<StatusVariant, string>> = {
  neutral: {
    filled: "bg-white/[0.12] text-ink border-transparent",
    outlined: "border-white/[0.12] text-muted bg-transparent",
    subtle: "bg-white/[0.04] text-muted border-transparent",
    dot: "bg-muted border-transparent"
  },
  success: {
    filled: "bg-growth/20 text-growth border-transparent",
    outlined: "border-growth/20 text-growth bg-transparent",
    subtle: "bg-growth-light text-growth border-transparent",
    dot: "bg-growth border-transparent"
  },
  warning: {
    filled: "bg-caution/20 text-caution border-transparent",
    outlined: "border-caution/20 text-caution bg-transparent",
    subtle: "bg-caution-light text-caution border-transparent",
    dot: "bg-caution border-transparent"
  },
  danger: {
    filled: "bg-danger/20 text-danger border-transparent",
    outlined: "border-danger/20 text-danger bg-transparent",
    subtle: "bg-danger-light text-danger border-transparent",
    dot: "bg-danger border-transparent"
  },
  info: {
    filled: "bg-trust/20 text-trust border-transparent",
    outlined: "border-trust/20 text-trust bg-transparent",
    subtle: "bg-trust-light text-trust border-transparent",
    dot: "bg-trust border-transparent"
  },
  purple: {
    filled: "bg-purple-500/20 text-purple-400 border-transparent",
    outlined: "border-purple-500/20 text-purple-400 bg-transparent",
    subtle: "bg-purple-500/10 text-purple-400 border-transparent",
    dot: "bg-purple-400 border-transparent"
  },
  slate: {
    filled: "bg-white/[0.08] text-muted border-transparent",
    outlined: "border-white/[0.12] text-muted bg-transparent",
    subtle: "bg-white/[0.04] text-muted border-transparent",
    dot: "bg-muted border-transparent"
  }
};

const sizeStyles: Record<Size, string> = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm"
};

type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: StatusTone;
  variant?: StatusVariant;
  size?: Size;
  dot?: boolean;
};

export function StatusBadge({ className, tone = "neutral", variant = "subtle", size = "md", dot, children, ...props }: StatusBadgeProps) {
  if (variant === "dot") {
    return (
      <span className={cn("inline-flex items-center gap-2 text-xs font-medium text-muted", className)} {...props}>
        <span className={cn("inline-block h-2 w-2 rounded-full", toneStyles[tone].dot)} />
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border font-medium leading-none",
        toneStyles[tone][variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("mr-1.5 inline-block h-1.5 w-1.5 rounded-full", toneStyles[tone].dot)} />}
      {children}
    </span>
  );
}

export const applicationStatusMap: Record<string, { label: string; tone: StatusTone }> = {
  new: { label: "New", tone: "info" },
  "in-review": { label: "In Review", tone: "warning" },
  "documents-needed": { label: "Docs Needed", tone: "purple" },
  escalated: { label: "Escalated", tone: "danger" },
  approved: { label: "Approved", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" }
};
