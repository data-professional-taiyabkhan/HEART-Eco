"use client";

import { useState, useEffect, useCallback } from "react";
import AppNav from "@/components/AppNav";
import { createClient } from "@/lib/supabase/client";
import {
  LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from "recharts";
import type { CountryTimeSeries, CountryYearRow } from "@/app/api/country-timeseries/route";

// ── Helpers ──────────────────────────────────────────────────────────────────

const ISO_FLAGS: Record<string, string> = {
  ar: "🇦🇷", au: "🇦🇺", br: "🇧🇷", ca: "🇨🇦", cn: "🇨🇳", fr: "🇫🇷",
  de: "🇩🇪", in: "🇮🇳", id: "🇮🇩", it: "🇮🇹", jp: "🇯🇵", mx: "🇲🇽",
  nl: "🇳🇱", ru: "🇷🇺", sa: "🇸🇦", za: "🇿🇦", kr: "🇰🇷", es: "🇪🇸",
  ch: "🇨🇭", tr: "🇹🇷", gb: "🇬🇧", us: "🇺🇸",
};

function fmt$T(v: number) {
  if (Math.abs(v) >= 1e12) return `$${(v / 1e12).toFixed(1)}T`;
  if (Math.abs(v) >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  return `$${v.toLocaleString()}`;
}
function fmtPct(v: number) { return `${v.toFixed(1)}%`; }
function fmtNum(v: number) {
  if (Math.abs(v) >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  return v.toLocaleString();
}

const FORECAST_COLOR = "#71C0FF";
const YEAR_2025 = 2025;

// ── StatCard ──────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color = "brand" }: {
  label: string; value: string; sub?: string; color?: string;
}) {
  const colors: Record<string, string> = {
    brand: "border-brand-400 bg-brand-50 text-brand-700",
    emerald: "border-emerald-400 bg-emerald-50 text-emerald-700",
    amber: "border-amber-400  bg-amber-50  text-amber-700",
    red: "border-red-400    bg-red-50    text-red-700",
    purple: "border-purple-400 bg-purple-50 text-purple-700",
    sky: "border-sky-400    bg-sky-50    text-sky-700",
  };
  return (
    <div className={`rounded-xl border-l-4 p-4 ${colors[color] || colors.brand}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="text-xl font-black mt-1">{value}</p>
      {sub && <p className="text-xs mt-0.5 opacity-60">{sub}</p>}
    </div>
  );
}

// ── TimeChart ─────────────────────────────────────────────────────────────────

type ChartSeries = { key: keyof CountryYearRow; label: string; color: string; formatter?: (v: number) => string };

function TimeChart({
  data, series, title, yFormatter
}: {
  data: CountryYearRow[];
  series: ChartSeries[];
  title: string;
  yFormatter?: (v: number) => string;
}) {
  const chartData = data.map(r => ({ ...r, name: String(r.year) }));
  const COLORS = ["#0089F7", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
      <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">{title}</h4>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={chartData} margin={{ left: 10, right: 10, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={yFormatter} tick={{ fontSize: 11 }} width={60} />
          <Tooltip formatter={(v: number, name: string) => {
            const s = series.find(s => s.label === name);
            return [(s?.formatter || yFormatter || String)(v), name];
          }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <ReferenceLine x={String(YEAR_2025)} stroke="#71C0FF" strokeDasharray="4 4" label={{ value: "Forecast →", fontSize: 10, fill: "#3DA6FF" }} />
          {series.map((s, i) => (
            <Line
              key={s.key as string}
              type="monotone"
              dataKey={s.key as string}
              name={s.label}
              stroke={s.color || COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── BarTimeChart ──────────────────────────────────────────────────────────────

function BarTimeChart({ data, dataKey, label, color, yFormatter, title }: {
  data: CountryYearRow[]; dataKey: keyof CountryYearRow; label: string;
  color: string; yFormatter?: (v: number) => string; title: string;
}) {
  const chartData = data.map(r => ({
    name: String(r.year),
    value: r[dataKey] as number,
    forecast: r.isPredicted,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
      <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">{title}</h4>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ left: 10, right: 10, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={yFormatter} tick={{ fontSize: 11 }} width={60} />
          <Tooltip formatter={(v: number) => [(yFormatter || String)(v), label]} />
          <Bar dataKey="value" name={label} radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.forecast ? FORECAST_COLOR : color} />
            ))}
          </Bar>
          <ReferenceLine x={String(YEAR_2025)} stroke="#71C0FF" strokeDasharray="4 4" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [countries, setCountries] = useState<Array<{ country: string; iso: string; heartScore: string }>>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("USA");
  const [data, setData] = useState<CountryTimeSeries | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [activeTab, setActiveTab] = useState<"economy" | "debt" | "trade" | "social" | "heart">("heart");
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const fullName = data.user?.user_metadata?.full_name as string | undefined;
      setFirstName(fullName ? fullName.trim().split(/\s+/)[0] : null);
    });
  }, []);

  useEffect(() => {
    fetch("/api/country-timeseries")
      .then(r => r.json())
      .then(d => { setCountries(d); setLoadingList(false); })
      .catch(() => setLoadingList(false));
  }, []);

  const fetchCountry = useCallback(async (country: string) => {
    setLoadingData(true);
    const r = await fetch(`/api/country-timeseries?country=${encodeURIComponent(country)}`);
    const d = await r.json();
    setData(d);
    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (selectedCountry) fetchCountry(selectedCountry);
  }, [selectedCountry, fetchCountry]);

  // Latest non-predicted row for KPI cards
  const latest = data?.rows.findLast(r => !r.isPredicted) || data?.rows[data.rows.length - 1];

  const tabs = [
    { id: "heart", label: "HEART Score" },
    { id: "economy", label: "Economy" },
    { id: "debt", label: "Debt" },
    { id: "trade", label: "Trade" },
    { id: "social", label: "Social" },
  ] as const;

  const flag = ISO_FLAGS[countries.find(c => c.country === selectedCountry)?.iso || ""] || "🏳️";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-50">
      <AppNav />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {firstName && (
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome back, {firstName} 👋
          </h1>
        )}

        {/* Country Selector */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6 border border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">Select Country</p>
              {loadingList ? (
                <div className="h-10 w-48 bg-gray-100 animate-pulse rounded-lg" />
              ) : (
                <select
                  value={selectedCountry}
                  onChange={e => setSelectedCountry(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-gray-800 bg-white shadow-sm focus:ring-2 focus:ring-brand-400 focus:outline-none min-w-[200px]"
                >
                  {countries.map(c => (
                    <option key={c.country} value={c.country}>
                      {(ISO_FLAGS[c.iso] || "") + " " + c.country}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {latest && (
              <div className="flex flex-wrap gap-3 ml-auto items-center">
                <div className="text-center px-4 py-2 bg-brand-600 text-white rounded-xl shadow">
                  <p className="text-xs opacity-80">HEART Score {latest.year}</p>
                  <p className="text-2xl font-black">{latest.heartScore}</p>
                </div>
                <div className="text-center px-4 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl">
                  <p className="text-xs opacity-70">Affordability</p>
                  <p className="text-xl font-black">{latest.affordabilityRanking}</p>
                </div>
                <div className="text-center px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl">
                  <p className="text-xs opacity-70">HV (Resilience)</p>
                  <p className="text-xl font-black">{latest.heartValue.toFixed(2)}</p>
                </div>
                <div className="text-center px-4 py-2 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl">
                  <p className="text-xs opacity-70">GDP {latest.year}</p>
                  <p className="text-xl font-black">{fmt$T(latest.gdp)}</p>
                </div>
              </div>
            )}
          </div>
          {latest?.briefDescription && (
            <p className="text-sm text-gray-600 mt-4 p-3 bg-brand-50 rounded-xl leading-relaxed border border-brand-100">
              <span className="font-semibold text-brand-700">📋 {latest.year} Brief: </span>
              {latest.briefDescription}
            </p>
          )}
        </div>

        {/* Loading skeleton */}
        {loadingData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-gray-100" />
            ))}
          </div>
        )}

        {/* Content */}
        {data && !loadingData && (
          <>
            {/* KPI Strip */}
            {latest && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                <StatCard label="GDP" value={fmt$T(latest.gdp)} sub={`${latest.globalGdpPct.toFixed(1)}% of world`} color="brand" />
                <StatCard label="Per Capita Income" value={fmt$T(latest.pci)} sub={`Adj: ${fmt$T(latest.adjustedPci)}`} color="emerald" />
                <StatCard label="Inflation" value={fmtPct(latest.inflation)} color={latest.inflation > 5 ? "red" : "sky"} />
                <StatCard label="Debt / GDP" value={fmtPct(latest.debtToGdp)} color={latest.debtToGdp > 100 ? "red" : "amber"} />
                <StatCard label="HDI" value={latest.hdi.toFixed(3)} sub={`GINI: ${latest.gini.toFixed(3)}`} color="purple" />
                <StatCard label="Trade Balance" value={fmt$T(latest.tradeBalance)} color={latest.tradeBalance >= 0 ? "emerald" : "red"} />
              </div>
            )}

            {/* Tab Navigation */}
            <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-6 flex-wrap">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-200 min-w-[80px] ${activeTab === t.id
                    ? "bg-brand-600 text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* HEART Score Tab */}
            {activeTab === "heart" && (
              <div className="space-y-6">
                <TimeChart
                  data={data.rows}
                  title="HEART Score Over Time"
                  series={[
                    { key: "heartValue", label: "Heart Value (HV)", color: "#0089F7", formatter: (v) => v.toFixed(3) },
                    { key: "heartAffordabilityValue", label: "HAV (Affordability Value)", color: "#10b981", formatter: fmt$T },
                  ]}
                  yFormatter={(v) => v.toFixed ? v.toFixed(2) : String(v)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <BarTimeChart data={data.rows} dataKey="heartValue" label="Heart Value" color="#0089F7" title="Heart Value (HV) by Year" yFormatter={v => v.toFixed(3)} />
                  <BarTimeChart data={data.rows} dataKey="heartAffordabilityValue" label="HAV" color="#10b981" title="Heart Affordability Value (HAV)" yFormatter={fmt$T} />
                </div>
                {/* Score timeline cards */}
                <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">HEART Score Timeline</h4>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
                    {data.rows.map(r => (
                      <div key={r.year} className={`text-center rounded-xl p-2 ${r.isPredicted ? "bg-brand-50 border border-brand-200" : "bg-gray-50 border border-gray-200"}`}>
                        <p className="text-[10px] text-gray-500 font-medium">{r.year}</p>
                        <p className="text-sm font-black text-brand-700 leading-tight">{r.heartScore}</p>
                        {r.isPredicted && <p className="text-[8px] text-brand-400">Fcst</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Economy Tab */}
            {activeTab === "economy" && (
              <div className="space-y-6">
                <TimeChart
                  data={data.rows}
                  title="GDP Over Time"
                  series={[{ key: "gdp", label: "GDP (USD)", color: "#0089F7", formatter: fmt$T }]}
                  yFormatter={fmt$T}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TimeChart
                    data={data.rows}
                    title="GDP Growth Rate (%)"
                    series={[{ key: "gdpGrowthRate", label: "GDP Growth %", color: "#10b981", formatter: fmtPct }]}
                    yFormatter={fmtPct}
                  />
                  <TimeChart
                    data={data.rows}
                    title="GDP Share of Global Economy (%)"
                    series={[{ key: "globalGdpPct", label: "Global GDP %", color: "#f59e0b", formatter: fmtPct }]}
                    yFormatter={fmtPct}
                  />
                  <TimeChart
                    data={data.rows}
                    title="Per Capita Income (PCI)"
                    series={[
                      { key: "pci", label: "PCI", color: "#8b5cf6", formatter: fmt$T },
                      { key: "adjustedPci", label: "Adjusted PCI", color: "#06b6d4", formatter: fmt$T },
                    ]}
                    yFormatter={fmt$T}
                  />
                  <TimeChart
                    data={data.rows}
                    title="Inflation Rate (%)"
                    series={[{ key: "inflation", label: "Inflation %", color: "#ef4444", formatter: fmtPct }]}
                    yFormatter={fmtPct}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <BarTimeChart data={data.rows} dataKey="housing" label="Housing (USD)" color="#0089F7" title="Housing Sector" yFormatter={fmt$T} />
                  <BarTimeChart data={data.rows} dataKey="health" label="Health (USD)" color="#10b981" title="Health Sector" yFormatter={fmt$T} />
                  <BarTimeChart data={data.rows} dataKey="energy" label="Energy (USD)" color="#f59e0b" title="Energy Sector" yFormatter={fmt$T} />
                  <BarTimeChart data={data.rows} dataKey="education" label="Education (USD)" color="#8b5cf6" title="Education Sector" yFormatter={fmt$T} />
                </div>
              </div>
            )}

            {/* Debt Tab */}
            {activeTab === "debt" && (
              <div className="space-y-6">
                <TimeChart
                  data={data.rows}
                  title="Total Debt & Interest Payment Over Time"
                  series={[
                    { key: "debt", label: "Total Debt", color: "#ef4444", formatter: fmt$T },
                    { key: "interestPayment", label: "Interest Payment", color: "#f59e0b", formatter: fmt$T },
                  ]}
                  yFormatter={fmt$T}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TimeChart
                    data={data.rows}
                    title="Debt to GDP (%)"
                    series={[{ key: "debtToGdp", label: "Debt/GDP %", color: "#ef4444", formatter: fmtPct }]}
                    yFormatter={fmtPct}
                  />
                  <TimeChart
                    data={data.rows}
                    title="Interest Payment to GDP (%)"
                    series={[{ key: "interestToGdp", label: "Interest/GDP %", color: "#f59e0b", formatter: fmtPct }]}
                    yFormatter={fmtPct}
                  />
                  <BarTimeChart data={data.rows} dataKey="debt" label="Total Debt" color="#ef4444" title="Total Debt by Year" yFormatter={fmt$T} />
                  <BarTimeChart data={data.rows} dataKey="interestPayment" label="Interest Payment" color="#f97316" title="Annual Interest Payment" yFormatter={fmt$T} />
                </div>
              </div>
            )}

            {/* Trade Tab */}
            {activeTab === "trade" && (
              <div className="space-y-6">
                <TimeChart
                  data={data.rows}
                  title="Imports & Exports Over Time"
                  series={[
                    { key: "exports", label: "Exports", color: "#10b981", formatter: fmt$T },
                    { key: "imports", label: "Imports", color: "#ef4444", formatter: fmt$T },
                  ]}
                  yFormatter={fmt$T}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TimeChart
                    data={data.rows}
                    title="Trade Balance Over Time"
                    series={[{ key: "tradeBalance", label: "Trade Balance", color: "#0089F7", formatter: fmt$T }]}
                    yFormatter={fmt$T}
                  />
                  <TimeChart
                    data={data.rows}
                    title="Trade Balance to GDP (%)"
                    series={[{ key: "tradeBalanceToGdp", label: "Trade Balance/GDP %", color: "#8b5cf6", formatter: fmtPct }]}
                    yFormatter={fmtPct}
                  />
                  <BarTimeChart data={data.rows} dataKey="exports" label="Exports" color="#10b981" title="Exports by Year" yFormatter={fmt$T} />
                  <BarTimeChart data={data.rows} dataKey="imports" label="Imports" color="#ef4444" title="Imports by Year" yFormatter={fmt$T} />
                </div>
              </div>
            )}

            {/* Social Tab */}
            {activeTab === "social" && (
              <div className="space-y-6">
                <TimeChart
                  data={data.rows}
                  title="HDI & Adjusted HDI Over Time"
                  series={[
                    { key: "hdi", label: "HDI", color: "#0089F7", formatter: (v) => v.toFixed(3) },
                    { key: "adjustedHdi", label: "Adjusted HDI", color: "#10b981", formatter: (v) => v.toFixed(3) },
                  ]}
                  yFormatter={(v) => v.toFixed(3)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TimeChart
                    data={data.rows}
                    title="GINI Index Over Time"
                    series={[{ key: "gini", label: "GINI", color: "#f59e0b", formatter: (v) => v.toFixed(3) }]}
                    yFormatter={(v) => v.toFixed(3)}
                  />
                  <TimeChart
                    data={data.rows}
                    title="Population Growth"
                    series={[{ key: "population", label: "Population", color: "#8b5cf6", formatter: fmtNum }]}
                    yFormatter={fmtNum}
                  />
                </div>
              </div>
            )}

            {/* Forecast notice */}
            <div className="mt-6 text-xs text-gray-400 flex items-center gap-2 bg-white rounded-xl px-4 py-2 border border-gray-100 w-fit">
              <span className="w-4 h-0.5 bg-brand-300 inline-block" /> Dashed line = start of forecast data (2026–2030)
            </div>
          </>
        )}
      </div>
    </div>
  );
}
