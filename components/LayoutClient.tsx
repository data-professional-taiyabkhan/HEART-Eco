"use client";

import { usePathname } from "next/navigation";
import GlobalMetrics from "@/components/GlobalMetrics";
import { AppFooter } from "@/components/SiteFooter";

// Pages that render their own footer (homepage) or a full-screen shell (auth pages).
const OWN_FOOTER = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Show GlobalMetrics only on dashboard and compare pages
  const showGlobalMetrics = pathname === "/dashboard" || pathname === "/compare";
  const showAppFooter = !OWN_FOOTER.includes(pathname ?? "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-50">
      {showGlobalMetrics && <GlobalMetrics />}
      <main className={showGlobalMetrics ? "container mx-auto px-4 py-6" : ""}>
        {children}
      </main>
      {showAppFooter && <AppFooter />}
    </div>
  );
}
