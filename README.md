# NexusNova Credit Intelligence OS

> **IDBI Innovate 2026 — Problem Statement 3**  
> AI-assisted MSME lending workspace for loan officers and portfolio managers.

A banking-grade prototype demonstrating explainable AI credit scoring, document intelligence, fraud detection, portfolio risk analytics, credit committee simulation, and enterprise audit — all running in-browser with typed mock data and deterministic TypeScript services.

---

## Architecture

```
app/                  Next.js 15 App Router — routes per role
├── applications/     Loan officer workspace + credit memo + timeline
├── command-center/   Urgent cases, SLA alerts, exposure overview
├── portfolio/        Portfolio health, risk heatmap, MSME drilldown
├── reporting/        Executive dashboard + per-report detail views
├── customer/         Customer portal: login, apply, documents, support
├── audit/            Audit trail with role + action filters
└── page.tsx          Landing page with role selection + demo seed

components/
├── ui/               Primitives: Button, Panel, Badge, Metric, ProgressBar, Skeleton, EmptyState
├── ai/               AI experience: status badges, thinking animation, confidence, insights, timeline, recommendation
├── charts/           Enterprise charts: line/area/bar/donut/sector/heatmap/treemap/risk-matrix
└── layout/           AppShell with sidebar nav, search, notifications, user menu

features/             Feature-sliced modules per domain
├── loan-workspace/   Application workspace, credit committee, stress simulation, explainability, credit memo
├── portfolio/        Command center, heatmap, risk migration, sector intelligence, branch performance
├── reporting/        Executive dashboard, report detail with 9 report types
├── customer/         Customer dashboard, BANK AI support, readiness view, timeline
├── command-center/   Command center view with urgent/alert/exposure panels
├── audit/            Audit center with event log and filters
└── auth/             Role-based routing guards

services/             Pure TypeScript computation — no I/O, no external APIs
├── intelligence.ts           Financial health, repayment risk, fraud risk, AI readiness, recommendations, stress simulation
├── portfolio-intelligence.ts Portfolio health, sector/branch summaries, risk migration, early warnings
├── credit-committee.ts       Multi-persona committee: risk officer, business growth, compliance
├── customer-support.ts       BANK AI chatbot — readiness, eligibility, document guidance
├── app-data.ts               Session management, notifications, timeline stages, audit events
└── demo-seed.ts              Demo data seeder for quick-start exploration

domain/types.ts       All shared TypeScript types, interfaces, and loan product definitions

lib/                  Utilities: currency/percent formatting, classname merging, role parsing

data/                 Mock data sets: MSMEs, applications, documents, financial signals, portfolio
```

---

## Quick Start

```bash
# Install
pnpm install

# Development
pnpm dev

# Type checking
pnpm typecheck

# Tests
pnpm test

# Production build
pnpm build
```

Open [http://localhost:3000](http://localhost:3000) and click **Launch Demo Mode** to seed the full workflow.

---

## Demo Flow

| Step | Route | What to see |
|------|-------|-------------|
| Landing | `/` | Role selection cards, live portfolio metrics, demo seed |
| Command Center | `/command-center?role=loan-officer` | Urgent applications, SLA alerts, early warnings, portfolio exposure |
| Application Workspace | `/applications/app-1001?role=loan-officer` | AI analysis thinking, 5-metric confidence, recommendation card, explainability, credit committee, stress simulation, intelligence timeline |
| Credit Memo | `/applications/app-1001/memo` | Audit-ready memo with all AI evidence |
| Production Memo | `/applications/app-1001/production-memo` | 18-section production-grade credit memo |
| Decision Timeline | `/applications/app-1001/timeline` | Clickable stage-by-stage checkpoint viewer |
| Portfolio Dashboard | `/portfolio?role=manager` | Health score, risk heatmap, sector intelligence, risk migration, early warnings, credit limit monitor |
| MSME Drilldown | `/portfolio/msme-aurora?role=manager` | Customer summary, relationship timeline, risk timeline, loan history |
| Executive Dashboard | `/reporting/executive` | Full executive briefing with donut/treemap/sector/branch charts |
| Audit Trail | `/audit?role=manager` | Filterable event log with role and action filters |
| Customer Portal | `/customer/dashboard` | Application timeline, AI readiness, BANK AI support chatbot |

---

## Key Features

### AI Explainability
Every credit decision includes score, confidence %, risk band, observation & reasoning, evidence list (label + value + source + sentiment), positive and negative factors, and uncertainty notes.

### AI Credit Committee
Three personas (Risk Officer, Business Growth, Compliance) each produce independent recommendations with evidence, concerns, and suggested actions. Majority consensus drives the final AI recommendation.

### Enterprise Visualizations
- Animated line/area charts with gradient fills and active dots
- Stacked bar charts for risk migration
- Donut charts for risk distribution and AI confidence
- Sector comparison charts (horizontal bars)
- Risk matrix (3×3 likelihood × impact grid)
- Exposure treemap (proportional flex tiles)
- Portfolio heatmap (risk-colored card grid)

### Accessibility
- Skip-to-content link, semantic landmark regions (`<nav>`, `<aside>`, `<main>`, `<section>`)
- `aria-current="page"`, `aria-label`, `aria-labelledby`, `role="status"`, `role="progressbar"`
- Screen-reader-only utilities, `@media (prefers-reduced-motion)` support
- Keyboard-accessible with visible focus rings

### Error Handling
- `error.tsx` boundaries at every route segment with error ID display and retry
- `loading.tsx` skeleton screens at every route segment
- Skeleton shimmer components for cards, tables, charts, metrics, dashboards

---

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start development server on port 3000 |
| `pnpm build` | Production build with type checking |
| `pnpm start` | Start production server |
| `pnpm lint` | ESLint check |
| `pnpm typecheck` | TypeScript type check (`tsc --noEmit`) |
| `pnpm test` | Run Vitest test suite |

---

## Technologies

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router, React 19) |
| Language | TypeScript 5.7 (strict mode) |
| Styling | Tailwind CSS 3.4 with custom design tokens |
| Charts | Recharts 2.15 with custom enterprise wrappers |
| Animations | Framer Motion 11 |
| Icons | Lucide React |
| Testing | Vitest |
| Package Manager | pnpm |

