import type { AYKey } from './config';

export type { AYKey };

export type TaxpayerCategory =
  | 'general'
  | 'female'
  | 'senior'
  | 'disabled'
  | 'freedomFighter'
  | 'thirdGender';

export type ResidenceArea = 'dhakaCTG' | 'otherCity' | 'pourashava' | 'other';

export type EmployerType = 'govt' | 'private' | 'selfEmployed' | 'retired';

export type TaxpayerType = 'resident' | 'nrb';

export type CapitalAssetType =
  | 'landBuilding'
  | 'listedShares'
  | 'nonListedShares'
  | 'mutualFund'
  | 'other';

export type LoanType = 'housing' | 'business' | 'car' | 'personal' | 'education';

export type GiftRelationship = 'spouse' | 'parent' | 'child' | 'sibling' | 'other';

// ─── Salary ──────────────────────────────────────────────────────────────────

export interface SalaryInputGovt {
  basic: number;
  da: number;
  hraReceived: number;
  residingInGovtQuarter: boolean;
  medical: number;
  conveyance: number;
  travelAllowance: number;
  entertainmentAllowance: number;
  uniformAllowance: number;
  festivalBonusCount: number; // actual amount received in BDT
  gpfContributionEmployer: number;
  ownGpfContribution: number;
  pensionCommuted: number;
  pensionUncommuted: number;
  gratuity: number;
  leaveEncashment: number;
  honorarium: number;
  banglaNewYearAllowance: number;
  otherAllowances: number;
}

export interface SalaryInputPrivate {
  basic: number;
  hraReceived: number;
  medical: number;
  conveyance: number;
  festivalBonusCount: number;
  employerPF: number;
  ownPFContribution: number;
  wppf: number;
  profitShare: number;
  performanceBonus: number;
  overtime: number;
  otherAllowances: number;
  gratuity: number;
  leaveEncashment: number;
}

// ─── Other income heads ───────────────────────────────────────────────────────

export interface SecuritiesInput {
  bankFdrInterest: number;
  sanchayapatraInterest: number;
  listedDividend: number;
  nonListedDividend: number;
  mutualFundDividend: number;
  govtSecuritiesInterest: number;
}

export interface HousePropertyInput {
  annualValue: number;
  municipalTax: number;
  mortgageInterest: number; // auto-linked from loans
  landRevenue: number;
  insurance: number;
  vacancyMonths: number;
}

export interface AgricultureInput {
  grossIncome: number;
  cultivationCost: number;
}

export interface BusinessInput {
  netProfit: number;
  businessLoanInterest: number; // auto-linked from loans
}

export interface CapitalGainEntry {
  id: string;
  assetType: CapitalAssetType;
  acquisitionDate: string; // ISO date
  saleDate: string; // ISO date
  acquisitionCost: number;
  salePrice: number;
  description?: string;
}

export interface OtherIncomeInput {
  lottery: number;
  cashGifts: number;
  nonCashGiftValue: number;
  machineryLease: number;
  foreignRemittanceTaxable: number; // only non-banking-channel remittance
  others: number;
}

export interface LoanEntry {
  id: string;
  loanType: LoanType;
  lenderName: string;
  outstandingPrincipal: number;
  interestPaidThisYear: number;
}

export interface InvestmentInput {
  lifeInsurance: number;
  ownPFOrGPF: number;
  sanchayapatra: number;
  dps: number;
  listedShares: number;
  mutualFund: number;
  treasuryBond: number;
  wageEarnerBond: number;
  ups: number;
  zakat: number;
  charity: number;
}

export interface TDSCreditsInput {
  salary: number;
  bankInterest: number;
  sanchayapatraInterest: number;
  houseRent: number;
  professional: number;
  dividend: number;
  other: number;
  vehicleAIT: number;
}

// ─── Primary Engine Input ──────────────────────────────────────────────────────

export interface TaxEngineInput {
  ayKey: AYKey;
  taxpayerType: TaxpayerType;
  taxpayerCategory: TaxpayerCategory;
  hasDisabledDependent: boolean;
  residenceArea: ResidenceArea;
  netWealth: number;
  employerType: EmployerType;
  dateOfBirth: string; // ISO date

  salaryGovt: SalaryInputGovt;
  salaryPrivate: SalaryInputPrivate;
  securities: SecuritiesInput;
  houseProperty: HousePropertyInput;
  agriculture: AgricultureInput;
  business: BusinessInput;
  capitalGains: CapitalGainEntry[];
  priorYearCapitalLoss: number;
  otherIncome: OtherIncomeInput;
  loans: LoanEntry[];

  investments: InvestmentInput;
  tdsCredits: TDSCreditsInput;
  advanceTax: number;
}

// ─── Engine Output ────────────────────────────────────────────────────────────

export interface SlabBreakdownRow {
  slabLabel: string;
  incomeInSlab: number;
  rate: number;
  tax: number;
}

export interface CapitalGainResult {
  id: string;
  holdingYears: number;
  isLongTerm: boolean;
  gain: number;
  exemption: number;
  taxableGain: number;
  taxRate: number;
  tax: number;
}

export interface InvestmentAdvisorMetrics {
  maxEligibleInvestment: number;
  currentTotalInvestment: number;
  currentEligibleInvestment: number;
  investmentGap: number;
  currentRebate: number;
  maxPossibleRebate: number;
  additionalSavingIfGapFilled: number;
  isMaximised: boolean;
}

export interface TaxEngineOutput {
  incomeByHead: {
    salary: number;
    securities: number;
    houseProperty: number;
    agriculture: number;
    business: number;
    capitalGains: number;
    otherSources: number;
  };
  totalGrossIncome: number;
  totalTaxableIncome: number;
  taxFreeThreshold: number;
  netTaxableIncome: number;

  slabBreakdown: SlabBreakdownRow[];
  grossTax: number;

  totalInvestments: number;
  eligibleInvestment: number;
  investmentRebate: number;
  advisorMetrics: InvestmentAdvisorMetrics;

  netTaxAfterRebate: number;
  minimumTax: number;
  finalTax: number;
  surcharge: number;
  totalTaxPlusSurcharge: number;

  tdsTotal: number;
  advanceTax: number;
  netTaxPayable: number;
  isRefundable: boolean;

  capitalGainResults: CapitalGainResult[];
  netCapitalGain: number;
  capitalLossCarryForward: number;

  isLateFilingApplicable: boolean;
  filingDeadline: string;

  // Salary detail for transparency
  salaryGrossTotal: number;
  salaryTotalExemption: number;
  salaryStandardDeduction: number;
}
