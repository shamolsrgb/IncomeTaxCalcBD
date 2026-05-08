import { TAX_CONFIG } from '../config/taxConfig';
import type { AYKey, AYConfig } from '../types/config';
import type { TaxEngineInput, TaxEngineOutput, SlabBreakdownRow } from '../types/tax';
import { computeSalary } from './salaryEngine';
import { computeCapitalGains, slabRateCapitalGains } from './capitalGainsEngine';
import { computeRebate } from './rebateEngine';

function computeSlabs(
  netTaxableIncome: number,
  slabs: { ceiling: number | null; rate: number }[]
): { rows: SlabBreakdownRow[]; grossTax: number } {
  const rows: SlabBreakdownRow[] = [];
  let remaining = netTaxableIncome;
  let grossTax = 0;
  let slabStart = 0;

  for (const slab of slabs) {
    if (remaining <= 0) break;
    const slabSize = slab.ceiling ?? Infinity;
    const incomeInSlab = Math.min(remaining, slabSize);
    const tax = Math.round(incomeInSlab * slab.rate);
    const slabEnd = slab.ceiling
      ? slabStart + slab.ceiling
      : null;
    const label = slab.ceiling
      ? `৳${fmt(slabStart + 1)} – ৳${fmt(slabEnd!)}`
      : `Above ৳${fmt(slabStart)}`;

    rows.push({ slabLabel: label, incomeInSlab, rate: slab.rate, tax });
    grossTax += tax;
    remaining -= incomeInSlab;
    slabStart += slab.ceiling ?? 0;
  }

  return { rows, grossTax };
}

function fmt(n: number): string {
  return n.toLocaleString('en-IN');
}

function computeSurcharge(
  netWealth: number,
  finalTax: number,
  cfg: AYConfig
): number {
  if (netWealth <= cfg.surchargeThreshold) return 0;
  for (const slab of cfg.surchargeSlabs) {
    if (
      netWealth > slab.wealthAbove &&
      (slab.wealthUpTo === null || netWealth <= slab.wealthUpTo)
    ) {
      return Math.round(finalTax * slab.rate);
    }
  }
  return 0;
}

function isLateFilingApplicable(filingDeadline: string): boolean {
  return new Date() > new Date(filingDeadline);
}

