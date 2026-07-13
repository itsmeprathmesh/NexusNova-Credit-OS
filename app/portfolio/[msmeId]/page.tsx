import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { BackButton } from "@/components/ui/back-button";
import { PagePurpose } from "@/components/ui/page-purpose";
import { SmartActionBar } from "@/components/ui/smart-action-bar";
import { applications, financialSignals, getCustomer360, msmes, portfolio } from "@/data/mock-data";
import { MsmeDrilldown } from "@/features/portfolio/msme-drilldown";
import { parseRole } from "@/lib/utils";
import type { Metadata } from "next";
export async function generateMetadata({ params }: { params: Promise<{ msmeId: string }> }): Promise<Metadata> {
  const { msmeId } = await params;
  return { title: `${msmeId} — Customer 360 — NexusNova` };
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

  const snapshot = getCustomer360(msmeId);
  const signals = financialSignals.find((item) => item.msmeId === msmeId);
  const application = applications.find((item) => item.msmeId === msmeId);

  return (
    <AppShell active="portfolio" role={role} allowedRoles={["loan-officer", "manager"]}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <BackButton fallbackHref={`/portfolio?role=${role}`} />
          <Breadcrumbs />
        </div>
        <PagePurpose />
        <SmartActionBar />
        <MsmeDrilldown msme={msme} portfolioItem={portfolioItem} role={role} snapshot={snapshot} signals={signals} application={application} />
      </div>
    </AppShell>
  );
}
