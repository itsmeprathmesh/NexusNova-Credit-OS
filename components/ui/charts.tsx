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
  YAxis
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

export function SimpleBarChart({ data, xKey, yKey }: { data: ChartDatum[]; xKey: string; yKey: string }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d9e0ea" vertical={false} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <Tooltip cursor={{ fill: "#f5f7fa" }} />
          <Bar dataKey={yKey} fill="#215f7a" radius={[4, 4, 0, 0]} />
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
          <CartesianGrid strokeDasharray="3 3" stroke="#d9e0ea" vertical={false} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey={yKey} stroke="#13795b" strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RiskHeatmap({ items }: { items: Array<PortfolioItem & { name: string; branch: string }> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.msmeId} className={cn("rounded-lg p-4", riskClasses[item.riskBand])}>
          <p className="font-semibold">{item.name}</p>
          <p className="mt-1 text-sm opacity-80">{item.branch}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide">{item.riskBand} risk</p>
        </div>
      ))}
    </div>
  );
}
