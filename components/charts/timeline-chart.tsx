"use client";

import {
  Bar,
  ComposedChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { PremiumTooltip } from "./premium-tooltip";
import { PremiumLegend } from "./premium-legend";

type ChartDatum = Record<string, string | number>;

export function TimelineChart({
  data,
  bars,
  line,
  xKey,
  height = 256
}: {
  data: ChartDatum[];
  bars: { dataKey: string; label: string; color?: string }[];
  line?: { dataKey: string; label: string; color?: string };
  xKey: string;
  height?: number;
}) {
  const hasLine = !!line;
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            {bars.map((bar, i) => {
              const c = bar.color ?? "#215f7a";
              const id = `barGrad-${bar.dataKey}`;
              return (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c} stopOpacity={1} />
                  <stop offset="100%" stopColor={c} stopOpacity={0.5} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#667085" }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#667085" }} />
          <Tooltip content={<PremiumTooltip />} cursor={{ fill: "#f5f7fa" }} />
          {bars.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              fill={`url(#barGrad-${bar.dataKey})`}
              radius={[4, 4, 0, 0]}
              animationDuration={600}
              animationEasing="ease-out"
            />
          ))}
          {line && (
            <Line
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color ?? "#13795b"}
              strokeWidth={2.5}
              dot={{ r: 3, fill: line.color ?? "#13795b", strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
              animationDuration={600}
              animationEasing="ease-out"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
