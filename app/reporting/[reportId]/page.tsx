import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { BackButton } from "@/components/ui/back-button";
import { ReportDetail } from "@/features/reporting/report-detail";
import { parseRole } from "@/lib/utils";
import type { Metadata } from "next";
export async function generateMetadata({ params }: { params: Promise<{ reportId: string }> }): Promise<Metadata> {
  const { reportId } = await params;
  return { title: `${reportId.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())} — NexusNova` };
}

const validIds = ["portfolio-health", "sector-analysis", "branch-performance", "risk-migration", "credit-committee-summary", "early-warning", "limit-utilization", "ai-readiness", "executive-brief"];

export default async function ReportDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ reportId: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  const [{ reportId }, query] = await Promise.all([params, searchParams]);
  const role = parseRole(query.role);

  if (!validIds.includes(reportId)) notFound();

  return (
    <AppShell active="reporting" role={role} allowedRoles={["manager"]}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <BackButton fallbackHref={`/reporting?role=${role}`} />
          <Breadcrumbs />
        </div>
        <ReportDetail reportId={reportId} />
      </div>
    </AppShell>
  );
}
