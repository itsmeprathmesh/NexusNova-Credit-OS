"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  CheckCheck,
  Search,
  X,
  CheckCircle2,
  AlertTriangle,
  FileText,
  TrendingUp,
  ShieldAlert,
  Activity,
  Eye,
  IndianRupee,
  Ban,
  ChevronRight,
  Clock,
  Filter,
  Inbox,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { BackButton } from "@/components/ui/back-button";
import { PagePurpose } from "@/components/ui/page-purpose";
import { SmartActionBar } from "@/components/ui/smart-action-bar";
import { useAuth } from "@/contexts/auth-context";

type NotifCategory = "application-approved" | "document-required" | "ai-recommendation" | "portfolio-alert" | "fraud-alert" | "risk-alert" | "manager-review" | "loan-approved" | "loan-rejected";

interface Notification {
  id: string;
  type: NotifCategory;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "critical" | "high" | "normal" | "low";
  actor?: string;
}

const now = new Date();
const fmt = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

const allNotifications: Notification[] = [
  { id: "n1", type: "application-approved", title: "Application Approved", message: "Aurora Precision Tools — Working Capital Term Loan of ₹42L has been approved by the credit committee.", timestamp: fmt(0.5), read: false, priority: "critical", actor: "Credit Committee" },
  { id: "n2", type: "document-required", title: "Document Required", message: "Kaveri Agro Foods: Updated GST returns for FY 2025-26 are required to proceed with the review.", timestamp: fmt(1), read: false, priority: "high", actor: "System" },
  { id: "n3", type: "ai-recommendation", title: "AI Recommendation", message: "Blue Lotus Pharma: AI recommends approving ₹2.8Cr at 12.5% with conditions — personal guarantee and quarterly reviews.", timestamp: fmt(2), read: false, priority: "normal", actor: "AI Engine" },
  { id: "n4", type: "portfolio-alert", title: "Portfolio Alert", message: "Surya Electronics (IDBI Bangalore) — risk score increased from 62 to 74. Early warning triggered: payment delays detected.", timestamp: fmt(3), read: false, priority: "high", actor: "Risk Monitor" },
  { id: "n5", type: "fraud-alert", title: "Fraud Alert", message: "Suspicious activity detected on application APP-1042: PAN-GSTIN mismatch with beneficial owner registry.", timestamp: fmt(5), read: false, priority: "critical", actor: "Fraud Detection" },
  { id: "n6", type: "risk-alert", title: "Risk Alert", message: "Green Earth Logistics — credit exposure at 92% of dynamic limit. Concentration risk in transport sector increasing.", timestamp: fmt(6), read: false, priority: "high", actor: "Risk Engine" },
  { id: "n7", type: "manager-review", title: "Manager Review Required", message: "Saral Textiles (IDBI Surat) — loan officer recommended ₹85L. Manager approval pending for ₹65L+ threshold.", timestamp: fmt(8), read: false, priority: "critical", actor: "Loan Officer" },
  { id: "n8", type: "loan-approved", title: "Loan Approved", message: "DigiBake Foods — ₹15L Term Loan approved at 11.5% for 48 months. Disbursement scheduled within 24 hours.", timestamp: fmt(12), read: true, priority: "normal", actor: "Manager" },
  { id: "n9", type: "loan-rejected", title: "Loan Rejected", message: "CityMart Retail — ₹8L Working Capital request rejected due to insufficient alternate data coverage (3 of 6 sources).", timestamp: fmt(18), read: true, priority: "normal", actor: "AI Committee" },
  { id: "n10", type: "application-approved", title: "Application Approved", message: "Kaveri Agro Foods — Cash Credit Limit of ₹25L sanctioned with quarterly review clause.", timestamp: fmt(24), read: true, priority: "high", actor: "Credit Committee" },
  { id: "n11", type: "document-required", title: "Document Required", message: "MSME Green Earth: Bank statement for last 6 months required for cash flow analysis.", timestamp: fmt(30), read: true, priority: "low", actor: "System" },
  { id: "n12", type: "risk-alert", title: "Risk Alert", message: "Sector concentration alert: Textile sector exceeds 25% portfolio threshold at 28.3%.", timestamp: fmt(36), read: true, priority: "high", actor: "Risk Monitor" },
  { id: "n13", type: "ai-recommendation", title: "AI Recommendation", message: "Surya Electronics: Dynamic credit limit increase of ₹12L recommended based on improved cash flow.", timestamp: fmt(48), read: true, priority: "low", actor: "AI Engine" },
  { id: "n14", type: "manager-review", title: "Manager Review", message: "Quarterly portfolio review pending: 4 applications above ₹50L threshold awaiting manager sign-off.", timestamp: fmt(72), read: true, priority: "normal", actor: "System" },
  { id: "n15", type: "fraud-alert", title: "Fraud Alert", message: "Document tampering detected on application APP-1007: Bank statement metadata shows post-upload modification.", timestamp: fmt(96), read: true, priority: "critical", actor: "Forensic Engine" },
  { id: "n16", type: "portfolio-alert", title: "Portfolio Alert", message: "Mumbai Main Branch — portfolio health score declined from 78 to 71 this quarter. 3 MSMEs moved to watchlist.", timestamp: fmt(120), read: true, priority: "high", actor: "Portfolio Monitor" },
  { id: "n17", type: "loan-approved", title: "Loan Approved", message: "Blue Lotus Pharma — ₹2.8Cr Term Loan approved for equipment expansion at 12%. First disbursement of ₹1.4Cr released.", timestamp: fmt(144), read: true, priority: "normal", actor: "Manager" },
  { id: "n18", type: "loan-rejected", title: "Loan Rejected", message: "QuickShip Logistics — OD Facility of ₹10L rejected: concentration risk (single client: 78% of revenue).", timestamp: fmt(168), read: true, priority: "normal", actor: "AI Committee" },
];

