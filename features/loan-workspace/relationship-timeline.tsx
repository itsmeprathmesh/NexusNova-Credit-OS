import {
  AlertTriangle,
  Building2,
  FileText,
  MessageSquare,
  Scale,
  StickyNote
} from "lucide-react";
import type { RelationshipTimelineEvent, TimelineEventKind } from "@/domain/types";
import { cn } from "@/lib/utils";

const kindConfig: Record<
  TimelineEventKind,
  { icon: typeof Building2; tone: string; label: string }
> = {
  relationship: { icon: Building2, tone: "border-sky-200 bg-sky-50 text-sky-800", label: "Relationship" },
  credit: { icon: FileText, tone: "border-violet-200 bg-violet-50 text-violet-800", label: "Credit" },
  document: { icon: FileText, tone: "border-slate-200 bg-slate-50 text-slate-700", label: "Document" },
  alert: { icon: AlertTriangle, tone: "border-amber-200 bg-amber-50 text-amber-800", label: "Alert" },
  decision: { icon: Scale, tone: "border-emerald-200 bg-emerald-50 text-emerald-800", label: "Decision" },
  note: { icon: StickyNote, tone: "border-line bg-white text-muted", label: "Note" }
};

function formatEventDate(value: string) {
  const parsed = new Date(value.replace(" ", "T"));

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: parsed.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined
  });
}

export function RelationshipTimeline({
  events,
  compact = false
}: {
  events: RelationshipTimelineEvent[];
  compact?: boolean;
}) {
  const sorted = [...events].sort((left, right) => right.date.localeCompare(left.date));

  return (
    <ol className="relative space-y-0">
      {sorted.map((event, index) => {
        const config = kindConfig[event.kind];
        const Icon = config.icon;
        const isLast = index === sorted.length - 1;

        return (
          <li key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
            {!isLast ? (
              <span
                aria-hidden
                className="absolute left-[15px] top-8 h-[calc(100%-12px)] w-px bg-line"
              />
            ) : null}
            <div
              className={cn(
                "relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border",
                config.tone
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className={cn("font-semibold text-ink", compact && "text-sm")}>{event.title}</p>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">{config.label}</span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {formatEventDate(event.date)} · {event.actor}
                {event.channel ? ` · ${event.channel.replace("-", " ")}` : ""}
              </p>
              <p className={cn("mt-2 leading-6 text-muted", compact ? "text-xs" : "text-sm")}>{event.summary}</p>
            </div>
          </li>
        );
      })}
      {sorted.length === 0 ? (
        <li className="flex items-start gap-3 rounded-lg border border-dashed border-line p-4 text-sm text-muted">
          <MessageSquare className="mt-0.5 h-4 w-4" />
          No relationship events recorded for this MSME.
        </li>
      ) : null}
    </ol>
  );
}
