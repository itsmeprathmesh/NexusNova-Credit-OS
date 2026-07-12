"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useCustomerAuth } from "@/contexts/customer-auth-context";
import { LoadingGuard } from "@/components/ui/loading-guard";

export function CustomerGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useCustomerAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/customer/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <LoadingGuard label="Verifying your session..." />;
  if (!isAuthenticated) return null;
  return <>{children}</>;
}
