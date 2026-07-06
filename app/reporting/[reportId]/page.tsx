import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ReportDetail } from "@/features/reporting/report-detail";
import { parseRole } from "@/lib/utils";

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
    <AppShell active="reporting" role={role}>
      <div className="space-y-6">
        <Link href="/reporting" className="inline-flex items-center gap-2 text-sm font-semibold text-trust">
          <ArrowLeft className="h-4 w-4" />
          Back to Reporting Center
        </Link>
        <ReportDetail reportId={reportId} />
      </div>
    </AppShell>
  );
}
