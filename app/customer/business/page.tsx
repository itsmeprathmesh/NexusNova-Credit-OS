import { CustomerShell } from "@/components/layout/customer-shell";
import { BusinessRegistration } from "@/features/customer/business-registration";

export default function CustomerBusinessPage() {
  return (
    <CustomerShell active="business">
      <BusinessRegistration />
    </CustomerShell>
  );
}