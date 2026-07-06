import { AppShell } from "@/components/layout/app-shell";
import { ExecutiveDashboard } from "@/features/reporting/executive-dashboard";
import { parseRole } from "@/lib/utils";

export default async function ExecutiveDashboardPage({
  searchParams
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const query = await searchParams;
  const role = parseRole(query.role);

  return (
    <AppShell active="reporting" role={role}>
      <ExecutiveDashboard />
    </AppShell>
  );
}
