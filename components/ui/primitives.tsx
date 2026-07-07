"use client";

import { type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { motion } from "framer-motion";
import type { RiskBand } from "@/domain/types";
import { cn } from "@/lib/utils";
import { riskLabel } from "@/lib/format";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ className, variant = "primary", ...props }, ref) {
  const variants = {
    primary: "bg-trust text-white hover:bg-[#1a526a] active:scale-[0.97]",
    secondary: "border border-line bg-white text-ink hover:bg-slate-50 hover:shadow-sm active:scale-[0.97]",
    ghost: "text-ink hover:bg-slate-100 active:scale-[0.97]",
    danger: "bg-danger text-white hover:bg-[#941b13] active:scale-[0.97]"
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-trust focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  const tones = {
    neutral: "border-slate-200 bg-slate-50 text-slate-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    danger: "border-red-200 bg-red-50 text-red-700",
    info: "border-sky-200 bg-sky-50 text-sky-800"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
      role="status"
      {...props}
    />
  );
}

export function RiskBadge({ band, className }: { band: RiskBand; className?: string }) {
  const tones: Record<RiskBand, string> = {
    low: "border-emerald-200 bg-emerald-50 text-emerald-700",
    medium: "border-amber-200 bg-amber-50 text-amber-800",
    high: "border-orange-200 bg-orange-50 text-orange-800",
    critical: "border-red-200 bg-red-50 text-red-700"
  };

  return <Badge className={cn(tones[band], className)}>{riskLabel(band)}</Badge>;
}

export function Panel({
  children,
  className,
  title,
  action,
  hover,
  glass,
  ...props
}: HTMLAttributes<HTMLElement> & { title?: string; action?: ReactNode; hover?: boolean; glass?: boolean }) {
  const panelId = title ? `panel-${title.toLowerCase().replace(/\s+/g, "-")}` : undefined;
  return (
    <section
      className={cn(
        glass ? "glass rounded-xl shadow-glass" : "rounded-lg border border-line bg-panel shadow-panel",
        "p-5 transition-all duration-200",
        hover && !glass && "cursor-pointer hover:-translate-y-0.5 hover:shadow-elevated",
        hover && glass && "cursor-pointer hover:-translate-y-0.5 hover:shadow-elevated",
        className
      )}
      aria-labelledby={panelId}
      role="region"
      {...props}
    >
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          {title ? <h2 id={panelId} className="text-base font-semibold text-ink">{title}</h2> : <div />}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Metric({
  label,
  value,
  hint,
  animate,
  className
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  animate?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={cn("min-w-0", className)}
      initial={animate ? { opacity: 0, y: 12 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      role="group"
      aria-label={label}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 truncate text-2xl font-semibold text-ink">{value}</p>
      {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
    </motion.div>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-slate-100", className)} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} aria-label={`${clamped}%`}>
      <div className="h-full rounded-full bg-trust transition-all duration-500 ease-out" style={{ width: `${clamped}%` }} />
    </div>
  );
}

export function Skeleton({ className, style, ...props }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn("skeleton-shimmer rounded-md", className)} aria-hidden="true" style={style} {...props} />;
}

export function EmptyState({
  icon,
  title,
  description,
  action
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-panel px-6 py-12 text-center" role="status" aria-live="polite">
      {icon && <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-muted">{icon}</div>}
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
