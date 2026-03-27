"use client";

import { useMemo, useState } from "react";
import type { HeartRankingRow } from "@/lib/parseRanking";

type SortKey =
  | "country"
  | "heartScore"
  | "resilienceRank"
  | "affordabilityRank";

type SortDirection = "asc" | "desc";

function getHeartScoreValue(value: string): number {
  const numeric = parseFloat(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function countryToIsoCode(countryRaw: string): string {
  const key = countryRaw.trim().toUpperCase();
  const isoMap: Record<string, string> = {
    ARGENTINA: "AR", AUSTRALIA: "AU", BRAZIL: "BR", CANADA: "CA",
    CHINA: "CN", FRANCE: "FR", GERMANY: "DE", INDIA: "IN",
    INDONESIA: "ID", ITALY: "IT", JAPAN: "JP", MEXICO: "MX",
    NETHERLAND: "NL", RUSSIA: "RU", "SAUDI ARABIA": "SA",
    "SOUTH AFRICA": "ZA", "SOUTH KOREA": "KR", SPAIN: "ES",
    SWITZERLAND: "CH", TURKEY: "TR", "UNITED KINGDOM": "GB",
    UK: "GB", USA: "US", "UNITED STATES": "US",
  };
  return isoMap[key] || "";
}

export default function DoctrineRankingTable({
  ranking,
  selectedYear,
}: {
  ranking: HeartRankingRow[];
  selectedYear: string;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("heartScore");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const sortedRanking = useMemo(() => {
    return [...ranking].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sortKey === "heartScore") {
        aValue = getHeartScoreValue(a.heartScore);
        bValue = getHeartScoreValue(b.heartScore);
      } else if (sortKey === "resilienceRank" || sortKey === "affordabilityRank") {
        aValue = Number(a[sortKey]);
        bValue = Number(b[sortKey]);
      } else {
        aValue = String(a[sortKey]);
        bValue = String(b[sortKey]);
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        const cmp = aValue.localeCompare(bValue);
        return sortDirection === "asc" ? cmp : -cmp;
      }
      const numCmp = (aValue as number) - (bValue as number);
      return sortDirection === "asc" ? numCmp : -numCmp;
    });
  }, [ranking, sortKey, sortDirection]);

  function toggleSort(nextKey: SortKey) {
    if (sortKey === nextKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(nextKey);
      setSortDirection(nextKey === "country" ? "asc" : "desc");
    }
  }

  function SortBtn({ col, label }: { col: SortKey; label: string }) {
    const active = sortKey === col;
    return (
      <button
        type="button"
        onClick={() => toggleSort(col)}
        className="inline-flex items-center gap-1 font-semibold text-gray-800 hover:text-indigo-700 transition-colors whitespace-nowrap"
      >
        {label}
        <span className="text-xs text-indigo-600">
          {active ? (sortDirection === "asc" ? "▲" : "▼") : ""}
        </span>
      </button>
    );
  }

  const nextYear = String(Number(selectedYear) + 1);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1 leading-snug">
        HEART SCORE RANKING OF G-20+3 COUNTRIES IN TERMS OF{" "}
        <span className="text-indigo-700">&ldquo;ECONOMIC RESILIENCE&rdquo;</span>{" "}
        &amp;{" "}
        <span className="text-indigo-700">&ldquo;AFFORDABILITY&rdquo;</span>{" "}
        ({selectedYear})
      </h2>
      <p className="text-xs text-gray-400 mb-4">
        Future Outlook shows projected Heart Score, HV, HAV and Affordability grade for {nextYear}
      </p>

      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-indigo-50 text-gray-800">
            <tr>
              <th className="px-4 py-3 w-8 text-center text-gray-500">#</th>
              <th className="px-4 py-3">
                <SortBtn col="country" label="Country" />
              </th>
              <th className="px-4 py-3">
                <SortBtn col="heartScore" label="HEART Score" />
              </th>
              <th className="px-4 py-3">
                <SortBtn col="resilienceRank" label="Resilience" />
              </th>
              <th className="px-4 py-3">
                <SortBtn col="affordabilityRank" label="Affordability" />
              </th>
              <th className="px-4 py-3 max-w-xs">Brief Description</th>
              <th className="px-4 py-3 max-w-xs">Future Outlook ({nextYear})</th>
            </tr>
          </thead>
          <tbody>
            {sortedRanking.map((row, idx) => {
              const iso = countryToIsoCode(row.country);
              const isExpanded = expandedRow === row.country;
              return (
                <tr
                  key={`${row.country}-${row.overallRank}`}
                  className="border-b last:border-b-0 hover:bg-indigo-50/40 transition-colors"
                >
                  <td className="px-4 py-3 text-center text-gray-400 text-xs font-mono">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      {iso && (
                        <img
                          src={`https://flagcdn.com/w20/${iso.toLowerCase()}.png`}
                          alt={`${row.country} flag`}
                          width={20}
                          height={15}
                          loading="lazy"
                          className="rounded-sm"
                        />
                      )}
                      <span className="font-medium">{row.country}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-indigo-700 text-base">
                    {row.heartScore}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold">
                    {row.resilienceRank}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold">
                    {row.affordabilityRank}
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    {row.briefDescription ? (
                      <div>
                        <p className={`text-xs text-gray-600 ${!isExpanded ? "line-clamp-2" : ""}`}>
                          {row.briefDescription}
                        </p>
                        {row.briefDescription.length > 120 && (
                          <button
                            onClick={() => setExpandedRow(isExpanded ? null : row.country)}
                            className="text-xs text-indigo-500 hover:text-indigo-700 mt-1"
                          >
                            {isExpanded ? "Show less" : "Read more"}
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    {row.futureOutlook ? (
                      <span className="inline-block text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-lg px-2 py-1 leading-relaxed">
                        {row.futureOutlook}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">No forecast</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
