# NexusNova Credit Intelligence OS v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fresh Next.js 15 enterprise banking prototype for NexusNova Credit Intelligence OS v1 with a Loan Officer Workspace and Portfolio Intelligence Layer.

**Architecture:** The app uses a feature-first structure with pure TypeScript domain services, realistic mock data, and typed view models feeding Next.js routes. V1 uses deterministic mock intelligence instead of live OCR, database, or AI calls, while preserving clean seams for Prisma, PostgreSQL, and OpenAI later.

**Tech Stack:** Next.js 15, React, TypeScript, Tailwind CSS, lucide-react, Recharts, Framer Motion, Vitest, ESLint.

---

## File Structure

- Create `package.json`: scripts and dependencies.
- Create `next.config.ts`: Next.js config.
- Create `tsconfig.json`: strict TypeScript config and path aliases.
- Create `postcss.config.mjs`: Tailwind/PostCSS config.
- Create `tailwind.config.ts`: theme tokens for enterprise banking UI.
- Create `app/layout.tsx`: root metadata and global shell.
- Create `app/page.tsx`: role login.
- Create `app/command-center/page.tsx`: role-aware command center.
- Create `app/applications/page.tsx`: loan application queue.
- Create `app/applications/[id]/page.tsx`: loan officer workspace.
- Create `app/applications/[id]/memo/page.tsx`: credit memo preview.
- Create `app/portfolio/page.tsx`: portfolio intelligence dashboard.
- Create `app/portfolio/[msmeId]/page.tsx`: MSME portfolio drill-down.
- Create `app/not-found.tsx`: invalid route or ID state.
- Create `app/globals.css`: Tailwind base and design tokens.
- Create `domain/types.ts`: shared banking domain types.
- Create `data/mock-data.ts`: realistic MSME, application, document, and portfolio data.
- Create `services/intelligence.ts`: financial health, repayment risk, fraud, recommendation, dynamic limit, early warning, explainability, and stress simulation functions.
- Create `services/intelligence.test.ts`: deterministic service tests.
- Create `features/auth/role-context.tsx`: client-side role selection context.
- Create `features/command-center/command-center-view.tsx`: command center UI.
- Create `features/loan-workspace/application-queue.tsx`: application queue UI.
- Create `features/loan-workspace/application-workspace.tsx`: full loan officer case workspace.
- Create `features/loan-workspace/credit-memo.tsx`: memo preview UI.
- Create `features/portfolio/portfolio-dashboard.tsx`: portfolio dashboard UI.
- Create `features/portfolio/msme-drilldown.tsx`: MSME risk timeline UI.
- Create `components/layout/app-shell.tsx`: topbar, sidebar, navigation.
- Create `components/ui/primitives.tsx`: local button, badge, panel, tabs, metric, and progress primitives.
- Create `components/ui/charts.tsx`: reusable chart wrappers around Recharts.
- Create `lib/format.ts`: currency, percent, date, and risk label helpers.
- Create `lib/utils.ts`: className merge helper.

## Task 1: Manual Next.js Scaffold

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "nexusnova-credit-intelligence-os",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^11.15.0",
    "lucide-react": "^0.468.0",
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "recharts": "^2.15.0",
    "tailwind-merge": "^2.5.5"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.17.0",
    "eslint-config-next": "^15.1.0",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create framework config files**

Create `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true
};

export default nextConfig;
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `postcss.config.mjs`:

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};

export default config;
```

Create `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101318",
        muted: "#667085",
        line: "#d9e0ea",
        panel: "#ffffff",
        canvas: "#f5f7fa",
        trust: "#215f7a",
        growth: "#13795b",
        caution: "#b7791f",
        danger: "#b42318"
      },
      boxShadow: {
        soft: "0 14px 40px rgba(16, 19, 24, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
```

- [ ] **Step 3: Create minimal app shell files**

Create `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
  background: #f5f7fa;
  color: #101318;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f5f7fa;
  color: #101318;
  font-family: Arial, Helvetica, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}
```

