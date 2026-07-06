"use client";

import { useCallback, useMemo, useState } from "react";
import { Bell, CheckCheck, CheckCircle2, Clock, FileWarning, MessageSquare, XCircle } from "lucide-react";
import { getNotifications, getUnreadCount, markAllNotificationsRead, markNotificationRead } from "@/services/app-data";
import { Badge, Button, Panel } from "@/components/ui/primitives";

const iconMap = {
  "document-verified": CheckCircle2,
  "document-rejected": XCircle,
  "document-requested": FileWarning,
  "ai-review-complete": CheckCircle2,
  "committee-complete": CheckCircle2,
  "officer-request": MessageSquare,
  "application-approved": CheckCircle2,
  "application-rejected": XCircle,
  "status-change": Clock
};

const iconColors: Record<string, string> = {
  "document-verified": "text-growth",
  "document-rejected": "text-danger",
  "document-requested": "text-caution",
  "ai-review-complete": "text-trust",
  "committee-complete": "text-trust",
  "officer-request": "text-caution",
  "application-approved": "text-growth",
  "application-rejected": "text-danger",
  "status-change": "text-trust"
};

export function NotificationCenter() {
  const [refreshKey, setRefreshKey] = useState(0);

  const notifications = useMemo(() => getNotifications(), [refreshKey]);
  const unreadCount = useMemo(() => getUnreadCount(), [refreshKey]);

  const handleMarkRead = useCallback((id: string) => {
    markNotificationRead(id);
    setRefreshKey((k) => k + 1);
  }, []);

  const handleMarkAllRead = useCallback(() => {
    markAllNotificationsRead();
    setRefreshKey((k) => k + 1);
  }, []);

  if (notifications.length === 0) {
    return (
      <Panel title="Notifications">
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <Bell className="h-10 w-10 text-muted" />
          <p className="text-sm text-muted">No notifications yet. They will appear here as your application progresses.</p>
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      title="Notifications"
      action={
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <>
              <Badge tone="info">{unreadCount} new</Badge>
              <Button variant="ghost" type="button" onClick={handleMarkAllRead} className="text-xs">
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </Button>
            </>
          )}
        </div>
      }
    >
      <div className="space-y-2">
        {notifications.map((n) => {
          const Icon = iconMap[n.type];
          const color = iconColors[n.type] || "text-trust";

          return (
            <button
              key={n.id}
              type="button"
              onClick={() => handleMarkRead(n.id)}
              className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition hover:bg-slate-50 ${n.read ? "border-line" : "border-trust/30 bg-trust/[0.03]"}`}
            >
              <Icon className={`mt-1 h-5 w-5 shrink-0 ${color}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm ${n.read ? "text-ink" : "font-semibold text-ink"}`}>{n.title}</p>
                  <span className="shrink-0 text-xs text-muted">
                    {timeAgo(new Date(n.timestamp))}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">{n.message}</p>
              </div>
              {!n.read && <span className="mt-2 block h-2 w-2 shrink-0 rounded-full bg-trust" />}
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
