import { AppShell } from "@/components/layout/app-shell";
import { ReportingCenter } from "@/features/reporting/reporting-center";
import { parseRole } from "@/lib/utils";

export default async function ReportingPage({
  searchParams
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const query = await searchParams;
  const role = parseRole(query.role);

  return (
    <AppShell active="reporting" role={role}>
      <ReportingCenter />
    </AppShell>
  );
}
