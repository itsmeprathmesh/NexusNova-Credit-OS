import {
  DashboardSkeleton,
  CardSkeleton,
  TableSkeleton,
  MetricSkeleton,
  FinancialHealthCardSkeleton,
  TimelineSkeleton,
  PortfolioSkeleton,
  ChartSkeleton,
} from "@/components/ui/skeletons";

export function PageLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Page loading">
      <div className="skeleton-shimmer h-7 w-56 rounded-lg" />
      <div className="skeleton-shimmer h-4 w-80 rounded-md" />
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
    <div className="space-y-6" role="status" aria-label="Loading analytics">
      <div className="skeleton-shimmer h-7 w-44 rounded-lg" />
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
    <div className="space-y-6" role="status" aria-label="Loading customer page">
      <div className="skeleton-shimmer h-7 w-48 rounded-lg" />
      <div className="skeleton-shimmer h-4 w-72 rounded-md" />
      <div className="mt-6">
        <FinancialHealthCardSkeleton />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

export function ApplicationLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading application">
      <div className="skeleton-shimmer h-7 w-56 rounded-lg" />
      <div className="skeleton-shimmer h-4 w-80 rounded-md" />
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <CardSkeleton />
      </div>
    </div>
  );
}

export function PortfolioLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading portfolio">
      <div className="skeleton-shimmer h-7 w-48 rounded-lg" />
      <div className="skeleton-shimmer h-4 w-64 rounded-md" />
      <PortfolioSkeleton />
    </div>
  );
}

export function ReportLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading report">
      <div className="skeleton-shimmer h-7 w-52 rounded-lg" />
      <div className="skeleton-shimmer h-4 w-72 rounded-md" />
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <TableSkeleton rows={8} cols={6} />
    </div>
  );
}
