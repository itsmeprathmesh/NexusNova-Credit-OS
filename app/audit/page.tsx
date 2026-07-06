import { AppShell } from "@/components/layout/app-shell";
import { AuditCenter } from "@/features/audit/audit-center";
import { parseRole } from "@/lib/utils";

export default async function AuditPage({
  searchParams
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const query = await searchParams;
  const role = parseRole(query.role);

  return (
    <AppShell active="audit" role={role}>
      <AuditCenter />
    </AppShell>
  );
}
