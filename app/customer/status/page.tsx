import { CustomerShell } from "@/components/layout/customer-shell";
import { ApplicationStatus } from "@/features/customer/application-status";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { BackButton } from "@/components/ui/back-button";

export default function CustomerStatusPage() {
  return (
    <CustomerShell active="status">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <BackButton fallbackHref="/customer/dashboard" />
          <Breadcrumbs />
        </div>
        <ApplicationStatus />
      </div>
    </CustomerShell>
  );
}