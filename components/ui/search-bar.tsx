"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Command, Sparkles, MonitorPlay, HelpCircle, Settings } from "lucide-react";
import { applications, msmes } from "@/data/mock-data";
import { GUIDES } from "@/features/judge-experience/guide-config";
import { cn } from "@/lib/utils";

interface FeatureItem {
  id: string;
  label: string;
  description: string;
  href: string;
  category: string;
  icon?: string;
  role?: string;
  keywords?: string;
}

const FEATURES: FeatureItem[] = [
  // Customer
  { id: "customer-dashboard", label: "Customer Dashboard", description: "Self-service banking view with application tracking", href: "/customer/dashboard", category: "Customer", keywords: "customer dashboard financial health card status" },
  { id: "business-registration", label: "Business Registration", description: "Register MSME business details and GST info", href: "/customer/business", category: "Customer", keywords: "business registration gst pan registration" },
  { id: "loan-application", label: "Loan Application", description: "Apply for working capital, term loan, or overdraft", href: "/customer/apply", category: "Customer", keywords: "loan apply credit borrow" },
  { id: "document-upload", label: "Document Upload Center", description: "Upload GST, bank statements, ITRs, KYC with AI extraction", href: "/customer/documents", category: "Customer", keywords: "document upload gst itr bank statement kyc" },
  { id: "application-tracker", label: "Application Tracker", description: "Track loan application status with SLA countdown", href: "/customer/status", category: "Customer", keywords: "track application status sla timeline" },
  { id: "ai-assistant", label: "AI Assistant (BANK AI)", description: "Chat with AI for loan queries and document help", href: "/customer/support", category: "Customer", keywords: "chatbot ai support chat" },

  // Loan Officer
  { id: "command-center", label: "Command Center", description: "AI-powered operational hub with alerts and priorities", href: "/command-center?role=loan-officer", category: "Loan Officer", keywords: "dashboard command center alerts priorities" },
  { id: "application-queue", label: "Applications Queue", description: "Review and process loan applications with AI intelligence", href: "/applications?role=loan-officer", category: "Loan Officer", keywords: "applications queue review process" },
  { id: "financial-health-card", label: "MSME Financial Health Card", description: "AI-powered credit assessment with health score and risk band", href: "/applications/app-1001?role=loan-officer", category: "Loan Officer", keywords: "health card credit score risk assessment" },
  { id: "explainable-ai", label: "Explainable AI", description: "View factor contributions, confidence scores, and AI reasoning", href: "/applications/app-1001?role=loan-officer&view=explain", category: "Loan Officer", keywords: "explainable xai explainability factor contribution" },
  { id: "document-intelligence", label: "Document Intelligence", description: "AI document extraction with per-field confidence scoring", href: "/applications/app-1001?role=loan-officer&view=documents", category: "Loan Officer", keywords: "document ocr extraction intelligence" },
  { id: "credit-memo", label: "Credit Memo", description: "AI-generated bank-grade credit memo for approval authorities", href: "/applications/app-1001/production-memo?role=loan-officer", category: "Loan Officer", keywords: "credit memo memo report" },
  { id: "decision-timeline", label: "Decision Timeline", description: "Complete audit trail of the loan decision process", href: "/applications/app-1001/timeline?role=loan-officer", category: "Loan Officer", keywords: "timeline decision audit trail history" },
  { id: "customer-360", label: "Customer 360", description: "Full MSME profile with financials, risk, documents, and history", href: "/portfolio/msme-aurora?role=loan-officer", category: "Loan Officer", keywords: "customer 360 profile drilldown" },
  { id: "alternate-data-dashboard", label: "Alternate Data Dashboard", description: "Alternate data coverage and assessment readiness overview", href: "/applications?role=loan-officer", category: "Loan Officer", keywords: "alternate data coverage readiness" },

  // Manager
  { id: "manager-dashboard", label: "Manager Dashboard", description: "Portfolio-level monitoring with risk alerts and exposure", href: "/command-center?role=manager", category: "Manager", keywords: "manager dashboard risk alerts" },
  { id: "portfolio-intelligence", label: "Portfolio Intelligence", description: "Heatmaps, treemaps, risk migration, and sector analysis", href: "/portfolio?role=manager", category: "Manager", keywords: "portfolio intelligence heatmap risk migration" },
  { id: "financial-inclusion", label: "Financial Inclusion Dashboard", description: "Track credit-inclusive lending metrics and alternate data coverage", href: "/portfolio?role=manager&view=inclusion", category: "Manager", keywords: "financial inclusion coverage diversity" },
  { id: "pending-approvals", label: "Pending Approvals", description: "Review loan applications requiring manager approval", href: "/applications?role=manager", category: "Manager", keywords: "pending approvals review authorize" },

  // Executive
  { id: "executive-dashboard", label: "Executive Dashboard", description: "Board-ready portfolio KPIs and trend visualizations", href: "/reporting/executive?role=manager", category: "Executive", keywords: "executive dashboard board kpi" },
  { id: "executive-analytics", label: "Executive Analytics", description: "Deep portfolio analytics, risk trends, and credit exposure monitoring", href: "/reporting?role=manager&view=analytics", category: "Executive", keywords: "analytics trends exposure" },

  // Reports & Analytics
  { id: "reporting-center", label: "Reporting Center", description: "Self-service reports with AI-generated executive summaries", href: "/reporting?role=manager", category: "Reports", keywords: "reports summaries analytics" },
  { id: "audit-center", label: "Audit Center", description: "Immutable audit logs with AI rationale snapshots", href: "/audit?role=manager", category: "Reports", keywords: "audit trail compliance regulator export" },
  { id: "business-impact", label: "Business Impact", description: "Measurable outcomes: 5 days → 2 hours processing", href: "/business-impact", category: "Reports", keywords: "business impact roi metrics" },
  { id: "ps-3-alignment", label: "PS-3 Alignment", description: "How NexusNova solves IDBI Innovate 2026 PS-3", href: "/ps-3-alignment", category: "Reports", keywords: "ps-3 problem statement alignment" },

  // Settings & Help
  { id: "settings", label: "Settings Center", description: "Profile, notifications, security, demo preferences", href: "/settings", category: "Settings", keywords: "settings preferences profile" },
  { id: "help-center", label: "Help Center", description: "Guides, tutorials, FAQ, glossary, and support", href: "/help", category: "Settings", keywords: "help faq support guide documentation" },
  { id: "notifications", label: "Notification Center", description: "Application updates, AI alerts, risk alerts, approval requests", href: "/notifications", category: "Settings", keywords: "notifications alerts updates" },

  // Demo
  { id: "guided-demo", label: "Guided Demo", description: "24-step interactive product tour across all roles", href: "/", category: "Demo", keywords: "tour demo walkthrough guided" },
  { id: "demo-controls", label: "Demo Controls", description: "Ctrl+Shift+D — persona switching, pause, restart", href: "#demo-controls", category: "Demo", keywords: "demo controls switch persona pause" },
  { id: "demo-complete", label: "Demo Complete", description: "Explore prototype freely after completing the tour", href: "/demo-complete", category: "Demo", keywords: "demo complete finish explore" },
  { id: "judge-mode", label: "Judge Mode", description: "AI explainability overlays with confidence scores", href: "#judge-mode", category: "Demo", keywords: "judge mode debug explainability ai metadata" },

  // Commands
  { id: "cmd-explorer", label: "Feature Explorer", description: "Search any feature, page, or command (Ctrl+K)", href: "#explorer", category: "Commands", keywords: "search explorer find navigate" },
];

