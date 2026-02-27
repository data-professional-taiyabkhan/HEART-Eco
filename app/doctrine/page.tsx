import {
  parseHeartDoctrineInfo,
  parseHeartRankingByYear,
} from "@/lib/parseRanking";
import DoctrineRankingByYear from "@/components/DoctrineRankingByYear";

export default function HeartDoctrinePage() {
  const { years, rankingsByYear } = parseHeartRankingByYear();
  const doctrine = parseHeartDoctrineInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            HEART Doctrine
          </h1>
          <p className="text-gray-600 max-w-3xl">
            A concise reference for the HEART Score framework, formulas, and the
            latest country rankings in economic resilience and affordability.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-indigo-100">
            <h2 className="text-xl font-semibold text-indigo-900 mb-3">
              Predictive Assumption
            </h2>
            <p className="text-gray-700">
              {doctrine.predictiveAssumption ||
                "Future components are assumed to increase by 5%."}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-indigo-100">
            <h2 className="text-xl font-semibold text-indigo-900 mb-3">
              HEART Score Formula
            </h2>
            <p className="text-gray-700">
              {doctrine.heartScoreFormula || "HV * HAR"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-indigo-100">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">
              Heart Value (HV) Components
            </h3>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              {doctrine.heartValueComponents.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {doctrine.heartValueFormula && (
              <div className="mt-4 text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Formula:</span>{" "}
                {doctrine.heartValueFormula}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-indigo-100">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">
              Heart Affordability (HAR) Components
            </h3>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              {doctrine.heartAffordabilityComponents.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {doctrine.heartAffordabilityFormula && (
              <div className="mt-4 text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Formula:</span>{" "}
                {doctrine.heartAffordabilityFormula}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 bg-white rounded-2xl shadow-md p-6 border border-indigo-100">
          <DoctrineRankingByYear years={years} rankingsByYear={rankingsByYear} />
        </div>
      </div>
    </div>
  );
}

