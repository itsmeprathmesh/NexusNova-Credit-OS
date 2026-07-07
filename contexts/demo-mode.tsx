"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

export interface Shortcut {
  key: string;
  label: string;
  description: string;
  action: () => void;
}

export interface WalkthroughStep {
  target: string;
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right" | "center";
}

const DEFAULT_STEPS: WalkthroughStep[] = [
  {
    target: "",
    title: "Welcome to NexusNova Credit Intelligence OS",
    description:
      "An AI-powered MSME lending intelligence platform built for IDBI Innovate 2026. Take a quick tour of the key features.",
    position: "center",
  },
  {
    target: '[href="/command-center"]',
    title: "Command Center",
    description:
      "AI-powered operational hub with real-time alerts, pending tasks, and quick decision summaries.",
    position: "right",
  },
  {
    target: '[href="/applications"]',
    title: "Smart Application Review",
    description:
      "Every application includes AI explainability — confidence scores, risk factors, and rationale for each recommendation.",
    position: "right",
  },
  {
    target: '[href="/portfolio"]',
    title: "Portfolio Intelligence",
    description:
      "Enterprise-grade visualizations: risk heatmaps, sector comparisons, exposure treemaps, and migration timelines.",
    position: "right",
  },
  {
    target: '[href="/audit"]',
    title: "Audit Trail",
    description:
      "Complete compliance traceability with decision timestamps, AI rationale snapshots, and role-based access logs.",
    position: "right",
  },
  {
    target: "",
    title: "Pro Tips",
    description:
      "Press ? for keyboard shortcuts, D to toggle demo mode, and use ⌘K (or Ctrl+K) for instant search across the platform.",
    position: "center",
  },
];

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  enableDemoMode: () => void;
  isOnboardingActive: boolean;
  startOnboarding: () => void;
  endOnboarding: () => void;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  showShortcuts: boolean;
  toggleShortcuts: () => void;
  closeShortcuts: () => void;
  registerShortcut: (shortcut: Shortcut) => void;
  unregisterShortcut: (key: string) => void;
  triggerConfetti: () => void;
  confettiTrigger: number;
}

const DemoModeContext = createContext<DemoModeContextType | null>(null);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const router = useRouter();
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const toggleDemoMode = useCallback(() => {
    setIsDemoMode((prev) => !prev);
  }, []);

  const enableDemoMode = useCallback(() => {
    setIsDemoMode(true);
  }, []);

  const startOnboarding = useCallback(() => {
    setIsOnboardingActive(true);
    setCurrentStep(0);
    if (!isDemoMode) setIsDemoMode(true);
  }, [isDemoMode]);

  const endOnboarding = useCallback(() => {
    setIsOnboardingActive(false);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, DEFAULT_STEPS.length - 1));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, DEFAULT_STEPS.length - 1)));
  }, []);

  const toggleShortcuts = useCallback(() => {
    setShowShortcuts((prev) => !prev);
  }, []);

  const closeShortcuts = useCallback(() => {
    setShowShortcuts(false);
  }, []);

  const triggerConfetti = useCallback(() => {
    setConfettiTrigger((prev) => prev + 1);
  }, []);

  const registerShortcut = useCallback((shortcut: Shortcut) => {
    setShortcuts((prev) => {
      const exists = prev.find((s) => s.key === shortcut.key);
      if (exists) return prev;
      return [...prev, shortcut];
    });
  }, []);

  const unregisterShortcut = useCallback((key: string) => {
    setShortcuts((prev) => prev.filter((s) => s.key !== key));
  }, []);

  useEffect(() => {
    const builtinShortcuts: Shortcut[] = [
      {
        key: "?",
        label: "?",
        description: "Toggle keyboard shortcuts",
        action: () => setShowShortcuts((prev) => !prev),
      },
      {
        key: "d",
        label: "D",
        description: "Toggle demo mode",
        action: () => setIsDemoMode((prev) => !prev),
      },
      {
        key: "h",
        label: "H",
        description: "Go to home",
        action: () => router.push("/"),
      },
      {
        key: "Escape",
        label: "Esc",
        description: "Close modal or walkthrough",
        action: () => {
          setShowShortcuts(false);
          setIsOnboardingActive(false);
        },
      },
      {
        key: "1",
        label: "1",
        description: "Go to Command Center",
        action: () => router.push("/command-center"),
      },
      {
        key: "2",
        label: "2",
        description: "Go to Applications",
        action: () => router.push("/applications"),
      },
      {
        key: "3",
        label: "3",
        description: "Go to Portfolio",
        action: () => router.push("/portfolio"),
      },
      {
        key: "4",
        label: "4",
        description: "Go to Audit",
        action: () => router.push("/audit"),
      },
      {
        key: "5",
        label: "5",
        description: "Go to Reporting",
        action: () => router.push("/reporting"),
      },
    ];
    setShortcuts(builtinShortcuts);
  }, [router]);

  useEffect(() => {
    if (!isOnboardingActive) return;

    const step = DEFAULT_STEPS[currentStep];
    if (!step.target) return;

    const el = document.querySelector(step.target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentStep, isOnboardingActive]);

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        toggleDemoMode,
        enableDemoMode,
        isOnboardingActive,
        startOnboarding,
        endOnboarding,
        currentStep,
        totalSteps: DEFAULT_STEPS.length,
        nextStep,
        prevStep,
        goToStep,
        showShortcuts,
        toggleShortcuts,
        closeShortcuts,
        registerShortcut,
        unregisterShortcut,
        triggerConfetti,
        confettiTrigger,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const ctx = useContext(DemoModeContext);
  if (!ctx) throw new Error("useDemoMode must be used within DemoModeProvider");
  return ctx;
}
