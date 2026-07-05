import { describe, expect, it } from "vitest";
import { applications, documents, financialSignals, msmes } from "@/data/mock-data";
import { answerBankAiQuestion, calculateCustomerReadiness } from "./customer-support";

const application = applications[0];
const msme = msmes.find((item) => item.id === application.msmeId)!;
const signals = financialSignals.find((item) => item.msmeId === msme.id)!;
const applicationDocuments = documents.filter((document) => document.applicationId === application.id);

describe("customer support helpers", () => {
  it("summarizes customer credit readiness from documents and signals", () => {
    const readiness = calculateCustomerReadiness(application, applicationDocuments, signals);

    expect(readiness.score).toBeGreaterThan(60);
    expect(readiness.missingDocuments).toContain("Udyam");
    expect(readiness.reviewItems.join(" ")).toContain("large credits");
    expect(readiness.estimatedEligibleAmount).toBeLessThanOrEqual(application.requestedAmount);
  });

  it("answers missing document questions with next actions", () => {
    const answer = answerBankAiQuestion("What documents are missing?", {
      application,
      msme,
      documents: applicationDocuments,
      signals
    });

    expect(answer.title).toContain("Missing documents");
    expect(answer.actions).toContain("Upload Udyam");
  });

  it("answers likely loan amount questions with an estimate", () => {
    const answer = answerBankAiQuestion("How much loan am I likely to get?", {
      application,
      msme,
      documents: applicationDocuments,
      signals
    });

    expect(answer.title).toContain("Estimated eligible amount");
    expect(answer.message).toContain("Aurora Precision Tools");
  });
});
