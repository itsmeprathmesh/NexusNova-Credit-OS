export type CustomerDocType =
  | "GST Returns"
  | "UPI Statement"
  | "Account Aggregator Consent"
  | "Bank Statement"
  | "EPFO Records"
  | "Utility Bills"
  | "Business Registration"
  | "PAN"
  | "Aadhaar"
  | "ITR (Optional)";

export type DocStatus = "missing" | "uploaded" | "ai-verified" | "needs-review" | "rejected";

export interface DocAiVerification {
  ocrConfidence: number;
  forgeryDetected: boolean;
  missingPages: number;
  blurDetected: boolean;
  metadataValid: boolean;
  recommendations: string[];
}

export interface CustomerDocument {
  id: string;
  type: CustomerDocType;
  status: DocStatus;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  lastUpdated: string;
  verification: DocAiVerification;
  description: string;
  required: boolean;
}

export interface UploadTimelineEvent {
  id: string;
  documentType: CustomerDocType;
  action: "uploaded" | "replaced" | "verified" | "rejected" | "review-requested";
  timestamp: string;
  detail: string;
}

const now = new Date();
const h = (hoursAgo: number) => new Date(now.getTime() - hoursAgo * 3600000).toISOString();

export const demoDocuments: CustomerDocument[] = [
  {
    id: "doc-gst",
    type: "GST Returns",
    status: "ai-verified",
    fileName: "gst-returns-fy25-26.pdf",
    fileSize: "2.4 MB",
    uploadedAt: h(72),
    lastUpdated: h(2),
    verification: {
      ocrConfidence: 97,
      forgeryDetected: false,
      missingPages: 0,
      blurDetected: false,
      metadataValid: true,
      recommendations: ["All pages清晰, no issues detected"],
    },
    description: "Monthly GST returns for the last 12 months showing filing consistency and turnover trends.",
    required: true,
  },
  {
    id: "doc-upi",
    type: "UPI Statement",
    status: "ai-verified",
    fileName: "upi-statement-q2-2026.pdf",
    fileSize: "1.8 MB",
    uploadedAt: h(60),
    lastUpdated: h(4),
    verification: {
      ocrConfidence: 94,
      forgeryDetected: false,
      missingPages: 0,
      blurDetected: false,
      metadataValid: true,
      recommendations: ["Digital payment patterns confirmed — high transaction consistency."],
    },
    description: "UPI transaction history showing real-time payment collections and digital payment behaviour.",
    required: true,
  },
  {
    id: "doc-aa",
    type: "Account Aggregator Consent",
    status: "uploaded",
    fileName: "aa-consent-letter-signed.pdf",
    fileSize: "0.4 MB",
    uploadedAt: h(48),
    lastUpdated: h(48),
    verification: {
      ocrConfidence: 72,
      forgeryDetected: false,
      missingPages: 0,
      blurDetected: true,
      metadataValid: false,
      recommendations: ["Blur detected on signature page — consider re-uploading.", "Metadata validation failed — file may have been compressed."],
    },
    description: "Signed consent letter for Account Aggregator-based bank statement fetching.",
    required: true,
  },
  {
    id: "doc-bank",
    type: "Bank Statement",
    status: "needs-review",
    fileName: "bank-statement-apr-jun-2026.pdf",
    fileSize: "3.2 MB",
    uploadedAt: h(36),
    lastUpdated: h(8),
    verification: {
      ocrConfidence: 68,
      forgeryDetected: false,
      missingPages: 1,
      blurDetected: true,
      metadataValid: false,
      recommendations: ["Page 4 of 6 appears missing — only 5 pages processed.", "Blur detected on transaction details on page 2.", "Metadata validation failed — expected 12-month statement but file header indicates 9 months."],
    },
    description: "Bank statement for the last 6 months showing cash flow patterns and average balance.",
    required: true,
  },
  {
    id: "doc-epfo",
    type: "EPFO Records",
    status: "ai-verified",
    fileName: "epfo-member-passbook-2025-26.pdf",
    fileSize: "1.1 MB",
    uploadedAt: h(54),
    lastUpdated: h(6),
    verification: {
      ocrConfidence: 96,
      forgeryDetected: false,
      missingPages: 0,
      blurDetected: false,
      metadataValid: true,
      recommendations: ["Employee count validated against EPFO returns — 28 employees consistent across 12 months."],
    },
    description: "EPFO member passbook and monthly challan for payroll and employment validation.",
    required: true,
  },
  {
    id: "doc-utility",
    type: "Utility Bills",
    status: "uploaded",
    fileName: "utility-bills-mar-jun-2026.pdf",
    fileSize: "1.6 MB",
    uploadedAt: h(30),
    lastUpdated: h(30),
    verification: {
      ocrConfidence: 85,
      forgeryDetected: false,
      missingPages: 0,
      blurDetected: false,
      metadataValid: true,
      recommendations: ["All utility payments consistent with declared business operations."],
    },
    description: "Electricity and water utility bills confirming operational status and payment regularity.",
    required: true,
  },
  {
    id: "doc-registration",
    type: "Business Registration",
    status: "ai-verified",
    fileName: "udyam-certificate-registration.pdf",
    fileSize: "0.6 MB",
    uploadedAt: h(96),
    lastUpdated: h(1),
    verification: {
      ocrConfidence: 99,
      forgeryDetected: false,
      missingPages: 0,
      blurDetected: false,
      metadataValid: true,
      recommendations: ["Udyam registration validated against UDYAM portal — business exists and is active."],
    },
    description: "Udyam registration certificate and business incorporation documents.",
    required: true,
  },
  {
    id: "doc-pan",
    type: "PAN",
    status: "ai-verified",
    fileName: "pan-card-rohit-kulkarni.pdf",
    fileSize: "0.3 MB",
    uploadedAt: h(96),
    lastUpdated: h(1),
    verification: {
      ocrConfidence: 98,
      forgeryDetected: false,
      missingPages: 0,
      blurDetected: false,
      metadataValid: true,
      recommendations: ["PAN validated against NSDL database — status: active, name matches business owner."],
    },
    description: "Permanent Account Number card for business owner identity verification.",
    required: true,
  },
  {
    id: "doc-aadhaar",
    type: "Aadhaar",
    status: "rejected",
    fileName: "aadhaar-consent-form-demo.pdf",
    fileSize: "0.5 MB",
    uploadedAt: h(24),
    lastUpdated: h(2),
    verification: {
      ocrConfidence: 45,
      forgeryDetected: true,
      missingPages: 0,
      blurDetected: true,
      metadataValid: false,
      recommendations: ["Forgery indicators detected — document appears to be a screenshot, not original.", "Demographic data mismatch with declared business details.", "Blur detected — document may be a photocopy.", "Please upload a clear original document for verification."],
    },
    description: "Aadhaar-based identity verification (demo document for demonstration purposes).",
    required: true,
  },
  {
    id: "doc-itr",
    type: "ITR (Optional)",
    status: "missing",
    fileName: "",
    fileSize: "",
    uploadedAt: "",
    lastUpdated: "",
    verification: {
      ocrConfidence: 0,
      forgeryDetected: false,
      missingPages: 0,
      blurDetected: false,
      metadataValid: false,
      recommendations: ["Not required — alternate data sufficient for assessment.", "Uploading ITR may improve loan terms and increase recommended limit."],
    },
    description: "Income Tax Returns (optional) — our AI can assess your creditworthiness using alternate data alone.",
    required: false,
  },
];

