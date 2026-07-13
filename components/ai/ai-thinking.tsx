"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, RefreshCw } from "lucide-react";

const analysisSteps = [
  "Analyzing Financial Statements...",
  "Checking GST Consistency...",
  "Evaluating Cash Flow...",
  "Running Fraud Detection...",
  "Generating Credit Recommendation..."
];

export function AIThinking({ onComplete }: { onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (currentStep >= analysisSteps.length) {
      onComplete?.();
      return;
    }
    const timer = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setCurrentStep((prev) => prev + 1);
    }, 800 + Math.random() * 700);
    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <div className="space-y-3">
      {analysisSteps.map((step, index) => (
        <div key={step} className="flex items-center gap-3">
          {completedSteps.includes(index) ? (
            <motion.div
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-growth/10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-growth" />
            </motion.div>
          ) : index === currentStep ? (
            <motion.div
              className="grid h-6 w-6 shrink-0 place-items-center"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            >
              <RefreshCw className="h-3.5 w-3.5 text-trust" />
            </motion.div>
          ) : (
            <div className="grid h-6 w-6 shrink-0 place-items-center">
              <div className="h-2 w-2 rounded-full border border-line" />
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.span
              key={`${step}-${index}`}
              className={`text-sm ${completedSteps.includes(index) ? "text-muted" : index === currentStep ? "text-ink font-medium" : "text-muted/50"}`}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {step}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export function AIThinkingPanel({ isAnalyzing, onComplete }: { isAnalyzing: boolean; onComplete?: () => void }) {
  return (
    <div className="rounded-lg border border-line/50 bg-white/50 p-5 backdrop-blur-sm">
      {isAnalyzing ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <motion.div
              className="grid h-5 w-5 place-items-center"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            >
              <RefreshCw className="h-4 w-4 text-trust" />
            </motion.div>
            <p className="text-sm font-semibold text-trust">AI Analysis in Progress</p>
          </div>
          <AIThinking onComplete={onComplete} />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <motion.div
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-growth/10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <CheckCircle2 className="h-4 w-4 text-growth" />
          </motion.div>
          <div>
            <p className="text-sm font-semibold text-growth">AI Analysis Complete</p>
            <p className="mt-0.5 text-xs text-muted">All checks passed. Recommendation is ready for review.</p>
          </div>
        </div>
      )}
    </div>
  );
}
