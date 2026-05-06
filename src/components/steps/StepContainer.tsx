import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { formatBDT } from '../../utils/currency';
import { countUp, staggerIn, slideIn, bouncePress } from '../../utils/gsapHelpers';
import { Step01_TaxpayerProfile } from './Step01_TaxpayerProfile';
import { Step02_SalaryIncome } from './Step02_SalaryIncome';
import { Step03_Securities } from './Step03_Securities';
import { Step04_HouseProperty } from './Step04_HouseProperty';
import { Step05_Agriculture } from './Step05_Agriculture';
import { Step06_Business } from './Step06_Business';
import { Step07_CapitalGains } from './Step07_CapitalGains';
import { Step08_OtherIncome } from './Step08_OtherIncome';
import { Step09_Loans } from './Step09_Loans';
import { Step10_Investments } from './Step10_Investments';
import { Step11_TdsAdvanceTax } from './Step11_TdsAdvanceTax';
import { Step12_Summary } from './Step12_Summary';

const STEPS = [
  Step01_TaxpayerProfile,
  Step02_SalaryIncome,
  Step03_Securities,
  Step04_HouseProperty,
  Step05_Agriculture,
  Step06_Business,
  Step07_CapitalGains,
  Step08_OtherIncome,
  Step09_Loans,
  Step10_Investments,
  Step11_TdsAdvanceTax,
  Step12_Summary,
];

const TAB_STEPS: number[][] = [
  [0],
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9],
  [10],
  [11],
];

