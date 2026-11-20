// HEART model formulas and grade bands. CONFIDENTIAL — server-only.
// Importing this file from a browser ("use client") component fails the build,
// so the formulas never ship to visitors. The calculator page calls
// /api/calculate instead. Display helpers live in lib/format.ts.
import "server-only";

interface AffordabilityGrade {
  grade: string;
  min: number;
  max: number;
  description: string;
}

const AFFORDABILITY_GRADES: AffordabilityGrade[] = [
  { grade: "A+", min: 50001, max: 100000, description: "Superb" },
  { grade: "A", min: 40001, max: 50000, description: "Excellent" },
  { grade: "A-", min: 35001, max: 40000, description: "High" },
  { grade: "B+", min: 30001, max: 35000, description: "Very Good" },
  { grade: "B", min: 25001, max: 30000, description: "Good" },
  { grade: "B-", min: 20001, max: 25000, description: "Satisfactory" },
  { grade: "C+", min: 15001, max: 20000, description: "Moderate" },
  { grade: "C", min: 12501, max: 15000, description: "Improved" },
  { grade: "C-", min: 10001, max: 12500, description: "Border Line" },
  { grade: "D+", min: 5001, max: 10000, description: "Challenging" },
  { grade: "D", min: 2501, max: 5000, description: "Poor" },
  { grade: "D-", min: 0, max: 2500, description: "Very Weak" },
];

/** Inflation as a decimal (0.0235 = 2.35%). */
export function calculateAdjustedPCI(pci: number, inflation: number): number {
  return pci * (1 - inflation);
}

export function calculateInterestPayment(interestRate: number, totalDebt: number): number {
  return (interestRate / 100) * totalDebt;
}

export function calculateAdjustedDebtToGDP(debt: number, interestPayment: number, gdp: number): number {
  return ((debt + interestPayment) / gdp) * 100;
}

export function calculateAdjustedHDI(hdi: number, gini: number): number {
  return hdi - gini;
}

export function calculateHeartAffordabilityValue(adjustedPCI: number, adjustedHDI: number): number {
  return adjustedPCI * adjustedHDI;
}

export function getAffordabilityGrade(hav: number): string {
  for (const grade of AFFORDABILITY_GRADES) {
    if (hav >= grade.min && hav < grade.max) {
      return grade.grade;
    }
  }
  if (hav >= 100000) return "A+";
  return "D-";
}

export function calculateHeartValueRaw(
  housingPercent: number,
  healthPercent: number,
  energyPercent: number,
  educationPercent: number,
  globalGDPShare: number,
  interestPaymentPercent: number,
  tradePercent: number
): number {
  return (
    housingPercent +
    healthPercent +
    energyPercent +
    educationPercent +
    globalGDPShare -
    interestPaymentPercent +
    tradePercent
  );
}

export function normalizeHeartValue(rawHV: number, minHV: number, maxHV: number): number {
  if (maxHV === minHV) return 0.5;
  return (rawHV - minHV) / (maxHV - minHV);
}

export interface HeartScoreInputs {
  housing: number; // % of GDP
  health: number; // % of GDP
  energy: number; // % of GDP
  education: number; // % of GDP
  globalShare: number; // %
  interest: number; // % of GDP
  trade: number; // % of GDP, negative for deficit
  pci: number; // USD
  inflation: number; // %
  hdi: number; // 0-1
  gini: number; // 0-1
}

export interface HeartScoreResult {
  heartScore: string;
  heartValue: number;
  har: string;
  note: "exceeds" | "worst" | null;
}

/** Calculator entry point: returns only the final score, HV and grade. */
export function computeHeartScore(i: HeartScoreInputs): HeartScoreResult {
  const rawHV = calculateHeartValueRaw(i.housing, i.health, i.energy, i.education, i.globalShare, i.interest, i.trade);
  const heartValue = Math.max(0, Math.min(1, rawHV / 100));
  const hav = calculateHeartAffordabilityValue(
    calculateAdjustedPCI(i.pci, i.inflation / 100),
    calculateAdjustedHDI(i.hdi, i.gini)
  );
  const har = getAffordabilityGrade(hav);
  return {
    heartScore: `${heartValue.toFixed(2)}${har}`,
    heartValue,
    har,
    note: rawHV > 100 ? "exceeds" : rawHV < 0 ? "worst" : null,
  };
}

export { formatCurrency, formatPercent, formatNumber, formatLargeNumber } from "./format";
