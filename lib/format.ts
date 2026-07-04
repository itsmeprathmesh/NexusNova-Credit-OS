import type { RiskBand } from "@/domain/types";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function riskLabel(band: RiskBand) {
  const labels: Record<RiskBand, string> = {
    low: "Low Risk",
    medium: "Medium Risk",
    high: "High Risk",
    critical: "Critical Risk"
  };
  return labels[band];
}
