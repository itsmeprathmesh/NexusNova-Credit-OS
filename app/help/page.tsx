"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  HelpCircle,
  Keyboard,
  MonitorPlay,
  BookOpen,
  PlayCircle,
  Bot,
  Headphones,
  FileText,
  BookMarked,
  Sparkles,
  ChevronRight,
  X,
  ArrowLeft,
  Lightbulb,
  ExternalLink,
  CheckCircle2,
  Eye,
  RefreshCw,
  Shield,
  Activity,
  BarChart3,
  Users,
  Briefcase,
  LayoutDashboard,
  ClipboardList,
  Globe,
  Target,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/primitives";
import { useAuth } from "@/contexts/auth-context";
import { useJudge, GUIDES } from "@/features/judge-experience";
import { useDemoMode } from "@/contexts/demo-mode";
import { useDemoSession } from "@/contexts/demo-session";

const faqs = [
  { q: "How does NexusNova assess credit-invisible MSMEs?", a: "NexusNova uses alternate data — GST returns, UPI transactions, Account Aggregator bank statements, EPFO payroll data, and utility bills — to build a comprehensive Financial Health Card for each MSME, replacing traditional credit scores and ITR-based assessments." },
  { q: "What is the Financial Health Card?", a: "A single-page AI-powered credit assessment that shows health score (0-100), risk band, recommended credit limit, and factor contribution analysis. It replaces 20+ pages of traditional financial analysis." },
  { q: "How accurate is the AI assessment?", a: "Our AI achieves 96% confidence on average for MSMEs with 4+ alternate data sources connected. Each assessment includes confidence scores, factor contributions, and uncertainty indicators for complete transparency." },
  { q: "What documents do MSMEs need to submit?", a: "No traditional documents required. MSMEs connect their digital footprint through GST, UPI, Account Aggregator, EPFO, and utility providers. Optional documents include existing bank statements and ITRs." },
  { q: "How does the AI Credit Committee work?", a: "Three AI personas (Risk Officer, Business Growth, Compliance) independently evaluate each application, then reach a consensus. Each persona provides evidence-based recommendations with confidence scores." },
  { q: "What is Judge Mode?", a: "Judge Mode overlays AI explainability metadata directly on the interface — showing confidence scores, OCR results, validation status, and AI recommendations for every decision point." },
  { q: "Can loan officers override AI recommendations?", a: "Yes. AI recommends — humans decide. Loan officers can approve, reduce, reject, request documents, or escalate. Every override is recorded with rationale in the immutable audit trail." },
  { q: "How is portfolio risk monitored?", a: "The Early Warning System continuously monitors all MSMEs for deterioration signals. Portfolio health scores, risk migration tracking, and dynamic credit limits provide proactive risk management." },
];

const glossary = [
  { term: "Alternate Data", def: "Non-traditional financial data sources (GST, UPI, AA, EPFO, Utility) used to assess creditworthiness of MSMEs without formal credit history." },
  { term: "Financial Health Card", def: "AI-generated unified credit assessment showing health score, risk band, credit limit, and factor contribution for a single MSME." },
  { term: "Credit-Invisible MSME", def: "Micro, Small, or Medium Enterprise with no traditional credit score, ITR, or audited financials — making up ~60% of Indian MSMEs." },
  { term: "Account Aggregator (AA)", def: "RBI-regulated data-sharing framework that allows MSMEs to securely share their bank account data with NexusNova." },
  { term: "AI Credit Committee", def: "Three AI personas (Risk Officer, Business Growth, Compliance) that independently evaluate and vote on loan applications." },
  { term: "Judge Mode", def: "Debug and explainability overlay that surfaces AI confidence scores, OCR results, and validation metadata throughout the interface." },
  { term: "Dynamic Credit Limit", def: "AI-adjusted credit limit that changes based on real-time alternate data signals, cash flow patterns, and portfolio risk." },
  { term: "NTC/NTB Detection", def: "New-To-Credit / New-To-Bank identification — AI flags MSMEs without prior credit history for specialised assessment." },
  { term: "Early Warning System", def: "Proactive risk monitoring that detects MSME deterioration signals 2-3 months before traditional indicators." },
  { term: "Explainable AI (XAI)", def: "Transparent AI decisions showing factor contribution, confidence scores, and reasoning — satisfying RBI guidelines on responsible AI." },
];

