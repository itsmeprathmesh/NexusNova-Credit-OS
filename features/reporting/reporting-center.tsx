"use client";

import Link from "next/link";
import { BarChart3, FileText, LayoutDashboard, ShieldCheck, TrendingUp, Users } from "lucide-react";
import type { ReportDefinition } from "@/domain/types";
import { Badge, Panel } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const reportConfig: ReportDefinition[] = [
  { id: "portfolio-health", title: "Portfolio Health Report", description: "Overall portfolio risk score, exposure, watchlist count, and limit movement across all MSMEs.", category: "portfolio", icon: "bar-chart", sections: ["Overall Score", "Exposure Breakdown", "Risk Distribution", "Watchlist Analysis", "Limit Movement"] },
  { id: "sector-analysis", title: "Sector Intelligence Brief", description: "Sector-wise exposure, dominant risk band, early warning count, and limit delta.", category: "portfolio", icon: "trending", sections: ["Sector Exposure", "Risk by Sector", "Sector Trends", "Concentration Risk"] },
  { id: "branch-performance", title: "Branch Performance Review", description: "Per-branch exposure, MSME count, risk distribution, and limit utilization.", category: "portfolio", icon: "users", sections: ["Branch Summary", "Risk Distribution by Branch", "Limit Utilization", "Branch Rankings"] },
  { id: "risk-migration", title: "Risk Migration Timeline", description: "Period-over-period movement of MSMEs across risk bands with event counts.", category: "risk", icon: "trending", sections: ["Risk Migration", "Band Transitions", "Event Correlation"] },
  { id: "credit-committee-summary", title: "Credit Committee Summary", description: "Summary of all AI Credit Committee analyses, persona votes, and consensus outcomes.", category: "credit", icon: "file-text", sections: ["Committee Overview", "Persona Vote Breakdown", "Conditions Summary", "Decision Consistency"] },
  { id: "early-warning", title: "Early Warning Report", description: "Active early warnings across the portfolio with MSME, branch, and sector context.", category: "risk", icon: "shield", sections: ["Active Warnings", "Warning by Branch", "Warning by Sector", "Trend Analysis"] },
  { id: "limit-utilization", title: "Credit Limit Utilization", description: "Dynamic credit limit expansion and contraction across the portfolio with utilization rates.", category: "portfolio", icon: "bar-chart", sections: ["Limit Overview", "Expansion vs Contraction", "Utilization by MSME", "Headroom Analysis"] },
  { id: "ai-readiness", title: "AI Readiness Summary", description: "AI readiness scores, blocked applications, and review items across all applications.", category: "compliance", icon: "shield", sections: ["Readiness Overview", "Blocked Applications", "Review Items", "Confidence Distribution"] },
  { id: "executive-brief", title: "Executive Credit Brief", description: "Executive-level summary of portfolio health, committee activity, and key risk metrics.", category: "executive", icon: "layout-dashboard", sections: ["Executive Summary", "Key Metrics", "Risk Overview", "Activity Summary"] }
];

const categoryColors: Record<string, string> = {
  portfolio: "border-sky-200 bg-sky-50 text-sky-800",
  credit: "border-emerald-200 bg-emerald-50 text-emerald-700",
  risk: "border-amber-200 bg-amber-50 text-amber-800",
  compliance: "border-purple-200 bg-purple-50 text-purple-800",
  executive: "border-slate-200 bg-slate-50 text-slate-700"
};

const iconMap: Record<string, typeof BarChart3> = {
  "bar-chart": BarChart3,
  trending: TrendingUp,
  users: Users,
  "file-text": FileText,
  shield: ShieldCheck,
  "layout-dashboard": LayoutDashboard
};

export function ReportingCenter() {
  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-trust" />
              <p className="text-sm font-semibold uppercase tracking-wide text-muted">Enterprise Reporting</p>
            </div>
            <h2 className="mt-1 text-2xl font-semibold">Reporting Center</h2>
            <p className="mt-2 text-sm text-muted">
              {reportConfig.length} pre-built reports available for download and review
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/reporting/executive" className="rounded-md bg-trust px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1a526a]">
              Executive Dashboard
            </Link>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reportConfig.map((report) => {
          const Icon = iconMap[report.icon] || FileText;
          return (
            <Link key={report.id} href={`/reporting/${report.id}`} className="block">
              <Panel className="h-full cursor-pointer transition hover:border-trust/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/[0.06] text-trust">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge className={cn("shrink-0", categoryColors[report.category])}>
                    {report.category}
                  </Badge>
                </div>
                <h3 className="mt-4 font-semibold">{report.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{report.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {report.sections.map((section) => (
                    <span key={section} className="rounded-md border border-line bg-white/[0.04] px-2 py-0.5 text-xs text-muted">
                      {section}
                    </span>
                  ))}
                </div>
              </Panel>
            </Link>
          );
        })}
      </div>

      <Panel title="Export Options">
        <div className="grid gap-4 sm:grid-cols-3">
          {["Portfolio Export (PDF)", "Report Package (ZIP)", "Data Extract (CSV)"].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => alert(`[NexusNova] Export initiated: ${label}. In production, this would download the file.`)}
              className="rounded-lg border border-line bg-white/[0.04] px-4 py-3 text-sm font-semibold text-trust transition hover:bg-trust hover:text-white"
            >
              {label}
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
}
