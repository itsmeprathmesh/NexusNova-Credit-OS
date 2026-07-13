"use client";

import { useMemo, useState } from "react";
import { Clock, Filter, Search, ShieldCheck } from "lucide-react";
import type { AuditEvent, AuditFilter, UserRole } from "@/domain/types";
import { getAuditEvents } from "@/services/app-data";
import { Badge, Panel } from "@/components/ui/primitives";

const roleBadge: Record<UserRole, "info" | "warning"> = {
  "loan-officer": "info",
  manager: "warning"
};

const allActions = ["Application reviewed", "Committee consensus generated", "Decision recorded", "Oversight review completed", "Fraud re-screening triggered", "Sanction letter generated", "Portfolio limit rebalancing"];

export function AuditCenter() {
  const allEvents = useMemo(() => getAuditEvents(), []);
  const [filter, setFilter] = useState<AuditFilter>({ roles: ["loan-officer", "manager"], actions: [], fromDate: null, toDate: null, search: "" });

  const uniqueActors = useMemo(() => [...new Set(allEvents.map((e) => e.actor))], [allEvents]);

  const filtered = useMemo(() => {
    return allEvents.filter((event) => {
      if (filter.roles.length > 0 && !filter.roles.includes(event.role)) return false;
      if (filter.actions.length > 0 && !filter.actions.includes(event.action)) return false;
      if (filter.search && !event.actor.toLowerCase().includes(filter.search.toLowerCase()) && !event.action.toLowerCase().includes(filter.search.toLowerCase()) && !event.rationale.toLowerCase().includes(filter.search.toLowerCase())) return false;
      if (filter.fromDate && new Date(event.timestamp) < new Date(filter.fromDate)) return false;
      if (filter.toDate && new Date(event.timestamp) > new Date(filter.toDate)) return false;
      return true;
    });
  }, [allEvents, filter]);

  const toggleRole = (role: UserRole) => {
    setFilter((prev) => ({
      ...prev,
      roles: prev.roles.includes(role) ? prev.roles.filter((r) => r !== role) : [...prev.roles, role]
    }));
  };

  const toggleAction = (action: string) => {
    setFilter((prev) => ({
      ...prev,
      actions: prev.actions.includes(action) ? prev.actions.filter((a) => a !== action) : [...prev.actions, action]
    }));
  };

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-trust" />
              <p className="text-sm font-semibold uppercase tracking-wide text-muted">Enterprise Audit Trail</p>
            </div>
            <h2 className="mt-1 text-2xl font-semibold">Audit Center</h2>
            <p className="mt-2 text-sm text-muted">
              {filtered.length} of {allEvents.length} events displayed
            </p>
          </div>
          <Badge tone="info">Live · immutable record</Badge>
        </div>
      </Panel>

      <Panel title="Filters">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              className="min-h-11 w-full rounded-lg border border-line bg-white/[0.04] pl-10 pr-3 text-sm text-ink outline-none focus:border-trust"
              placeholder="Search actors, actions, rationale..."
              aria-label="Search audit events"
              value={filter.search}
              onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Role</p>
              <div className="flex flex-wrap gap-2">
                {(["loan-officer", "manager"] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition active:scale-[0.97] ${
                      filter.roles.includes(role) ? "border-trust bg-trust/10 text-trust" : "border-line bg-white/[0.04] text-muted hover:bg-white/[0.08]"
                    }`}
                  >
                    {role === "loan-officer" ? "Loan Officer" : "Manager"}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Action Type</p>
              <div className="flex flex-wrap gap-2">
                {allActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => toggleAction(action)}
                    className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition active:scale-[0.97] ${
                      filter.actions.includes(action) ? "border-trust bg-trust/10 text-trust" : "border-line bg-white/[0.04] text-muted hover:bg-white/[0.08]"
                    }`}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <div className="space-y-3">
        {filtered.map((event) => (
          <AuditEventRow key={event.id} event={event} />
        ))}
        {filtered.length === 0 && (
          <Panel>
            <p className="text-center text-sm text-muted">No audit events match the current filters.</p>
          </Panel>
        )}
      </div>
    </div>
  );
}

function AuditEventRow({ event }: { event: AuditEvent }) {
  const [expanded, setExpanded] = useState(false);
  const ts = new Date(event.timestamp);
  const dateStr = ts.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const timeStr = ts.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <Panel className="cursor-pointer transition hover:border-trust/30" onClick={() => setExpanded(!expanded)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.06]">
            <Clock className="h-4 w-4 text-muted" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">{event.action}</p>
              <Badge tone={roleBadge[event.role]}>{event.role === "loan-officer" ? "Officer" : "Manager"}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted">
              {event.actor} · {dateStr} · {timeStr}
            </p>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="mt-4 rounded-lg border border-line bg-white/[0.04] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Rationale</p>
          <p className="mt-2 text-sm leading-6 text-ink">{event.rationale}</p>
          <div className="mt-3 grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="font-semibold text-muted">Event ID</span>
              <p className="mt-1 font-mono text-ink">{event.id}</p>
            </div>
            <div>
              <span className="font-semibold text-muted">Actor</span>
              <p className="mt-1 text-ink">{event.actor}</p>
            </div>
            <div>
              <span className="font-semibold text-muted">Role</span>
              <p className="mt-1 text-ink">{event.role === "loan-officer" ? "Loan Officer" : "Manager"}</p>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}
