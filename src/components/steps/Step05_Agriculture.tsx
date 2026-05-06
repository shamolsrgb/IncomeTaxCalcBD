import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { CurrencyInput, ReadOnlyRow } from '../ui/CurrencyInput';
import { TAX_CONFIG } from '../../config/taxConfig';

export function Step05_Agriculture() {
  const { t } = useTranslation();
  const { inputs, updateAgriculture } = useTaxStore();
  const ag = inputs.agriculture;
  const cfg = TAX_CONFIG[inputs.ayKey];

  const net = Math.max(0, ag.grossIncome - ag.cultivationCost);
  const taxable = Math.max(0, net - cfg.agriculturalExemption);

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-100 mb-4">{t('agriculture.title')}</h2>

      <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
        {t('agriculture.exemptNote')} (৳{cfg.agriculturalExemption.toLocaleString('en-IN')})
      </div>

      <CurrencyInput label={t('agriculture.grossIncome')} value={ag.grossIncome} onChange={(v) => updateAgriculture({ grossIncome: v })} />
      <CurrencyInput label={t('agriculture.cultivationCost')} value={ag.cultivationCost} onChange={(v) => updateAgriculture({ cultivationCost: v })} note="Cost of seeds, fertiliser, labour, irrigation, repairs" />

      {ag.grossIncome > 0 && (
        <div className="mt-4 bg-[#0F1828] rounded-lg p-4 border border-[#1E2D47]">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Agricultural Income Computation</p>
          <ReadOnlyRow label="Gross Agricultural Income" value={ag.grossIncome} />
          {ag.cultivationCost > 0 && <ReadOnlyRow label="Less: Cost of Cultivation" value={-ag.cultivationCost} />}
          <ReadOnlyRow label="Net Agricultural Income" value={net} />
          <ReadOnlyRow label="Less: Exempt (first ৳2L)" value={-Math.min(net, cfg.agriculturalExemption)} />
          <ReadOnlyRow label={t('agriculture.taxableAgriculture')} value={taxable} className="font-bold text-brand" />
        </div>
      )}
    </div>
  );
}
