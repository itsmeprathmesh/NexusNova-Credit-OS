import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { RiskBand } from "@/domain/types";
import { cn } from "@/lib/utils";
import { riskLabel } from "@/lib/format";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-trust text-white hover:bg-[#1a526a]",
    secondary: "border border-line bg-white text-ink hover:bg-slate-50",
    ghost: "text-ink hover:bg-slate-100",
    danger: "bg-danger text-white hover:bg-[#941b13]"
  };

  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-trust focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

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
  ...props
}: HTMLAttributes<HTMLElement> & { title?: string; action?: ReactNode }) {
  return (
    <section className={cn("rounded-lg border border-line bg-panel p-5 shadow-sm", className)} {...props}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          {title ? <h2 className="text-base font-semibold text-ink">{title}</h2> : <div />}
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
  className
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 truncate text-2xl font-semibold text-ink">{value}</p>
      {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
    </div>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-slate-100", className)} aria-label={`${clamped}%`}>
      <div className="h-full rounded-full bg-trust transition-all" style={{ width: `${clamped}%` }} />
    </div>
  );
}
