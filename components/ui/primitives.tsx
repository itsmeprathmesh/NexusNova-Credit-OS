"use client";

import { type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, ClipboardCheck, TrendingUp } from "lucide-react";
import type { RiskBand } from "@/domain/types";
import { cn } from "@/lib/utils";
import { riskLabel } from "@/lib/format";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ className, variant = "primary", size = "md", ...props }, ref) {
  const sizeStyles = {
    sm: "min-h-8 px-3 text-xs rounded-lg",
    md: "min-h-10 px-4 text-sm rounded-xl",
    lg: "min-h-12 px-6 text-base rounded-xl",
  };

  const variants = {
    primary: "bg-trust text-canvas font-semibold shadow-glow hover:shadow-[0_0_30px_rgba(216,255,62,0.25)] hover:scale-[1.02] active:scale-[0.97]",
    secondary: "border border-white/10 bg-white/[0.04] text-ink hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.97]",
    ghost: "text-muted hover:text-ink hover:bg-white/[0.04] active:scale-[0.97]",
    danger: "bg-danger/20 text-danger border border-danger/20 hover:bg-danger/30 active:scale-[0.97]"
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-trust/50 focus:ring-offset-2 focus:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
        sizeStyles[size],
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
  pill?: boolean;
};

export function Badge({ className, tone = "neutral", pill, ...props }: BadgeProps) {
  const tones = {
    neutral: "border-white/[0.06] bg-white/[0.04] text-muted",
    success: "border-success/20 bg-success-light text-success",
    warning: "border-caution/20 bg-caution-light text-caution",
    danger: "border-danger/20 bg-danger-light text-danger",
    info: "border-trust/20 bg-trust-light text-trust"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 text-xs font-medium",
        pill ? "rounded-full" : "rounded-lg",
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
    low: "border-success/20 bg-success-light text-success",
    medium: "border-caution/20 bg-caution-light text-caution",
    high: "border-danger/20 bg-danger-light text-danger",
    critical: "border-danger/40 bg-danger/20 text-danger"
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
}: Omit<HTMLAttributes<HTMLElement>, "title"> & { title?: ReactNode; action?: ReactNode; hover?: boolean; glass?: boolean }) {
  const panelId = typeof title === "string" ? `panel-${title.toLowerCase().replace(/\s+/g, "-")}` : undefined;
  return (
    <section
      className={cn(
        glass ? "glass rounded-2xl shadow-glass" : "rounded-2xl border border-white/[0.06] bg-panel shadow-soft",
        "p-6 transition-all duration-300",
        hover && "cursor-pointer hover:-translate-y-1 hover:shadow-elevated card-glow",
        className
      )}
      aria-labelledby={panelId}
      role="region"
      {...props}
    >
      {(title || action) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          {title ? (typeof title === "string" ? <h2 id={panelId} className="text-base font-semibold text-ink">{title}</h2> : <h2 className="text-base font-semibold text-ink">{title}</h2>) : <div />}
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
  label: ReactNode;
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
    >
      <p className="text-xs font-medium uppercase tracking-wider text-muted/80">{label}</p>
      <p className="mt-1.5 truncate text-3xl font-bold text-ink tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
    </motion.div>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-white/[0.06]", className)} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} aria-label={`${clamped}%`}>
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-trust to-growth"
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      />
    </div>
  );
}

export function Skeleton({ className, style, ...props }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn("skeleton-shimmer rounded-xl", className)} aria-hidden="true" style={style} {...props} />;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  compact
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.06] bg-panel text-center",
        compact ? "px-6 py-10" : "px-6 py-14"
      )}
      role="status"
      aria-live="polite"
    >
      {icon && (
        <div className={cn(
          "grid place-items-center rounded-2xl bg-white/[0.04] text-muted",
          compact ? "mb-4 h-12 w-12" : "mb-5 h-14 w-14"
        )}>
          {icon}
        </div>
      )}
      <h3 className={cn("font-semibold text-ink", compact ? "text-base" : "text-lg")}>{title}</h3>
      <p className={cn("mt-2 max-w-sm text-sm leading-6 text-muted", compact && "max-w-xs")}>{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export const emptyStatePresets = {
  noAlerts: {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "No alerts to review",
    description: "All MSME applications are within normal parameters. No escalations or compliance flags at this time."
  },
  noFraud: {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "No fraud indicators detected",
    description: "All recent applications have passed fraud screening. No suspicious patterns identified across the portfolio."
  },
  noDocuments: {
    icon: <FileText className="h-6 w-6" />,
    title: "No additional documents required",
    description: "All required documents have been submitted and verified. No customer follow-up needed."
  },
  noApprovals: {
    icon: <ClipboardCheck className="h-6 w-6" />,
    title: "No pending approvals",
    description: "All applications in your queue have been reviewed. Check back when new submissions arrive."
  },
  portfolioHealthy: {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Portfolio healthy",
    description: "All active MSME accounts are performing within expected risk parameters. No interventions required."
  },
} as const;
