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
  briefDescription?: string;
  futureOutlook?: string;
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
let cachedGdpByYear:
  | { years: number[]; gdpByYear: Record<string, GdpCountryRow[]> }
  | null = null;

export interface GdpCountryRow {
  country: string;
  iso: string;
  gdp: number;
  globalPct: number;
}


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
    "Mastersheet",
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
  const briefDescIndex = colIndex("Brief Description of HEART Scores");
  const affordRankingIndex = colIndex("Affordbility Ranking");

  if (
    countryIndex === -1 ||
    yearIndex === -1 ||
    heartScoreIndex === -1
  ) {
    throw new Error("Required columns not found in MasterSheet_WithPredictive");
  }

  // ── Pass 1: collect raw data per country/year ──────────────────────────
  type RawEntry = {
    country: string;
    heartScore: string;
    heartValue: number;
    heartAffordability: number;
    briefDescription: string;
  };
  const rawYearlyMap = new Map<number, RawEntry[]>();

  rows.slice(1).forEach((row) => {
    const country = String(row[countryIndex] || "").trim();
    const year = Number(row[yearIndex]);
    if (!country || !Number.isFinite(year)) return;

    const heartScore = String(row[heartScoreIndex] || "").trim();
    const heartValue = getNumeric(row[heartValueIndex]);
    const heartAffordability = getNumeric(row[heartAffordabilityIndex]);
    const briefDescription =
      briefDescIndex !== -1 ? String(row[briefDescIndex] || "").trim() : "";

    if (!rawYearlyMap.has(year)) rawYearlyMap.set(year, []);
    rawYearlyMap.get(year)!.push({
      country,
      heartScore,
      heartValue,
      heartAffordability,
      briefDescription,
    });
  });

  // ── Pass 2: compute ranks for every year ───────────────────────────────
  const allYears = Array.from(rawYearlyMap.keys()).sort((a, b) => a - b);

  // For each year pre-build rank maps (resilience = heartValue desc, affordability = heartAffordability desc)
  const resilienceRanksByYear = new Map<number, Map<string, number>>();
  const affordabilityRanksByYear = new Map<number, Map<string, number>>();
  const overallRanksByYear = new Map<number, Map<string, number>>();

  allYears.forEach((year) => {
    const entries = rawYearlyMap.get(year) || [];

    const byResilience = [...entries].sort((a, b) => b.heartValue - a.heartValue);
    const resMap = new Map<string, number>();
    byResilience.forEach((e, i) => resMap.set(e.country, i + 1));

    const byAffordability = [...entries].sort(
      (a, b) => b.heartAffordability - a.heartAffordability
    );
    const affMap = new Map<string, number>();
    byAffordability.forEach((e, i) => affMap.set(e.country, i + 1));

    const byOverall = [...entries].sort(
      (a, b) => getNumeric(b.heartScore) - getNumeric(a.heartScore)
    );
    const overallMap = new Map<string, number>();
    byOverall.forEach((e, i) => overallMap.set(e.country, i + 1));

    resilienceRanksByYear.set(year, resMap);
    affordabilityRanksByYear.set(year, affMap);
    overallRanksByYear.set(year, overallMap);
  });

  // ── Pass 3: build final HeartRankingRow with futureOutlook using NEXT year ranks ──
  const rankingsByYear: Record<string, HeartRankingRow[]> = {};

  allYears.forEach((year) => {
    const entries = rawYearlyMap.get(year) || [];
    const nextYear = year + 1;
    const nextRawEntries = rawYearlyMap.get(nextYear);
    const nextResMap = resilienceRanksByYear.get(nextYear);
    const nextAffMap = affordabilityRanksByYear.get(nextYear);
    // Build a quick lookup for next-year heartScore by country
    const nextScoreMap = new Map<string, string>();
    (nextRawEntries || []).forEach((e) => nextScoreMap.set(e.country, e.heartScore));

    const resMap = resilienceRanksByYear.get(year)!;
    const affMap = affordabilityRanksByYear.get(year)!;
    const overallMap = overallRanksByYear.get(year)!;

    rankingsByYear[String(year)] = entries.map((e) => {
      // Future outlook uses NEXT year's calculated ranks
      let futureOutlook = "";
      if (nextScoreMap.has(e.country)) {
        const nextScore = nextScoreMap.get(e.country) || "";
        const nextResRank = nextResMap?.get(e.country) ?? "—";
        const nextAffRank = nextAffMap?.get(e.country) ?? "—";
        futureOutlook = `Score: ${nextScore} | Resilience: #${nextResRank} | Affordability: #${nextAffRank}`;
      }

      return {
        overallRank: overallMap.get(e.country) || 0,
        resilienceRank: resMap.get(e.country) || 0,
        affordabilityRank: affMap.get(e.country) || 0,
        country: e.country,
        heartScore: e.heartScore,
        description: "",
        briefDescription: e.briefDescription,
        futureOutlook,
      };
    });
  });

  cachedYearlyRanking = { years: allYears, rankingsByYear };
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

