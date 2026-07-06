import { CheckCircle2, Lightbulb, TrendingUp } from "lucide-react";
import type { IntelligenceResult } from "@/domain/types";
import { Badge, Panel, ProgressBar, RiskBadge } from "@/components/ui/primitives";

export function ExplainabilityPanel({ results }: { results: { label: string; result: IntelligenceResult }[] }) {
  return (
    <Panel title="Explainability 2.0">
      <div className="space-y-6">
        {results.map(({ label, result }) => (
          <div key={label} className="rounded-lg border border-line p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <RiskBadge band={result.band} />
                <p className="font-semibold">{label}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted">{result.confidence}% confidence</span>
                <Badge tone={result.score >= 70 ? "success" : result.score >= 40 ? "warning" : "danger"}>
                  Score {result.score}
                </Badge>
              </div>
            </div>

            <ProgressBar value={result.score} className="mt-3" />

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <div className="flex items-start gap-2">
                  <Lightbulb className="mt-0.5 h-4 w-4 text-trust" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Observation & reasoning</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{result.reason}</p>
                  </div>
                </div>

                {result.evidence.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Evidence</p>
                    <ul className="mt-2 space-y-2">
                      {result.evidence.map((item) => (
                        <li key={item.label} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-growth" />
                          <div>
                            <strong>{item.label}:</strong>{" "}
                            <span className="text-muted">{item.value} · {item.source}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {result.positiveFactors.length > 0 && (
                  <div>
                    <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-growth">
                      <TrendingUp className="h-3 w-3" />
                      Positive factors
                    </p>
                    <ul className="mt-2 space-y-1">
                      {result.positiveFactors.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-growth" />
                          <span className="text-muted">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.negativeFactors.length > 0 && (
                  <div>
                    <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-danger">
                      Negative factors
                    </p>
                    <ul className="mt-2 space-y-1">
                      {result.negativeFactors.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
                          <span className="text-muted">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-xs leading-5 text-caution">
                  <strong>Uncertainty:</strong> {result.uncertainty}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
