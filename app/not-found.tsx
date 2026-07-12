import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl border border-white/[0.08] bg-white/[0.02]">
          <FileQuestion className="h-10 w-10 text-muted" />
        </div>
        <h1 className="text-2xl font-bold text-ink">404 — Page Not Found</h1>
        <p className="mt-2 text-sm text-muted">
          This page does not exist or the record you are looking for is not available.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-trust px-5 py-2.5 text-sm font-semibold text-canvas shadow-glow transition-all hover:shadow-[0_0_30px_rgba(216,255,62,0.25)] active:scale-[0.98]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
