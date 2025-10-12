"use client";

import { useEffect, useState } from "react";
import { formatCurrency, formatNumber } from "@/lib/calculations";

interface GlobalMetrics {
  globalGDP: number;
  totalGlobalPopulation: number;
  totalGlobalTrade: number;
}

export default function GlobalMetrics() {
  const [metrics, setMetrics] = useState<GlobalMetrics | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch("/api/countries");
        const data = await response.json();
        if (data.length > 0) {
          setMetrics({
            globalGDP: data[0].globalGDP,
            totalGlobalPopulation: data[0].totalGlobalPopulation,
            totalGlobalTrade: data[0].totalGlobalTrade,
          });
        }
      } catch (error) {
        console.error("Error fetching global metrics:", error);
      }
    }

    fetchMetrics();
  }, []);

  if (!metrics) {
    return (
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center md:items-start animate-pulse">
                <div className="h-4 bg-indigo-400 rounded w-24 mb-2"></div>
                <div className="h-8 bg-indigo-400 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-sm font-medium text-indigo-100 uppercase tracking-wide">
              Global GDP
            </span>
            <span className="text-2xl md:text-3xl font-bold mt-1">
              {formatCurrency(metrics.globalGDP)}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-indigo-100 uppercase tracking-wide">
              Global Population
            </span>
            <span className="text-2xl md:text-3xl font-bold mt-1">
              {formatNumber(metrics.totalGlobalPopulation)}
            </span>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <span className="text-sm font-medium text-indigo-100 uppercase tracking-wide">
              Global Trade
            </span>
            <span className="text-2xl md:text-3xl font-bold mt-1">
              {formatCurrency(metrics.totalGlobalTrade)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

