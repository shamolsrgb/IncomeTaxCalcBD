import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { Step00_AssessmentYear } from './Step00_AssessmentYear';
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
  Step00_AssessmentYear,
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

export function StepContainer() {
  const { t } = useTranslation();
  const { currentStep, setStep, markStepComplete } = useTaxStore();
  const ActiveStep = STEPS[currentStep];
  const total = STEPS.length - 1;

  function goNext() {
    markStepComplete(currentStep);
    if (currentStep < total) setStep(currentStep + 1);
  }

  function goPrev() {
    if (currentStep > 0) setStep(currentStep - 1);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Mobile progress bar */}
      <div className="mb-4 lg:hidden">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>{t('step')} {currentStep} {t('of')} {total}</span>
          <span>{t(`steps.${currentStep}`)}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div
            className="bg-brand h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <ActiveStep />
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-4 no-print">
        <button
          onClick={goPrev}
          disabled={currentStep === 0}
          className="px-5 py-2 text-sm font-medium border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ← {t('prev')}
        </button>
        {currentStep < total ? (
          <button
            onClick={goNext}
            className="px-5 py-2 text-sm font-medium bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors"
          >
            {t('next')} →
          </button>
        ) : null}
      </div>
    </div>
  );
}
