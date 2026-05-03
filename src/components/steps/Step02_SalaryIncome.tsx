import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { CurrencyInput, ReadOnlyRow } from '../ui/CurrencyInput';
import { Switch, ToggleCard } from '../ui/ToggleCard';
import { formatBDT } from '../../utils/currency';
import { TAX_CONFIG } from '../../config/taxConfig';
import { computeGovtSalary, computePrivateSalary } from '../../engine/salaryEngine';

export function Step02_SalaryIncome() {
  const { inputs } = useTaxStore();
  const isGovt = inputs.employerType === 'govt' || inputs.employerType === 'retired';
  const cfg = TAX_CONFIG[inputs.ayKey];

  if (isGovt) return <GovtSalary cfg={cfg} />;
  return <PrivateSalary cfg={cfg} />;
}

import type { AYConfig } from '../../types/config';

function GovtSalary({ cfg }: { cfg: AYConfig }) {
  const { t } = useTranslation();
  const { inputs, updateSalaryGovt } = useTaxStore();
  const s = inputs.salaryGovt;
  const result = computeGovtSalary(s, cfg);

  const hraExempt = s.residingInGovtQuarter
    ? 0
    : Math.min(s.hraReceived, cfg.hra.basicPercent * s.basic, cfg.hra.yearlyCapBDT);

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-1">{t('salary.title')}</h2>
      <p className="text-xs text-slate-500 mb-4">Government Employee</p>

      <CurrencyInput label={t('salary.basic')} value={s.basic} onChange={(v) => updateSalaryGovt({ basic: v })} />
      <CurrencyInput label={t('salary.da')} value={s.da} onChange={(v) => updateSalaryGovt({ da: v })} />

      <CurrencyInput
        label={t('salary.hraReceived')}
        value={s.hraReceived}
        onChange={(v) => updateSalaryGovt({ hraReceived: v })}
        tooltip={t('tooltipHRA')}
        badge={hraExempt > 0 ? `Exempt: ${formatBDT(hraExempt)}` : undefined}
      />
      <Switch
        label={t('salary.residingInGovtQuarter')}
        checked={s.residingInGovtQuarter}
        onChange={(v) => updateSalaryGovt({ residingInGovtQuarter: v })}
      />
      {s.residingInGovtQuarter && (
        <p className="text-xs text-amber-600 mb-3">HRA is fully taxable when residing in a government quarter.</p>
      )}

      <CurrencyInput
        label={t('salary.medical')}
        value={s.medical}
        onChange={(v) => updateSalaryGovt({ medical: v })}
        badge={s.medical > 0 ? `Exempt: ${formatBDT(Math.min(s.medical, cfg.medicalAllowanceCap))}` : undefined}
      />
      <CurrencyInput
        label={t('salary.conveyance')}
        value={s.conveyance}
        onChange={(v) => updateSalaryGovt({ conveyance: v })}
        badge={s.conveyance > 0 ? `Exempt: ${formatBDT(Math.min(s.conveyance, cfg.conveyanceAllowanceCap))}` : undefined}
      />
      <CurrencyInput label={t('salary.travelAllowance')} value={s.travelAllowance} onChange={(v) => updateSalaryGovt({ travelAllowance: v })} note="Fully exempt (official travel reimbursement)" />
      <CurrencyInput label={t('salary.entertainmentAllowance')} value={s.entertainmentAllowance} onChange={(v) => updateSalaryGovt({ entertainmentAllowance: v })} />
      <CurrencyInput label={t('salary.uniformAllowance')} value={s.uniformAllowance} onChange={(v) => updateSalaryGovt({ uniformAllowance: v })} note="Fully exempt for official uniform" />

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('salary.festivalBonusCount')}</label>
        <select
          value={s.festivalBonusCount}
          onChange={(e) => updateSalaryGovt({ festivalBonusCount: Number(e.target.value) })}
          className="w-32 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        >
          {[0, 1, 2].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        {s.festivalBonusCount > 0 && s.basic > 0 && (
          <p className="text-xs text-brand mt-1">Exempt: {formatBDT(s.basic * s.festivalBonusCount)} (1 month basic per festival)</p>
        )}
      </div>

      <CurrencyInput label={t('salary.gpfEmployer')} value={s.gpfContributionEmployer} onChange={(v) => updateSalaryGovt({ gpfContributionEmployer: v })} note="Fully exempt" />
      <CurrencyInput label={t('salary.gpfOwn')} value={s.ownGpfContribution} onChange={(v) => updateSalaryGovt({ ownGpfContribution: v })} note="Eligible for 15% investment rebate" />

      <ToggleCard title="Pension Income">
        <CurrencyInput label={t('salary.pensionCommuted')} value={s.pensionCommuted} onChange={(v) => updateSalaryGovt({ pensionCommuted: v })} note="Lump-sum from approved govt fund — fully exempt" />
        <CurrencyInput label={t('salary.pensionUncommuted')} value={s.pensionUncommuted} onChange={(v) => updateSalaryGovt({ pensionUncommuted: v })} note="Monthly pension — taxable as salary income" />
      </ToggleCard>

      <ToggleCard title="Gratuity & Leave Encashment">
        <CurrencyInput label={t('salary.gratuity')} value={s.gratuity} onChange={(v) => updateSalaryGovt({ gratuity: v })} note="Exempt up to ৳4.5 crore from approved govt fund" />
        <CurrencyInput label={t('salary.leaveEncashment')} value={s.leaveEncashment} onChange={(v) => updateSalaryGovt({ leaveEncashment: v })} note="Fully exempt at retirement" />
      </ToggleCard>

      <CurrencyInput label={t('salary.honorarium')} value={s.honorarium} onChange={(v) => updateSalaryGovt({ honorarium: v })} note="Fully taxable" />
      <CurrencyInput label={t('salary.otherAllowances')} value={s.otherAllowances} onChange={(v) => updateSalaryGovt({ otherAllowances: v })} />

      <SalaryResultBox
        grossTotal={result.grossTotal}
        totalExemption={result.totalExemption}
        standardDeduction={result.standardDeduction}
        taxableIncome={result.taxableIncome}
        t={t}
      />
    </div>
  );
}

