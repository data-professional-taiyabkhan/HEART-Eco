"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// 2025 G-20+3 GDP data (Nominal USD, from HEART Model)
const GDP_DATA = [
    { country: "United States", iso: "us", gdp: 30.5e12, pct: 26.8 },
    { country: "China", iso: "cn", gdp: 19.2e12, pct: 16.9 },
    { country: "Germany", iso: "de", gdp: 4.8e12, pct: 4.2 },
    { country: "India", iso: "in", gdp: 4.2e12, pct: 3.7 },
    { country: "Japan", iso: "jp", gdp: 4.2e12, pct: 3.7 },
    { country: "United Kingdom", iso: "gb", gdp: 3.8e12, pct: 3.4 },
    { country: "France", iso: "fr", gdp: 3.2e12, pct: 2.8 },
    { country: "Italy", iso: "it", gdp: 2.4e12, pct: 2.1 },
    { country: "Canada", iso: "ca", gdp: 2.2e12, pct: 2.0 },
    { country: "Brazil", iso: "br", gdp: 2.1e12, pct: 1.9 },
    { country: "Russia", iso: "ru", gdp: 2.1e12, pct: 1.8 },
    { country: "Spain", iso: "es", gdp: 1.8e12, pct: 1.6 },
    { country: "South Korea", iso: "kr", gdp: 1.8e12, pct: 1.6 },
    { country: "Australia", iso: "au", gdp: 1.8e12, pct: 1.6 },
    { country: "Mexico", iso: "mx", gdp: 1.7e12, pct: 1.5 },
    { country: "Turkey", iso: "tr", gdp: 1.4e12, pct: 1.3 },
    { country: "Indonesia", iso: "id", gdp: 1.4e12, pct: 1.3 },
    { country: "Netherlands", iso: "nl", gdp: 1.3e12, pct: 1.1 },
    { country: "Saudi Arabia", iso: "sa", gdp: 1.1e12, pct: 1.0 },
    { country: "Switzerland", iso: "ch", gdp: 0.947e12, pct: 0.8 },
    { country: "Argentina", iso: "ar", gdp: 0.684e12, pct: 0.6 },
    { country: "South Africa", iso: "za", gdp: 0.426e12, pct: 0.4 },
];

const GLOBAL_GDP = 113.8e12;
const US_PCT = 26.8;
const CN_PCT = 16.9;
const REST_PCT = parseFloat((100 - US_PCT - CN_PCT).toFixed(1));

const PIE_DATA = [
    { name: "United States", value: US_PCT, color: "#3B82F6" },
    { name: "China", value: CN_PCT, color: "#EF4444" },
    { name: "Rest of world", value: REST_PCT, color: "#D1D5DB" },
];

function formatGDP(v: number): string {
    if (v >= 1e12) return `$${(v / 1e12).toFixed(1)}T`;
    if (v >= 1e9) return `$${(v / 1e9).toFixed(0)}B`;
    return `$${v}`;
}

export default function GdpVisualization() {
    const half = Math.ceil(GDP_DATA.length / 2);
    const leftCol = GDP_DATA.slice(0, half);
    const rightCol = GDP_DATA.slice(half);

    return (
        <div className="bg-white rounded-2xl shadow-md border border-indigo-100 p-6 mb-8">
            {/* Title */}
            <h2 className="text-lg font-bold text-gray-900 leading-snug mb-1">
                HEART SCORE RANKING OF G-20+3 COUNTRIES IN TERMS OF
                &ldquo;ECONOMIC RESILIENCE&rdquo; &amp; &ldquo;AFFORDABILITY&rdquo; (2025)
            </h2>
            <p className="text-indigo-600 text-sm font-semibold mb-6">
                USC (US–China) HEART Doctrine
            </p>

            {/* Donut + key metrics */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Donut */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center" style={{ minWidth: 220 }}>
                    <div className="relative w-48 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={PIE_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={62}
                                    outerRadius={90}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={-270}
                                    strokeWidth={2}
                                >
                                    {PIE_DATA.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v: number) => `${v}%`} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Centre label */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-gray-800">
                                {(US_PCT + CN_PCT).toFixed(1)}%
                            </span>
                            <span className="text-[10px] text-gray-500 text-center leading-tight px-2">
                                of global GDP
                            </span>
                            <span className="text-[10px] text-gray-500 text-center leading-tight px-2">
                                US {US_PCT}% | China {CN_PCT}%
                            </span>
                            <span className="text-lg font-bold text-gray-700 mt-1">
                                {REST_PCT}%
                            </span>
                            <span className="text-[10px] text-gray-500">Rest of the world</span>
                        </div>
                    </div>
                    {/* Legend */}
                    <div className="flex gap-3 mt-3 flex-wrap justify-center">
                        {PIE_DATA.map((d) => (
                            <div key={d.name} className="flex items-center gap-1">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                                <span className="text-xs text-gray-600">{d.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Global GDP + US + China cards */}
                <div className="flex-1 flex flex-col gap-3 justify-center">
                    {/* Global GDP */}
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
                        <span className="text-3xl">🌍</span>
                        <div>
                            <p className="font-bold text-gray-900">Global GDP</p>
                            <p className="text-sm text-gray-500">GDP: {formatGDP(GLOBAL_GDP)}</p>
                        </div>
                    </div>
                    {/* USA */}
                    <div className="flex items-center gap-4 p-4 rounded-xl border-l-4 border-blue-500 bg-blue-50">
                        <img
                            src="https://flagcdn.com/w40/us.png"
                            alt="US flag"
                            className="w-10 h-7 object-cover rounded-sm"
                        />
                        <div className="flex-1">
                            <p className="font-bold text-gray-900">United States</p>
                            <p className="text-sm text-gray-500">GDP: $30.5T</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-800">26.8%</p>
                            <p className="text-xs text-gray-500">global share</p>
                        </div>
                    </div>
                    {/* China */}
                    <div className="flex items-center gap-4 p-4 rounded-xl border-l-4 border-red-500 bg-red-50">
                        <img
                            src="https://flagcdn.com/w40/cn.png"
                            alt="China flag"
                            className="w-10 h-7 object-cover rounded-sm"
                        />
                        <div className="flex-1">
                            <p className="font-bold text-gray-900">China</p>
                            <p className="text-sm text-gray-500">GDP: $19.2T</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-800">16.9%</p>
                            <p className="text-xs text-gray-500">global share</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Country list grid */}
            <div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">GDP by country (G20+3)</h3>
                <p className="text-xs text-gray-500 mb-4">Values shown as Nominal GDP (USD) and share of global GDP</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                    {[leftCol, rightCol].map((col, ci) => (
                        <div key={ci} className="space-y-1">
                            {col.map((row) => (
                                <div
                                    key={row.country}
                                    className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0"
                                >
                                    <img
                                        src={`https://flagcdn.com/w20/${row.iso}.png`}
                                        alt={`${row.country} flag`}
                                        className="w-6 h-4 object-cover rounded-sm flex-shrink-0"
                                        loading="lazy"
                                    />
                                    <span className="flex-1 text-sm text-gray-800 font-medium">
                                        {row.country}
                                    </span>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {formatGDP(row.gdp)}
                                        </p>
                                        <p className="text-xs text-gray-500">{row.pct}%</p>
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