export const uploadTimeline: UploadTimelineEvent[] = [
  { id: "evt-1", documentType: "Business Registration", action: "uploaded", timestamp: h(96), detail: "Initial upload of Udyam certificate" },
  { id: "evt-2", documentType: "PAN", action: "uploaded", timestamp: h(96), detail: "PAN card uploaded for KYC verification" },
  { id: "evt-3", documentType: "Business Registration", action: "verified", timestamp: h(92), detail: "AI verified — UDYAM portal validation passed" },
  { id: "evt-4", documentType: "PAN", action: "verified", timestamp: h(90), detail: "AI verified — NSDL validation passed" },
  { id: "evt-5", documentType: "GST Returns", action: "uploaded", timestamp: h(72), detail: "GST returns for FY 2025-26 uploaded" },
  { id: "evt-6", documentType: "UPI Statement", action: "uploaded", timestamp: h(60), detail: "UPI statement for Q2 2026 uploaded" },
  { id: "evt-7", documentType: "EPFO Records", action: "uploaded", timestamp: h(54), detail: "EPFO member passbook uploaded" },
  { id: "evt-8", documentType: "Account Aggregator Consent", action: "uploaded", timestamp: h(48), detail: "Signed AA consent letter uploaded" },
  { id: "evt-9", documentType: "GST Returns", action: "verified", timestamp: h(46), detail: "AI verified — GST filing consistency confirmed" },
  { id: "evt-10", documentType: "UPI Statement", action: "verified", timestamp: h(44), detail: "AI verified — payment patterns consistent with declared revenue" },
  { id: "evt-11", documentType: "EPFO Records", action: "verified", timestamp: h(42), detail: "AI verified — employee count matches returns" },
  { id: "evt-12", documentType: "Bank Statement", action: "uploaded", timestamp: h(36), detail: "Bank statement for Apr-Jun 2026 uploaded" },
  { id: "evt-13", documentType: "Utility Bills", action: "uploaded", timestamp: h(30), detail: "Utility bills for Mar-Jun 2026 uploaded" },
  { id: "evt-14", documentType: "Aadhaar", action: "uploaded", timestamp: h(24), detail: "Aadhaar consent form uploaded for demographic verification" },
  { id: "evt-15", documentType: "Aadhaar", action: "rejected", timestamp: h(20), detail: "AI rejected — forgery indicators detected. Re-upload requested." },
  { id: "evt-16", documentType: "Bank Statement", action: "review-requested", timestamp: h(16), detail: "AI flagged — missing page 4, blur detected on transaction details" },
];

