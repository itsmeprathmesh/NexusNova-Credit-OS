"use client";

import { RefreshCw, Activity } from "lucide-react";

export function LoadingGuard({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-canvas px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-trust/10">
          <Activity className="h-8 w-8 text-trust" />
        </div>
        <RefreshCw className="mx-auto h-6 w-6 animate-spin text-trust" />
        <p className="mt-4 text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}

export function LoadingSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-4 p-6">
      <div className="h-8 w-48 animate-pulse rounded-xl bg-white/[0.06]" />
      <div className="h-4 w-72 animate-pulse rounded-xl bg-white/[0.04]" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-xl bg-white/[0.04]" style={{ animationDelay: `${i * 100}ms` }} />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-white/[0.06]" />
        <div className="space-y-2">
          <div className="h-5 w-40 animate-pulse rounded-lg bg-white/[0.06]" />
          <div className="h-3 w-60 animate-pulse rounded-lg bg-white/[0.04]" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/[0.04]" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
      <div className="h-48 animate-pulse rounded-2xl bg-white/[0.04]" />
    </div>
  );
}