const dataResults = (query: string): (FeatureItem & { dataType: string })[] => {
  const lower = query.toLowerCase();
  const results: (FeatureItem & { dataType: string })[] = [];
  for (const msme of msmes) {
    if (msme.name.toLowerCase().includes(lower) || msme.owner.toLowerCase().includes(lower) || msme.city.toLowerCase().includes(lower)) {
      results.push({ id: msme.id, label: msme.name, description: `${msme.owner} · ${msme.city}`, href: `/portfolio/${msme.id}`, category: "Data", keywords: "", dataType: "MSME" });
    }
  }
  for (const app of applications) {
    const msme = msmes.find((m) => m.id === app.msmeId);
    if (app.id.toLowerCase().includes(lower) || (msme && msme.name.toLowerCase().includes(lower))) {
      results.push({ id: app.id, label: app.id, description: `${msme?.name ?? "Unknown"} · ${app.product}`, href: `/applications/${app.id}`, category: "Data", keywords: "", dataType: "Application" });
    }
  }
  return results;
};

function categoryColor(cat: string) {
  const colors: Record<string, string> = {
    Customer: "bg-trust-light text-trust",
    "Loan Officer": "bg-growth-light text-growth",
    Manager: "bg-caution-light text-caution",
    Executive: "bg-white/[0.04] text-muted",
    Reports: "bg-trust-light text-trust",
    Settings: "bg-white/[0.04] text-muted",
    Demo: "bg-white/[0.04] text-muted",
    Data: "bg-white/[0.04] text-muted",
    Commands: "bg-white/[0.04] text-muted",
  };
  return cn("shrink-0 rounded-lg border border-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium", colors[cat] ?? "bg-white/[0.04] text-muted");
}

