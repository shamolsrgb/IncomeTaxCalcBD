import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';

const TOTAL_STEPS = 12;

export function Sidebar() {
  const { t } = useTranslation();
  const { currentStep, completedSteps, setStep } = useTaxStore();

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-slate-200 overflow-y-auto hidden lg:block no-print">
      <nav className="py-4">
        {Array.from({ length: TOTAL_STEPS + 1 }, (_, i) => {
          const isActive = currentStep === i;
          const isDone = completedSteps.has(i);
          return (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand font-semibold border-r-2 border-brand'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isDone
                    ? 'bg-brand text-white'
                    : isActive
                    ? 'bg-brand text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isDone && !isActive ? '✓' : i}
              </span>
              <span className="truncate">{t(`steps.${i}`)}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
