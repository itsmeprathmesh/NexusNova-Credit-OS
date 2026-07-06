"use client";

import { useEffect, useRef } from "react";
import { useDemoMode } from "@/contexts/demo-mode";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  life: number;
  maxLife: number;
}

const COLORS = ["#215f7a", "#13795b", "#b7791f", "#b42318", "#6366f1", "#8b5cf6"];

export function Confetti() {
  const { confettiTrigger } = useDemoMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    if (confettiTrigger === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cvs: HTMLCanvasElement = canvas;
    const c: CanvasRenderingContext2D = ctx;

    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;

    const count = 60;
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: cvs.width / 2 + (Math.random() - 0.5) * 200,
        y: cvs.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 14 - 4,
        size: Math.random() * 8 + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        life: 0,
        maxLife: 80 + Math.random() * 40,
      });
    }

    function animate() {
      c.clearRect(0, 0, cvs.width, cvs.height);

      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);

      if (particlesRef.current.length === 0) {
        c.clearRect(0, 0, cvs.width, cvs.height);
        return;
      }

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.vy += 0.25;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.life++;
        p.opacity = 1 - p.life / p.maxLife;

        c.save();
        c.translate(p.x, p.y);
        c.rotate((p.rotation * Math.PI) / 180);
        c.globalAlpha = p.opacity;
        c.fillStyle = p.color;
        c.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        c.restore();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [confettiTrigger]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[100]"
      aria-hidden="true"
    />
  );
}
