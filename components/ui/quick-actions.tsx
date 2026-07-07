"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText, Plus, Search, TrendingUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  { label: "New Loan Application", href: "/applications", icon: Plus, description: "Create a new loan application" },
  { label: "Search Records", href: "#", icon: Search, description: "Search across the platform", shortcut: "⌘K" },
  { label: "Portfolio View", href: "/portfolio", icon: TrendingUp, description: "View portfolio intelligence" },
  { label: "Generate Credit Memo", href: "/reporting", icon: FileText, description: "Generate a credit memo report" }
];

export function QuickActions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {open && (
        <div className="mb-2 w-64 space-y-1 rounded-2xl border border-white/[0.08] bg-panel p-2 shadow-glass animate-scale-in">
          {actions.map((action) => {
            const Icon = action.icon;
            if (action.href === "#") {
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => {
                    const event = new KeyboardEvent("keydown", { metaKey: true, key: "k" });
                    window.dispatchEvent(event);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-white/[0.04]"
                >
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/[0.04] text-trust">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="font-medium text-ink">{action.label}</p>
                    <p className="text-xs text-muted">{action.description}</p>
                  </div>
                  {action.shortcut && <span className="shrink-0 rounded-lg border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-[10px] text-muted">{action.shortcut}</span>}
                </button>
              );
            }
            return (
              <Link
                key={action.label}
                href={action.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-white/[0.04]"
              >
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/[0.04] text-trust">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink">{action.label}</p>
                  <p className="text-xs text-muted">{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "grid h-12 w-12 place-items-center rounded-2xl text-canvas shadow-glass transition-all duration-200 active:scale-90",
          open ? "bg-muted rotate-45" : "bg-trust hover:shadow-[0_0_30px_rgba(216,255,62,0.25)]"
        )}
        aria-label="Quick actions"
      >
        {open ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
      </button>
    </div>
  );
}
