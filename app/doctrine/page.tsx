import {
  parseHeartDoctrineInfo,
  parseHeartRankingByYear,
} from "@/lib/parseRanking";
import DoctrineRankingByYear from "@/components/DoctrineRankingByYear";
import GdpVisualization from "@/components/GdpVisualization";

export default function HeartDoctrinePage() {
  const { years, rankingsByYear } = parseHeartRankingByYear();
  const doctrine = parseHeartDoctrineInfo();

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

        {/* GDP Visualization */}
        <GdpVisualization />

        {/* Rankings Table */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-indigo-100">
          <DoctrineRankingByYear years={years} rankingsByYear={rankingsByYear} />
        </div>
      </div>
    </div>
  );
}
