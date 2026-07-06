"use client";

import type { RiskBand } from "@/domain/types";
import { cn } from "@/lib/utils";

type RiskMatrixItem = {
  id: string;
  label: string;
  likelihood: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  detail?: string;
};

const bandColors: Record<string, { bg: string; text: string; border: string }> = {
  "low-low": { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  "low-medium": { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300" },
  "low-high": { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  "medium-low": { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300" },
  "medium-medium": { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
  "medium-high": { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300" },
  "high-low": { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  "high-medium": { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300" },
  "high-high": { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" }
};

function getBand(likelihood: string, impact: string) {
  return `${likelihood}-${impact}`;
}

const likelihoodLabels = { low: "Low", medium: "Medium", high: "High" };
const impactLabels = { low: "Low", medium: "Medium", high: "High" };

export function RiskMatrix({
  items,
  className
}: {
  items: RiskMatrixItem[];
  className?: string;
}) {
  const likelihoods: ("low" | "medium" | "high")[] = ["high", "medium", "low"];
  const impacts: ("low" | "medium" | "high")[] = ["low", "medium", "high"];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-[80px_repeat(3,1fr)] gap-1 text-center text-xs font-semibold uppercase tracking-wide text-muted">
        <div className="flex items-end pb-2">
          <span className="mb-1 block">Likelihood</span>
          <span className="mx-1 text-[10px] font-normal text-muted">↓</span>
        </div>
        {impacts.map((imp) => (
          <div key={imp} className="pb-1">{impactLabels[imp]} Impact</div>
        ))}
      </div>
      {likelihoods.map((lik) => (
        <div key={lik} className="grid grid-cols-[80px_repeat(3,1fr)] gap-1">
          <div className="flex items-center text-xs font-medium text-muted">{likelihoodLabels[lik]}</div>
          {impacts.map((imp) => {
            const band = getBand(lik, imp);
            const style = bandColors[band];
            const cellItems = items.filter((i) => i.likelihood === lik && i.impact === imp);
            return (
              <div
                key={band}
                className={cn(
                  "min-h-[60px] rounded-lg border p-2 transition-all hover:shadow-sm",
                  style?.bg,
                  style?.border
                )}
              >
                {cellItems.length > 0 ? (
                  <div className="space-y-1">
                    {cellItems.slice(0, 2).map((item) => (
                      <div key={item.id} className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium leading-tight", style?.text)}>
                        <p className="truncate">{item.label}</p>
                        {item.detail && <p className="truncate opacity-70">{item.detail}</p>}
                      </div>
                    ))}
                    {cellItems.length > 2 && (
                      <p className="text-[10px] text-muted">+{cellItems.length - 2} more</p>
                    )}
                  </div>
                ) : (
                  <p className="text-[10px] text-muted/40">—</p>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
