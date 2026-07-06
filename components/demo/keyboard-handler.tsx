"use client";

import { useEffect, useRef } from "react";
import { useDemoMode } from "@/contexts/demo-mode";

export function DemoKeyboardHandler() {
  const {
    toggleDemoMode,
    toggleShortcuts,
    endOnboarding,
    isOnboardingActive,
    closeShortcuts,
    showShortcuts,
  } = useDemoMode();

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      if (isInput) return;

      if (e.key === "?") {
        e.preventDefault();
        toggleShortcuts();
        return;
      }

      if (e.key === "d" || e.key === "D") {
        if (!e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          toggleDemoMode();
          return;
        }
      }

      if (e.key === "Escape") {
        if (showShortcuts) {
          closeShortcuts();
          return;
        }
        if (isOnboardingActive) {
          endOnboarding();
          return;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleDemoMode, toggleShortcuts, closeShortcuts, endOnboarding, isOnboardingActive, showShortcuts]);

  return null;
}
