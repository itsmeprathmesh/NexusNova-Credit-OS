import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { applications, documents, financialSignals, msmes } from "@/data/mock-data";
import { ProductionCreditMemo } from "@/features/loan-workspace/production-memo";
import { parseRole } from "@/lib/utils";

export default async function ProductionMemoPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const role = parseRole(query.role);
  const application = applications.find((item) => item.id === id);

  if (!application) notFound();

  const msme = msmes.find((item) => item.id === application.msmeId);
  const signals = financialSignals.find((item) => item.msmeId === application.msmeId);

  if (!msme || !signals) notFound();

  return (
    <AppShell active="applications" role={role}>
      <ProductionCreditMemo
        application={application}
        msme={msme}
        documents={documents.filter((document) => document.applicationId === application.id)}
        signals={signals}
      />
    </AppShell>
  );
}
