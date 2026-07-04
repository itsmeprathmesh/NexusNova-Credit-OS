# NexusNova Credit Intelligence OS v1 Design

## Context

NexusNova Credit Intelligence OS is a banking-grade prototype for IDBI Innovate 2026 PS-3: Financial Health Score for MSMEs. The product is not a simple score calculator. It is an AI-assisted lending intelligence workspace that helps bank officers evaluate MSME loan applications with explainable evidence, fraud signals, repayment risk, human approval controls, and portfolio monitoring.

The v1 prototype will be built as a fresh Next.js application in the current folder. It will use realistic mock data and deterministic TypeScript services rather than a live database or real AI calls. The code structure must still look credible for future Prisma, PostgreSQL, OCR, and OpenAI integrations.

## V1 Product Scope

V1 has three product areas.

### Enterprise Shell

The shell provides simulated role-based access for a Loan Officer and Manager. It includes role-aware navigation, command-center landing, notifications, and an audit-conscious enterprise layout. The goal is to make the app feel like deployable banking software rather than isolated demo screens.

### Loan Officer Workspace

The loan officer opens one MSME loan application from a queue, reviews simulated document and OCR results, sees AI-generated financial health intelligence, checks fraud and repayment risk, reviews explainable evidence, stress-tests scenarios, and makes an approval, rejection, document request, reduction, or escalation decision.

### Portfolio Intelligence Layer

The manager reviews many MSMEs through portfolio risk analytics. The layer includes risk heatmaps, early warning alerts, sector and branch exposure, dynamic credit limit signals, and interactive drill-down into each MSME profile and risk timeline.

Out of scope for v1: real authentication, real document OCR, real database persistence, real OpenAI calls, production PDF export, payments, borrower-facing portals, and full admin controls.

## Users

Primary user: Loan Officer.

Secondary users: Relationship Manager, Credit Manager, Branch Manager, Risk Team, Credit Committee, and Senior Management.

V1 will simulate Loan Officer and Manager roles. The same domain data will support both roles so the demo can show how an individual credit decision affects portfolio monitoring.

## Final UX Flow

1. Role Login
   The user selects Loan Officer or Manager.

2. Command Center
   After login, the user sees today's work: urgent loan applications, early warning alerts, SLA breaches, portfolio exposure, and AI-ready cases.

3. Application Queue
   The loan officer filters MSME applications by priority, risk, document readiness, ticket size, and branch.

4. Application Intake
   The officer opens one MSME loan case and reviews business identity, loan request, owner and KYC summary, sector, branch, existing relationship, and the decision required.

5. Document Intelligence
   Simulated document upload and OCR status appears for GST returns, bank statements, Udyam, PAN, ITR, and financial statements. The UI shows extracted fields, OCR confidence, missing documents, mismatches, stale data, and tamper indicators.

6. Alternative Data Intelligence
   The officer reviews GST trend, UPI and cash-flow signals, revenue seasonality, customer concentration, repayment behavior proxies, and business stability indicators.

7. Credit Intelligence Summary
   The app presents financial health score, repayment risk, fraud risk, confidence score, business growth forecast, cash-flow forecast, recommended loan amount, and dynamic credit limit.

8. Explainability Workbench
   Every AI conclusion shows reason, evidence, positive factors, negative factors, uncertainty, and what would change the recommendation.

9. Loan Stress Simulator
   The officer tests scenarios such as lower revenue, delayed receivables, higher EMI burden, or seasonal dip. The recommendation and risk level respond deterministically.

10. Human Decision Workflow
   The officer can approve, reject, request documents, reduce the amount, or escalate. Any override of the AI recommendation requires officer rationale.

11. Credit Memo and Audit Trail
   The app shows a credit memo preview with evidence, recommendation, officer decision, override reason, timeline, and audit log.

12. Portfolio Intelligence
   The manager reviews all MSMEs with risk heatmaps, early warning alerts, sector and branch exposure, dynamic credit limit changes, and drill-down into each MSME risk timeline.

