"use client";

import { useMemo, useState } from "react";
import type { HeartRankingRow } from "@/lib/parseRanking";

type SortKey =
  | "overallRank"
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
    ARGENTINA: "AR",
    AUSTRALIA: "AU",
    BRAZIL: "BR",
    CANADA: "CA",
    CHINA: "CN",
    FRANCE: "FR",
    GERMANY: "DE",
    INDIA: "IN",
    INDONESIA: "ID",
    ITALY: "IT",
    JAPAN: "JP",
    MEXICO: "MX",
    NETHERLAND: "NL",
    RUSSIA: "RU",
    "SAUDI ARABIA": "SA",
    "SOUTH AFRICA": "ZA",
    "SOUTH KOREA": "KR",
    SPAIN: "ES",
    SWITZERLAND: "CH",
    TURKEY: "TR",
    "UNITED KINGDOM": "GB",
    UK: "GB",
    USA: "US",
    "UNITED STATES": "US",
  };

  return isoMap[key] || "";
}

export default function DoctrineRankingTable({
  ranking,
}: {
  ranking: HeartRankingRow[];
}) {
  const [sortKey, setSortKey] = useState<SortKey>("overallRank");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedRanking = useMemo(() => {
    const sorted = [...ranking].sort((a, b) => {
      let aValue: string | number = a[sortKey];
      let bValue: string | number = b[sortKey];

      if (sortKey === "heartScore") {
        aValue = getHeartScoreValue(a.heartScore);
        bValue = getHeartScoreValue(b.heartScore);
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === "asc" ? comparison : -comparison;
      }

      const numericComparison = Number(aValue) - Number(bValue);
      return sortDirection === "asc" ? numericComparison : -numericComparison;
    });

    return sorted;
  }, [ranking, sortKey, sortDirection]);

  function toggleSort(nextKey: SortKey) {
    if (sortKey === nextKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(nextKey);
    setSortDirection("asc");
  }

  function sortLabel(key: SortKey, label: string) {
    const active = sortKey === key;
    const arrow = active ? (sortDirection === "asc" ? "▲" : "▼") : "";
    return (
      <button
        type="button"
        onClick={() => toggleSort(key)}
        className="inline-flex items-center gap-2 font-semibold text-gray-800 hover:text-indigo-700 transition-colors"
      >
        <span>{label}</span>
        <span className="text-xs text-indigo-600">{arrow}</span>
      </button>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-indigo-50 text-gray-800">
          <tr>
            <th className="px-4 py-3">{sortLabel("country", "Country")}</th>
            <th className="px-4 py-3">{sortLabel("heartScore", "HEART Score")}</th>
            <th className="px-4 py-3">
              {sortLabel("resilienceRank", "Resilience")}
            </th>
            <th className="px-4 py-3">
              {sortLabel("affordabilityRank", "Affordability")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedRanking.map((row) => (
            <tr
              key={`${row.country}-${row.overallRank}`}
              className="border-b last:border-b-0"
            >
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-2">
                  {countryToIsoCode(row.country) ? (
                    <img
                      src={`https://flagcdn.com/w20/${countryToIsoCode(row.country).toLowerCase()}.png`}
                      alt={`${row.country} flag`}
                      width={20}
                      height={15}
                      loading="lazy"
                      className="rounded-sm"
                    />
                  ) : null}
                  <span>{row.country}</span>
                </span>
              </td>
              <td className="px-4 py-3 font-semibold text-indigo-700">
                {row.heartScore}
              </td>
              <td className="px-4 py-3">{row.resilienceRank}</td>
              <td className="px-4 py-3">{row.affordabilityRank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

