"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { UserRole } from "@/domain/types";

export interface AuthUser {
  employeeId: string;
  role: UserRole;
  name: string;
  branch: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (employeeId: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_CREDENTIALS: Record<string, { password: string; role: UserRole; name: string; branch: string }> = {
  LO1001: { password: "demo123", role: "loan-officer", name: "Rahul Sharma", branch: "Mumbai Main Branch" },
  MG2001: { password: "demo123", role: "manager", name: "Anita Desai", branch: "Mumbai Main Branch" },
};

const STORAGE_KEY = "nexusnova-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        if (parsed.employeeId && DEMO_CREDENTIALS[parsed.employeeId]) {
          setUser(parsed);
        }
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const login = useCallback(async (employeeId: string, password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);

    const creds = DEMO_CREDENTIALS[employeeId];
    if (!creds || creds.password !== password) {
      return { success: false, error: "Invalid employee ID or password. Please try again." };
    }

    const authUser: AuthUser = {
      employeeId,
      role: creds.role,
      name: creds.name,
      branch: creds.branch,
    };
    setUser(authUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    } catch {}
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