## Architecture

The app will use Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui-style components, Framer Motion where useful, Recharts for analytics, and local deterministic services for v1 intelligence.

The architecture will be feature-first:

- `app/`: Next.js routes, layouts, and route groups.
- `features/auth/`: simulated role selection and session state.
- `features/command-center/`: role-aware landing and summary views.
- `features/loan-workspace/`: queue, case workspace, document review, credit intelligence, stress simulator, decision workflow, and memo preview.
- `features/portfolio/`: portfolio dashboard, heatmaps, alerts, dynamic limits, and MSME drill-downs.
- `domain/`: shared banking types for MSMEs, applications, documents, scores, risk alerts, recommendations, audit events, and decisions.
- `services/`: OCR simulation, validation checks, financial health scoring, fraud detection, repayment risk, dynamic credit limits, stress simulation, and explainability generation.
- `data/`: realistic mock applications, MSMEs, documents, transactions, GST summaries, UPI summaries, and risk events.
- `components/`: reusable layout, navigation, data display, forms, indicators, timelines, and chart primitives.
- `lib/`: formatting, currency helpers, status mapping, class utilities, and shared constants.

The project will start with mock repositories and pure TypeScript services. The UI will consume typed view models so Prisma and PostgreSQL can replace mock repositories later with limited UI changes.

## Intelligence And Decision Model

The intelligence layer is the product core. It produces structured decision objects rather than opaque text.

### Financial Health Score

The score combines cash-flow consistency, GST turnover trend, UPI inflow stability, revenue growth, margin proxy, debt burden, account conduct, seasonality, and business age. The output includes score, rating band, confidence, primary drivers, and evidence references.

### Repayment Risk

Repayment risk uses EMI coverage, monthly cash-flow volatility, delayed receivables, seasonal dips, failed transactions, existing obligations, customer concentration, and recent decline signals. The output includes low, medium, high, or critical risk with reason and mitigation notes.

### Fraud Intelligence

Fraud checks flag PAN, GST, Udyam, and bank-statement inconsistencies; stale documents; suspicious revenue spikes; invoice anomalies; duplicate contact or bank details; document confidence issues; and mismatches between declared and observed turnover.

### Loan Recommendation

The recommendation returns approve, reduce amount, reject, request documents, or escalate. It includes recommended amount, dynamic credit limit range, tenure suggestion, confidence, conditions, required mitigants, and human-readable rationale.

### Dynamic Credit Limit

The limit calculation estimates a safe working-capital range from observed inflows, monthly volatility, sector risk, repayment capacity, stress-tested cash flow, and existing exposure. The portfolio layer will show limit increases, reductions, and watchlist changes.

### Early Warning Signals

Early warning signals identify deteriorating GST filings, revenue drop, cash-flow compression, rising customer concentration, frequent failed transactions, exposure drift, and sector or branch risk migration.

### Explainability Object

Every AI output includes reason, evidence, confidence, positive factors, negative factors, uncertainty, suggested action, and what would change the recommendation. This prevents a black-box AI experience and supports audit review.

### Human Override Model

The AI never makes the final decision. Officer decisions preserve the AI recommendation at decision time, officer action, officer rationale, timestamp, role, and audit event. Overrides are visible in the memo preview and audit trail.

## Data Model

V1 will define TypeScript domain models for:

- User role and simulated session.
- MSME profile: identity, sector, branch, owner, KYC identifiers, business age, relationship history.
- Loan application: requested amount, product type, priority, SLA, status, purpose, and decision state.
- Document: type, status, OCR confidence, extracted fields, validation checks, and issues.
- Financial signals: GST trend, UPI inflow, bank statement summary, revenue seasonality, customer concentration, and obligations.
- Scores: financial health, repayment risk, fraud risk, confidence, growth forecast, and cash-flow forecast.
- Recommendation: action, amount, tenure, conditions, mitigants, confidence, and rationale.
- Portfolio item: exposure, risk band, early warnings, sector, branch, and dynamic credit limit delta.
- Audit event: actor, action, timestamp, rationale, source, and linked evidence.

