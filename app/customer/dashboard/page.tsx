import { CustomerShell } from "@/components/layout/customer-shell";
import { CustomerDashboard } from "@/features/customer/customer-dashboard";

export default function CustomerDashboardPage() {
  return (
    <CustomerShell active="dashboard">
      <CustomerDashboard />
    </CustomerShell>
  );
}
