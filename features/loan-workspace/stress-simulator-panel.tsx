"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { FinancialSignals, LoanApplication, MsmeProfile } from "@/domain/types";
import { runLoanStressScenario } from "@/services/intelligence";
import { formatCurrency } from "@/lib/format";
import { Badge, Metric, Panel, RiskBadge } from "@/components/ui/primitives";

export function StressSimulatorPanel({
  application,
  msme,
  signals
}: {
  application: LoanApplication;
  msme: MsmeProfile;
  signals: FinancialSignals;
}) {
  const [revenueDrop, setRevenueDrop] = useState(10);
  const [gstReduction, setGstReduction] = useState(5);
  const [emiIncrease, setEmiIncrease] = useState(5);
  const [receivableDelay, setReceivableDelay] = useState(15);
  const [workingCapitalStress, setWorkingCapitalStress] = useState(5);

  const stressResult = runLoanStressScenario(application, msme, signals, {
    loanAmount: application.requestedAmount,
    interestRate: 11.5,
    tenureMonths: 36,
    revenueDropPercent: revenueDrop,
    receivableDelayDays: receivableDelay,
    seasonalityImpactPercent: gstReduction + workingCapitalStress
  });

  const controls = [
    { label: "Revenue drop", value: revenueDrop, setValue: setRevenueDrop, suffix: "%", max: 40 },
    { label: "GST reduction", value: gstReduction, setValue: setGstReduction, suffix: "%", max: 30 },
    { label: "Higher EMI cost", value: emiIncrease, setValue: setEmiIncrease, suffix: "%", max: 30 },
    { label: "Delayed receivables", value: receivableDelay, setValue: setReceivableDelay, suffix: " days", max: 60 },
    { label: "Working capital stress", value: workingCapitalStress, setValue: setWorkingCapitalStress, suffix: "%", max: 25 }
  ];

  return (
    <Panel title="Stress Simulator" action={<SlidersHorizontal className="h-5 w-5 text-muted" />}>
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {controls.map((control) => (
            <label key={control.label} className="block">
              <span className="flex justify-between text-sm font-semibold">
                {control.label}
                <span>{control.value}{control.suffix}</span>
              </span>
              <input
                type="range"
                min={0}
                max={control.max}
                value={control.value}
                onChange={(event) => control.setValue(Number(event.target.value))}
                className="mt-3 w-full accent-trust"
              />
            </label>
          ))}
        </div>

        <div className="rounded-lg border border-line bg-slate-50 p-4">
          <div className="grid gap-4 sm:grid-cols-4">
            <Metric label="EMI" value={formatCurrency(stressResult.emi)} />
            <Metric label="Coverage" value={`${stressResult.coverageRatio}x`} hint="Revenue vs obligations" />
            <Metric label="Stressed Safe" value={formatCurrency(stressResult.dynamicLimit.safeLimit)} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Stressed Risk</p>
              <RiskBadge band={stressResult.repaymentRisk.band} className="mt-1" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-line p-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-semibold">Stressed recommendation:</p>
            <Badge tone={stressResult.recommendation.action === "approve" ? "success" : stressResult.recommendation.action === "reduce" ? "warning" : stressResult.recommendation.action === "reject" ? "danger" : "info"}>
              {stressResult.recommendation.action}
            </Badge>
            <span className="text-sm text-muted">
              {formatCurrency(stressResult.recommendation.recommendedAmount)}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">{stressResult.recommendation.rationale}</p>
        </div>
      </div>
    </Panel>
  );
}
