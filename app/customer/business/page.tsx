import { CustomerShell } from "@/components/layout/customer-shell";
import { BusinessRegistration } from "@/features/customer/business-registration";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { BackButton } from "@/components/ui/back-button";

export default function CustomerBusinessPage() {
  return (
    <CustomerShell active="business">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <BackButton fallbackHref="/customer/dashboard" />
          <Breadcrumbs />
        </div>
        <BusinessRegistration />
      </div>
    </CustomerShell>
  );
}