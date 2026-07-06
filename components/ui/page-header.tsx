import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "./breadcrumbs";

export function PageHeader({
  title,
  description,
  actions,
  badges,
  className
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  badges?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 space-y-3", className)}>
      <Breadcrumbs />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-ink">{title}</h1>
            {badges && <div className="flex flex-wrap items-center gap-2">{badges}</div>}
          </div>
          {description && <p className="mt-1.5 text-sm text-muted">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
