import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { CurrencyInput, ReadOnlyRow } from '../ui/CurrencyInput';
import { formatBDT } from '../../utils/currency';

export function Step06_Business() {
  const { t } = useTranslation();
  const { inputs, updateBusiness } = useTaxStore();
  const biz = inputs.business;

  const autoBusinessInterest = inputs.loans
    .filter((l) => l.loanType === 'business' || l.loanType === 'car')
    .reduce((acc, l) => acc + l.interestPaidThisYear, 0);
  const totalInterest = biz.businessLoanInterest + autoBusinessInterest;
  const taxable = Math.max(0, biz.netProfit - totalInterest);

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-100 mb-4">{t('business.title')}</h2>

      <CurrencyInput
        label={t('business.netProfit')}
        value={biz.netProfit}
        onChange={(v) => updateBusiness({ netProfit: v })}
        note="Net profit after all allowable business expenses (rent, salaries, depreciation, etc.)"
      />
      <CurrencyInput
        label={t('business.businessLoanInterest')}
        value={biz.businessLoanInterest}
        onChange={(v) => updateBusiness({ businessLoanInterest: v })}
        note={autoBusinessInterest > 0 ? `+ ${formatBDT(autoBusinessInterest)} auto-linked from Loans step` : undefined}
      />

      {biz.netProfit > 0 && (
        <div className="mt-4 bg-[#0F1828] rounded-lg p-4 border border-[#1E2D47]">
          <ReadOnlyRow label="Net Profit" value={biz.netProfit} />
          {totalInterest > 0 && <ReadOnlyRow label="Less: Business Loan Interest" value={-totalInterest} />}
          <ReadOnlyRow label="Taxable Business Income" value={taxable} className="font-bold text-brand" />
        </div>
      )}
    </div>
  );
}
