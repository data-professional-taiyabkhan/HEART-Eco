"use client";

import { useEffect, useState } from "react";
import AppNav from "@/components/AppNav";

// The HEART formulas run on the server (/api/calculate); only the result comes back.
interface CalcResult {
  heartScore: string;
  heartValue: number;
  har: string;
  note: "exceeds" | "worst" | null;
}

type Unit = "K" | "M" | "B" | "T";
type InputMode = "percentage" | "absolute";

// Unit multipliers
const UNIT_MULTIPLIERS: Record<Unit, number> = {
  K: 1e3,
  M: 1e6,
  B: 1e9,
  T: 1e12,
};

export default function CalculatorPage() {
  // Global settings
  const [inputMode, setInputMode] = useState<InputMode>("percentage");
  const [unit, setUnit] = useState<Unit>("B");
  const [countryGDP, setCountryGDP] = useState<string>("");

  // Heart Value (HV) inputs
  const [housingGDP, setHousingGDP] = useState<string>("");
  const [healthGDP, setHealthGDP] = useState<string>("");
  const [energyGDP, setEnergyGDP] = useState<string>("");
  const [educationGDP, setEducationGDP] = useState<string>("");
  const [globalGDPShare, setGlobalGDPShare] = useState<string>("");
  const [interestPaymentGDP, setInterestPaymentGDP] = useState<string>("");
  const [tradeGDP, setTradeGDP] = useState<string>("");

  // Heart Affordability Ranking (HAR) inputs
  const [pci, setPCI] = useState<string>("");
  const [inflation, setInflation] = useState<string>("");
  const [hdi, setHDI] = useState<string>("");
  const [gini, setGINI] = useState<string>("");

  // Helper function to convert input to percentage value (for calculation)
  // Returns percentage as a number (e.g., 5.2 for 5.2%)
  const convertToPercentage = (value: string, gdp: number): number => {
    if (!value || !gdp || gdp === 0) return 0;
    const numValue = parseFloat(value) || 0;
    if (inputMode === "percentage") {
      // User entered percentage directly (e.g., 5.2 for 5.2%)
      return numValue;
    } else {
      // Convert absolute value to percentage
      const absoluteValue = numValue * UNIT_MULTIPLIERS[unit];
      return (absoluteValue / gdp) * 100;
    }
  };

  // Convert the form into the numbers the server needs (unit conversion only)
  const buildPayload = () => {
    const gdp = parseFloat(countryGDP) * UNIT_MULTIPLIERS[unit] || 0;
    
    if (gdp === 0) return null;

    // Calculate HV components
    const housingPercent = convertToPercentage(housingGDP, gdp);
    const healthPercent = convertToPercentage(healthGDP, gdp);
    const energyPercent = convertToPercentage(energyGDP, gdp);
    const educationPercent = convertToPercentage(educationGDP, gdp);
    // Global GDP Share is already a percentage, use as-is
    const globalSharePercent = parseFloat(globalGDPShare) || 0;
    const interestPercent = convertToPercentage(interestPaymentGDP, gdp);
    const tradePercent = convertToPercentage(tradeGDP, gdp);

    return {
      housing: housingPercent,
      health: healthPercent,
      energy: energyPercent,
      education: educationPercent,
      globalShare: globalSharePercent,
      interest: interestPercent,
      trade: tradePercent,
      pci: parseFloat(pci) || 0,
      inflation: parseFloat(inflation) || 0,
      hdi: parseFloat(hdi) || 0,
      gini: parseFloat(gini) || 0,
    };
  };

  const payload = buildPayload();
  const payloadKey = payload ? JSON.stringify(payload) : "";

  const [results, setResults] = useState<CalcResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  useEffect(() => {
    if (!payloadKey) {
      setResults(null);
      setCalcError(null);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payloadKey,
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(res.status === 401 ? "Please sign in again." : "Could not calculate. Check your inputs.");
        setResults(await res.json());
        setCalcError(null);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setCalcError((err as Error).message);
      }
    }, 350);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [payloadKey]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-50">
      <AppNav />
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-900">
            HEART Score Calculator
          </h1>
          <p className="text-gray-600 mt-1">
            Enter a country&apos;s figures to get its HEART Score
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Global Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Global Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Input Mode
                  </label>
                  <select
                    value={inputMode}
                    onChange={(e) => setInputMode(e.target.value as InputMode)}
                    className="w-full px-4 py-3 bg-white border-2 border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-sm hover:border-brand-300 text-gray-900 font-medium"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="absolute">Absolute Values</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as Unit)}
                    className="w-full px-4 py-3 bg-white border-2 border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-sm hover:border-brand-300 text-gray-900 font-medium"
                  >
                    <option value="K">Thousand (K)</option>
                    <option value="M">Million (M)</option>
                    <option value="B">Billion (B)</option>
                    <option value="T">Trillion (T)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country GDP ({unit})
                  </label>
                  <input
                    type="number"
                    value={countryGDP}
                    onChange={(e) => setCountryGDP(e.target.value)}
                    placeholder="Enter GDP"
                    className="w-full px-4 py-3 bg-white border-2 border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-sm hover:border-brand-300 text-gray-900 font-medium placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Heart Value (HV) Inputs */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Heart Value (HV) Components</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Housing {inputMode === "percentage" ? "(% of GDP)" : `(${unit})`}
                    </label>
                    <input
                      type="number"
                      value={housingGDP}
                      onChange={(e) => setHousingGDP(e.target.value)}
                      placeholder={inputMode === "percentage" ? "e.g., 5.2" : "e.g., 100"}
                      className="w-full px-4 py-3 bg-white border-2 border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-sm hover:border-brand-300 text-gray-900 font-medium placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Health {inputMode === "percentage" ? "(% of GDP)" : `(${unit})`}
                    </label>
                    <input
                      type="number"
                      value={healthGDP}
                      onChange={(e) => setHealthGDP(e.target.value)}
                      placeholder={inputMode === "percentage" ? "e.g., 6.5" : "e.g., 150"}
                      className="w-full px-4 py-3 bg-white border-2 border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-sm hover:border-brand-300 text-gray-900 font-medium placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Energy {inputMode === "percentage" ? "(% of GDP)" : `(${unit})`}
                    </label>
                    <input
                      type="number"
                      value={energyGDP}
                      onChange={(e) => setEnergyGDP(e.target.value)}
                      placeholder={inputMode === "percentage" ? "e.g., 3.8" : "e.g., 80"}
                      className="w-full px-4 py-3 bg-white border-2 border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-sm hover:border-brand-300 text-gray-900 font-medium placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education {inputMode === "percentage" ? "(% of GDP)" : `(${unit})`}
                    </label>
                    <input
                      type="number"
                      value={educationGDP}
                      onChange={(e) => setEducationGDP(e.target.value)}
                      placeholder={inputMode === "percentage" ? "e.g., 4.2" : "e.g., 90"}
                      className="w-full px-4 py-3 bg-white border-2 border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-sm hover:border-brand-300 text-gray-900 font-medium placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Global GDP Share (%)
                    </label>
                    <input
                      type="number"
                      value={globalGDPShare}
                      onChange={(e) => setGlobalGDPShare(e.target.value)}
                      placeholder="e.g., 15.5"
                      className="w-full px-4 py-3 bg-white border-2 border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-sm hover:border-brand-300 text-gray-900 font-medium placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interest Payments {inputMode === "percentage" ? "(% of GDP)" : `(${unit})`}
                    </label>
                    <input
                      type="number"
                      value={interestPaymentGDP}
                      onChange={(e) => setInterestPaymentGDP(e.target.value)}
                      placeholder={inputMode === "percentage" ? "e.g., 2.1" : "e.g., 50"}
                      className="w-full px-4 py-3 bg-white border-2 border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-sm hover:border-brand-300 text-gray-900 font-medium placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trade Balance {inputMode === "percentage" ? "(% of GDP)" : `(${unit})`}
                    </label>
                    <input
                      type="number"
                      value={tradeGDP}
                      onChange={(e) => setTradeGDP(e.target.value)}
                      placeholder={inputMode === "percentage" ? "e.g., 1.5 or -0.8" : "e.g., 30 or -20"}
                      className="w-full px-4 py-3 bg-white border-2 border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-sm hover:border-brand-300 text-gray-900 font-medium placeholder:text-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">Positive for surplus, negative for deficit</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Heart Affordability Ranking (HAR) Inputs */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Heart Affordability Ranking (HAR) Components</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Per Capita Income (PCI) (USD)
                  </label>
                  <input
                    type="number"
                    value={pci}
                    onChange={(e) => setPCI(e.target.value)}
                    placeholder="e.g., 50000"
                    className="w-full px-4 py-3 bg-white border-2 border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-sm hover:border-brand-300 text-gray-900 font-medium placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inflation Rate (%)
                  </label>
                  <input
                    type="number"
                    value={inflation}
                    onChange={(e) => setInflation(e.target.value)}
                    placeholder="e.g., 2.5"
                    className="w-full px-4 py-3 bg-white border-2 border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-sm hover:border-brand-300 text-gray-900 font-medium placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HDI (0-1)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    max="1"
                    value={hdi}
                    onChange={(e) => setHDI(e.target.value)}
                    placeholder="e.g., 0.850"
                    className="w-full px-4 py-3 bg-white border-2 border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-sm hover:border-brand-300 text-gray-900 font-medium placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GINI (0-1)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    max="1"
                    value={gini}
                    onChange={(e) => setGINI(e.target.value)}
                    placeholder="e.g., 0.350"
                    className="w-full px-4 py-3 bg-white border-2 border-brand-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-sm hover:border-brand-300 text-gray-900 font-medium placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Results</h2>
                <button
                  onClick={() => {
                    setCountryGDP("");
                    setHousingGDP("");
                    setHealthGDP("");
                    setEnergyGDP("");
                    setEducationGDP("");
                    setGlobalGDPShare("");
                    setInterestPaymentGDP("");
                    setTradeGDP("");
                    setPCI("");
                    setInflation("");
                    setHDI("");
                    setGINI("");
                  }}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
              </div>
              {calcError && (
                <p role="alert" className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {calcError}
                </p>
              )}
              {results ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-brand-700 to-brand-500 rounded-lg p-6 text-white">
                    <h3 className="text-sm font-semibold mb-2">HEART Score</h3>
                    <div className="text-4xl font-black">{results.heartScore}</div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-brand-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Heart Value (Resilience)</h4>
                      <div className="text-2xl font-bold text-brand-600">{results.heartValue.toFixed(2)}</div>
                      {results.note && (
                        <p className="text-xs text-gray-500 mt-1">
                          {results.note === "exceeds" ? "Exceeds Expectation" : "Worst Performance"}
                        </p>
                      )}
                    </div>

                    <div className="bg-amber-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Affordability Ranking</h4>
                      <div className="text-2xl font-bold text-amber-600">{results.har}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>Enter values above to calculate</p>
                  <p className="text-sm mt-2">Start with Country GDP</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

