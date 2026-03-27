import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

export interface CountryYearRow {
    year: number;
    isPredicted: boolean;
    gdp: number;
    gdpGrowthRate: number;
    population: number;
    globalGdpPct: number;
    pci: number;
    adjustedPci: number;
    inflation: number;
    debt: number;
    debtToGdp: number;
    interest: number;
    interestPayment: number;
    interestToGdp: number;
    tradeBalance: number;
    tradeBalanceToGdp: number;
    imports: number;
    exports: number;
    hdi: number;
    gini: number;
    adjustedHdi: number;
    housing: number;
    health: number;
    energy: number;
    education: number;
    heartValue: number;
    heartAffordabilityValue: number;
    affordabilityRanking: string;
    heartScore: string;
    briefDescription: string;
}

export interface CountryTimeSeries {
    country: string;
    iso: string;
    rows: CountryYearRow[];
}

const ISO_MAP: Record<string, string> = {
    ARGENTINA: "ar", AUSTRALIA: "au", BRAZIL: "br", CANADA: "ca",
    CHINA: "cn", FRANCE: "fr", GERMANY: "de", INDIA: "in",
    INDONESIA: "id", ITALY: "it", JAPAN: "jp", MEXICO: "mx",
    NETHERLAND: "nl", NETHERLANDS: "nl", RUSSIA: "ru",
    "SAUDI ARABIA": "sa", "SOUTH AFRICA": "za", "SOUTH KOREA": "kr",
    SPAIN: "es", SWITZERLAND: "ch", TURKEY: "tr",
    "UNITED KINGDOM": "gb", UK: "gb", USA: "us",
};

let cache: Record<string, CountryTimeSeries> | null = null;

function loadAll(): Record<string, CountryTimeSeries> {
    if (cache) return cache;

    const filePath = path.join(
        process.cwd(), "data", "Mastersheet", "MasterSheet_WithPredictive.xlsx"
    );
    if (!fs.existsSync(filePath)) return {};

    const wb = XLSX.read(fs.readFileSync(filePath), { type: "buffer" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const dataRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

    const n = (v: unknown) => {
        const x = Number(v);
        return Number.isFinite(x) ? x : 0;
    };

    const map: Record<string, CountryTimeSeries> = {};

    dataRows.forEach((row) => {
        const country = String(row["Country"] || "").trim();
        const year = Number(row["Year"]);
        if (!country || !Number.isFinite(year)) return;

        if (!map[country]) {
            map[country] = {
                country,
                iso: ISO_MAP[country.toUpperCase()] || "",
                rows: [],
            };
        }

        const globalPctRaw = n(row["Global GDP %"]);
        const globalPct = globalPctRaw > 1 ? globalPctRaw : globalPctRaw * 100;

        map[country].rows.push({
            year,
            isPredicted: year >= 2026,
            gdp: n(row["GDP"]),
            gdpGrowthRate: n(row["GDP_Growth_Rate"]) * 100,
            population: n(row["Country Population"]),
            globalGdpPct: parseFloat(globalPct.toFixed(2)),
            pci: n(row["PCI"]),
            adjustedPci: n(row["Adjusted PCI"]),
            inflation: n(row["Inflation"]) * 100,
            debt: n(row["Debt"]),
            debtToGdp: n(row["Debt to GDP"]) * 100,
            interest: n(row["Interest"]),
            interestPayment: n(row["Interest Payment"]),
            interestToGdp: n(row["Interest Payment to GDP"]) * 100,
            tradeBalance: n(row["Trade Balance"]),
            tradeBalanceToGdp: n(row["Trade Balance to GDP"]) * 100,
            imports: n(row["Import"]),
            exports: n(row["Export"]),
            hdi: n(row["HDI"]),
            gini: n(row["Ginni"]),
            adjustedHdi: n(row["Adjusted HDI"]),
            housing: n(row["Housing"]),
            health: n(row["Health"]),
            energy: n(row["Energy"]),
            education: n(row["Education"]),
            heartValue: n(row["Heart Value"]),
            heartAffordabilityValue: n(row["Heart Affordibility Value"]),
            affordabilityRanking: String(row["Affordbility Ranking"] || ""),
            heartScore: String(row["Heart Score"] || ""),
            briefDescription: String(row["Brief Description of HEART Scores"] || ""),
        });
    });

    // Sort each country's rows by year
    Object.values(map).forEach((c) => c.rows.sort((a, b) => a.year - b.year));

    cache = map;
    return map;
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const country = url.searchParams.get("country");
        const all = loadAll();

        if (country) {
            const data = all[country];
            if (!data) {
                return NextResponse.json({ error: "Country not found" }, { status: 404 });
            }
            return NextResponse.json(data);
        }

        // Return just country names + latest year snapshot for selector
        const summary = Object.keys(all).sort().map((name) => {
            const latest = all[name].rows.find(r => !r.isPredicted) || all[name].rows[0];
            return { country: name, iso: all[name].iso, latestYear: latest?.year, heartScore: latest?.heartScore };
        });
        return NextResponse.json(summary);
    } catch (err: any) {
        console.error("timeseries error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
