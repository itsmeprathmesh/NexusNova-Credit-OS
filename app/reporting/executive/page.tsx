import { lazy } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { parseRole } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Executive Dashboard — NexusNova" };

const ExecutiveDashboard = lazy(() => import("@/features/reporting/executive-dashboard").then((m) => ({ default: m.ExecutiveDashboard })));

export default async function ExecutiveDashboardPage({
  searchParams
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const query = await searchParams;
  const role = parseRole(query.role);

  return (
    <AppShell active="reporting" role={role} allowedRoles={["manager"]}>
      <ExecutiveDashboard />
    </AppShell>
  );
}
