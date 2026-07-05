"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { UserRole } from "@/domain/types";

type RoleContextValue = {
  role: UserRole;
  setRole: (role: UserRole) => void;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children, initialRole = "loan-officer" }: { children: ReactNode; initialRole?: UserRole }) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const value = useMemo(() => ({ role, setRole }), [role]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const value = useContext(RoleContext);

  if (!value) {
    throw new Error("useRole must be used inside RoleProvider");
  }

  return value;
}
