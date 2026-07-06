import { AppShell } from "@/components/layout/app-shell";
import { ApplicationQueue } from "@/features/loan-workspace/application-queue";
import { parseRole } from "@/lib/utils";

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const query = await searchParams;
  const role = parseRole(query.role);

  return (
    <AppShell active="applications" role={role}>
      <ApplicationQueue role={role} />
    </AppShell>
  );
}