---

## V1 Scope & Constraints

The prototype uses **typed mock data** and **deterministic TypeScript services**. It does **not** call:

- Live OCR or document parsing
- External AI/ML models or APIs
- Database or ORM (no Prisma, no PostgreSQL)
- Authentication or session persistence
- PDF generation or email dispatch

All data is in-memory and resets on page reload. The architecture is designed so that these integrations can be added behind the existing service interfaces without UI changes.

---

## Deployment

```bash
pnpm build
pnpm start
```

The output in `.next/` is a standard Next.js production build. Deploy to any Node.js 18+ host:

- **Vercel** — zero-config, recommended for Next.js
- **Docker** — multi-stage Node.js image
- **Any Node.js server** — `pnpm start` runs the built server

### Environment Variables

None required for the demo build. For production, configure:

```env
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Future integrations (not yet consumed)
DATABASE_URL=
OCR_SERVICE_URL=
AI_API_KEY=
```

---

## Developer Guide

### Project Conventions

- **Server components by default** — only add `"use client"` when browser APIs or interactivity are required
- **Feature-sliced modules** under `features/` — each domain owns its presentation, no cross-feature coupling
- **UI primitives** in `components/ui/` — presentational only, no business logic
- **AI experience** in `components/ai/` — reusable AI-facing wrappers
- **Charts** in `components/charts/` — all recharts wrappers with dynamic imports
- **Services** are pure functions — no side effects, no I/O, fully testable
- **Types** in `domain/types.ts` — single source of truth shared across services and components

### Adding a New Route

1. Create file under `app/<route>/page.tsx` (server component for data fetching)
2. Render a feature component from `features/<domain>/`
3. Add nav item in `components/layout/app-shell.tsx`
4. Add `loading.tsx` and `error.tsx` for the route segment

### Adding a New Chart

1. Add the recharts wrapper to `components/charts/`
2. Export from `components/charts/index.tsx`
3. Heavy chart components are automatically code-split via `next/dynamic`

---

## Testing

```bash
pnpm test          # Run all tests
pnpm test --watch  # Watch mode
```

Tests live in `*.test.ts` files alongside their services. Current coverage:
- `services/intelligence.test.ts` — 9 tests covering financial health, repayment risk, fraud risk, dynamic limits, stress scenarios, and loan recommendations
- `services/customer-support.test.ts` — 3 tests covering customer readiness and BANK AI question answering

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make changes, ensuring `pnpm typecheck`, `pnpm test`, and `pnpm build` pass
4. Commit with a descriptive message
5. Open a pull request

### Commit Conventions

- `feat:` — new feature or enhancement
- `fix:` — bug fix
- `docs:` — documentation changes
- `refactor:` — code restructuring without feature changes
- `perf:` — performance improvement
- `a11y:` — accessibility improvement

---

## License

Bank-confidential prototype. IDBI Bank Innovate 2026 — Problem Statement 3.
