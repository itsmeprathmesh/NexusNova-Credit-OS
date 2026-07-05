# Customer Portal, Mobile UI, And BANK AI Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand NexusNova from an officer/manager prototype into a mobile-first banking prototype with separate customer, loan officer, and manager login paths plus a customer portal and BANK AI Business Support.

**Architecture:** Add customer-specific mock data and deterministic support helpers, then build customer routes with a mobile-first shell. Reuse existing domain, formatting, and UI primitives where possible, while keeping customer-facing screens separate from officer/manager dashboards.

**Tech Stack:** Next.js 15, React, TypeScript, Tailwind CSS, lucide-react, Vitest.

---

## Files

- Create `services/customer-support.ts`: deterministic readiness scoring and BANK AI response helpers.
- Create `services/customer-support.test.ts`: unit tests for customer readiness and support answers.
- Create `components/layout/customer-shell.tsx`: mobile-first customer portal shell with bottom nav.
- Create `features/customer/customer-auth.tsx`: customer login/register screens.
- Create `features/customer/customer-dashboard.tsx`: customer home, readiness, task summary.
- Create `features/customer/business-registration.tsx`: business registration form.
- Create `features/customer/loan-application-form.tsx`: customer loan request form.
- Create `features/customer/document-center.tsx`: document upload simulation.
- Create `features/customer/application-status.tsx`: status tracker and bank tasks.
- Create `features/customer/bank-ai-support.tsx`: simulated AI assistant UI.
- Create `features/auth/staff-login.tsx`: loan officer and manager login screens.
- Create customer and staff routes under `app/customer/*`, `app/officer/login`, and `app/manager/login`.
- Modify `app/page.tsx`: mobile-first gateway to customer, officer, and manager login.
- Modify `components/layout/app-shell.tsx`: add mobile bottom nav for staff dashboards.
- Modify `README.md`: document customer portal and AI support routes.

## Tasks

- [ ] Add failing tests for customer readiness and BANK AI support helper behavior.
- [ ] Implement `services/customer-support.ts` until tests pass.
- [ ] Add customer shell and customer feature components.
- [ ] Add customer routes: login, register, dashboard, business, apply, documents, status, support.
- [ ] Add staff login routes and update root gateway.
- [ ] Improve staff shell mobile navigation and spacing.
- [ ] Update README route list.
- [ ] Run `pnpm typecheck`, `pnpm test`, `pnpm build`, and route smoke checks through a clean path because the workspace folder contains `#`.

## Acceptance

- Customer can navigate from login/register to dashboard, business registration, loan application, documents, status, and BANK AI Business Support.
- Loan Officer and Manager have separate login pages.
- Mobile layout has touch-friendly cards, bottom navigation, and no desktop-only dependency for core flows.
- BANK AI Business Support gives deterministic guidance for missing documents, eligibility, review status, GST mismatch, and likely loan amount.
- Existing officer/manager routes still typecheck and build.
