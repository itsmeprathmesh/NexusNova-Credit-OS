import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Bell } from "lucide-react";
import type { UserRole } from "@/domain/types";
import { Badge, Panel, RiskBadge } from "@/components/ui/primitives";
import type { EarlyWarningItem } from "@/services/portfolio-intelligence";
import { SmartCallout } from "@/components/demo/smart-callout";

export function EarlyWarningCenter({
  warnings,
  role
}: {
  warnings: EarlyWarningItem[];
  role: UserRole;
}) {
  if (warnings.length === 0) {
    return (
      <Panel title="Early Warning Center">
        <div className="flex items-center gap-3 rounded-lg border border-line bg-slate-50 p-4">
          <AlertTriangle className="h-5 w-5 text-growth" />
          <p className="text-sm text-muted">No early warnings. All monitored MSMEs are within acceptable risk thresholds.</p>
        </div>
      </Panel>
    );
  }

  return (
    <Panel title="Early Warning Center" action={<Badge tone="warning">{warnings.length} active</Badge>}>
      <SmartCallout
        id="early-warning-predictive-insight"
        title="Predictive Early Warning Intelligence"
        description="AI detects warning signals 2-3 months ahead of traditional monitoring by analyzing alternate data patterns — giving officers time to intervene before NPA classification."
        variant="impact"
        icon={Bell}
      />
      <div className="space-y-3">
        {warnings.map((warning) => (
          <Link
            key={`${warning.msmeId}-${warning.warning}`}
            href={`/portfolio/${warning.msmeId}?role=${role}`}
            className="flex items-start justify-between gap-4 rounded-lg border border-line p-4 transition hover:border-trust hover:bg-slate-50"
          >
            <div className="flex gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-caution" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-ink">{warning.msmeName}</p>
                  <span className="text-xs text-muted">{warning.branch}</span>
                  <span className="text-xs text-muted">{warning.sector}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{warning.warning}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RiskBadge band={warning.riskBand} />
              <ArrowUpRight className="h-4 w-4 text-trust" />
            </div>
          </Link>
        ))}
      </div>
    </Panel>
  );
}
