import { CustomerShell } from "@/components/layout/customer-shell";
import { LoanApplicationForm } from "@/features/customer/loan-application-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { BackButton } from "@/components/ui/back-button";

export default function CustomerApplyPage() {
  return (
    <CustomerShell active="apply">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <BackButton fallbackHref="/customer/dashboard" />
          <Breadcrumbs />
        </div>
        <LoanApplicationForm />
      </div>
    </CustomerShell>
  );
}