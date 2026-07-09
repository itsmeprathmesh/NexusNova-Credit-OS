"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  FileText,
  Layers,
  Share2,
  Smartphone,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Badge } from "@/components/ui/primitives";
import { getEcosystemIntegrations } from "@/services/alternate-data";

const iconMap = {
  "file-text": FileText,
  layers: Layers,
  smartphone: Smartphone,
  users: Users,
  zap: Zap,
  "share-2": Share2,
} as const;

const statusColors = {
  connected:
    "border-growth/20 bg-growth-light text-growth",
  ready: "border-trust/20 bg-trust-light text-trust",
  compatible: "border-caution/20 bg-caution-light text-caution",
} as const;

export function EcosystemIntegrations({ className }: { className?: string }) {
  const integrations = useMemo(() => getEcosystemIntegrations(), []);

  return (
    <GlassPanel className={cn("p-6", className)}>
      <div className="flex items-center gap-2.5">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-trust-light text-trust">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">
            Ecosystem Integrations
          </p>
          <p className="text-[10px] text-muted">
            Connected data sources and protocol compatibility
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration, i) => {
          const Icon = iconMap[integration.icon as keyof typeof iconMap] || Zap;
          return (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <div
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                  integration.status === "connected"
                    ? "bg-growth/10 text-growth"
                    : integration.status === "ready"
                      ? "bg-trust/10 text-trust"
                      : "bg-caution/10 text-caution"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-ink">
                    {integration.name}
                  </p>
                  <Badge
                    className={cn(
                      "text-[10px] px-1.5 py-0",
                      statusColors[integration.status]
                    )}
                  >
                    {integration.status === "connected"
                      ? "✓ Connected"
                      : integration.status === "ready"
                        ? "Ready"
                        : "Compatible"}
                  </Badge>
                </div>
                <p className="mt-0.5 text-[10px] text-muted">
                  {integration.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassPanel>
  );
}
