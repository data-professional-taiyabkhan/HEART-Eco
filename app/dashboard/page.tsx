"use client";

import { useState, useEffect } from "react";
import CountrySelector from "@/components/CountrySelector";
import CountryDashboard from "@/components/CountryDashboard";
import { CountryData } from "@/lib/types";
import Link from "next/link";

export default function DashboardPage() {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch("/api/countries");
        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }
        const data = await response.json();
        setCountries(data);
        if (data.length > 0) {
          setSelectedCountry(data[0].country);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, []);

  const currentCountry = countries.find((c) => c.country === selectedCountry);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              HEART Score Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Economic Model Analysis & Comparison
            </p>
          </div>
          <Link
            href="/compare"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Compare Countries →
          </Link>
        </div>
      </div>

      {/* Country Selector */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
            <div className="animate-ping absolute top-0 left-0 h-16 w-16 rounded-full bg-indigo-400 opacity-20"></div>
          </div>
          <p className="mt-4 text-gray-600 animate-pulse">Loading countries...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 animate-fadeIn">
          <p className="text-red-800">Error: {error}</p>
        </div>
      ) : (
        <>
          <CountrySelector
            countries={countries}
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
          />

          {/* Country Dashboard */}
          {currentCountry && <CountryDashboard country={currentCountry} />}
        </>
      )}
    </div>
  );
}

