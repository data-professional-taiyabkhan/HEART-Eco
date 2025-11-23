"use client";

import { useState, useEffect } from "react";
import { CountryData } from "@/lib/types";
import CountrySelector from "@/components/CountrySelector";
import ComparisonView from "@/components/ComparisonView";
import Link from "next/link";

export default function ComparePage() {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [country1, setCountry1] = useState<string>("");
  const [country2, setCountry2] = useState<string>("");
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
        if (data.length >= 2) {
          setCountry1(data[0].country);
          setCountry2(data[1].country);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, []);

  const selectedCountry1 = countries.find((c) => c.country === country1);
  const selectedCountry2 = countries.find((c) => c.country === country2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Compare Countries
            </h1>
            <p className="text-gray-600 mt-1">
              Side-by-side analysis of economic metrics
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              🏠 Home
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <Link
              href="/ai"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              💬 AI Assistant
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">Error: {error}</p>
        </div>
      ) : (
        <>
          {/* Country Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country 1
              </label>
              <CountrySelector
                countries={countries}
                selectedCountry={country1}
                onSelectCountry={setCountry1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country 2
              </label>
              <CountrySelector
                countries={countries}
                selectedCountry={country2}
                onSelectCountry={setCountry2}
              />
            </div>
          </div>

          {/* Comparison View */}
          {selectedCountry1 && selectedCountry2 && (
            <ComparisonView country1={selectedCountry1} country2={selectedCountry2} />
          )}
        </>
      )}
    </div>
  );
}

