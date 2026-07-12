import { AppShell } from "@/components/layout/app-shell";
import { AuditCenter } from "@/features/audit/audit-center";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/primitives";
import { parseRole } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Audit Center — NexusNova" };

export default async function AuditPage({
  searchParams
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const query = await searchParams;
  const role = parseRole(query.role);

  return (
    <AppShell active="audit" role={role} allowedRoles={["manager"]}>
      <PageHeader
        title="Audit Center"
        description="Enterprise audit trail — every decision, override, and system event is recorded immutably."
        badges={<Badge tone="info">Live · immutable</Badge>}
      />
      <AuditCenter />
    </AppShell>
  );
}
