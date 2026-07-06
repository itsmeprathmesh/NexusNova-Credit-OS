import { Pin, UserRound } from "lucide-react";
import type { CrmNote } from "@/domain/types";
import { Badge, Panel } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function RmNotesPanel({ notes, emptyMessage }: { notes: CrmNote[]; emptyMessage?: string }) {
  if (notes.length === 0) {
    return (
      <Panel title="Relationship Manager Notes">
        <p className="text-sm text-muted">{emptyMessage ?? "No notes recorded for this MSME."}</p>
      </Panel>
    );
  }

  const pinned = notes.filter((note) => note.pinned);
  const others = notes.filter((note) => !note.pinned);

  return (
    <Panel title="Relationship Manager Notes">
      <div className="space-y-4">
        {pinned.map((note) => (
          <div
            key={note.id}
            className="rounded-lg border border-trust/20 bg-sky-50/50 p-4"
          >
            <div className="flex items-center gap-2">
              <Pin className="h-3.5 w-3.5 text-trust" />
              <span className="text-xs font-semibold uppercase tracking-wide text-trust">Pinned</span>
            </div>
            <div className="mt-3 flex items-start gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-trust">
                <UserRound className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{note.author}</p>
                <p className="text-xs text-muted">
                  {note.role} · {note.date}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink">{note.content}</p>
          </div>
        ))}

        {others.map((note, index) => (
          <div
            key={note.id}
            className={cn(
              "rounded-lg border border-line p-4",
              index === 0 && pinned.length === 0 ? "" : ""
            )}
          >
            <div className="flex items-start gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-trust">
                <UserRound className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{note.author}</p>
                <p className="text-xs text-muted">
                  {note.role} · {note.date}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink">{note.content}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
