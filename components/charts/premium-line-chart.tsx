"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { PremiumTooltip } from "./premium-tooltip";
import { PremiumLegend } from "./premium-legend";

type ChartDatum = Record<string, string | number>;

const brandColors = ["#215f7a", "#13795b", "#e68a2e", "#d9534f", "#7c3aed", "#667085"];

export function PremiumLineChart({
  data,
  lines,
  xKey,
  height = 256,
  showArea = true
}: {
  data: ChartDatum[];
  lines: { dataKey: string; label: string; color?: string }[];
  xKey: string;
  height?: number;
  showArea?: boolean;
}) {
  const Chart = showArea ? AreaChart : LineChart;
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <Chart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            {lines.map((line, i) => {
              const c = line.color ?? brandColors[i % brandColors.length];
              const id = `lineGrad-${line.dataKey}`;
              return (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={c} stopOpacity={1} />
                  <stop offset="100%" stopColor={c} stopOpacity={0.4} />
                </linearGradient>
              );
            })}
            {showArea && lines.map((line, i) => {
              const c = line.color ?? brandColors[i % brandColors.length];
              const id = `areaGrad-${line.dataKey}`;
              return (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={c} stopOpacity={0.02} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#667085" }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#667085" }} />
          <Tooltip
            content={<PremiumTooltip config={Object.fromEntries(lines.map((l) => [l.dataKey, { label: l.label, color: l.color, format: "currency" }]))} />}
            cursor={showArea ? { stroke: "#d0d5dd", strokeDasharray: "4 4" } : { fill: "#f5f7fa" }}
          />
          {lines.length > 1 && <PremiumLegend payload={lines.map((l) => ({ color: l.color ?? brandColors[lines.indexOf(l) % brandColors.length], value: l.label, dataKey: l.dataKey }))} />}
          {lines.map((line, i) => {
            const c = line.color ?? brandColors[i % brandColors.length];
            const commonProps = {
              type: "monotone" as const,
              dataKey: line.dataKey,
              stroke: c,
              strokeWidth: 2.5,
              dot: { r: 3, fill: c, strokeWidth: 0 },
              activeDot: { r: 5, strokeWidth: 0, fill: c },
              animationDuration: 600,
              animationEasing: "ease-out" as const
            };
            if (showArea) {
              return <Area key={line.dataKey} {...commonProps} fill={`url(#areaGrad-${line.dataKey})`} />;
            }
            return <Line key={line.dataKey} {...commonProps} />;
          })}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}
