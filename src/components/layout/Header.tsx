import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTaxStore } from '../../store/useTaxStore';

const TABS = [
  {
    label: 'Setup',
    steps: [0],
    firstStep: 0,
    icon: (
      <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    label: 'Salary',
    steps: [1],
    firstStep: 1,
    icon: (
      <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a2 2 0 100 4h5v-4h-5z" />
      </svg>
    ),
  },
  {
    label: 'Others Income',
    steps: [2],
    firstStep: 2,
    icon: (
      <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    label: 'Investment',
    steps: [3],
    firstStep: 3,
    icon: (
      <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 15.5l7-7" />
        <circle cx="9" cy="9.5" r="0.75" fill="currentColor" stroke="none" />
        <circle cx="15" cy="14.5" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Tax Deduction',
    steps: [4],
    firstStep: 4,
    icon: (
      <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="6" cy="18" r="2.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 8L20 16M8.5 16L20 8" />
      </svg>
    ),
  },
  {
    label: 'Summary',
    steps: [5],
    firstStep: 5,
    icon: (
      <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export function Header() {
  const { currentStep, setStep, resetDraft, inputs, result } = useTaxStore();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const activeTabIndex = TABS.findIndex((tab) => tab.steps.includes(currentStep));

  const hasData =
    inputs.salaryPrivate.basic > 0 ||
    inputs.salaryGovt.basic > 0 ||
    result.totalTaxableIncome > 0 ||
    result.tdsTotal > 0 ||
    result.advanceTax > 0;

  function handleConfirmReset() {
    resetDraft();
    setConfirmOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 bg-[#0F1828] border-b border-[#1E2D47] px-5 py-3 flex items-center justify-between no-print shrink-0 z-10">
        {/* Left: Branding */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 flex items-center justify-center logo-star">
            <svg aria-hidden="true" className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l1.09 3.26L16.18 4l-1.64 2.91L18 8.18l-3.26 1.09L16 12l-2.91-1.64L12 13.82l-1.09-3.18L7.82 12l1.64-2.91L6 7.82l3.26-1.09L8 4l2.91 1.64L12 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">Tax Calculator</p>
            <p className="text-[11px] text-slate-400">Made by Md Noor Hossain</p>
          </div>
        </div>

        {/* Center: Tab navigation */}
        <nav className="hidden sm:flex items-center gap-1 bg-[#172035] rounded-full p-1 border border-[#1E2D47]">
          {TABS.map((tab, i) => {
            const isActive = activeTabIndex === i;
            return (
              <button
                key={tab.label}
                onClick={() => setStep(tab.firstStep)}
                aria-current={isActive ? 'step' : undefined}
                className={`nav-tab flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#BBFF47] text-[#0F1828] shadow-sm scale-[1.04]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={!hasData}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                       border border-[#1E2D47] rounded-lg text-slate-300
                       hover:bg-white/5 hover:border-[#253A5E] hover:text-white
                       disabled:opacity-30 disabled:cursor-not-allowed
                       transition-all duration-150"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Settings"
          >
            <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {confirmOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmOpen(false)} />
          <div className="relative bg-[#172035] rounded-2xl border border-[#1E2D47] w-80 shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                <svg className="w-4.5 h-4.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Reset all data?</h3>
                <p className="text-xs text-slate-400 mt-0.5">This will clear all entered values and cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 px-4 py-2 text-sm font-medium border border-[#1E2D47] rounded-xl text-slate-300
                           hover:bg-white/5 hover:border-[#253A5E] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-xl
                           hover:bg-red-600 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