const categoryConfig: Record<NotifCategory, { label: string; icon: typeof Bell; color: string }> = {
  "application-approved": { label: "Application Approved", icon: CheckCircle2, color: "text-growth" },
  "document-required": { label: "Document Required", icon: FileText, color: "text-caution" },
  "ai-recommendation": { label: "AI Recommendation", icon: Activity, color: "text-trust" },
  "portfolio-alert": { label: "Portfolio Alert", icon: TrendingUp, color: "text-caution" },
  "fraud-alert": { label: "Fraud Alert", icon: ShieldAlert, color: "text-danger" },
  "risk-alert": { label: "Risk Alert", icon: AlertTriangle, color: "text-danger" },
  "manager-review": { label: "Manager Review", icon: Eye, color: "text-trust" },
  "loan-approved": { label: "Loan Approved", icon: IndianRupee, color: "text-growth" },
  "loan-rejected": { label: "Loan Rejected", icon: Ban, color: "text-muted" },
};

const priorityColors: Record<string, string> = {
  critical: "border-l-danger",
  high: "border-l-caution",
  normal: "border-l-trust",
  low: "border-l-white/[0.06]",
};

const priorityBadges: Record<string, { label: string; tone: "danger" | "warning" | "info" | "neutral" }> = {
  critical: { label: "Critical", tone: "danger" },
  high: { label: "High", tone: "warning" },
  normal: { label: "Normal", tone: "info" },
  low: { label: "Low", tone: "neutral" },
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const role = user?.role ?? "loan-officer";
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<NotifCategory | "all">("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterRead, setFilterRead] = useState<string>("all");
  const [notifications, setNotifications] = useState<Notification[]>(allNotifications);
  const [selectedNotif, setSelectedNotif] = useState<string | null>(null);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (filterCategory !== "all" && n.type !== filterCategory) return false;
      if (filterPriority !== "all" && n.priority !== filterPriority) return false;
      if (filterRead === "unread" && n.read) return false;
      if (filterRead === "read" && !n.read) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q) || (n.actor?.toLowerCase().includes(q) ?? false);
      }
      return true;
    });
  }, [notifications, filterCategory, filterPriority, filterRead, searchQuery]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const toggleRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  }, []);

  const categories = useMemo(() => Object.entries(categoryConfig) as [NotifCategory, typeof categoryConfig[NotifCategory]][], []);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: notifications.length };
    categories.forEach(([key]) => { c[key] = notifications.filter((n) => n.type === key).length; });
    return c;
  }, [notifications, categories]);

  return (
    <AppShell active="notifications" role={role}>
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <BackButton fallbackHref="/command-center" />
          <Breadcrumbs />
        </div>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-trust-light text-trust">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-danger text-[8px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-ink">Notification Center</h1>
              <p className="text-sm text-muted">{unreadCount} unread · {notifications.length} total</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-xs font-medium text-trust transition-all hover:bg-white/[0.08] active:scale-[0.97]"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>

        <PagePurpose className="mb-4" />
        <SmartActionBar className="mb-6" />

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar filters */}
          <aside className="shrink-0 lg:w-56 space-y-5">
            {/* Search */}
            <div className="flex items-center rounded-xl border border-white/[0.1] bg-white/[0.02] transition-all focus-within:border-trust focus-within:ring-1 focus-within:ring-trust/20">
              <Search className="ml-3 h-4 w-4 text-muted shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications..."
                aria-label="Search notifications"
                className="min-h-10 w-full bg-transparent px-2.5 text-sm text-ink outline-none placeholder:text-muted/40"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")} aria-label="Clear search" className="mr-2 text-muted hover:text-ink active:scale-[0.97] transition-transform duration-100">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Category filter */}
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">Category</p>
              <div className="space-y-0.5">
                <FilterButton label="All" count={counts.all} active={filterCategory === "all"} onClick={() => setFilterCategory("all")} />
                {categories.map(([key, config]) => (
                  <FilterButton
                    key={key}
                    label={config.label}
                    count={counts[key]}
                    active={filterCategory === key}
                    onClick={() => setFilterCategory(key)}
                    color={config.color}
                  />
                ))}
              </div>
            </div>

            {/* Priority filter */}
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">Priority</p>
              <div className="flex flex-wrap gap-1.5">
                {(["all", "critical", "high", "normal", "low"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFilterPriority(p)}
                    className={`rounded-lg border px-2.5 py-1 text-[10px] font-medium capitalize transition-all active:scale-[0.97] ${
                      filterPriority === p
                        ? "border-trust/30 bg-trust-light/20 text-trust"
                        : "border-white/[0.06] text-muted hover:border-white/[0.12] hover:text-ink"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Read status filter */}
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">Status</p>
              <div className="flex gap-1.5">
                {(["all", "unread", "read"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFilterRead(s)}
                    className={`rounded-lg border px-2.5 py-1 text-[10px] font-medium capitalize transition-all active:scale-[0.97] ${
                      filterRead === s
                        ? "border-trust/30 bg-trust-light/20 text-trust"
                        : "border-white/[0.06] text-muted hover:border-white/[0.12] hover:text-ink"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Notification list */}
          <div className="min-w-0 flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
                <Inbox className="h-10 w-10 text-muted/40 mb-3" />
                <p className="text-sm font-medium text-ink">No notifications found</p>
                <p className="text-xs text-muted mt-1">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((notif) => {
                  const config = categoryConfig[notif.type];
                  const Icon = config.icon;
                  const isSelected = selectedNotif === notif.id;
                  return (
                    <motion.div
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-xl border border-white/[0.06] transition-all cursor-pointer ${
                        notif.read ? "bg-white/[0.01]" : "bg-trust-light/10 border-trust/10"
                      } ${priorityColors[notif.priority]} border-l-2 hover:bg-white/[0.04]`}
                      onClick={() => setSelectedNotif(isSelected ? null : notif.id)}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.04] ${config.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <p className={`text-sm font-medium truncate ${notif.read ? "text-muted" : "text-ink"}`}>
                                  {notif.title}
                                </p>
                                {!notif.read && <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-trust shadow-[0_0_6px_rgba(216,255,62,0.4)]" />}
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <Badge tone={priorityBadges[notif.priority].tone}>{priorityBadges[notif.priority].label}</Badge>
                                <ChevronRight className={`h-3.5 w-3.5 text-muted transition-transform ${isSelected ? "rotate-90" : ""}`} />
                              </div>
                            </div>
                            <p className={`text-xs mt-1 leading-relaxed ${notif.read ? "text-muted/60" : "text-muted"}`}>
                              {notif.message}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[10px] text-muted/50 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {timeAgo(notif.timestamp)}
                              </span>
                              {notif.actor && (
                                <span className="text-[10px] text-muted/50">{notif.actor}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-3">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); toggleRead(notif.id); }}
                                  className="inline-flex items-center gap-1 rounded-lg border border-white/[0.06] px-2.5 py-1.5 text-[10px] font-medium text-muted transition-all hover:bg-white/[0.04] hover:text-ink active:scale-[0.97]"
                                >
                                  {notif.read ? "Mark unread" : "Mark read"}
                                </button>
                                <button
                                  type="button"
                                  className="inline-flex items-center gap-1 rounded-lg border border-white/[0.06] px-2.5 py-1.5 text-[10px] font-medium text-muted transition-all hover:bg-white/[0.04] hover:text-ink active:scale-[0.97]"
                                >
                                  View details
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function FilterButton({ label, count, active, onClick, color }: { label: string; count: number; active: boolean; onClick: () => void; color?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-all active:scale-[0.97] ${
        active ? "bg-trust-light/20 text-trust font-medium" : "text-muted hover:bg-white/[0.04] hover:text-ink"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        {color && <span className={`h-2 w-2 rounded-full shrink-0 ${color.replace("text-", "bg-")}`} />}
        <span className="truncate">{label}</span>
      </div>
      <span className={`text-xs ${active ? "text-trust" : "text-muted"}`}>{count}</span>
    </button>
  );
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
