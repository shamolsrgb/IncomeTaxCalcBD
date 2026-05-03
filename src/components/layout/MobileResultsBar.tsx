import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { formatBDT } from '../../utils/currency';

export function MobileResultsBar() {
  const { t } = useTranslation();
  const { result } = useTaxStore();
  const [expanded, setExpanded] = useState(false);
  const isRefund = result.isRefundable;
  const payable = result.netTaxPayable;

  return (
    <div className="xl:hidden no-print">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between px-4 py-3 border-t border-b ${
          isRefund ? 'bg-green-50 border-green-200' : payable === 0 ? 'bg-slate-50 border-slate-200' : 'bg-orange-50 border-orange-200'
        }`}
      >
        <div className="text-left">
          <p className="text-xs text-slate-500">{isRefund ? t('summary.refundable') : t('summary.netPayable')}</p>
          <p className={`text-lg font-bold ${isRefund ? 'text-green-700' : payable === 0 ? 'text-slate-700' : 'text-orange-700'}`}>
            {formatBDT(Math.abs(payable))}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">{t('summary.grossTax')}</p>
          <p className="text-sm font-semibold text-slate-700">{formatBDT(result.grossTax)}</p>
        </div>
        <span className={`text-slate-400 text-xl transition-transform ${expanded ? 'rotate-180' : ''}`}>›</span>
      </button>

      {expanded && (
        <div className="bg-white border-b border-slate-200 px-4 py-3 space-y-2 text-sm">
          {[
            [t('summary.totalTaxableIncome'), result.totalTaxableIncome],
            [t('summary.taxFreeThreshold'), result.taxFreeThreshold],
            [t('summary.netTaxableIncome'), result.netTaxableIncome],
            [t('summary.grossTax'), result.grossTax],
            [t('summary.investmentRebate'), -result.investmentRebate],
            [t('summary.finalTax'), result.finalTax],
          ].filter(([, v]) => (v as number) !== 0).map(([label, value]) => (
            <div key={label as string} className="flex justify-between">
              <span className="text-slate-600 text-xs">{label as string}</span>
              <span className="text-xs font-medium">{formatBDT(value as number)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
