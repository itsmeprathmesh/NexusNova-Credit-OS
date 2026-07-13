import { useMemo } from "react";
import Link from "next/link";
import { Inbox, Radar } from "lucide-react";
import { EmptyState } from "@/components/ui/primitives";
import { msmes, portfolio, financialSignals } from "@/data/mock-data";
import type { UserRole } from "@/domain/types";
import { formatCurrency } from "@/lib/format";
import { PortfolioCommandCenter } from "./portfolio-command-center";
import { AIBadge } from "@/components/ai/ai-status";
import { FadeInView, SlideUpView } from "@/components/ui/motion";
import { DonutChart, ExposureTreemap } from "@/components/charts";
import { InteractiveRiskHeatmap } from "./interactive-risk-heatmap";
import { SectorIntelligence } from "./sector-intelligence";
import { BranchPerformance } from "./branch-performance";
import { CreditLimitMonitor } from "./credit-limit-monitor";
import { RiskMigrationTimeline } from "./risk-migration-timeline";
import { EarlyWarningCenter } from "./early-warning-center";
import { PortfolioAnalytics } from "./portfolio-analytics";
import { ExecutiveCreditBoard } from "./executive-credit-board";
import {
  computeBranchPerformance,
  computeEarlyWarnings,
  computePortfolioAnalytics,
  computePortfolioHealth,
  computeRiskMigration,
  computeSectorSummaries,
  getEnrichedPortfolio
} from "@/services/portfolio-intelligence";
import { SmartCallout } from "@/components/demo/smart-callout";

export function PortfolioDashboard({ role }: { role: UserRole }) {
  const enriched = useMemo(() => {
    return getEnrichedPortfolio(msmes, portfolio, financialSignals).map((item) => {
      const msme = item.msme!;
      return { ...item, name: msme.name, branch: msme.branch, sector: msme.sector, msme: undefined };
    });
  }, []);

  const health = useMemo(() => computePortfolioHealth(msmes, portfolio, financialSignals), []);
  const sectors = useMemo(() => computeSectorSummaries(msmes, portfolio, financialSignals), []);
  const branches = useMemo(() => computeBranchPerformance(msmes, portfolio, financialSignals), []);
  const migration = useMemo(() => computeRiskMigration(msmes, portfolio, financialSignals), []);
  const warnings = useMemo(() => computeEarlyWarnings(msmes, portfolio), []);
  const analytics = useMemo(() => computePortfolioAnalytics(msmes, portfolio), []);

  return (
    <div className="space-y-6">
      <FadeInView>
        <div className="mb-2 flex items-center gap-2">
          <AIBadge tone="complete">AI Intelligence Engine</AIBadge>
          <AIBadge tone={health.band === "low" ? "complete" : "warning"}>Portfolio Health: {health.overallScore}%</AIBadge>
          <span className="text-xs text-muted">Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </FadeInView>

      <PortfolioCommandCenter health={health} role={role} />

      <ExecutiveCreditBoard health={health} sectors={sectors} topWarnings={warnings.length} />

      <InteractiveRiskHeatmap enriched={enriched} role={role} />

      <div className="grid gap-6 xl:grid-cols-2">
        <SectorIntelligence sectors={sectors} />
        <div className="space-y-6">
          <SlideUpView>
            <div className="rounded-lg border border-line bg-panel p-5 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-ink">Risk Distribution</h2>
              <DonutChart
                data={[
                  { name: "Low", value: enriched.filter((e) => e.riskBand === "low").length, color: "#13795b" },
                  { name: "Medium", value: enriched.filter((e) => e.riskBand === "medium").length, color: "#e68a2e" },
                  { name: "High", value: enriched.filter((e) => e.riskBand === "high").length, color: "#d9534f" },
                  { name: "Critical", value: enriched.filter((e) => e.riskBand === "critical").length, color: "#9b1c1c" }
                ]}
                height={180}
                innerRadius={44}
                outerRadius={72}
                centerLabel={`${enriched.length}`}
              />
              <p className="mt-2 text-center text-xs text-muted">Portfolio risk distribution across {enriched.length} MSMEs</p>
            </div>
          </SlideUpView>
          <BranchPerformance branches={branches} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <EarlyWarningCenter warnings={warnings} role={role} />
        <CreditLimitMonitor enriched={enriched} role={role} />
      </div>

      <RiskMigrationTimeline migration={migration} />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <PortfolioAnalytics analytics={analytics} />
        <SlideUpView>
          <div className="rounded-lg border border-line bg-panel p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-ink">Sector Exposure Treemap</h2>
            <ExposureTreemap
              items={sectors.map((s) => ({
                id: s.sector,
                label: s.sector,
                value: s.totalExposure,
                band: s.dominantBand,
                subtitle: `${s.count} MSMEs`
              }))}
              maxHeight={240}
            />
          </div>
        </SlideUpView>
      </div>

      <SmartCallout
        id="portfolio-intelligence-risk-management"
        title="Portfolio Intelligence in Action"
        description="AI-powered portfolio intelligence monitors risk migration, sector exposure, and early warning signals across all branches — enabling proactive risk management before accounts slip into NPA."
        variant="impact"
        icon={Radar}
      />
      <div className="rounded-lg border border-line bg-panel p-5 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-ink">Sector & Branch Exposure</h2>
          {enriched.length === 0 ? (
          <EmptyState icon={<Inbox className="h-8 w-8" />} title="No MSME data available" description="Portfolio data will appear once MSMEs are onboarded." />
        ) : (
        <div className="overflow-hidden rounded-lg border border-line">
          <div className="grid grid-cols-[1.1fr_1fr_1fr_0.8fr] gap-4 bg-white/[0.04] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
            <span>MSME</span>
            <span>Sector</span>
            <span>Branch</span>
            <span>Exposure</span>
          </div>
          <div className="divide-y divide-line">
            {enriched.map((item) => (
              <Link
                key={item.msmeId}
                href={`/portfolio/${item.msmeId}?role=${role}`}
                className="grid grid-cols-[1.1fr_1fr_1fr_0.8fr] gap-4 px-4 py-3 text-sm transition hover:bg-white/[0.04]"
              >
                <span className="font-semibold text-ink">{item.name}</span>
                <span className="text-muted">{item.sector}</span>
                <span className="text-muted">{item.branch}</span>
                <span className="text-muted">{formatCurrency(item.exposure)}</span>
              </Link>
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
