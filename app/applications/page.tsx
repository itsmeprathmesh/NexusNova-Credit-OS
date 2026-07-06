import { AppShell } from "@/components/layout/app-shell";
import { ApplicationQueue } from "@/features/loan-workspace/application-queue";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/primitives";
import { parseRole } from "@/lib/utils";

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const query = await searchParams;
  const role = parseRole(query.role);

  return (
    <AppShell active="applications" role={role}>
      <PageHeader
        title="Applications"
        description="Review and process MSME loan applications with AI-powered intelligence."
        badges={<Badge tone="info">5 active</Badge>}
      />
      <ApplicationQueue role={role} />
    </AppShell>
  );
}
