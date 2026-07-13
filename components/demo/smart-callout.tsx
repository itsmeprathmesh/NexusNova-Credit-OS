"use client";

import { Lightbulb, type LucideIcon } from "lucide-react";
import { useDemoMode } from "@/contexts/demo-mode";
import { cn } from "@/lib/utils";

interface SmartCalloutProps {
  id: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
  variant?: "info" | "insight" | "impact";
}

export function SmartCallout({ id, title, description, icon: Icon = Lightbulb, className, variant = "info" }: SmartCalloutProps) {
  const { isDemoMode } = useDemoMode();

  if (!isDemoMode) return null;

  const variants = {
    info: "border-trust/20 bg-trust-light/10",
    insight: "border-growth/20 bg-growth/5",
    impact: "border-caution/20 bg-caution-light/10",
  };

  const iconVariants = {
    info: "text-trust",
    insight: "text-growth",
    impact: "text-caution",
  };

  return (
    <div
      className={cn("rounded-xl border p-4 backdrop-blur-sm", variants[variant], className)}
      role="complementary"
      aria-label={title}
      data-smart-callout={id}
    >
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.06]", iconVariants[variant])}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-ink">{title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{description}</p>
        </div>
      </div>
    </div>
  );
}
