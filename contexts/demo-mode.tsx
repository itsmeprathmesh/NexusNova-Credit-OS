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
  purpose: string;
  businessValue: string;
  estimatedTime: string;
  nextAction: string;
  position?: "top" | "bottom" | "left" | "right" | "center";
}

const DEMO_STEPS: WalkthroughStep[] = [
  {
    target: "",
    title: "The Problem",
    description: "60% of Indian MSMEs are credit-invisible — they have no ITR, no audited financials, and no credit score. Traditional banks reject them. NexusNova solves this using alternate data.",
    purpose: "Understand why 10 crore+ MSMEs cannot access formal credit despite being viable businesses.",
    businessValue: "Unlocks a ₹50 lakh crore lending opportunity currently served by informal lenders at 24-36% interest.",
    estimatedTime: "20 sec",
    nextAction: "See how an MSME onboards",
    position: "center",
  },
  {
    target: "",
    title: "Customer Onboarding",
    description: "An MSME owner registers, connects their digital footprint (GST, UPI, Bank, EPFO), and the system begins building their financial profile instantly.",
    purpose: "Demonstrate zero-paper, zero-branch-visit onboarding that captures alternate data from 5+ sources.",
    businessValue: "Reduces customer acquisition cost by 70% and onboarding time from weeks to minutes.",
    estimatedTime: "30 sec",
    nextAction: "Explore alternate data connections",
    position: "center",
  },
  {
    target: "",
    title: "Alternate Data Connections",
    description: "GST returns verify revenue. UPI transactions prove cash flow. Account Aggregator provides bank statements. EPFO validates payroll. Utility bills confirm operations.",
    purpose: "Show how 5 data sources replace traditional financial documents for credit assessment.",
    businessValue: "Assess credit-invisible MSMEs with 96% confidence using their digital footprint alone.",
    estimatedTime: "30 sec",
    nextAction: "View the Financial Health Card",
    position: "center",
  },
  {
    target: "",
    title: "Financial Health Card",
    description: "One unified AI-powered card showing health score, risk band, credit limit, and factor contribution — replacing 20+ pages of financial analysis.",
    purpose: "Deliver a single-page credit decision that every bank officer can understand in under 60 seconds.",
    businessValue: "Reduces loan processing time from 5 days to under 2 hours with standardized assessment.",
    estimatedTime: "45 sec",
    nextAction: "Understand AI explainability",
    position: "center",
  },
  {
    target: "",
    title: "AI Explainability",
    description: "Every AI decision includes factor contribution (what matters most), confidence scores (how sure AI is), and improvement recommendations (how to get better terms).",
    purpose: "Build trust through transparency — bank officers must understand and justify every AI recommendation to regulators.",
    businessValue: "Satisfies RBI guidelines on responsible AI with full explainability and audit trail.",
    estimatedTime: "45 sec",
    nextAction: "Check loan readiness",
    position: "center",
  },
  {
    target: "",
    title: "Loan Readiness",
    description: "AI determines if the MSME has enough quality data for automated processing or needs human review. Readiness score, confidence, and estimated approval are shown instantly.",
    purpose: "Show how AI triages applications to streamline the lending pipeline.",
    businessValue: "70% of applications can be auto-approved, reducing manual review workload by 3x.",
    estimatedTime: "30 sec",
    nextAction: "Enter the Loan Officer Workspace",
    position: "center",
  },
  {
    target: "",
    title: "Loan Officer Workspace",
    description: "Complete AI workspace with 9 AI engines, simulated credit committee (4 AI personas), stress testing, and human decision override with full audit trail.",
    purpose: "Demonstrate that AI recommends — humans decide. Every tool a loan officer needs for informed credit decisions.",
    businessValue: "One workspace replaces 5 different banking systems with AI-powered decision support.",
    estimatedTime: "1 min",
    nextAction: "Generate the Credit Memo",
    position: "center",
  },
  {
    target: "",
    title: "Credit Memo",
    description: "AI generates a bank-grade credit memo with risk assessment, financial ratios, peer comparison, and recommendation — replacing 4 hours of analyst work.",
    purpose: "Show production-ready documentation that satisfies bank approval authority requirements.",
    businessValue: "Saves 3-4 hours per application and ensures consistent, compliant credit memos every time.",
    estimatedTime: "30 sec",
    nextAction: "View the Manager Dashboard",
    position: "center",
  },
  {
    target: "",
    title: "Manager Dashboard",
    description: "Portfolio-level view with risk heatmaps, sector comparisons, exposure treemaps, and early warning system for deteriorating MSMEs.",
    purpose: "Demonstrate enterprise portfolio monitoring that enables proactive risk management.",
    businessValue: "Catches potential NPAs 2-3 months earlier than traditional monitoring, reducing credit losses by 40%.",
    estimatedTime: "45 sec",
    nextAction: "Explore Portfolio Intelligence",
    position: "center",
  },
  {
    target: "",
    title: "Portfolio Intelligence",
    description: "Deep portfolio analytics: risk migration timelines, branch performance, credit exposure monitoring, dynamic credit limits, and what-if stress scenarios.",
    purpose: "Show how banks can optimize portfolio quality with data-driven intelligence.",
    businessValue: "Improves portfolio health score by 15-20% through proactive risk management and dynamic limits.",
    estimatedTime: "45 sec",
    nextAction: "Visit the Executive Dashboard",
    position: "center",
  },
  {
    target: "",
    title: "Executive Dashboard",
    description: "Board-ready dashboard with portfolio KPIs, financial inclusion metrics, portfolio quality trends, and business impact analysis.",
    purpose: "Provide executive leadership with real-time visibility into lending operations and portfolio health.",
    businessValue: "Board-presentation quality dashboards that show business outcomes, not just operational metrics.",
    estimatedTime: "45 sec",
    nextAction: "See the Business Impact",
    position: "center",
  },
  {
    target: "",
    title: "Business Impact",
    description: "5 days → 2 hours processing. 60% market expansion. 80% cost reduction. 100% explainable. Zero infrastructure. This is what NexusNova delivers.",
    purpose: "Summarize the measurable business value of deploying AI-powered MSME lending.",
    businessValue: "ROI within 6 months through reduced processing costs, expanded portfolio, and lower credit losses.",
    estimatedTime: "30 sec",
    nextAction: "Demo complete — explore freely",
    position: "center",
  },
];

interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  isOnboardingActive: boolean;
  startOnboarding: () => void;
  endOnboarding: () => void;
  currentStep: number;
  totalSteps: number;
  demoSteps: WalkthroughStep[];
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

  const disableDemoMode = useCallback(() => {
    setIsDemoMode(false);
    setIsOnboardingActive(false);
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
    setCurrentStep((prev) => Math.min(prev + 1, DEMO_STEPS.length - 1));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, DEMO_STEPS.length - 1)));
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
        key: "ctrl+k",
        label: "Ctrl+K",
        description: "Open search",
        action: () => {
          const searchInput = document.querySelector<HTMLInputElement>('[data-search-input]');
          if (searchInput) { searchInput.focus(); return; }
          router.push("/command-center");
        },
      },
      {
        key: "d",
        label: "D",
        description: "Toggle demo mode",
        action: () => setIsDemoMode((prev) => !prev),
      },
      {
        key: "j",
        label: "J",
        description: "Toggle judge mode",
        action: () => {
          document.dispatchEvent(new CustomEvent("toggle-judge-mode"));
        },
      },
      {
        key: "h",
        label: "H",
        description: "Go to home",
        action: () => router.push("/"),
      },
      {
        key: "p",
        label: "P",
        description: "Go to Portfolio",
        action: () => router.push("/portfolio"),
      },
      {
        key: "a",
        label: "A",
        description: "Go to Applications",
        action: () => router.push("/applications"),
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

    const step = DEMO_STEPS[currentStep];
    if (!step.target) return;

    const el = document.querySelector(step.target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentStep, isOnboardingActive]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        const s = shortcutsRef.current.find((s) => s.key === "ctrl+k");
        s?.action();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        toggleDemoMode,
        enableDemoMode,
        disableDemoMode,
        isOnboardingActive,
        startOnboarding,
        endOnboarding,
        currentStep,
        totalSteps: DEMO_STEPS.length,
        demoSteps: DEMO_STEPS,
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
