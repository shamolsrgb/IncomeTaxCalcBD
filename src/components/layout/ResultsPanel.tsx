import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { formatBDT } from '../../utils/currency';

export function ResultsPanel() {
  const { t } = useTranslation();
  const { result } = useTaxStore();

  const payable = result.netTaxPayable;
  const isRefund = result.isRefundable;

  return (
    <aside className="w-64 shrink-0 bg-white border-l border-slate-200 hidden xl:flex flex-col no-print">
      <div className="p-4 bg-brand text-white">
        <h2 className="text-sm font-semibold">{t('summary.title')}</h2>
        <p className="text-xs text-brand-100">Live calculation</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
        <Row label={t('summary.totalTaxableIncome')} value={result.totalTaxableIncome} />
        <Row label={t('summary.taxFreeThreshold')} value={result.taxFreeThreshold} />
        <Row label={t('summary.netTaxableIncome')} value={result.netTaxableIncome} bold />
        <div className="border-t border-slate-200 pt-2" />
        <Row label={t('summary.grossTax')} value={result.grossTax} />
        {result.investmentRebate > 0 && (
          <Row label={t('summary.investmentRebate')} value={-result.investmentRebate} className="text-green-700" />
        )}
        <Row label={t('summary.finalTax')} value={result.finalTax} bold />
        {result.surcharge > 0 && (
          <Row label={t('summary.surcharge')} value={result.surcharge} className="text-orange-600" />
        )}
        <div className="border-t border-slate-200 pt-2" />
        {result.tdsTotal > 0 && (
          <Row label={t('summary.tdsTotal')} value={-result.tdsTotal} className="text-green-700" />
        )}
        {result.advanceTax > 0 && (
          <Row label={t('summary.advanceTax')} value={-result.advanceTax} className="text-green-700" />
        )}
      </div>

      <div className={`p-4 ${isRefund ? 'bg-green-50' : payable === 0 ? 'bg-slate-50' : 'bg-orange-50'}`}>
        <p className="text-xs font-medium text-slate-500 mb-1">
          {isRefund ? t('summary.refundable') : t('summary.netPayable')}
        </p>
        <p className={`text-2xl font-bold result-value ${
          isRefund ? 'text-green-700' : payable === 0 ? 'text-slate-700' : 'text-orange-700'
        }`}>
          {formatBDT(Math.abs(payable))}
        </p>
      </div>
    </aside>
  );
}

function Row({ label, value, bold, className }: { label: string; value: number; bold?: boolean; className?: string }) {
  return (
    <div className={`flex justify-between gap-2 ${className ?? ''}`}>
      <span className={`text-slate-600 text-xs leading-snug ${bold ? 'font-semibold text-slate-800' : ''}`}>{label}</span>
      <span className={`shrink-0 text-xs ${bold ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
        {formatBDT(value)}
      </span>
    </div>
  );
}
