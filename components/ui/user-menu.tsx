"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User, UserRound } from "lucide-react";
import type { UserRole } from "@/domain/types";
import { useAuth, type AuthUser } from "@/contexts/auth-context";

export function UserMenu({ currentRole, user }: { currentRole: UserRole; user?: AuthUser | null }) {
  const { logout } = useAuth();
  const router = useRouter();
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

  const handleLogout = useCallback(() => {
    logout();
    setOpen(false);
    router.push("/staff-login");
  }, [logout, router]);

  const label = currentRole === "loan-officer" ? "Loan Officer" : "Manager";
  const displayName = user?.name ?? label;
  const displayId = user?.employeeId ?? (currentRole === "loan-officer" ? "LO-1187" : "MGR-2041");

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="grid min-h-9 min-w-9 place-items-center rounded-xl text-muted transition-all duration-200 hover:bg-white/[0.06] hover:text-ink active:scale-[0.95]"
        aria-label="User menu"
      >
        <UserRound className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/[0.08] bg-panel shadow-glass animate-scale-in">
          <div className="border-b border-white/[0.06] px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-trust-light text-trust">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{displayName}</p>
                <p className="text-xs text-muted">{displayId} · {label}</p>
              </div>
            </div>
          </div>

          <div className="p-1.5">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/[0.04] hover:text-ink"
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Link>
          </div>

          <div className="border-t border-white/[0.06] p-1.5">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/[0.04] hover:text-danger"
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
