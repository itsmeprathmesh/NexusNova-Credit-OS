"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Building2,
  FileText,
  CreditCard,
  Phone,
  ScrollText,
  FolderOpen,
  Bell,
  Shield,
  BadgeCheck,
  MapPin,
  Briefcase,
  Users,
  BarChart3,
  TrendingUp,
  ClipboardCheck,
  Target,
  Globe,
  PieChart,
  Activity,
  Clock,
  Settings,
  LogOut,
  Pencil,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  X,
  Eye,
  EyeOff,
  MonitorPlay,
  Search,
  LayoutDashboard,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/primitives";
import { useAuth } from "@/contexts/auth-context";
import { useCustomerAuth } from "@/contexts/customer-auth-context";
import { applications, financialSignals, msmes, portfolio } from "@/data/mock-data";
import { getSession, logout as appLogout } from "@/services/app-data";
import { useDemoMode } from "@/contexts/demo-mode";
import { useJudge } from "@/features/judge-experience";
import type { UserRole, MsmeProfile, LoanApplication, FinancialSignals, PortfolioItem } from "@/domain/types";

const roleLabels: Record<string, string> = {
  "loan-officer": "Loan Officer",
  manager: "Manager",
  executive: "Executive",
  customer: "Customer",
};

const branchData: Record<string, { region: string; city: string; manager: string }> = {
  "Mumbai Main Branch": { region: "West", city: "Mumbai", manager: "Anita Desai" },
  "Delhi Corporate Branch": { region: "North", city: "Delhi", manager: "Vikram Singh" },
  "Bangalore Tech Corridor": { region: "South", city: "Bengaluru", manager: "Kavya Ramesh" },
  "Pune Industrial Finance": { region: "West", city: "Pune", manager: "Rahul Sharma" },
  "Hyderabad Pharma Finance": { region: "South", city: "Hyderabad", manager: "Sunita Reddy" },
  "Chennai Manufacturing Hub": { region: "South", city: "Chennai", manager: "Arun Kumar" },
  "Ahmedabad Trade Finance": { region: "West", city: "Ahmedabad", manager: "Pooja Patel" },
};

const sampleTimeline = [
  { action: "Reviewed application APP-1001", time: "10 min ago", type: "decision" },
  { action: "Updated credit memo for Aurora Tools", time: "1 hr ago", type: "document" },
  { action: "Approved limit increase for Kaveri Agro", time: "3 hr ago", type: "decision" },
  { action: "Assigned new case Surya Electronics", time: "5 hr ago", type: "assignment" },
  { action: "Completed portfolio review", time: "1 day ago", type: "review" },
];

