import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

export interface HeartRankingRow {
  overallRank: number;
  resilienceRank: number;
  affordabilityRank: number;
  country: string;
  heartScore: string;
  description?: string;
}

export interface HeartDoctrineInfo {
  predictiveAssumption: string;
  heartValueComponents: string[];
  heartAffordabilityComponents: string[];
  heartValueFormula: string;
  heartAffordabilityFormula: string;
  heartScoreFormula: string;
}

let cachedRanking: HeartRankingRow[] | null = null;
let cachedDoctrine: HeartDoctrineInfo | null = null;
let cachedYearlyRanking:
  | { years: number[]; rankingsByYear: Record<string, HeartRankingRow[]> }
  | null = null;

function resolveRankingFilePath(): string {
  const candidates = [
    "G-20+3_HEART RANKING.xlsx",
    "G-20+2_HEART RANKING.xlsx",
    "RANKING.xlsx",
  ];

  for (const fileName of candidates) {
    const filePath = path.join(process.cwd(), "data", fileName);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  throw new Error("Ranking Excel file not found in data/");
}

export function parseHeartRanking(): HeartRankingRow[] {
  if (cachedRanking && process.env.NODE_ENV === "production") {
    return cachedRanking;
  }

  const filePath = resolveRankingFilePath();
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
  });

  const dataRows = rows.filter((row) => {
    const rank = Number(row[0]);
    const country = String(row[3] || "").trim();
    return Number.isFinite(rank) && rank > 0 && country.length > 0;
  });

  const ranking = dataRows.map((row) => ({
    overallRank: Number(row[0]) || 0,
    resilienceRank: Number(row[1]) || 0,
    affordabilityRank: Number(row[2]) || 0,
    country: String(row[3] || "").trim(),
    heartScore: String(row[4] || "").trim(),
    description: String(row[5] || "").trim(),
  }));

  cachedRanking = ranking;
  return ranking;
}

function getNumeric(value: unknown): number {
  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return numeric;
  }
  const parsed = parseFloat(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildRankMap(
  rows: HeartRankingRow[],
  getValue: (row: HeartRankingRow) => number
): Map<string, number> {
  const sorted = [...rows].sort((a, b) => getValue(b) - getValue(a));
  const rankMap = new Map<string, number>();
  sorted.forEach((row, index) => {
    rankMap.set(row.country, index + 1);
  });
  return rankMap;
}

export function parseHeartRankingByYear(): {
  years: number[];
  rankingsByYear: Record<string, HeartRankingRow[]>;
} {
  if (cachedYearlyRanking && process.env.NODE_ENV === "production") {
    return cachedYearlyRanking;
  }

  const filePath = path.join(
    process.cwd(),
    "data",
    "MasterSheet_WithPredictive.xlsx"
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`MasterSheet Excel file not found at ${filePath}`);
  }

  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const worksheet =
    workbook.Sheets["MasterSheet_WithPredictive"] ||
    workbook.Sheets[workbook.SheetNames[0]];
  const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
  });

  const header = rows[0]?.map((value) => String(value || "").trim()) || [];
  const colIndex = (name: string) =>
    header.findIndex(
      (value) => value.toLowerCase() === name.toLowerCase()
    );

  const countryIndex = colIndex("Country");
  const yearIndex = colIndex("Year");
  const heartScoreIndex = colIndex("Heart Score");
  const heartValueIndex = colIndex("Heart Value");
  const heartAffordabilityIndex = colIndex("Heart Affordibility Value");

  if (
    countryIndex === -1 ||
    yearIndex === -1 ||
    heartScoreIndex === -1
  ) {
    throw new Error("Required columns not found in MasterSheet_WithPredictive");
  }

  const yearlyMap = new Map<number, HeartRankingRow[]>();

  rows.slice(1).forEach((row) => {
    const country = String(row[countryIndex] || "").trim();
    const year = Number(row[yearIndex]);
    if (!country || !Number.isFinite(year)) {
      return;
    }

    const heartScore = String(row[heartScoreIndex] || "").trim();
    const heartValue = getNumeric(row[heartValueIndex]);
    const heartAffordability = getNumeric(row[heartAffordabilityIndex]);

    const entry: HeartRankingRow = {
      overallRank: 0,
      resilienceRank: 0,
      affordabilityRank: 0,
      country,
      heartScore,
      description: "",
    };

    if (!yearlyMap.has(year)) {
      yearlyMap.set(year, []);
    }
    yearlyMap.get(year)?.push({
      ...entry,
      resilienceRank: heartValue,
      affordabilityRank: heartAffordability,
    });
  });

  const rankingsByYear: Record<string, HeartRankingRow[]> = {};
  const years = Array.from(yearlyMap.keys()).sort((a, b) => a - b);

  years.forEach((year) => {
    const rowsForYear = yearlyMap.get(year) || [];
    const overallRankMap = buildRankMap(rowsForYear, (row) =>
      getNumeric(row.heartScore)
    );
    const resilienceRankMap = buildRankMap(rowsForYear, (row) =>
      getNumeric(row.resilienceRank)
    );
    const affordabilityRankMap = buildRankMap(rowsForYear, (row) =>
      getNumeric(row.affordabilityRank)
    );

    const normalized = rowsForYear.map((row) => ({
      ...row,
      overallRank: overallRankMap.get(row.country) || 0,
      resilienceRank: resilienceRankMap.get(row.country) || 0,
      affordabilityRank: affordabilityRankMap.get(row.country) || 0,
      description: "",
    }));

    rankingsByYear[String(year)] = normalized;
  });

  cachedYearlyRanking = { years, rankingsByYear };
  return cachedYearlyRanking;
}

