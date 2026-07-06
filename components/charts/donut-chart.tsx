"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PremiumTooltip } from "./premium-tooltip";

const donutColors = ["#13795b", "#215f7a", "#e68a2e", "#d9534f", "#7c3aed", "#667085"];

export function DonutChart({
  data,
  height = 200,
  innerRadius = 50,
  outerRadius = 80,
  centerLabel
}: {
  data: { name: string; value: number; color?: string }[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  centerLabel?: string;
}) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<PremiumTooltip />} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey="value"
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={entry.color ?? donutColors[i % donutColors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {centerLabel && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="text-center text-sm font-semibold text-ink">{centerLabel}</p>
        </div>
      )}
    </div>
  );
}