export default function ProfilePage() {
  const { user, logout: staffLogout } = useAuth();
  const { customer, logout: customerLogout } = useCustomerAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const userRole = user?.role ?? "loan-officer";
  const isCustomer = !!customer;

  const handleLogout = useCallback(() => {
    staffLogout();
    customerLogout();
    router.push(isCustomer ? "/customer/login" : "/staff-login");
  }, [staffLogout, customerLogout, router, isCustomer]);

  return (
    <AppShell active="command-center" role={userRole}>
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-trust-light text-trust ring-2 ring-trust/20">
                <User className="h-7 w-7" />
              </div>
              <button
                type="button"
                onClick={() => setEditing(!editing)}
                className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-trust text-canvas shadow-glow transition-all hover:shadow-[0_0_20px_rgba(216,255,62,0.3)] active:scale-90"
              >
                <Pencil className="h-3 w-3" />
              </button>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-ink">
                {isCustomer ? customer?.name ?? "Customer" : user?.name ?? roleLabels[userRole]}
              </h1>
              <p className="text-sm text-muted">
                {isCustomer ? "MSME Customer" : roleLabels[userRole]}
                {user?.employeeId && ` · ${user.employeeId}`}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/settings"
                className="grid h-9 w-9 place-items-center rounded-xl text-muted transition-all hover:bg-white/[0.06] hover:text-ink"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="grid h-9 w-9 place-items-center rounded-xl text-muted transition-all hover:bg-white/[0.06] hover:text-danger"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar sections */}
          <nav className="shrink-0 lg:w-56" aria-label="Profile sections">
            <ProfileNav
              isCustomer={isCustomer}
              userRole={userRole}
            />
          </nav>

          {/* Content */}
          <div className="min-w-0 flex-1 space-y-6">
            {isCustomer ? (
              <CustomerProfileContent editing={editing} setEditing={setEditing} />
            ) : userRole === "loan-officer" ? (
              <LoanOfficerProfileContent editing={editing} user={user} role={userRole} />
            ) : userRole === "manager" ? (
              <ManagerProfileContent editing={editing} user={user} role={userRole} />
            ) : (
              <ExecutiveProfileContent editing={editing} user={user} role={userRole} />
            )}

            {/* Universal: Activity Timeline */}
            <ActivityTimelineSection />

            {/* Universal: Recent Actions */}
            <RecentActionsSection />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ProfileNav({ isCustomer, userRole }: { isCustomer: boolean; userRole: string }) {
  const customerSections = [
    { id: "business", label: "Business Details", icon: Building2 },
    { id: "gst", label: "GST", icon: FileText },
    { id: "pan", label: "PAN", icon: CreditCard },
    { id: "udyam", label: "Udyam", icon: BadgeCheck },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "loans", label: "Loan History", icon: ScrollText },
    { id: "documents", label: "Documents", icon: FolderOpen },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];
  const staffSections: Record<string, { id: string; label: string; icon: typeof Building2 }[]> = {
    "loan-officer": [
      { id: "overview", label: "Overview", icon: User },
      { id: "branch", label: "Branch", icon: MapPin },
      { id: "cases", label: "Assigned Cases", icon: Briefcase },
      { id: "performance", label: "Performance", icon: TrendingUp },
    ],
    manager: [
      { id: "portfolio", label: "Portfolio", icon: PieChart },
      { id: "approvals", label: "Approvals", icon: ClipboardCheck },
      { id: "branch", label: "Branch", icon: MapPin },
      { id: "team", label: "Team", icon: Users },
      { id: "kpis", label: "KPIs", icon: Target },
    ],
    executive: [
      { id: "region", label: "Region", icon: Globe },
      { id: "portfolio", label: "Portfolio", icon: PieChart },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "reports", label: "Reports", icon: FileText },
      { id: "audit", label: "Audit", icon: Shield },
    ],
  };

  const sections = isCustomer ? customerSections : staffSections[userRole] ?? staffSections["loan-officer"];

  return (
    <div className="space-y-0.5 rounded-2xl border border-white/[0.06] bg-surface/50 p-1.5 sticky top-24">
      {sections.map((sec) => {
        const Icon = sec.icon;
        return (
          <a
            key={sec.id}
            href={`#${sec.id}`}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted transition-all hover:bg-white/[0.04] hover:text-ink"
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{sec.label}</span>
          </a>
        );
      })}
    </div>
  );
}

/* ───── Customer Profile ───── */

