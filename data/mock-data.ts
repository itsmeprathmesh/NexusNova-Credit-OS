import type {
  CrmNote,
  Customer360Snapshot,
  DocumentRecord,
  FinancialSignals,
  LoanApplication,
  LoanHistoryRecord,
  MsmeProfile,
  PortfolioItem,
  PreviousCreditDecision,
  RelationshipManagerAssignment,
  RelationshipTimelineEvent
} from "@/domain/types";

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
  },
  {
    id: "msme-lotus",
    name: "Blue Lotus Pharma",
    sector: "Pharmaceutical",
    branch: "IDBI Hyderabad",
    owner: "Sunita Reddy",
    city: "Hyderabad",
    pan: "DDEPR7766H",
    gstin: "36DDEPR7766H1Z9",
    udyam: "UDYAM-TS-28-0067134",
    businessAgeYears: 14,
    relationshipYears: 5
  },
  {
    id: "msme-greenearth",
    name: "Green Earth Logistics",
    sector: "Logistics",
    branch: "IDBI Mumbai",
    owner: "Vikram Joshi",
    city: "Mumbai",
    pan: "EEFPS5511M",
    gstin: "27EEFPS5511M1Z6",
    udyam: "UDYAM-MH-32-0082156",
    businessAgeYears: 6,
    relationshipYears: 2
  },
  {
    id: "msme-digibake",
    name: "DigiBake Foods",
    sector: "Food & Beverage",
    branch: "IDBI Bangalore",
    owner: "Kavya Ramesh",
    city: "Bengaluru",
    pan: "GGBPR1234H",
    gstin: "29GGBPR1234H1Z5",
    udyam: "UDYAM-KA-35-0023456",
    businessAgeYears: 1,
    relationshipYears: 0
  },
  {
    id: "msme-surya",
    name: "Surya Electronics",
    sector: "Electronics",
    branch: "IDBI Bangalore",
    owner: "Anita Krishnan",
    city: "Bengaluru",
    pan: "FFGPT3399B",
    gstin: "29FFGPT3399B1Z7",
    udyam: "UDYAM-KA-31-0054189",
    businessAgeYears: 9,
    relationshipYears: 4
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
    ocrStatus: "completed",
    ocrConfidence: 94,
    validationStatus: "passed",
    extractedFields: { fyTurnover: "INR 3.82 Cr", lastFiled: "June 2026" },
    issues: [],
    mismatchWarnings: [],
    tamperIndicators: [],
    missingFields: [],
    uploadedAt: "2026-07-02 10:24"
  },
  {
    id: "doc-bank-aurora",
    applicationId: "app-1001",
    type: "Bank Statement",
    status: "review-needed",
    ocrStatus: "needs-review",
    ocrConfidence: 82,
    validationStatus: "warning",
    extractedFields: { averageBalance: "INR 18.4 L", failedTxns: "7" },
    issues: ["Two large credits need invoice matching"],
    mismatchWarnings: ["Bank credits exceed linked GST invoices by INR 7.8 L in May"],
    tamperIndicators: ["Statement page 4 metadata differs from rest of PDF"],
    missingFields: ["Invoice reference for credit CR-2026-05-18"],
    uploadedAt: "2026-07-02 10:31"
  },
  {
    id: "doc-pan-aurora",
    applicationId: "app-1001",
    type: "PAN",
    status: "verified",
    ocrStatus: "completed",
    ocrConfidence: 98,
    validationStatus: "passed",
    extractedFields: { pan: "AAKPA1842K" },
    issues: [],
    mismatchWarnings: [],
    tamperIndicators: [],
    missingFields: [],
    uploadedAt: "2026-07-02 10:19"
  },
  {
    id: "doc-udyam-aurora",
    applicationId: "app-1001",
    type: "Udyam",
    status: "missing",
    ocrStatus: "not-started",
    ocrConfidence: 0,
    validationStatus: "pending",
    extractedFields: {},
    issues: ["Udyam certificate not uploaded"],
    mismatchWarnings: [],
    tamperIndicators: [],
    missingFields: ["Udyam registration number", "Enterprise classification"],
    uploadedAt: undefined
  },
  {
    id: "doc-itr-aurora",
    applicationId: "app-1001",
    type: "ITR",
    status: "stale",
    ocrStatus: "completed",
    ocrConfidence: 88,
    validationStatus: "warning",
    extractedFields: { assessmentYear: "2024-25", declaredIncome: "INR 28.6 L" },
    issues: ["Latest assessment year ITR is pending"],
    mismatchWarnings: ["Declared income trails observed banking inflows"],
    tamperIndicators: [],
    missingFields: ["AY 2025-26 acknowledgement"],
    uploadedAt: "2026-07-02 10:38"
  },
  {
    id: "doc-financials-aurora",
    applicationId: "app-1001",
    type: "Financial Statement",
    status: "review-needed",
    ocrStatus: "needs-review",
    ocrConfidence: 79,
    validationStatus: "warning",
    extractedFields: { netMargin: "11.8%", receivables: "INR 42 L" },
    issues: ["Receivables ageing schedule needs CA confirmation"],
    mismatchWarnings: ["Receivables growth is faster than six-month revenue growth"],
    tamperIndicators: [],
    missingFields: ["CA UDIN", "Ageing bucket over 90 days"],
    uploadedAt: "2026-07-02 10:44"
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
  },
  {
    msmeId: "msme-kaveri",
    monthlyRevenue: [1820000, 1910000, 1880000, 1960000, 2040000, 2120000],
    gstTurnover: [1710000, 1820000, 1790000, 1880000, 1950000, 2060000],
    upiInflow: [320000, 335000, 348000, 360000, 372000, 385000],
    failedTransactions: 2,
    customerConcentrationPercent: 28,
    existingObligations: 410000,
    averageMonthlyBalance: 1250000
  },
  {
    msmeId: "msme-saral",
    monthlyRevenue: [3120000, 2980000, 2750000, 2640000, 2480000, 2350000],
    gstTurnover: [3050000, 2890000, 2680000, 2520000, 2410000, 2280000],
    upiInflow: [510000, 485000, 442000, 418000, 395000, 372000],
    failedTransactions: 12,
    customerConcentrationPercent: 52,
    existingObligations: 1850000,
    averageMonthlyBalance: 920000
  },
  {
    msmeId: "msme-lotus",
    monthlyRevenue: [3880000, 3950000, 4020000, 4110000, 4180000, 4250000],
    gstTurnover: [3720000, 3810000, 3890000, 3960000, 4080000, 4160000],
    upiInflow: [680000, 695000, 712000, 728000, 745000, 760000],
    failedTransactions: 1,
    customerConcentrationPercent: 42,
    existingObligations: 980000,
    averageMonthlyBalance: 2650000
  },
  {
    msmeId: "msme-greenearth",
    monthlyRevenue: [2150000, 2080000, 1950000, 1880000, 1820000, 1750000],
    gstTurnover: [2020000, 1960000, 1850000, 1760000, 1710000, 1640000],
    upiInflow: [380000, 365000, 342000, 328000, 315000, 301000],
    failedTransactions: 9,
    customerConcentrationPercent: 48,
    existingObligations: 1250000,
    averageMonthlyBalance: 680000
  },
  {
    msmeId: "msme-digibake",
    monthlyRevenue: [420000, 460000, 510000, 580000, 620000, 680000],
    gstTurnover: [390000, 430000, 480000, 540000, 580000, 640000],
    upiInflow: [180000, 195000, 210000, 240000, 265000, 290000],
    failedTransactions: 1,
    customerConcentrationPercent: 55,
    existingObligations: 0,
    averageMonthlyBalance: 380000
  },
  {
    msmeId: "msme-surya",
    monthlyRevenue: [1450000, 1520000, 1580000, 1650000, 1720000, 1810000],
    gstTurnover: [1380000, 1440000, 1510000, 1580000, 1640000, 1720000],
    upiInflow: [280000, 295000, 310000, 325000, 340000, 358000],
    failedTransactions: 0,
    customerConcentrationPercent: 22,
    existingObligations: 280000,
    averageMonthlyBalance: 1120000
  }
];

