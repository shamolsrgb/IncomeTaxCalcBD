import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { CurrencyInput } from '../ui/CurrencyInput';
import type { LoanEntry, LoanType } from '../../types/tax';

const LOAN_TYPES: LoanType[] = ['housing', 'business', 'car', 'personal', 'education'];

function newLoan(): LoanEntry {
  return {
    id: crypto.randomUUID(),
    loanType: 'housing',
    lenderName: '',
    outstandingPrincipal: 0,
    interestPaidThisYear: 0,
  };
}

function deductibleNote(type: LoanType): string {
  if (type === 'housing') return 'Interest → House Property deduction (auto)';
  if (type === 'business' || type === 'car') return 'Interest → Business Income deduction (auto)';
  return 'Interest not deductible for tax purposes';
}

export function Step09_Loans() {
  const { t } = useTranslation();
  const { inputs, updateInputs } = useTaxStore();

  function addLoan() {
    updateInputs({ loans: [...inputs.loans, newLoan()] });
  }

  function updateLoan(id: string, partial: Partial<LoanEntry>) {
    updateInputs({
      loans: inputs.loans.map((l) => l.id === id ? { ...l, ...partial } : l),
    });
  }

  function removeLoan(id: string) {
    updateInputs({ loans: inputs.loans.filter((l) => l.id !== id) });
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-100 mb-2">{t('loans.title')}</h2>
      <p className="text-xs text-slate-500 mb-4">{t('loans.deductibleNote')}</p>

      {inputs.loans.map((loan, idx) => (
        <div key={loan.id} className="bg-[#0F1828] border border-[#1E2D47] rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-slate-200">Loan {idx + 1}</p>
            <button onClick={() => removeLoan(loan.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Remove</button>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-slate-300 mb-1">{t('loans.loanType')}</label>
            <select
              value={loan.loanType}
              onChange={(e) => updateLoan(loan.id, { loanType: e.target.value as LoanType })}
              className="w-full px-3 py-2 bg-[#172035] border border-[#1E2D47] rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-[rgba(187,255,71,0.3)] focus:border-[rgba(187,255,71,0.5)]"
            >
              {LOAN_TYPES.map((lt) => (
                <option key={lt} value={lt}>{t(`loans.loanTypes.${lt}`)}</option>
              ))}
            </select>
            <p className={`text-xs mt-1 ${['housing','business','car'].includes(loan.loanType) ? 'text-[#BBFF47]' : 'text-slate-500'}`}>
              {deductibleNote(loan.loanType)}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">{t('loans.lenderName')}</label>
            <input
              type="text"
              value={loan.lenderName}
              onChange={(e) => updateLoan(loan.id, { lenderName: e.target.value })}
              placeholder="Bank / institution name"
              className="w-full px-3 py-2 bg-[#172035] border border-[#1E2D47] rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[rgba(187,255,71,0.3)] focus:border-[rgba(187,255,71,0.5)] transition-all"
            />
          </div>

          <CurrencyInput
            label={t('loans.outstandingPrincipal')}
            value={loan.outstandingPrincipal}
            onChange={(v) => updateLoan(loan.id, { outstandingPrincipal: v })}
          />
          <CurrencyInput
            label={t('loans.interestPaid')}
            value={loan.interestPaidThisYear}
            onChange={(v) => updateLoan(loan.id, { interestPaidThisYear: v })}
          />
        </div>
      ))}

      <button
        onClick={addLoan}
        className="w-full py-3 border-2 border-dashed border-[#BBFF47]/40 text-[#BBFF47] text-sm font-medium rounded-xl hover:border-[#BBFF47]/70 hover:bg-[#BBFF47]/5 transition-all"
      >
        + {t('loans.addLoan')}
      </button>
    </div>
  );
}
