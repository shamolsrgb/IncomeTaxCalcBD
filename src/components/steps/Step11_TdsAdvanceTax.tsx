import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { CurrencyInput } from '../ui/CurrencyInput';

export function Step11_TdsAdvanceTax() {
  const { t } = useTranslation();
  const { inputs, updateTdsCredits, updateInputs } = useTaxStore();
  const tds = inputs.tdsCredits;

  // Auto-computed TDS amounts for display
  const autoBankTDS = Math.round(inputs.securities.bankFdrInterest * 0.10);
  const autoSanchTDS = Math.round(inputs.securities.sanchayapatraInterest * 0.10);

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-4">{t('tds.title')}</h2>

      <CurrencyInput
        label={t('tds.salary')}
        value={tds.salary}
        onChange={(v) => updateTdsCredits({ salary: v })}
        note="Total TDS deducted from salary by employer during the year"
      />
      <CurrencyInput
        label={t('tds.bankInterest')}
        value={tds.bankInterest}
        onChange={(v) => updateTdsCredits({ bankInterest: v })}
        note={autoBankTDS > 0 ? `Auto-computed: ৳${autoBankTDS.toLocaleString('en-IN')} (@10%) — enter actual if different` : undefined}
        badge={tds.bankInterest === 0 && autoBankTDS > 0 ? `Will use auto ৳${autoBankTDS.toLocaleString('en-IN')}` : undefined}
      />
      <CurrencyInput
        label={t('tds.sanchayapatraInterest')}
        value={tds.sanchayapatraInterest}
        onChange={(v) => updateTdsCredits({ sanchayapatraInterest: v })}
        note={autoSanchTDS > 0 ? `Auto-computed: ৳${autoSanchTDS.toLocaleString('en-IN')} (@10%)` : undefined}
        badge={tds.sanchayapatraInterest === 0 && autoSanchTDS > 0 ? `Will use auto ৳${autoSanchTDS.toLocaleString('en-IN')}` : undefined}
      />
      <CurrencyInput label={t('tds.houseRent')} value={tds.houseRent} onChange={(v) => updateTdsCredits({ houseRent: v })} note="TDS deducted by tenant @5% on rent received" />
      <CurrencyInput label={t('tds.professional')} value={tds.professional} onChange={(v) => updateTdsCredits({ professional: v })} note="TDS on professional/consultancy income @10%" />
      <CurrencyInput label={t('tds.dividend')} value={tds.dividend} onChange={(v) => updateTdsCredits({ dividend: v })} />
      <CurrencyInput label={t('tds.other')} value={tds.other} onChange={(v) => updateTdsCredits({ other: v })} />

      <div className="border-t border-slate-200 pt-4 mt-2">
        <CurrencyInput
          label={t('tds.advanceTax')}
          value={inputs.advanceTax}
          onChange={(v) => updateInputs({ advanceTax: v })}
          note="Total advance tax paid in 3 instalments (15 Sep, 15 Dec, 15 Mar)"
        />
      </div>
    </div>
  );
}
