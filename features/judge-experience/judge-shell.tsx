"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { GuideProvider } from "./guide-provider";
import { OnboardingShell } from "./onboarding-shell";

const FloatingHelp = dynamic(() => import("./floating-help").then((m) => ({ default: m.FloatingHelp })), { ssr: false });

export function JudgeShell({ children }: { children: ReactNode }) {
  return (
    <GuideProvider>
      <FloatingHelp />
      <OnboardingShell>{children}</OnboardingShell>
    </GuideProvider>
  );
}
