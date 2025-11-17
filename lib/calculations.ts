import { AFFORDABILITY_GRADES } from './types';

/**
 * Calculate Adjusted PCI
 * APCI = PCI * (1 - Inflation)
 * Inflation is stored as decimal (0.0235 = 2.35%)
 */
export function calculateAdjustedPCI(pci: number, inflation: number): number {
  return pci * (1 - inflation);
}

/**
 * Calculate Country Interest Payment
 * Interest Payment = Interest Rate × Country Total Debt
 */
export function calculateInterestPayment(interestRate: number, totalDebt: number): number {
  return (interestRate / 100) * totalDebt;
}

/**
 * Calculate Adjusted Debt to GDP
 * Adjusted Debt to GDP = (Country's Debt + Interest Payment) / GDP
 */
export function calculateAdjustedDebtToGDP(
  debt: number,
  interestPayment: number,
  gdp: number
): number {
  return ((debt + interestPayment) / gdp) * 100;
}

/**
 * Calculate Adjusted HDI
 * AHDI = HDI - GINI
 */
export function calculateAdjustedHDI(hdi: number, gini: number): number {
  return hdi - gini;
}

/**
 * Calculate Heart Affordability Value
 * HAV = Adjusted_PCI × Adjusted_HDI
 */
export function calculateHeartAffordabilityValue(adjustedPCI: number, adjustedHDI: number): number {
  return adjustedPCI * adjustedHDI;
}

/**
 * Map Heart Affordability Value to letter grade
 */
export function getAffordabilityGrade(hav: number): string {
  // Find the appropriate grade based on HAV value
  for (const grade of AFFORDABILITY_GRADES) {
    if (hav >= grade.min && hav < grade.max) {
      return grade.grade;
    }
  }
  // Handle edge case for maximum value
  if (hav >= 100000) {
    return 'A+';
  }
  return 'D-';
}

/**
 * Calculate Heart Value (HV) - Raw calculation
 * HV_raw = H%GDP + Health%GDP + Energy%GDP + Education%GDP + Global_GDP_Share − Interest_Payments%GDP + Trade%GDP
 */
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

/**
 * Normalize Heart Value to 0-1 scale using min-max normalization
 */
export function normalizeHeartValue(rawHV: number, minHV: number, maxHV: number): number {
  if (maxHV === minHV) return 0.5; // Handle edge case
  return (rawHV - minHV) / (maxHV - minHV);
}

/**
 * Format currency to readable string
 * Handles negative values correctly
 */
export function formatCurrency(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1e12) {
    return `${sign}$${(absValue / 1e12).toFixed(2)}T`;
  } else if (absValue >= 1e9) {
    return `${sign}$${(absValue / 1e9).toFixed(2)}B`;
  } else if (absValue >= 1e6) {
    return `${sign}$${(absValue / 1e6).toFixed(2)}M`;
  } else if (absValue >= 1e3) {
    return `${sign}$${(absValue / 1e3).toFixed(2)}K`;
  }
  return `${sign}$${absValue.toFixed(2)}`;
}

/**
 * Format percentage
 * Handles both decimal format (0.0235) and percentage format (2.35)
 * Excel stores as decimals, so we multiply by 100
 */
export function formatPercent(value: number, isAlreadyPercent: boolean = false): string {
  const percentValue = isAlreadyPercent ? value : value * 100;
  return `${percentValue.toFixed(2)}%`;
}

/**
 * Format large numbers
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

/**
 * Format large numbers with M/B suffixes (for Housing Units, etc.)
 */
export function formatLargeNumber(value: number): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(0)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(0)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(0)}K`;
  }
  return value.toLocaleString('en-US');
}

