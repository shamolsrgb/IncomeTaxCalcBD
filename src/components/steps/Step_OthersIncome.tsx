import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { CurrencyInput, ReadOnlyRow } from '../ui/CurrencyInput';
import { formatBDT } from '../../utils/currency';
import { TAX_CONFIG } from '../../config/taxConfig';
import type { AYConfig } from '../../types/config';
import type { CapitalGainEntry, CapitalAssetType } from '../../types/tax';

type OthersSection = 'houseProperty' | 'agriculture' | 'business' | 'capitalGains' | 'securities' | 'otherIncome';

const OPTIONS: { key: OthersSection; label: string }[] = [
  { key: 'houseProperty', label: 'House Property Income' },
  { key: 'agriculture', label: 'Agricultural Income' },
  { key: 'business', label: 'Business Income' },
  { key: 'capitalGains', label: 'Capital Gains' },
  { key: 'securities', label: 'Interest, Dividend & Securities Income' },
  { key: 'otherIncome', label: 'Other Income' },
];

const ICONS: Record<OthersSection, React.ReactNode> = {
  houseProperty: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
    </svg>
  ),
  agriculture: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 20c3-8 8-12 18-10M3 20c5-3 9-4 14-2M3 20h18" />
    </svg>
  ),
  business: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4" />
    </svg>
  ),
  capitalGains: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  securities: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13l4-4 4 4 4-6 4 3" />
      <rect x="2" y="3" width="20" height="18" rx="2" />
    </svg>
  ),
  otherIncome: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 8v4l3 3" />
    </svg>
  ),
};

const ASSET_TYPES: CapitalAssetType[] = ['landBuilding', 'listedShares', 'nonListedShares', 'mutualFund', 'other'];
function newCGEntry(): CapitalGainEntry {
  return { id: crypto.randomUUID(), assetType: 'landBuilding', acquisitionDate: '', saleDate: '', acquisitionCost: 0, salePrice: 0, description: '' };
}

