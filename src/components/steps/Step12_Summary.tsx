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

  function handlePrint() {
    window.print();
  }

  return (
    <div ref={printRef}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5 no-print">
        <div>
          <h2 className="text-lg font-bold text-slate-100">{t('summary.title')}</h2>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold
                     bg-brand text-white rounded-xl hover:bg-brand-dark
                     transition-colors shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-2 4H8v-6h8v6z" />
          </svg>
          {t('printSummary')}
        </button>
      </div>

      {/* Alert banners */}
      {inputs.ayKey !== '2025-26' && (
        <div className="mb-4 flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-sm text-amber-400">
          <svg className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{t('assessmentYear.priorAYBanner', { ay: cfg.label })}</span>
        </div>
      )}

      {/* Section: Income by Head */}
      <Section title={t('summary.incomeByHead')} accentColor="brand">
        {Object.entries(result.incomeByHead).map(([head, amt]) => (
          <SummaryRow key={head} label={t(`summary.heads.${head}`)} value={amt} />
        ))}
        <SummaryRow label={t('summary.totalGrossIncome')} value={result.totalTaxableIncome} bold />
      </Section>

      {/* Section: Threshold */}
      <Section title="Tax-Free Threshold & Net Taxable Income" accentColor="slate">
        <SummaryRow label={t('summary.totalTaxableIncome')} value={result.totalTaxableIncome} />
        <SummaryRow label={t('summary.taxFreeThreshold')} value={-result.taxFreeThreshold} />
        <SummaryRow label={t('summary.netTaxableIncome')} value={result.netTaxableIncome} bold />
      </Section>

      {/* Section: Slab breakdown */}
      <Section title={t('summary.slabBreakdown')} accentColor="slate">
        {result.slabBreakdown.map((row, i) => (
          <div key={i} className="summary-row">
            <span className="text-slate-500 text-xs">{row.slabLabel}</span>
            <div className="flex items-center gap-4">
              <span className="text-slate-400 text-[11px] hidden sm:inline tabular-nums">
                {(row.rate * 100).toFixed(0)}% × {formatBDT(row.incomeInSlab)}
              </span>
              <span className="font-semibold text-slate-200 text-xs tabular-nums w-24 text-right">{formatBDT(row.tax)}</span>
            </div>
          </div>
        ))}
        {result.capitalGainResults.filter(r => r.tax > 0).map((cgr) => (
          <div key={cgr.id} className="summary-row">
            <span className="text-slate-500 text-xs">Capital Gains ({(cgr.taxRate * 100).toFixed(0)}% flat)</span>
            <span className="font-semibold text-slate-200 text-xs tabular-nums">{formatBDT(cgr.tax)}</span>
          </div>
        ))}
        <SummaryRow label={t('summary.grossTax')} value={result.grossTax} bold />
      </Section>

      {/* Section: Investment Rebate */}
      {result.investmentRebate > 0 && (
        <Section title="Investment Tax Rebate (Section 78)" accentColor="brand">
          <SummaryRow label="Total Eligible Investment" value={result.eligibleInvestment} />
          <SummaryRow label={`Rebate (15% × ${formatBDT(result.eligibleInvestment)})`} value={-result.investmentRebate} positive />
          <SummaryRow label={t('summary.netTaxAfterRebate')} value={result.netTaxAfterRebate} bold />
        </Section>
      )}

      {/* Section: Minimum Tax */}
      <Section title="Minimum Tax & Final Tax" accentColor="slate">
        <SummaryRow label="Net Tax after Rebate" value={result.netTaxAfterRebate} />
        <SummaryRow label={`Minimum Tax (${inputs.residenceArea === 'dhakaCTG' ? 'Dhaka/Ctg CC' : inputs.residenceArea === 'otherCity' ? 'Other City CC' : inputs.residenceArea === 'pourashava' ? 'Pourashava' : 'Rural'})`} value={result.minimumTax} />
        {result.minimumTax > result.netTaxAfterRebate && (
          <div className="my-2 flex items-center gap-2 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
            </svg>
            Minimum tax applies — overrides computed tax
          </div>
        )}
        <SummaryRow label={t('summary.finalTax')} value={result.finalTax} bold />
        {result.surcharge > 0 && (
          <>
            <SummaryRow label={t('summary.surcharge')} value={result.surcharge} warning />
            <SummaryRow label={t('summary.totalTaxPlusSurcharge')} value={result.totalTaxPlusSurcharge} bold />
          </>
        )}
      </Section>

      {/* Section: Tax Credits */}
      {(result.tdsTotal > 0 || result.advanceTax > 0) && (
        <Section title="Less: Tax Credits" accentColor="brand">
          {result.tdsTotal > 0 && <SummaryRow label={t('summary.tdsTotal')} value={-result.tdsTotal} positive />}
          {result.advanceTax > 0 && <SummaryRow label={t('summary.advanceTax')} value={-result.advanceTax} positive />}
        </Section>
      )}

    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

type AccentColor = 'brand' | 'slate' | 'orange';

const borderColorMap: Record<AccentColor, string> = {
  brand: 'border-[#BBFF47]',
  slate: 'border-[#253A5E]',
  orange: 'border-orange-400',
};

function Section({ title, children, accentColor = 'brand' }: {
  title: string;
  children: React.ReactNode;
  accentColor?: AccentColor;
}) {
  return (
    <div className={`mb-4 bg-[#0F1828] rounded-xl border-l-4 ${borderColorMap[accentColor]} overflow-hidden border border-[#1E2D47]`}>
      <div className="px-4 py-2.5 bg-[#172035] border-b border-[#1E2D47]">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="px-4 py-1">
        {children}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, bold, positive, warning, className }: {
  label: string;
  value: number;
  bold?: boolean;
  positive?: boolean;
  warning?: boolean;
  className?: string;
}) {
  return (
    <div className={`summary-row ${className ?? ''}`}>
      <span className={`${bold ? 'font-semibold text-slate-200' : 'text-slate-400'} text-xs`}>{label}</span>
      <span className={`text-xs tabular-nums ${
        bold ? 'font-bold text-white'
        : positive ? 'font-medium text-[#BBFF47]'
        : warning ? 'font-medium text-orange-400'
        : 'text-slate-300'
      }`}>
        {formatBDT(value)}
      </span>
    </div>
  );
}
