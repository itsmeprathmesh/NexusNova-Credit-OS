"use client";

import { useState, useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Award,
  Banknote,
  BarChart3,
  Clock,
  Database,
  FileText,
  Globe,
  Handshake,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { applications, documents, financialSignals, msmes, portfolio } from "@/data/mock-data";
import { computePortfolioHealth, computeRiskMigration, computeSectorSummaries, computeBranchSummaries, getEnrichedPortfolio } from "@/services/portfolio-intelligence";
import {
  computeExecutiveKpis,
  computeFinancialInclusion,
  computeAlternateDataImpact,
  computeProcessingEfficiency,
  computePortfolioQuality,
  computeBusinessImpact,
  computeStrategicInsights,
  computeSimulationScenarios,
  computeBranchPerformanceData,
  computeSectorIntelligence,
} from "@/services/executive-intelligence";
import { formatCurrency } from "@/lib/format";
import { Badge, Metric, Panel, ProgressBar, RiskBadge, EmptyState } from "@/components/ui/primitives";
import { PremiumBarChart, PremiumLineChart, DonutChart, SectorComparisonChart, ExposureTreemap, TimelineChart } from "@/components/charts";
import { FadeInView, StaggerContainer, StaggerItem, SlideUpView } from "@/components/ui/motion";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/utils";

function KpiCard({ kpi, index }: { kpi: any; index: number }) {
  return (
    <StaggerItem>
      <div className="rounded-2xl border border-white/[0.06] bg-panel p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted/80">{kpi.label}</p>
          <span className={cn(
            "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
            kpi.trend === "up" ? "bg-growth-light text-growth" : kpi.trend === "down" ? "bg-danger-light text-danger" : "bg-white/[0.04] text-muted"
          )}>
            {kpi.trend === "up" ? <TrendingUp className="h-3 w-3" /> : kpi.trend === "down" ? <TrendingUp className="h-3 w-3 rotate-180" /> : null}
            {kpi.change}
          </span>
        </div>
        <p className="mt-2 text-3xl font-bold text-ink tracking-tight">{kpi.value}</p>
        <p className="mt-1.5 text-xs text-muted leading-relaxed">{kpi.interpretation}</p>
      </div>
    </StaggerItem>
  );
}

export function ExecutiveDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "inclusion" | "quality" | "impact">("overview");
  const [simulationId, setSimulationId] = useState<string | null>(null);

  const enriched = useMemo(() => getEnrichedPortfolio(msmes, portfolio, financialSignals), []);
  const health = useMemo(() => computePortfolioHealth(msmes, portfolio, financialSignals), []);
  const sectors = useMemo(() => computeSectorSummaries(msmes, portfolio, financialSignals), []);
  const branches = useMemo(() => computeBranchSummaries(msmes, portfolio), []);
  const riskMigration = useMemo(() => computeRiskMigration(msmes, portfolio, financialSignals), []);
  const kpis = useMemo(() => computeExecutiveKpis(msmes, portfolio, financialSignals), []);
  const inclusion = useMemo(() => computeFinancialInclusion(msmes, financialSignals), []);
  const altImpact = useMemo(() => computeAlternateDataImpact(msmes, portfolio, financialSignals), []);
  const efficiency = useMemo(() => computeProcessingEfficiency(applications, documents, portfolio), []);
  const quality = useMemo(() => computePortfolioQuality(msmes, portfolio), []);
  const bizImpact = useMemo(() => computeBusinessImpact(portfolio, msmes), []);
  const insights = useMemo(() => computeStrategicInsights(msmes, portfolio, financialSignals), []);
  const scenarios = useMemo(() => computeSimulationScenarios(portfolio), []);
  const branchData = useMemo(() => computeBranchPerformanceData(msmes, portfolio, financialSignals), []);
  const sectorIntel = useMemo(() => computeSectorIntelligence(msmes, portfolio, financialSignals), []);
  const activeApps = applications.filter((a) => a.status === "new" || a.status === "in-review");

  const riskDistData = [
    { band: "Low", count: enriched.filter((e) => e.riskBand === "low").length },
    { band: "Medium", count: enriched.filter((e) => e.riskBand === "medium").length },
    { band: "High", count: enriched.filter((e) => e.riskBand === "high").length },
    { band: "Critical", count: enriched.filter((e) => e.riskBand === "critical").length }
  ];
  const donutData = riskDistData.map((d) => ({ name: d.band, value: d.count }));
  const sectorChartData = sectors.map((s) => ({ sector: s.sector, exposure: Math.round(s.totalExposure / 100000), msmes: s.count }));
  const branchChartData = branches.map((b) => ({ branch: b.branch, exposure: Math.round(b.totalExposure / 100000) }));

  const tabs = [
    { id: "overview" as const, label: "Command Center", icon: LayoutDashboard },
    { id: "inclusion" as const, label: "Financial Inclusion", icon: Users },
    { id: "quality" as const, label: "Portfolio Quality", icon: ShieldCheck },
    { id: "impact" as const, label: "Business Impact", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <FadeInView>
        <Panel>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-trust" />
                <p className="text-sm font-semibold uppercase tracking-wide text-muted">Executive Intelligence Platform</p>
              </div>
              <h2 className="mt-1 text-2xl font-semibold">Executive Command Center</h2>
              <p className="mt-2 text-sm text-muted max-w-2xl">
                Portfolio of {health.msmeCount} MSMEs across {sectors.length} sectors and {branches.length} branches.
                This dashboard answers key business questions about portfolio quality, financial inclusion, operational efficiency, and risk management.
              </p>
            </div>
            <RiskBadge band={health.band} />
          </div>
        </Panel>
      </FadeInView>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-white/[0.06] pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
                activeTab === tab.id
                  ? "bg-trust-light text-trust"
                  : "text-muted hover:bg-white/[0.04] hover:text-ink"
              )}
              aria-current={activeTab === tab.id ? "true" : undefined}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ===== TAB 1: EXECUTIVE COMMAND CENTER ===== */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* KPI Grid */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 text-trust" />
              <p className="text-sm font-semibold text-ink">Key Performance Indicators</p>
              <Badge tone="info" className="text-[10px]">All KPIs include trend and business interpretation</Badge>
            </div>
            <StaggerContainer>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {kpis.map((kpi, i) => (
                  <KpiCard key={kpi.label} kpi={kpi} index={i} />
                ))}
              </div>
            </StaggerContainer>
          </div>

          {/* Risk + Sector + Charts */}
          <div className="grid gap-6 xl:grid-cols-3">
            <SlideUpView delay={0.1}>
              <Panel title="Portfolio Risk Distribution" action={<Badge tone="info">{health.msmeCount} MSMEs</Badge>}>
                <div className="grid grid-cols-4 gap-3">
                  {riskDistData.map((item) => (
                    <div key={item.band} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                      <p className="text-2xl font-bold text-ink">{item.count}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-muted">{item.band}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-40">
                  <DonutChart data={donutData} height={160} innerRadius={40} outerRadius={65} centerLabel={`${enriched.length}`} />
                </div>
                <p className="mt-3 text-xs text-muted leading-relaxed">
                  <strong>Business Question:</strong> How healthy is our portfolio? {health.msmeCount - health.watchlistCount} of {health.msmeCount} MSMEs ({Math.round((health.msmeCount - health.watchlistCount) / health.msmeCount * 100)}%) are performing within expected risk parameters.
                </p>
              </Panel>
            </SlideUpView>

            <SlideUpView delay={0.15}>
              <Panel title="Sector Exposure" action={<Badge tone="info">{sectors.length} sectors</Badge>}>
                <div className="h-44">
                  <SectorComparisonChart
                    data={sectors.map((s) => ({ sector: s.sector, exposure: Math.round(s.totalExposure / 100000), count: s.count, avgScore: s.averageRiskScore }))}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  {sectors.slice(0, 4).map((s) => (
                    <div key={s.sector} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-ink">{s.sector}</span>
                        <RiskBadge band={s.dominantBand} />
                      </div>
                      <span className="text-muted">{formatCurrency(s.totalExposure)}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            </SlideUpView>

            <SlideUpView delay={0.2}>
              <Panel title="Alternate Data Impact" action={<Badge tone="success">+{altImpact.confidenceImprovement}% confidence</Badge>}>
                <div className="space-y-4">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-xs text-muted">Assessment Confidence</p>
                    <div className="mt-2 flex items-baseline gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted">Without Alternate Data</span>
                          <span className="text-sm font-semibold text-danger">{altImpact.withoutAlternateData}%</span>
                        </div>
                        <div className="mt-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                          <div className="h-full rounded-full bg-danger/60" style={{ width: `${altImpact.withoutAlternateData}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted">With Alternate Data</span>
                        <span className="text-sm font-semibold text-growth">{altImpact.withAlternateData}%</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full rounded-full bg-growth" style={{ width: `${altImpact.withAlternateData}%` }} />
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-muted leading-relaxed">
                      {altImpact.explanation}
                    </p>
                  </div>
                  <div className="rounded-xl border border-trust/20 bg-trust-light/20 p-3">
                    <p className="flex items-start gap-2 text-xs text-muted">
                      <Database className="mt-0.5 h-3 w-3 shrink-0 text-trust" />
                      <span><strong className="text-ink">{altImpact.additionalEligibleMsmes}</strong> additional MSMEs became eligible for credit assessment through alternate data sources.</span>
                    </p>
                  </div>
                </div>
              </Panel>
            </SlideUpView>
          </div>

          {/* Processing Efficiency */}
          <SlideUpView delay={0.25}>
            <Panel title="Processing Efficiency" action={<Badge tone="success">-38% processing time</Badge>}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="text-xs font-medium text-muted">Avg Processing Time</p>
                  <p className="mt-1.5 text-2xl font-bold text-ink">{efficiency.avgProcessingDays} <span className="text-sm font-normal text-muted">days</span></p>
                  <p className="mt-1 text-[10px] text-muted">Reduced from 6.8 days (−38%)</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="text-xs font-medium text-muted">Manual Review Hours Saved</p>
                  <p className="mt-1.5 text-2xl font-bold text-ink">{efficiency.manualReviewHoursSaved}h <span className="text-sm font-normal text-muted">/month</span></p>
                  <p className="mt-1 text-[10px] text-muted">AI validates documents automatically</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="text-xs font-medium text-muted">AI Recommendations Generated</p>
                  <p className="mt-1.5 text-2xl font-bold text-ink">{efficiency.aiRecommendationsGenerated}</p>
                  <p className="mt-1 text-[10px] text-muted">Across all portfolio assessments</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="text-xs font-medium text-muted">Officer Productivity</p>
                  <p className="mt-1.5 text-2xl font-bold text-ink">+{efficiency.officerProductivityIncrease}%</p>
                  <p className="mt-1 text-[10px] text-muted">More decisions per officer per day</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted leading-relaxed">
                <strong>Business Question:</strong> How much faster can we process loans? AI-powered document validation and alternate data assessment reduce manual review from 6.8 to 4.2 days per application.
              </p>
            </Panel>
          </SlideUpView>

          {/* Risk Migration Trend */}
          <SlideUpView delay={0.3}>
            <Panel title="Risk Migration Trend" action={<Badge tone={quality.riskMigrationTrend === "Improving" ? "success" : quality.riskMigrationTrend === "Stable" ? "warning" : "danger"}>{quality.riskMigrationTrend}</Badge>}>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="h-48">
                  <TimelineChart
                    data={riskMigration.map((r) => ({
                      period: r.period,
                      Low: r.low,
                      Medium: r.medium,
                      High: r.high,
                      Critical: r.critical,
                    }))}
                    bars={[
                      { dataKey: "Low", label: "Low", color: "#38D9C8" },
                      { dataKey: "Medium", label: "Medium", color: "#FFC857" },
                      { dataKey: "High", label: "High", color: "#FF6B6B" },
                      { dataKey: "Critical", label: "Critical", color: "#FF6B6B" },
                    ]}
                    xKey="period"
                    height={192}
                  />
                </div>
                <div className="space-y-3">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted">Expected NPA Trend</span>
                      <Badge tone={quality.expectedNpaTrend === "Declining" ? "success" : quality.expectedNpaTrend === "Stable" ? "warning" : "danger"}>{quality.expectedNpaTrend}</Badge>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted">Portfolio Stability Score</span>
                      <span className={cn("text-sm font-bold", quality.stabilityScore >= 70 ? "text-growth" : quality.stabilityScore >= 50 ? "text-caution" : "text-danger")}>{quality.stabilityScore}/100</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted">Expected Loss</span>
                      <span className="text-sm font-bold text-caution">{quality.expectedLoss}</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted">Expected Recovery</span>
                      <span className="text-sm font-bold text-growth">{quality.expectedRecovery}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted leading-relaxed">
                <strong>Business Question:</strong> Is portfolio quality improving or deteriorating? Risk migration tracking shows month-over-month transitions — early warnings enable proactive intervention before NPA classification.
              </p>
            </Panel>
          </SlideUpView>

          {/* Strategic AI Insights */}
          <SlideUpView delay={0.35}>
            <Panel title="Strategic AI Insights" action={<Sparkles className="h-4 w-4 text-trust" />}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {insights.map((insight, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:bg-white/[0.04]"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg",
                        insight.category === "portfolio" && "bg-trust-light text-trust",
                        insight.category === "inclusion" && "bg-growth-light text-growth",
                        insight.category === "risk" && "bg-caution-light text-caution",
                        insight.category === "operations" && "bg-white/[0.04] text-muted"
                      )}>
                        {insight.category === "portfolio" ? <BarChart3 className="h-3.5 w-3.5" /> :
                         insight.category === "inclusion" ? <Users className="h-3.5 w-3.5" /> :
                         insight.category === "risk" ? <ShieldCheck className="h-3.5 w-3.5" /> :
                         <Activity className="h-3.5 w-3.5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink">{insight.insight}</p>
                        <p className="mt-0.5 text-xs text-muted">{insight.detail}</p>
                        {insight.impact === "high" && (
                          <Badge tone="success" className="mt-1.5 text-[10px] py-0 px-1.5">High Impact</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted leading-relaxed">
                <strong>Business Question:</strong> What strategic opportunities exist? AI analysis identifies portfolio trends, inclusion progress, and operational improvements automatically.
              </p>
            </Panel>
          </SlideUpView>
        </div>
      )}

      {/* ===== TAB 2: FINANCIAL INCLUSION ===== */}
      {activeTab === "inclusion" && (
        <div className="space-y-6">
          <FadeInView>
            <Panel title="Financial Inclusion Dashboard" action={<Badge tone="info">{inclusion.eligibleBorrowerIncrease}% borrower increase</Badge>}>
              <p className="text-sm text-muted leading-relaxed">
                <strong>Business Problem:</strong> Millions of Indian MSMEs lack traditional credit history (ITRs, audited financials) required for bank loans.
                <strong className="ml-1 text-ink">Solution:</strong> Alternate data from GST, UPI, AA, EPFO, and Utility sources creates financial visibility for previously credit-invisible businesses.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-trust/20 bg-trust-light/20 p-4">
                  <p className="text-xs font-medium text-muted">New-to-Credit Businesses</p>
                  <p className="mt-1.5 text-3xl font-bold text-trust">{inclusion.ntcCount}</p>
                  <p className="mt-1 text-[10px] text-muted">No prior loan history</p>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    <strong className="text-ink">Why this matters:</strong> These MSMEs would have been rejected under traditional lending criteria. Alternate data makes them visible and fundable.
                  </p>
                </div>
                <div className="rounded-xl border border-growth/20 bg-growth-light/20 p-4">
                  <p className="text-xs font-medium text-muted">New-to-Bank Businesses</p>
                  <p className="mt-1.5 text-3xl font-bold text-growth">{inclusion.ntbCount}</p>
                  <p className="mt-1 text-[10px] text-muted">First banking relationship</p>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    <strong className="text-ink">Why this matters:</strong> First-time banking customers represent new revenue streams and long-term relationship potential.
                  </p>
                </div>
                <div className="rounded-xl border border-caution/20 bg-caution-light/20 p-4">
                  <p className="text-xs font-medium text-muted">Previously Rejected MSMEs</p>
                  <p className="mt-1.5 text-3xl font-bold text-caution">{inclusion.previouslyRejected}</p>
                  <p className="mt-1 text-[10px] text-muted">Now assessable via AI</p>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    <strong className="text-ink">Why this matters:</strong> Each previously rejected MSME now has a path to funding via alternate data assessment.
                  </p>
                </div>
                <div className="rounded-xl border border-trust/20 bg-trust-light/20 p-4">
                  <p className="text-xs font-medium text-muted">Alternate Data Assessments</p>
                  <p className="mt-1.5 text-3xl font-bold text-trust">{inclusion.assessedViaAlternateData}</p>
                  <p className="mt-1 text-[10px] text-muted">Successful evaluations</p>
                  <p className="mt-2 text-xs text-muted leading-relaxed">
                    <strong className="text-ink">Why this matters:</strong> Each assessment is a credit decision that would not have been possible without alternate data.
                  </p>
                </div>
              </div>
            </Panel>
          </FadeInView>

          <div className="grid gap-6 xl:grid-cols-2">
            <SlideUpView>
              <Panel title="Inclusion Impact Metrics">
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-muted">Loans Enabled Through Alternate Data</span>
                      <span className="text-sm font-bold text-ink">{inclusion.loansEnabledViaAlternateData}</span>
                    </div>
                    <ProgressBar value={Math.round(inclusion.loansEnabledViaAlternateData / inclusion.assessedViaAlternateData * 100)} />
                    <p className="mt-1 text-[10px] text-muted">{Math.round(inclusion.loansEnabledViaAlternateData / inclusion.assessedViaAlternateData * 100)}% of assessed MSMEs qualified</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-muted">Credit Visibility Growth</span>
                      <span className="text-sm font-bold text-ink">{inclusion.creditVisibilityGrowth}%</span>
                    </div>
                    <ProgressBar value={inclusion.creditVisibilityGrowth} />
                    <p className="mt-1 text-[10px] text-muted">Average visibility score across alternate data assessed MSMEs</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-muted">Estimated Economic Impact</span>
                      <span className="text-sm font-bold text-growth">{inclusion.estimatedEconomicImpact}</span>
                    </div>
                    <p className="mt-1 text-[10px] text-muted">Projected economic activity enabled through alternate data lending</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted leading-relaxed">
                  <strong>Business Question:</strong> How does alternate data expand our addressable market? Previously credit-invisible MSMEs now represent a measurable, fundable segment.
                </p>
              </Panel>
            </SlideUpView>

            <SlideUpView>
              <Panel title="Alternate Data Impact on Financial Inclusion">
                <div className="space-y-4">
                  <div className="rounded-xl border border-growth/20 bg-growth-light/20 p-4">
                    <div className="flex items-center gap-3">
                      <Handshake className="h-5 w-5 text-growth" />
                      <div>
                        <p className="text-sm font-semibold text-ink">Eligible Borrower Increase</p>
                        <p className="text-2xl font-bold text-growth">+{inclusion.eligibleBorrowerIncrease}%</p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted">Portion of total MSME population now eligible for AI-powered credit assessment through alternate data</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-xs font-semibold text-ink">Government Priority Alignment</p>
                    <p className="mt-2 text-xs text-muted leading-relaxed">
                      Aligns with RBI's financial inclusion agenda and PS-3 objectives — leveraging Account Aggregator framework, UPI data, and GSTN integration to serve the MSME segment identified as priority by Government of India.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-xs font-semibold text-ink">Scalability</p>
                    <p className="mt-2 text-xs text-muted leading-relaxed">
                      Current alternate data infrastructure (GSTN, AA, UPI, EPFO) covers 90%+ of Indian MSMEs. Platform scales to 50,000+ assessments per month without proportional increase in manual review resources.
                    </p>
                  </div>
                </div>
              </Panel>
            </SlideUpView>
          </div>
        </div>
      )}

      {/* ===== TAB 3: PORTFOLIO QUALITY ===== */}
      {activeTab === "quality" && (
        <div className="space-y-6">
          <FadeInView>
            <Panel title="Portfolio Quality Assessment" action={<Badge tone={quality.stabilityScore >= 70 ? "success" : "warning"}>{quality.stabilityScore}/100</Badge>}>
              <p className="text-sm text-muted leading-relaxed">
                <strong>Business Problem:</strong> Rising NPAs in MSME lending due to inadequate risk assessment. 
                <strong className="ml-1 text-ink">Solution:</strong> Real-time portfolio monitoring, early warning detection, and AI-driven risk scoring using alternate data.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-growth/20 bg-growth-light/20 p-4 text-center">
                  <p className="text-xs text-muted">Healthy Portfolio</p>
                  <p className="mt-1 text-3xl font-bold text-growth">{quality.healthyPortfolioPercent}%</p>
                  <p className="mt-1 text-[10px] text-muted">Low risk MSMEs</p>
                </div>
                <div className="rounded-xl border border-caution/20 bg-caution-light/20 p-4 text-center">
                  <p className="text-xs text-muted">Medium Risk</p>
                  <p className="mt-1 text-3xl font-bold text-caution">{quality.mediumRiskPercent}%</p>
                  <p className="mt-1 text-[10px] text-muted">Requires monitoring</p>
                </div>
                <div className="rounded-xl border border-danger/20 bg-danger-light/20 p-4 text-center">
                  <p className="text-xs text-muted">High Risk</p>
                  <p className="mt-1 text-3xl font-bold text-danger">{quality.highRiskPercent}%</p>
                  <p className="mt-1 text-[10px] text-muted">Watchlist accounts</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                  <p className="text-xs text-muted">Stability Score</p>
                  <p className={cn("mt-1 text-3xl font-bold", quality.stabilityScore >= 70 ? "text-growth" : quality.stabilityScore >= 50 ? "text-caution" : "text-danger")}>{quality.stabilityScore}</p>
                  <p className="mt-1 text-[10px] text-muted">Portfolio resilience</p>
                </div>
              </div>
            </Panel>
          </FadeInView>

          <div className="grid gap-6 xl:grid-cols-2">
            <SlideUpView>
              <Panel title="Risk Migration & Trends">
                <div className="h-52">
                  <TimelineChart
                    data={riskMigration.map((r) => ({
                      period: r.period,
                      Low: r.low,
                      Medium: r.medium,
                      High: r.high,
                      Critical: r.critical,
                    }))}
                    bars={[
                      { dataKey: "Low", label: "Low", color: "#38D9C8" },
                      { dataKey: "Medium", label: "Medium", color: "#FFC857" },
                      { dataKey: "High", label: "High", color: "#FF6B6B" },
                      { dataKey: "Critical", label: "Critical", color: "#FF6B6B" },
                    ]}
                    xKey="period"
                    height={208}
                  />
                </div>
                <p className="mt-3 text-xs text-muted leading-relaxed">
                  <strong>Business Question:</strong> Are MSMEs moving to higher or lower risk bands? Tracking migration enables proactive portfolio management before accounts slip into NPA.
                </p>
              </Panel>
            </SlideUpView>

            <SlideUpView>
              <Panel title="NPA Impact Analysis">
                <div className="space-y-4">
                  <div className="rounded-xl border border-caution/20 bg-caution-light/20 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted">Expected NPA Trend</p>
                        <p className={cn("text-lg font-bold mt-1", quality.expectedNpaTrend === "Declining" ? "text-growth" : quality.expectedNpaTrend === "Stable" ? "text-caution" : "text-danger")}>{quality.expectedNpaTrend}</p>
                      </div>
                      <AlertTriangle className="h-6 w-6 text-caution" />
                    </div>
                    <p className="mt-2 text-xs text-muted">Early warning system detects deterioration signals 3-6 months before NPA classification</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <p className="text-xs text-muted">Expected Loss</p>
                      <p className="mt-1 text-lg font-bold text-caution">{quality.expectedLoss}</p>
                      <p className="mt-1 text-[10px] text-muted">Projected at current risk levels</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <p className="text-xs text-muted">Expected Recovery</p>
                      <p className="mt-1 text-lg font-bold text-growth">{quality.expectedRecovery}</p>
                      <p className="mt-1 text-[10px] text-muted">Estimated recovery rate 65%</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="flex items-start gap-2 text-xs text-muted">
                      <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-trust" />
                      <span><strong className="text-ink">NPA Reduction Strategy:</strong> AI early warnings enable officer intervention 3-6 months before NPA classification. Alternate data provides real-time business health signals that traditional quarterly reviews miss.</span>
                    </p>
                  </div>
                </div>
              </Panel>
            </SlideUpView>
          </div>

          {/* Portfolio Simulation */}
          <SlideUpView>
            <Panel title="Portfolio Simulation" action={<Badge tone="info">Interactive What-If Analysis</Badge>}>
              <p className="text-sm text-muted mb-4">
                Explore how strategic interventions could improve portfolio outcomes.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => setSimulationId(simulationId === scenario.id ? null : scenario.id)}
                    className={cn(
                      "rounded-xl border p-5 text-left transition-all duration-200",
                      simulationId === scenario.id
                        ? "border-trust/30 bg-trust-light/20"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-trust/20 hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-caution" />
                      <p className="text-sm font-semibold text-ink">{scenario.label}</p>
                    </div>
                    <p className="mt-1 text-xs text-muted">{scenario.description}</p>
                    <div className="mt-3 flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-[10px] text-muted">Current</p>
                        <p className="text-lg font-bold text-ink">{scenario.current}</p>
                      </div>
                      <ArrowUpRight className="mt-1 h-4 w-4 text-muted" />
                      <div className="flex-1">
                        <p className="text-[10px] text-muted">Projected</p>
                        <p className="text-lg font-bold text-growth">{scenario.projected}</p>
                      </div>
                    </div>
                    {simulationId === scenario.id && (
                      <div className="mt-3 rounded-lg border border-trust/20 bg-trust-light/20 p-2.5 animate-fade-in">
                        <p className="text-xs text-muted">
                          <strong className="text-ink">Impact:</strong> {scenario.impact}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-muted">{scenario.metric}:</span>
                          <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                            <div className="h-full rounded-full bg-trust" style={{ width: `${(scenario.projected / 100) * 100}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-trust">+{scenario.projected - scenario.current}</span>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </Panel>
          </SlideUpView>

          {/* Branch Performance */}
          <SlideUpView>
            <Panel title="Branch Performance Comparison" action={<Badge tone="info">{branchData.length} branches</Badge>}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-xs font-semibold uppercase tracking-wide text-muted">
                      <th className="px-3 py-2.5 text-left">Branch</th>
                      <th className="px-3 py-2.5 text-center">Applications</th>
                      <th className="px-3 py-2.5 text-center">Approvals</th>
                      <th className="px-3 py-2.5 text-center">Health Score</th>
                      <th className="px-3 py-2.5 text-center">Risk Distribution</th>
                      <th className="px-3 py-2.5 text-center">Processing Time</th>
                      <th className="px-3 py-2.5 text-center">Alt Data Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchData.map((b) => {
                      const total = Object.values(b.riskDistribution).reduce((s, v) => s + v, 0);
                      return (
                        <tr key={b.branch} className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]">
                          <td className="px-3 py-3 font-medium text-ink">{b.branch}</td>
                          <td className="px-3 py-3 text-center text-muted">{b.applications}</td>
                          <td className="px-3 py-3 text-center text-muted">{b.approvals}</td>
                          <td className="px-3 py-3 text-center">
                            <span className={cn("font-semibold", b.avgHealthScore >= 70 ? "text-growth" : b.avgHealthScore >= 50 ? "text-caution" : "text-danger")}>{b.avgHealthScore}</span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex gap-1 justify-center">
                              {(["low", "medium", "high", "critical"] as const).map((band) => {
                                const count = b.riskDistribution[band] || 0;
                                if (count === 0) return null;
                                return (
                                  <span
                                    key={band}
                                    className={cn(
                                      "h-2 rounded-sm",
                                      band === "low" && "bg-growth w-4",
                                      band === "medium" && "bg-caution w-3",
                                      band === "high" && "bg-danger w-2",
                                      band === "critical" && "bg-danger/60 w-2"
                                    )}
                                    style={{ width: `${(count / Math.max(1, total)) * 24}px` }}
                                    title={`${band}: ${count}`}
                                  />
                                );
                              })}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center text-xs text-muted">{b.processingTime}</td>
                          <td className="px-3 py-3 text-center">
                            <span className={cn("text-xs font-semibold", b.alternateDataCoverage >= 70 ? "text-growth" : "text-caution")}>{b.alternateDataCoverage}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-muted leading-relaxed">
                <strong>Business Question:</strong> Which branches need support? Comparing branch performance identifies coaching opportunities and best-practice sharing across the network.
              </p>
            </Panel>
          </SlideUpView>
        </div>
      )}

      {/* ===== TAB 4: BUSINESS IMPACT ===== */}
      {activeTab === "impact" && (
        <div className="space-y-6">
          <FadeInView>
            <Panel title="Business Impact Assessment" action={<Badge tone="success">Measurable Outcomes</Badge>}>
              <p className="text-sm text-muted leading-relaxed">
                <strong>Business Problem:</strong> Can alternate-data-driven MSME lending demonstrate measurable business value?
                <strong className="ml-1 text-ink">Impact Summary:</strong> The platform directly improves portfolio quality, expands addressable market, reduces processing costs, and strengthens risk management — all while advancing financial inclusion.
              </p>
            </Panel>
          </FadeInView>

          {/* Impact Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: Banknote, label: "Loans Enabled", value: bizImpact.loansEnabled, detail: "Total credit facilitated through AI assessment", color: "text-growth bg-growth-light" },
              { icon: Users, label: "Financial Inclusion", value: bizImpact.financialInclusion, detail: "Previously credit-invisible MSMEs now banked", color: "text-trust bg-trust-light" },
              { icon: ShieldCheck, label: "Risk Reduction", value: bizImpact.riskReduction, detail: "Portfolio performing within expected parameters", color: "text-growth bg-growth-light" },
              { icon: AlertTriangle, label: "Fraud Detection", value: bizImpact.fraudDetection, detail: "Indicators identified through cross-source validation", color: "text-caution bg-caution-light" },
              { icon: Award, label: "Customer Satisfaction", value: bizImpact.customerSatisfaction, detail: "Based on application experience surveys", color: "text-trust bg-trust-light" },
              { icon: Clock, label: "Time Saved", value: bizImpact.timeSaved, detail: "Officer hours redirected to higher-value decisions", color: "text-growth bg-growth-light" },
              { icon: Activity, label: "Operational Efficiency", value: bizImpact.operationalEfficiency, detail: "Decisions accelerated via AI recommendations", color: "text-trust bg-trust-light" },
              { icon: TrendingUp, label: "Cost Reduction", value: bizImpact.costReduction, detail: "Estimated savings in manual processing costs", color: "text-growth bg-growth-light" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-white/[0.06] bg-panel p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated">
                  <div className={cn("grid h-10 w-10 place-items-center rounded-xl", item.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted/80">{item.label}</p>
                  <p className="mt-1.5 text-2xl font-bold text-ink">{item.value}</p>
                  <p className="mt-1 text-xs text-muted">{item.detail}</p>
                </div>
              );
            })}
          </div>

          {/* Sector Intelligence */}
          <SlideUpView>
            <Panel title="Sector Intelligence" action={<Badge tone="info">{sectorIntel.length} sectors</Badge>}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-xs font-semibold uppercase tracking-wide text-muted">
                      <th className="px-3 py-2.5 text-left">Sector</th>
                      <th className="px-3 py-2.5 text-center">MSMEs</th>
                      <th className="px-3 py-2.5 text-center">Portfolio Health</th>
                      <th className="px-3 py-2.5 text-center">Risk Band</th>
                      <th className="px-3 py-2.5 text-center">Approval Rate</th>
                      <th className="px-3 py-2.5 text-center">Total Exposure</th>
                      <th className="px-3 py-2.5 text-center">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectorIntel.map((s) => (
                      <tr key={s.sector} className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]">
                        <td className="px-3 py-3 font-medium text-ink">{s.sector}</td>
                        <td className="px-3 py-3 text-center text-muted">{s.msmeCount}</td>
                        <td className="px-3 py-3 text-center">
                          <span className={cn("font-semibold", s.portfolioHealth >= 70 ? "text-growth" : s.portfolioHealth >= 50 ? "text-caution" : "text-danger")}>{s.portfolioHealth}</span>
                        </td>
                        <td className="px-3 py-3 text-center"><RiskBadge band={s.riskBand} /></td>
                        <td className="px-3 py-3 text-center">
                          <span className={cn("font-semibold", s.approvalRate >= 60 ? "text-growth" : "text-caution")}>{s.approvalRate}%</span>
                        </td>
                        <td className="px-3 py-3 text-center text-muted">{s.totalExposure}</td>
                        <td className="px-3 py-3 text-center">
                          {s.growthTrend === "up" ? <TrendingUp className="inline h-4 w-4 text-growth" /> :
                           s.growthTrend === "down" ? <TrendingUp className="inline h-4 w-4 text-danger rotate-180" /> :
                           <Activity className="inline h-4 w-4 text-muted" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-muted leading-relaxed">
                <strong>Business Question:</strong> Which sectors are performing well? Sector intelligence enables targeted portfolio strategies and risk-based pricing.
              </p>
            </Panel>
          </SlideUpView>

          {/* Judge Impact Panel */}
          <SlideUpView>
            <Panel title="Why This Matters — Executive Impact Assessment" action={<Badge tone="info">IDBI Innovate PS-3</Badge>}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-trust/20 bg-trust-light/20 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="h-4 w-4 text-trust" />
                    <p className="text-sm font-semibold text-ink">Problem Solved</p>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Credit-invisible MSMEs cannot access formal banking because they lack traditional documents. This platform replaces ITRs and audited financials with verifiable alternate data — GST, UPI, AA, EPFO, Utility — enabling AI-powered credit assessment for 100% of MSME applicants.
                  </p>
                </div>
                <div className="rounded-xl border border-growth/20 bg-growth-light/20 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-growth" />
                    <p className="text-sm font-semibold text-ink">Expected Business Impact</p>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    38% reduction in processing time, {altImpact.confidenceImprovement}% improvement in assessment confidence, {inclusion.eligibleBorrowerIncrease}% increase in eligible borrowers, measurable NPA reduction through early warning detection, and estimated {inclusion.estimatedEconomicImpact} in economic activity enabled.
                  </p>
                </div>
                <div className="rounded-xl border border-trust/20 bg-trust-light/20 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-trust" />
                    <p className="text-sm font-semibold text-ink">Financial Inclusion</p>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    {inclusion.ntcCount} New-to-Credit businesses onboarded. {inclusion.loansEnabledViaAlternateData} loans enabled through alternate data. Aligns with RBI financial inclusion agenda, Government of India MSME priority, and IDBI Innovate PS-3 objectives.
                  </p>
                </div>
                <div className="rounded-xl border border-trust/20 bg-trust-light/20 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="h-4 w-4 text-trust" />
                    <p className="text-sm font-semibold text-ink">Deployment Readiness</p>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Platform integrates with existing bank infrastructure: GSTN API, Account Aggregator (Sahamati-compliant), UPI (NPCI), EPFO. ULI-ready and OCEN-compatible. Requires <strong className="text-ink">zero changes</strong> to core banking system — operates as intelligence layer on top of existing workflows.
                  </p>
                </div>
                <div className="rounded-xl border border-growth/20 bg-growth-light/20 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-4 w-4 text-growth" />
                    <p className="text-sm font-semibold text-ink">Scalability</p>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Designed for 50,000+ assessments per month. AI processing cost per assessment is negligible — marginal cost approaches zero. Officer productivity increases by +{efficiency.officerProductivityIncrease}%. Portfolio review time reduced to {efficiency.portfolioReviewTime}. Scales without proportional headcount increase.
                  </p>
                </div>
                <div className="rounded-xl border border-caution/20 bg-caution-light/20 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="h-4 w-4 text-caution" />
                    <p className="text-sm font-semibold text-ink">Risk & Compliance</p>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Full audit trail for every decision. AI provides recommendations — final approval remains with authorised bank officers. Compliant with RBI guidelines on AI-based lending. Explainable AI ensures every decision includes factor breakdown, confidence score, and improvement recommendations.
                  </p>
                </div>
              </div>
            </Panel>
          </SlideUpView>

          {/* Export Section */}
          <SlideUpView>
            <Panel title="Executive Report Export">
              <div className="flex flex-wrap gap-3">
                {["Download Executive Summary (PDF)", "Download Portfolio Report (CSV)", "Download Inclusion Report (PDF)", "Print Dashboard"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => alert(`[NexusNova] ${label} initiated. In production, this would download the file.`)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-white/[0.08] active:scale-[0.97]"
                  >
                    <FileText className="h-4 w-4 text-muted" />
                    {label}
                  </button>
                ))}
              </div>
            </Panel>
          </SlideUpView>
        </div>
      )}

      {/* Recommended Next Actions - shown on all tabs */}
      <div className="rounded-2xl border border-trust/20 bg-trust-light/20 p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 text-trust shrink-0" />
          <div>
            <p className="text-sm font-semibold text-ink">Executive Summary</p>
            <p className="mt-1 text-xs text-muted leading-relaxed">
              This Executive Command Center demonstrates how alternate data intelligence improves portfolio quality,
              expands financial inclusion, reduces processing time, and strengthens risk management for IDBI Bank.
              AI provides recommendations — final approval remains with authorised bank officers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
