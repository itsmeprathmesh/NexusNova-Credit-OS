"use client";

import type { ReactNode } from "react";
import { GuideProvider } from "./guide-provider";
import { FloatingHelp } from "./floating-help";
import { TourEngine } from "./tour-engine";

export function JudgeShell({ children }: { children: ReactNode }) {
  return (
    <GuideProvider>
      <FloatingHelp />
      <TourEngine />
      {children}
    </GuideProvider>
  );
}