const shortcuts = [
  { key: "?", desc: "Toggle Help Center" },
  { key: "Ctrl+K", desc: "Open search" },
  { key: "D", desc: "Toggle demo mode" },
  { key: "J", desc: "Toggle judge mode" },
  { key: "H", desc: "Go to home" },
  { key: "Ctrl+Shift+D", desc: "Toggle Demo Control Center" },
  { key: "1", desc: "Go to Command Center" },
  { key: "2", desc: "Go to Applications" },
  { key: "3", desc: "Go to Portfolio" },
  { key: "4", desc: "Go to Audit" },
  { key: "5", desc: "Go to Reporting" },
  { key: "Esc", desc: "Close modal or walkthrough" },
];

const videos = [
  { title: "Getting Started with NexusNova", duration: "4:32", desc: "Overview of the platform and key features for loan officers and managers." },
  { title: "MSME Onboarding Walkthrough", duration: "6:15", desc: "Step-by-step guide to onboarding a credit-invisible MSME through alternate data." },
  { title: "Using the Financial Health Card", duration: "5:48", desc: "How to read and interpret the AI-powered Financial Health Card for credit decisions." },
  { title: "AI Credit Committee Explained", duration: "7:22", desc: "Deep dive into how the three AI personas evaluate and reach consensus on applications." },
  { title: "Portfolio Intelligence Dashboard", duration: "8:05", desc: "Monitoring portfolio health, risk migration, and early warning signals." },
  { title: "Judge Mode & AI Explainability", duration: "3:55", desc: "Using Judge Mode to understand AI decisions with full transparency." },
];

type HelpSection = "all" | "faq" | "shortcuts" | "videos" | "guides" | "walkthrough" | "ai-assistant" | "support" | "docs" | "glossary";

