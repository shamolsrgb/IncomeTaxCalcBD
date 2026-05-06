import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { CurrencyInput } from '../ui/CurrencyInput';
import { formatBDT } from '../../utils/currency';
import { TAX_CONFIG } from '../../config/taxConfig';

export function Step10_Investments() {
  const { t } = useTranslation();
  const { inputs, updateInvestments, result } = useTaxStore();
  const inv = inputs.investments;
  const cfg = TAX_CONFIG[inputs.ayKey];
  const isNRB = inputs.taxpayerType === 'nrb';
  const adv = result.advisorMetrics;

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-2">{t('investments.title')}</h2>
      <p className="text-xs text-slate-500 mb-4">
        Rebate = 15% × min(total investments, 30% of taxable income, ৳1 crore)
      </p>

      {isNRB && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
          Investment rebate (Section 78) is not available for Non-Resident Bangladeshis.
        </div>
      )}

      <CurrencyInput label={t('investments.lifeInsurance')} value={inv.lifeInsurance} onChange={(v) => updateInvestments({ lifeInsurance: v })} note="Premium for own, spouse, or children's life insurance policies" />
      <CurrencyInput label={t('investments.pfGpf')} value={inv.ownPFOrGPF} onChange={(v) => updateInvestments({ ownPFOrGPF: v })} note="Own contribution to recognised PF or GPF (own PF from salary auto-included)" />
      <CurrencyInput label={t('investments.sanchayapatra')} value={inv.sanchayapatra} onChange={(v) => updateInvestments({ sanchayapatra: v })} note="Purchase price of new Sanchayapatra / National Savings Certificates" />
      <CurrencyInput
        label={t('investments.dps')}
        value={inv.dps}
        onChange={(v) => updateInvestments({ dps: v })}
        badge={inv.dps > cfg.dpsCap ? `Capped at ${formatBDT(cfg.dpsCap)}/account for rebate` : undefined}
      />
      <CurrencyInput label={t('investments.listedShares')} value={inv.listedShares} onChange={(v) => updateInvestments({ listedShares: v })} note="Cost of purchase of listed company shares during the year" />
      <CurrencyInput label={t('investments.mutualFund')} value={inv.mutualFund} onChange={(v) => updateInvestments({ mutualFund: v })} />
      <CurrencyInput label={t('investments.treasuryBond')} value={inv.treasuryBond} onChange={(v) => updateInvestments({ treasuryBond: v })} />
      <CurrencyInput label={t('investments.wageEarnerBond')} value={inv.wageEarnerBond} onChange={(v) => updateInvestments({ wageEarnerBond: v })} />
      <CurrencyInput label={t('investments.ups')} value={inv.ups} onChange={(v) => updateInvestments({ ups: v })} note="Universal Pension Scheme contribution (new AY 2025-26)" />
      <CurrencyInput label={t('investments.zakat')} value={inv.zakat} onChange={(v) => updateInvestments({ zakat: v })} />
      <CurrencyInput label={t('investments.charity')} value={inv.charity} onChange={(v) => updateInvestments({ charity: v })} />

    </div>
  );
}

function AdvisorRow({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-400">{label}</span>
      <span className={`font-semibold ${highlight ? 'text-[#BBFF47]' : 'text-slate-200'}`}>{formatBDT(value)}</span>
    </div>
  );
}
