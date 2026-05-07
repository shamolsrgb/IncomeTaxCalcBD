import type { AYConfig } from '../types/config';
import type { SalaryInputGovt, SalaryInputPrivate, EmployerType } from '../types/tax';

export interface SalaryResult {
  grossTotal: number;
  totalExemption: number;
  standardDeduction: number;
  taxableIncome: number;
  ownPFForRebate: number; // flows to investment rebate
}

export function computeGovtSalary(s: SalaryInputGovt, cfg: AYConfig): SalaryResult {
  // Gross total: all components including exempt ones
  const grossTotal =
    s.basic +
    s.da +
    s.hraReceived +
    s.medical +
    s.conveyance +
    s.travelAllowance +
    s.entertainmentAllowance +
    s.uniformAllowance +
    s.festivalBonusCount +
    s.gpfContributionEmployer +
    s.pensionUncommuted +
    s.honorarium +
    s.otherAllowances;
  // Pensioncommuted and gratuity/leaveEncashment are fully exempt — not included in gross

  // HRA exemption: if govt quarter, fully taxable; otherwise min(received, 50% basic, 3L/year)
  const hraExemption = s.residingInGovtQuarter
    ? 0
    : Math.min(s.hraReceived, cfg.hra.basicPercent * s.basic, cfg.hra.yearlyCapBDT);

  const medicalExemption = Math.min(s.medical, cfg.medicalAllowanceCap);
  const conveyanceExemption = Math.min(s.conveyance, cfg.conveyanceAllowanceCap);
  // Travel allowance (TA/DA) and uniform: fully exempt for govt
  const taExemption = s.travelAllowance;
  const uniformExemption = s.uniformAllowance;
  // Festival bonus: exempt up to 2 months' basic salary
  const festivalBonusExemption = Math.min(s.festivalBonusCount, s.basic * 2);
  // Employer GPF contribution: exempt
  const gpfExemption = s.gpfContributionEmployer;

  const totalExemption =
    hraExemption +
    medicalExemption +
    conveyanceExemption +
    taExemption +
    uniformExemption +
    festivalBonusExemption +
    gpfExemption;

  const afterExemption = Math.max(0, grossTotal - totalExemption);

  // Standard deduction: min(1/3 of afterExemption, cap)
  const standardDeduction = Math.min(
    cfg.standardDeductionPercent * afterExemption,
    cfg.standardDeductionCap
  );

  const taxableIncome = Math.max(0, afterExemption - standardDeduction);

  return {
    grossTotal,
    totalExemption,
    standardDeduction,
    taxableIncome,
    ownPFForRebate: s.ownGpfContribution,
  };
}

export function computePrivateSalary(
  s: SalaryInputPrivate,
  cfg: AYConfig
): SalaryResult {
  const grossTotal =
    s.basic +
    s.hraReceived +
    s.medical +
    s.conveyance +
    s.festivalBonusCount +
    s.employerPF +
    s.wppf +
    s.profitShare +
    s.performanceBonus +
    s.overtime +
    s.otherAllowances;
  // Gratuity and leave encashment from approved fund: exempt — not in gross

  const hraExemption = Math.min(
    s.hraReceived,
    cfg.hra.basicPercent * s.basic,
    cfg.hra.yearlyCapBDT
  );
  const medicalExemption = Math.min(s.medical, cfg.medicalAllowanceCap);
  const conveyanceExemption = Math.min(s.conveyance, cfg.conveyanceAllowanceCap);
  const festivalBonusExemption = Math.min(s.festivalBonusCount, s.basic * 2);
  const employerPFExemption = Math.min(
    s.employerPF,
    cfg.employerPFExemptCap,
    cfg.employerPFExemptPercent * s.basic
  );
  const wppfExemption = Math.min(s.wppf, cfg.wppfExemptCap);

  const totalExemption =
    hraExemption +
    medicalExemption +
    conveyanceExemption +
    festivalBonusExemption +
    employerPFExemption +
    wppfExemption;

  const afterExemption = Math.max(0, grossTotal - totalExemption);

  const standardDeduction = Math.min(
    cfg.standardDeductionPercent * afterExemption,
    cfg.standardDeductionCap
  );

  const taxableIncome = Math.max(0, afterExemption - standardDeduction);

  return {
    grossTotal,
    totalExemption,
    standardDeduction,
    taxableIncome,
    ownPFForRebate: s.ownPFContribution,
  };
}

export function computeSalary(
  employerType: EmployerType,
  govt: SalaryInputGovt,
  priv: SalaryInputPrivate,
  cfg: AYConfig
): SalaryResult {
  if (employerType === 'govt' || employerType === 'retired') {
    return computeGovtSalary(govt, cfg);
  }
  return computePrivateSalary(priv, cfg);
}
