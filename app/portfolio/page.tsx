import { AppShell } from "@/components/layout/app-shell";
import { PortfolioDashboard } from "@/features/portfolio/portfolio-dashboard";
import { PageHeader } from "@/components/ui/page-header";
import { parseRole } from "@/lib/utils";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Portfolio Intelligence — NexusNova" };

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const query = await searchParams;
  const role = parseRole(query.role);

  return (
    <AppShell active="portfolio" role={role} allowedRoles={["manager"]}>
      <PageHeader
        title="Portfolio Intelligence"
        description="AI-powered MSME portfolio monitoring, sector intelligence, and early warning detection."
      />
      <PortfolioDashboard role={role} />
    </AppShell>
  );
}