const CATEGORY_ORDER = ["Commands", "Customer", "Loan Officer", "Manager", "Executive", "Reports", "Settings", "Demo", "Data"];

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setOpen((v) => !v);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allResults = useMemo(() => {
    const lower = query.toLowerCase();
    if (!lower) return [];
    const featureHits = FEATURES.filter((f) =>
      f.label.toLowerCase().includes(lower) ||
      f.description.toLowerCase().includes(lower) ||
      (f.keywords && f.keywords.includes(lower)) ||
      f.category.toLowerCase().includes(lower)
    );
    const dataHits = dataResults(query);
    const combined = [...featureHits, ...dataHits];
    return combined;
  }, [query]);

  const grouped = useMemo(() => {
    const groups = new Map<string, typeof allResults>();
    for (const r of allResults) {
      const cat = (r as any).dataType || r.category;
      const existing = groups.get(cat) || [];
      existing.push(r);
      groups.set(cat, existing);
    }
    const sorted = CATEGORY_ORDER.filter((c) => groups.has(c));
    const remaining = Array.from(groups.keys()).filter((c) => !CATEGORY_ORDER.includes(c)).sort();
    return [...sorted, ...remaining].map((c) => ({ category: c, items: groups.get(c)! }));
  }, [allResults]);

  const totalItems = allResults.length;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!listRef.current || selectedIndex < 0) return;
    const selected = listRef.current.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`);
    selected?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((prev) => Math.min(prev + 1, totalItems - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((prev) => Math.max(prev - 1, 0)); }
    if (e.key === "Enter" && selectedIndex >= 0 && selectedIndex < totalItems) {
      e.preventDefault();
      const item = allResults[selectedIndex];
      if (item.href.startsWith("#")) {
        if (item.id === "judge-mode") {
          document.dispatchEvent(new CustomEvent("toggle-judge-mode"));
        }
        if (item.id === "cmd-explorer") { setOpen(false); return; }
        if (item.id === "demo-controls") {
          document.dispatchEvent(new CustomEvent("toggle-demo-controls"));
        }
        setOpen(false);
        return;
      }
      router.push(item.href);
      setOpen(false);
    }
  }, [selectedIndex, totalItems, allResults, router]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-9 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 text-xs text-muted transition-all duration-200 hover:border-trust/30 hover:bg-white/[0.06] hover:text-ink md:w-56 lg:w-64"
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="hidden md:inline">Search features, pages, data...</span>
        <span className="ml-auto hidden rounded-lg border border-white/[0.06] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-muted md:inline">⌘K</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[12vh] backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-xl rounded-2xl border border-white/[0.08] bg-panel shadow-glass animate-slide-up"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-3.5">
              <Search className="h-4 w-4 text-muted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search features, MSMEs, applications, commands..."
                aria-label="Feature Explorer"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
              />
              <div className="flex items-center gap-1.5">
                <kbd className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-mono text-muted">Esc</kbd>
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-lg p-1.5 text-muted hover:bg-white/[0.06] hover:text-ink transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div ref={listRef} className="max-h-96 overflow-y-auto p-2">
              {!query && (
                <div className="px-3 py-8 text-center">
                  <Sparkles className="mx-auto h-6 w-6 text-trust mb-3" />
                  <p className="text-sm text-muted">Search across 30+ features, MSMEs, applications, and commands</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {["Customer", "Loan Officer", "Manager", "Settings", "Demo"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setQuery(cat.toLowerCase())}
                        className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium text-muted transition-colors hover:bg-white/[0.04] hover:text-ink"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query && totalItems === 0 && (
                <p className="px-3 py-8 text-center text-sm text-muted">
                  No results for &ldquo;{query}&rdquo;. Try searching for a feature name, role, or page.
                </p>
              )}

              {totalItems > 0 && (
                <div className="space-y-1">
                  {grouped.map(({ category, items }) => (
                    <div key={category}>
                      <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">{category}</p>
                      {items.map((item, i) => {
                        const globalIndex = allResults.indexOf(item);
                        const isData = (item as any).dataType;
                        return (
                          <Link
                            key={`${item.id}-${category}`}
                            href={item.href.startsWith("#") ? "#" : item.href}
                            data-index={globalIndex}
                            onClick={(e) => {
                              if (item.href.startsWith("#")) {
                                e.preventDefault();
                                if (item.id === "judge-mode") document.dispatchEvent(new CustomEvent("toggle-judge-mode"));
                                if (item.id === "demo-controls") document.dispatchEvent(new CustomEvent("toggle-demo-controls"));
                                setOpen(false);
                              }
                            }}
                            className={cn(
                              "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors",
                              selectedIndex === globalIndex ? "bg-trust-light/40" : "hover:bg-white/[0.04]"
                            )}
                          >
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-ink truncate">{item.label}</p>
                              <p className="text-xs text-muted truncate">{item.description}</p>
                            </div>
                            {isData ? (
                              <span className={cn("ml-2 shrink-0 rounded-lg border border-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium", isData === "MSME" ? "bg-trust-light text-trust" : "bg-growth-light text-growth")}>
                                {(item as any).dataType}
                              </span>
                            ) : (
                              <span className={cn("ml-2", categoryColor(item.category))}>{item.category}</span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 border-t border-white/[0.06] px-5 py-2.5 text-[10px] text-muted">
              <span className="flex items-center gap-1"><kbd className="rounded border border-white/[0.1] bg-white/[0.04] px-1 py-0.5 font-mono">↑↓</kbd> Navigate</span>
              <span className="flex items-center gap-1"><kbd className="rounded border border-white/[0.1] bg-white/[0.04] px-1 py-0.5 font-mono">↵</kbd> Open</span>
              <span className="flex items-center gap-1"><kbd className="rounded border border-white/[0.1] bg-white/[0.04] px-1 py-0.5 font-mono">Esc</kbd> Close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
