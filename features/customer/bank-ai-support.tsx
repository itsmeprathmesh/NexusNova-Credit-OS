"use client";

import { useMemo, useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { applications, documents, financialSignals, msmes } from "@/data/mock-data";
import { answerBankAiQuestion, calculateCustomerReadiness } from "@/services/customer-support";
import { computeOverallFinancialHealthScore } from "@/services/alternate-data";
import { Badge, Button, Metric, Panel, ProgressBar } from "@/components/ui/primitives";
import { GlassPanel } from "@/components/ui/glass-panel";
import { EducationCards } from "./education-cards";

const application = applications[0];
const msme = msmes.find((item) => item.id === application.msmeId)!;
const signals = financialSignals.find((item) => item.msmeId === msme.id)!;
const applicationDocuments = documents.filter((document) => document.applicationId === application.id);

const prompts = [
  "What documents are missing?",
  "How can I improve loan eligibility?",
  "Why is my application under review?",
  "What does GST turnover mismatch mean?",
  "How much loan am I likely to get?"
];

export function BankAiSupport() {
  const [question, setQuestion] = useState(prompts[0]);
  const readiness = useMemo(() => calculateCustomerReadiness(application, applicationDocuments, signals), []);
  const healthScore = useMemo(() => computeOverallFinancialHealthScore(msme, signals), []);
  const answer = answerBankAiQuestion(question, {
    application,
    msme,
    documents: applicationDocuments,
    signals
  });

  return (
    <div className="space-y-5">
      <GlassPanel className="p-6">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-trust-light text-trust">
          <Bot className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold">AI Business Support</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Get simple guidance on your Financial Health Card, documents, eligibility, and loan readiness.
        </p>
      </GlassPanel>

      <div className="flex items-center gap-2 rounded-xl border border-trust/20 bg-trust-light/30 px-4 py-3">
        <Sparkles className="h-4 w-4 text-trust" />
        <span className="text-xs text-muted">
          Your Financial Health Score is <span className="font-semibold text-ink">{healthScore.score}/100</span>.
          AI Confidence: <span className="font-semibold text-ink">{healthScore.confidence}%</span>.
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Panel>
          <Metric label="Financial Health Score" value={`${healthScore.score}/100`} />
          <ProgressBar value={healthScore.score} className="mt-3" />
        </Panel>
        <Panel>
          <Metric label="Readiness Score" value={`${readiness.score}%`} />
          <ProgressBar value={readiness.score} className="mt-3" />
        </Panel>
      </div>

      <Panel title="Ask a question">
        <div className="flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setQuestion(prompt)}
              className={
                question === prompt
                  ? "rounded-lg bg-trust px-3 py-2 text-sm font-semibold text-canvas"
                  : "rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm font-semibold text-muted"
              }
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            className="min-h-12 min-w-0 flex-1 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 outline-none focus:border-trust"
          />
          <Button type="button" className="min-w-12 px-3" aria-label="Ask AI">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Panel>

      <Panel>
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-trust-light text-trust">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <Badge tone="info">AI Guidance</Badge>
            <h2 className="mt-3 text-xl font-semibold">{answer.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{answer.message}</p>
          </div>
        </div>
      </Panel>

      <Panel title="Suggested next actions">
        <div className="space-y-2">
          {answer.actions.length > 0 ? (
            answer.actions.map((action) => (
              <p key={action} className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3 text-sm font-semibold">
                {action}
              </p>
            ))
          ) : (
            <p className="text-sm text-muted">No immediate action required for this question.</p>
          )}
        </div>
      </Panel>

      <EducationCards />
    </div>
  );
}
