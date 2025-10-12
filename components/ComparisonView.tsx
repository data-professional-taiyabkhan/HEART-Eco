"use client";

import { CountryData } from "@/lib/types";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/calculations";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface ComparisonViewProps {
  country1: CountryData;
  country2: CountryData;
}

interface ComparisonMetric {
  label: string;
  value1: number;
  value2: number;
  formatter: (value: number) => string;
  higherIsBetter: boolean;
}

export default function ComparisonView({ country1, country2 }: ComparisonViewProps) {
  const calculateDifference = (val1: number, val2: number) => {
    const diff = val1 - val2;
    const percentDiff = val2 !== 0 ? ((diff / val2) * 100) : 0;
    return { diff, percentDiff };
  };

  const metrics: ComparisonMetric[] = [
    {
      label: "GDP",
      value1: country1.countryGDP,
      value2: country2.countryGDP,
      formatter: formatCurrency,
      higherIsBetter: true,
    },
    {
      label: "Population",
      value1: country1.countryPopulation,
      value2: country2.countryPopulation,
      formatter: formatNumber,
      higherIsBetter: false, // Neutral
    },
    {
      label: "Per Capita Income",
      value1: country1.perCapitaIncome,
      value2: country2.perCapitaIncome,
      formatter: formatCurrency,
      higherIsBetter: true,
    },
    {
      label: "Adjusted PCI",
      value1: country1.adjustedPCI,
      value2: country2.adjustedPCI,
      formatter: formatCurrency,
      higherIsBetter: true,
    },
    {
      label: "Inflation Rate",
      value1: country1.countryInflation,
      value2: country2.countryInflation,
      formatter: formatPercent,
      higherIsBetter: false,
    },
    {
      label: "Total Debt",
      value1: country1.countryTotalDebt,
      value2: country2.countryTotalDebt,
      formatter: formatCurrency,
      higherIsBetter: false,
    },
    {
      label: "Debt to GDP",
      value1: country1.countryAdjustedDebtToGDPPercent,
      value2: country2.countryAdjustedDebtToGDPPercent,
      formatter: formatPercent,
      higherIsBetter: false,
    },
    {
      label: "Trade Balance",
      value1: country1.tradeBalance,
      value2: country2.tradeBalance,
      formatter: formatCurrency,
      higherIsBetter: true,
    },
    {
      label: "HDI",
      value1: country1.hdi,
      value2: country2.hdi,
      formatter: (v) => v.toFixed(3),
      higherIsBetter: true,
    },
    {
      label: "GINI",
      value1: country1.gini,
      value2: country2.gini,
      formatter: (v) => v.toFixed(3),
      higherIsBetter: false,
    },
    {
      label: "Heart Value (HV)",
      value1: country1.heartValue,
      value2: country2.heartValue,
      formatter: (v) => v.toFixed(3),
      higherIsBetter: true,
    },
    {
      label: "Heart Affordability Value (HAV)",
      value1: country1.heartAffordabilityValue,
      value2: country2.heartAffordabilityValue,
      formatter: formatCurrency,
      higherIsBetter: true,
    },
  ];

  // HAR comparison (special handling for letter grades)
  const harComparison = {
    country1: country1.heartAffordabilityRanking,
    country2: country2.heartAffordabilityRanking,
  };

  // Radar chart data - HEART Value Components
  const radarData = [
    {
      metric: "Housing %GDP",
      [country1.country]: country1.housingContributionToGDPPercent * 100,
      [country2.country]: country2.housingContributionToGDPPercent * 100,
    },
    {
      metric: "Health %GDP",
      [country1.country]: country1.healthContributionToGDPPercent * 100,
      [country2.country]: country2.healthContributionToGDPPercent * 100,
    },
    {
      metric: "Energy %GDP",
      [country1.country]: country1.energyContributionToGDPPercent * 100,
      [country2.country]: country2.energyContributionToGDPPercent * 100,
    },
    {
      metric: "Education %GDP",
      [country1.country]: country1.educationContributionToGDPPercent * 100,
      [country2.country]: country2.educationContributionToGDPPercent * 100,
    },
    {
      metric: "Global GDP Share",
      [country1.country]: country1.countryGDPPercentToGlobal * 100,
      [country2.country]: country2.countryGDPPercentToGlobal * 100,
    },
    {
      metric: "Interest Payments %GDP",
      [country1.country]: country1.interestPaymentToGDPPercent * 100,
      [country2.country]: country2.interestPaymentToGDPPercent * 100,
    },
    {
      metric: "Trade %GDP",
      [country1.country]: country1.tradeBalanceToGDPPercent * 100,
      [country2.country]: country2.tradeBalanceToGDPPercent * 100,
    },
  ];

  // Sector comparison data
  const sectorComparisonData = [
    {
      sector: "Housing",
      [country1.country]: country1.housingContributionToGDPPercent * 100,
      [country2.country]: country2.housingContributionToGDPPercent * 100,
    },
    {
      sector: "Health",
      [country1.country]: country1.healthContributionToGDPPercent * 100,
      [country2.country]: country2.healthContributionToGDPPercent * 100,
    },
    {
      sector: "Energy",
      [country1.country]: country1.energyContributionToGDPPercent * 100,
      [country2.country]: country2.energyContributionToGDPPercent * 100,
    },
    {
      sector: "Education",
      [country1.country]: country1.educationContributionToGDPPercent * 100,
      [country2.country]: country2.educationContributionToGDPPercent * 100,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEART Score Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
          <h3 className="text-xl font-semibold mb-4">{country1.country}</h3>
          <div className="text-6xl font-black mb-2">{country1.heartScore}</div>
          <div className="text-lg opacity-90">
            HV: {country1.heartValue.toFixed(2)} + HAR: {country1.heartAffordabilityRanking}
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg shadow-lg p-8 text-white">
          <h3 className="text-xl font-semibold mb-4">{country2.country}</h3>
          <div className="text-6xl font-black mb-2">{country2.heartScore}</div>
          <div className="text-lg opacity-90">
            HV: {country2.heartValue.toFixed(2)} + HAR: {country2.heartAffordabilityRanking}
          </div>
        </div>
      </div>

      {/* HV, HAV, HAR Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-indigo-500">
          <h4 className="text-sm font-semibold text-gray-600 mb-3">Heart Value (HV)</h4>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500">{country1.country}</p>
              <p className="text-2xl font-bold text-indigo-600">{country1.heartValue.toFixed(3)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">{country2.country}</p>
              <p className="text-2xl font-bold text-purple-600">{country2.heartValue.toFixed(3)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-amber-500">
          <h4 className="text-sm font-semibold text-gray-600 mb-3">Affordability Value (HAV)</h4>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500">{country1.country}</p>
              <p className="text-2xl font-bold text-indigo-600">{formatCurrency(country1.heartAffordabilityValue)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">{country2.country}</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(country2.heartAffordabilityValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-emerald-500">
          <h4 className="text-sm font-semibold text-gray-600 mb-3">Affordability Ranking (HAR)</h4>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500">{country1.country}</p>
              <p className="text-3xl font-bold text-indigo-600">{harComparison.country1}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">{country2.country}</p>
              <p className="text-3xl font-bold text-purple-600">{harComparison.country2}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Radar Comparison Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">HEART Value Components</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis />
            <Radar
              name={country1.country}
              dataKey={country1.country}
              stroke="#4F46E5"
              fill="#4F46E5"
              fillOpacity={0.6}
            />
            <Radar
              name={country2.country}
              dataKey={country2.country}
              stroke="#EC4899"
              fill="#EC4899"
              fillOpacity={0.6}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Sector Contributions Comparison */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Sector Contributions to GDP</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sectorComparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sector" />
            <YAxis />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
            <Legend />
            <Bar dataKey={country1.country} fill="#4F46E5" />
            <Bar dataKey={country2.country} fill="#EC4899" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Metrics Comparison Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Detailed Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {country1.country}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {country2.country}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % Difference
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.map((metric) => {
                const { diff, percentDiff } = calculateDifference(metric.value1, metric.value2);
                const isBetter = metric.higherIsBetter
                  ? metric.value1 > metric.value2
                  : metric.value1 < metric.value2;

                return (
                  <tr key={metric.label} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {metric.label}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        isBetter ? "text-green-600 font-semibold" : "text-gray-900"
                      }`}
                    >
                      {metric.formatter(metric.value1)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        !isBetter ? "text-green-600 font-semibold" : "text-gray-900"
                      }`}
                    >
                      {metric.formatter(metric.value2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {diff > 0 ? "+" : ""}
                      {metric.formatter(Math.abs(diff))}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        percentDiff > 0 ? "text-green-600" : percentDiff < 0 ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {percentDiff > 0 ? "+" : ""}
                      {percentDiff.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

