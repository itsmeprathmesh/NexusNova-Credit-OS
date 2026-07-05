"use client";

import { useMemo, useState } from "react";
import { Bot, Send } from "lucide-react";
import { applications, documents, financialSignals, msmes } from "@/data/mock-data";
import { answerBankAiQuestion, calculateCustomerReadiness } from "@/services/customer-support";
import { Badge, Button, Metric, Panel, ProgressBar } from "@/components/ui/primitives";

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
  const answer = answerBankAiQuestion(question, {
    application,
    msme,
    documents: applicationDocuments,
    signals
  });

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-ink p-5 text-white shadow-sm">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/10">
          <Bot className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold">BANK AI Business Support</h1>
        <p className="mt-3 text-sm leading-6 text-white/75">
          Get simple guidance on documents, eligibility, review status, GST mismatch, and likely loan amount.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Panel>
          <Metric label="Readiness Score" value={`${readiness.score}%`} />
          <ProgressBar value={readiness.score} className="mt-3" />
        </Panel>
        <Panel>
          <Metric label="Open Actions" value={readiness.nextActions.length} hint="Based on current submitted data" />
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
                  ? "rounded-lg bg-trust px-3 py-2 text-sm font-semibold text-white"
                  : "rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-muted"
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
            className="min-h-12 min-w-0 flex-1 rounded-lg border border-line px-3 outline-none focus:border-trust"
          />
          <Button type="button" className="min-w-12 px-3" aria-label="Ask BANK AI">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Panel>

      <Panel>
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-trust">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <Badge tone="info">Simulated AI Guidance</Badge>
            <h2 className="mt-3 text-xl font-semibold">{answer.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{answer.message}</p>
          </div>
        </div>
      </Panel>

      <Panel title="Suggested next actions">
        <div className="space-y-2">
          {answer.actions.length > 0 ? (
            answer.actions.map((action) => (
              <p key={action} className="rounded-lg bg-slate-50 p-3 text-sm font-semibold">
                {action}
              </p>
            ))
          ) : (
            <p className="text-sm text-muted">No immediate action required for this question.</p>
          )}
        </div>
      </Panel>
    </div>
  );
}