export function calculateTax(
  inputs: TaxEngineInput,
  ayKey: AYKey
): TaxEngineOutput {
  const cfg = TAX_CONFIG[ayKey];

  // ── 1. Salary ────────────────────────────────────────────────────────────────
  const salaryResult = computeSalary(
    inputs.employerType,
    inputs.salaryGovt,
    inputs.salaryPrivate,
    cfg
  );

  // Auto-route loan interest
  const housingLoanInterest = inputs.loans
    .filter((l) => l.loanType === 'housing')
    .reduce((acc, l) => acc + l.interestPaidThisYear, 0);
  const businessLoanInterest = inputs.loans
    .filter((l) => l.loanType === 'business' || l.loanType === 'car')
    .reduce((acc, l) => acc + l.interestPaidThisYear, 0);

  // Merge auto-routed interest into inputs (non-mutating)
  const hp = {
    ...inputs.houseProperty,
    mortgageInterest:
      inputs.houseProperty.mortgageInterest + housingLoanInterest,
  };
  const biz = {
    ...inputs.business,
    businessLoanInterest:
      inputs.business.businessLoanInterest + businessLoanInterest,
  };

  // ── 2. Securities ────────────────────────────────────────────────────────────
  const listedDivTaxable = Math.max(
    0,
    inputs.securities.listedDividend - cfg.listedDividendExemption
  );
  const mfDivTaxable = Math.max(
    0,
    inputs.securities.mutualFundDividend - cfg.mutualFundDividendExemption
  );
  const securitiesIncome =
    inputs.securities.bankFdrInterest +
    inputs.securities.sanchayapatraInterest +
    listedDivTaxable +
    inputs.securities.nonListedDividend +
    mfDivTaxable +
    inputs.securities.govtSecuritiesInterest;

  // ── 3. House Property ────────────────────────────────────────────────────────
  const annualValue = inputs.houseProperty.annualValue;
  const vacancyAdjustedValue =
    annualValue * (1 - inputs.houseProperty.vacancyMonths / 12);
  const repairDeduction = cfg.housePropertyRepairPercent * vacancyAdjustedValue;
  const housePropertyIncome = Math.max(
    0,
    vacancyAdjustedValue -
      repairDeduction -
      hp.mortgageInterest -
      inputs.houseProperty.municipalTax -
      inputs.houseProperty.landRevenue -
      inputs.houseProperty.insurance
  );

  // ── 4. Agriculture ───────────────────────────────────────────────────────────
  const agriNet = Math.max(
    0,
    inputs.agriculture.grossIncome - inputs.agriculture.cultivationCost
  );
  const agricultureIncome = Math.max(0, agriNet - cfg.agriculturalExemption);

  // ── 5. Business ──────────────────────────────────────────────────────────────
  const businessIncome = Math.max(
    0,
    biz.netProfit - biz.businessLoanInterest
  );

  // ── 6. Capital Gains ─────────────────────────────────────────────────────────
  const cgResult = computeCapitalGains(
    inputs.capitalGains,
    inputs.priorYearCapitalLoss,
    cfg
  );
  const slabCG = slabRateCapitalGains(cgResult.results);
  // Flat-rate capital gains (listed shares, long-term land) tax is already computed in cgResult
  const capitalGainsIncome = slabCG; // only slab-rate portion flows into regular income

  // ── 7. Other Income ──────────────────────────────────────────────────────────
  const giftTaxable = Math.max(
    0,
    inputs.otherIncome.cashGifts - cfg.giftExemptionThreshold
  );
  const otherSourcesIncome =
    inputs.otherIncome.lottery +
    giftTaxable +
    inputs.otherIncome.nonCashGiftValue +
    inputs.otherIncome.machineryLease +
    inputs.otherIncome.foreignRemittanceTaxable +
    inputs.otherIncome.others;

  // ── 8. Total Taxable Income ───────────────────────────────────────────────────
  const incomeByHead = {
    salary: salaryResult.taxableIncome,
    securities: securitiesIncome,
    houseProperty: housePropertyIncome,
    agriculture: agricultureIncome,
    business: businessIncome,
    capitalGains: capitalGainsIncome,
    otherSources: otherSourcesIncome,
  };

  const totalTaxableIncome = Object.values(incomeByHead).reduce((a, b) => a + b, 0);

  // ── 9. Tax-Free Threshold ─────────────────────────────────────────────────────
  // NRB: no TFT — full income is taxable at flat rate
  const taxFreeThreshold =
    inputs.taxpayerType === 'nrb'
      ? 0
      : cfg.thresholds[inputs.taxpayerCategory] +
        (inputs.hasDisabledDependent ? cfg.thresholds.disabledDependentExtra : 0);

  const netTaxableIncome = Math.max(0, totalTaxableIncome - taxFreeThreshold);

  // ── 10. Gross Tax ──────────────────────────────────────────────────────────────
  let grossTax = 0;
  let slabBreakdown: SlabBreakdownRow[] = [];

  if (inputs.taxpayerType === 'nrb') {
    grossTax = Math.round(totalTaxableIncome * cfg.nrbFlatRate);
    slabBreakdown = [
      {
        slabLabel: 'NRB Flat Rate (30%)',
        incomeInSlab: totalTaxableIncome,
        rate: cfg.nrbFlatRate,
        tax: grossTax,
      },
    ];
  } else {
    const slabResult = computeSlabs(netTaxableIncome, cfg.slabs);
    grossTax = slabResult.grossTax + cgResult.totalCapitalGainsTax;
    slabBreakdown = slabResult.rows;
  }

  // ── 11. Investment Rebate ──────────────────────────────────────────────────────
  // Merge own PF from salary into investments
  const mergedInvestments = {
    ...inputs.investments,
    ownPFOrGPF: inputs.investments.ownPFOrGPF + salaryResult.ownPFForRebate,
  };

  const rebate =
    inputs.taxpayerType === 'nrb'
      ? { totalInvestments: 0, eligibleInvestment: 0, investmentRebate: 0, advisorMetrics: {
          maxEligibleInvestment: 0, currentTotalInvestment: 0, currentEligibleInvestment: 0,
          investmentGap: 0, currentRebate: 0, maxPossibleRebate: 0,
          additionalSavingIfGapFilled: 0, isMaximised: true,
        } }
      : computeRebate(mergedInvestments, totalTaxableIncome, grossTax, cfg);

  const netTaxAfterRebate = Math.max(0, grossTax - rebate.investmentRebate);

  // ── 12. Minimum Tax ────────────────────────────────────────────────────────────
  const minimumTax = cfg.minimumTax[inputs.residenceArea];
  const finalTax = Math.max(netTaxAfterRebate, minimumTax);

  // ── 13. Surcharge ──────────────────────────────────────────────────────────────
  const surcharge = computeSurcharge(inputs.netWealth, finalTax, cfg);
  const totalTaxPlusSurcharge = finalTax + surcharge;

  // ── 14. TDS & Advance Tax Credits ────────────────────────────────────────────
  const tds = inputs.tdsCredits;
  // Auto-compute bank interest TDS and sanchayapatra TDS at 10%
  const autoBankTDS = Math.round(inputs.securities.bankFdrInterest * 0.10);
  const autoSanchTDS = Math.round(inputs.securities.sanchayapatraInterest * 0.10);
  const tdsTotal =
    tds.salary +
    Math.max(tds.bankInterest, autoBankTDS) +
    Math.max(tds.sanchayapatraInterest, autoSanchTDS) +
    tds.houseRent +
    tds.professional +
    tds.dividend +
    tds.other +
    (tds.vehicleAIT ?? 0);

  const netTaxPayable = totalTaxPlusSurcharge - tdsTotal - inputs.advanceTax;

  return {
    incomeByHead,
    totalGrossIncome: totalTaxableIncome,
    totalTaxableIncome,
    taxFreeThreshold,
    netTaxableIncome,

    slabBreakdown,
    grossTax,

    totalInvestments: rebate.totalInvestments,
    eligibleInvestment: rebate.eligibleInvestment,
    investmentRebate: rebate.investmentRebate,
    advisorMetrics: rebate.advisorMetrics,

    netTaxAfterRebate,
    minimumTax,
    finalTax,
    surcharge,
    totalTaxPlusSurcharge,

    tdsTotal,
    advanceTax: inputs.advanceTax,
    netTaxPayable,
    isRefundable: netTaxPayable < 0,

    capitalGainResults: cgResult.results,
    netCapitalGain: cgResult.netCapitalGain,
    capitalLossCarryForward: cgResult.capitalLossCarryForward,

    isLateFilingApplicable: isLateFilingApplicable(cfg.filingDeadline),
    filingDeadline: cfg.filingDeadline,

    salaryGrossTotal: salaryResult.grossTotal,
    salaryTotalExemption: salaryResult.totalExemption,
    salaryStandardDeduction: salaryResult.standardDeduction,
  };
}