export const portfolio: PortfolioItem[] = [
  { msmeId: "msme-aurora", exposure: 3100000, riskBand: "medium", earlyWarnings: ["Invoice concentration rising"], dynamicLimitDelta: 400000 },
  { msmeId: "msme-kaveri", exposure: 1800000, riskBand: "low", earlyWarnings: [], dynamicLimitDelta: 250000 },
  { msmeId: "msme-saral", exposure: 5200000, riskBand: "high", earlyWarnings: ["GST turnover down 18%", "Cash-flow compression"], dynamicLimitDelta: -900000 },
  { msmeId: "msme-lotus", exposure: 4100000, riskBand: "medium", earlyWarnings: ["Receivable ageing over 90 days for top buyer"], dynamicLimitDelta: 350000 },
  { msmeId: "msme-greenearth", exposure: 2800000, riskBand: "high", earlyWarnings: ["Fuel cost margin compression", "Two cheque returns in last quarter"], dynamicLimitDelta: -450000 },
  { msmeId: "msme-digibake", exposure: 0, riskBand: "low", earlyWarnings: ["New-to-Credit — no loan history"], dynamicLimitDelta: 250000 },
  { msmeId: "msme-surya", exposure: 1900000, riskBand: "low", earlyWarnings: [], dynamicLimitDelta: 520000 }
];

