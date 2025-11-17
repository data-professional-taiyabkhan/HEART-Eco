"use client";

import { usePathname } from "next/navigation";
import GlobalMetrics from "@/components/GlobalMetrics";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Show GlobalMetrics only on dashboard and compare pages
  const showGlobalMetrics = pathname === "/dashboard" || pathname === "/compare";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {showGlobalMetrics && <GlobalMetrics />}
      <main className={showGlobalMetrics ? "container mx-auto px-4 py-6" : ""}>
        {children}
      </main>
    </div>
  );
}

