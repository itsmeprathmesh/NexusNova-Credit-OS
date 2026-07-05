import { AppShell } from "@/components/layout/app-shell";
import { CommandCenterView } from "@/features/command-center/command-center-view";
import type { UserRole } from "@/domain/types";

function parseRole(role?: string): UserRole {
  return role === "manager" ? "manager" : "loan-officer";
}

export default async function CommandCenterPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const query = await searchParams;
  const role = parseRole(query.role);

  return (
    <AppShell active="command-center" role={role}>
      <CommandCenterView role={role} />
    </AppShell>
  );
}
