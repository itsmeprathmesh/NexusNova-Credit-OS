import Link from "next/link";
import { ArrowUpRight, Filter, Inbox, ClipboardList, Plus, Sparkles } from "lucide-react";
import { applications, msmes, portfolio } from "@/data/mock-data";
import type { UserRole } from "@/domain/types";
import { formatCurrency } from "@/lib/format";
import { Badge, Panel, RiskBadge } from "@/components/ui/primitives";

const filters = [
  { label: "Priority", values: ["All", "Urgent", "High", "Standard"] },
  { label: "Risk", values: ["All", "Low", "Medium", "High"] },
  { label: "Documents", values: ["Ready", "Review Needed", "Missing"] },
  { label: "Ticket Size", values: ["< 25L", "25L-50L", "> 50L"] },
  { label: "Branch", values: ["All", "Pune", "Mysuru", "Surat"] }
];

function getMsme(msmeId: string) {
  return msmes.find((item) => item.id === msmeId);
}

function getPortfolio(msmeId: string) {
  return portfolio.find((item) => item.msmeId === msmeId);
}

export function ApplicationQueue({ role }: { role: UserRole }) {
  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">Application Queue</p>
            <h2 className="mt-1 text-2xl font-semibold">MSME credit cases awaiting decision</h2>
          </div>
          <Badge tone="warning">{applications.length} active case</Badge>
        </div>
      </Panel>

      <Panel>
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink">
          <Filter className="h-4 w-4" />
          Filters
        </div>
        <div className="grid gap-4 lg:grid-cols-5">
          {filters.map((filter) => (
            <div key={filter.label}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{filter.label}</p>
              <div className="flex flex-wrap gap-2">
                {filter.values.map((value, index) => (
                  <button
                    key={value}
                    className={
                      index === 0
                        ? "rounded-md bg-trust px-3 py-1.5 text-xs font-semibold text-white"
                        : "rounded-md border border-line bg-white px-3 py-1.5 text-xs font-semibold text-muted"
                    }
                    type="button"
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Cases">
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Inbox className="mb-3 h-12 w-12 text-muted/30" />
            <p className="text-base font-semibold text-muted">No applications in queue</p>
            <p className="mt-1 text-sm text-muted/60">New MSME credit applications will appear here.</p>
          </div>
        ) : (
        <div className="overflow-hidden rounded-lg border border-line">
          <div className="hidden grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.6fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted lg:grid">
            <span>Borrower</span>
            <span>Request</span>
            <span>Priority</span>
            <span>Risk</span>
            <span>SLA</span>
          </div>
          <div className="divide-y divide-line">
            {applications.map((application) => {
              const msme = getMsme(application.msmeId);
              const portfolioItem = getPortfolio(application.msmeId);

              return (
                <Link
                  key={application.id}
                  href={`/applications/${application.id}?role=${role}`}
                  className="grid gap-3 px-4 py-4 transition hover:bg-slate-50 lg:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.6fr] lg:items-center"
                >
                  <div>
                    <p className="font-semibold">{msme?.name}</p>
                    <p className="text-sm text-muted">{msme?.sector} · {msme?.branch}</p>
                  </div>
                  <div>
                    <p className="font-semibold">{formatCurrency(application.requestedAmount)}</p>
                    <p className="text-sm text-muted">{application.product}</p>
                  </div>
                  <Badge tone={application.priority === "urgent" ? "warning" : "neutral"}>{application.priority}</Badge>
                  {portfolioItem ? <RiskBadge band={portfolioItem.riskBand} /> : <Badge>Unrated</Badge>}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">{application.slaHoursRemaining}h</span>
                    <ArrowUpRight className="h-4 w-4 text-trust" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        )}
      </Panel>
    </div>
  );
}
