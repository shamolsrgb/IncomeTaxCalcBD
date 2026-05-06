import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { CurrencyInput, ReadOnlyRow } from '../ui/CurrencyInput';
import { TAX_CONFIG } from '../../config/taxConfig';
import { formatBDT } from '../../utils/currency';

export function Step04_HouseProperty() {
  const { t } = useTranslation();
  const { inputs, updateHouseProperty } = useTaxStore();
  const hp = inputs.houseProperty;
  const cfg = TAX_CONFIG[inputs.ayKey];

  const vacancyAdjusted = hp.annualValue * (1 - hp.vacancyMonths / 12);
  const repairDeduction = cfg.housePropertyRepairPercent * vacancyAdjusted;

  // Auto-link housing loan interest
  const autoHousingInterest = inputs.loans
    .filter((l) => l.loanType === 'housing')
    .reduce((acc, l) => acc + l.interestPaidThisYear, 0);
  const totalMortgageInterest = hp.mortgageInterest + autoHousingInterest;

  const taxableHP = Math.max(0,
    vacancyAdjusted - repairDeduction - totalMortgageInterest - hp.municipalTax - hp.landRevenue - hp.insurance
  );

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-100 mb-4">{t('houseProperty.title')}</h2>

      <CurrencyInput
        label={t('houseProperty.annualValue')}
        value={hp.annualValue}
        onChange={(v) => updateHouseProperty({ annualValue: v })}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-1">{t('houseProperty.vacancyMonths')}</label>
        <select
          value={hp.vacancyMonths}
          onChange={(e) => updateHouseProperty({ vacancyMonths: Number(e.target.value) })}
          className="w-32 px-3 py-2 bg-[#0F1828] border border-[#1E2D47] rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-[rgba(187,255,71,0.3)] focus:border-[rgba(187,255,71,0.5)]"
        >
          {Array.from({ length: 13 }, (_, i) => (
            <option key={i} value={i}>{i} months</option>
          ))}
        </select>
      </div>

      <CurrencyInput label={t('houseProperty.municipalTax')} value={hp.municipalTax} onChange={(v) => updateHouseProperty({ municipalTax: v })} />
      <CurrencyInput
        label={t('houseProperty.mortgageInterest')}
        value={hp.mortgageInterest}
        onChange={(v) => updateHouseProperty({ mortgageInterest: v })}
        note={autoHousingInterest > 0 ? `+ ${formatBDT(autoHousingInterest)} auto-linked from Loans step` : undefined}
      />
      <CurrencyInput label={t('houseProperty.landRevenue')} value={hp.landRevenue} onChange={(v) => updateHouseProperty({ landRevenue: v })} />
      <CurrencyInput label={t('houseProperty.insurance')} value={hp.insurance} onChange={(v) => updateHouseProperty({ insurance: v })} />

      {hp.annualValue > 0 && (
        <div className="mt-4 bg-[#0F1828] rounded-lg p-4 border border-[#1E2D47]">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-3">House Property Computation</p>
          <ReadOnlyRow label="Annual Value (vacancy adjusted)" value={vacancyAdjusted} />
          <ReadOnlyRow label={`${t('houseProperty.repairDeduction')} (25% × ${formatBDT(vacancyAdjusted)})`} value={-repairDeduction} />
          <ReadOnlyRow label="Municipal Tax" value={-hp.municipalTax} />
          <ReadOnlyRow label="Mortgage Interest" value={-totalMortgageInterest} />
          {hp.landRevenue > 0 && <ReadOnlyRow label="Land Revenue" value={-hp.landRevenue} />}
          {hp.insurance > 0 && <ReadOnlyRow label="Insurance" value={-hp.insurance} />}
          <ReadOnlyRow label={t('houseProperty.taxableHouseProperty')} value={taxableHP} className="font-bold text-brand" />
        </div>
      )}
    </div>
  );
}
