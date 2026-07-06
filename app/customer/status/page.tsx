import { CustomerShell } from "@/components/layout/customer-shell";
import { ApplicationStatus } from "@/features/customer/application-status";

export default function CustomerStatusPage() {
  return (
    <CustomerShell active="status">
      <ApplicationStatus />
    </CustomerShell>
  );
}