const relationshipManagers: RelationshipManagerAssignment[] = [
  {
    msmeId: "msme-aurora",
    name: "Priya Deshmukh",
    employeeId: "RM-4412",
    branch: "IDBI Pune Industrial",
    phone: "+91 98220 11407",
    since: "2023-04-01"
  }
];

const loanHistory: LoanHistoryRecord[] = [
  {
    id: "loan-aurora-wc-22",
    msmeId: "msme-aurora",
    product: "Cash Credit Limit",
    sanctionedAmount: 2500000,
    outstanding: 1840000,
    status: "active",
    sanctionedDate: "2023-06-15",
    tenureMonths: 12
  },
  {
    id: "loan-aurora-tl-24",
    msmeId: "msme-aurora",
    product: "Term Loan — Machinery",
    sanctionedAmount: 1200000,
    outstanding: 620000,
    status: "active",
    sanctionedDate: "2024-02-10",
    tenureMonths: 36
  },
  {
    id: "loan-aurora-od-21",
    msmeId: "msme-aurora",
    product: "Overdraft Facility",
    sanctionedAmount: 800000,
    outstanding: 0,
    status: "closed",
    sanctionedDate: "2021-09-01",
    tenureMonths: 12
  }
];

const previousDecisions: PreviousCreditDecision[] = [
  {
    id: "dec-aurora-24",
    msmeId: "msme-aurora",
    applicationId: "app-0884",
    date: "2024-02-08",
    action: "approve",
    amount: 1200000,
    officer: "Anil Mehta",
    rationale: "Machinery term loan approved with quarterly GST monitoring.",
    aiRecommendation: "approve"
  },
  {
    id: "dec-aurora-23",
    msmeId: "msme-aurora",
    applicationId: "app-0612",
    date: "2023-06-12",
    action: "reduce",
    amount: 2500000,
    officer: "Anil Mehta",
    rationale: "Working capital limit reduced from requested INR 30 L to INR 25 L due to receivable concentration.",
    aiRecommendation: "reduce"
  }
];