export function StepContainer() {
  const { t } = useTranslation();
  const { currentStep, setStep, markStepComplete, result, inputs } = useTaxStore();
  const ActiveStep = STEPS[currentStep];
  const total = STEPS.length - 1;
  const payable = result.netTaxPayable;
  const isRefund = result.isRefundable;

  const tabGroup = TAB_STEPS.find((g) => g.includes(currentStep)) ?? [currentStep];
  const posInTab = tabGroup.indexOf(currentStep);
  const isLastInTab = posInTab === tabGroup.length - 1;

  // Refs for animations
  const headingRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const payableRef = useRef<HTMLParagraphElement>(null);
  const prevPayable = useRef(payable);

  // Step content entrance animation
  const [stepKey, setStepKey] = useState(currentStep);
  useEffect(() => {
    setStepKey(currentStep);
    if (headingRef.current) slideIn(headingRef.current);
  }, [currentStep]);

  // Animate the payable number when it changes
  useEffect(() => {
    if (payableRef.current && prevPayable.current !== payable) {
      countUp(payableRef.current, prevPayable.current, payable, (n) => formatBDT(Math.abs(n)));
      prevPayable.current = payable;
    }
  }, [payable]);

  // Stagger right panel rows on mount
  useEffect(() => {
    if (rightPanelRef.current) {
      staggerIn(rightPanelRef.current, '.result-row-hover', 0.1);
    }
  }, []);

  function goNext() {
    markStepComplete(currentStep);
    if (currentStep < total) setStep(currentStep + 1);
  }

  function goPrev() {
    if (currentStep > 0) setStep(currentStep - 1);
  }

  function handleNextClick(e: React.MouseEvent<HTMLButtonElement>) {
    bouncePress(e.currentTarget);
    setTimeout(goNext, 80);
  }

  function handlePrevClick(e: React.MouseEvent<HTMLButtonElement>) {
    bouncePress(e.currentTarget);
    setTimeout(goPrev, 80);
  }

  const stepTitle = t(`steps.${currentStep}`);

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      {/* Page heading */}
      <div ref={headingRef} className="mb-6">
        <h1 className="text-2xl font-bold text-white">{stepTitle}</h1>
        <p className="text-sm text-slate-400 mt-0.5">{stepTitle}</p>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-5 items-start">
        {/* Left: step content card */}
        <div className="step-dark flex-1 min-w-0 bg-[#172035] rounded-2xl border border-[#1E2D47] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div key={stepKey} className="step-content-enter">
            <ActiveStep />
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-5 border-t border-[#1E2D47] no-print">
            <button
              onClick={handlePrevClick}
              disabled={currentStep === 0}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium
                         border border-[#1E2D47] rounded-xl text-slate-300
                         hover:bg-white/5 hover:border-[#253A5E]
                         disabled:opacity-30 disabled:cursor-not-allowed
                         transition-colors duration-150"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {t('prev')}
            </button>
            {currentStep < total && (
              <button
                onClick={handleNextClick}
                className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold
                           bg-[#BBFF47] text-[#0F1828] rounded-xl
                           hover:bg-[#A3E83B]
                           transition-colors duration-150 shadow-sm"
              >
                {isLastInTab ? 'Next Section' : t('next')}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Right column: stacked cards */}
        <div ref={rightPanelRef} className="w-64 shrink-0 flex flex-col gap-4 no-print">
          {/* NET TAX PAYABLE card */}
          <div className="bg-[#172035] rounded-2xl border border-[#1E2D47] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              {isRefund ? t('summary.refundable') : t('summary.netPayable')}
            </p>
            <p
              ref={payableRef}
              className={`text-2xl font-bold tabular-nums result-value mb-3 ${
                isRefund ? 'text-[#BBFF47]' : payable === 0 ? 'text-slate-300' : 'text-white'
              }`}
            >
              {formatBDT(Math.abs(payable))}
            </p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-5 ${
              isRefund
                ? 'bg-[#BBFF47]/20 text-[#BBFF47]'
                : payable === 0
                ? 'bg-white/10 text-slate-300'
                : 'bg-orange-500/20 text-orange-400'
            }`}>
              {isRefund ? 'Refundable' : payable === 0 ? 'Nil' : 'Payable'}
            </span>

            <div className="space-y-0 border-t border-[#1E2D47] pt-4">
              <ResultRow label={t('summary.totalTaxableIncome')} value={result.totalTaxableIncome} />
              <ResultRow label={t('summary.taxFreeThreshold')} value={result.taxFreeThreshold} />
              <ResultRow label={t('summary.netTaxableIncome')} value={result.netTaxableIncome} bold />
              <div className="my-2 border-t border-[#1E2D47] border-dashed" />
              <ResultRow label={t('summary.grossTax')} value={result.grossTax} />
              {result.investmentRebate > 0 && (
                <ResultRow label={t('summary.investmentRebate')} value={-result.investmentRebate} positive />
              )}
              <ResultRow label={t('summary.finalTax')} value={result.finalTax} bold />
              {result.surcharge > 0 && (
                <ResultRow label={t('summary.surcharge')} value={result.surcharge} warning />
              )}
              {result.tdsTotal > 0 && (
                <ResultRow label={t('summary.tdsTotal')} value={-result.tdsTotal} positive />
              )}
              {result.advanceTax > 0 && (
                <ResultRow label={t('summary.advanceTax')} value={-result.advanceTax} positive />
              )}
            </div>
          </div>

          {/* Investment Advisor card */}
          {inputs.taxpayerType !== 'nrb' && (
            <div className={`bg-[#172035] rounded-2xl border border-[#1E2D47] shadow-[0_4px_20px_rgba(0,0,0,0.3)] overflow-hidden border-l-4 ${result.advisorMetrics.isMaximised ? 'border-l-[#BBFF47]' : 'border-l-orange-500'}`}>
              <div className="px-4 py-2.5 border-b border-[#1E2D47]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('investments.advisorTitle')}</p>
              </div>
              <div className="px-4 py-3 space-y-1.5 text-[11px]">
                <div className="flex justify-between gap-2 result-row-hover">
                  <span className="text-slate-400">{t('investments.maxEligible')}</span>
                  <span className="font-medium text-slate-200 tabular-nums">{formatBDT(result.advisorMetrics.maxEligibleInvestment)}</span>
                </div>
                <div className="flex justify-between gap-2 result-row-hover">
                  <span className="text-slate-400">{t('investments.currentEligible')}</span>
                  <span className="font-medium text-slate-200 tabular-nums">{formatBDT(result.advisorMetrics.currentEligibleInvestment)}</span>
                </div>
                <div className="flex justify-between gap-2 result-row-hover">
                  <span className="text-slate-400">{t('investments.currentRebate')}</span>
                  <span className="font-medium text-[#BBFF47] tabular-nums">{formatBDT(result.advisorMetrics.currentRebate)}</span>
                </div>
                <div className="flex justify-between gap-2 result-row-hover">
                  <span className="text-slate-400">{t('investments.maxRebate')}</span>
                  <span className="font-medium text-slate-200 tabular-nums">{formatBDT(result.advisorMetrics.maxPossibleRebate)}</span>
                </div>
              </div>
              {result.advisorMetrics.isMaximised ? (
                <p className="px-4 pb-3 text-[11px] font-semibold text-[#BBFF47]">✓ {t('investments.maximisedCallout')}</p>
              ) : (
                <div className="mx-4 mb-4 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2">
                  <p className="text-[11px] font-semibold text-orange-400">
                    {t('investments.gapCallout', {
                      gap: formatBDT(result.advisorMetrics.investmentGap),
                      saving: formatBDT(result.advisorMetrics.additionalSavingIfGapFilled),
                    })}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile within-tab step dots */}
      {tabGroup.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-5 no-print">
          {tabGroup.map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`h-1.5 rounded-full transition-all ${
                s === currentStep ? 'w-5 bg-[#BBFF47]' : 'w-1.5 bg-[#1E2D47]'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ResultRow({
  label, value, bold, positive, warning,
}: {
  label: string; value: number; bold?: boolean; positive?: boolean; warning?: boolean;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const prevVal = useRef(value);

  useEffect(() => {
    if (spanRef.current && prevVal.current !== value) {
      countUp(spanRef.current, prevVal.current, value, formatBDT);
      prevVal.current = value;
    }
  }, [value]);

  return (
    <div className="result-row-hover flex justify-between gap-2 py-1.5">
      <span className={`text-[11px] leading-snug ${bold ? 'font-semibold text-slate-200' : 'text-slate-400'}`}>
        {label}
      </span>
      <span
        ref={spanRef}
        className={`shrink-0 text-[11px] tabular-nums ${
          bold ? 'font-bold text-white'
          : positive ? 'font-medium text-[#BBFF47]'
          : warning ? 'font-medium text-orange-400'
          : 'text-slate-300'
        }`}
      >
        {formatBDT(value)}
      </span>
    </div>
  );
}
