import { cn } from "@/lib/utils";
import { Skeleton } from "./primitives";

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-panel p-6 shadow-soft" aria-hidden="true">
      <Skeleton className="mb-3 h-4 w-1/3" />
      <Skeleton className="mb-2 h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <div className="min-w-0" aria-hidden="true">
      <Skeleton className="mb-2 h-3 w-16 rounded-md" />
      <Skeleton className="mb-1 h-8 w-24 rounded-lg" />
      <Skeleton className="h-3 w-20 rounded-md" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-panel shadow-soft" aria-hidden="true">
      <div className="flex gap-4 border-b border-white/[0.06] px-5 py-3.5">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1 rounded-md" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 border-b border-white/[0.04] px-5 py-4 last:border-b-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className={cn("h-4 rounded-md", c === 0 ? "w-1/4" : "flex-1")} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-panel p-6 shadow-soft" aria-hidden="true">
      <Skeleton className="mb-6 h-4 w-32 rounded-md" />
      <div className="flex items-end gap-3 h-48">
        {[55, 80, 45, 90, 65, 35, 75, 50].map((h, i) => (
          <Skeleton key={i} className="flex-1 rounded-md" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading dashboard" role="status">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <TableSkeleton />
    </div>
  );
}

export function FinancialHealthCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-panel p-7 shadow-soft" aria-label="Loading financial health card" role="status">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div>
          <Skeleton className="mb-1 h-4 w-40 rounded-md" />
          <Skeleton className="h-3 w-24 rounded-md" />
        </div>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="mb-2 h-3 w-20 rounded-md" />
            <Skeleton className="mb-1 h-10 w-16 rounded-lg" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-3">
        <Skeleton className="h-4 w-32 rounded-md" />
        <div className="flex gap-4">
          <Skeleton className="h-3 w-28 rounded-md" />
          <Skeleton className="h-3 w-32 rounded-md" />
          <Skeleton className="h-3 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-panel p-6 shadow-soft" aria-label="Loading timeline" role="status">
      <Skeleton className="mb-6 h-5 w-36 rounded-md" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-xl shrink-0" />
            <div className="flex-1 min-w-0">
              <Skeleton className="mb-1 h-4 w-40 rounded-md" />
              <Skeleton className="h-3 w-56 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ApplicationWorkspaceSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading application workspace" role="status">
      <div className="rounded-2xl border border-white/[0.06] bg-panel p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Skeleton className="mb-2 h-6 w-48 rounded-md" />
            <Skeleton className="h-4 w-72 rounded-md" />
            <Skeleton className="mt-1 h-4 w-56 rounded-md" />
          </div>
          <div className="flex gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="mb-1 h-3 w-16 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartSkeleton />
        <div className="rounded-2xl border border-white/[0.06] bg-panel p-6 shadow-soft">
          <Skeleton className="mb-4 h-5 w-32 rounded-md" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="mb-1 h-3 w-24 rounded-md" />
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PortfolioSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading portfolio" role="status">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </div>
      <TableSkeleton rows={6} cols={5} />
    </div>
  );
}
