import { CustomerShell } from "@/components/layout/customer-shell";
import { BankAiSupport } from "@/features/customer/bank-ai-support";

export default function CustomerSupportPage() {
  return (
    <CustomerShell active="support">
      <BankAiSupport />
    </CustomerShell>
  );
}