const crmNotes: CrmNote[] = [
  {
    id: "note-aurora-1",
    msmeId: "msme-aurora",
    author: "Priya Deshmukh",
    role: "Relationship Manager",
    date: "2026-07-01",
    content: "Owner confirmed new OEM contract from June. Expects receivable cycle to stretch by 12–15 days for two quarters.",
    pinned: true
  },
  {
    id: "note-aurora-2",
    msmeId: "msme-aurora",
    author: "Rohit Kulkarni",
    role: "Customer",
    date: "2026-07-02",
    content: "Submitted bank statement and GST via portal. Udyam upload pending — certificate renewal in progress.",
    pinned: false
  },
  {
    id: "note-aurora-3",
    msmeId: "msme-aurora",
    author: "Anil Mehta",
    role: "Loan Officer",
    date: "2026-06-28",
    content: "Prior sanction conduct satisfactory. No SMA history. Recommend continuity subject to invoice matching on May credits.",
    pinned: false
  }
];

const relationshipTimeline: RelationshipTimelineEvent[] = [
  {
    id: "evt-aurora-1",
    msmeId: "msme-aurora",
    date: "2026-07-02 10:44",
    kind: "document",
    title: "Financial statements uploaded",
    summary: "Customer uploaded audited statements via portal. OCR flagged receivables ageing for review.",
    actor: "Rohit Kulkarni",
    channel: "portal"
  },
  {
    id: "evt-aurora-2",
    msmeId: "msme-aurora",
    date: "2026-07-02 09:10",
    kind: "credit",
    title: "Working capital application opened",
    summary: "New request for INR 42 L working capital term loan linked to CNC inventory and receivables bridge.",
    actor: "System",
    channel: "portal"
  },
  {
    id: "evt-aurora-3",
    msmeId: "msme-aurora",
    date: "2026-07-01 15:30",
    kind: "relationship",
    title: "RM site visit",
    summary: "Priya Deshmukh visited Chakan plant. Production utilization at 78%. Two new export orders discussed.",
    actor: "Priya Deshmukh",
    channel: "site-visit"
  },
  {
    id: "evt-aurora-4",
    msmeId: "msme-aurora",
    date: "2026-06-28 11:00",
    kind: "note",
    title: "Officer pre-sanction note",
    summary: "Anil Mehta recorded satisfactory conduct on existing limits ahead of renewal cycle.",
    actor: "Anil Mehta",
    channel: "branch-visit"
  },
  {
    id: "evt-aurora-5",
    msmeId: "msme-aurora",
    date: "2026-06-15 09:00",
    kind: "alert",
    title: "Early warning — invoice concentration",
    summary: "Portfolio monitor flagged rising share of receivables from top two buyers.",
    actor: "Portfolio Intelligence",
    channel: "portal"
  },
  {
    id: "evt-aurora-6",
    msmeId: "msme-aurora",
    date: "2024-02-10",
    kind: "decision",
    title: "Machinery term loan sanctioned",
    summary: "INR 12 L approved for CNC upgrade. AI and officer aligned on approve.",
    actor: "Anil Mehta",
    channel: "branch-visit"
  },
  {
    id: "evt-aurora-7",
    msmeId: "msme-aurora",
    date: "2023-06-15",
    kind: "decision",
    title: "Cash credit limit enhanced",
    summary: "Limit set at INR 25 L after reduce recommendation on receivable concentration.",
    actor: "Anil Mehta",
    channel: "branch-visit"
  },
  {
    id: "evt-aurora-8",
    msmeId: "msme-aurora",
    date: "2023-04-01",
    kind: "relationship",
    title: "RM assignment",
    summary: "Priya Deshmukh assigned as primary relationship manager for Pune industrial cluster.",
    actor: "Branch Operations",
    channel: "branch-visit"
  }
];

const customer360Snapshots: Customer360Snapshot[] = [
  {
    msmeId: "msme-aurora",
    relationshipManager: relationshipManagers[0],
    timeline: relationshipTimeline,
    loanHistory,
    previousDecisions,
    crmNotes
  }
];

export function getPortfolioItem(msmeId: string) {
  return portfolio.find((item) => item.msmeId === msmeId);
}

export function getCustomer360(msmeId: string) {
  return customer360Snapshots.find((item) => item.msmeId === msmeId);
}

// (removed global bridge; use direct import)