Create `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexusNova Credit Intelligence OS",
  description: "AI-powered MSME lending intelligence platform for loan officers and portfolio managers"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Create `app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-semibold">NexusNova Credit Intelligence OS</h1>
      <p className="mt-3 text-muted">Fresh scaffold ready for enterprise banking prototype.</p>
    </main>
  );
}
```

- [ ] **Step 4: Install dependencies**

Run: `pnpm install`

Expected: dependencies install and `pnpm-lock.yaml` is created.

- [ ] **Step 5: Verify scaffold**

Run: `pnpm typecheck`

Expected: PASS with no TypeScript errors.

Run: `pnpm build`

Expected: PASS and Next.js production build completes.

- [ ] **Step 6: Commit**

Run:

```bash
git add package.json pnpm-lock.yaml next.config.ts tsconfig.json postcss.config.mjs tailwind.config.ts app
git commit -m "chore: scaffold nexusnova next app"
```

Expected: Git creates the scaffold commit. If Git process launch still fails with `CreateProcessAsUserW failed: 1312`, record the failure and continue without committing.

## Task 2: Domain Types, Mock Data, And Format Helpers

**Files:**
- Create: `domain/types.ts`
- Create: `data/mock-data.ts`
- Create: `lib/format.ts`
- Create: `lib/utils.ts`

- [ ] **Step 1: Create shared domain types**

Create `domain/types.ts`:

```ts
export type UserRole = "loan-officer" | "manager";
export type RiskBand = "low" | "medium" | "high" | "critical";
export type ApplicationStatus = "new" | "in-review" | "documents-needed" | "escalated" | "approved" | "rejected";
export type DecisionAction = "approve" | "reduce" | "reject" | "request-documents" | "escalate";

export type DocumentType = "GST Returns" | "Bank Statement" | "Udyam" | "PAN" | "ITR" | "Financial Statement";
export type DocumentStatus = "verified" | "review-needed" | "missing" | "stale";

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
  ocrConfidence: number;
  extractedFields: Record<string, string>;
  issues: string[];
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
```

- [ ] **Step 2: Create format helpers**

Create `lib/format.ts`:

```ts
import type { RiskBand } from "@/domain/types";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function riskLabel(band: RiskBand) {
  const labels: Record<RiskBand, string> = {
    low: "Low Risk",
    medium: "Medium Risk",
    high: "High Risk",
    critical: "Critical Risk"
  };
  return labels[band];
}
```

Create `lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Create realistic mock data**

Create `data/mock-data.ts` with three MSMEs and at least one high-priority loan application:

```ts
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
```

- [ ] **Step 4: Verify types**

Run: `pnpm typecheck`

Expected: PASS with no TypeScript errors.

- [ ] **Step 5: Commit**

Run:

```bash
git add domain data lib
git commit -m "feat: add banking domain model and mock data"
```

Expected: commit succeeds, unless Git remains blocked by the Windows process-launch issue.

## Task 3: Intelligence Services With Tests

**Files:**
- Create: `services/intelligence.ts`
- Create: `services/intelligence.test.ts`

- [ ] **Step 1: Write service tests**

Create `services/intelligence.test.ts`:

```ts
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
    const stressed = runStressScenario(signals, { revenueDropPercent: 20, emiIncreasePercent: 10, receivableDelayDays: 30 });
    expect(stressed.safeLimit).toBeLessThan(base.safeLimit);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail before implementation**

Run: `pnpm test`

Expected: FAIL because `services/intelligence.ts` does not exist.

- [ ] **Step 3: Implement deterministic intelligence services**

Create `services/intelligence.ts`:

```ts
import { documents } from "@/data/mock-data";
import type { FinancialSignals, IntelligenceResult, LoanApplication, LoanRecommendation, MsmeProfile, RiskBand } from "@/domain/types";

type StressInput = {
  revenueDropPercent: number;
  emiIncreasePercent: number;
  receivableDelayDays: number;
};

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function trend(values: number[]) {
  return values[values.length - 1] - values[0];
}

function riskBand(score: number): RiskBand {
  if (score >= 78) return "low";
  if (score >= 58) return "medium";
  if (score >= 38) return "high";
  return "critical";
}

