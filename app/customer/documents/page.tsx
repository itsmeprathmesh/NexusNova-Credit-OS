import { CustomerShell } from "@/components/layout/customer-shell";
import { DocumentUploadCenter } from "@/features/customer/document-upload-center";

export default function CustomerDocumentsPage() {
  return (
    <CustomerShell active="documents">
      <DocumentUploadCenter />
    </CustomerShell>
  );
}