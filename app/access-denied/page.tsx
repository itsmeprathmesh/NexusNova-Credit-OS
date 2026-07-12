"use client";

import { useAuth } from "@/contexts/auth-context";
import { AccessDenied } from "@/components/auth/access-denied";

export default function AccessDeniedPage() {
  const { user } = useAuth();
  const role = user?.role ?? "loan-officer";
  return <AccessDenied role={role} />;
}
