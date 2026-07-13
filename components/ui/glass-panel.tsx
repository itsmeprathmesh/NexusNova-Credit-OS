import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type GlassVariant = "default" | "strong" | "surface" | "gradient-border";

export function GlassPanel({
  children,
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLDivElement> & { variant?: GlassVariant }) {
  return (
    <div
      className={cn(
        variant === "default" && "glass rounded-2xl shadow-glass",
        variant === "strong" && "glass-strong rounded-2xl shadow-glass",
        variant === "surface" && "glass-surface rounded-2xl shadow-glass",
        variant === "gradient-border" && "glass gradient-border rounded-2xl shadow-glass",
        "transition-all duration-300 hover:-translate-y-0.5 card-glow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassCard({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white/[0.03] p-[1px] ring-1 ring-white/[0.06] shadow-glass transition-all duration-300 hover:-translate-y-0.5 card-glow",
        className
      )}
      {...props}
    >
      <div className="rounded-[calc(1.5rem-1px)] bg-panel/90 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="p-7">
          {children}
        </div>
      </div>
    </div>
  );
}
