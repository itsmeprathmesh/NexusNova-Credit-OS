"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useAuth } from "./auth-context";
import { useCustomerAuth } from "./customer-auth-context";
import { useDemoMode } from "./demo-mode";
import { seedDemoData } from "@/services/demo-seed";
import type { UserRole } from "@/domain/types";

export type DemoRole = "customer" | UserRole;

interface DemoSessionContextType {
  isDemoSession: boolean;
  demoRole: DemoRole | null;
  startDemoSession: () => void;
  switchDemoRole: (role: DemoRole) => void;
  endDemoSession: () => void;
}

const DemoSessionContext = createContext<DemoSessionContextType | null>(null);

export function DemoSessionProvider({ children }: { children: ReactNode }) {
  const { loginDirect: staffLoginDirect, logout: staffLogout } = useAuth();
  const { login: customerLogin, logout: customerLogout } = useCustomerAuth();
  const { enableDemoMode, disableDemoMode } = useDemoMode();
  const [demoRole, setDemoRole] = useState<DemoRole | null>(null);

  const startDemoSession = useCallback(() => {
    seedDemoData();
    staffLoginDirect("LO1001");
    customerLogin("CUST001", "Aurora Precision Tools", "+91 98765 43210");
    enableDemoMode();
    setDemoRole("loan-officer");
  }, [staffLoginDirect, customerLogin, enableDemoMode]);

  const switchDemoRole = useCallback((role: DemoRole) => {
    if (role === "loan-officer") staffLoginDirect("LO1001");
    else if (role === "manager") staffLoginDirect("MG2001");
    setDemoRole(role);
  }, [staffLoginDirect]);

  const endDemoSession = useCallback(() => {
    staffLogout();
    customerLogout();
    disableDemoMode();
    setDemoRole(null);
  }, [staffLogout, customerLogout, disableDemoMode]);

  return (
    <DemoSessionContext.Provider
      value={{
        isDemoSession: demoRole !== null,
        demoRole,
        startDemoSession,
        switchDemoRole,
        endDemoSession,
      }}
    >
      {children}
    </DemoSessionContext.Provider>
  );
}

export function useDemoSession() {
  const ctx = useContext(DemoSessionContext);
  if (!ctx) throw new Error("useDemoSession must be used within DemoSessionProvider");
  return ctx;
}