const ISO_MAP: Record<string, string> = {
  ARGENTINA: "ar", AUSTRALIA: "au", BRAZIL: "br", CANADA: "ca",
  CHINA: "cn", FRANCE: "fr", GERMANY: "de", INDIA: "in",
  INDONESIA: "id", ITALY: "it", JAPAN: "jp", MEXICO: "mx",
  NETHERLAND: "nl", NETHERLANDS: "nl", RUSSIA: "ru",
  "SAUDI ARABIA": "sa", "SOUTH AFRICA": "za", "SOUTH KOREA": "kr",
  SPAIN: "es", SWITZERLAND: "ch", TURKEY: "tr",
  "UNITED KINGDOM": "gb", UK: "gb", USA: "us", "UNITED STATES": "us",
};

export function parseMasterSheetGdpByYear(): {
  years: number[];
  gdpByYear: Record<string, GdpCountryRow[]>;
} {
  if (cachedGdpByYear && process.env.NODE_ENV === "production") {
    return cachedGdpByYear;
  }

  const filePath = path.join(
    process.cwd(),
    "data",
    "Mastersheet",
    "MasterSheet_WithPredictive.xlsx"
  );

  if (!fs.existsSync(filePath)) {
    return { years: [], gdpByYear: {} };
  }

  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const worksheet =
    workbook.Sheets["MasterSheet_WithPredictive"] ||
    workbook.Sheets[workbook.SheetNames[0]];
  const dataRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet, {
    defval: "",
  });

  const yearlyMap = new Map<number, GdpCountryRow[]>();

  dataRows.forEach((row) => {
    const country = String(row["Country"] || "").trim();
    const year = Number(row["Year"]);
    if (!country || !Number.isFinite(year)) return;

    const gdp = getNumeric(row["GDP"]);
    const globalPctRaw = getNumeric(row["Global GDP %"]);
    // Column is stored as a decimal fraction (e.g. 0.268), convert to %
    const globalPct = globalPctRaw > 1 ? globalPctRaw : globalPctRaw * 100;
    const iso = ISO_MAP[country.toUpperCase()] || "";

    if (!yearlyMap.has(year)) yearlyMap.set(year, []);
    yearlyMap.get(year)!.push({ country, iso, gdp, globalPct });
  });

  // Sort each year by GDP descending
  yearlyMap.forEach((rows, year) => {
    yearlyMap.set(year, rows.sort((a, b) => b.gdp - a.gdp));
  });

  const years = Array.from(yearlyMap.keys()).sort((a, b) => a - b);
  const gdpByYear: Record<string, GdpCountryRow[]> = {};
  years.forEach((y) => {
    gdpByYear[String(y)] = yearlyMap.get(y) || [];
  });

  cachedGdpByYear = { years, gdpByYear };
  return cachedGdpByYear;
}
