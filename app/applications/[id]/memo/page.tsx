import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { BackButton } from "@/components/ui/back-button";
import { PagePurpose } from "@/components/ui/page-purpose";
import { SmartActionBar } from "@/components/ui/smart-action-bar";
import { applications, documents, financialSignals, msmes } from "@/data/mock-data";
import { CreditMemo } from "@/features/loan-workspace/credit-memo";
import { parseRole } from "@/lib/utils";

export default async function ApplicationMemoPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const role = parseRole(query.role);
  const application = applications.find((item) => item.id === id);

  if (!application) {
    notFound();
  }

  const msme = msmes.find((item) => item.id === application.msmeId);
  const signals = financialSignals.find((item) => item.msmeId === application.msmeId);

  if (!msme || !signals) {
    notFound();
  }

  return (
    <AppShell active="applications" role={role}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <BackButton fallbackHref={`/applications?role=${role}`} />
          <Breadcrumbs />
        </div>
        <PagePurpose />
        <SmartActionBar />
        <CreditMemo
          application={application}
          msme={msme}
          documents={documents.filter((document) => document.applicationId === application.id)}
          signals={signals}
        />
      </div>
    </AppShell>
  );
}
