"use client";

import type { ReactNode } from "react";
import { DemoModeProvider } from "@/contexts/demo-mode";
import { WalkthroughOverlay } from "./walkthrough";
import { KeyboardShortcutsModal } from "./keyboard-shortcuts";
import { PresentationBanner } from "./presentation-banner";
import { Confetti } from "@/components/ui/confetti";
import { DemoKeyboardHandler } from "./keyboard-handler";

export function DemoShell({ children }: { children: ReactNode }) {
  return (
    <DemoModeProvider>
      <DemoKeyboardHandler />
      <WalkthroughOverlay />
      <KeyboardShortcutsModal />
      <PresentationBanner />
      <Confetti />
      {children}
    </DemoModeProvider>
  );
}
