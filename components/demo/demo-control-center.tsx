"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  UserRound,
  ClipboardCheck,
  BriefcaseBusiness,
  Presentation,
  MonitorPlay,
  RotateCcw,
  Database,
  Eye,
  KeyRound,
  ListChecks,
  BarChart3,
  ChevronRight,
  CheckCircle2,
  LogOut,
  Users,
  LayoutDashboard,
} from "lucide-react";
import { useDemoMode } from "@/contexts/demo-mode";
import { useDemoSession } from "@/contexts/demo-session";
import { useJudge } from "@/features/judge-experience";
import { resetDemoData } from "@/services/demo-seed";
import { useAuth } from "@/contexts/auth-context";

const personas = [
  { id: "customer", label: "Customer", icon: UserRound, href: "/customer/dashboard", desc: "View as MSME customer" },
  { id: "loan-officer", label: "Loan Officer", icon: ClipboardCheck, href: "/command-center?role=loan-officer", desc: "Assess loan applications" },
  { id: "manager", label: "Manager", icon: BriefcaseBusiness, href: "/command-center?role=manager", desc: "Monitor portfolio health" },
  { id: "executive", label: "Executive", icon: Presentation, href: "/reporting/executive", desc: "Board-ready dashboards" },
];

export function DemoControlCenter() {
  const { isDemoMode, toggleDemoMode } = useDemoMode();
  const { switchDemoRole, endDemoSession } = useDemoSession();
  const { isJudgeMode, toggleJudgeMode, startTour, checklistProgress, completedPages } = useJudge();
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showCredentials, setShowCredentials] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (open && ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handlePersonaSwitch = useCallback((href: string, roleId: string) => {
    setOpen(false);
    switchDemoRole(roleId as any);
    router.push(href);
  }, [router, switchDemoRole]);

  const handleResetDemo = useCallback(() => {
    endDemoSession();
    window.location.href = "/";
  }, [endDemoSession]);

  const handleResetData = useCallback(() => {
    resetDemoData();
    window.location.reload();
  }, []);

  const toggleSection = useCallback((id: string) => {
    setExpandedSection((prev) => (prev === id ? null : id));
  }, []);

  if (!isDemoMode) return null;

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-50 grid h-12 w-12 place-items-center rounded-2xl bg-trust text-canvas shadow-glow transition-all duration-200 hover:shadow-[0_0_30px_rgba(216,255,62,0.25)] active:scale-90"
        aria-label={open ? "Close demo control center" : "Open demo control center"}
        title="Demo Control Center (Ctrl+Shift+D)"
      >
        {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: 20 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed bottom-24 left-6 z-50 w-80 rounded-2xl border border-white/[0.08] bg-panel shadow-glass max-h-[70vh] overflow-y-auto"
          >
            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-trust-light text-trust">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">Demo Control Center</p>
                    <p className="text-[10px] text-muted">Judge tools & persona switching</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid h-7 w-7 place-items-center rounded-lg text-muted hover:bg-white/[0.06] hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Personas */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-2">Switch Persona</p>
                <div className="grid grid-cols-2 gap-2">
                  {personas.map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handlePersonaSwitch(p.href, p.id)}
                        className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-all hover:border-trust/30 hover:bg-trust-light/10 active:scale-[0.97]"
                      >
                        <Icon className="h-4 w-4 text-trust" />
                        <span className="text-xs font-medium text-ink">{p.label}</span>
                        <span className="text-[9px] text-muted leading-tight text-center">{p.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Demo Progress */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleSection("progress")}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-white/[0.04] hover:text-ink"
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="h-4 w-4" />
                    <span>Demo Progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-trust">{checklistProgress}%</span>
                    <ChevronRight className={`h-3.5 w-3.5 transition-transform ${expandedSection === "progress" ? "rotate-90" : ""}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {expandedSection === "progress" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 space-y-2">
                        <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                          <div className="h-full rounded-full bg-trust transition-all duration-500" style={{ width: `${checklistProgress}%` }} />
                        </div>
                        <p className="text-[10px] text-muted">{completedPages.length} of 12 feature stops completed</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider */}
              <div className="border-t border-white/[0.06]" />

              {/* Actions */}
              <div className="space-y-1">
                <ActionButton icon={MonitorPlay} label="Restart Guided Tour" onClick={() => { startTour(); setOpen(false); }} />
                <ActionButton icon={RotateCcw} label="Reset Demo" onClick={handleResetDemo} />
                <ActionButton icon={Database} label="Reset Data" onClick={handleResetData} />
                <ActionButton
                  icon={Eye}
                  label="Judge Mode"
                  onClick={toggleJudgeMode}
                  active={isJudgeMode}
                />
                <ActionButton
                  icon={KeyRound}
                  label="Demo Credentials"
                  onClick={() => setShowCredentials(!showCredentials)}
                  expanded={showCredentials}
                />
                <ActionButton icon={ListChecks} label="Feature Checklist" onClick={() => { setOpen(false); document.dispatchEvent(new CustomEvent("open-judge-help")); }} />
              </div>

              {/* Demo Credentials */}
              <AnimatePresence>
                {showCredentials && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-xl border border-trust/20 bg-trust-light/10 p-3 space-y-2">
                      <p className="text-[10px] font-semibold text-trust">Demo Credentials</p>
                      {[
                        { id: "LO1001", pwd: "demo123", role: "Loan Officer", name: "Rahul Sharma" },
                        { id: "MG2001", pwd: "demo123", role: "Manager", name: "Anita Desai" },
                      ].map((c) => (
                        <div key={c.id} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                          <div>
                            <p className="text-xs font-medium text-ink">{c.role}</p>
                            <p className="text-[10px] text-muted">{c.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-mono text-muted">{c.id}</p>
                            <p className="text-[10px] font-mono text-trust">{c.pwd}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <div className="border-t border-white/[0.06] pt-3 flex items-center justify-between">
                <span className="text-[10px] text-muted">Ctrl+Shift+D</span>
                <div className="flex items-center gap-1.5">
                  <span className="flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-1.5 w-1.5 animate-ping rounded-full bg-growth" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-growth" />
                  </span>
                  <span className="text-[10px] font-medium text-growth">Demo Active</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  active,
  expanded,
}: {
  icon: typeof Sparkles;
  label: string;
  onClick: () => void;
  active?: boolean;
  expanded?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all ${
        active
          ? "bg-trust-light/20 text-trust font-medium"
          : "text-muted hover:bg-white/[0.04] hover:text-ink"
      }`}
    >
      <Icon className={`h-4 w-4 ${active ? "text-trust" : ""}`} />
      <span className="flex-1 text-left">{label}</span>
      {active && <CheckCircle2 className="h-3.5 w-3.5 text-trust" />}
      {expanded !== undefined && (
        <ChevronRight className={`h-3 w-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
      )}
    </button>
  );
}
