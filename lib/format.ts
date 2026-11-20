// Display formatting only. Safe to use in the browser.
// The HEART model formulas live in lib/calculations.ts, which is server-only.

/** Format currency to a readable string; handles negative values. */
export function formatCurrency(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

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

/** Format a percentage; Excel stores decimals (0.0235), so multiply unless already a percent. */
export function formatPercent(value: number, isAlreadyPercent: boolean = false): string {
  const percentValue = isAlreadyPercent ? value : value * 100;
  return `${percentValue.toFixed(2)}%`;
}

/** Format a number with thousands separators. */
export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

/** Format large counts with K/M/B suffixes (housing units, population, etc.). */
export function formatLargeNumber(value: number): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `${Math.round(value / 1e6)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(0)}K`;
  }
  return value.toLocaleString("en-US");
}