export default function HelpPage() {
  const { user } = useAuth();
  const { startTour, toggleJudgeMode, isJudgeMode } = useJudge();
  const { toggleDemoMode, isDemoMode } = useDemoMode();
  const { startDemoSession } = useDemoSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<HelpSection>("all");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedGlossary, setExpandedGlossary] = useState<string | null>(null);

  const role = user?.role ?? "loan-officer";

  const sections: { id: HelpSection; label: string; icon: typeof HelpCircle }[] = [
    { id: "faq", label: "FAQ", icon: HelpCircle },
    { id: "shortcuts", label: "Keyboard Shortcuts", icon: Keyboard },
    { id: "videos", label: "Video Tutorials", icon: MonitorPlay },
    { id: "guides", label: "Feature Guides", icon: BookOpen },
    { id: "walkthrough", label: "Walkthrough", icon: PlayCircle },
    { id: "ai-assistant", label: "AI Assistant", icon: Bot },
    { id: "support", label: "Contact Support", icon: Headphones },
    { id: "docs", label: "Documentation", icon: FileText },
    { id: "glossary", label: "Glossary", icon: BookMarked },
  ];

  const filteredFaqs = useMemo(() => {
    if (!searchQuery) return faqs;
    const q = searchQuery.toLowerCase();
    return faqs.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredGuides = useMemo(() => {
    if (!searchQuery) return GUIDES;
    const q = searchQuery.toLowerCase();
    return GUIDES.filter((g) => g.title.toLowerCase().includes(q) || g.purpose.toLowerCase().includes(q) || g.aiFeatures.some((f) => f.toLowerCase().includes(q)));
  }, [searchQuery]);

  const filteredGlossary = useMemo(() => {
    if (!searchQuery) return glossary;
    const q = searchQuery.toLowerCase();
    return glossary.filter((g) => g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredVideos = useMemo(() => {
    if (!searchQuery) return videos;
    const q = searchQuery.toLowerCase();
    return videos.filter((v) => v.title.toLowerCase().includes(q) || v.desc.toLowerCase().includes(q));
  }, [searchQuery]);

  const showAll = activeSection === "all";

  return (
    <AppShell active="command-center" role={role}>
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-trust-light text-trust">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-ink">Help Center</h1>
              <p className="text-sm text-muted">Guides, tutorials, and support for the NexusNova platform</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles, guides, FAQs..."
              aria-label="Search help articles"
              className="min-h-11 w-full rounded-xl border border-white/[0.1] bg-white/[0.02] pl-10 pr-10 text-sm text-ink outline-none transition-all focus:border-trust focus:ring-1 focus:ring-trust/20 placeholder:text-muted/40"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <nav className="shrink-0 lg:w-52" aria-label="Help sections">
            <div className="space-y-0.5 rounded-2xl border border-white/[0.06] bg-surface/50 p-1.5 sticky top-24">
              <button
                type="button"
                onClick={() => { setActiveSection("all"); setSearchQuery(""); }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  activeSection === "all" ? "bg-trust-light text-trust font-medium" : "text-muted hover:bg-white/[0.04] hover:text-ink"
                }`}
              >
                <Sparkles className="h-4 w-4 shrink-0" />
                <span>All Help</span>
              </button>
              <div className="my-1 border-t border-white/[0.06]" />
              {sections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setActiveSection(isActive ? "all" : sec.id)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all ${
                      isActive ? "bg-trust-light text-trust font-medium" : "text-muted hover:bg-white/[0.04] hover:text-ink"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{sec.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Content */}
          <div className="min-w-0 flex-1 space-y-6">
            {/* Context-aware section */}
            {showAll && (
              <GlassPanel variant="strong" className="p-5 border-l-2 border-l-trust">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-trust shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-base font-semibold text-ink">Context-Aware Help</h2>
                    <p className="text-sm text-muted mt-1">
                      Help content adapts to your current page. Press <kbd className="rounded border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 text-xs font-mono">?</kbd> anytime for page-specific guidance, or use the floating help panel in the bottom-right corner.
                    </p>
                  </div>
                </div>
              </GlassPanel>
            )}

            {/* FAQ */}
            {(showAll || activeSection === "faq") && (
              <GlassPanel variant="strong" className="p-6" id="faq">
                <div className="flex items-center gap-2 mb-5">
                  <HelpCircle className="h-4 w-4 text-trust" />
                  <h2 className="text-lg font-semibold text-ink">Frequently Asked Questions</h2>
                </div>
                {filteredFaqs.length === 0 ? (
                  <p className="text-sm text-muted">No FAQs match your search.</p>
                ) : (
                  <div className="space-y-2">
                    {filteredFaqs.map((faq, i) => {
                      const isOpen = expandedFaq === i;
                      return (
                        <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setExpandedFaq(isOpen ? null : i)}
                            className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium text-ink transition-colors hover:bg-white/[0.02]"
                          >
                            <span>{faq.q}</span>
                            <ChevronRight className={`h-4 w-4 shrink-0 text-muted transition-transform ${isOpen ? "rotate-90" : ""}`} />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <p className="px-4 pb-4 text-sm text-muted leading-relaxed">{faq.a}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
              </GlassPanel>
            )}

            {/* Keyboard Shortcuts */}
            {(showAll || activeSection === "shortcuts") && (
              <GlassPanel variant="strong" className="p-6" id="shortcuts">
                <div className="flex items-center gap-2 mb-5">
                  <Keyboard className="h-4 w-4 text-trust" />
                  <h2 className="text-lg font-semibold text-ink">Keyboard Shortcuts</h2>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {shortcuts.map((s) => (
                    <div key={s.key} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                      <span className="text-sm text-ink">{s.desc}</span>
                      <kbd className="shrink-0 rounded-lg border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 text-xs font-mono text-muted">{s.key}</kbd>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            )}

            {/* Video Tutorials */}
            {(showAll || activeSection === "videos") && (
              <GlassPanel variant="strong" className="p-6" id="videos">
                <div className="flex items-center gap-2 mb-5">
                  <MonitorPlay className="h-4 w-4 text-trust" />
                  <h2 className="text-lg font-semibold text-ink">Video Tutorials</h2>
                </div>
                {filteredVideos.length === 0 ? (
                  <p className="text-sm text-muted">No videos match your search.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {filteredVideos.map((v) => (
                      <div key={v.title} className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-trust/20 hover:bg-trust-light/10 cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-trust-light/40 text-trust">
                            <PlayCircle className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-ink truncate">{v.title}</p>
                            <p className="text-xs text-muted">{v.duration}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted leading-relaxed">{v.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </GlassPanel>
            )}

            {/* Feature Guides */}
            {(showAll || activeSection === "guides") && (
              <GlassPanel variant="strong" className="p-6" id="guides">
                <div className="flex items-center gap-2 mb-5">
                  <BookOpen className="h-4 w-4 text-trust" />
                  <h2 className="text-lg font-semibold text-ink">Feature Guides</h2>
                </div>
                {filteredGuides.length === 0 ? (
                  <p className="text-sm text-muted">No guides match your search.</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {filteredGuides.map((guide) => {
                      const Icon = getGuideIcon(guide.icon);
                      return (
                        <div key={guide.path} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.12]">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-trust-light/30 text-trust">
                              <Icon className="h-4 w-4" />
                            </div>
                            <p className="text-sm font-medium text-ink">{guide.title}</p>
                          </div>
                          <p className="text-xs text-muted leading-relaxed">{guide.purpose}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {guide.aiFeatures.slice(0, 3).map((f) => (
                              <span key={f} className="rounded-md bg-trust-light/10 px-1.5 py-0.5 text-[9px] font-medium text-trust">{f}</span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </GlassPanel>
            )}

            {/* Interactive Walkthrough */}
            {(showAll || activeSection === "walkthrough") && (
              <GlassPanel variant="strong" className="p-6 border-l-2 border-l-growth" id="walkthrough">
                <div className="flex items-start gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-growth/10 text-growth">
                    <PlayCircle className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-ink">Interactive Walkthrough</h2>
                    <p className="text-sm text-muted mt-1">
                      Take a guided tour of the entire NexusNova platform. The walkthrough covers 12 feature stops —
                      from MSME onboarding through the Financial Health Card, AI Credit Committee, and Manager Dashboard.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => { startDemoSession(); startTour(); router.push("/"); }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-growth px-4 py-2.5 text-sm font-semibold text-canvas shadow-glow transition-all hover:shadow-[0_0_30px_rgba(216,255,62,0.25)] active:scale-[0.97]"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Start Guided Tour
                      </button>
                      <button
                        type="button"
                        onClick={() => { if (isDemoMode) { toggleDemoMode(); router.push("/"); } else { startDemoSession(); router.push("/"); } }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-ink transition-all hover:bg-white/[0.08] active:scale-[0.97]"
                      >
                        <RefreshCw className="h-4 w-4" />
                        {isDemoMode ? "Exit Demo Mode" : "Launch Demo"}
                      </button>
                    </div>
                  </div>
                </div>
              </GlassPanel>
            )}

            {/* AI Assistant */}
            {(showAll || activeSection === "ai-assistant") && (
              <GlassPanel variant="strong" className="p-6" id="ai-assistant">
                <div className="flex items-center gap-2 mb-5">
                  <Bot className="h-4 w-4 text-trust" />
                  <h2 className="text-lg font-semibold text-ink">AI Assistant</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-muted leading-relaxed">
                    NexusNova is powered by 9 AI engines that work together to assess creditworthiness,
                    detect fraud, monitor risk, and provide explainable recommendations. Enable <strong>Judge Mode</strong> to see AI metadata on every page.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { icon: Eye, label: "Judge Mode", desc: "Toggle AI explainability overlays" },
                      { icon: Sparkles, label: "AI Insights", desc: "Confidence scores & factor contribution" },
                      { icon: Shield, label: "Fraud Detection", desc: "Document tampering & forgery analysis" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => { if (item.label === "Judge Mode") toggleJudgeMode(); }}
                          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-all hover:border-trust/20 hover:bg-trust-light/10"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <Icon className="h-4 w-4 text-trust" />
                            <p className="text-sm font-medium text-ink">{item.label}</p>
                            {item.label === "Judge Mode" && (
                              <Badge tone={isJudgeMode ? "success" : "neutral"}>{isJudgeMode ? "On" : "Off"}</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted">{item.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </GlassPanel>
            )}

            {/* Contact Support */}
            {(showAll || activeSection === "support") && (
              <GlassPanel variant="strong" className="p-6" id="support">
                <div className="flex items-center gap-2 mb-5">
                  <Headphones className="h-4 w-4 text-trust" />
                  <h2 className="text-lg font-semibold text-ink">Contact Support</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Email Support", desc: "Get help within 24 hours", action: "support@nexusnova.com" },
                    { label: "Live Chat", desc: "Available 9 AM - 6 PM IST", action: "Start chat" },
                    { label: "Phone Support", desc: "Priority support for urgent issues", action: "+91 1800 123 4567" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <p className="text-sm font-medium text-ink">{item.label}</p>
                      <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                      <p className="text-xs text-trust mt-2 font-medium">{item.action}</p>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            )}

            {/* Documentation */}
            {(showAll || activeSection === "docs") && (
              <GlassPanel variant="strong" className="p-6" id="docs">
                <div className="flex items-center gap-2 mb-5">
                  <FileText className="h-4 w-4 text-trust" />
                  <h2 className="text-lg font-semibold text-ink">Documentation</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { title: "User Guide", desc: "Complete platform documentation for all user roles", pages: 48 },
                    { title: "API Reference", desc: "Integration documentation for developers", pages: 32 },
                    { title: "Admin Manual", desc: "System administration and configuration guide", pages: 24 },
                    { title: "Release Notes", desc: "Version history and changelog", pages: 12 },
                  ].map((doc) => (
                    <div key={doc.title} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.12]">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink">{doc.title}</p>
                        <p className="text-xs text-muted mt-0.5">{doc.desc}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-muted">{doc.pages} pages</span>
                        <ExternalLink className="h-3.5 w-3.5 text-muted" />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            )}

            {/* Glossary */}
            {(showAll || activeSection === "glossary") && (
              <GlassPanel variant="strong" className="p-6" id="glossary">
                <div className="flex items-center gap-2 mb-5">
                  <BookMarked className="h-4 w-4 text-trust" />
                  <h2 className="text-lg font-semibold text-ink">Glossary</h2>
                </div>
                {filteredGlossary.length === 0 ? (
                  <p className="text-sm text-muted">No glossary terms match your search.</p>
                ) : (
                  <div className="space-y-2">
                    {filteredGlossary.map((entry) => {
                      const isOpen = expandedGlossary === entry.term;
                      return (
                        <div key={entry.term} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setExpandedGlossary(isOpen ? null : entry.term)}
                            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-ink transition-colors hover:bg-white/[0.02]"
                          >
                            <span>{entry.term}</span>
                            <ChevronRight className={`h-4 w-4 shrink-0 text-muted transition-transform ${isOpen ? "rotate-90" : ""}`} />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <p className="px-4 pb-4 text-sm text-muted leading-relaxed">{entry.def}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
              </GlassPanel>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function getGuideIcon(icon: string | undefined) {
  const map: Record<string, typeof HelpCircle> = {
    "layout-dashboard": LayoutDashboard,
    "clipboard-list": ClipboardList,
    "briefcase": Briefcase,
    "file-text": FileText,
    "bar-chart": BarChart3,
    "activity": Activity,
    "users": Users,
    "eye": Eye,
    "shield": Shield,
    "globe": Globe,
    "target": Target,
  };
  return icon ? map[icon] ?? HelpCircle : HelpCircle;
}
