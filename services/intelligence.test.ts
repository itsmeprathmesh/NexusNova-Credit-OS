import { describe, expect, it } from "vitest";
import { applications, financialSignals, msmes } from "@/data/mock-data";
import {
  calculateAiReadiness,
  calculateBusinessGrowthForecast,
  calculateCashFlowForecast,
  calculateDynamicCreditLimit,
  calculateFinancialHealth,
  calculateFraudRisk,
  calculateRepaymentRisk,
  createLoanRecommendation,
  getDocumentIntelligence,
  runLoanStressScenario,
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

  it("summarizes document intelligence across all required documents", () => {
    const review = getDocumentIntelligence(application.id);

    expect(review).toHaveLength(6);
    expect(review.map((item) => item.type)).toContain("GST Returns");
    expect(review.some((item) => item.uploadStatus === "missing")).toBe(true);
    expect(review.some((item) => item.mismatchWarnings.length > 0)).toBe(true);
  });

  it("calculates AI readiness from missing documents and review issues", () => {
    const readiness = calculateAiReadiness(application.id);

    expect(readiness.score).toBeLessThan(90);
    expect(readiness.missingDocuments).toContain("Udyam");
    expect(readiness.reviewItems.join(" ")).toContain("Bank credits exceed");
  });

  it("creates explainable business growth and cash-flow forecasts", () => {
    const growth = calculateBusinessGrowthForecast(signals);
    const cashFlow = calculateCashFlowForecast(signals);

    expect(growth.reason).toContain("revenue");
    expect(growth.evidence.length).toBeGreaterThan(1);
    expect(cashFlow.reason.toLowerCase()).toContain("cash-flow");
    expect(cashFlow.confidence).toBeGreaterThanOrEqual(70);
  });

  it("updates decision objects for a richer loan stress scenario", () => {
    const baseline = runLoanStressScenario(application, msme, signals, {
      loanAmount: application.requestedAmount,
      interestRate: 11.5,
      tenureMonths: 36,
      revenueDropPercent: 0,
      receivableDelayDays: 0,
      seasonalityImpactPercent: 0
    });
    const stressed = runLoanStressScenario(application, msme, signals, {
      loanAmount: application.requestedAmount,
      interestRate: 14,
      tenureMonths: 24,
      revenueDropPercent: 25,
      receivableDelayDays: 45,
      seasonalityImpactPercent: 15
    });

    expect(stressed.coverageRatio).toBeLessThan(baseline.coverageRatio);
    expect(stressed.dynamicLimit.safeLimit).toBeLessThan(baseline.dynamicLimit.safeLimit);
    expect(["reduce", "escalate", "request-documents", "reject"]).toContain(stressed.recommendation.action);
  });
});
