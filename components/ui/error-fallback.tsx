"use client";

import { useState } from "react";
import { AlertTriangle, RefreshCw, ExternalLink, X } from "lucide-react";

export function ErrorFallback({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset?: () => void;
}) {
  const [ticketCreated, setTicketCreated] = useState(false);
  const isNetwork = error.message?.includes("fetch") || error.message?.includes("network") || error.message?.includes("Network");
  const userMessage = isNetwork
    ? "Unable to connect to the server. Please check your internet connection and try again."
    : "We encountered an issue processing your request. Our team has been notified.";

  return (
    <div className="flex min-h-[400px] items-center justify-center p-8" role="alert">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-danger/10">
          <AlertTriangle className="h-8 w-8 text-danger" />
        </div>
        <h2 className="mt-6 text-xl font-semibold text-ink">Action could not be completed</h2>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          {userMessage}
        </p>
        {error.digest && (
          <p className="mt-3 text-xs text-muted">
            Reference ID: <code className="rounded bg-white/[0.04] px-1.5 py-0.5 font-mono text-trust">{error.digest}</code>
          </p>
        )}

        {ticketCreated && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-success-light px-4 py-2 text-sm font-medium text-success border border-success/20">
            <span>Support ticket created. Our team will review the issue.</span>
            <button type="button" onClick={() => setTicketCreated(false)} className="ml-1 hover:opacity-70" aria-label="Dismiss">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {reset && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl bg-trust px-5 py-2.5 text-sm font-semibold text-canvas transition-all duration-150 hover:shadow-[0_0_30px_rgba(216,255,62,0.25)] active:scale-[0.97]"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          )}
          <button
            type="button"
            onClick={() => setTicketCreated(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-white/[0.08] active:scale-[0.97]"
          >
            <ExternalLink className="h-4 w-4" />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