export function calculateFinancialHealth(msme: MsmeProfile, signals: FinancialSignals): IntelligenceResult {
  const revenueTrend = trend(signals.monthlyRevenue);
  const gstTrend = trend(signals.gstTurnover);
  const revenueScore = revenueTrend > 0 ? 28 : 14;
  const gstScore = gstTrend > 0 ? 22 : 10;
  const balanceScore = signals.averageMonthlyBalance > signals.existingObligations * 2 ? 22 : 12;
  const concentrationScore = signals.customerConcentrationPercent < 45 ? 18 : 8;
  const ageScore = Math.min(10, msme.businessAgeYears);
  const score = Math.min(100, revenueScore + gstScore + balanceScore + concentrationScore + ageScore);

  return {
    score,
    band: riskBand(score),
    confidence: 86,
    reason: "Financial health is supported by cash-flow stability, GST turnover alignment, and operating history.",
    positiveFactors: ["Revenue trend is positive", "GST turnover aligns with declared business scale", "Business has operating history"],
    negativeFactors: signals.failedTransactions > 5 ? ["Recent failed transactions require review"] : [],
    uncertainty: "Bank statement anomalies should be matched against invoices before final sanction.",
    evidence: [
      { label: "Six-month revenue trend", value: revenueTrend > 0 ? "Positive" : "Negative", source: "Bank statement summary", sentiment: revenueTrend > 0 ? "positive" : "negative" },
      { label: "GST turnover trend", value: gstTrend > 0 ? "Improving" : "Declining", source: "GST returns", sentiment: gstTrend > 0 ? "positive" : "negative" },
      { label: "Customer concentration", value: `${signals.customerConcentrationPercent}%`, source: "Alternative data engine", sentiment: signals.customerConcentrationPercent < 45 ? "positive" : "negative" }
    ]
  };
}

export function calculateRepaymentRisk(signals: FinancialSignals): IntelligenceResult {
  const monthlyRevenue = average(signals.monthlyRevenue);
  const emiCoverage = monthlyRevenue / Math.max(signals.existingObligations, 1);
  const volatility = Math.max(...signals.monthlyRevenue) - Math.min(...signals.monthlyRevenue);
  const volatilityPercent = (volatility / monthlyRevenue) * 100;
  const score = Math.max(0, Math.min(100, 92 - signals.failedTransactions * 3 - volatilityPercent - (emiCoverage < 4 ? 16 : 0)));

  return {
    score,
    band: riskBand(score),
    confidence: 82,
    reason: "Repayment risk reflects EMI coverage, failed transactions, and cash-flow volatility.",
    positiveFactors: [`Estimated EMI coverage is ${emiCoverage.toFixed(1)}x`],
    negativeFactors: signals.failedTransactions > 0 ? [`${signals.failedTransactions} failed transactions in recent bank data`] : [],
    uncertainty: "Receivable ageing is simulated and should be verified with invoice-level data in production.",
    evidence: [
      { label: "Average monthly revenue", value: `INR ${Math.round(monthlyRevenue).toLocaleString("en-IN")}`, source: "Bank statement summary", sentiment: "positive" },
      { label: "Cash-flow volatility", value: `${Math.round(volatilityPercent)}%`, source: "Cash-flow analysis", sentiment: volatilityPercent < 18 ? "positive" : "negative" }
    ]
  };
}

export function calculateFraudRisk(applicationId: string, signals: FinancialSignals): IntelligenceResult {
  const docs = documents.filter((document) => document.applicationId === applicationId);
  const issues = docs.flatMap((document) => document.issues);
  const lowConfidenceDocs = docs.filter((document) => document.ocrConfidence < 85);
  const riskScore = Math.min(100, 28 + issues.length * 16 + lowConfidenceDocs.length * 12 + (signals.customerConcentrationPercent > 50 ? 18 : 0));

  return {
    score: riskScore,
    band: riskScore >= 72 ? "high" : riskScore >= 48 ? "medium" : "low",
    confidence: 78,
    reason: "Fraud risk is based on document confidence, mismatch indicators, and transaction pattern anomalies.",
    positiveFactors: ["PAN and GST identifiers are consistent"],
    negativeFactors: issues.length > 0 ? issues : ["No major document mismatch detected"],
    uncertainty: "Invoice-level matching is simulated in v1.",
    evidence: [
      { label: "Document review issues", value: `${issues.length}`, source: "Document intelligence", sentiment: issues.length ? "negative" : "positive" },
      { label: "Low-confidence documents", value: `${lowConfidenceDocs.length}`, source: "Document OCR", sentiment: lowConfidenceDocs.length ? "negative" : "positive" }
    ]
  };
}

