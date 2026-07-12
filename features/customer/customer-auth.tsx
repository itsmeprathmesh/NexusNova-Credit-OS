"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Activity,
  LockKeyhole,
  UserPlus,
  ShieldCheck,
  Sparkles,
  FileText,
  Smartphone,
  Building2,
} from "lucide-react";
import { useCustomerAuth } from "@/contexts/customer-auth-context";
import { login as appLogin } from "@/services/app-data";

const steps = [
  { icon: FileText, label: "Connect GST", desc: "Verify your business identity" },
  { icon: Smartphone, label: "Connect UPI", desc: "Show digital payment behaviour" },
  { icon: Building2, label: "Connect Bank (AA)", desc: "Share banking data securely" },
  { icon: Activity, label: "Get Health Card", desc: "AI generates your financial profile" },
];

export function CustomerLogin() {
  const router = useRouter();
  const { login: authLogin } = useCustomerAuth();
  const [mobile, setMobile] = useState("+91 98765 43210");

  const handleLogin = useCallback(() => {
    appLogin("msme-aurora");
    authLogin("msme-aurora", "Aurora Precision Tools", mobile);
    router.push("/customer/dashboard");
  }, [router, authLogin, mobile]);

  return (
    <main className="min-h-screen bg-canvas px-4 py-6 text-ink">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-5xl items-center gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-trust">
            <ShieldCheck className="h-4 w-4" />
            NexusNova — MSME Financial Health Card
          </Link>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">
            Get your AI-powered Financial Health Card
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">
            No ITR? No audited financials? No problem. Connect your alternate data sources and let
            AI assess your credit worthiness.{" "}
            <span className="text-ink font-medium">From zero to loan-ready in minutes.</span>
          </p>

          <div className="mt-8 grid gap-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-trust-light text-trust">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {i + 1}. {step.label}
                    </p>
                    <p className="text-xs text-muted">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-xl border border-trust/20 bg-trust-light/30 px-4 py-3">
            <Sparkles className="h-4 w-4 text-trust" />
            <span className="text-sm text-muted">
              No documents needed upfront — we use your existing business data.
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 shadow-glass">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-trust-light text-trust">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold">Sign in to continue</h2>
          <p className="mt-2 text-sm text-muted">
            Access your Financial Health Card and track your loan readiness journey.
          </p>
          <div className="mt-5 space-y-4">
            <label className="block" htmlFor="login-mobile">
              <span className="text-sm font-semibold">Mobile number</span>
              <input
                id="login-mobile"
                className="mt-2 min-h-12 w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 outline-none focus:border-trust"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </label>
            <label className="block" htmlFor="login-password">
              <span className="text-sm font-semibold">Password</span>
              <input id="login-password" className="mt-2 min-h-12 w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 outline-none focus:border-trust" type="password" defaultValue="password" />
            </label>
            <button
              type="button"
              onClick={handleLogin}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-trust px-4 text-sm font-semibold text-canvas shadow-glow transition-all hover:shadow-[0_0_30px_rgba(216,255,62,0.25)]"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              href="/customer/register"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/[0.08] px-4 text-sm font-semibold transition-all hover:bg-white/[0.04]"
            >
              <UserPlus className="h-4 w-4" />
              Register your business
            </Link>
          </div>
          <div className="mt-5 rounded-lg border border-trust/20 bg-trust-light/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-trust">Demo credentials</p>
            <p className="mt-2 text-xs text-muted">Mobile: +91 98765 43210 · Password: (any value)</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export function CustomerRegister() {
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: "Aurora Precision Tools",
    ownerName: "Rohit Kulkarni",
    mobile: "+91 98765 43210",
    city: "Pune",
    pan: "AAKPA1842K",
    gstin: "27AAKPA1842K1Z8"
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleRegister = useCallback(() => {
    router.push("/customer/business");
  }, [router]);

  return (
    <main className="min-h-screen bg-canvas px-4 py-6 text-ink">
      <section className="mx-auto max-w-3xl">
        <Link href="/customer/login" className="inline-flex items-center gap-2 text-sm font-semibold text-trust">
          <ArrowRight className="h-4 w-4" />
          Already registered? Login
        </Link>
        <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 shadow-glass">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-trust-light text-trust">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold">Start your Financial Health Journey</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Register your MSME to begin the alternate data assessment. No traditional documents
            required — just your basic business information to get started.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Business name", "businessName"],
              ["Owner name", "ownerName"],
              ["Mobile number", "mobile"],
              ["City", "city"],
              ["PAN", "pan"],
              ["GSTIN", "gstin"]
            ].map(([label, field]) => (
              <label key={field} className="block" htmlFor={`register-${field}`}>
                <span className="text-sm font-semibold">{label}</span>
                <input
                  id={`register-${field}`}
                  className="mt-2 min-h-12 w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 outline-none focus:border-trust"
                  value={(form as any)[field]}
                  onChange={set(field)}
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={handleRegister}
            className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-trust px-4 text-sm font-semibold text-canvas shadow-glow transition-all hover:shadow-[0_0_30px_rgba(216,255,62,0.25)]"
          >
            Continue to Business Profile
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </main>
  );
}
