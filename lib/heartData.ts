import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";
import mammoth from "mammoth";

// ── Types ──────────────────────────────────────────────

export interface MasterSheetRow {
  key: string;
  country: string;
  year: number;
  globalGDP: number;
  globalPopulation: number;
  countryGDP: number;
  countryPopulation: number;
  perCapitaIncome: number;
  inflation: number;
  adjustedPCI: number;
  interestRate: number;
  totalDebt: number;
  interestPayment: number;
  adjustedDebt: number;
  tradeBalance: number;
  tradeBalanceToGDP: number;
  housingPercent: number;
  healthPercent: number;
  energyPercent: number;
  educationPercent: number;
  hdi: number;
  gini: number;
  adjustedHDI: number;
  heartValue: number;
  heartAffordabilityValue: number;
  heartAffordabilityRanking: string;
  heartScore: string;
  isPredicted: boolean;
  description: string;
  [key: string]: string | number | boolean; // allow dynamic access
}

export interface TweetRow {
  tweet: string;
  link: string;
}

// ── Caches ─────────────────────────────────────────────

let masterSheetCache: MasterSheetRow[] | null = null;
let tweetsCache: TweetRow[] | null = null;
let sourceOfTruthCache: string | null = null;
let khurshidSummaryCache: string | null = null;
let predictionTextCache: Map<string, string> | null = null;

// ── Master Sheet Parser ────────────────────────────────

