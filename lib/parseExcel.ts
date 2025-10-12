import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { CountryData, GlobalMetrics } from './types';
import {
  calculateAdjustedPCI,
  calculateInterestPayment,
  calculateAdjustedDebtToGDP,
  calculateAdjustedHDI,
  calculateHeartAffordabilityValue,
  getAffordabilityGrade,
  calculateHeartValueRaw,
  normalizeHeartValue,
} from './calculations';

let cachedData: CountryData[] | null = null;

/**
 * Parse the Excel file and return all country data
 */
export function parseExcelData(): CountryData[] {
  if (cachedData) {
    return cachedData;
  }

  const filePath = path.join(process.cwd(), 'data', 'HEART_Model_khurshidOGcleaned.xlsx');
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Excel file not found at ${filePath}`);
  }

  // Read file as buffer first to handle paths with spaces
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawData: any[] = XLSX.utils.sheet_to_json(worksheet);

  // Filter out WORLD row and parse actual countries
  const filteredData = rawData.filter((row: any) => row['COUNTRY'] && row['COUNTRY'] !== 'WORLD');
  
  // First pass: Parse basic data and calculate derived metrics
  const countries: CountryData[] = filteredData.map((row: any) => {
    const pci = parseFloat(row['Per Capita income(PCI)'] || 0);
    const inflation = parseFloat(row['Country inflation ( %)'] || 0);
    const interestRate = parseFloat(row['Intrest Rate ( %)'] || 0);
    const totalDebt = parseFloat(row['  Country Total Debt (in USD)'] || 0);
    const gdp = parseFloat(row[' Country GDP (in USD)'] || 0);
    const hdi = parseFloat(row['HDI(Range: 0-1)'] || 0);
    const gini = parseFloat(row['GINI (Range: 0-1)'] || 0);

    // Calculations
    const adjustedPCI = calculateAdjustedPCI(pci, inflation);
    const interestPayment = calculateInterestPayment(interestRate, totalDebt);
    const adjustedHDI = calculateAdjustedHDI(hdi, gini);
    const heartAffordabilityValue = calculateHeartAffordabilityValue(adjustedPCI, adjustedHDI);
    const heartAffordabilityRanking = getAffordabilityGrade(heartAffordabilityValue);
    
    const adjustedDebtToGDPPercent = calculateAdjustedDebtToGDP(totalDebt, interestPayment, gdp);

    // Get global metrics from first row of raw data (WORLD row)
    const globalGDP = parseFloat(rawData[0][' Global GDP (in USD)'] || 0);
    const totalGlobalPopulation = parseFloat(rawData[0]['Total Global Population'] || 0);
    const totalGlobalTrade = parseFloat(rawData[0]['Total Global Trade (in USD)'] || 0);

    return {
      sNo: parseInt(row['SR NO.'] || 0),
      country: row['COUNTRY'] || '',
      
      globalGDP,
      countryGDP: gdp,
      countryGDPRanking: parseInt(row['Country GDP Global Ranking'] || 0),
      countryGDPPercentToGlobal: parseFloat(row['Country GDP ( %)To Global GDP '] || 0),
      
      totalGlobalPopulation,
      countryPopulation: parseFloat(row['Country population'] || 0),
      countryPopulationToGlobalPercent: parseFloat(row['Country population To global Population ( %)'] || 0),
      
      perCapitaIncome: pci,
      countryInflation: inflation,
      adjustedPCI,
      
      interestRate,
      countryTotalDebt: totalDebt,
      countryInterestPayment: parseFloat(row[' Country Interest Payment (in USD)'] || interestPayment),
      countryAdjustedDebt: parseFloat(row[' Country Adjusted Debt (in USD)'] || 0),
      interestPaymentToGDPPercent: parseFloat(row['Intrest Payment to Country GDP( %)'] || 0),
      countryAdjustedDebtToGDPPercent: parseFloat(row['Country Adjusted Debt to GDP(%)'] || adjustedDebtToGDPPercent),
      
      totalGlobalTrade,
      countryTrade: parseFloat(row[' Country Trade (in USD)'] || 0),
      countryPercentToGlobalTrade: parseFloat(row['Country % to  global trade'] || 0),
      tradeContributionToGDPPercent: parseFloat(row['Trade Contribution to GDP ( %)'] || 0),
      tradeBalance: parseFloat(row[' Trade Balance (in USD; + - )'] || 0),
      tradeBalanceToGDPPercent: parseFloat(row['Trade balnce to GDP ( %)'] || 0),
      
      housingContributionToGDP: parseFloat(row[' Housing Contribution to GDP (in USD)'] || 0),
      housingContributionToGDPPercent: parseFloat(row['Housing Contribution to GDP ( %)'] || 0),
      countryHousingUnits: parseFloat(row['Country Housing Units'] || 0),
      countryHousePerPerson: parseFloat(row['Country House per Person '] || 0),
      
      healthContributionToGDP: parseFloat(row[' Health Contribution to GDP'] || 0),
      healthContributionToGDPPercent: parseFloat(row['Health Contribution to GDP ( %)'] || 0),
      
      energyContributionToGDP: parseFloat(row[' Energy Contribution To GDP'] || 0),
      energyContributionToGDPPercent: parseFloat(row['Energy Contribution To GDP  ( %)'] || 0),
      
      educationContributionToGDP: parseFloat(row[' Education Contribution To GDP'] || 0),
      educationContributionToGDPPercent: parseFloat(row['Education Contribution To GDP ( %)'] || 0),
      
      heartValue: parseFloat(row['Heart Value (HV--Range; 0-1)'] || 0),
      hdi,
      gini,
      adjustedHDI: parseFloat(row['Adjusted HDI (AHDI) == HDI-GINI'] || adjustedHDI),
      heartAffordabilityValue: parseFloat(row['HEART Affordability Value (APCI*AHDI)'] || heartAffordabilityValue),
      heartAffordabilityRanking: row['Heart  AFFORDABILITY RANKING (HAR)'] || heartAffordabilityRanking,
      heartScore: row['HEART SCORE (HV&HAR)'] || `${parseFloat(row['Heart Value (HV--Range; 0-1)'] || 0).toFixed(2)}${heartAffordabilityRanking}`,
      heartScoreDescription: row['Brief Description of HEART Scores'] || '',
    };
  });

  // Second pass: Calculate normalized Heart Values if needed
  // (The Excel might already have normalized values, but we can recalculate if needed)
  
  cachedData = countries;
  return countries;
}

/**
 * Get global metrics (calculated from first country row as they're the same for all)
 */
export function getGlobalMetrics(): GlobalMetrics {
  const countries = parseExcelData();
  if (countries.length === 0) {
    return {
      globalGDP: 0,
      totalGlobalPopulation: 0,
      totalGlobalTrade: 0,
    };
  }

  return {
    globalGDP: countries[0].globalGDP,
    totalGlobalPopulation: countries[0].totalGlobalPopulation,
    totalGlobalTrade: countries[0].totalGlobalTrade,
  };
}

/**
 * Get a specific country's data
 */
export function getCountryData(countryName: string): CountryData | undefined {
  const countries = parseExcelData();
  return countries.find(c => c.country.toLowerCase() === countryName.toLowerCase());
}

/**
 * Get all country names
 */
export function getCountryNames(): string[] {
  const countries = parseExcelData();
  return countries.map(c => c.country).sort();
}

