export type UserRole = "loan-officer" | "manager";
export type RiskBand = "low" | "medium" | "high" | "critical";
export type ApplicationStatus = "new" | "in-review" | "documents-needed" | "escalated" | "approved" | "rejected";
export type DecisionAction = "approve" | "reduce" | "reject" | "request-documents" | "escalate";

export type DocumentType = "GST Returns" | "Bank Statement" | "Udyam" | "PAN" | "ITR" | "Financial Statement";
export type DocumentStatus = "verified" | "review-needed" | "missing" | "stale";
export type OcrStatus = "completed" | "needs-review" | "not-started";
export type ValidationStatus = "passed" | "warning" | "failed" | "pending";

export interface MsmeProfile {
  id: string;
  name: string;
  sector: string;
  branch: string;
  owner: string;
  city: string;
  pan: string;
  gstin: string;
  udyam: string;
  businessAgeYears: number;
  relationshipYears: number;
}

export interface LoanApplication {
  id: string;
  msmeId: string;
  requestedAmount: number;
  product: string;
  purpose: string;
  priority: "standard" | "high" | "urgent";
  slaHoursRemaining: number;
  status: ApplicationStatus;
}

export interface DocumentRecord {
  id: string;
  applicationId: string;
  type: DocumentType;
  status: DocumentStatus;
  ocrStatus: OcrStatus;
  ocrConfidence: number;
  validationStatus: ValidationStatus;
  extractedFields: Record<string, string>;
  issues: string[];
  mismatchWarnings: string[];
  tamperIndicators: string[];
  missingFields: string[];
  uploadedAt?: string;
}

export interface FinancialSignals {
  msmeId: string;
  monthlyRevenue: number[];
  gstTurnover: number[];
  upiInflow: number[];
  failedTransactions: number;
  customerConcentrationPercent: number;
  existingObligations: number;
  averageMonthlyBalance: number;
}

export interface EvidenceItem {
  label: string;
  value: string;
  source: string;
  sentiment: "positive" | "negative" | "neutral";
}

export interface IntelligenceResult {
  score: number;
  band: RiskBand;
  confidence: number;
  reason: string;
  positiveFactors: string[];
  negativeFactors: string[];
  uncertainty: string;
  evidence: EvidenceItem[];
}

export interface LoanRecommendation {
  action: DecisionAction;
  recommendedAmount: number;
  tenureMonths: number;
  confidence: number;
  conditions: string[];
  mitigants: string[];
  rationale: string;
}

export interface PortfolioItem {
  msmeId: string;
  exposure: number;
  riskBand: RiskBand;
  earlyWarnings: string[];
  dynamicLimitDelta: number;
}

export interface AuditEvent {
  id: string;
  actor: string;
  role: UserRole;
  action: string;
  timestamp: string;
  rationale: string;
}

export type InteractionChannel = "branch-visit" | "phone" | "email" | "portal" | "site-visit";
export type TimelineEventKind = "relationship" | "credit" | "document" | "alert" | "decision" | "note";

export interface RelationshipManagerAssignment {
  msmeId: string;
  name: string;
  employeeId: string;
  branch: string;
  phone: string;
  since: string;
}

export interface RelationshipTimelineEvent {
  id: string;
  msmeId: string;
  date: string;
  kind: TimelineEventKind;
  title: string;
  summary: string;
  actor: string;
  channel?: InteractionChannel;
}

export interface LoanHistoryRecord {
  id: string;
  msmeId: string;
  product: string;
  sanctionedAmount: number;
  outstanding: number;
  status: "active" | "closed" | "watchlist";
  sanctionedDate: string;
  tenureMonths: number;
}

export interface PreviousCreditDecision {
  id: string;
  msmeId: string;
  applicationId?: string;
  date: string;
  action: DecisionAction;
  amount: number;
  officer: string;
  rationale: string;
  aiRecommendation: DecisionAction;
}

export interface CrmNote {
  id: string;
  msmeId: string;
  author: string;
  role: string;
  date: string;
  content: string;
  pinned?: boolean;
}

export interface Customer360Snapshot {
  msmeId: string;
  relationshipManager: RelationshipManagerAssignment;
  timeline: RelationshipTimelineEvent[];
  loanHistory: LoanHistoryRecord[];
  previousDecisions: PreviousCreditDecision[];
  crmNotes: CrmNote[];
}

export type CommitteePersonaId = "risk-officer" | "business-growth" | "compliance";
export type PersonaVote = "approve" | "conditional" | "reject";

export interface PersonaRecommendation {
  personaId: CommitteePersonaId;
  label: string;
  recommendation: PersonaVote;
  confidence: number;
  evidence: string[];
  keyConcerns: string[];
  suggestedActions: string[];
}

export interface CommitteeConsensus {
  finalRecommendation: PersonaVote;
  confidence: number;
  suggestedAmount: number;
  suggestedTenureMonths: number;
  conditions: string[];
  voteBreakdown: { approve: number; conditional: number; reject: number };
  generatedAt: string;
}

export interface OfficerDecision {
  action: DecisionAction;
  amount: number;
  rationale: string;
  overrideRationale: string | null;
  recordedAt: string;
}

export interface CommitteeAuditEntry {
  id: string;
  actor: string;
  role: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface BusinessRegistration {
  businessName: string;
  ownerName: string;
  mobile: string;
  email: string;
  city: string;
  pan: string;
  gstin: string;
  udyam: string;
  businessType: string;
  industry: string;
  businessAgeYears: number;
  annualTurnover: number;
  loanPurpose: string;
}

export interface NotificationEvent {
  id: string;
  type: "document-verified" | "document-rejected" | "document-requested" | "ai-review-complete" | "committee-complete" | "officer-request" | "application-approved" | "application-rejected" | "status-change";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface TimelineStage {
  id: string;
  label: string;
  status: "pending" | "active" | "complete" | "skipped";
  timestamp: string | null;
  detail: string;
}

export type DocumentUploadStatus = "missing" | "uploaded" | "under-review" | "verified" | "rejected" | "officer-requested";

export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  defaultTenureMonths: number;
  interestRate: number;
}

export const loanProducts: LoanProduct[] = [
  { id: "wc-term", name: "Working Capital Term Loan", description: "For inventory, receivables, and operational expenses", minAmount: 500000, maxAmount: 10000000, defaultTenureMonths: 36, interestRate: 12.5 },
  { id: "cc-limit", name: "Cash Credit Limit", description: "Revolving credit for day-to-day working capital", minAmount: 300000, maxAmount: 5000000, defaultTenureMonths: 12, interestRate: 11.0 },
  { id: "term-loan", name: "Term Loan — Machinery", description: "For equipment purchase and business expansion", minAmount: 1000000, maxAmount: 20000000, defaultTenureMonths: 60, interestRate: 13.0 },
  { id: "od-facility", name: "Overdraft Facility", description: "Flexible credit against collateral", minAmount: 200000, maxAmount: 3000000, defaultTenureMonths: 12, interestRate: 14.0 }
];
