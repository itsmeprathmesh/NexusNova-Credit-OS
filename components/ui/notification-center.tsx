"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { getNotifications, getUnreadCount, markAllNotificationsRead } from "@/services/app-data";
import { cn } from "@/lib/utils";

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const notifications = getNotifications();
  const unread = getUnreadCount();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative grid min-h-9 min-w-9 place-items-center rounded-lg text-muted transition-all duration-150 hover:bg-slate-100 hover:text-ink active:scale-[0.95]"
        aria-label={`Notifications, ${unread} unread`}
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid min-h-[18px] min-w-[18px] place-items-center rounded-full bg-danger px-1 text-[10px] font-bold leading-none text-white animate-scale-in">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-line bg-panel shadow-soft animate-scale-in">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-ink">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => { markAllNotificationsRead(); setOpen(false); }}
                className="text-xs font-medium text-trust transition-colors hover:text-[#1a526a]"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-muted">No notifications yet</p>
            )}
            {notifications.slice(0, 20).map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  "border-b border-line/50 px-4 py-3 text-sm transition-colors last:border-b-0 hover:bg-slate-50",
                  !notif.read && "bg-trust-light/30"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-ink">{notif.title}</p>
                  {!notif.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-trust" />}
                </div>
                <p className="mt-1 text-xs text-muted leading-relaxed">{notif.message}</p>
                <p className="mt-1.5 text-[11px] text-muted">
                  {new Date(notif.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
