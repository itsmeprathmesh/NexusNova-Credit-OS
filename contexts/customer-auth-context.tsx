"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export interface CustomerUser {
  msmeId: string;
  name: string;
  mobile: string;
}

interface CustomerAuthContextType {
  customer: CustomerUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (msmeId: string, name: string, mobile: string) => void;
  logout: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | null>(null);

const STORAGE_KEY = "nexusnova-customer";

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CustomerUser;
        if (parsed.msmeId) setCustomer(parsed);
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const login = useCallback((msmeId: string, name: string, mobile: string) => {
    const c: CustomerUser = { msmeId, name, mobile };
    setCustomer(c);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(c)); } catch {}
  }, []);

  const logout = useCallback(() => {
    setCustomer(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  return (
    <CustomerAuthContext.Provider value={{ customer, isAuthenticated: !!customer, isLoading, login, logout }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return ctx;
}
