"use client";

import { useState } from "react";
import { CountryData, AFFORDABILITY_GRADES } from "@/lib/types";
import { formatCurrency, formatPercent, formatNumber, formatLargeNumber } from "@/lib/calculations";
import MetricCard from "./MetricCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface CountryDashboardProps {
  country: CountryData;
}

const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

export default function CountryDashboard({ country }: CountryDashboardProps) {
  const [showRawValues, setShowRawValues] = useState(false);

  // Prepare chart data for Heart Value components
  const heartValueData = [
    { name: "Housing", value: country.housingContributionToGDPPercent * 100 },
    { name: "Health", value: country.healthContributionToGDPPercent * 100 },
    { name: "Energy", value: country.energyContributionToGDPPercent * 100 },
    { name: "Education", value: country.educationContributionToGDPPercent * 100 },
    { name: "Global Share", value: country.countryGDPPercentToGlobal * 100 },
    { name: "Interest Payments", value: -(country.interestPaymentToGDPPercent * 100) },
    { name: "Trade", value: country.tradeBalanceToGDPPercent * 100 },
  ];

  const sectorData = [
    { name: "Housing", usd: country.housingContributionToGDP, percent: country.housingContributionToGDPPercent * 100 },
    { name: "Health", usd: country.healthContributionToGDP, percent: country.healthContributionToGDPPercent * 100 },
    { name: "Energy", usd: country.energyContributionToGDP, percent: country.energyContributionToGDPPercent * 100 },
    { name: "Education", usd: country.educationContributionToGDP, percent: country.educationContributionToGDPPercent * 100 },
  ];

  // Custom Y-axis tick formatter for large USD values
  const formatYAxisTick = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value}`;
  };

  return (
    <div className="space-y-8">
      {/* Country Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-lg p-8">
        <h2 className="text-4xl font-bold mb-2">{country.country}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <p className="text-indigo-100 text-sm">GDP Ranking</p>
            <p className="text-2xl font-bold">#{country.countryGDPRanking}</p>
          </div>
          <div>
            <p className="text-indigo-100 text-sm">GDP</p>
            <p className="text-2xl font-bold">{formatCurrency(country.countryGDP)}</p>
          </div>
          <div>
            <p className="text-indigo-100 text-sm">Population</p>
            <p className="text-2xl font-bold">{formatNumber(country.countryPopulation)}</p>
          </div>
          <div>
            <p className="text-indigo-100 text-sm">Per Capita Income</p>
            <p className="text-2xl font-bold">{formatCurrency(country.perCapitaIncome)}</p>
          </div>
        </div>
      </div>

      {/* HEART Score - Main Feature */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg shadow-xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">HEART Score</h3>
        <div className="flex items-center justify-center mb-6">
          <div className="text-center">
            <div className="text-7xl font-black mb-2">{country.heartScore}</div>
            <div className="text-xl opacity-90">
              HV: {country.heartValue.toFixed(2)} × HAR: {country.heartAffordabilityRanking}
            </div>
          </div>
        </div>
        {country.heartScoreDescription && (
          <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm leading-relaxed">{country.heartScoreDescription}</p>
          </div>
        )}
      </div>

      {/* Economic Overview */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Economic Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            label="Country GDP"
            value={formatCurrency(country.countryGDP)}
            subValue={`${formatPercent(country.countryGDPPercentToGlobal)} of Global GDP`}
          />
          <MetricCard
            label="Population"
            value={formatNumber(country.countryPopulation)}
            subValue={`${formatPercent(country.countryPopulationToGlobalPercent)} of Global Population`}
          />
          <MetricCard
            label="Per Capita Income (PCI)"
            value={formatCurrency(country.perCapitaIncome)}
          />
          <MetricCard
            label="Inflation Rate"
            value={formatPercent(country.countryInflation)}
            colorClass={country.countryInflation > 5 ? "bg-red-50" : "bg-white"}
          />
          <MetricCard
            label="Adjusted PCI (APCI)"
            value={formatCurrency(country.adjustedPCI)}
            calculation={`PCI (${formatCurrency(country.perCapitaIncome)}) × (1 - Inflation ${formatPercent(country.countryInflation)})`}
            colorClass="bg-green-50"
          />
        </div>
      </section>

      {/* Debt Metrics */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Debt & Interest Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            label="Total Debt"
            value={formatCurrency(country.countryTotalDebt)}
          />
          <MetricCard
            label="Interest Rate"
            value={formatPercent(country.interestRate)}
          />
          <MetricCard
            label="Interest Payment"
            value={formatCurrency(country.countryInterestPayment)}
            calculation={`${formatPercent(country.interestRate)} × ${formatCurrency(country.countryTotalDebt)}`}
            colorClass="bg-orange-50"
          />
          <MetricCard
            label="Interest Payment to GDP"
            value={formatPercent(country.interestPaymentToGDPPercent)}
          />
          <MetricCard
            label="Adjusted Debt"
            value={formatCurrency(country.countryAdjustedDebt)}
          />
          <MetricCard
            label="Adjusted Debt to GDP"
            value={formatPercent(country.countryAdjustedDebtToGDPPercent)}
            calculation={`(Debt + Interest Payment) / GDP`}
            colorClass={country.countryAdjustedDebtToGDPPercent > 100 ? "bg-red-50" : "bg-white"}
          />
        </div>
      </section>

      {/* Trade Metrics */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Trade Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            label="Country Trade Volume"
            value={formatCurrency(country.countryTrade)}
            subValue={`${formatPercent(country.countryPercentToGlobalTrade)} of Global Trade`}
          />
          <MetricCard
            label="Trade Contribution to GDP"
            value={formatPercent(country.tradeContributionToGDPPercent)}
          />
          <MetricCard
            label="Trade Balance"
            value={`${formatCurrency(country.tradeBalance)} ${country.tradeBalance >= 0 ? '(Surplus)' : '(Deficit)'}`}
            colorClass={country.tradeBalance >= 0 ? "bg-green-50" : "bg-red-50"}
          />
          <MetricCard
            label="Trade Balance to GDP"
            value={formatPercent(country.tradeBalanceToGDPPercent)}
            colorClass={country.tradeBalanceToGDPPercent >= 0 ? "bg-green-50" : "bg-red-50"}
          />
        </div>
      </section>

      {/* Sector Contributions */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Sector Contributions to GDP</h3>
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-700">View:</h4>
            <button
              onClick={() => setShowRawValues(!showRawValues)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {showRawValues ? "Show Percentages" : "Show USD Values"}
            </button>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={sectorData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                width={80}
                tickFormatter={showRawValues ? formatYAxisTick : undefined}
              />
              <Tooltip
                formatter={(value: number) =>
                  showRawValues ? formatCurrency(value) : `${value.toFixed(2)}%`
                }
              />
              <Legend />
              <Bar
                dataKey={showRawValues ? "usd" : "percent"}
                fill="#4F46E5"
                name={showRawValues ? "USD" : "% of GDP"}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Housing Contribution"
            value={formatCurrency(country.housingContributionToGDP)}
            subValue={formatPercent(country.housingContributionToGDPPercent)}
          />
          <MetricCard
            label="Health Contribution"
            value={formatCurrency(country.healthContributionToGDP)}
            subValue={formatPercent(country.healthContributionToGDPPercent)}
          />
          <MetricCard
            label="Energy Contribution"
            value={formatCurrency(country.energyContributionToGDP)}
            subValue={formatPercent(country.energyContributionToGDPPercent)}
          />
          <MetricCard
            label="Education Contribution"
            value={formatCurrency(country.educationContributionToGDP)}
            subValue={formatPercent(country.educationContributionToGDPPercent)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <MetricCard
            label="Housing Units"
            value={formatLargeNumber(country.countryHousingUnits)}
          />
          <MetricCard
            label="Houses per Person"
            value={country.countryHousePerPerson.toFixed(3)}
          />
        </div>
      </section>

      {/* Affordability Scores */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Affordability Scores</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <MetricCard
            label="Adjusted PCI (APCI)"
            value={formatCurrency(country.adjustedPCI)}
            calculation={`${formatCurrency(country.perCapitaIncome)} - ${formatPercent(country.countryInflation)}`}
          />
          <MetricCard
            label="HDI"
            value={country.hdi.toFixed(3)}
            subValue="Human Development Index"
          />
          <MetricCard
            label="GINI"
            value={country.gini.toFixed(3)}
            subValue="Income Inequality Index"
          />
          <MetricCard
            label="Adjusted HDI (AHDI)"
            value={country.adjustedHDI.toFixed(3)}
            calculation={`HDI (${country.hdi.toFixed(3)}) - GINI (${country.gini.toFixed(3)})`}
            colorClass="bg-blue-50"
          />
          <MetricCard
            label="Heart Affordability Value (HAV)"
            value={formatCurrency(country.heartAffordabilityValue)}
            calculation={`APCI × AHDI`}
            colorClass="bg-purple-50"
          />
          <MetricCard
            label="Heart Affordability Ranking (HAR)"
            value={country.heartAffordabilityRanking}
            subValue="Grade based on HAV"
            colorClass="bg-amber-50"
          />
        </div>

        {/* Affordability Ranking Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Affordability Ranking Reference Table
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Range (USD)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {AFFORDABILITY_GRADES.map((grade, idx) => (
                  <tr
                    key={grade.grade}
                    className={
                      grade.grade === country.heartAffordabilityRanking
                        ? "bg-amber-100 font-semibold"
                        : ""
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(grade.min)} - {formatCurrency(grade.max)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {grade.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Heart Value Breakdown */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Heart Value (HV) Breakdown</h3>
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-gray-700">Heart Value (HV)</span>
              <span className="text-3xl font-bold text-indigo-600">
                {country.heartValue.toFixed(2)}
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={heartValueData} layout="horizontal" margin={{ left: 20, right: 30, top: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => `${value.toFixed(1)}%`}
              />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip formatter={(value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`} />
              <Legend />
              <Bar dataKey="value" fill="#4F46E5" name="% Contribution">
                {heartValueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 bg-indigo-50 rounded-lg p-4">
            <h5 className="font-semibold text-gray-900 mb-2">Calculation Formula:</h5>
            <p className="text-sm font-mono text-gray-700">
              HV_raw = Housing%GDP + Health%GDP + Energy%GDP + Education%GDP + Global_GDP_Share − Interest_Payments%GDP + Trade%GDP
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Then normalized to 0-1 scale across all countries
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {heartValueData.map((item, idx) => (
            <div
              key={item.name}
              className="bg-white rounded-lg shadow-md p-4 border-l-4"
              style={{ borderColor: COLORS[idx % COLORS.length] }}
            >
              <p className="text-sm text-gray-600">{item.name}</p>
              <p className={`text-xl font-bold ${item.value < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {item.value >= 0 ? '+' : ''}{item.value.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

