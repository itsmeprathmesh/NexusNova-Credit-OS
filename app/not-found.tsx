import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-4 text-ink">
      <section className="animate-scale-in max-w-md rounded-lg border border-line bg-white p-6 text-center shadow-panel">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-amber-50 text-amber-700">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold">Record not found</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          The requested application or MSME record is not available in the v1 prototype data set.
        </p>
        <Link
          href="/applications"
          className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md bg-trust px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#1a526a] active:scale-[0.97]"
        >
          Back to applications
        </Link>
      </section>
    </main>
  );
}
