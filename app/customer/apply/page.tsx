import { CustomerShell } from "@/components/layout/customer-shell";
import { LoanApplicationForm } from "@/features/customer/loan-application-form";

export default function CustomerApplyPage() {
  return (
    <CustomerShell active="apply">
      <LoanApplicationForm />
    </CustomerShell>
  );
}