import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { msmes, portfolio } from "@/data/mock-data";
import type { UserRole } from "@/domain/types";
import { MsmeDrilldown } from "@/features/portfolio/msme-drilldown";

function parseRole(role?: string): UserRole {
  return role === "manager" ? "manager" : "loan-officer";
}

export default async function PortfolioDrilldownPage({
  params,
  searchParams
}: {
  params: Promise<{ msmeId: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  const [{ msmeId }, query] = await Promise.all([params, searchParams]);
  const role = parseRole(query.role);
  const msme = msmes.find((item) => item.id === msmeId);
  const portfolioItem = portfolio.find((item) => item.msmeId === msmeId);

  if (!msme || !portfolioItem) {
    notFound();
  }

  return (
    <AppShell active="portfolio" role={role}>
      <MsmeDrilldown msme={msme} portfolioItem={portfolioItem} role={role} />
    </AppShell>
  );
}