export function parseHeartDoctrineInfo(): HeartDoctrineInfo {
  if (cachedDoctrine && process.env.NODE_ENV === "production") {
    return cachedDoctrine;
  }

  const filePath = path.join(
    process.cwd(),
    "data",
    "Heart_Model_Predictive_MixModeling.xlsx"
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`Predictive Excel file not found at ${filePath}`);
  }

  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const worksheet = workbook.Sheets["Info"];
  const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
  });

  const predictiveAssumption =
    rows.find((row) => String(row[2] || "").includes("increase by"))?.[2] ||
    "";

  const heartValueComponents: string[] = [];
  const heartAffordabilityComponents: string[] = [];
  let hvStop = false;
  let harStop = false;

  rows.forEach((row) => {
    const hvValue = String(row[3] || "").trim();
    if (hvValue) {
      const hvLower = hvValue.toLowerCase();
      if (hvLower.includes("components out of this")) {
        hvStop = true;
      } else if (!hvStop && !hvLower.includes("heart value components")) {
        heartValueComponents.push(hvValue);
      }
    }

    const harValue = String(row[7] || "").trim();
    if (harValue) {
      const harLower = harValue.toLowerCase();
      if (harLower.includes("components out of this")) {
        harStop = true;
      } else if (!harStop && !harLower.includes("heart affordibility value")) {
        heartAffordabilityComponents.push(harValue);
      }
    }
  });

  const heartValueFormula =
    rows.find((row) => String(row[0] || "").includes("Housing"))?.[0] || "";
  const heartAffordabilityFormula =
    rows.find((row) => String(row[0] || "").includes("GDP*"))?.[0] || "";
  const heartScoreFormula =
    rows.find((row) => String(row[0] || "").includes("HV * HAR"))?.[0] || "";

  cachedDoctrine = {
    predictiveAssumption: String(predictiveAssumption).replace(/"/g, "").trim(),
    heartValueComponents,
    heartAffordabilityComponents,
    heartValueFormula: String(heartValueFormula).replace(/"/g, "").trim(),
    heartAffordabilityFormula: String(heartAffordabilityFormula)
      .replace(/"/g, "")
      .trim(),
    heartScoreFormula: String(heartScoreFormula).replace(/"/g, "").trim(),
  };

  return cachedDoctrine;
}