export function Step_OthersIncome() {
  const { inputs } = useTaxStore();
  const cfg = TAX_CONFIG[inputs.ayKey];
  const [active, setActive] = useState<Set<OthersSection>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);

  function remove(key: OthersSection) {
    setActive((prev) => { const next = new Set(prev); next.delete(key); return next; });
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Others Income</h2>
          <p className="text-xs text-slate-500">Add income sources beyond salary</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold
                     bg-[#BBFF47]/10 text-[#BBFF47] border border-[#BBFF47]/30
                     rounded-lg hover:bg-[#BBFF47]/20 transition-colors shrink-0 mt-0.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Income
        </button>
      </div>

      {active.size === 0 && (
        <div className="flex flex-col items-center justify-center py-14 text-center border-2 border-dashed border-[#1E2D47] rounded-2xl">
          <svg className="w-10 h-10 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-sm font-medium text-slate-400">No other income added</p>
          <p className="text-xs text-slate-600 mt-1">Click "Add Income" to add house property, business, capital gains and more</p>
        </div>
      )}

      {active.has('houseProperty') && (
        <OptionalSection title="House Property Income" onRemove={() => remove('houseProperty')}>
          <HousePropertySection cfg={cfg} />
        </OptionalSection>
      )}

      {active.has('agriculture') && (
        <OptionalSection title="Agricultural Income" onRemove={() => remove('agriculture')}>
          <AgricultureSection cfg={cfg} />
        </OptionalSection>
      )}

      {active.has('business') && (
        <OptionalSection title="Business Income" onRemove={() => remove('business')}>
          <BusinessSection />
        </OptionalSection>
      )}

      {active.has('capitalGains') && (
        <OptionalSection title="Capital Gains" onRemove={() => remove('capitalGains')}>
          <CapitalGainsSection />
        </OptionalSection>
      )}

      {active.has('securities') && (
        <OptionalSection title="Interest, Dividend & Securities Income" onRemove={() => remove('securities')}>
          <SecuritiesSection cfg={cfg} />
        </OptionalSection>
      )}

      {active.has('otherIncome') && (
        <OptionalSection title="Other Income" onRemove={() => remove('otherIncome')}>
          <OtherIncomeSection cfg={cfg} />
        </OptionalSection>
      )}

      <AddIncomeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        active={active}
        onAdd={(selected) => setActive((prev) => new Set([...prev, ...selected]))}
      />
    </div>
  );
}

// ── Section components ────────────────────────────────────────────────────────

function HousePropertySection({ cfg: _cfg }: { cfg: AYConfig }) {
  const { inputs, updateHouseProperty } = useTaxStore();
  const hp = inputs.houseProperty;
  return (
    <CurrencyInput label="Annual Rental Income" value={hp.annualValue} onChange={(v) => updateHouseProperty({ annualValue: v })} />
  );
}

function AgricultureSection({ cfg }: { cfg: AYConfig }) {
  const { t } = useTranslation();
  const { inputs, updateAgriculture } = useTaxStore();
  const ag = inputs.agriculture;
  const net = Math.max(0, ag.grossIncome - ag.cultivationCost);
  const taxable = Math.max(0, net - cfg.agriculturalExemption);
  return (
    <div>
      <div className="grid grid-cols-2 gap-x-4">
        <CurrencyInput label={t('agriculture.grossIncome')} value={ag.grossIncome} onChange={(v) => updateAgriculture({ grossIncome: v })} />
        <CurrencyInput label={t('agriculture.cultivationCost')} value={ag.cultivationCost} onChange={(v) => updateAgriculture({ cultivationCost: v })} />
      </div>
      {ag.grossIncome > 0 && (
        <div className="mt-2 bg-[#0F1828] rounded-lg p-3 border border-[#1E2D47]">
          <ReadOnlyRow label="Gross Agricultural Income" value={ag.grossIncome} />
          {ag.cultivationCost > 0 && <ReadOnlyRow label="Less: Cost of Cultivation" value={-ag.cultivationCost} />}
          <ReadOnlyRow label="Less: Exempt (first ৳2L)" value={-Math.min(net, cfg.agriculturalExemption)} />
          <ReadOnlyRow label={t('agriculture.taxableAgriculture')} value={taxable} className="font-bold text-brand" />
        </div>
      )}
    </div>
  );
}

function BusinessSection() {
  const { t } = useTranslation();
  const { inputs, updateBusiness } = useTaxStore();
  const biz = inputs.business;
  const taxable = Math.max(0, biz.netProfit - biz.businessLoanInterest);
  return (
    <div>
      <CurrencyInput label={t('business.netProfit')} value={biz.netProfit} onChange={(v) => updateBusiness({ netProfit: v })} />
      {biz.netProfit > 0 && (
        <div className="mt-2 bg-[#0F1828] rounded-lg p-3 border border-[#1E2D47]">
          <ReadOnlyRow label="Taxable Business Income" value={taxable} className="font-bold text-brand" />
        </div>
      )}
    </div>
  );
}

function CapitalGainsSection() {
  const { t } = useTranslation();
  const { inputs, updateInputs, result } = useTaxStore();
  function addEntry() { updateInputs({ capitalGains: [...inputs.capitalGains, newCGEntry()] }); }
  function updateEntry(id: string, partial: Partial<CapitalGainEntry>) {
    updateInputs({ capitalGains: inputs.capitalGains.map((e) => e.id === id ? { ...e, ...partial } : e) });
  }
  function removeEntry(id: string) { updateInputs({ capitalGains: inputs.capitalGains.filter((e) => e.id !== id) }); }
  return (
    <div>
      {inputs.capitalGains.map((entry, idx) => {
        const cgr = result.capitalGainResults.find((r) => r.id === entry.id);
        const gain = entry.salePrice - entry.acquisitionCost;
        return (
          <div key={entry.id} className="border border-[#1E2D47] rounded-lg p-4 mb-4 bg-[#0F1828]">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-semibold text-slate-300">Asset {idx + 1}</p>
              <button onClick={() => removeEntry(entry.id)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-slate-300 mb-1">{t('capitalGains.assetType')}</label>
              <select value={entry.assetType} onChange={(e) => updateEntry(entry.id, { assetType: e.target.value as CapitalAssetType })} className="w-full px-3 py-2 border border-[#1E2D47] rounded-lg text-sm bg-[#0F1828] text-slate-100 focus:outline-none focus:ring-2 focus:ring-[rgba(187,255,71,0.3)]">
                {ASSET_TYPES.map((at) => <option key={at} value={at}>{t(`capitalGains.assetTypes.${at}`)}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <CurrencyInput label={t('capitalGains.acquisitionCost')} value={entry.acquisitionCost} onChange={(v) => updateEntry(entry.id, { acquisitionCost: v })} />
              <CurrencyInput label={t('capitalGains.salePrice')} value={entry.salePrice} onChange={(v) => updateEntry(entry.id, { salePrice: v })} />
            </div>
            {(entry.acquisitionCost > 0 || entry.salePrice > 0) && (
              <div className={`mt-2 text-sm font-semibold ${gain >= 0 ? 'text-brand' : 'text-red-400'}`}>
                {t('capitalGains.gain')}: {formatBDT(gain)}
                {cgr && cgr.exemption > 0 && <span className="text-xs text-slate-500 font-normal ml-2">(Exempt: {formatBDT(cgr.exemption)}, Taxable: {formatBDT(cgr.taxableGain)})</span>}
              </div>
            )}
          </div>
        );
      })}
      <button onClick={addEntry} className="w-full py-3 border-2 border-dashed border-[#BBFF47]/40 text-[#BBFF47] text-sm font-medium rounded-xl hover:border-[#BBFF47]/70 hover:bg-[#BBFF47]/5 transition-all mb-4">
        + {t('capitalGains.addAsset')}
      </button>
      <CurrencyInput label={t('capitalGains.priorYearLoss')} value={inputs.priorYearCapitalLoss} onChange={(v) => updateInputs({ priorYearCapitalLoss: v })} note="Capital loss carried forward from previous assessment years" />
    </div>
  );
}

function SecuritiesSection({ cfg }: { cfg: AYConfig }) {
  const { t } = useTranslation();
  const { inputs, updateSecurities } = useTaxStore();
  const s = inputs.securities;
  const listedDivTaxable = Math.max(0, s.listedDividend - cfg.listedDividendExemption);
  const mfDivTaxable = Math.max(0, s.mutualFundDividend - cfg.mutualFundDividendExemption);
  return (
    <div className="grid grid-cols-2 gap-x-4">
      <CurrencyInput label={t('securities.bankFdr')} value={s.bankFdrInterest} onChange={(v) => updateSecurities({ bankFdrInterest: v })} />
      <CurrencyInput label={t('securities.sanchayapatra')} value={s.sanchayapatraInterest} onChange={(v) => updateSecurities({ sanchayapatraInterest: v })} />
      <CurrencyInput label={t('securities.listedDividend')} value={s.listedDividend} onChange={(v) => updateSecurities({ listedDividend: v })} badge={s.listedDividend > 0 ? `${t('securities.listedDividendExemptNote')} — Taxable: ${formatBDT(listedDivTaxable)}` : undefined} />
      <CurrencyInput label={t('securities.nonListedDividend')} value={s.nonListedDividend} onChange={(v) => updateSecurities({ nonListedDividend: v })} />
      <CurrencyInput label={t('securities.mutualFundDividend')} value={s.mutualFundDividend} onChange={(v) => updateSecurities({ mutualFundDividend: v })} badge={s.mutualFundDividend > 0 ? `${t('securities.mutualFundExemptNote')} — Taxable: ${formatBDT(mfDivTaxable)}` : undefined} />
      <CurrencyInput label={t('securities.govtSecurities')} value={s.govtSecuritiesInterest} onChange={(v) => updateSecurities({ govtSecuritiesInterest: v })} />
    </div>
  );
}

function OtherIncomeSection({ cfg }: { cfg: AYConfig }) {
  const { t } = useTranslation();
  const { inputs, updateOtherIncome } = useTaxStore();
  const oi = inputs.otherIncome;
  return (
    <div className="grid grid-cols-2 gap-x-4">
      <CurrencyInput label={t('otherIncome.lottery')} value={oi.lottery} onChange={(v) => updateOtherIncome({ lottery: v })} />
      <CurrencyInput
        label={t('otherIncome.cashGifts')}
        value={oi.cashGifts}
        onChange={(v) => updateOtherIncome({ cashGifts: v })}
        badge={oi.cashGifts > cfg.giftExemptionThreshold
          ? `Taxable: ৳${(oi.cashGifts - cfg.giftExemptionThreshold).toLocaleString('en-IN')}`
          : oi.cashGifts > 0 ? 'Fully exempt (below ৳25,000)' : undefined}
      />
      <CurrencyInput label={t('otherIncome.nonCashGifts')} value={oi.nonCashGiftValue} onChange={(v) => updateOtherIncome({ nonCashGiftValue: v })} />
      <CurrencyInput label={t('otherIncome.machineryLease')} value={oi.machineryLease} onChange={(v) => updateOtherIncome({ machineryLease: v })} />
      <CurrencyInput label={t('otherIncome.foreignRemittance')} value={oi.foreignRemittanceTaxable} onChange={(v) => updateOtherIncome({ foreignRemittanceTaxable: v })} />
      <CurrencyInput label={t('otherIncome.others')} value={oi.others} onChange={(v) => updateOtherIncome({ others: v })} />
    </div>
  );
}

// ── Shared ────────────────────────────────────────────────────────────────────

function OptionalSection({ title, onRemove, children }: {
  title: string; onRemove: () => void; children: React.ReactNode;
}) {
  return (
    <div className="section-slide-in mb-4 bg-[#0F1828] border border-[#1E2D47] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1E2D47]">
        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{title}</p>
        <button onClick={onRemove} className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-red-400 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Remove
        </button>
      </div>
      <div className="px-4 pt-3 pb-1">{children}</div>
    </div>
  );
}

function AddIncomeModal({ open, onClose, active, onAdd }: {
  open: boolean; onClose: () => void;
  active: Set<OthersSection>; onAdd: (selected: OthersSection[]) => void;
}) {
  const [checked, setChecked] = useState<Set<OthersSection>>(new Set());

  if (!open) return null;

  const available = OPTIONS.filter((o) => !active.has(o.key));

  function toggle(key: OthersSection) {
    setChecked((prev) => { const next = new Set(prev); if (next.has(key)) next.delete(key); else next.add(key); return next; });
  }

  function handleAdd() { onAdd([...checked]); setChecked(new Set()); onClose(); }
  function handleClose() { setChecked(new Set()); onClose(); }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="modal-backdrop absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="modal-card relative bg-[#172035] rounded-2xl border border-[#1E2D47] w-96 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2D47]">
          <h3 className="text-sm font-bold text-slate-100">Add Income Components</h3>
          <button onClick={handleClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-5 py-4">
          {available.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">All income components are already added.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {available.map((opt) => {
                const isChecked = checked.has(opt.key);
                return (
                  <button key={opt.key} type="button" onClick={() => toggle(opt.key)}
                    className={`thumb-card aspect-square flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-2 transition-colors ${
                      isChecked ? 'border-[#BBFF47] bg-[#BBFF47]/10 text-[#BBFF47]' : 'border-[#1E2D47] text-slate-400 hover:border-[#BBFF47]/40 hover:text-slate-200'
                    }`}
                  >
                    {ICONS[opt.key]}
                    <span className="text-[11px] font-semibold text-center leading-tight">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button onClick={handleClose} className="flex-1 px-4 py-2 text-sm font-medium border border-[#1E2D47] rounded-xl text-slate-400 hover:bg-white/5 hover:border-[#253A5E] transition-all">Cancel</button>
          <button onClick={handleAdd} disabled={checked.size === 0} className="flex-1 px-4 py-2 text-sm font-semibold bg-[#BBFF47] text-[#0F1828] rounded-xl hover:bg-[#A3E83B] disabled:opacity-40 disabled:cursor-not-allowed transition-all">Add Selected</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
