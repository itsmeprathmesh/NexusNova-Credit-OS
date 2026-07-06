import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { DemoShell } from "@/components/demo/demo-shell";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  title: "NexusNova Credit Intelligence OS",
  description: "AI-powered MSME lending intelligence platform for loan officers and portfolio managers"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#215f7a"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <DemoShell>{children}</DemoShell>
      </body>
    </html>
  );
}
