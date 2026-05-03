import type { TaxEngineInput } from '../types/tax';

const DRAFT_KEY = 'taxDraft';

export function saveDraft(inputs: TaxEngineInput): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(inputs));
  } catch {
    // Storage quota exceeded or private browsing — silently ignore
  }
}

export function loadDraft(): TaxEngineInput | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TaxEngineInput;
  } catch {
    return null;
  }
}
