import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type StatusTone = "neutral" | "success" | "warning" | "danger" | "info" | "purple" | "slate";

type StatusVariant = "filled" | "outlined" | "subtle" | "dot";

type Size = "sm" | "md" | "lg";

const toneStyles: Record<StatusTone, Record<StatusVariant, string>> = {
  neutral: {
    filled: "bg-slate-700 text-white border-transparent",
    outlined: "border-slate-300 text-slate-700 bg-transparent",
    subtle: "bg-slate-100 text-slate-700 border-transparent",
    dot: "bg-slate-400 border-transparent"
  },
  success: {
    filled: "bg-emerald-600 text-white border-transparent",
    outlined: "border-emerald-300 text-emerald-700 bg-transparent",
    subtle: "bg-emerald-50 text-emerald-700 border-transparent",
    dot: "bg-emerald-500 border-transparent"
  },
  warning: {
    filled: "bg-amber-500 text-white border-transparent",
    outlined: "border-amber-300 text-amber-800 bg-transparent",
    subtle: "bg-amber-50 text-amber-800 border-transparent",
    dot: "bg-amber-400 border-transparent"
  },
  danger: {
    filled: "bg-red-600 text-white border-transparent",
    outlined: "border-red-300 text-red-700 bg-transparent",
    subtle: "bg-red-50 text-red-700 border-transparent",
    dot: "bg-red-500 border-transparent"
  },
  info: {
    filled: "bg-sky-600 text-white border-transparent",
    outlined: "border-sky-300 text-sky-700 bg-transparent",
    subtle: "bg-sky-50 text-sky-700 border-transparent",
    dot: "bg-sky-500 border-transparent"
  },
  purple: {
    filled: "bg-purple-600 text-white border-transparent",
    outlined: "border-purple-300 text-purple-700 bg-transparent",
    subtle: "bg-purple-50 text-purple-700 border-transparent",
    dot: "bg-purple-500 border-transparent"
  },
  slate: {
    filled: "bg-slate-200 text-slate-800 border-transparent",
    outlined: "border-slate-200 text-slate-600 bg-transparent",
    subtle: "bg-slate-50 text-slate-600 border-transparent",
    dot: "bg-slate-300 border-transparent"
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
        "inline-flex items-center rounded-md border font-medium leading-none",
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
