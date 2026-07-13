"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SparkleIconProps {
  className?: string;
  size?: number;
  color?: string;
}

export function SparkleIcon({ className, size = 16, color = "#215f7a" }: SparkleIconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("inline-block", className)}
      aria-hidden="true"
      initial={{ scale: 0, rotate: -45, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      exit={{ scale: 0, rotate: 45, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.path
        d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z"
        fill={color}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

interface SparkleEffectProps {
  children: React.ReactNode;
  enabled?: boolean;
  className?: string;
}

export function SparkleEffect({ children, enabled = true, className }: SparkleEffectProps) {
  if (!enabled) return <>{children}</>;

  return (
    <motion.div
      className={cn("relative inline-block", className)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.span
        className="absolute -right-2 -top-2"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <SparkleIcon size={12} />
      </motion.span>
      {children}
    </motion.div>
  );
}
