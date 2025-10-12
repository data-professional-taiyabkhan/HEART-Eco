"use client";

import type { Metadata } from "next";
import "./globals.css";
import GlobalMetrics from "@/components/GlobalMetrics";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Show GlobalMetrics only on dashboard and compare pages
  const showGlobalMetrics = pathname === "/dashboard" || pathname === "/compare";

  return (
    <html lang="en">
      <head>
        <title>HEART Score Economic Model Dashboard</title>
        <meta name="description" content="Analyze and compare countries using the HEART economic model" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          {showGlobalMetrics && <GlobalMetrics />}
          <main className={showGlobalMetrics ? "container mx-auto px-4 py-6" : ""}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