export function calculateDynamicCreditLimit(signals: FinancialSignals) {
  const averageRevenue = average(signals.monthlyRevenue);
  const volatility = Math.max(...signals.monthlyRevenue) - Math.min(...signals.monthlyRevenue);
  const volatilityPenalty = volatility * 0.35;
  const concentrationPenalty = signals.customerConcentrationPercent > 45 ? averageRevenue * 0.12 : 0;
  const safeLimit = Math.max(500000, Math.round(averageRevenue * 1.8 - volatilityPenalty - concentrationPenalty - signals.existingObligations));

  return {
    safeLimit,
    upperLimit: Math.round(safeLimit * 1.18),
    lowerLimit: Math.round(safeLimit * 0.82)
  };
}

export function createLoanRecommendation(application: LoanApplication, msme: MsmeProfile, signals: FinancialSignals): LoanRecommendation {
  const health = calculateFinancialHealth(msme, signals);
  const repayment = calculateRepaymentRisk(signals);
  const limit = calculateDynamicCreditLimit(signals);
  const recommendedAmount = Math.min(application.requestedAmount, limit.safeLimit);
  const action = health.band === "low" && repayment.band === "low" ? "approve" : recommendedAmount < application.requestedAmount ? "reduce" : "escalate";

  return {
    action,
    recommendedAmount,
    tenureMonths: 36,
    confidence: Math.min(health.confidence, repayment.confidence),
    conditions: ["Verify two large bank credits against invoices", "Review GST filing continuity before sanction"],
    mitigants: ["Sanction below dynamic credit limit", "Monthly monitoring for first two quarters"],
    rationale: "Recommendation balances positive operating trend with bank statement review items and repayment buffer."
  };
}

export function runStressScenario(signals: FinancialSignals, stress: StressInput) {
  const stressedSignals: FinancialSignals = {
    ...signals,
    monthlyRevenue: signals.monthlyRevenue.map((value) => Math.round(value * (1 - stress.revenueDropPercent / 100))),
    existingObligations: Math.round(signals.existingObligations * (1 + stress.emiIncreasePercent / 100) + stress.receivableDelayDays * 2500)
  };
  return calculateDynamicCreditLimit(stressedSignals);
}
```

- [ ] **Step 4: Run service tests**

Run: `pnpm test`

Expected: PASS for all tests in `services/intelligence.test.ts`.

- [ ] **Step 5: Commit**

Run:

```bash
git add services
git commit -m "feat: add explainable credit intelligence services"
```

Expected: commit succeeds, unless Git remains blocked by the Windows process-launch issue.

## Task 4: UI Primitives And Enterprise Shell

**Files:**
- Create: `components/ui/primitives.tsx`
- Create: `components/layout/app-shell.tsx`
- Create: `features/auth/role-context.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create UI primitives**

Create `components/ui/primitives.tsx` with reusable `Button`, `Badge`, `Panel`, `Metric`, and `ProgressBar` components. Use `cn()` from `lib/utils.ts`. Risk badges must map `low`, `medium`, `high`, and `critical` to distinct colors.

- [ ] **Step 2: Create role context**

Create `features/auth/role-context.tsx` as a client component that stores selected role in React state and exposes `setRole`.

- [ ] **Step 3: Create app shell**

Create `components/layout/app-shell.tsx` with sidebar links for Command Center, Applications, and Portfolio. The shell should show the active role, bank-confidential label, and a compact notification strip.