// Default empty inputs for initialising the store
export function defaultInputs(): TaxEngineInput {
  return {
    ayKey: '2025-26',
    taxpayerType: 'resident',
    taxpayerCategory: 'general',
    hasDisabledDependent: false,
    residenceArea: 'dhakaCTG',
    netWealth: 0,
    employerType: 'private',
    dateOfBirth: '',

    salaryGovt: {
      basic: 0, da: 0, hraReceived: 0, residingInGovtQuarter: false,
      medical: 0, conveyance: 0, travelAllowance: 0, entertainmentAllowance: 0,
      uniformAllowance: 0, festivalBonusCount: 0, gpfContributionEmployer: 0,
      ownGpfContribution: 0, pensionCommuted: 0, pensionUncommuted: 0,
      gratuity: 0, leaveEncashment: 0, honorarium: 0, banglaNewYearAllowance: 0, otherAllowances: 0,
    },
    salaryPrivate: {
      basic: 0, hraReceived: 0, medical: 0, conveyance: 0,
      festivalBonusCount: 0, employerPF: 0, ownPFContribution: 0,
      wppf: 0, profitShare: 0, performanceBonus: 0, overtime: 0,
      otherAllowances: 0, gratuity: 0, leaveEncashment: 0,
    },
    securities: {
      bankFdrInterest: 0, sanchayapatraInterest: 0, listedDividend: 0,
      nonListedDividend: 0, mutualFundDividend: 0, govtSecuritiesInterest: 0,
    },
    houseProperty: {
      annualValue: 0, municipalTax: 0, mortgageInterest: 0,
      landRevenue: 0, insurance: 0, vacancyMonths: 0,
    },
    agriculture: { grossIncome: 0, cultivationCost: 0 },
    business: { netProfit: 0, businessLoanInterest: 0 },
    capitalGains: [],
    priorYearCapitalLoss: 0,
    otherIncome: {
      lottery: 0, cashGifts: 0, nonCashGiftValue: 0,
      machineryLease: 0, foreignRemittanceTaxable: 0, others: 0,
    },
    loans: [],
    investments: {
      lifeInsurance: 0, ownPFOrGPF: 0, sanchayapatra: 0, dps: 0,
      listedShares: 0, mutualFund: 0, treasuryBond: 0, wageEarnerBond: 0,
      ups: 0, zakat: 0, charity: 0,
    },
    tdsCredits: {
      salary: 0, bankInterest: 0, sanchayapatraInterest: 0,
      houseRent: 0, professional: 0, dividend: 0, other: 0, vehicleAIT: 0,
    },
    advanceTax: 0,
  };
}
