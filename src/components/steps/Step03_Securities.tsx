import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { CurrencyInput } from '../ui/CurrencyInput';
import { TAX_CONFIG } from '../../config/taxConfig';
import { formatBDT } from '../../utils/currency';

export function Step03_Securities() {
  const { t } = useTranslation();
  const { inputs, updateSecurities } = useTaxStore();
  const s = inputs.securities;
  const cfg = TAX_CONFIG[inputs.ayKey];

  const listedDivTaxable = Math.max(0, s.listedDividend - cfg.listedDividendExemption);
  const mfDivTaxable = Math.max(0, s.mutualFundDividend - cfg.mutualFundDividendExemption);
  const total = s.bankFdrInterest + s.sanchayapatraInterest + listedDivTaxable + s.nonListedDividend + mfDivTaxable + s.govtSecuritiesInterest;

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-4">{t('securities.title')}</h2>

      <CurrencyInput
        label={t('securities.bankFdr')}
        value={s.bankFdrInterest}
        onChange={(v) => updateSecurities({ bankFdrInterest: v })}
        note="TDS @10% auto-credited"
      />
      <CurrencyInput
        label={t('securities.sanchayapatra')}
        value={s.sanchayapatraInterest}
        onChange={(v) => updateSecurities({ sanchayapatraInterest: v })}
        note="TDS @10% auto-credited"
      />
      <CurrencyInput
        label={t('securities.listedDividend')}
        value={s.listedDividend}
        onChange={(v) => updateSecurities({ listedDividend: v })}
        badge={s.listedDividend > 0 ? `${t('securities.listedDividendExemptNote')} — Taxable: ${formatBDT(listedDivTaxable)}` : undefined}
      />
      <CurrencyInput
        label={t('securities.nonListedDividend')}
        value={s.nonListedDividend}
        onChange={(v) => updateSecurities({ nonListedDividend: v })}
        note="Fully taxable at regular slab rates"
      />
      <CurrencyInput
        label={t('securities.mutualFundDividend')}
        value={s.mutualFundDividend}
        onChange={(v) => updateSecurities({ mutualFundDividend: v })}
        badge={s.mutualFundDividend > 0 ? `${t('securities.mutualFundExemptNote')} — Taxable: ${formatBDT(mfDivTaxable)}` : undefined}
      />
      <CurrencyInput
        label={t('securities.govtSecurities')}
        value={s.govtSecuritiesInterest}
        onChange={(v) => updateSecurities({ govtSecuritiesInterest: v })}
      />

      {total > 0 && (
        <div className="mt-4 bg-slate-50 rounded-lg p-3 border border-slate-200 text-sm">
          <div className="flex justify-between font-semibold">
            <span className="text-slate-600">Total Taxable Securities Income</span>
            <span className="text-brand">{formatBDT(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