function PrivateSalary({ cfg }: { cfg: AYConfig }) {
  const { t } = useTranslation();
  const { inputs, updateSalaryPrivate } = useTaxStore();
  const s = inputs.salaryPrivate;
  const result = computePrivateSalary(s, cfg);

  const hraExempt = Math.min(s.hraReceived, cfg.hra.basicPercent * s.basic, cfg.hra.yearlyCapBDT);

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-1">{t('salary.title')}</h2>
      <p className="text-xs text-slate-500 mb-4">Private Sector Employee</p>

      <CurrencyInput label={t('salary.basic')} value={s.basic} onChange={(v) => updateSalaryPrivate({ basic: v })} />
      <CurrencyInput
        label={t('salary.hraReceived')}
        value={s.hraReceived}
        onChange={(v) => updateSalaryPrivate({ hraReceived: v })}
        tooltip={t('tooltipHRA')}
        badge={s.hraReceived > 0 ? `Exempt: ${formatBDT(hraExempt)}` : undefined}
      />
      <CurrencyInput
        label={t('salary.medical')}
        value={s.medical}
        onChange={(v) => updateSalaryPrivate({ medical: v })}
        badge={s.medical > 0 ? `Exempt: ${formatBDT(Math.min(s.medical, cfg.medicalAllowanceCap))}` : undefined}
      />
      <CurrencyInput
        label={t('salary.conveyance')}
        value={s.conveyance}
        onChange={(v) => updateSalaryPrivate({ conveyance: v })}
        badge={s.conveyance > 0 ? `Exempt: ${formatBDT(Math.min(s.conveyance, cfg.conveyanceAllowanceCap))}` : undefined}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('salary.festivalBonusCount')}</label>
        <select
          value={s.festivalBonusCount}
          onChange={(e) => updateSalaryPrivate({ festivalBonusCount: Number(e.target.value) })}
          className="w-32 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        >
          {[0, 1, 2].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        {s.festivalBonusCount > 0 && s.basic > 0 && (
          <p className="text-xs text-brand mt-1">Exempt: {formatBDT(s.basic * s.festivalBonusCount)}</p>
        )}
      </div>

      {/* Optional components */}
      <ToggleCard title="Provident Fund (PF)">
        <CurrencyInput
          label={t('salary.employerPF')}
          value={s.employerPF}
          onChange={(v) => updateSalaryPrivate({ employerPF: v })}
          badge={s.employerPF > 0 ? `Exempt: ${formatBDT(Math.min(s.employerPF, cfg.employerPFExemptCap, cfg.employerPFExemptPercent * s.basic))}` : undefined}
        />
        <CurrencyInput
          label={t('salary.ownPF')}
          value={s.ownPFContribution}
          onChange={(v) => updateSalaryPrivate({ ownPFContribution: v })}
          note="Eligible for 15% investment rebate"
        />
      </ToggleCard>

      <ToggleCard title="WPPF / Profit Share / Bonus" description="Workers' Profit Participation Fund and other variable pay">
        <CurrencyInput
          label={t('salary.wppf')}
          value={s.wppf}
          onChange={(v) => updateSalaryPrivate({ wppf: v })}
          badge={s.wppf > 0 ? `Exempt: ${formatBDT(Math.min(s.wppf, cfg.wppfExemptCap))} (up to ৳5L)` : undefined}
        />
        <CurrencyInput label={t('salary.profitShare')} value={s.profitShare} onChange={(v) => updateSalaryPrivate({ profitShare: v })} />
        <CurrencyInput label={t('salary.performanceBonus')} value={s.performanceBonus} onChange={(v) => updateSalaryPrivate({ performanceBonus: v })} />
        <CurrencyInput label={t('salary.overtime')} value={s.overtime} onChange={(v) => updateSalaryPrivate({ overtime: v })} />
      </ToggleCard>

      <ToggleCard title="Gratuity & Leave Encashment">
        <CurrencyInput label={t('salary.gratuity')} value={s.gratuity} onChange={(v) => updateSalaryPrivate({ gratuity: v })} note="Exempt up to ৳4.5 crore from approved fund" />
        <CurrencyInput label={t('salary.leaveEncashment')} value={s.leaveEncashment} onChange={(v) => updateSalaryPrivate({ leaveEncashment: v })} note="Exempt at retirement" />
      </ToggleCard>

      <CurrencyInput label={t('salary.otherAllowances')} value={s.otherAllowances} onChange={(v) => updateSalaryPrivate({ otherAllowances: v })} />

      <SalaryResultBox
        grossTotal={result.grossTotal}
        totalExemption={result.totalExemption}
        standardDeduction={result.standardDeduction}
        taxableIncome={result.taxableIncome}
        t={t}
      />
    </div>
  );
}

function SalaryResultBox({ grossTotal, totalExemption, standardDeduction, taxableIncome, t }: {
  grossTotal: number; totalExemption: number; standardDeduction: number; taxableIncome: number;
  t: (k: string) => string;
}) {
  return (
    <div className="mt-6 bg-slate-50 rounded-lg p-4 border border-slate-200">
      <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Salary Computation</p>
      <ReadOnlyRow label="Gross Salary Total" value={grossTotal} />
      <ReadOnlyRow label="Less: Allowable Exemptions" value={-totalExemption} />
      <ReadOnlyRow label={t('salary.standardDeduction') + ' (1/3 or ৳4.5L)'} value={-standardDeduction} />
      <ReadOnlyRow label={t('salary.taxableSalary')} value={taxableIncome} className="font-bold text-brand" />
    </div>
  );
}
