import type { DocumentRecord, DocumentType, FinancialSignals, LoanApplication, MsmeProfile } from "@/domain/types";
import { calculateDynamicCreditLimit } from "@/services/intelligence";
import { formatCurrency } from "@/lib/format";

const requiredDocuments: DocumentType[] = ["GST Returns", "Bank Statement", "Udyam", "PAN", "ITR", "Financial Statement"];

export type CustomerReadiness = {
  score: number;
  missingDocuments: DocumentType[];
  reviewItems: string[];
  estimatedEligibleAmount: number;
  nextActions: string[];
};

export type BankAiAnswer = {
  title: string;
  message: string;
  actions: string[];
};

export type CustomerSupportContext = {
  application: LoanApplication;
  msme: MsmeProfile;
  documents: DocumentRecord[];
  signals: FinancialSignals;
};

export function calculateCustomerReadiness(
  application: LoanApplication,
  documents: DocumentRecord[],
  signals: FinancialSignals
): CustomerReadiness {
  const uploadedTypes = new Set(documents.map((document) => document.type));
  const missingDocuments = requiredDocuments.filter((document) => !uploadedTypes.has(document));
  const reviewItems = documents.flatMap((document) => document.issues);
  const reviewPenalty = reviewItems.length * 8;
  const missingPenalty = missingDocuments.length * 5;
  const failedTransactionPenalty = Math.min(14, signals.failedTransactions * 2);
  const score = Math.max(40, Math.min(95, 92 - missingPenalty - reviewPenalty - failedTransactionPenalty));
  const estimatedEligibleAmount = Math.min(application.requestedAmount, calculateDynamicCreditLimit(signals).safeLimit);
  const nextActions = [
    ...missingDocuments.map((document) => `Upload ${document}`),
    ...reviewItems.map((item) => `Clarify: ${item}`)
  ];

  return {
    score,
    missingDocuments,
    reviewItems,
    estimatedEligibleAmount,
    nextActions: nextActions.length > 0 ? nextActions : ["Keep GST and bank statements updated"]
  };
}

export function answerBankAiQuestion(question: string, context: CustomerSupportContext): BankAiAnswer {
  const readiness = calculateCustomerReadiness(context.application, context.documents, context.signals);
  const normalized = question.toLowerCase();

  if (normalized.includes("missing") || normalized.includes("document")) {
    return {
      title: "Missing documents and upload actions",
      message:
        readiness.missingDocuments.length > 0
          ? `Your application needs ${readiness.missingDocuments.join(", ")} before the bank can complete review.`
          : "Your required documents are uploaded. The bank may still ask for clarifications if any file needs review.",
      actions: readiness.nextActions.filter((action) => action.startsWith("Upload"))
    };
  }

  if (normalized.includes("eligib") || normalized.includes("improve")) {
    return {
      title: "Ways to improve loan eligibility",
      message:
        "Eligibility improves when recent GST returns, bank statements, ITR, and Udyam details are complete and cash-flow issues are explained clearly.",
      actions: readiness.nextActions
    };
  }

  if (normalized.includes("review") || normalized.includes("status")) {
    return {
      title: "Why the application is under review",
      message: `${context.msme.name} is under review because the bank is validating submitted documents, bank credits, repayment capacity, and GST consistency.`,
      actions: readiness.reviewItems.length > 0 ? readiness.reviewItems.map((item) => `Provide support for ${item}`) : ["Wait for officer review"]
    };
  }

  if (normalized.includes("gst") || normalized.includes("mismatch")) {
    return {
      title: "GST turnover mismatch guidance",
      message:
        "GST mismatch means declared turnover, GST filings, and bank statement inflows need to be reconciled before sanction.",
      actions: ["Upload latest GST return", "Add invoice support for large credits", "Confirm GSTIN in business profile"]
    };
  }

  if (normalized.includes("how much") || normalized.includes("loan") || normalized.includes("amount")) {
    return {
      title: "Estimated eligible amount",
      message: `${context.msme.name} may be eligible for about ${formatCurrency(readiness.estimatedEligibleAmount)} based on the current mock cash-flow and document profile.`,
      actions: ["Review requested amount", "Upload missing financial documents", "Keep bank statement credits explainable"]
    };
  }

  return {
    title: "BANK AI Business Support",
    message:
      "I can help with missing documents, eligibility improvement, application review reasons, GST mismatch guidance, and estimated loan amount.",
    actions: readiness.nextActions
  };
}
