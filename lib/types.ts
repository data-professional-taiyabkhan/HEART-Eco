export interface CountryData {
  // Basic Info
  sNo: number;
  country: string;
  
  // GDP Metrics
  globalGDP: number;
  countryGDP: number;
  countryGDPRanking: number;
  countryGDPPercentToGlobal: number;
  
  // Population
  totalGlobalPopulation: number;
  countryPopulation: number;
  countryPopulationToGlobalPercent: number;
  
  // Income & Inflation
  perCapitaIncome: number;
  countryInflation: number;
  adjustedPCI: number; // Calculated: PCI - Inflation
  
  // Debt & Interest
  interestRate: number;
  countryTotalDebt: number;
  countryInterestPayment: number; // Calculated: Interest Rate * Total Debt
  countryAdjustedDebt: number;
  interestPaymentToGDPPercent: number;
  countryAdjustedDebtToGDPPercent: number; // Calculated
  
  // Trade
  totalGlobalTrade: number;
  countryTrade: number;
  countryPercentToGlobalTrade: number;
  tradeContributionToGDPPercent: number;
  tradeBalance: number;
  tradeBalanceToGDPPercent: number;
  
  // Housing
  housingContributionToGDP: number;
  housingContributionToGDPPercent: number;
  countryHousingUnits: number;
  countryHousePerPerson: number;
  
  // Health
  healthContributionToGDP: number;
  healthContributionToGDPPercent: number;
  
  // Energy
  energyContributionToGDP: number;
  energyContributionToGDPPercent: number;
  
  // Education
  educationContributionToGDP: number;
  educationContributionToGDPPercent: number;
  
  // HEART Scores
  heartValue: number; // HV (0-1)
  hdi: number; // HDI (0-1)
  gini: number; // GINI (0-1)
  adjustedHDI: number; // Calculated: HDI × GINI
  heartAffordabilityValue: number; // HAV: APCI × AHDI
  heartAffordabilityRanking: string; // HAR: Letter grade
  heartScore: string; // HV + HAR (e.g., "0.76C")
  heartScoreDescription?: string;
}

export interface GlobalMetrics {
  globalGDP: number;
  totalGlobalPopulation: number;
  totalGlobalTrade: number;
}

export interface AffordabilityGrade {
  grade: string;
  min: number;
  max: number;
  description: string;
}

export const AFFORDABILITY_GRADES: AffordabilityGrade[] = [
  { grade: 'A+', min: 50001, max: 100000, description: 'Superb' },
  { grade: 'A', min: 40001, max: 50000, description: 'Excellent' },
  { grade: 'A-', min: 35001, max: 40000, description: 'High' },
  { grade: 'B+', min: 30001, max: 35000, description: 'Very Good' },
  { grade: 'B', min: 25001, max: 30000, description: 'Good' },
  { grade: 'B-', min: 20001, max: 25000, description: 'Satisfactory' },
  { grade: 'C+', min: 15001, max: 20000, description: 'Moderate' },
  { grade: 'C', min: 12501, max: 15000, description: 'Improved' },
  { grade: 'C-', min: 10001, max: 12500, description: 'Border Line' },
  { grade: 'D+', min: 5001, max: 10000, description: 'Challenging' },
  { grade: 'D', min: 2501, max: 5000, description: 'Poor' },
  { grade: 'D-', min: 0, max: 2500, description: 'Very Weak' },
];

export interface EconomicResilienceGrade {
  min: number;
  max: number;
  description: string;
}

export const HEART_VALUE_RESILIENCE_GRADES: EconomicResilienceGrade[] = [
  { min: 0.70, max: 1.00, description: 'Superb' },
  { min: 0.51, max: 0.69, description: 'Excellent' },
  { min: 0.41, max: 0.50, description: 'Good' },
  { min: 0.31, max: 0.40, description: 'Satisfactory' },
  { min: 0.26, max: 0.30, description: 'Moderate' },
  { min: 0.00, max: 0.25, description: 'Weak' },
];

