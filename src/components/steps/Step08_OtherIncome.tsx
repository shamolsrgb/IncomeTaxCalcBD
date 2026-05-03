import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { CurrencyInput } from '../ui/CurrencyInput';
import { TAX_CONFIG } from '../../config/taxConfig';

export function Step08_OtherIncome() {
  const { t } = useTranslation();
  const { inputs, updateOtherIncome } = useTaxStore();
  const oi = inputs.otherIncome;
  const cfg = TAX_CONFIG[inputs.ayKey];

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-4">{t('otherIncome.title')}</h2>

      <CurrencyInput label={t('otherIncome.lottery')} value={oi.lottery} onChange={(v) => updateOtherIncome({ lottery: v })} note="TDS @20% deducted at source (final tax — non-adjustable)" />
      <CurrencyInput
        label={t('otherIncome.cashGifts')}
        value={oi.cashGifts}
        onChange={(v) => updateOtherIncome({ cashGifts: v })}
        note={t('otherIncome.cashGiftsNote')}
        badge={oi.cashGifts > cfg.giftExemptionThreshold
          ? `Taxable: ৳${(oi.cashGifts - cfg.giftExemptionThreshold).toLocaleString('en-IN')}`
          : 'Fully exempt (below ৳25,000)'}
      />
      <CurrencyInput
        label={t('otherIncome.nonCashGifts')}
        value={oi.nonCashGiftValue}
        onChange={(v) => updateOtherIncome({ nonCashGiftValue: v })}
        note="Fair market value of non-cash gifts from non-exempt persons"
      />
      <CurrencyInput label={t('otherIncome.machineryLease')} value={oi.machineryLease} onChange={(v) => updateOtherIncome({ machineryLease: v })} />
      <CurrencyInput
        label={t('otherIncome.foreignRemittance')}
        value={oi.foreignRemittanceTaxable}
        onChange={(v) => updateOtherIncome({ foreignRemittanceTaxable: v })}
        note="Only enter remittance received through NON-banking channels. Banking channel remittance is fully exempt (Section 76)."
      />
      <CurrencyInput label={t('otherIncome.others')} value={oi.others} onChange={(v) => updateOtherIncome({ others: v })} />
    </div>
  );
}
