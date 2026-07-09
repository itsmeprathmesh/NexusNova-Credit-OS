"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { CHECKLIST, FEATURE_DISCOVERY, TOUR_STEPS } from "./guide-config";

interface JudgeContextType {
  isJudgeMode: boolean;
  toggleJudgeMode: () => void;
  isHelpOpen: boolean;
  openHelp: () => void;
  closeHelp: () => void;
  tourActive: boolean;
  tourStep: number;
  tourTotalSteps: number;
  startTour: () => void;
  endTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  completedPages: string[];
  markComplete: (pageId: string) => void;
  checklistProgress: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  viewedFeatures: string[];
  markFeatureViewed: (id: string) => void;
  newFeatures: { id: string; label: string; path: string }[];
}

const JudgeContext = createContext<JudgeContextType | null>(null);

export function GuideProvider({ children }: { children: ReactNode }) {
  const [isJudgeMode, setIsJudgeMode] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [completedPages, setCompletedPages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewedFeatures, setViewedFeatures] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  const toggleJudgeMode = useCallback(() => setIsJudgeMode((p) => !p), []);
  const openHelp = useCallback(() => setIsHelpOpen(true), []);
  const closeHelp = useCallback(() => {
    setIsHelpOpen(false);
    setSearchQuery("");
  }, []);

  const startTour = useCallback(() => {
    setTourActive(true);
    setTourStep(0);
  }, []);

  const endTour = useCallback(() => {
    setTourActive(false);
    setIsHelpOpen(false);
    const first = TOUR_STEPS[0];
    if (first) router.push("/");
  }, [router]);

  const nextTourStep = useCallback(() => {
    const next = tourStep + 1;
    if (next >= TOUR_STEPS.length) {
      endTour();
      return;
    }
    setTourStep(next);
  }, [tourStep, endTour]);

  const prevTourStep = useCallback(() => {
    setTourStep((p) => Math.max(0, p - 1));
  }, []);

  const markComplete = useCallback((pageId: string) => {
    setCompletedPages((prev) => (prev.includes(pageId) ? prev : [...prev, pageId]));
  }, []);

  const markFeatureViewed = useCallback((id: string) => {
    setViewedFeatures((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const checklistProgress = Math.round(
    (completedPages.length / CHECKLIST.length) * 100
  );

  const newFeatures = FEATURE_DISCOVERY.filter(
    (f) => !viewedFeatures.includes(f.id)
  );

  useEffect(() => {
    if (pathname === "/") return;
    const guideId = pathname.replace(/^\//, "").replace(/\//g, "-").split("?")[0];
    const matched = CHECKLIST.find(
      (c) => pathname.startsWith(c.path.split("?")[0]) || guideId.startsWith(c.id)
    );
    if (matched && !completedPages.includes(matched.id)) {
      const timer = setTimeout(() => {
        setCompletedPages((prev) =>
          prev.includes(matched.id) ? prev : [...prev, matched.id]
        );
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [pathname, completedPages]);

  useEffect(() => {
    const handler = () => toggleJudgeMode();
    document.addEventListener("toggle-judge-mode", handler);
    return () => document.removeEventListener("toggle-judge-mode", handler);
  }, [toggleJudgeMode]);

  return (
    <JudgeContext.Provider
      value={{
        isJudgeMode,
        toggleJudgeMode,
        isHelpOpen,
        openHelp,
        closeHelp,
        tourActive,
        tourStep,
        tourTotalSteps: TOUR_STEPS.length,
        startTour,
        endTour,
        nextTourStep,
        prevTourStep,
        completedPages,
        markComplete,
        checklistProgress,
        searchQuery,
        setSearchQuery,
        viewedFeatures,
        markFeatureViewed,
        newFeatures,
      }}
    >
      {children}
    </JudgeContext.Provider>
  );
}

export function useJudge() {
  const ctx = useContext(JudgeContext);
  if (!ctx) throw new Error("useJudge must be used within GuideProvider");
  return ctx;
}
