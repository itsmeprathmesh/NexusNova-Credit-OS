"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";
import type { UserRole } from "@/domain/types";
import { useAuth } from "@/contexts/auth-context";

interface AccessDeniedProps {
  role: UserRole;
}

const roleLabels: Record<UserRole, string> = {
  "loan-officer": "Loan Officer",
  manager: "Manager",
};

export function AccessDenied({ role }: AccessDeniedProps) {
  const { logout } = useAuth();

  return (
    <div id="main-content" className="flex min-h-screen items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl border border-danger/20 bg-danger/5">
          <ShieldAlert className="h-10 w-10 text-danger" />
        </div>

        <h1 className="text-2xl font-bold text-ink">Access Denied</h1>
        <p className="mt-2 text-sm text-muted">
          Your account is registered as a <span className="font-semibold text-ink">{roleLabels[role]}</span>.
          You do not have permission to access this section.
        </p>

        <div className="mt-2 rounded-xl border border-caution/20 bg-caution-light/10 px-4 py-3">
          <p className="text-xs text-caution">
            Only users with a Manager role can access this page.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/command-center"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-ink transition-all hover:bg-white/[0.08] active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <button
            onClick={() => { logout(); window.location.href = "/staff-login"; }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-trust px-5 py-2.5 text-sm font-semibold text-canvas shadow-glow transition-all hover:shadow-[0_0_30px_rgba(216,255,62,0.25)] active:scale-[0.98]"
          >
            <LogOut className="h-4 w-4" />
            Sign Out &amp; Switch Account
          </button>
        </div>
      </div>
    </div>
  );
}
