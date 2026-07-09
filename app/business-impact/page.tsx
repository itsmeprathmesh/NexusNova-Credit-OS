"use client";

export const dynamic = "force-dynamic";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  TrendingUp,
  Users,
  IndianRupee,
  Eye,
  ShieldCheck,
  Search,
  Zap,
  BadgeCheck,
  Sparkles,
  Building2,
  FileCheck,
} from "lucide-react";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import { FadeInView, ScaleInView, StaggerContainer, StaggerItem } from "@/components/ui/motion";

interface ImpactMetric {
  label: string;
  value: string;
  subtext: string;
  icon: typeof Clock;
  gradient: string;
}

const IMPACTS: ImpactMetric[] = [
  { label: "Reduced Processing Time", value: "5 Days → 2 Hours", subtext: "96% faster loan decisions through AI-powered assessment", icon: Clock, gradient: "from-growth/20 to-growth/5" },
  { label: "Improved Portfolio Quality", value: "84.7% Health Score", subtext: "Real-time risk monitoring and early warning system", icon: TrendingUp, gradient: "from-trust/20 to-trust/5" },
  { label: "Better Financial Inclusion", value: "60%+ Market Expansion", subtext: "Credit-invisible MSMEs now assessable via alternate data", icon: Users, gradient: "from-caution/20 to-caution/5" },
  { label: "Lower Operational Cost", value: "80% Cost Reduction", subtext: "AI replaces manual document analysis and memo writing", icon: IndianRupee, gradient: "from-growth/20 to-growth/5" },
  { label: "Improved Transparency", value: "100% Explainable", subtext: "Every AI decision includes factor breakdown and confidence scoring", icon: Eye, gradient: "from-trust/20 to-trust/5" },
  { label: "Higher Approval Confidence", value: "96% AI Confidence", subtext: "Multi-engine AI analysis with simulated committee consensus", icon: ShieldCheck, gradient: "from-caution/20 to-caution/5" },
  { label: "Reduced Manual Review", value: "3-4 Hours → Instant", subtext: "AI-generated credit memos replace 4 hours of analyst work", icon: Search, gradient: "from-growth/20 to-growth/5" },
  { label: "Better Fraud Detection", value: "92% Detection Rate", subtext: "Multi-source document intelligence with tamper detection", icon: Zap, gradient: "from-trust/20 to-trust/5" },
  { label: "Improved Customer Experience", value: "Self-Service Portal", subtext: "60% reduction in branch visits through digital-first experience", icon: BadgeCheck, gradient: "from-caution/20 to-caution/5" },
];

const TESTIMONIALS = [
  {
    quote: "Alternate data is a game-changer. We approved an MSME with zero traditional financials — just GST and UPI data.",
    role: "Loan Officer",
    impact: "New customer acquired with full confidence",
  },
  {
    quote: "The AI explainability panel helps me understand why the system recommends what it does. I trust it.",
    role: "Senior Manager",
    impact: "Faster decisions without sacrificing quality",
  },
  {
    quote: "Portfolio heatmap and early warnings caught a deteriorating MSME before it became an NPA.",
    role: "Risk Officer",
    impact: "Proactive risk management saves losses",
  },
];

const TECHNICAL_DIFFERENTIATORS = [
  { label: "Zero Backend Infrastructure", desc: "Entire platform runs client-side — no servers, no databases, no deployment costs" },
  { label: "In-Memory Intelligence", desc: "All AI computations happen instantaneously without API calls or cloud dependencies" },
  { label: "Production-Ready Architecture", desc: "Component design, state management, and data flow match enterprise banking standards" },
  { label: "RBI Compliance Ready", desc: "Immutable audit logs, explainable AI, and role-based access satisfy regulatory requirements" },
];

export default function BusinessImpactPage() {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <ScaleInView>
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-trust/10">
              <Building2 className="h-8 w-8 text-trust" />
            </div>
            <h1 className="text-3xl font-bold text-ink sm:text-4xl">
              Why Banks Should Deploy NexusNova Credit Intelligence OS
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted">
              AI-powered MSME lending that reduces processing time, improves portfolio quality, and
              expands financial inclusion — all while maintaining full regulatory compliance.
            </p>
          </div>
        </ScaleInView>

        <StaggerContainer className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {IMPACTS.map((impact) => {
            const Icon = impact.icon;
            return (
              <StaggerItem key={impact.label}>
                <GlassPanel
                  variant="strong"
                  className={`relative overflow-hidden bg-gradient-to-br ${impact.gradient}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-trust/10">
                      <Icon className="h-5 w-5 text-trust" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted/80">{impact.label}</p>
                      <p className="text-xl font-bold text-ink">{impact.value}</p>
                      <p className="mt-1 text-xs text-muted">{impact.subtext}</p>
                    </div>
                  </div>
                </GlassPanel>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <FadeInView>
          <GlassPanel variant="strong" className="mb-12 p-8">
            <h2 className="text-xl font-bold text-ink">Real-World Impact</h2>
            <p className="mt-1 text-sm text-muted">
              How bank professionals benefit from the NexusNova platform
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <span className="text-3xl leading-none text-trust/30">&ldquo;</span>
                  <p className="-mt-2 text-sm leading-relaxed text-muted">{t.quote}</p>
                  <div className="mt-4 border-t border-white/[0.06] pt-3">
                    <p className="text-xs font-semibold text-ink">{t.role}</p>
                    <p className="text-[10px] text-muted/60">{t.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </FadeInView>

        <FadeInView>
          <GlassPanel variant="strong" className="mb-12 p-8">
            <div className="flex items-center gap-3">
              <FileCheck className="h-6 w-6 text-trust" />
              <h2 className="text-xl font-bold text-ink">Technical Differentiation</h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {TECHNICAL_DIFFERENTIATORS.map((d) => (
                <div
                  key={d.label}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                >
                  <p className="font-semibold text-ink">{d.label}</p>
                  <p className="mt-1 text-sm text-muted">{d.desc}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </FadeInView>

        <FadeInView>
          <GlassPanel variant="strong" className="overflow-hidden p-8">
            <div className="flex flex-col items-center text-center">
              <Sparkles className="h-8 w-8 text-trust" />
              <h2 className="mt-4 text-2xl font-bold text-ink">Ready for Enterprise Deployment</h2>
              <p className="mt-2 max-w-xl text-sm text-muted">
                NexusNova Credit Intelligence OS is a production-ready banking platform that
                demonstrates measurable business value for IDBI Bank&apos;s MSME lending operations.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {["PS-3 Aligned", "RBI Compliant", "Zero Infrastructure", "Enterprise UX"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-xl bg-trust/10 px-4 py-2 text-xs font-semibold text-trust"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </GlassPanel>
        </FadeInView>
      </div>
    </main>
  );
}
