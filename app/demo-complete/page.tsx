"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Eye, Clock, Activity, MonitorPlay, Home, Compass } from "lucide-react";
import { useOnboarding } from "@/features/judge-experience/onboarding-provider";
import { useDemoSession } from "@/contexts/demo-session";
import { useJudge } from "@/features/judge-experience";

const statCards = [
  {
    icon: Activity,
    label: "Features Explored",
    key: "pagesVisited" as const,
    color: "#D8FF3E",
    bg: "rgba(216,255,62,0.06)",
    border: "rgba(216,255,62,0.15)",
  },
  {
    icon: Eye,
    label: "AI Modules Viewed",
    key: "aiModulesReviewed" as const,
    color: "#FFC857",
    bg: "rgba(255,200,87,0.06)",
    border: "rgba(255,200,87,0.15)",
  },
  {
    icon: Compass,
    label: "Personas Demonstrated",
    value: 3,
    suffix: "",
    color: "#38D9C8",
    bg: "rgba(56,217,200,0.06)",
    border: "rgba(56,217,200,0.15)",
  },
  {
    icon: Clock,
    label: "Demo Duration",
    value: 8,
    suffix: " min",
    color: "#D8FF3E",
    bg: "rgba(216,255,62,0.06)",
    border: "rgba(216,255,62,0.15)",
  },
];

export default function DemoCompletePage() {
  const router = useRouter();
  const { endDemoSession } = useDemoSession();
  const { startTour } = useJudge();
  const { stats } = useOnboarding();

  const handleRestart = useCallback(() => {
    router.push("/");
    setTimeout(() => startTour(), 300);
  }, [router, startTour]);

  const handleExplore = useCallback(() => {
    router.push("/command-center?role=loan-officer");
  }, [router]);

  const handleBackHome = useCallback(() => {
    endDemoSession();
    router.push("/");
  }, [endDemoSession, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 py-8">
      <div className="relative mx-auto w-full max-w-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-trust/[0.02] via-transparent to-growth/[0.02] pointer-events-none rounded-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative space-y-8"
        >
          {/* Celebration */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-growth/10 mb-6"
            >
              <CheckCircle2 className="h-10 w-10 text-growth" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-3xl font-bold text-ink">
                Guided Demo Completed Successfully
              </h1>
              <p className="mt-3 text-sm text-muted leading-relaxed max-w-md">
                You have explored the complete AI-powered MSME Credit Intelligence workflow.
              </p>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-3"
          >
            {statCards.map((card) => {
              const Icon = card.icon;
              const val = card.value ?? stats[card.key];
              return (
                <div
                  key={card.label}
                  className="flex flex-col items-center rounded-xl border p-4"
                  style={{ borderColor: card.border, background: card.bg }}
                >
                  <Icon className="h-5 w-5 mb-1.5" style={{ color: card.color }} />
                  <span className="text-2xl font-bold text-ink">
                    {val}{card.suffix ?? ""}
                  </span>
                  <span className="text-xs text-muted text-center mt-0.5">
                    {card.label}
                  </span>
                </div>
              );
            })}
          </motion.div>

          {/* PS-3 Summary */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-xl border border-trust/15 bg-trust/[0.04] p-4"
          >
            <p className="text-xs text-muted leading-relaxed text-center">
              <span className="font-semibold text-trust">PS-3 Solved:</span>{" "}
              AI-powered Financial Health Card enables credit assessment for
              credit-invisible MSMEs using alternate data — GST, UPI, Bank AA,
              EPFO, and utility bills.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col gap-3"
          >
            <button
              onClick={handleRestart}
              className="flex items-center justify-center gap-2 rounded-xl bg-trust px-4 py-3 text-sm font-semibold text-canvas shadow-glow transition-all hover:shadow-[0_0_30px_rgba(216,255,62,0.25)] active:scale-[0.97]"
            >
              <MonitorPlay className="h-4 w-4" />
              Restart Guided Demo
            </button>
            <button
              onClick={handleExplore}
              className="flex items-center justify-center gap-2 rounded-xl border border-trust/20 bg-trust/10 px-4 py-3 text-sm font-semibold text-trust transition-all hover:bg-trust/20 active:scale-[0.97]"
            >
              <Sparkles className="h-4 w-4" />
              Explore Prototype
            </button>
            <button
              onClick={handleBackHome}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm font-semibold text-muted transition-all hover:text-ink hover:bg-white/[0.04] active:scale-[0.97]"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </button>
          </motion.div>

          {/* Status */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            <span className="flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-1.5 w-1.5 animate-ping rounded-full bg-growth" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-growth" />
            </span>
            <span className="text-xs text-muted/60">Demo Session Active</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
