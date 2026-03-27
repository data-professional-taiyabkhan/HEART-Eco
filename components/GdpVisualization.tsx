"use client";

import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { GdpCountryRow } from "@/lib/parseRanking";

function formatGDP(v: number): string {
    if (v >= 1e12) return `$${(v / 1e12).toFixed(1)}T`;
    if (v >= 1e9) return `$${(v / 1e9).toFixed(0)}B`;
    return `$${v.toLocaleString()}`;
}

export default function GdpVisualization({
    years,
    gdpByYear,
}: {
    years: number[];
    gdpByYear: Record<string, GdpCountryRow[]>;
}) {
    const sortedYears = useMemo(() => [...years].sort((a, b) => b - a), [years]);
    const [selectedYear, setSelectedYear] = useState<string>(
        sortedYears[0] ? String(sortedYears[0]) : ""
    );

    const rows = gdpByYear[selectedYear] || [];

    // Calculate totals from data for donut
    const totalGdp = rows.reduce((s, r) => s + r.gdp, 0);
    const usRow = rows.find((r) => r.iso === "us");
    const cnRow = rows.find((r) => r.iso === "cn");
    const usPct = usRow ? parseFloat(usRow.globalPct.toFixed(1)) : 0;
    const cnPct = cnRow ? parseFloat(cnRow.globalPct.toFixed(1)) : 0;
    const restPct = parseFloat((100 - usPct - cnPct).toFixed(1));

    const pieData = [
        { name: "United States", value: usPct, color: "#3B82F6" },
        { name: "China", value: cnPct, color: "#EF4444" },
        { name: "Rest of world", value: restPct > 0 ? restPct : 0, color: "#D1D5DB" },
    ];

    const half = Math.ceil(rows.length / 2);
    const leftCol = rows.slice(0, half);
    const rightCol = rows.slice(half);

    return (
        <div className="bg-white rounded-2xl shadow-md border border-indigo-100 p-6 mb-8">
            {/* Title + Year Selector */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-snug">
                        HEART SCORE RANKING OF G-20+3 COUNTRIES IN TERMS OF &ldquo;ECONOMIC
                        RESILIENCE&rdquo; &amp; &ldquo;AFFORDABILITY&rdquo; ({selectedYear})
                    </h2>
                    <p className="text-indigo-600 text-sm font-semibold mt-1">
                        USC (US–China) HEART Doctrine
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <label
                        htmlFor="gdp-year"
                        className="text-sm font-semibold text-gray-700 whitespace-nowrap"
                    >
                        Year
                    </label>
                    <select
                        id="gdp-year"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    >
                        {sortedYears.map((y) => (
                            <option key={y} value={String(y)}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Donut + key metrics */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Donut */}
                <div
                    className="flex-shrink-0 flex flex-col items-center justify-center"
                    style={{ minWidth: 220 }}
                >
                    <div className="relative w-48 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={62}
                                    outerRadius={90}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={-270}
                                    strokeWidth={2}
                                >
                                    {pieData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-gray-800">
                                {(usPct + cnPct).toFixed(1)}%
                            </span>
                            <span className="text-[10px] text-gray-500 text-center leading-tight px-2">
                                of global GDP
                            </span>
                            <span className="text-[10px] text-gray-500 text-center leading-tight px-2">
                                US {usPct}% | China {cnPct}%
                            </span>
                            <span className="text-lg font-bold text-gray-700 mt-1">
                                {restPct}%
                            </span>
                            <span className="text-[10px] text-gray-500">Rest of the world</span>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-3 flex-wrap justify-center">
                        {pieData.map((d) => (
                            <div key={d.name} className="flex items-center gap-1">
                                <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ background: d.color }}
                                />
                                <span className="text-xs text-gray-600">{d.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Global GDP + US + China cards */}
                <div className="flex-1 flex flex-col gap-3 justify-center">
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
                        <span className="text-3xl">🌍</span>
                        <div>
                            <p className="font-bold text-gray-900">Global GDP</p>
                            <p className="text-sm text-gray-500">
                                GDP: {formatGDP(totalGdp)}
                            </p>
                        </div>
                    </div>
                    {usRow && (
                        <div className="flex items-center gap-4 p-4 rounded-xl border-l-4 border-blue-500 bg-blue-50">
                            <img
                                src="https://flagcdn.com/w40/us.png"
                                alt="US flag"
                                className="w-10 h-7 object-cover rounded-sm"
                            />
                            <div className="flex-1">
                                <p className="font-bold text-gray-900">United States</p>
                                <p className="text-sm text-gray-500">
                                    GDP: {formatGDP(usRow.gdp)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-800">{usPct}%</p>
                                <p className="text-xs text-gray-500">global share</p>
                            </div>
                        </div>
                    )}
                    {cnRow && (
                        <div className="flex items-center gap-4 p-4 rounded-xl border-l-4 border-red-500 bg-red-50">
                            <img
                                src="https://flagcdn.com/w40/cn.png"
                                alt="China flag"
                                className="w-10 h-7 object-cover rounded-sm"
                            />
                            <div className="flex-1">
                                <p className="font-bold text-gray-900">China</p>
                                <p className="text-sm text-gray-500">
                                    GDP: {formatGDP(cnRow.gdp)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-800">{cnPct}%</p>
                                <p className="text-xs text-gray-500">global share</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Country list grid */}
            <div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">
                    GDP by country (G20+3) — {selectedYear}
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                    Values shown as Nominal GDP (USD) and share of global GDP
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                    {[leftCol, rightCol].map((col, ci) => (
                        <div key={ci} className="space-y-1">
                            {col.map((row) => (
                                <div
                                    key={row.country}
                                    className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0"
                                >
                                    {row.iso && (
                                        <img
                                            src={`https://flagcdn.com/w20/${row.iso}.png`}
                                            alt={`${row.country} flag`}
                                            className="w-6 h-4 object-cover rounded-sm flex-shrink-0"
                                            loading="lazy"
                                        />
                                    )}
                                    <span className="flex-1 text-sm text-gray-800 font-medium">
                                        {row.country}
                                    </span>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {formatGDP(row.gdp)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {row.globalPct.toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
