import type { AYConfig } from '../types/config';
import type { InvestmentInput, InvestmentAdvisorMetrics } from '../types/tax';

export interface RebateResult {
  totalInvestments: number;
  eligibleInvestment: number;
  investmentRebate: number;
  advisorMetrics: InvestmentAdvisorMetrics;
}

export function computeRebate(
  inv: InvestmentInput,
  totalTaxableIncome: number,
  grossTax: number,
  cfg: AYConfig
): RebateResult {
  // Cap DPS at cfg.dpsCap
  const effectiveDps = Math.min(inv.dps, cfg.dpsCap);

  const totalInvestments =
    inv.lifeInsurance +
    inv.ownPFOrGPF +
    inv.sanchayapatra +
    effectiveDps +
    inv.listedShares +
    inv.mutualFund +
    inv.treasuryBond +
    inv.wageEarnerBond +
    inv.ups +
    inv.zakat +
    inv.charity;

  const maxByIncome = cfg.rebateIncomePercent * totalTaxableIncome;
  const maxEligibleInvestment = Math.min(maxByIncome, cfg.rebateInvestmentCap);
  const eligibleInvestment = Math.min(totalInvestments, maxEligibleInvestment);
  const rawRebate = Math.round(cfg.rebateRate * eligibleInvestment);

  // Rebate cannot exceed gross tax (never negative net tax from rebate alone)
  const investmentRebate = Math.min(rawRebate, grossTax);

  const investmentGap = Math.max(0, maxEligibleInvestment - totalInvestments);
  const currentRebate = investmentRebate;
  const maxPossibleRebate = Math.min(
    Math.round(cfg.rebateRate * maxEligibleInvestment),
    grossTax
  );
  const additionalSavingIfGapFilled = Math.max(0, maxPossibleRebate - currentRebate);

  return {
    totalInvestments,
    eligibleInvestment,
    investmentRebate,
    advisorMetrics: {
      maxEligibleInvestment,
      currentTotalInvestment: totalInvestments,
      currentEligibleInvestment: eligibleInvestment,
      investmentGap,
      currentRebate,
      maxPossibleRebate,
      additionalSavingIfGapFilled,
      isMaximised: investmentGap <= 0,
    },
  };
}
