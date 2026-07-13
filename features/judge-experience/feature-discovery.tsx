"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useJudge } from "./guide-provider";
import { FEATURE_DISCOVERY } from "./guide-config";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

interface FeatureDiscoveryBadgeProps {
  featureId: string;
  className?: string;
}

export function FeatureDiscoveryBadge({
  featureId,
  className,
}: FeatureDiscoveryBadgeProps) {
  const { viewedFeatures, markFeatureViewed } = useJudge();
  const feature = FEATURE_DISCOVERY.find((f) => f.id === featureId);

  if (!feature || viewedFeatures.includes(featureId)) return null;

  return (
    <AnimatePresence>
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={cn(
          "inline-flex items-center gap-1 rounded bg-trust/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-trust border border-trust/30",
          className
        )}
        onClick={() => markFeatureViewed(featureId)}
      >
        <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
        New
      </motion.span>
    </AnimatePresence>
  );
}

export function FeatureDiscoveryBar() {
  const { newFeatures, markFeatureViewed } = useJudge();

  if (newFeatures.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-trust/15 bg-trust/[0.03] px-4 py-3"
    >
      <Sparkles className="h-4 w-4 text-trust" aria-hidden="true" />
      <span className="text-xs font-medium text-trust">New features:</span>
      {newFeatures.map((f) => (
        <Link
          key={f.id}
          href={f.path}
          onClick={() => markFeatureViewed(f.id)}
          className="rounded-md bg-trust/15 px-2 py-1 text-[11px] font-medium text-trust transition-colors hover:bg-trust/25"
        >
          {f.label}
        </Link>
      ))}
    </motion.div>
  );
}
