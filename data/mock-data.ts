import type { DocumentRecord, FinancialSignals, LoanApplication, MsmeProfile, PortfolioItem } from "@/domain/types";

export const msmes: MsmeProfile[] = [
  {
    id: "msme-aurora",
    name: "Aurora Precision Tools",
    sector: "Manufacturing",
    branch: "IDBI Pune Industrial",
    owner: "Rohit Kulkarni",
    city: "Pune",
    pan: "AAKPA1842K",
    gstin: "27AAKPA1842K1Z8",
    udyam: "UDYAM-MH-26-0048123",
    businessAgeYears: 8,
    relationshipYears: 3
  },
  {
    id: "msme-kaveri",
    name: "Kaveri Agro Foods",
    sector: "Food Processing",
    branch: "IDBI Mysuru",
    owner: "Meera Nair",
    city: "Mysuru",
    pan: "BBNPN9021F",
    gstin: "29BBNPN9021F1Z3",
    udyam: "UDYAM-KA-23-0091127",
    businessAgeYears: 5,
    relationshipYears: 2
  },
  {
    id: "msme-saral",
    name: "Saral Textiles",
    sector: "Textiles",
    branch: "IDBI Surat",
    owner: "Imran Sheikh",
    city: "Surat",
    pan: "CCHPS3388D",
    gstin: "24CCHPS3388D1Z4",
    udyam: "UDYAM-GJ-22-0029194",
    businessAgeYears: 11,
    relationshipYears: 6
  }
];

export const applications: LoanApplication[] = [
  {
    id: "app-1001",
    msmeId: "msme-aurora",
    requestedAmount: 4200000,
    product: "Working Capital Term Loan",
    purpose: "CNC inventory and receivables bridge",
    priority: "urgent",
    slaHoursRemaining: 6,
    status: "in-review"
  }
];

export const documents: DocumentRecord[] = [
  {
    id: "doc-gst-aurora",
    applicationId: "app-1001",
    type: "GST Returns",
    status: "verified",
    ocrConfidence: 94,
    extractedFields: { fyTurnover: "INR 3.82 Cr", lastFiled: "June 2026" },
    issues: []
  },
  {
    id: "doc-bank-aurora",
    applicationId: "app-1001",
    type: "Bank Statement",
    status: "review-needed",
    ocrConfidence: 82,
    extractedFields: { averageBalance: "INR 18.4 L", failedTxns: "7" },
    issues: ["Two large credits need invoice matching"]
  },
  {
    id: "doc-pan-aurora",
    applicationId: "app-1001",
    type: "PAN",
    status: "verified",
    ocrConfidence: 98,
    extractedFields: { pan: "AAKPA1842K" },
    issues: []
  }
];

export const financialSignals: FinancialSignals[] = [
  {
    msmeId: "msme-aurora",
    monthlyRevenue: [2450000, 2520000, 2610000, 2380000, 2740000, 2860000],
    gstTurnover: [2280000, 2410000, 2490000, 2360000, 2690000, 2810000],
    upiInflow: [430000, 455000, 468000, 410000, 492000, 504000],
    failedTransactions: 7,
    customerConcentrationPercent: 38,
    existingObligations: 620000,
    averageMonthlyBalance: 1840000
  }
];

export const portfolio: PortfolioItem[] = [
  { msmeId: "msme-aurora", exposure: 3100000, riskBand: "medium", earlyWarnings: ["Invoice concentration rising"], dynamicLimitDelta: 400000 },
  { msmeId: "msme-kaveri", exposure: 1800000, riskBand: "low", earlyWarnings: [], dynamicLimitDelta: 250000 },
  { msmeId: "msme-saral", exposure: 5200000, riskBand: "high", earlyWarnings: ["GST turnover down 18%", "Cash-flow compression"], dynamicLimitDelta: -900000 }
];
