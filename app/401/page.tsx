import Link from "next/link";
import { ShieldAlert, ArrowLeft, LogIn } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl border border-danger/20 bg-danger/5">
          <ShieldAlert className="h-10 w-10 text-danger" />
        </div>
        <h1 className="text-2xl font-bold text-ink">401 — Unauthorized</h1>
        <p className="mt-2 text-sm text-muted">
          You are not signed in. Please log in to access this page.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/staff-login"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-trust px-5 py-2.5 text-sm font-semibold text-canvas shadow-glow transition-all hover:shadow-[0_0_30px_rgba(216,255,62,0.25)] active:scale-[0.98]"
          >
            <LogIn className="h-4 w-4" />
            Staff Sign In
          </Link>
          <Link
            href="/customer/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-ink transition-all hover:bg-white/[0.08] active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            Customer Login
          </Link>
        </div>
      </div>
    </main>
  );
}
