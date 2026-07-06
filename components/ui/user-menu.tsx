"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogOut, RefreshCw, User, UserRound } from "lucide-react";
import type { UserRole } from "@/domain/types";

const employeeIds: Record<UserRole, string> = {
  "loan-officer": "LO-1187",
  manager: "MGR-2041"
};

export function UserMenu({ currentRole }: { currentRole: UserRole }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const label = currentRole === "loan-officer" ? "Loan Officer" : "Manager";
  const employeeId = employeeIds[currentRole];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="grid min-h-9 min-w-9 place-items-center rounded-lg text-muted transition-all duration-150 hover:bg-slate-100 hover:text-ink active:scale-[0.95]"
        aria-label="User menu"
      >
        <UserRound className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-line bg-panel shadow-soft animate-scale-in">
          <div className="border-b border-line px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-trust-light text-trust">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{employeeId}</p>
                <p className="text-xs text-muted">{label}</p>
              </div>
            </div>
          </div>

          <div className="p-1.5">
            <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Switch Role</p>
            {(["loan-officer", "manager"] as UserRole[]).map((role) => {
              const roleLabel = role === "loan-officer" ? "Loan Officer" : "Manager";
              const isCurrent = role === currentRole;
              return (
                <Link
                  key={role}
                  href={`/command-center?role=${role}`}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    isCurrent ? "bg-trust-light text-trust font-medium" : "text-muted hover:bg-slate-50 hover:text-ink"
                  }`}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isCurrent ? "text-trust" : "text-muted"}`} />
                  {roleLabel}
                  {isCurrent && <span className="ml-auto text-[10px] text-trust">Active</span>}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-line p-1.5">
            <button
              type="button"
              onClick={() => alert("[NexusNova] Logout placeholder. In production, this would end the session.")}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-slate-50 hover:text-danger"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
