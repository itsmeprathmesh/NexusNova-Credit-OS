import type { Metadata, Viewport } from "next";
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-sans/600.css";
import "@fontsource/geist-sans/700.css";
import { DemoShell } from "@/components/demo/demo-shell";
import { JudgeShell } from "@/features/judge-experience";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/contexts/auth-context";
import { CustomerAuthProvider } from "@/contexts/customer-auth-context";
import { DemoControlCenter } from "@/components/demo/demo-control-center";
import { DemoSessionProvider } from "@/contexts/demo-session";
import "./globals.css";

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
    <html lang="en" className="[--font-geist-sans:Geist]">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AuthProvider><CustomerAuthProvider><DemoShell><DemoSessionProvider><JudgeShell><ToastProvider>
          {children}
          <DemoControlCenter />
        </ToastProvider></JudgeShell></DemoSessionProvider></DemoShell></CustomerAuthProvider></AuthProvider>
      </body>
    </html>
  );
}
