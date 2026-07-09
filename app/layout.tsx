import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { DemoShell } from "@/components/demo/demo-shell";
import { JudgeShell } from "@/features/judge-experience";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  title: "NexusNova MSME Financial Health Card",
  description: "AI-powered MSME Financial Health Card — evaluate credit-invisible MSMEs using alternate data (GST, UPI, AA, EPFO, Utility) instead of traditional financial documents."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#D8FF3E"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <DemoShell><JudgeShell><ToastProvider>{children}</ToastProvider></JudgeShell></DemoShell>
      </body>
    </html>
  );
}
