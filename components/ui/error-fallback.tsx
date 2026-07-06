"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export function ErrorFallback({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset?: () => void;
}) {
  return (
    <div className="flex min-h-[400px] items-center justify-center p-8" role="alert">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-danger/10">
          <AlertTriangle className="h-8 w-8 text-danger" />
        </div>
        <h2 className="mt-6 text-xl font-semibold text-ink">Something went wrong</h2>
        <p className="mt-2 text-sm text-muted">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-muted">Error ID: {error.digest}</p>
        )}
        {reset && (
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-trust px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#1a526a] active:scale-[0.97]"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
