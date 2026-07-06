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
