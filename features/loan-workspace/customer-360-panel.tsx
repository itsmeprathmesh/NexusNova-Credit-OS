"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Pin, UserRound } from "lucide-react";
import type { Customer360Snapshot, MsmeProfile, PortfolioItem, UserRole } from "@/domain/types";
import { formatCurrency } from "@/lib/format";
import { Badge, Metric, Panel, RiskBadge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { RelationshipTimeline } from "./relationship-timeline";

const tabs = [
  { id: "summary", label: "Summary" },
  { id: "timeline", label: "Timeline" },
  { id: "credit", label: "Credit" },
  { id: "notes", label: "Notes" }
] as const;

type Customer360Tab = (typeof tabs)[number]["id"];

function loanStatusTone(status: "active" | "closed" | "watchlist") {
  if (status === "active") return "success";
  if (status === "watchlist") return "warning";
  return "neutral";
}

export function Customer360Panel({
  msme,
  portfolioItem,
  snapshot,
  role
}: {
  msme: MsmeProfile;
  portfolioItem: PortfolioItem;
  snapshot: Customer360Snapshot;
  role: UserRole;
}) {
  const [activeTab, setActiveTab] = useState<Customer360Tab>("summary");
  const activeLoans = snapshot.loanHistory.filter((loan) => loan.status === "active");
  const totalOutstanding = snapshot.loanHistory.reduce((sum, loan) => sum + loan.outstanding, 0);
  const pinnedNotes = snapshot.crmNotes.filter((note) => note.pinned);
  const otherNotes = snapshot.crmNotes.filter((note) => !note.pinned);

  return (
    <aside className="xl:sticky xl:top-24 xl:self-start">
      <Panel
        title="Customer 360"
        action={
          <Link
            href={`/portfolio/${msme.id}?role=${role}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-trust"
          >
            Portfolio
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        }
        className="overflow-hidden"
      >
        <div className="mb-4 flex items-start gap-3 border-b border-line pb-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-100 text-trust">
            <UserRound className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">{msme.name}</p>
            <p className="mt-0.5 text-xs text-muted">
              {msme.owner} · {msme.sector}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <RiskBadge band={portfolioItem.riskBand} />
              <Badge tone="info">{msme.relationshipYears}y relationship</Badge>
            </div>
          </div>
        </div>

        <nav className="mb-4 flex gap-1 overflow-x-auto border-b border-line pb-px" aria-label="Customer 360 sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "shrink-0 border-b-2 px-3 py-2 text-xs font-semibold transition",
                activeTab === tab.id
                  ? "border-trust text-trust"
                  : "border-transparent text-muted hover:text-ink"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "summary" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Exposure" value={formatCurrency(portfolioItem.exposure)} />
              <Metric label="Outstanding" value={formatCurrency(totalOutstanding)} />
            </div>
            <div className="rounded-lg border border-line bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Relationship Manager</p>
              <p className="mt-2 font-semibold text-ink">{snapshot.relationshipManager.name}</p>
              <p className="mt-1 text-xs text-muted">
                {snapshot.relationshipManager.employeeId} · {snapshot.relationshipManager.branch}
              </p>
              <p className="mt-1 text-xs text-muted">{snapshot.relationshipManager.phone}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted">Active facilities</span>
                <span className="font-semibold">{activeLoans.length}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted">Prior decisions</span>
                <span className="font-semibold">{snapshot.previousDecisions.length}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted">Limit delta</span>
                <span className={portfolioItem.dynamicLimitDelta >= 0 ? "font-semibold text-growth" : "font-semibold text-danger"}>
                  {portfolioItem.dynamicLimitDelta >= 0 ? "+" : ""}
                  {formatCurrency(portfolioItem.dynamicLimitDelta)}
                </span>
              </div>
            </div>
            {portfolioItem.earlyWarnings.length > 0 ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Active alert</p>
                <p className="mt-2 text-sm text-amber-900">{portfolioItem.earlyWarnings[0]}</p>
              </div>
            ) : null}
          </div>
        ) : null}

        {activeTab === "timeline" ? <RelationshipTimeline events={snapshot.timeline} compact /> : null}

        {activeTab === "credit" ? (
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Loan history</p>
              <div className="space-y-2">
                {snapshot.loanHistory.map((loan) => (
                  <div key={loan.id} className="rounded-lg border border-line p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold">{loan.product}</p>
                      <Badge tone={loanStatusTone(loan.status)}>{loan.status}</Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted">
                      Sanctioned {formatCurrency(loan.sanctionedAmount)} · Outstanding {formatCurrency(loan.outstanding)}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {loan.sanctionedDate} · {loan.tenureMonths} months
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Previous decisions</p>
              <div className="space-y-2">
                {snapshot.previousDecisions.map((decision) => (
                  <div key={decision.id} className="rounded-lg border border-line p-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone="info">{decision.action}</Badge>
                      <span className="text-xs text-muted">{decision.date}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold">{formatCurrency(decision.amount)}</p>
                    <p className="mt-1 text-xs text-muted">
                      {decision.officer} · AI: {decision.aiRecommendation}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-muted">{decision.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "notes" ? (
          <div className="space-y-3">
            {pinnedNotes.map((note) => (
              <div key={note.id} className="rounded-lg border border-trust/20 bg-sky-50/50 p-3">
                <div className="flex items-center gap-2">
                  <Pin className="h-3.5 w-3.5 text-trust" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-trust">Pinned</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-ink">{note.content}</p>
                <p className="mt-2 text-xs text-muted">
                  {note.author} · {note.role} · {note.date}
                </p>
              </div>
            ))}
            {otherNotes.map((note) => (
              <div key={note.id} className="rounded-lg border border-line p-3">
                <p className="text-sm leading-6 text-ink">{note.content}</p>
                <p className="mt-2 text-xs text-muted">
                  {note.author} · {note.role} · {note.date}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </Panel>
    </aside>
  );
}