These models will be shaped so they can later map cleanly to Prisma tables.

## Routes

Expected v1 routes:

- `/`: role login or redirect to command center.
- `/command-center`: role-aware daily work summary.
- `/applications`: loan application queue.
- `/applications/[id]`: MSME loan officer workspace.
- `/applications/[id]/memo`: credit memo preview.
- `/portfolio`: portfolio intelligence dashboard.
- `/portfolio/[msmeId]`: portfolio drill-down and MSME risk timeline.

Settings and admin screens are excluded from v1.

## UI Principles

The UI should feel like modern enterprise banking software: premium, restrained, data-dense, accessible, and trustworthy. It should avoid generic dashboard clutter and unnecessary cards. The product should use clear typography, meaningful visual hierarchy, stable spacing, responsive layouts, and compact but readable controls.

Charts and indicators must answer banking questions, not decorate the page. Risk colors should be used consistently and sparingly. Important AI claims must always have visible evidence or a path to evidence.

## Error Handling And States

V1 will include practical UI states even with mock data:

- Empty application queue.
- Missing document status.
- Low OCR confidence warning.
- Validation mismatch warning.
- No portfolio alerts.
- Decision form validation when override rationale is missing.
- Loading skeletons where route transitions or panels need polish.
- Not-found handling for invalid application or MSME IDs.

## Security And Compliance Considerations

V1 is a prototype, but the design must reflect bank deployment expectations:

- No AI-only approval. Human decision remains mandatory.
- Every recommendation is explainable and auditable.
- Officer overrides require rationale.
- Sensitive data is treated as bank-confidential in labels and UI copy.
- Future production version must include authentication, RBAC, encryption at rest, encryption in transit, audit log immutability, data retention policy, consent handling, model monitoring, and RBI-aligned governance.
- The prototype should avoid claiming regulatory approval or deterministic lending eligibility.

## Testing Strategy

Initial verification will include:

- TypeScript type check.
- Lint/build verification.
- Unit tests for deterministic intelligence services after the test runner is available in the scaffold.
- Manual route checks for main flows.
- Browser verification for desktop and mobile layouts after the UI is implemented.
- Basic accessibility checks for labels, contrast, keyboard navigation, and responsive text fit.

The highest-risk logic is the intelligence layer, so scoring and recommendation services should be written as pure functions that are easy to test.

## Demo Strategy

The judge-facing demo should follow a crisp story:

1. Start in the Command Center to show operational value.
2. Open a high-priority MSME application.
3. Show document intelligence and validation problems.
4. Show alternative data intelligence that reveals business health beyond traditional credit history.
5. Explain the AI recommendation through evidence and uncertainty.
6. Run a stress scenario to prove the system supports judgment, not blind automation.
7. Make a human decision and show the audit trail plus memo preview.
8. Switch to portfolio intelligence to show early warning, dynamic limits, and drill-down.

This story connects the core problem, the AI innovation, bank trust, compliance posture, and operational efficiency.

## Future Improvements

After v1, the project can add Prisma and PostgreSQL, real authentication, uploaded document storage, OCR integration, OpenAI Responses API for narrative explanations, PDF generation, role-specific approvals, notifications, model governance screens, and production audit logging.

## Acceptance Criteria

- A fresh Next.js app exists in the workspace.
- The app supports role selection for Loan Officer and Manager.
- Loan Officer can navigate from command center to application queue to one MSME workspace.
- The workspace includes document intelligence, alternative data, credit intelligence, explainability, stress simulation, decision workflow, audit trail, and memo preview.
- Manager can navigate to portfolio intelligence, risk heatmap, early warnings, dynamic limits, and MSME drill-down.
- Intelligence outputs are deterministic, typed, and evidence-backed.
- UI is responsive, accessible, and visually credible as enterprise banking software.
- The app builds successfully.
