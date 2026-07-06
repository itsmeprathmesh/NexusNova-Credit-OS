import { DashboardSkeleton, CardSkeleton, TableSkeleton, MetricSkeleton } from "@/components/ui/skeletons";

export function PageLoading() {
  return (
    <div className="space-y-6 p-6" role="status" aria-label="Page loading">
      <div className="skeleton-shimmer h-8 w-64 rounded-md" />
      <div className="skeleton-shimmer h-4 w-96 rounded-md" />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
      </div>
      <DashboardSkeleton />
    </div>
  );
}

export function AnalyticsLoading() {
  return (
    <div className="space-y-6 p-6" role="status" aria-label="Loading analytics">
      <div className="skeleton-shimmer h-8 w-48 rounded-md" />
      <div className="grid gap-4 md:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <TableSkeleton rows={5} />
    </div>
  );
}

export function CustomerLoading() {
  return (
    <div className="space-y-6 p-6" role="status" aria-label="Loading customer page">
      <div className="skeleton-shimmer h-8 w-56 rounded-md" />
      <div className="skeleton-shimmer h-4 w-80 rounded-md" />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
