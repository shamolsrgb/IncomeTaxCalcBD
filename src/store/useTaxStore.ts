import { create } from 'zustand';
import { calculateTax, defaultInputs } from '../engine/taxEngine';
import type { TaxEngineInput, TaxEngineOutput, AYKey } from '../types/tax';
import { saveDraft, loadDraft } from './persistence';

interface TaxStore {
  inputs: TaxEngineInput;
  result: TaxEngineOutput;
  currentStep: number;
  completedSteps: Set<number>;
  updateInputs: (partial: Partial<TaxEngineInput>) => void;
  updateSalaryGovt: (partial: Partial<TaxEngineInput['salaryGovt']>) => void;
  updateSalaryPrivate: (partial: Partial<TaxEngineInput['salaryPrivate']>) => void;
  updateSecurities: (partial: Partial<TaxEngineInput['securities']>) => void;
  updateHouseProperty: (partial: Partial<TaxEngineInput['houseProperty']>) => void;
  updateAgriculture: (partial: Partial<TaxEngineInput['agriculture']>) => void;
  updateBusiness: (partial: Partial<TaxEngineInput['business']>) => void;
  updateOtherIncome: (partial: Partial<TaxEngineInput['otherIncome']>) => void;
  updateInvestments: (partial: Partial<TaxEngineInput['investments']>) => void;
  updateTdsCredits: (partial: Partial<TaxEngineInput['tdsCredits']>) => void;
  setStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  resetDraft: () => void;
  loadSavedDraft: () => void;
}

function recalculate(inputs: TaxEngineInput): TaxEngineOutput {
  return calculateTax(inputs, inputs.ayKey as AYKey);
}

export const useTaxStore = create<TaxStore>((set, get) => {
  const initial = defaultInputs();
  return {
    inputs: initial,
    result: recalculate(initial),
    currentStep: 0,
    completedSteps: new Set<number>(),

    updateInputs: (partial) => {
      const next = { ...get().inputs, ...partial };
      saveDraft(next);
      set({ inputs: next, result: recalculate(next) });
    },

    updateSalaryGovt: (partial) => {
      const next = {
        ...get().inputs,
        salaryGovt: { ...get().inputs.salaryGovt, ...partial },
      };
      saveDraft(next);
      set({ inputs: next, result: recalculate(next) });
    },

    updateSalaryPrivate: (partial) => {
      const next = {
        ...get().inputs,
        salaryPrivate: { ...get().inputs.salaryPrivate, ...partial },
      };
      saveDraft(next);
      set({ inputs: next, result: recalculate(next) });
    },

    updateSecurities: (partial) => {
      const next = {
        ...get().inputs,
        securities: { ...get().inputs.securities, ...partial },
      };
      saveDraft(next);
      set({ inputs: next, result: recalculate(next) });
    },

    updateHouseProperty: (partial) => {
      const next = {
        ...get().inputs,
        houseProperty: { ...get().inputs.houseProperty, ...partial },
      };
      saveDraft(next);
      set({ inputs: next, result: recalculate(next) });
    },

    updateAgriculture: (partial) => {
      const next = {
        ...get().inputs,
        agriculture: { ...get().inputs.agriculture, ...partial },
      };
      saveDraft(next);
      set({ inputs: next, result: recalculate(next) });
    },

    updateBusiness: (partial) => {
      const next = {
        ...get().inputs,
        business: { ...get().inputs.business, ...partial },
      };
      saveDraft(next);
      set({ inputs: next, result: recalculate(next) });
    },

    updateOtherIncome: (partial) => {
      const next = {
        ...get().inputs,
        otherIncome: { ...get().inputs.otherIncome, ...partial },
      };
      saveDraft(next);
      set({ inputs: next, result: recalculate(next) });
    },

    updateInvestments: (partial) => {
      const next = {
        ...get().inputs,
        investments: { ...get().inputs.investments, ...partial },
      };
      saveDraft(next);
      set({ inputs: next, result: recalculate(next) });
    },

    updateTdsCredits: (partial) => {
      const next = {
        ...get().inputs,
        tdsCredits: { ...get().inputs.tdsCredits, ...partial },
      };
      saveDraft(next);
      set({ inputs: next, result: recalculate(next) });
    },

    setStep: (step) => set({ currentStep: step }),

    markStepComplete: (step) => {
      const next = new Set(get().completedSteps);
      next.add(step);
      set({ completedSteps: next });
    },

    resetDraft: () => {
      const fresh = defaultInputs();
      localStorage.removeItem('taxDraft');
      set({ inputs: fresh, result: recalculate(fresh), currentStep: 0, completedSteps: new Set() });
    },

    loadSavedDraft: () => {
      const saved = loadDraft();
      if (saved) {
        set({ inputs: saved, result: recalculate(saved) });
      }
    },
  };
});