- [ ] **Step 4: Replace root page with role login**

Update `app/page.tsx` to render two role choices: Loan Officer and Manager. Each choice links to `/command-center?role=loan-officer` or `/command-center?role=manager`.

- [ ] **Step 5: Verify**

Run: `pnpm typecheck`

Expected: PASS with no TypeScript errors.

Run: `pnpm build`

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add app components features
git commit -m "feat: add enterprise shell and role login"
```

Expected: commit succeeds, unless Git remains blocked by the Windows process-launch issue.

## Task 5: Command Center And Application Queue

**Files:**
- Create: `features/command-center/command-center-view.tsx`
- Create: `features/loan-workspace/application-queue.tsx`
- Create: `app/command-center/page.tsx`
- Create: `app/applications/page.tsx`

- [ ] **Step 1: Create command center view**

Implement `CommandCenterView` with four areas: urgent applications, early warning alerts, SLA breaches, and portfolio exposure. Use `applications`, `portfolio`, and `msmes` from `data/mock-data.ts`.

- [ ] **Step 2: Create application queue view**

Implement `ApplicationQueue` with filters displayed as segmented buttons for priority, risk, document readiness, ticket size, and branch. V1 filters can be visual-only, but the urgent Aurora application must be clickable and link to `/applications/app-1001`.

- [ ] **Step 3: Create routes**

Create `app/command-center/page.tsx` and `app/applications/page.tsx` that wrap views in `AppShell`.

- [ ] **Step 4: Verify**

Run: `pnpm typecheck`

Expected: PASS.

Run: `pnpm build`

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add app features
git commit -m "feat: add command center and application queue"
```

Expected: commit succeeds, unless Git remains blocked by the Windows process-launch issue.

## Task 6: Loan Officer Workspace

**Files:**
- Create: `features/loan-workspace/application-workspace.tsx`
- Create: `app/applications/[id]/page.tsx`
- Create: `app/not-found.tsx`

- [ ] **Step 1: Build workspace view**

Implement `ApplicationWorkspace` with sections for intake summary, document intelligence, alternative data intelligence, credit intelligence summary, explainability workbench, and audit trail preview. Use `calculateFinancialHealth`, `calculateRepaymentRisk`, `calculateFraudRisk`, `calculateDynamicCreditLimit`, and `createLoanRecommendation`.

- [ ] **Step 2: Add route by application ID**

Create `app/applications/[id]/page.tsx`. Look up the application by ID. If not found, call `notFound()`. Render `ApplicationWorkspace` in `AppShell`.

- [ ] **Step 3: Add not-found page**

Create `app/not-found.tsx` with a concise enterprise error state and a link back to `/applications`.

- [ ] **Step 4: Verify**

Run: `pnpm typecheck`

Expected: PASS.

Run: `pnpm build`

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```bash
git add app features
git commit -m "feat: add loan officer application workspace"
```

Expected: commit succeeds, unless Git remains blocked by the Windows process-launch issue.

## Task 7: Stress Simulator, Decision Workflow, And Credit Memo

**Files:**
- Modify: `features/loan-workspace/application-workspace.tsx`
- Create: `features/loan-workspace/credit-memo.tsx`
- Create: `app/applications/[id]/memo/page.tsx`

- [ ] **Step 1: Add client-side stress simulator**

Add a client component inside the workspace for revenue drop, EMI increase, and receivable delay controls. It must call `runStressScenario()` and show updated lower, safe, and upper credit limits.

- [ ] **Step 2: Add decision workflow**

Add actions for approve, reduce amount, reject, request documents, and escalate. If the selected action differs from the AI recommendation, require a rationale text area before displaying the simulated audit event.

- [ ] **Step 3: Create credit memo preview**

Create `CreditMemo` with application identity, document findings, financial health score, fraud risk, repayment risk, recommendation, officer decision placeholder, evidence list, and audit log.

- [ ] **Step 4: Add memo route**

Create `app/applications/[id]/memo/page.tsx`. Look up the same application and render `CreditMemo` in `AppShell`.

- [ ] **Step 5: Verify**

Run: `pnpm typecheck`

