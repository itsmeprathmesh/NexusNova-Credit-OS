"use client";

import {
  Activity,
  BarChart3,
  Brain,
  Building2,
  FileText,
  Layers,
  Lightbulb,
  Share2,
  Smartphone,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/glass-panel";

const cards = [
  {
    icon: Activity,
    title: "What is a Financial Health Card?",
    body: "An AI-powered unified score that aggregates your business data from GST, UPI, bank accounts, EPFO, and utility bills into a single credit assessment — without requiring ITR or audited financials.",
    gradient: "from-trust/20 to-trust/5",
  },
  {
    icon: Lightbulb,
    title: "Why is alternate data important?",
    body: "Over 80% of Indian MSMEs lack formal credit history. Alternate data (GST filings, UPI collections, EPFO payroll, utility payments) creates a financial footprint where none existed before.",
    gradient: "from-growth/20 to-growth/5",
  },
  {
    icon: Brain,
    title: "Why do banks use AI?",
    body: "AI evaluates thousands of data points in seconds — revenue trends, compliance patterns, cash flow stability, and digital behaviour. This enables fairer, faster credit decisions than manual underwriting.",
    gradient: "from-violet-500/20 to-violet-500/5",
  },
  {
    icon: Building2,
    title: "How does Account Aggregator help?",
    body: "Account Aggregator (AA) is a RBI-regulated framework that lets you share your banking data securely. No more collecting physical bank statements — AA connects your accounts in one click.",
    gradient: "from-orange-500/20 to-amber-500/5",
  },
  {
    icon: Zap,
    title: "What is ULI?",
    body: "Unified Lending Interface (ULI) is RBI's upcoming platform for seamless data sharing across GSTN, banks, and credit bureaus. It will make loan applications instant and paperless.",
    gradient: "from-cyan-500/20 to-teal-500/5",
  },
  {
    icon: Share2,
    title: "What is OCEN?",
    body: "Open Credit Enablement Network (OCEN) is a protocol that connects lenders, marketplaces, and MSMEs. It enables embedded lending — get a loan offer while running your business.",
    gradient: "from-pink-500/20 to-rose-500/5",
  },
];

export function EducationCards({ className }: { className?: string }) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-trust" />
        <h2 className="text-lg font-semibold text-ink">Understanding Your Financial Journey</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <GlassPanel key={card.title} className="p-5">
              <div className={cn("grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br border border-white/[0.06]", card.gradient)}>
                <Icon className="h-5 w-5 text-ink" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-ink">{card.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">{card.body}</p>
            </GlassPanel>
          );
        })}
      </div>
    </section>
  );
}