function CustomerProfileContent({ editing, setEditing }: { editing: boolean; setEditing: (v: boolean) => void }) {
  const session = getSession();
  const msme = msmes.find((m) => m.id === session.msmeId);
  const signals = financialSignals.find((s) => s.msmeId === session.msmeId);
  const customerApps = applications.filter((a) => a.msmeId === session.msmeId);
  const [profile, setProfile] = useState(
    msme ?? {
      id: "msme-aurora",
      name: "Aurora Precision Tools",
      sector: "Manufacturing",
      branch: "IDBI Pune Industrial",
      owner: "Rohit Kulkarni",
      city: "Pune",
      pan: "AAKPA1842K",
      gstin: "27AAKPA1842K1Z8",
      udyam: "UDYAM-MH-26-0048123",
      businessAgeYears: 8,
      relationshipYears: 3,
    }
  );

  if (!profile) {
    return (
      <GlassPanel variant="strong" className="p-6 text-center">
        <p className="text-sm text-muted">No business profile found. Please register your business.</p>
      </GlassPanel>
    );
  }

  return (
    <>
      {/* Business Details */}
      <Section id="business" title="Business Details">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Business Name" value={profile.name} editing={editing} />
          <Field label="Owner Name" value={profile.owner} editing={editing} />
          <Field label="Sector" value={profile.sector} editing={editing} />
          <Field label="City" value={profile.city} editing={editing} />
          <Field label="Business Type" value="Private Limited" editing={editing} />
          <Field label="Industry" value="Precision Engineering" editing={editing} />
          <Field label="Business Age" value={`${profile.businessAgeYears} years`} editing={false} />
          <Field label="Relationship" value={`${profile.relationshipYears} years`} editing={false} />
        </div>
      </Section>

      {/* GST */}
      <Section id="gst" title="GST Details">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="GSTIN" value={profile.gstin} editing={false} />
          <Field label="GST Filing Status" value="Regular (Monthly)" editing={false} />
          <Field label="Annual Turnover (GST)" value="₹4.2 Cr" editing={false} />
          <Field label="Last Filed" value="Jun 2026" editing={false} />
        </div>
      </Section>

      {/* PAN */}
      <Section id="pan" title="PAN Details">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="PAN" value={profile.pan} editing={false} />
          <Field label="PAN Status" value="Verified" editing={false} />
          <Field label="Name on PAN" value={profile.owner} editing={false} />
        </div>
      </Section>

      {/* Udyam */}
      <Section id="udyam" title="Udyam Registration">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Udyam No." value={profile.udyam} editing={false} />
          <Field label="Classification" value="Micro" editing={false} />
          <Field label="Valid Until" value="31 Mar 2028" editing={false} />
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" title="Contact Information">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Mobile" value="+91 98765 43210" editing={editing} />
          <Field label="Email" value="rohit@auroratools.in" editing={editing} />
          <Field label="Address" value="Plot 42, MIDC Bhosari, Pune - 411026" editing={editing} />
        </div>
      </Section>

      {/* Loan History */}
      <Section id="loans" title="Loan History">
        <div className="space-y-3">
          {(customerApps.length > 0 ? customerApps : [
            { id: "APP-1001", product: "Working Capital Term Loan", requestedAmount: 42000000, status: "approved" },
          ]).map((loan: any) => (
            <div key={loan.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div>
                <p className="font-medium text-ink">{loan.product ?? "Working Capital Term Loan"}</p>
                <p className="text-sm text-muted">{loan.id} · ₹{(loan.requestedAmount / 100000).toFixed(0)}L</p>
              </div>
              <Badge tone={loan.status === "approved" ? "success" : loan.status === "rejected" ? "danger" : "info"}>
                {loan.status}
              </Badge>
            </div>
          ))}
        </div>
      </Section>

      {/* Documents */}
      <Section id="documents" title="Documents">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { name: "GST Returns", status: "verified" as const },
            { name: "PAN Card", status: "verified" as const },
            { name: "Udyam Certificate", status: "verified" as const },
            { name: "Bank Statement", status: "review-needed" as const },
            { name: "ITR", status: "missing" as const },
          ].map((doc) => (
            <div key={doc.name} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <span className="text-sm text-ink">{doc.name}</span>
              <Badge tone={doc.status === "verified" ? "success" : doc.status === "review-needed" ? "warning" : "danger"}>
                {doc.status}
              </Badge>
            </div>
          ))}
        </div>
      </Section>

      {/* Notifications */}
      <Section id="notifications" title="Notifications">
        <div className="space-y-2">
          {[
            { title: "Application Approved", msg: "Your loan has been approved.", time: "1 hr ago", type: "success" as const },
            { title: "GST Returns Verified", msg: "Your GST data has been verified.", time: "1 day ago", type: "info" as const },
            { title: "Document Required", msg: "Please upload your ITR documents.", time: "3 days ago", type: "warning" as const },
          ].map((n, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                n.type === "success" ? "bg-growth/10 text-growth" :
                n.type === "warning" ? "bg-caution/10 text-caution" :
                "bg-trust-light/50 text-trust"
              }`}>
                {n.type === "success" ? <CheckCircle2 className="h-4 w-4" /> :
                 n.type === "warning" ? <AlertTriangle className="h-4 w-4" /> :
                 <Bell className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{n.title}</p>
                <p className="text-xs text-muted">{n.msg}</p>
                <p className="text-[10px] text-muted/60 mt-0.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Security */}
      <Section id="security" title="Security">
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <span className="text-sm text-ink">Two-Factor Authentication</span>
            <Badge tone="success">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <span className="text-sm text-ink">Last Password Change</span>
            <span className="text-sm text-muted">15 Jun 2026</span>
          </div>
        </div>
      </Section>
    </>
  );
}

/* ───── Loan Officer Profile ───── */

function LoanOfficerProfileContent({ editing, user, role }: { editing: boolean; user: any; role: UserRole }) {
  const activeCases = applications.filter((a) => a.status === "new" || a.status === "in-review");
  const metrics = {
    assigned: applications.length,
    pending: activeCases.length,
    approved: applications.filter((a) => a.status === "approved").length,
    completed: 124,
    approvalRate: 78,
    avgTurnaround: "2.3 days",
  };

  return (
    <>
      <Section id="overview" title="Overview">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Employee ID" value={user?.employeeId ?? "LO1001"} editing={false} />
          <Field label="Designation" value="Senior Loan Officer" editing={editing} />
          <Field label="Branch" value={user?.branch ?? "Pune Industrial Finance"} editing={false} />
          <Field label="Region" value="West" editing={false} />
          <Field label="Since" value="Jan 2022" editing={false} />
          <Field label="Status" value="Active" editing={false} />
        </div>
      </Section>

      <Section id="branch" title="Branch">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Branch Name" value={user?.branch ?? "Pune Industrial Finance"} editing={false} />
          <Field label="Branch Code" value="PUN-001" editing={false} />
          <Field label="City" value="Pune" editing={false} />
          <Field label="Branch Manager" value="Rahul Sharma" editing={false} />
        </div>
      </Section>

      <Section id="cases" title="Assigned Cases">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <MetricCard label="Total Assigned" value={metrics.assigned} />
          <MetricCard label="Pending Review" value={metrics.pending} tone="warning" />
          <MetricCard label="Approved" value={metrics.approved} tone="success" />
        </div>
        <div className="space-y-2">
          {activeCases.slice(0, 4).map((app) => (
            <div key={app.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div>
                <p className="text-sm font-medium text-ink">{app.id}</p>
                <p className="text-xs text-muted">{app.product} · ₹{(app.requestedAmount / 100000).toFixed(0)}L</p>
              </div>
              <Badge tone={app.priority === "urgent" ? "danger" : app.priority === "high" ? "warning" : "info"}>
                {app.status}
              </Badge>
            </div>
          ))}
        </div>
      </Section>

      <Section id="performance" title="Performance">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <MetricCard label="Approval Rate" value={`${metrics.approvalRate}%`} />
          <MetricCard label="Completed" value={metrics.completed} />
          <MetricCard label="Avg Turnaround" value={metrics.avgTurnaround} />
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-sm text-muted mb-3">Recent Achievements</p>
          <div className="space-y-2">
            {[
              "Completed 15 applications this month",
              "98% AI recommendation alignment",
              "Zero compliance escalations in Q2",
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-ink">
                <CheckCircle2 className="h-3.5 w-3.5 text-growth shrink-0" />
                {a}
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

/* ───── Manager Profile ───── */

function ManagerProfileContent({ editing, user, role }: { editing: boolean; user: any; role: UserRole }) {
  const totalExposure = portfolio.reduce((s, p) => s + p.exposure, 0);
  const highRisk = portfolio.filter((p) => p.riskBand === "high" || p.riskBand === "critical").length;
  const branchInfo = user?.branch ? branchData[user.branch] : branchData["Mumbai Main Branch"];

  return (
    <>
      <Section id="portfolio" title="Portfolio Overview">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <MetricCard label="Total Exposure" value={`₹${(totalExposure / 10000000).toFixed(1)}Cr`} />
          <MetricCard label="MSMEs Covered" value={portfolio.length} />
          <MetricCard label="High Risk" value={highRisk} tone="danger" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Portfolio Health" value="Stable" editing={false} />
          <Field label="Avg Risk Score" value="64/100" editing={false} />
          <Field label="Sectors Covered" value="7" editing={false} />
          <Field label="Dynamic Limits Active" value="3 MSMEs" editing={false} />
        </div>
      </Section>

      <Section id="approvals" title="Pending Approvals">
        <div className="space-y-2">
          {applications.filter((a) => a.status === "in-review").slice(0, 3).map((app) => (
            <div key={app.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div>
                <p className="text-sm font-medium text-ink">{app.id}</p>
                <p className="text-xs text-muted">{app.product} · ₹{(app.requestedAmount / 100000).toFixed(0)}L</p>
              </div>
              <Badge tone="info">{app.status}</Badge>
            </div>
          ))}
        </div>
      </Section>

      <Section id="branch" title="Branch Details">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Branch" value={user?.branch ?? "Mumbai Main Branch"} editing={false} />
          <Field label="Region" value={branchInfo?.region ?? "West"} editing={false} />
          <Field label="City" value={branchInfo?.city ?? "Mumbai"} editing={false} />
          <Field label="Branch Manager" value={branchInfo?.manager ?? "Anita Desai"} editing={false} />
        </div>
      </Section>

      <Section id="team" title="Team">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { name: "Rahul Sharma", role: "Loan Officer", cases: 8 },
            { name: "Priya Patel", role: "Loan Officer", cases: 6 },
            { name: "Amit Singh", role: "Credit Analyst", cases: 12 },
            { name: "Neha Gupta", role: "Relationship Manager", cases: 15 },
          ].map((member) => (
            <div key={member.name} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-trust-light/50 text-trust">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{member.name}</p>
                <p className="text-xs text-muted">{member.role} · {member.cases} cases</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="kpis" title="Key Performance Indicators">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard label="NPA Ratio" value="2.1%" tone="warning" />
          <MetricCard label="Portfolio Yield" value="13.4%" tone="success" />
          <MetricCard label="Approval Rate" value="74%" />
          <MetricCard label="Avg Ticket Size" value="₹18.5L" />
        </div>
        <div className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-sm text-muted mb-2">Quarterly Target Progress</p>
          <div className="h-2 rounded-full bg-white/[0.08] overflow-hidden">
            <div className="h-full w-[72%] rounded-full bg-trust transition-all" />
          </div>
          <p className="text-xs text-muted mt-1">72% of ₹50Cr disbursement target achieved</p>
        </div>
      </Section>
    </>
  );
}

/* ───── Executive Profile ───── */

function ExecutiveProfileContent({ editing, user, role }: { editing: boolean; user: any; role: UserRole }) {
  const totalExposure = portfolio.reduce((s, p) => s + p.exposure, 0);
  const metrics = {
    msmes: portfolio.length,
    exposure: `₹${(totalExposure / 10000000).toFixed(1)}Cr`,
    sectors: 7,
    branches: 5,
    approvalRate: 76,
    avgScore: 64,
  };

  return (
    <>
      <Section id="region" title="Region Overview">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Region" value="West Zone" editing={false} />
          <Field label="Head Office" value="Mumbai Main Branch" editing={false} />
          <Field label="Branches Under" value="5" editing={false} />
          <Field label="Regional Director" value="Anita Desai" editing={false} />
        </div>
      </Section>

      <Section id="portfolio" title="Portfolio Summary">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <MetricCard label="Total MSMEs" value={metrics.msmes} />
          <MetricCard label="Total Exposure" value={metrics.exposure} />
          <MetricCard label="Sectors" value={metrics.sectors} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Branches Active" value={`${metrics.branches}`} editing={false} />
          <Field label="Avg Portfolio Score" value={`${metrics.avgScore}/100`} editing={false} />
        </div>
      </Section>

      <Section id="analytics" title="Analytics">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard label="Approval Rate" value={`${metrics.approvalRate}%`} tone="success" />
          <MetricCard label="Disbursement" value="₹36.2Cr" />
          <MetricCard label="NPA Ratio" value="1.8%" tone="warning" />
          <MetricCard label="Inclusion Score" value="84" tone="success" />
        </div>
      </Section>

      <Section id="reports" title="Reports">
        <div className="space-y-2">
          {[
            { name: "Portfolio Health — Q2 2026", date: "30 Jun 2026" },
            { name: "Sector Intelligence Report", date: "15 Jun 2026" },
            { name: "Branch Performance Review", date: "01 Jun 2026" },
            { name: "Credit Risk Migration", date: "25 May 2026" },
          ].map((r) => (
            <div key={r.name} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-trust" />
                <span className="text-sm text-ink">{r.name}</span>
              </div>
              <span className="text-xs text-muted">{r.date}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="audit" title="Audit Trail">
        <div className="space-y-2">
          {[
            { event: "Portfolio review completed", by: "System", date: "Today, 10:30 AM" },
            { event: "Credit limit revised — Surya Electronics", by: "Anita Desai", date: "Yesterday" },
            { event: "New sector added — Logistics", by: "System", date: "2 days ago" },
            { event: "Compliance report generated", by: "System", date: "5 days ago" },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-trust-light/50 text-trust">
                <ClipboardCheck className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink">{a.event}</p>
                <p className="text-xs text-muted">{a.by} · {a.date}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

/* ───── Universal Sections ───── */

function ActivityTimelineSection() {
  return (
    <GlassPanel variant="strong" className="p-6">
      <div className="mb-5 flex items-center gap-2">
        <Clock className="h-4 w-4 text-trust" />
        <h2 className="text-lg font-semibold text-ink">Activity Timeline</h2>
      </div>
      <div className="space-y-0">
        {sampleTimeline.map((event, i) => (
          <div key={i} className="relative flex gap-4 pb-4 last:pb-0">
            {i < sampleTimeline.length - 1 && (
              <div className="absolute left-[7px] top-4 bottom-0 w-px bg-white/[0.06]" />
            )}
            <div className={`grid h-[15px] w-[15px] shrink-0 place-items-center rounded-full mt-1 ${
              event.type === "decision" ? "bg-trust" :
              event.type === "document" ? "bg-growth" :
              event.type === "assignment" ? "bg-caution" : "bg-white/[0.12]"
            }`}>
              <div className="h-[5px] w-[5px] rounded-full bg-canvas" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-ink">{event.action}</p>
              <p className="text-xs text-muted">{event.time}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function RecentActionsSection() {
  return (
    <GlassPanel variant="strong" className="p-6">
      <div className="mb-5 flex items-center gap-2">
        <Activity className="h-4 w-4 text-trust" />
        <h2 className="text-lg font-semibold text-ink">Recent Actions</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          { icon: Search, label: "Review Application", href: "/applications/app-1001" },
          { icon: MonitorPlay, label: "Start Tour", href: "#" },
          { icon: LayoutDashboard, label: "Command Center", href: "/command-center" },
          { icon: Settings, label: "Settings", href: "/settings" },
          { icon: HelpCircle, label: "Help Guide", href: "#" },
        ].map((action) => {
          const Icon = action.icon;
          if (action.href === "#") {
            return (
              <button
                key={action.label}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs font-medium text-muted transition-all hover:bg-white/[0.06] hover:text-ink"
              >
                <Icon className="h-3.5 w-3.5" />
                {action.label}
              </button>
            );
          }
          return (
            <Link
              key={action.label}
              href={action.href}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs font-medium text-muted transition-all hover:bg-white/[0.06] hover:text-ink"
            >
              <Icon className="h-3.5 w-3.5" />
              {action.label}
            </Link>
          );
        })}
      </div>
    </GlassPanel>
  );
}

/* ───── Shared Components ───── */

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <GlassPanel variant="strong" className="p-6" id={id}>
      <h2 className="text-lg font-semibold text-ink mb-5">{title}</h2>
      {children}
    </GlassPanel>
  );
}

function Field({ label, value, editing }: { label: string; value: string; editing: boolean }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
      <p className="text-xs text-muted mb-0.5">{label}</p>
      {editing ? (
        <input
          defaultValue={value}
          className="w-full bg-transparent text-sm font-medium text-ink outline-none"
        />
      ) : (
        <p className="text-sm font-medium text-ink">{value}</p>
      )}
    </div>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string | number; tone?: "success" | "warning" | "danger" }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-center">
      <p className={`text-lg font-bold ${
        tone === "success" ? "text-growth" :
        tone === "warning" ? "text-caution" :
        tone === "danger" ? "text-danger" :
        "text-ink"
      }`}>{value}</p>
      <p className="text-[10px] text-muted mt-0.5">{label}</p>
    </div>
  );
}
