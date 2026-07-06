import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlassVariant = "default" | "strong" | "gradient-border";

export function GlassPanel({
  children,
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLDivElement> & { variant?: GlassVariant }) {
  return (
    <div
      className={cn(
        variant === "default" && "glass rounded-xl shadow-glass",
        variant === "strong" && "glass-strong rounded-xl shadow-glass",
        variant === "gradient-border" && "glass gradient-border rounded-xl shadow-glass",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated",
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
    <GlassPanel variant="strong" className={cn("p-6", className)} {...props}>
      {children}
    </GlassPanel>
  );
}
