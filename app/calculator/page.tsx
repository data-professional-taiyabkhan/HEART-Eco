"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  calculateAdjustedPCI, 
  calculateAdjustedHDI, 
  calculateHeartAffordabilityValue,
  getAffordabilityGrade,
  calculateHeartValueRaw,
  formatCurrency
} from "@/lib/calculations";

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

  // Helper function to convert percentage to absolute
  const convertToAbsolute = (percentage: number, gdp: number): number => {
    return (percentage / 100) * gdp;
  };

  // Calculate results
  const calculateResults = () => {
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

    // Calculate raw Heart Value
    const rawHV = calculateHeartValueRaw(
      housingPercent,
      healthPercent,
      energyPercent,
      educationPercent,
      globalSharePercent,
      interestPercent,
      tradePercent
    );

    // Normalize to 0-1 scale using a reference range
    // Typical raw HV ranges from approximately -10 to +60 based on real-world data
    // Using min-max normalization with reference bounds
    const minHV = -10;
    const maxHV = 60;
    const normalizedHV = Math.max(0, Math.min(1, (rawHV - minHV) / (maxHV - minHV)));

    // Calculate HAR components
    const pciValue = parseFloat(pci) || 0;
    const inflationValue = parseFloat(inflation) / 100 || 0; // Convert percentage to decimal
    const hdiValue = parseFloat(hdi) || 0;
    const giniValue = parseFloat(gini) || 0;

    const adjustedPCI = calculateAdjustedPCI(pciValue, inflationValue);
    const adjustedHDI = calculateAdjustedHDI(hdiValue, giniValue);
    const hav = calculateHeartAffordabilityValue(adjustedPCI, adjustedHDI);
    const har = getAffordabilityGrade(hav);

    // Final HEART Score
    const heartScore = `${normalizedHV.toFixed(2)}${har}`;

    return {
      rawHV,
      normalizedHV,
      adjustedPCI,
      adjustedHDI,
      hav,
      har,
      heartScore,
    };
  };

  const results = calculateResults();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                HEART Score Calculator
              </h1>
              <p className="text-gray-600 mt-1">
                Calculate HEART Score using the economic model formula
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
                ← Dashboard
              </Link>
            </div>
          </div>
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
                    className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 text-gray-900 font-medium"
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
                    className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 text-gray-900 font-medium"
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
                    className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 text-gray-900 font-medium placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Formula Reference */}
            <div className="bg-indigo-50 rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
              <h2 className="text-lg font-bold text-gray-900 mb-3">HEART Score Formula</h2>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Heart Value (HV):</strong></p>
                <p className="font-mono bg-white p-3 rounded border">
                  HV = Housing%GDP + Health%GDP + Energy%GDP + Education%GDP + Global_GDP_Share − Interest_Payments%GDP ± Trade%GDP
                </p>
                <p className="mt-3"><strong>Heart Affordability Ranking (HAR):</strong></p>
                <p className="font-mono bg-white p-3 rounded border">
                  APCI = PCI × (1 - Inflation)<br/>
                  AHDI = HDI - GINI<br/>
                  HAV = APCI × AHDI<br/>
                  HAR = Letter grade based on HAV
                </p>
                <p className="mt-3"><strong>Final HEART Score:</strong></p>
                <p className="font-mono bg-white p-3 rounded border">
                  HEART Score = HV × HAR
                </p>
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
                      className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 text-gray-900 font-medium placeholder:text-gray-400"
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
                      className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 text-gray-900 font-medium placeholder:text-gray-400"
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
                      className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 text-gray-900 font-medium placeholder:text-gray-400"
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
                      className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 text-gray-900 font-medium placeholder:text-gray-400"
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
                      className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 text-gray-900 font-medium placeholder:text-gray-400"
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
                      className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 text-gray-900 font-medium placeholder:text-gray-400"
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
                      className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 text-gray-900 font-medium placeholder:text-gray-400"
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
                    className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 text-gray-900 font-medium placeholder:text-gray-400"
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
                    className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 text-gray-900 font-medium placeholder:text-gray-400"
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
                    className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 text-gray-900 font-medium placeholder:text-gray-400"
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
                    className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm hover:border-indigo-300 text-gray-900 font-medium placeholder:text-gray-400"
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
              {results ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg p-6 text-white">
                    <h3 className="text-sm font-semibold mb-2">HEART Score</h3>
                    <div className="text-4xl font-black">{results.heartScore}</div>
                    <div className="text-sm mt-2 opacity-90">
                      HV: {results.normalizedHV.toFixed(3)} × HAR: {results.har}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Heart Value (HV)</h4>
                      <div className="text-2xl font-bold text-indigo-600">{results.normalizedHV.toFixed(3)}</div>
                      <p className="text-xs text-gray-600 mt-1">Raw HV: {results.rawHV.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 mt-1">Normalized to 0-1 scale</p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Adjusted PCI</h4>
                      <div className="text-lg font-bold text-purple-600">{formatCurrency(results.adjustedPCI)}</div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Adjusted HDI</h4>
                      <div className="text-lg font-bold text-blue-600">{results.adjustedHDI.toFixed(3)}</div>
                    </div>

                    <div className="bg-emerald-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">HAV</h4>
                      <div className="text-lg font-bold text-emerald-600">{formatCurrency(results.hav)}</div>
                    </div>

                    <div className="bg-amber-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">HAR</h4>
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