function num(v: unknown): number {
  if (v === null || v === undefined || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function str(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

export function loadMasterSheet(): MasterSheetRow[] {
  if (masterSheetCache) return masterSheetCache;

  const filePath = path.join(
    process.cwd(),
    "data",
    "Mastersheet",
    "MasterSheet_WithPredictive.xlsx"
  );
  if (!fs.existsSync(filePath))
    throw new Error(`MasterSheet not found: ${filePath}`);

  const buf = fs.readFileSync(filePath);
  const wb = XLSX.read(buf, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const raw: Record<string, unknown>[] = XLSX.utils.sheet_to_json(ws);

  masterSheetCache = raw
    .filter((r) => str(r["Country"]) && str(r["Year"]))
    .map((r) => {
      const year = num(r["Year"]);
      return {
        key: str(r["KEY"]),
        country: str(r["Country"]),
        year,
        globalGDP: num(r["Global GDP"]),
        globalPopulation: num(r["Global Population"]),
        countryGDP: num(r["Country GDP"]),
        countryPopulation: num(r["Country Population"]),
        perCapitaIncome: num(r["Per Capita Income"]) || num(r["Per Capita income"]) || num(r["PCI"]),
        inflation: num(r["Inflation"]) || num(r["Country Inflation"]),
        adjustedPCI: num(r["Adjusted PCI"]) || num(r["APCI"]),
        interestRate: num(r["Interest Rate"]),
        totalDebt: num(r["Total Debt"]) || num(r["Country Total Debt"]),
        interestPayment: num(r["Interest Payment"]) || num(r["Country Interest Payment"]),
        adjustedDebt: num(r["Adjusted Debt"]) || num(r["Country Adjusted Debt"]),
        tradeBalance: num(r["Trade Balance"]),
        tradeBalanceToGDP: num(r["Trade Balance to GDP"]),
        housingPercent: num(r["Housing Contribution to GDP (%)"]) || num(r["Housing %"]),
        healthPercent: num(r["Health Contribution to GDP (%)"]) || num(r["Health %"]),
        energyPercent: num(r["Energy Contribution to GDP (%)"]) || num(r["Energy %"]),
        educationPercent: num(r["Education Contribution to GDP (%)"]) || num(r["Education %"]),
        hdi: num(r["HDI"]),
        gini: num(r["GINI"]) || num(r["Gini"]),
        adjustedHDI: num(r["Adjusted HDI"]) || num(r["AHDI"]),
        heartValue: num(r["Heart Value"]) || num(r["HV"]),
        heartAffordabilityValue: num(r["Heart Affordibility Value"]) || num(r["Heart Affordability Value"]) || num(r["HAV"]),
        heartAffordabilityRanking: str(r["Heart Affordibility Ranking"]) || str(r["Heart Affordability Ranking"]) || str(r["HAR"]),
        heartScore: str(r["Heart Score"]) || str(r["HEART Score"]),
        isPredicted: year >= 2026 || str(r["Is Predicted"]).toLowerCase() === "true",
        description: str(r["Brief Description of HEART Scores"]) || str(r["Description"]) || "",
      };
    });

  return masterSheetCache;
}

// ── Tweets Parser ──────────────────────────────────────

export function loadTweets(): TweetRow[] {
  if (tweetsCache) return tweetsCache;

  const filePath = path.join(process.cwd(), "data", "TweetsByKhurshid.xlsx");
  if (!fs.existsSync(filePath)) return [];

  const buf = fs.readFileSync(filePath);
  const wb = XLSX.read(buf, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const raw: Record<string, unknown>[] = XLSX.utils.sheet_to_json(ws);

  tweetsCache = raw.map((r) => ({
    tweet: str(r["Tweets"]) || str(r["Tweet"]),
    link: str(r["Link"]) || str(r["URL"]) || "",
  }));

  return tweetsCache;
}

// ── Source of Truth (.docx) ────────────────────────────

export async function loadSourceOfTruth(): Promise<string> {
  if (sourceOfTruthCache) return sourceOfTruthCache;

  const filePath = path.join(
    process.cwd(),
    "data",
    "HEART Score Economic Model – SourceofTruth.docx"
  );
  if (!fs.existsSync(filePath)) {
    // Try alternate names
    const alt = path.join(process.cwd(), "data", "HEART Score Economic Model - SourceofTruth.docx");
    if (fs.existsSync(alt)) {
      const result = await mammoth.extractRawText({ path: alt });
      sourceOfTruthCache = result.value;
      return sourceOfTruthCache;
    }
    return "Source of Truth document not found.";
  }

  const result = await mammoth.extractRawText({ path: filePath });
  sourceOfTruthCache = result.value;
  return sourceOfTruthCache;
}

// ── Khurshid HEART Summary (.docx or .pdf) ────────────

export async function loadKhurshidSummary(): Promise<string> {
  if (khurshidSummaryCache) return khurshidSummaryCache;

  // Try docx first
  const docxPath = path.join(process.cwd(), "data", "KHURSHID_HEART SUMMARY.docx");
  if (fs.existsSync(docxPath)) {
    const result = await mammoth.extractRawText({ path: docxPath });
    khurshidSummaryCache = result.value;
    return khurshidSummaryCache;
  }

  // Try PDF - read raw text
  const pdfPath = path.join(process.cwd(), "data", "KHURSHID_HEART SUMMARY.pdf");
  if (fs.existsSync(pdfPath)) {
    // For PDF, we'll provide a note that it exists but can't be parsed without pdf-parse
    khurshidSummaryCache =
      "Khurshid HEART Summary is available as a PDF. It contains comprehensive narrative analysis, " +
      "country-specific explanations, methodology context, and examples of HEART model application by Khurshid Imtiaz Ul Haque.";
    return khurshidSummaryCache;
  }

  return "Khurshid HEART Summary document not found.";
}

// ── Prediction Text (country forecasting .docx files) ──

export async function loadPredictionTexts(): Promise<Map<string, string>> {
  if (predictionTextCache) return predictionTextCache;

  predictionTextCache = new Map();
  const dir = path.join(process.cwd(), "data", "PredictionText");
  if (!fs.existsSync(dir)) return predictionTextCache;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".docx"));

  for (const file of files) {
    try {
      const filePath = path.join(dir, file);
      const result = await mammoth.extractRawText({ path: filePath });

      // Extract country name from filename
      // e.g., "USA_FORECASTING SUMMARY.docx" → "USA"
      // "SOUTH KOREA_FORECASTING SUMMARY.docx" → "SOUTH KOREA"
      // "SAUDI_ARABIA.docx" → "SAUDI ARABIA"
      let country = file
        .replace(/_FORECASTING SUMMARY(\(\d+\))?\.docx$/i, "")
        .replace(/\.docx$/i, "")
        .replace(/_/g, " ")
        .trim()
        .toUpperCase();

      // Normalize known names
      const nameMap: Record<string, string> = {
        "USA": "USA",
        "UK": "United Kingdom",
        "SAUDI ARABIA": "Saudi Arabia",
        "SOUTH KOREA": "South Korea",
        "SOUTH AFRICA": "South Africa",
        "INDIA": "India",
        "CHINA": "China",
        "JAPAN": "Japan",
        "GERMANY": "Germany",
        "FRANCE": "France",
        "BRAZIL": "Brazil",
        "ITALY": "Italy",
        "CANADA": "Canada",
        "AUSTRALIA": "Australia",
        "RUSSIA": "Russia",
        "MEXICO": "Mexico",
        "INDONESIA": "Indonesia",
        "TURKEY": "Turkey",
        "ARGENTINA": "Argentina",
        "SPAIN": "Spain",
        "NETHERLAND": "Netherland",
        "SWITZERLAND": "Switzerland",
      };

      const normalizedCountry = nameMap[country] || country;
      predictionTextCache.set(normalizedCountry, result.value);
    } catch (err) {
      console.warn(`Failed to parse ${file}:`, err);
    }
  }

  return predictionTextCache;
}

// ── Query Helpers ──────────────────────────────────────

export function queryByCountry(country: string): MasterSheetRow[] {
  const data = loadMasterSheet();
  return data.filter(
    (r) => r.country.toLowerCase() === country.toLowerCase()
  );
}

export function queryByYear(year: number): MasterSheetRow[] {
  const data = loadMasterSheet();
  return data.filter((r) => r.year === year);
}

export function queryByCountryAndYear(
  country: string,
  year: number
): MasterSheetRow | undefined {
  const data = loadMasterSheet();
  return data.find(
    (r) =>
      r.country.toLowerCase() === country.toLowerCase() && r.year === year
  );
}

export function getAvailableCountries(): string[] {
  const data = loadMasterSheet();
  return [...new Set(data.map((r) => r.country))].sort();
}

export function getAvailableYears(): number[] {
  const data = loadMasterSheet();
  return [...new Set(data.map((r) => r.year))].sort((a, b) => a - b);
}
