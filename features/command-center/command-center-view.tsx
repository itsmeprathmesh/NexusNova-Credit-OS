import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Clock, IndianRupee, Sparkles, Eye } from "lucide-react";
import { applications, msmes, portfolio, financialSignals } from "@/data/mock-data";
import type { UserRole } from "@/domain/types";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import { Badge, Metric, Panel, RiskBadge } from "@/components/ui/primitives";
import { AIBadge } from "@/components/ai/ai-status";
import { ConfidenceIndicators } from "@/components/ai/confidence-indicator";
import { computePortfolioHealth } from "@/services/portfolio-intelligence";
import { FadeInView, ScaleInView, StaggerContainer, StaggerItem } from "@/components/ui/motion";

function getMsme(msmeId: string) {
  return msmes.find((item) => item.id === msmeId);
}

const nextActions = [
  { label: "Review AI Explainability", href: "/applications/APP-001", icon: Eye, description: "Understand how AI reached decisions" },
  { label: "Generate Credit Memo", href: "/applications/APP-001/memo", icon: Sparkles, description: "Prepare officer assessment report" },
  { label: "View Portfolio Analytics", href: "/portfolio", icon: ArrowUpRight, description: "Analyse portfolio health trends" },
];

export function CommandCenterView({ role }: { role: UserRole }) {
  const urgentApplications = applications.filter((application) => application.priority === "urgent");
  const alerts = portfolio.flatMap((item) =>
    item.earlyWarnings.map((warning) => ({
      msme: getMsme(item.msmeId),
      riskBand: item.riskBand,
      warning
    }))
  );
  const totalExposure = portfolio.reduce((sum, item) => sum + item.exposure, 0);
  const watchlist = portfolio.filter((item) => item.riskBand === "high" || item.riskBand === "critical").length;
  const health = computePortfolioHealth(msmes, portfolio, financialSignals);

  return (
    <div className="space-y-6">
      <FadeInView>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <AIBadge tone="complete">AI Portfolio Scan Active</AIBadge>
            <AIBadge tone={health.band === "low" ? "complete" : "warning"}>
              Health: {health.overallScore}%
            </AIBadge>
          </div>
          <span className="text-xs text-muted">{health.msmeCount} MSMEs monitored</span>
        </div>
      </FadeInView>

      <StaggerContainer>
        <div className="grid gap-4 md:grid-cols-3">
          <StaggerItem>
            <Panel>
              <Metric label="Portfolio Exposure" value={formatCurrency(totalExposure)} hint="Across monitored MSMEs" />
            </Panel>
          </StaggerItem>
          <StaggerItem>
            <Panel>
              <Metric label="Urgent Applications" value={urgentApplications.length} hint="Action due today" />
            </Panel>
          </StaggerItem>
          <StaggerItem>
            <Panel>
              <Metric label="Watchlist MSMEs" value={watchlist} hint="High or critical risk bands" />
            </Panel>
          </StaggerItem>
        </div>
      </StaggerContainer>

      <Panel title="Performance Summary">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Metric label="Portfolio Health Score" value={`${health.overallScore}%`} hint={`${health.msmeCount} MSMEs assessed across all branches`} />
            <div className="mt-4">
              <Metric label="Watchlist MSMEs" value={health.watchlistCount} hint="Accounts flagged as high or critical risk" />
            </div>
          </div>
          <div>
            <Metric label="Total Exposure" value={formatCurrency(health.totalExposure)} hint="Aggregate across active MSME accounts" />
            <div className="mt-4">
              <Metric label="Early Warnings" value={health.earlyWarningCount} hint="Alerts requiring officer attention" />
            </div>
          </div>
        </div>
      </Panel>

      <Panel
        title="Smart Actions"
        action={<Badge tone="info">Recommended</Badge>}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {nextActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-trust/20 hover:shadow-glow card-lift"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-trust-light text-trust transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{action.label}</p>
                  <p className="mt-0.5 text-xs text-muted">{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </Panel>

      <Panel
        title="Financial Risk Assessment"
        action={<Badge tone={health.band === "low" ? "success" : health.band === "medium" ? "warning" : "danger"}>{health.overallScore}%</Badge>}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted/80">Risk Distribution</p>
            <div className="mt-3 space-y-2">
              {(["low", "medium", "high", "critical"] as const).map((band) => {
                const count = portfolio.filter((item) => item.riskBand === band).length;
                if (count === 0) return null;
                return (
                  <div key={band} className="flex items-center gap-3">
                    <RiskBadge band={band} />
                    <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          band === "low" && "bg-growth",
                          band === "medium" && "bg-caution",
                          band === "high" && "bg-danger",
                          band === "critical" && "bg-danger/80"
                        )}
                        style={{ width: `${(count / portfolio.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-4">
            <Metric label="Early Warnings" value={alerts.length} hint="Alerts requiring attention" />
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {alerts.slice(0, 5).map((alert) => (
                <Link
                  key={alert.msme?.id + "-" + alert.warning}
                  href={`/portfolio/${alert.msme?.id}`}
                  className="flex items-start gap-2 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2 text-xs transition-colors hover:bg-white/[0.04]"
                >
                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-caution" />
                  <span className="text-muted">
                    <span className="font-medium text-ink">{alert.msme?.name}</span> — {alert.warning}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
