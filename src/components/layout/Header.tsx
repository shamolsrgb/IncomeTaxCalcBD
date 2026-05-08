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
    label: 'Income',
    steps: [1, 2, 3, 4, 5, 6],
    firstStep: 1,
    icon: (
      <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Assets',
    steps: [7],
    firstStep: 7,
    icon: (
      <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: 'Tax Credits',
    steps: [8],
    firstStep: 8,
    icon: (
      <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    label: 'Summary',
    steps: [9],
    firstStep: 9,
    icon: (
      <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export function Header() {
  const { currentStep, setStep, resetDraft } = useTaxStore();

  const activeTabIndex = TABS.findIndex((tab) => tab.steps.includes(currentStep));

  return (
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
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={resetDraft}
          className="hidden sm:block text-xs font-medium text-slate-300 hover:text-white transition-colors"
        >
          Reset Values
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
  );
}
