import { AppShell } from "@/components/layout/app-shell";
import { CommandCenterView } from "@/features/command-center/command-center-view";
import { PageHeader } from "@/components/ui/page-header";
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
      <CommandCenterView role={role} />
    </AppShell>
  );
}
