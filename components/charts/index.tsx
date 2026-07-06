"use client";

export { PremiumTooltip } from "./premium-tooltip";
export { PremiumLegend } from "./premium-legend";
export { DonutChart } from "./donut-chart";
export { SectorComparisonChart } from "./sector-comparison";
export { RiskMatrix } from "./risk-matrix";
export { ExposureTreemap } from "./exposure-treemap";
export { PortfolioHeatmap } from "./portfolio-heatmap";
export { TimelineChart } from "./timeline-chart";

import dynamic from "next/dynamic";

export const PremiumLineChart = dynamic(() => import("./premium-line-chart").then((m) => m.PremiumLineChart), {
  ssr: false,
  loading: () => <div className="skeleton-shimmer h-64 w-full rounded-lg" aria-hidden="true" />
});

export const PremiumBarChart = dynamic(() => import("./premium-bar-chart").then((m) => m.PremiumBarChart), {
  ssr: false,
  loading: () => <div className="skeleton-shimmer h-64 w-full rounded-lg" aria-hidden="true" />
});

export const PremiumSingleBarChart = dynamic(() => import("./premium-bar-chart").then((m) => m.PremiumSingleBarChart), {
  ssr: false,
  loading: () => <div className="skeleton-shimmer h-64 w-full rounded-lg" aria-hidden="true" />
});
