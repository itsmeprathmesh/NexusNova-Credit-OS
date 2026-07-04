import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexusNova Credit Intelligence OS",
  description: "AI-powered MSME lending intelligence platform for loan officers and portfolio managers"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
