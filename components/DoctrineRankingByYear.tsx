"use client";

import { useMemo, useState } from "react";
import DoctrineRankingTable from "@/components/DoctrineRankingTable";
import type { HeartRankingRow } from "@/lib/parseRanking";

export default function DoctrineRankingByYear({
  years,
  rankingsByYear,
}: {
  years: number[];
  rankingsByYear: Record<string, HeartRankingRow[]>;
}) {
  const sortedYears = useMemo(
    () => [...years].sort((a, b) => b - a),
    [years]
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    sortedYears[0] ? String(sortedYears[0]) : ""
  );

  const ranking = rankingsByYear[selectedYear] || [];

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="doctrine-year"
            className="text-sm font-semibold text-gray-700"
          >
            Year
          </label>
          <select
            id="doctrine-year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            {sortedYears.map((year) => (
              <option key={year} value={String(year)}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <DoctrineRankingTable ranking={ranking} selectedYear={selectedYear} />
    </div>
  );
}
