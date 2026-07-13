import { CustomerShell } from "@/components/layout/customer-shell";
import { DocumentUploadCenter } from "@/features/customer/document-upload-center";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { BackButton } from "@/components/ui/back-button";

export default function CustomerDocumentsPage() {
  return (
    <CustomerShell active="documents">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <BackButton fallbackHref="/customer/dashboard" />
          <Breadcrumbs />
        </div>
        <DocumentUploadCenter />
      </div>
    </CustomerShell>
  );
}