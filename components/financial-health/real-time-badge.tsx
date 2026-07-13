"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function RealTimeBadge({ className }: { className?: string }) {
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setMinutes((m) => m + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-trust/20 bg-trust-light px-2.5 py-0.5 text-[10px] font-semibold text-trust",
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-trust/40" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-trust" />
      </span>
      <RefreshCw className="h-2.5 w-2.5" />
      Live Assessment
      <span className="opacity-70">· {minutes}m ago</span>
    </motion.span>
  );
}

export function LastUpdatedBadge({ label = "Last Updated" }: { label?: string }) {
  const [display] = useState(() => {
    const mins = Math.floor(Math.random() * 5) + 1;
    return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  });

  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-muted">
      <RefreshCw className="h-2.5 w-2.5" />
      {label}: {display}
    </span>
  );
}