export function formatDocStatus(status: DocStatus): string {
  switch (status) {
    case "missing": return "Missing";
    case "uploaded": return "Uploaded";
    case "ai-verified": return "AI Verified";
    case "needs-review": return "Needs Review";
    case "rejected": return "Rejected";
  }
}

export function getStatusBadgeTone(status: DocStatus): "neutral" | "success" | "warning" | "danger" | "info" {
  switch (status) {
    case "missing": return "neutral";
    case "uploaded": return "info";
    case "ai-verified": return "success";
    case "needs-review": return "warning";
    case "rejected": return "danger";
  }
}

export function simulateUpload(type: CustomerDocType): CustomerDocument | null {
  const existing = demoDocuments.find((d) => d.type === type);
  if (!existing) return null;
  existing.status = "uploaded";
  existing.lastUpdated = new Date().toISOString();
  existing.fileName = `${type.toLowerCase().replace(/\s+/g, "-")}-uploaded.pdf`;
  existing.fileSize = `${(1 + Math.random() * 3).toFixed(1)} MB`;
  existing.uploadedAt = new Date().toISOString();
  existing.verification = {
    ocrConfidence: 55 + Math.floor(Math.random() * 30),
    forgeryDetected: false,
    missingPages: 0,
    blurDetected: false,
    metadataValid: false,
    recommendations: ["Upload received — AI verification in progress. Status will update automatically."],
  };
  uploadTimeline.unshift({
    id: `evt-${Date.now()}`,
    documentType: type,
    action: "uploaded",
    timestamp: new Date().toISOString(),
    detail: `${type} uploaded for AI verification`,
  });
  return existing;
}

export function simulateReplace(type: CustomerDocType): CustomerDocument | null {
  const existing = demoDocuments.find((d) => d.type === type);
  if (!existing) return null;
  existing.status = "uploaded";
  existing.lastUpdated = new Date().toISOString();
  existing.fileName = `${type.toLowerCase().replace(/\s+/g, "-")}-updated.pdf`;
  existing.verification = {
    ...existing.verification,
    ocrConfidence: 60 + Math.floor(Math.random() * 35),
    blurDetected: false,
    forgeryDetected: false,
    recommendations: ["Re-upload received — AI re-verification in progress."],
  };
  uploadTimeline.unshift({
    id: `evt-${Date.now()}`,
    documentType: type,
    action: "replaced",
    timestamp: new Date().toISOString(),
    detail: `${type} re-uploaded — previous version replaced`,
  });
  return existing;
}
