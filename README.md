# NexusNova Credit Intelligence OS

NexusNova Credit Intelligence OS is a Next.js prototype for IDBI Innovate 2026 PS-3. It demonstrates an AI-assisted MSME lending workspace with explainable financial health scoring, document intelligence, repayment and fraud risk, human approval controls, and portfolio monitoring.

## Stack

- Next.js 15 and React 19
- TypeScript
- Tailwind CSS
- Recharts
- lucide-react
- Vitest

## Commands

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm build
```

## Demo Flow

1. `/` - select Loan Officer or Manager role.
2. `/command-center` - review urgent cases, SLA alerts, early warnings, and exposure.
3. `/applications` - inspect the MSME application queue.
4. `/applications/app-1001` - review Aurora Precision Tools in the loan officer workspace.
5. `/applications/app-1001/memo` - preview the credit memo and audit-ready evidence.
6. `/portfolio` - review portfolio risk, exposure, early warnings, and dynamic limit movement.
7. `/portfolio/msme-aurora` - drill into Aurora Precision Tools risk history and evidence.

## V1 Scope

The prototype uses typed mock data and deterministic TypeScript services. It does not call live OCR, AI, database, authentication, or PDF generation services. The intent is to show credible product flow, explainability, and audit posture while keeping future seams clean for Prisma, PostgreSQL, OCR, and OpenAI integrations.

## Known Limitations

- Role selection is simulated through route query parameters.
- Documents and financial signals are mock data.
- Stress simulation and recommendations are deterministic, not model-generated.
- Officer decisions are shown locally in the UI and are not persisted.
- The project directory currently contains a `#` character, which can break Vite and Next production builds on Windows. Rename or mirror the folder to a path without `#` for full local build/test verification.