Expected: PASS.

Run: `pnpm build`

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add app features
git commit -m "feat: add stress simulator decision workflow and memo"
```

Expected: commit succeeds, unless Git remains blocked by the Windows process-launch issue.

## Task 8: Portfolio Intelligence And MSME Drill-Down

**Files:**
- Create: `components/ui/charts.tsx`
- Create: `features/portfolio/portfolio-dashboard.tsx`
- Create: `features/portfolio/msme-drilldown.tsx`
- Create: `app/portfolio/page.tsx`
- Create: `app/portfolio/[msmeId]/page.tsx`

- [ ] **Step 1: Create chart wrappers**

Create wrappers for bar chart, line chart, and heatmap-like grid using Recharts and CSS grid. The heatmap should be deterministic from `portfolio`.

- [ ] **Step 2: Create portfolio dashboard**

Implement portfolio exposure cards, risk heatmap, early warning alert list, sector/branch exposure table, dynamic credit limit changes, and links to `/portfolio/[msmeId]`.

- [ ] **Step 3: Create MSME drill-down**

Implement profile summary, risk timeline, early warning explanations, dynamic limit movement, and evidence references. Include a link from the drill-down to the related loan application when available.

- [ ] **Step 4: Add routes**

Create `app/portfolio/page.tsx` and `app/portfolio/[msmeId]/page.tsx`. Invalid IDs must call `notFound()`.

- [ ] **Step 5: Verify**

Run: `pnpm typecheck`

Expected: PASS.

Run: `pnpm build`

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```bash
git add app components features
git commit -m "feat: add portfolio intelligence and drilldowns"
```

Expected: commit succeeds, unless Git remains blocked by the Windows process-launch issue.

## Task 9: Final Polish, Responsive QA, And Documentation

**Files:**
- Modify: `app/globals.css`
- Modify: route and feature files as needed for text fit, spacing, and accessibility.
- Create: `README.md`

- [ ] **Step 1: Polish visual system**

Review all screens for enterprise density, spacing, risk color consistency, button labels, empty states, and responsive behavior. Avoid nested cards and decorative clutter.

- [ ] **Step 2: Add README**

Create `README.md` with project purpose, stack, commands, v1 scope, demo route sequence, and known prototype limitations.

- [ ] **Step 3: Run full verification**

Run: `pnpm typecheck`

Expected: PASS.

Run: `pnpm test`

Expected: PASS.

Run: `pnpm build`

Expected: PASS.

- [ ] **Step 4: Start dev server**

Run: `pnpm dev`

Expected: local Next.js server starts, usually at `http://localhost:3000`.

- [ ] **Step 5: Manually verify routes**

Open:

```text
http://localhost:3000/
http://localhost:3000/command-center
http://localhost:3000/applications
http://localhost:3000/applications/app-1001
http://localhost:3000/applications/app-1001/memo
http://localhost:3000/portfolio
http://localhost:3000/portfolio/msme-aurora
```

Expected: each route renders without console errors, text overlap, or broken navigation.

- [ ] **Step 6: Commit**

Run:

```bash
git add README.md app components features
git commit -m "chore: polish nexusnova prototype"
```

Expected: commit succeeds, unless Git remains blocked by the Windows process-launch issue.

## Self-Review

Spec coverage:

- Enterprise Shell is covered in Task 4.
- Loan Officer Workspace is covered in Tasks 5, 6, and 7.
- Portfolio Intelligence Layer is covered in Task 8.
- Intelligence and Decision Model is covered in Tasks 2 and 3.
- Final UX flow is covered by routes in Tasks 4 through 8.
- Error handling is covered by `app/not-found.tsx` and decision validation in Tasks 6 and 7.
- Testing and verification are covered in Tasks 3 and 9.

Placeholder scan:

- No `TBD`, `TODO`, or unresolved implementation placeholders remain.
- Settings and admin screens are explicitly excluded from v1.

Type consistency:

- Domain types are introduced before mock data and services.
- Service names in tests match the implementation names.
- Route IDs use `app-1001` and `msme-aurora` consistently.
