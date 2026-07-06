import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { applications } from "@/data/mock-data";
import { DecisionTimeline } from "@/features/loan-workspace/decision-timeline";
import { parseRole } from "@/lib/utils";

export default async function TimelinePage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const role = parseRole(query.role);
  const application = applications.find((item) => item.id === id);

  if (!application) notFound();

  return (
    <AppShell active="applications" role={role}>
      <DecisionTimeline applicationId={application.id} status={application.status} />
    </AppShell>
  );
}
