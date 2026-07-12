"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Lock,
  Palette,
  Globe,
  Accessibility,
  Info,
  ShieldCheck,
  HelpCircle,
  Keyboard,
  Sparkles,
  LogOut,
  RefreshCw,
  ChevronRight,
  Eye,
  EyeOff,
  MonitorPlay,
  CheckCircle2,
  FileText,
  MessageSquare,
  Send,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/primitives";
import { useAuth } from "@/contexts/auth-context";
import { useDemoMode } from "@/contexts/demo-mode";
import { useJudge } from "@/features/judge-experience";
import type { UserRole } from "@/domain/types";

interface Section {
  id: string;
  label: string;
  icon: typeof User;
}

const sections: Section[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "password", label: "Password", icon: Lock },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "language", label: "Language", icon: Globe },
  { id: "accessibility", label: "Accessibility", icon: Accessibility },
  { id: "about", label: "About", icon: Info },
  { id: "privacy", label: "Privacy", icon: ShieldCheck },
  { id: "help", label: "Help & Support", icon: HelpCircle },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "shortcuts", label: "Keyboard Shortcuts", icon: Keyboard },
  { id: "demo", label: "Demo Preferences", icon: Sparkles },
  { id: "logout", label: "Logout", icon: LogOut },
];

const roleLabels: Record<UserRole, string> = {
  "loan-officer": "Loan Officer",
  manager: "Manager",
};

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const { isJudgeMode, toggleJudgeMode } = useJudge();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [notifToggle, setNotifToggle] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);

  const handleLogout = useCallback(() => {
    logout();
    router.push("/staff-login");
  }, [logout, router]);

  const role = user?.role ?? "loan-officer";

  return (
    <AppShell active="command-center" role={role}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-trust-light text-trust">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-ink">Settings</h1>
            <p className="text-sm text-muted">Manage your account, preferences, and application settings</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <nav className="shrink-0 lg:w-56" aria-label="Settings sections">
            <div className="space-y-0.5 rounded-2xl border border-white/[0.06] bg-surface/50 p-1.5">
              {sections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                const isLogout = sec.id === "logout";
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      if (isLogout) {
                        handleLogout();
                      } else {
                        setActiveSection(sec.id);
                      }
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all ${
                      isLogout
                        ? "text-muted hover:bg-danger/10 hover:text-danger"
                        : isActive
                          ? "bg-trust-light text-trust font-medium"
                          : "text-muted hover:bg-white/[0.04] hover:text-ink"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{sec.label}</span>
                    {isActive && !isLogout && <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                {activeSection === "profile" && <ProfileSection user={user} role={role} />}
                {activeSection === "notifications" && <NotificationsSection notifToggle={notifToggle} setNotifToggle={setNotifToggle} emailNotif={emailNotif} setEmailNotif={setEmailNotif} />}
                {activeSection === "security" && <SecuritySection />}
                {activeSection === "password" && <PasswordSection showPassword={showPassword} setShowPassword={setShowPassword} />}
                {activeSection === "theme" && <ThemeSection />}
                {activeSection === "language" && <LanguageSection />}
                {activeSection === "accessibility" && <AccessibilitySection />}
                {activeSection === "about" && <AboutSection />}
                {activeSection === "privacy" && <PrivacySection />}
                {activeSection === "help" && <HelpSection />}
                {activeSection === "feedback" && <FeedbackSection />}
                {activeSection === "shortcuts" && <ShortcutsSection />}
                {activeSection === "demo" && <DemoPreferencesSection isDemoMode={isDemoMode} toggleDemoMode={toggleDemoMode} isJudgeMode={isJudgeMode} toggleJudgeMode={toggleJudgeMode} role={role} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <GlassPanel variant="strong" className="p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {children}
    </GlassPanel>
  );
}

function ProfileSection({ user, role }: { user: { name: string; employeeId: string; branch: string } | null; role: UserRole }) {
  return (
    <SectionCard title="Profile" description="Your account information and employee details.">
      <div className="space-y-4">
        <div className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-trust-light text-trust">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-ink">{user?.name ?? roleLabels[role]}</p>
            <p className="text-sm text-muted">{user?.employeeId ?? (role === "loan-officer" ? "LO1001" : "MG2001")}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-xs text-muted">Employee ID</p>
            <p className="mt-0.5 font-medium text-ink">{user?.employeeId ?? (role === "loan-officer" ? "LO1001" : "MG2001")}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-xs text-muted">Role</p>
            <p className="mt-0.5 font-medium text-ink">{roleLabels[role]}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-xs text-muted">Branch</p>
            <p className="mt-0.5 font-medium text-ink">{user?.branch ?? "Mumbai Main Branch"}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-xs text-muted">Region</p>
            <p className="mt-0.5 font-medium text-ink">West</p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function NotificationsSection({ notifToggle, setNotifToggle, emailNotif, setEmailNotif }: { notifToggle: boolean; setNotifToggle: (v: boolean) => void; emailNotif: boolean; setEmailNotif: (v: boolean) => void }) {
  return (
    <SectionCard title="Notifications" description="Configure how you receive alerts and updates.">
      <div className="space-y-4">
        <ToggleRow label="Push Notifications" desc="Receive alerts for urgent applications and updates" enabled={notifToggle} onChange={setNotifToggle} />
        <ToggleRow label="Email Notifications" desc="Daily digest of portfolio changes and system alerts" enabled={emailNotif} onChange={setEmailNotif} />
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-xs text-muted">Quiet Hours</p>
          <p className="mt-0.5 text-sm text-ink">10:00 PM — 7:00 AM (no notifications sent)</p>
        </div>
      </div>
    </SectionCard>
  );
}

function SecuritySection() {
  return (
    <SectionCard title="Security" description="Two-factor authentication and active sessions.">
      <div className="space-y-4">
        <ToggleRow label="Two-Factor Authentication" desc="Add an extra layer of security to your account" enabled={false} onChange={() => {}} />
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-ink">Active Sessions</p>
              <p className="text-sm text-muted">1 session — Mumbai Main Branch</p>
            </div>
            <Badge tone="success">Current</Badge>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function PasswordSection({ showPassword, setShowPassword }: { showPassword: boolean; setShowPassword: (v: boolean) => void }) {
  return (
    <SectionCard title="Password" description="Update your account password.">
      <div className="space-y-4">
        <Field label="Current Password" type={showPassword ? "text" : "password"} placeholder="········" showToggle showPassword={showPassword} onToggle={() => setShowPassword(!showPassword)} />
        <Field label="New Password" type={showPassword ? "text" : "password"} placeholder="Enter new password" />
        <Field label="Confirm Password" type={showPassword ? "text" : "password"} placeholder="Confirm new password" />
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-trust px-4 py-2 text-sm font-semibold text-canvas shadow-glow transition-all hover:shadow-[0_0_30px_rgba(216,255,62,0.25)] active:scale-[0.98]">
            <CheckCircle2 className="h-4 w-4" />
            Update Password
          </button>
        </div>
      </div>
    </SectionCard>
  );
}

function ThemeSection() {
  const [theme, setTheme] = useState("dark");
  return (
    <SectionCard title="Theme" description="Customize the appearance of the application.">
      <div className="space-y-4">
        <p className="text-sm text-muted">Colour Scheme</p>
        <div className="flex gap-3">
          {[
            { id: "dark", label: "Dark", desc: "Default dark theme" },
            { id: "system", label: "System", desc: "Follow system preference" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={`flex-1 rounded-xl border p-4 text-left transition-all ${
                theme === t.id
                  ? "border-trust/30 bg-trust-light/20"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
              }`}
            >
              <p className="font-medium text-ink">{t.label}</p>
              <p className="text-xs text-muted mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function LanguageSection() {
  const [lang, setLang] = useState("en");
  return (
    <SectionCard title="Language" description="Select your preferred language.">
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="w-full rounded-xl border border-white/[0.1] bg-white/[0.02] px-4 py-2.5 text-sm text-ink outline-none transition-all hover:border-white/[0.2] focus:border-trust focus:ring-1 focus:ring-trust/20"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी (Hindi)</option>
        <option value="mr">मराठी (Marathi)</option>
        <option value="gu">ગુજરાતી (Gujarati)</option>
        <option value="kn">ಕನ್ನಡ (Kannada)</option>
        <option value="ta">தமிழ் (Tamil)</option>
        <option value="te">తెలుగు (Telugu)</option>
      </select>
    </SectionCard>
  );
}

function AccessibilitySection() {
  const [fontSize, setFontSize] = useState("normal");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  return (
    <SectionCard title="Accessibility" description="Make the application work better for you.">
      <div className="space-y-4">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-sm text-muted">Font Size</p>
          <div className="mt-2 flex gap-2">
            {["small", "normal", "large"].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setFontSize(size)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                  fontSize === size
                    ? "border-trust/30 bg-trust-light/20 text-trust"
                    : "border-white/[0.06] text-muted hover:border-white/[0.12]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <ToggleRow label="Reduced Motion" desc="Minimise animations throughout the interface" enabled={reducedMotion} onChange={setReducedMotion} />
        <ToggleRow label="High Contrast" desc="Increase contrast for better readability" enabled={highContrast} onChange={setHighContrast} />
      </div>
    </SectionCard>
  );
}

function AboutSection() {
  return (
    <SectionCard title="About" description="Application information and version details.">
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "Application", value: "NexusNova MSME Financial Health Card" },
            { label: "Version", value: "3.2.0" },
            { label: "Build", value: "INNOVATE-2026-PS3" },
            { label: "Environment", value: "Demo / Sandbox" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-xs text-muted">{item.label}</p>
              <p className="mt-0.5 font-medium text-ink">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-xs text-muted">Licensed To</p>
          <p className="mt-0.5 font-medium text-ink">IDBI Bank — Innovate 2026</p>
        </div>
      </div>
    </SectionCard>
  );
}

function PrivacySection() {
  return (
    <SectionCard title="Privacy" description="Data handling and privacy controls.">
      <div className="space-y-4">
        <ToggleRow label="Anonymous Analytics" desc="Help improve NexusNova by sending anonymous usage data" enabled={true} onChange={() => {}} />
        <ToggleRow label="Session Recording" desc="Record sessions for internal audit and compliance review" enabled={false} onChange={() => {}} />
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-xs text-muted">Data Retention</p>
          <p className="mt-0.5 text-sm text-ink">Session data retained for 90 days. Audit logs retained for 7 years.</p>
        </div>
      </div>
    </SectionCard>
  );
}

function HelpSection() {
  return (
    <SectionCard title="Help & Support" description="Resources and support channels.">
      <div className="space-y-3">
        <HelpRow icon={HelpCircle} label="Documentation" desc="Read the complete user guide" />
        <HelpRow icon={MonitorPlay} label="Video Tutorials" desc="Watch step-by-step walkthroughs" />
        <HelpRow icon={User} label="Contact Support" desc="Reach out to the IDBI support team" />
        <HelpRow icon={FileText} label="Release Notes" desc="See what&apos;s new in this version" />
      </div>
    </SectionCard>
  );
}

function FeedbackSection() {
  const [sent, setSent] = useState(false);
  const [text, setText] = useState("");
  const handleSend = useCallback(() => {
    if (!text.trim()) return;
    setSent(true);
    setTimeout(() => { setSent(false); setText(""); }, 3000);
  }, [text]);
  return (
    <SectionCard title="Send Feedback" description="Help us improve NexusNova with your suggestions.">
      <div className="space-y-4">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-xs text-muted mb-1">Feature Feedback</p>
          <p className="text-xs text-muted">What feature would you like to see improved or added?</p>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe your feedback or suggestion..."
          rows={4}
          className="w-full rounded-xl border border-white/[0.1] bg-white/[0.02] px-4 py-3 text-sm text-ink outline-none transition-all focus:border-trust focus:ring-1 focus:ring-trust/20 placeholder:text-muted/40 resize-none"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSend}
            disabled={!text.trim() || sent}
            className="inline-flex items-center gap-1.5 rounded-xl bg-trust px-4 py-2 text-sm font-semibold text-canvas shadow-glow transition-all hover:shadow-[0_0_30px_rgba(216,255,62,0.25)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sent ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            {sent ? "Sent!" : "Send Feedback"}
          </button>
        </div>
      </div>
    </SectionCard>
  );
}

function HelpRow({ icon: Icon, label, desc }: { icon: typeof HelpCircle; label: string; desc: string }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-all hover:border-white/[0.12] hover:bg-white/[0.04]">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-trust-light/50 text-trust">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="font-medium text-ink">{label}</p>
        <p className="text-sm text-muted">{desc}</p>
      </div>
      <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted" />
    </button>
  );
}

function ShortcutsSection() {
  const shortcuts = [
    { key: "Ctrl+K", desc: "Open search" },
    { key: "D", desc: "Toggle demo mode" },
    { key: "J", desc: "Toggle judge mode" },
    { key: "H", desc: "Go to home" },
    { key: "1-5", desc: "Navigate main sections" },
    { key: "?", desc: "Toggle keyboard shortcuts" },
    { key: "Esc", desc: "Close modal or walkthrough" },
  ];
  return (
    <SectionCard title="Keyboard Shortcuts" description="Speed up your workflow with these shortcuts.">
      <div className="space-y-2">
        {shortcuts.map((s) => (
          <div key={s.key} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <span className="text-sm text-ink">{s.desc}</span>
            <kbd className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 text-xs font-mono text-muted">{s.key}</kbd>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function DemoPreferencesSection({ isDemoMode, toggleDemoMode, isJudgeMode, toggleJudgeMode, role }: { isDemoMode: boolean; toggleDemoMode: () => void; isJudgeMode: boolean; toggleJudgeMode: () => void; role: UserRole }) {
  return (
    <SectionCard title="Demo Preferences" description="Manage demo environment and role simulation settings.">
      <div className="space-y-5">
        <ToggleRow label="Demo Mode" desc="Enable demo data and walkthrough experience" enabled={isDemoMode} onChange={toggleDemoMode} />
        <ToggleRow label="Judge Mode" desc="Show AI explainability overlays and metadata" enabled={isJudgeMode} onChange={toggleJudgeMode} />

        <div className="border-t border-white/[0.06] pt-5">
          <p className="text-sm font-medium text-ink mb-3">Switch Role</p>
          <p className="text-xs text-muted mb-4">Temporarily switch your role to view the platform from a different perspective.</p>
          <div className="flex gap-3">
            {(["loan-officer", "manager"] as UserRole[]).map((r) => {
              const isCurrent = r === role;
              return (
                <Link
                  key={r}
                  href={`/command-center?role=${r}`}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    isCurrent
                      ? "border-trust/30 bg-trust-light/20 text-trust"
                      : "border-white/[0.06] bg-white/[0.02] text-muted hover:border-white/[0.12] hover:text-ink"
                  }`}
                >
                  <RefreshCw className={`h-4 w-4 ${isCurrent ? "text-trust" : ""}`} />
                  <span>{roleLabels[r]}</span>
                  {isCurrent && (
                    <span className="ml-auto rounded-full bg-trust/20 px-2 py-0.5 text-[10px] text-trust">Active</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function ToggleRow({ label, desc, enabled, onChange }: { label: string; desc: string; enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-muted mt-0.5">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative ml-3 inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
          enabled ? "bg-trust" : "bg-white/[0.12]"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-canvas transition-transform ${
            enabled ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

let fieldIdCounter = 0;
function Field({ label, type, placeholder, showToggle, showPassword, onToggle }: { label: string; type: string; placeholder: string; showToggle?: boolean; showPassword?: boolean; onToggle?: () => void }) {
  const id = `field-${++fieldIdCounter}`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm text-muted">{label}</label>
      <div className="flex items-center rounded-xl border border-white/[0.1] bg-white/[0.02] transition-all focus-within:border-trust focus-within:ring-1 focus-within:ring-trust/20">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className="min-h-11 w-full bg-transparent px-4 text-sm text-ink outline-none placeholder:text-muted/30"
        />
        {showToggle && (
          <button type="button" onClick={onToggle} aria-label={showPassword ? "Hide password" : "Show password"} className="mr-3 text-muted hover:text-ink" tabIndex={-1}>
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );
}


