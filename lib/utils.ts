import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UserRole } from "@/domain/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseRole(role?: string): UserRole {
  return role === "manager" ? "manager" : "loan-officer";
}

export const EASE_SPRING = [0.23, 1, 0.32, 1] as const;
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const DURATION_FAST = 0.15;
export const DURATION_NORMAL = 0.2;
export const DURATION_SLOW = 0.3;
