import type { AuditEvent, BusinessRegistration, DecisionAction, DocumentRecord, DocumentType, LoanApplication, NotificationEvent, TimelineStage, UserRole } from "@/domain/types";
import { documents as staticDocuments, financialSignals as staticSignals, msmes as staticMsmes } from "@/data/mock-data";

export type CustomerSession = {
  loggedIn: boolean;
  msmeId: string | null;
  registration: BusinessRegistration | null;
};

let session: CustomerSession = { loggedIn: false, msmeId: null, registration: null };

let applicationIdCounter = 0;

let notifications: NotificationEvent[] = [];

let officerRequests: { applicationId: string; documentTypes: DocumentType[]; message: string; timestamp: string }[] = [];

export function getSession() {
  return session;
}

export function login(msmeId: string) {
  session = { ...session, loggedIn: true, msmeId };
}

export function logout() {
  session = { loggedIn: false, msmeId: null, registration: null };
}

export function registerBusiness(reg: BusinessRegistration): string {
  const newMsmeId = `msme-${reg.businessName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
  session = { ...session, loggedIn: true, msmeId: newMsmeId, registration: reg };
  return newMsmeId;
}

export function getRegistration() {
  return session.registration;
}

export function submitApplication(request: {
  msmeId: string;
  product: string;
  requestedAmount: number;
  tenureMonths: number;
  purpose: string;
  msmeName: string;
  sector: string;
  branch: string;
  owner: string;
  city: string;
  pan: string;
  gstin: string;
  udyam: string;
  businessAgeYears: number;
}): string {
  applicationIdCounter += 1;
  const appId = `app-cust-${Date.now()}-${applicationIdCounter}`;

  const newApplication: LoanApplication = {
    id: appId,
    msmeId: request.msmeId,
    requestedAmount: request.requestedAmount,
    product: request.product,
    purpose: request.purpose,
    priority: "standard",
    slaHoursRemaining: 48,
    status: "new"
  };

  const newMsme = {
    id: request.msmeId,
    name: request.msmeName,
    sector: request.sector,
    branch: request.branch,
    owner: request.owner,
    city: request.city,
    pan: request.pan,
    gstin: request.gstin,
    udyam: request.udyam,
    businessAgeYears: request.businessAgeYears,
    relationshipYears: 0
  };

  staticMsmes.push(newMsme);

  const appsArray = (globalThis as any).__applications;
  if (Array.isArray(appsArray)) {
    appsArray.push(newApplication);
  }

  staticSignals.push({
    msmeId: request.msmeId,
    monthlyRevenue: Array(6).fill(Math.round(request.requestedAmount * 0.5)),
    gstTurnover: Array(6).fill(Math.round(request.requestedAmount * 0.45)),
    upiInflow: Array(6).fill(Math.round(request.requestedAmount * 0.1)),
    failedTransactions: 0,
    customerConcentrationPercent: 25,
    existingObligations: Math.round(request.requestedAmount * 0.15),
    averageMonthlyBalance: Math.round(request.requestedAmount * 0.4)
  });

  const now = new Date().toISOString();
  addNotification({
    type: "status-change",
    title: "Application Submitted",
    message: `Your ${request.product} request for ${formatShortAmount(request.requestedAmount)} has been submitted for bank review.`,
    timestamp: now
  });

  return appId;
}

export function getNotifications(): NotificationEvent[] {
  return [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function addNotification(event: Omit<NotificationEvent, "id" | "read">) {
  const id = `notif-${Date.now()}-${notifications.length}`;
  notifications.unshift({ ...event, id, read: false });
}

export function markNotificationRead(id: string) {
  notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
}

export function markAllNotificationsRead() {
  notifications = notifications.map((n) => ({ ...n, read: true }));
}

export function getUnreadCount(): number {
  return notifications.filter((n) => !n.read).length;
}

export function requestDocument(applicationId: string, documentTypes: DocumentType[], message: string) {
  officerRequests.push({ applicationId, documentTypes, message, timestamp: new Date().toISOString() });
  const now = new Date().toISOString();
  for (const docType of documentTypes) {
    addNotification({
      type: "officer-request",
      title: "Officer Requested Document",
      message: `The loan officer has requested: ${docType}. ${message}`,
      timestamp: now
    });
  }
}

export function getOfficerRequests(applicationId: string) {
  return officerRequests.filter((r) => r.applicationId === applicationId);
}

export function getTimelineStages(applicationId: string, status: string): TimelineStage[] {
  const now = new Date().toISOString();
  const stages: TimelineStage[] = [
    { id: "submitted", label: "Submitted", status: "complete", timestamp: now, detail: "Application received by the bank" },
    { id: "documents", label: "Documents Uploaded", status: "pending", timestamp: null, detail: "Upload GST, PAN, Udyam, Bank Statement, ITR, Financial Statement" },
    { id: "ocr", label: "OCR Complete", status: "pending", timestamp: null, detail: "Document scanning and text extraction" },
    { id: "validation", label: "Validation", status: "pending", timestamp: null, detail: "Document verification and cross-matching" },
    { id: "ai-review", label: "AI Review", status: "pending", timestamp: null, detail: "Financial health, repayment risk, fraud risk analysis" },
    { id: "committee", label: "Credit Committee", status: "pending", timestamp: null, detail: "AI persona review and consensus" },
    { id: "officer", label: "Officer Review", status: "pending", timestamp: null, detail: "Loan officer decision workflow" },
    { id: "manager", label: "Manager Review", status: "pending", timestamp: null, detail: "Manager oversight and approval" },
    { id: "approved", label: "Approved", status: "pending", timestamp: null, detail: "Sanction letter issued" }
  ];

  if (status === "approved" || status === "rejected") {
    stages[8].status = status === "approved" ? "complete" : "skipped";
    stages[8].timestamp = now;
    if (status === "approved") {
      stages[6].status = "complete";
      stages[6].timestamp = now;
      stages[7].status = "complete";
      stages[7].timestamp = now;
    }
  }

  const docCount = staticDocuments.filter((d) => d.applicationId === applicationId).length;
  if (docCount >= 3) {
    stages[1].status = "complete";
    stages[1].timestamp = now;
  }
  if (docCount >= 5) {
    stages[2].status = "complete";
    stages[2].timestamp = now;
  }
  const allVerified = staticDocuments.filter((d) => d.applicationId === applicationId).every((d) => d.status === "verified");
  if (allVerified && docCount >= 3) {
    stages[3].status = "complete";
    stages[3].timestamp = now;
  }

  let activeIndex = stages.findIndex((s) => s.status === "pending");
  if (activeIndex > 0 && stages[activeIndex - 1].status === "complete") {
    if (stages[activeIndex].id !== "approved") {
      stages[activeIndex] = { ...stages[activeIndex], status: "active" };
    }
  }

  return stages;
}

export function triggerAiReview(applicationId: string) {
  const now = new Date().toISOString();
  addNotification({
    type: "ai-review-complete",
    title: "AI Review Complete",
    message: "The AI has completed its analysis of your application. The credit committee will review next.",
    timestamp: now
  });
}

export function triggerCommitteeComplete(applicationId: string) {
  const now = new Date().toISOString();
  addNotification({
    type: "committee-complete",
    title: "Credit Committee Complete",
    message: "The AI Credit Committee has reached a consensus on your application.",
    timestamp: now
  });
}

export function triggerOfficerDecision(applicationId: string, action: DecisionAction) {
  const now = new Date().toISOString();
  const isApproved = action === "approve";
  addNotification({
    type: isApproved ? "application-approved" : "application-rejected",
    title: isApproved ? "Application Approved" : "Application Status Updated",
    message: isApproved
      ? "Congratulations! Your loan application has been approved by the loan officer."
      : `Your application status has been updated to: ${action}.`,
    timestamp: now
  });
}

let auditEvents: AuditEvent[] = [
  { id: "audit-001", actor: "LO-1187", role: "loan-officer", action: "Application reviewed", timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), rationale: "Initial document verification completed. All documents present." },
  { id: "audit-002", actor: "AI-Committee", role: "loan-officer", action: "Committee consensus generated", timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(), rationale: "Risk Officer: Approve, Business Growth: Approve, Compliance: Conditional. Consensus: Approve with conditions." },
  { id: "audit-003", actor: "LO-1187", role: "loan-officer", action: "Decision recorded", timestamp: new Date(Date.now() - 86400000).toISOString(), rationale: "Approved for INR 75,00,000 at 12.5% for 36 months. Conditions: invoice verification, quarterly monitoring." },
  { id: "audit-004", actor: "MGR-2041", role: "manager", action: "Oversight review completed", timestamp: new Date(Date.now() - 43200000).toISOString(), rationale: "Reviewed committee consensus and officer decision. No override needed. Approved." },
  { id: "audit-005", actor: "AI-Fraud-Scanner", role: "loan-officer", action: "Fraud re-screening triggered", timestamp: new Date(Date.now() - 21600000).toISOString(), rationale: "Automated fraud re-screening completed. No new indicators detected." },
  { id: "audit-006", actor: "LO-1187", role: "loan-officer", action: "Sanction letter generated", timestamp: new Date(Date.now() - 10800000).toISOString(), rationale: "Sanction letter for Aurora Precision Tools generated and queued for digital signature." },
  { id: "audit-007", actor: "MGR-2041", role: "manager", action: "Portfolio limit rebalancing", timestamp: new Date(Date.now() - 7200000).toISOString(), rationale: "Quarterly portfolio rebalancing: Pune Industrial exposure reduced by 8% per risk policy." }
];

export function getAuditEvents(): AuditEvent[] {
  return [...auditEvents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function recordAuditEvent(event: Omit<AuditEvent, "id" | "timestamp">) {
  const id = `audit-${Date.now()}-${auditEvents.length}`;
  auditEvents.unshift({ ...event, id, timestamp: new Date().toISOString() });
}

function formatShortAmount(amount: number) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${(amount / 1000).toFixed(0)}K`;
}
