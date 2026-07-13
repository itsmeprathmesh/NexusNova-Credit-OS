import { CustomerShell } from "@/components/layout/customer-shell";
import { BankAiSupport } from "@/features/customer/bank-ai-support";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { BackButton } from "@/components/ui/back-button";

export default function CustomerSupportPage() {
  return (
    <CustomerShell active="support">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <BackButton fallbackHref="/customer/dashboard" />
          <Breadcrumbs />
        </div>
        <BankAiSupport />
      </div>
    </CustomerShell>
  );
}