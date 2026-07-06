"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { PremiumTooltip } from "./premium-tooltip";
import { PremiumLegend } from "./premium-legend";

type ChartDatum = Record<string, string | number>;

const brandColors = ["#215f7a", "#13795b", "#e68a2e", "#d9534f", "#7c3aed", "#667085"];

export function PremiumBarChart({
  data,
  bars,
  xKey,
  height = 256,
  stacked = false
}: {
  data: ChartDatum[];
  bars: { dataKey: string; label: string; color?: string }[];
  xKey: string;
  height?: number;
  stacked?: boolean;
}) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            {bars.map((bar, i) => {
              const c = bar.color ?? brandColors[i % brandColors.length];
              const id = `barGrad-${bar.dataKey}`;
              return (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c} stopOpacity={1} />
                  <stop offset="100%" stopColor={c} stopOpacity={0.6} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#667085" }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#667085" }} />
          <Tooltip
            content={<PremiumTooltip config={Object.fromEntries(bars.map((b) => [b.dataKey, { label: b.label, color: b.color, format: "currency" }]))} />}
            cursor={{ fill: "#f5f7fa" }}
          />
          {bars.length > 1 && <PremiumLegend payload={bars.map((b) => ({ color: b.color ?? brandColors[bars.indexOf(b) % brandColors.length], value: b.label, dataKey: b.dataKey }))} />}
          {bars.map((bar, i) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              fill={`url(#barGrad-${bar.dataKey})`}
              radius={[4, 4, 0, 0]}
              stackId={stacked ? "stack" : undefined}
              animationDuration={600}
              animationEasing="ease-out"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PremiumSingleBarChart({
  data,
  xKey,
  yKey,
  colorMap,
  height = 256
}: {
  data: ChartDatum[];
  xKey: string;
  yKey: string;
  colorMap?: Record<string, string>;
  height?: number;
}) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#667085" }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#667085" }} />
          <Tooltip content={<PremiumTooltip />} cursor={{ fill: "#f5f7fa" }} />
          <Bar dataKey={yKey} radius={[4, 4, 0, 0]} animationDuration={600} animationEasing="ease-out">
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={colorMap?.[String(entry[xKey])] ?? brandColors[i % brandColors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
