"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { getRecommendedNext } from "./guide-config";

export function RecommendedNext() {
  const pathname = usePathname();
  const next = getRecommendedNext(pathname);

  if (!next) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="mt-8"
    >
      <Link
        href={next.path}
        className="group flex items-center justify-between rounded-xl border border-surface/40 bg-panel/90 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-trust/30 hover:shadow-glow"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-trust/10 text-trust transition-transform group-hover:scale-110">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Recommended Next Step</p>
            <p className="text-sm font-semibold text-ink group-hover:text-trust">
              {next.label}
            </p>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-muted transition-all group-hover:translate-x-1 group-hover:text-trust" />
      </Link>
    </motion.div>
  );
}
