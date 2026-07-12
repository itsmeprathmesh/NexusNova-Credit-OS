"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { TimerOff, LogIn, RotateCcw } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useCustomerAuth } from "@/contexts/customer-auth-context";

export default function SessionExpiredPage() {
  const { logout: staffLogout } = useAuth();
  const { logout: customerLogout } = useCustomerAuth();
  const router = useRouter();

  const handleRestart = useCallback(() => {
    staffLogout();
    customerLogout();
    router.push("/staff-login");
  }, [staffLogout, customerLogout, router]);

  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl border border-caution/20 bg-caution/5">
          <TimerOff className="h-10 w-10 text-caution" />
        </div>
        <h1 className="text-2xl font-bold text-ink">Session Expired</h1>
        <p className="mt-2 text-sm text-muted">
          Your session has expired. Please sign in again to continue.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={handleRestart}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-trust px-5 py-2.5 text-sm font-semibold text-canvas shadow-glow transition-all hover:shadow-[0_0_30px_rgba(216,255,62,0.25)] active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" />
            Start New Session
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-ink transition-all hover:bg-white/[0.08] active:scale-[0.98]"
          >
            <LogIn className="h-4 w-4" />
            Go to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
