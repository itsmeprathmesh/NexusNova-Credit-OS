import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Clock, IndianRupee } from "lucide-react";
import { applications, msmes, portfolio, financialSignals } from "@/data/mock-data";
import type { UserRole } from "@/domain/types";
import { formatCurrency } from "@/lib/format";
import { Badge, Metric, Panel, RiskBadge } from "@/components/ui/primitives";
import { AIBadge } from "@/components/ai/ai-status";
import { ConfidenceIndicators } from "@/components/ai/confidence-indicator";
import { computePortfolioHealth } from "@/services/portfolio-intelligence";

function getMsme(msmeId: string) {
  return msmes.find((item) => item.id === msmeId);
}

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
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <AIBadge tone="complete">AI Portfolio Scan Active</AIBadge>
          <AIBadge tone={health.band === "low" ? "complete" : "warning"}>
            Health: {health.overallScore}%
          </AIBadge>
        </div>
        <span className="text-xs text-muted">{health.msmeCount} MSMEs monitored</span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Panel>
          <Metric label="Portfolio Exposure" value={formatCurrency(totalExposure)} hint="Across monitored MSMEs" />
        </Panel>
        <Panel>
          <Metric label="Urgent Applications" value={urgentApplications.length} hint="Action due today" />
        </Panel>
        <Panel>
          <Metric label="Watchlist MSMEs" value={watchlist} hint="High or critical risk bands" />
        </Panel>
      </div>

      <ConfidenceIndicators
        metrics={[
          { label: "Portfolio Health", score: health.overallScore },
          { label: "Sector Coverage", score: Math.round(health.msmeCount * 10) },
          { label: "Early Warning Detection", score: Math.max(10, 100 - health.earlyWarningCount * 10) },
          { label: "Data Completeness", score: 92 }
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Panel title={role === "manager" ? "Manager Command Center" : "Loan Officer Command Center"}>
          <div className="space-y-3">
            {urgentApplications.map((application) => {
              const msme = getMsme(application.msmeId);

              return (
                <Link
                  key={application.id}
                  href={`/applications/${application.id}?role=${role}`}
                  className="flex flex-col gap-3 rounded-lg border border-line p-4 transition hover:border-trust hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold">{msme?.name}</h2>
                      <Badge tone="warning">Urgent</Badge>
                      <Badge tone="info">{application.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted">
                      {application.product} for {formatCurrency(application.requestedAmount)} · {application.purpose}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {msme?.branch} · {application.slaHoursRemaining}h SLA remaining
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-trust" />
                </Link>
              );
            })}
          </div>
        </Panel>

        <Panel title="SLA Breaches">
          <div className="space-y-4">
            {urgentApplications.map((application) => (
              <div key={application.id} className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-semibold">{application.id}</p>
                  <p className="text-sm text-muted">{application.slaHoursRemaining}h remaining before escalation threshold.</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Early Warning Alerts">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={`${alert.msme?.id}-${alert.warning}`} className="flex items-start justify-between gap-4 rounded-lg border border-line p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-1 h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-semibold">{alert.msme?.name}</p>
                    <p className="mt-1 text-sm text-muted">{alert.warning}</p>
                  </div>
                </div>
                <RiskBadge band={alert.riskBand} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Portfolio Exposure">
          <div className="space-y-3">
            {portfolio.map((item) => {
              const msme = getMsme(item.msmeId);

              return (
                <Link
                  key={item.msmeId}
                  href={`/portfolio/${item.msmeId}?role=${role}`}
                  className="flex items-center justify-between gap-4 rounded-lg border border-line p-4 transition hover:border-trust hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-trust">
                      <IndianRupee className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{msme?.name}</p>
                      <p className="text-sm text-muted">{msme?.sector} · {msme?.branch}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(item.exposure)}</p>
                    <RiskBadge band={item.riskBand} className="mt-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </Panel>
      </div>
    </div>
  );
}
