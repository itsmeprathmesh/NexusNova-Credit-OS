import { lazy } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { BackButton } from "@/components/ui/back-button";
import { PagePurpose } from "@/components/ui/page-purpose";
import { SmartActionBar } from "@/components/ui/smart-action-bar";
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <BackButton fallbackHref={`/reporting?role=${role}`} />
          <Breadcrumbs />
        </div>
        <PagePurpose />
        <SmartActionBar />
        <ExecutiveDashboard />
      </div>
    </AppShell>
  );
}
