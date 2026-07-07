"use client";

import type { ReactNode } from "react";
import { GuideProvider } from "./guide-provider";
import { FloatingHelp } from "./floating-help";
import { OnboardingShell } from "./onboarding-shell";

export function JudgeShell({ children }: { children: ReactNode }) {
  return (
    <GuideProvider>
      <FloatingHelp />
      <OnboardingShell>{children}</OnboardingShell>
    </GuideProvider>
  );
}
