"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Activity,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const BRANCHES = [
  "Mumbai Main Branch",
  "Delhi Corporate Branch",
  "Bangalore Tech Corridor",
  "Pune Industrial Finance",
  "Hyderabad Pharma Finance",
  "Chennai Manufacturing Hub",
  "Ahmedabad Trade Finance",
];

export default function StaffLoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("Mumbai Main Branch");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const fillDemo = useCallback((id: string) => {
    setEmployeeId(id);
    setPassword("demo123");
    setShowDemo(false);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId.trim() || !password.trim()) {
      setStatus("error");
      setErrorMsg("Please enter your Employee ID and password.");
      return;
    }
    setStatus("loading");
    const result = await login(employeeId.trim(), password);
    if (result.success) {
      setStatus("success");
      setTimeout(() => router.push("/command-center"), 800);
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Login failed. Please try again.");
    }
  }, [employeeId, password, login, router]);

  if (isAuthenticated) {
    return (
      <main id="main-content" className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-trust" />
          <p className="mt-4 text-sm text-muted">Redirecting to dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="flex min-h-screen flex-col bg-canvas">
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-trust mb-6">
              <ShieldCheck className="h-4 w-4" />
              NexusNova Bank Staff
            </Link>
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-trust text-canvas shadow-glow">
              <Activity className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-ink">Staff Sign In</h1>
            <p className="mt-1.5 text-sm text-muted">IDBI Bank — MSME Financial Health Card Platform</p>
          </div>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center rounded-2xl border border-growth/20 bg-growth/5 p-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-growth/10"
                >
                  <CheckCircle2 className="h-8 w-8 text-growth" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 font-semibold text-ink"
                >
                  Authentication Successful
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-1 text-sm text-muted"
                >
                  Redirecting to your workspace...
                </motion.p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2.5 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                    <p className="text-sm text-danger">{errorMsg}</p>
                  </motion.div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="employeeId" className="text-sm font-medium text-ink">Employee ID</label>
                    <div className={cn(
                      "flex items-center rounded-xl border bg-white/[0.02] transition-all duration-200",
                      focusedField === "employeeId" ? "border-trust ring-1 ring-trust/20" : "border-white/[0.1] hover:border-white/[0.2]"
                    )}>
                      <input
                        id="employeeId"
                        type="text"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        onFocus={() => setFocusedField("employeeId")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter your employee ID"
                        className="min-h-12 w-full bg-transparent px-4 text-sm text-ink outline-none placeholder:text-muted/50"
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="password" className="text-sm font-medium text-ink">Password</label>
                    <div className={cn(
                      "flex items-center rounded-xl border bg-white/[0.02] transition-all duration-200",
                      focusedField === "password" ? "border-trust ring-1 ring-trust/20" : "border-white/[0.1] hover:border-white/[0.2]"
                    )}>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter your password"
                        className="min-h-12 w-full bg-transparent px-4 text-sm text-ink outline-none placeholder:text-muted/50"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="mr-3 text-muted hover:text-ink"
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="branch" className="text-sm font-medium text-ink">Branch</label>
                    <select
                      id="branch"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="min-h-12 w-full rounded-xl border border-white/[0.1] bg-white/[0.02] px-4 text-sm text-ink outline-none transition-all hover:border-white/[0.2] focus:border-trust focus:ring-1 focus:ring-trust/20"
                    >
                      {BRANCHES.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-muted cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="h-4 w-4 rounded border-white/[0.2] bg-white/[0.04] text-trust focus:ring-trust/30"
                      />
                      Remember me
                    </label>
                    <button type="button" className="text-sm font-medium text-trust hover:text-trust/80 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="relative flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-trust font-semibold text-canvas shadow-glow transition-all hover:shadow-[0_0_30px_rgba(216,255,62,0.25)] active:scale-[0.98] disabled:opacity-70"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowDemo(!showDemo)}
                    className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-trust transition-colors"
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    {showDemo ? "Hide" : "Use"} Demo Credentials
                  </button>
                </div>

                <AnimatePresence>
                  {showDemo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden rounded-xl border border-trust/20 bg-trust-light/10"
                    >
                      <div className="p-4">
                        <p className="text-xs font-semibold text-trust mb-3">Demo Credentials</p>
                        <div className="space-y-2">
                          {[
                            { id: "LO1001", role: "Loan Officer", name: "Rahul Sharma" },
                            { id: "MG2001", role: "Manager", name: "Anita Desai" },
                          ].map((demo) => (
                            <button
                              key={demo.id}
                              type="button"
                              onClick={() => fillDemo(demo.id)}
                              className="flex w-full items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-left transition-all hover:bg-white/[0.04] hover:border-trust/30"
                            >
                              <div>
                                <p className="text-xs font-medium text-ink">{demo.role}</p>
                                <p className="text-[10px] text-muted">{demo.name} · {demo.id}</p>
                              </div>
                              <div className="text-right text-[10px] text-muted">
                                <p>ID: {demo.id}</p>
                                <p className="font-mono">demo123</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="mt-8 text-center text-xs text-muted">
            Authorised IDBI Bank personnel only. Unauthorised access is prohibited.
          </p>
        </div>
      </div>
    </main>
  );
}

function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
