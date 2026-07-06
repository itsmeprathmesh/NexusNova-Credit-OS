import { DashboardSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <div className="space-y-6 p-6" role="status" aria-label="Loading application">
      <div className="skeleton-shimmer h-8 w-72 rounded-md" />
      <div className="skeleton-shimmer h-4 w-96 rounded-md" />
      <DashboardSkeleton />
    </div>
  );
}
