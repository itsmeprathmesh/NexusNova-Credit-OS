import { AppShell } from "@/components/layout/app-shell";
import { ReportingCenter } from "@/features/reporting/reporting-center";
import { PageHeader } from "@/components/ui/page-header";
import { parseRole } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Reporting Center — NexusNova" };

export default async function ReportingPage({
  searchParams
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const query = await searchParams;
  const role = parseRole(query.role);

  return (
    <AppShell active="reporting" role={role} allowedRoles={["manager"]}>
      <PageHeader
        title="Reporting Center"
        description="Pre-built enterprise reports for portfolio health, sector intelligence, risk migration, and compliance."
      />
      <ReportingCenter />
    </AppShell>
  );
}
