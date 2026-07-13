import { AppShell } from "@/components/layout/app-shell";
import { CommandCenterView } from "@/features/command-center/command-center-view";
import { PageHeader } from "@/components/ui/page-header";
import { PagePurpose } from "@/components/ui/page-purpose";
import { SmartActionBar } from "@/components/ui/smart-action-bar";
import { parseRole } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Command Center — NexusNova" };

export default async function CommandCenterPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const query = await searchParams;
  const role = parseRole(query.role);

  return (
    <AppShell active="command-center" role={role}>
      <PageHeader
        title="Command Center"
        description={role === "manager" ? "Monitor portfolio risk, early warnings, and dynamic credit limit changes." : "Review MSME loan cases, inspect AI intelligence, and record decisions."}
      />
      <PagePurpose className="mb-4" />
      <SmartActionBar className="mb-6" />
      <CommandCenterView role={role} />
    </AppShell>
  );
}
