import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { formatBDT } from '../../utils/currency';
import { TAX_CONFIG } from '../../config/taxConfig';

export function Step12_Summary() {
  const { t } = useTranslation();
  const { inputs, result } = useTaxStore();
  const cfg = TAX_CONFIG[inputs.ayKey];
  const printRef = useRef<HTMLDivElement>(null);

  const isRefund = result.isRefundable;
  const payable = result.netTaxPayable;

  function handlePrint() {
    window.print();
  }

  const isLate = result.isLateFilingApplicable;

  return (
    <div ref={printRef}>
      <div className="flex items-center justify-between mb-4 no-print">
        <h2 className="text-lg font-bold text-slate-800">{t('summary.title')}</h2>
        <button
          onClick={handlePrint}
          className="px-4 py-2 text-sm font-medium bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors"
        >
          {t('printSummary')}
        </button>
      </div>

      {/* Late filing warning */}
      {isLate && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
          {t('lateFilingWarning', { ay: cfg.label, deadline: new Date(cfg.filingDeadline).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' }) })}
        </div>
      )}

      {/* Prior AY banner */}
      {inputs.ayKey !== '2025-26' && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
          {t('assessmentYear.priorAYBanner', { ay: cfg.label })}
        </div>
      )}

      {/* Income by head */}
      <Section title={t('summary.incomeByHead')}>
        {Object.entries(result.incomeByHead).map(([head, amt]) => (
          <SummaryRow key={head} label={t(`summary.heads.${head}`)} value={amt} />
        ))}
        <SummaryRow label={t('summary.totalGrossIncome')} value={result.totalTaxableIncome} bold />
      </Section>

      {/* Threshold */}
      <Section title="Tax-Free Threshold & Net Taxable Income">
        <SummaryRow label={t('summary.totalTaxableIncome')} value={result.totalTaxableIncome} />
        <SummaryRow label={t('summary.taxFreeThreshold')} value={-result.taxFreeThreshold} />
        <SummaryRow label={t('summary.netTaxableIncome')} value={result.netTaxableIncome} bold />
      </Section>

      {/* Slab breakdown */}
      <Section title={t('summary.slabBreakdown')}>
        {result.slabBreakdown.map((row, i) => (
          <div key={i} className="flex justify-between text-sm py-1 border-b border-slate-100 last:border-0">
            <span className="text-slate-600">{row.slabLabel}</span>
            <div className="text-right">
              <span className="text-slate-500 mr-4 text-xs">{(row.rate * 100).toFixed(0)}% × {formatBDT(row.incomeInSlab)}</span>
              <span className="font-medium text-slate-800 w-24 inline-block text-right">{formatBDT(row.tax)}</span>
            </div>
          </div>
        ))}
        {result.capitalGainResults.filter(r => r.tax > 0).map((cgr) => (
          <div key={cgr.id} className="flex justify-between text-sm py-1 border-b border-slate-100">
            <span className="text-slate-600">Capital Gains ({(cgr.taxRate * 100).toFixed(0)}% flat)</span>
            <span className="font-medium text-slate-800">{formatBDT(cgr.tax)}</span>
          </div>
        ))}
        <SummaryRow label={t('summary.grossTax')} value={result.grossTax} bold />
      </Section>

      {/* Rebate */}
      {result.investmentRebate > 0 && (
        <Section title="Investment Tax Rebate (Section 78)">
          <SummaryRow label={`Total Eligible Investment`} value={result.eligibleInvestment} />
          <SummaryRow label={`Rebate (15% × ${formatBDT(result.eligibleInvestment)})`} value={-result.investmentRebate} className="text-green-700" />
          <SummaryRow label={t('summary.netTaxAfterRebate')} value={result.netTaxAfterRebate} bold />
        </Section>
      )}

      {/* Minimum tax */}
      <Section title="Minimum Tax & Final Tax">
        <SummaryRow label="Net Tax after Rebate" value={result.netTaxAfterRebate} />
        <SummaryRow label={`Minimum Tax (${inputs.residenceArea === 'dhakaCTG' ? 'Dhaka/Ctg CC' : inputs.residenceArea === 'otherCity' ? 'Other City CC' : inputs.residenceArea === 'pourashava' ? 'Pourashava' : 'Rural'})`} value={result.minimumTax} />
        {result.minimumTax > result.netTaxAfterRebate && (
          <div className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded my-1">
            Minimum tax applies — overrides computed tax
          </div>
        )}
        <SummaryRow label={t('summary.finalTax')} value={result.finalTax} bold />
        {result.surcharge > 0 && (
          <>
            <SummaryRow label={t('summary.surcharge')} value={result.surcharge} className="text-orange-700" />
            <SummaryRow label={t('summary.totalTaxPlusSurcharge')} value={result.totalTaxPlusSurcharge} bold />
          </>
        )}
      </Section>

      {/* TDS & Advance Tax */}
      <Section title="Less: Tax Credits">
        {result.tdsTotal > 0 && <SummaryRow label={t('summary.tdsTotal')} value={-result.tdsTotal} className="text-green-700" />}
        {result.advanceTax > 0 && <SummaryRow label={t('summary.advanceTax')} value={-result.advanceTax} className="text-green-700" />}
      </Section>

      {/* Final box */}
      <div className={`mt-6 rounded-xl p-5 border-2 ${isRefund ? 'border-green-400 bg-green-50' : payable === 0 ? 'border-slate-300 bg-slate-50' : 'border-orange-400 bg-orange-50'}`}>
        <p className="text-sm font-medium text-slate-500 mb-1">
          {isRefund ? t('summary.refundable') : t('summary.netPayable')}
        </p>
        <p className={`text-4xl font-bold ${isRefund ? 'text-green-700' : payable === 0 ? 'text-slate-700' : 'text-orange-700'}`}>
          {formatBDT(Math.abs(payable))}
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Assessment Year: {cfg.label} · Filing deadline: {new Date(cfg.filingDeadline).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">{title}</h3>
      <div className="bg-slate-50 rounded-lg border border-slate-200 px-4 py-2">
        {children}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, bold, className }: {
  label: string; value: number; bold?: boolean; className?: string;
}) {
  return (
    <div className={`flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0 text-sm ${className ?? ''}`}>
      <span className={bold ? 'font-semibold text-slate-800' : 'text-slate-600'}>{label}</span>
      <span className={bold ? 'font-bold text-slate-900' : 'text-slate-700'}>{formatBDT(value)}</span>
    </div>
  );
}
