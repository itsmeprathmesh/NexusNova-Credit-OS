import { describe, expect, it } from "vitest";
import { applications, financialSignals, msmes } from "@/data/mock-data";
import {
  calculateDynamicCreditLimit,
  calculateFinancialHealth,
  calculateFraudRisk,
  calculateRepaymentRisk,
  createLoanRecommendation,
  runStressScenario
} from "./intelligence";

const application = applications[0];
const msme = msmes.find((item) => item.id === application.msmeId)!;
const signals = financialSignals.find((item) => item.msmeId === msme.id)!;

describe("intelligence services", () => {
  it("calculates explainable financial health", () => {
    const result = calculateFinancialHealth(msme, signals);

    expect(result.score).toBeGreaterThan(60);
    expect(result.evidence.length).toBeGreaterThan(1);
    expect(result.reason).toContain("cash-flow");
  });

  it("calculates repayment risk from obligations and volatility", () => {
    const result = calculateRepaymentRisk(signals);

    expect(result.band).toBe("medium");
    expect(result.negativeFactors.join(" ")).toContain("failed transactions");
  });

  it("flags fraud risk from document and turnover issues", () => {
    const result = calculateFraudRisk(application.id, signals);

    expect(result.confidence).toBeGreaterThanOrEqual(70);
    expect(result.evidence.some((item) => item.source.includes("Document"))).toBe(true);
  });

  it("creates a loan recommendation below or equal to requested amount", () => {
    const recommendation = createLoanRecommendation(application, msme, signals);

    expect(recommendation.recommendedAmount).toBeLessThanOrEqual(application.requestedAmount);
    expect(["approve", "reduce", "escalate", "request-documents"]).toContain(recommendation.action);
  });

  it("reduces safe limit under stress", () => {
    const base = calculateDynamicCreditLimit(signals);
    const stressed = runStressScenario(signals, {
      revenueDropPercent: 20,
      emiIncreasePercent: 10,
      receivableDelayDays: 30
    });

    expect(stressed.safeLimit).toBeLessThan(base.safeLimit);
  });
});
