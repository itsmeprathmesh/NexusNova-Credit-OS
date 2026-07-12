"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { applications, msmes } from "@/data/mock-data";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  label: string;
  description: string;
  href: string;
  category: "MSME" | "Application" | "Report";
}

const reportItems: { id: string; label: string; href: string }[] = [
  { id: "portfolio-health", label: "Portfolio Health Report", href: "/reporting/portfolio-health" },
  { id: "sector-analysis", label: "Sector Intelligence Brief", href: "/reporting/sector-analysis" },
  { id: "branch-performance", label: "Branch Performance Review", href: "/reporting/branch-performance" }
];

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const results: SearchResult[] = [];
  const lower = query.toLowerCase();

  if (query.length >= 1) {
    for (const msme of msmes) {
      if (msme.name.toLowerCase().includes(lower) || msme.owner.toLowerCase().includes(lower) || msme.city.toLowerCase().includes(lower)) {
        results.push({ id: msme.id, label: msme.name, description: `${msme.owner} · ${msme.city}`, href: `/portfolio/${msme.id}`, category: "MSME" });
      }
    }
    for (const app of applications) {
      const msme = msmes.find((m) => m.id === app.msmeId);
      if (app.id.toLowerCase().includes(lower) || (msme && msme.name.toLowerCase().includes(lower))) {
        results.push({ id: app.id, label: app.id, description: `${msme?.name ?? "Unknown"} · ${app.product}`, href: `/applications/${app.id}`, category: "Application" });
      }
    }
    for (const report of reportItems) {
      if (report.label.toLowerCase().includes(lower)) {
        results.push({ id: report.id, label: report.label, description: "Pre-built report", href: report.href, category: "Report" });
      }
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-9 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 text-xs text-muted transition-all duration-200 hover:border-trust/30 hover:bg-white/[0.06] hover:text-ink md:w-56 lg:w-64"
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="hidden md:inline">Search applications, MSMEs...</span>
        <span className="ml-auto hidden rounded-lg border border-white/[0.06] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-muted md:inline">⌘K</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[15vh] backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-panel shadow-glass animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-3.5">
              <Search className="h-4 w-4 text-muted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search MSMEs, applications, reports..."
                aria-label="Search"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
              />
              <button type="button" onClick={() => setOpen(false)} aria-label="Clear search" className="rounded-lg p-1.5 text-muted hover:bg-white/[0.06] hover:text-ink transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && query.length >= 1 && (
                <p className="px-3 py-8 text-center text-sm text-muted">No results found for &ldquo;{query}&rdquo;</p>
              )}
              {results.length > 0 && query.length >= 1 && (
                <div className="space-y-0.5">
                  {(["MSME", "Application", "Report"] as const).map((cat) => {
                    const items = results.filter((r) => r.category === cat);
                    if (items.length === 0) return null;
                    return (
                      <div key={cat}>
                        <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">{cat}</p>
                        {items.map((item) => (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-white/[0.04]"
                          >
                            <div className="min-w-0">
                              <p className="font-medium text-ink truncate">{item.label}</p>
                              <p className="text-xs text-muted truncate">{item.description}</p>
                            </div>
                            <span className={cn(
                              "ml-2 shrink-0 rounded-lg border border-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium",
                              cat === "MSME" ? "bg-trust-light text-trust" : cat === "Application" ? "bg-growth-light text-growth" : "bg-white/[0.04] text-muted"
                            )}>
                              {cat}
                            </span>
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
              {query.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-muted">Type to search across MSMEs, applications, and reports</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
