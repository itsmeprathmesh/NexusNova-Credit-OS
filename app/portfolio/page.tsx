import { AppShell } from "@/components/layout/app-shell";
import type { UserRole } from "@/domain/types";
import { PortfolioDashboard } from "@/features/portfolio/portfolio-dashboard";

function parseRole(role?: string): UserRole {
  return role === "manager" ? "manager" : "loan-officer";
}

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const query = await searchParams;
  const role = parseRole(query.role);

  return (
    <AppShell active="portfolio" role={role}>
      <PortfolioDashboard role={role} />
    </AppShell>
  );
}
