import {
  parseHeartDoctrineInfo,
  parseHeartRankingByYear,
  parseMasterSheetGdpByYear,
} from "@/lib/parseRanking";
import DoctrineRankingByYear from "@/components/DoctrineRankingByYear";
import GdpVisualization from "@/components/GdpVisualization";
import FlourishEmbed from "@/components/FlourishEmbed";

export default function HeartDoctrinePage() {
  const { years, rankingsByYear } = parseHeartRankingByYear();
  const doctrine = parseHeartDoctrineInfo();
  const { years: gdpYears, gdpByYear } = parseMasterSheetGdpByYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-10">
        {/* Heading + Predictive Assumption */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            HEART Doctrine
          </h1>
          <p className="text-gray-700 max-w-3xl">
            {doctrine.predictiveAssumption ||
              "Future components are assumed to increase by 5%."}
          </p>
        </div>

        {/* GDP Visualization with year-switcher */}
        <GdpVisualization years={gdpYears} gdpByYear={gdpByYear} />

        {/* Rankings Table */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-indigo-100 mb-10">
          <DoctrineRankingByYear years={years} rankingsByYear={rankingsByYear} />
        </div>

        {/* Flourish Charts */}
        <div className="grid gap-8 md:grid-cols-1">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-indigo-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              HEART Resilience — Country Rankings
            </h2>
            <FlourishEmbed visualisationId="27376519" title="HEART Resilience" />
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-indigo-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              HEART Affordability — Country Rankings
            </h2>
            <FlourishEmbed visualisationId="27376815" title="HEART Affordability" />
          </div>
        </div>
      </div>
    </div>
  );
}
