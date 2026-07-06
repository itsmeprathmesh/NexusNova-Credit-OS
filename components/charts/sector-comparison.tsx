"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PremiumTooltip } from "./premium-tooltip";

const sectorColors = ["#215f7a", "#13795b", "#e68a2e", "#7c3aed", "#d9534f", "#667085", "#0891b2", "#65a30d"];

export function SectorComparisonChart({
  data,
  height = 300
}: {
  data: { sector: string; exposure: number; count?: number; avgScore?: number }[];
  height?: number;
}) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#667085" }} />
          <YAxis type="category" dataKey="sector" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#667085" }} width={120} />
          <Tooltip content={<PremiumTooltip config={{ exposure: { label: "Exposure", format: "currency" } }} />} cursor={{ fill: "#f5f7fa" }} />
          <Bar dataKey="exposure" radius={[0, 4, 4, 0]} animationDuration={600} animationEasing="ease-out">
            {data.map((entry, i) => (
              <Cell key={entry.sector} fill={sectorColors[i % sectorColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SectorMultiBarChart({
  data,
  height = 300
}: {
  data: { sector: string; exposure: number; count: number }[];
  height?: number;
}) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
          <XAxis dataKey="sector" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#667085" }} angle={-20} textAnchor="end" height={60} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#667085" }} />
          <Tooltip content={<PremiumTooltip />} cursor={{ fill: "#f5f7fa" }} />
          <Bar dataKey="exposure" fill="#215f7a" radius={[4, 4, 0, 0]} animationDuration={600} animationEasing="ease-out" />
          <Bar dataKey="count" fill="#13795b" radius={[4, 4, 0, 0]} animationDuration={600} animationEasing="ease-out" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
