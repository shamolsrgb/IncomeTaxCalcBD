export interface TaxSlab {
  ceiling: number | null; // null = unlimited (final slab)
  rate: number;
}

export interface TaxFreeThresholds {
  general: number;
  female: number;
  senior: number;
  disabled: number;
  freedomFighter: number;
  thirdGender: number;
  disabledDependentExtra: number;
}

export interface MinimumTaxByLocation {
  dhakaCTG: number;
  otherCity: number;
  pourashava: number;
  other: number;
}

export interface SurchargeSlab {
  wealthAbove: number;
  wealthUpTo: number | null;
  rate: number;
}

export interface HRAConfig {
  monthlyCapBDT: number;
  yearlyCapBDT: number;
  basicPercent: number;
}

export interface AYConfig {
  label: string;
  incomePeriod: string;
  filingDeadline: string; // ISO date
  thresholds: TaxFreeThresholds;
  slabs: TaxSlab[];
  rebateRate: number;
  rebateInvestmentCap: number;
  rebateIncomePercent: number;
  minimumTax: MinimumTaxByLocation;
  surchargeThreshold: number;
  surchargeSlabs: SurchargeSlab[];
  nrbFlatRate: number;
  hra: HRAConfig;
  medicalAllowanceCap: number;
  conveyanceAllowanceCap: number;
  employerPFExemptCap: number;
  employerPFExemptPercent: number;
  gratuityExemptCap: number;
  wppfExemptCap: number;
  dpsCap: number;
  standardDeductionCap: number;
  standardDeductionPercent: number;
  agriculturalExemption: number;
  listedDividendExemption: number;
  mutualFundDividendExemption: number;
  capitalGainsListedSharesExemption: number;
  capitalGainsListedSharesRate: number;
  capitalGainsLongTermRate: number;
  capitalGainsLongTermHoldingYears: number;
  giftExemptionThreshold: number;
  housePropertyRepairPercent: number;
}

export type AYKey = '2023-24' | '2024-25' | '2025-26';

export type TAXConfigMap = Record<AYKey, AYConfig>;
