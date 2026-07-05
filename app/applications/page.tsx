import { AppShell } from "@/components/layout/app-shell";
import { ApplicationQueue } from "@/features/loan-workspace/application-queue";
import type { UserRole } from "@/domain/types";

function parseRole(role?: string): UserRole {
  return role === "manager" ? "manager" : "loan-officer";
}

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const query = await searchParams;
  const role = parseRole(query.role);

  return (
    <AppShell active="applications" role={role}>
      <ApplicationQueue role={role} />
    </AppShell>
  );
}
