import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { applications, documents, financialSignals, msmes } from "@/data/mock-data";
import type { UserRole } from "@/domain/types";
import { CreditMemo } from "@/features/loan-workspace/credit-memo";

function parseRole(role?: string): UserRole {
  return role === "manager" ? "manager" : "loan-officer";
}

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
      <CreditMemo
        application={application}
        msme={msme}
        documents={documents.filter((document) => document.applicationId === application.id)}
        signals={signals}
      />
    </AppShell>
  );
}
