"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps
} from "recharts";
import type { PortfolioItem, RiskBand } from "@/domain/types";
import { cn } from "@/lib/utils";

type ChartDatum = Record<string, string | number>;

const riskClasses: Record<RiskBand, string> = {
  low: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800"
};

function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-panel px-3 py-2 shadow-elevated">
      <p className="text-xs font-medium text-muted">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm font-semibold text-ink" style={{ color: entry.color }}>
          {entry.value?.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
}

export function SimpleBarChart({ data, xKey, yKey }: { data: ChartDatum[]; xKey: string; yKey: string }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#215f7a" stopOpacity={1} />
              <stop offset="100%" stopColor="#215f7a" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#667085" }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#667085" }} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f5f7fa" }} />
          <Bar dataKey={yKey} fill="url(#barGradient)" radius={[4, 4, 0, 0]} animationDuration={600} animationEasing="ease-out" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SimpleLineChart({ data, xKey, yKey }: { data: ChartDatum[]; xKey: string; yKey: string }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#13795b" stopOpacity={1} />
              <stop offset="100%" stopColor="#13795b" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" vertical={false} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#667085" }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#667085" }} />
          <Tooltip content={<ChartTooltip />} />
          <Line type="monotone" dataKey={yKey} stroke="url(#lineGradient)" strokeWidth={2.5} dot={{ r: 3, fill: "#13795b" }} activeDot={{ r: 5, strokeWidth: 0 }} animationDuration={600} animationEasing="ease-out" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RiskHeatmap({ items }: { items: Array<PortfolioItem & { name: string; branch: string }> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.msmeId} className={cn("rounded-lg p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated", riskClasses[item.riskBand])}>
          <p className="font-semibold">{item.name}</p>
          <p className="mt-1 text-sm opacity-80">{item.branch}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide">{item.riskBand} risk</p>
        </div>
      ))}
    </div>
  );
}
