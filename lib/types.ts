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
