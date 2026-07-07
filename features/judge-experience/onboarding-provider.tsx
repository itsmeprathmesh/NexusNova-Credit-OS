"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useJudge } from "./guide-provider";
import { TOUR_STEPS, CHECKLIST } from "./guide-config";

export interface OnboardingStats {
  pagesVisited: number;
  featuresExplored: number;
  aiModulesReviewed: number;
  estimatedHoursSaved: number;
}

interface StoredOnboarding {
  completed: boolean;
  welcomeDismissed: boolean;
  tourCompleted: boolean;
  pagesVisited: string[];
  featuresExplored: string[];
  startTime: string;
}

interface OnboardingContextType {
  showWelcome: boolean;
  dismissWelcome: (neverShowAgain?: boolean) => void;
  startOnboardingTour: () => void;
  showFinish: boolean;
  openFinish: () => void;
  closeFinish: () => void;
  isOnboarded: boolean;
  stats: OnboardingStats;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

const STORAGE_KEY = "nexusnova-onboarding";

function loadStored(): StoredOnboarding {
  if (typeof window === "undefined")
    return {
      completed: false,
      welcomeDismissed: false,
      tourCompleted: false,
      pagesVisited: [],
      featuresExplored: [],
      startTime: "",
    };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    completed: false,
    welcomeDismissed: false,
    tourCompleted: false,
    pagesVisited: [],
    featuresExplored: [],
    startTime: new Date().toISOString(),
  };
}

function saveStored(data: StoredOnboarding) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const {
    completedPages,
    viewedFeatures,
    tourActive,
    tourStep,
    startTour,
    endTour,
    toggleJudgeMode,
  } = useJudge();
  const pathname = usePathname();

  const [stored, setStored] = useState<StoredOnboarding>(loadStored);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showFinish, setShowFinish] = useState(false);
  const autoOpenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (stored.welcomeDismissed || stored.completed) return;
    if (autoOpenTimer.current) return;
    autoOpenTimer.current = setTimeout(() => {
      setShowWelcome(true);
      autoOpenTimer.current = null;
    }, 1200);
    return () => {
      if (autoOpenTimer.current) {
        clearTimeout(autoOpenTimer.current);
        autoOpenTimer.current = null;
      }
    };
  }, [stored.welcomeDismissed, stored.completed]);

  useEffect(() => {
    saveStored(stored);
  }, [stored]);

  useEffect(() => {
    if (pathname === "/") return;
    const pageId = CHECKLIST.find(
      (c) => pathname.startsWith(c.path.split("?")[0]) || pathname.includes(c.id)
    );
    if (pageId && !stored.pagesVisited.includes(pageId.id)) {
      setStored((prev) => ({
        ...prev,
        pagesVisited: [...prev.pagesVisited, pageId.id],
      }));
    }
  }, [pathname, stored.pagesVisited]);

  useEffect(() => {
    const newFeatures = viewedFeatures.filter(
      (f) => !stored.featuresExplored.includes(f)
    );
    if (newFeatures.length > 0) {
      setStored((prev) => ({
        ...prev,
        featuresExplored: [...prev.featuresExplored, ...newFeatures],
      }));
    }
  }, [viewedFeatures, stored.featuresExplored]);

  const dismissWelcome = useCallback((neverShowAgain = false) => {
    setShowWelcome(false);
    if (neverShowAgain) {
      setStored((prev) => ({ ...prev, welcomeDismissed: true }));
    }
  }, []);

  const startOnboardingTour = useCallback(() => {
    setShowWelcome(false);
    toggleJudgeMode();
    setTimeout(() => startTour(), 300);
  }, [toggleJudgeMode, startTour]);

  const openFinish = useCallback(() => {
    setShowFinish(true);
    setShowWelcome(false);
    setStored((prev) => ({
      ...prev,
      completed: true,
      welcomeDismissed: true,
      tourCompleted: true,
    }));
  }, []);

  const closeFinish = useCallback(() => {
    setShowFinish(false);
  }, []);

  const resetOnboarding = useCallback(() => {
    const fresh: StoredOnboarding = {
      completed: false,
      welcomeDismissed: false,
      tourCompleted: false,
      pagesVisited: [],
      featuresExplored: [],
      startTime: new Date().toISOString(),
    };
    setStored(fresh);
    saveStored(fresh);
  }, []);

  const pagesCount = stored.pagesVisited.length;
  const stats: OnboardingStats = {
    pagesVisited: pagesCount,
    featuresExplored: stored.featuresExplored.length,
    aiModulesReviewed: Math.min(pagesCount, TOUR_STEPS.length),
    estimatedHoursSaved: Math.round(pagesCount * 0.5 * 10) / 10,
  };

  return (
    <OnboardingContext.Provider
      value={{
        showWelcome,
        dismissWelcome,
        startOnboardingTour,
        showFinish,
        openFinish,
        closeFinish,
        isOnboarded: stored.completed,
        stats,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
