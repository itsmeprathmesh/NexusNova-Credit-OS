import { CustomerShell } from "@/components/layout/customer-shell";
import { DocumentCenter } from "@/features/customer/document-center";

export default function CustomerDocumentsPage() {
  return (
    <CustomerShell active="documents">
      <DocumentCenter />
    </CustomerShell>
  );
}