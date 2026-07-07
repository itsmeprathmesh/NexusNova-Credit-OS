"use client";

import type { ReactNode } from "react";
import { OnboardingProvider } from "./onboarding-provider";
import { WelcomeModal } from "./welcome-modal";
import { TourEngine } from "./tour-engine";
import { FinishScreen } from "./finish-screen";
import { FloatingChecklist } from "./floating-checklist";

export function OnboardingShell({ children }: { children: ReactNode }) {
  return (
    <OnboardingProvider>
      <WelcomeModal />
      <TourEngine />
      <FinishScreen />
      <FloatingChecklist />
      {children}
    </OnboardingProvider>
  );
}
