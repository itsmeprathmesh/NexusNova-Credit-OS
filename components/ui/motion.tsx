"use client";

import { type ReactNode, type ComponentProps } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Button, Panel } from "./primitives";
import { cn } from "@/lib/utils";

const easeOut = [0.23, 1, 0.32, 1] as const;

const spring = { type: "spring" as const, stiffness: 200, damping: 15, mass: 0.8 };

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: easeOut } }
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: easeOut } }
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: easeOut } }
};

const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: easeOut } }
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.04 } }
};

export function FadeInView({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ delay, duration: 0.25, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

export function SlideUpView({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

export function SlideLeftView({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={fadeLeft} initial="hidden" animate="visible" transition={{ delay }}>
      {children}
    </motion.div>
  );
}

export function SlideRightView({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={fadeRight} initial="hidden" animate="visible" transition={{ delay }}>
      {children}
    </motion.div>
  );
}

export function ScaleInView({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={scaleUp} initial="hidden" animate="visible" transition={{ delay }}>
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={stagger} initial="hidden" animate="visible">
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={cn(className)}>{children}</div>;
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

export function AnimatedPanel({ children, className, title, action, delay = 0, ...props }: ComponentProps<typeof Panel> & { delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <Panel className={className} title={title} action={action} {...props}>{children}</Panel>;
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ delay, duration: 0.25, ease: easeOut }}
    >
      <Panel className={className} title={title} action={action} {...props}>
        {children}
      </Panel>
    </motion.div>
  );
}

export function AnimatedButton({ className, delay = 0, ...props }: ComponentProps<typeof Button> & { delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <Button className={className} {...props} />;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, ...spring }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      style={{ display: "inline-flex" }}
    >
      <Button className={className} {...props} />
    </motion.div>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}
