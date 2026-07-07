"use client";

import { useEffect, useRef } from "react";
import { useDemoMode } from "@/contexts/demo-mode";

export function DemoKeyboardHandler() {
  const {
    toggleDemoMode,
    toggleShortcuts,
    endOnboarding,
    closeShortcuts,
  } = useDemoMode();

  const isOnboardingActiveRef = useRef(false);
  const showShortcutsRef = useRef(false);

  const { isOnboardingActive, showShortcuts } = useDemoMode();

  isOnboardingActiveRef.current = isOnboardingActive;
  showShortcutsRef.current = showShortcuts;

  useEffect(() => {
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
        if (showShortcutsRef.current) {
          closeShortcuts();
          return;
        }
        if (isOnboardingActiveRef.current) {
          endOnboarding();
          return;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleDemoMode, toggleShortcuts, closeShortcuts, endOnboarding]);

  return null;
}
