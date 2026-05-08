import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { CurrencyInput, ReadOnlyRow } from '../ui/CurrencyInput';
import { formatBDT } from '../../utils/currency';
import { TAX_CONFIG } from '../../config/taxConfig';
import { computeGovtSalary, computePrivateSalary } from '../../engine/salaryEngine';
import type { AYConfig } from '../../types/config';

export function Step02_SalaryIncome() {
  const { inputs } = useTaxStore();
  const isGovt = inputs.employerType === 'govt' || inputs.employerType === 'retired';
  const cfg = TAX_CONFIG[inputs.ayKey];

  if (isGovt) return <GovtSalary cfg={cfg} />;
  return <PrivateSalary cfg={cfg} />;
}

// ── Private Salary ────────────────────────────────────────────────────────────

type PrivateSection = 'pf' | 'wppf' | 'gratuity' | 'leaveEncashment';

const PRIVATE_OPTIONS: { key: PrivateSection; label: string; description?: string }[] = [
  { key: 'wppf', label: 'WPPF / Profit Share / Overtime Pay', description: "Workers' Profit Participation Fund and other variable pay" },
  { key: 'leaveEncashment', label: 'Leave Encashment' },
  { key: 'gratuity', label: 'Gratuity' },
  { key: 'pf', label: 'Provident Fund (PF)' },
];

function PrivateSalary({ cfg }: { cfg: AYConfig }) {
  const { t } = useTranslation();
  const { inputs, updateSalaryPrivate } = useTaxStore();
  const s = inputs.salaryPrivate;
  const result = computePrivateSalary(s, cfg);
  const [active, setActive] = useState<Set<PrivateSection>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);

  const hraExempt = Math.min(s.hraReceived, cfg.hra.basicPercent * s.basic, cfg.hra.yearlyCapBDT);

  function remove(key: PrivateSection) {
    setActive((prev) => { const next = new Set(prev); next.delete(key); return next; });
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-lg font-bold text-slate-100">{t('salary.title')}</h2>
          <p className="text-xs text-slate-500">Private Sector Employee</p>
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

      <div className="mt-4 grid grid-cols-2 gap-x-4">
        <CurrencyInput label={t('salary.basic')} value={s.basic} onChange={(v) => updateSalaryPrivate({ basic: v })} />
        <CurrencyInput
          label={t('salary.hraReceived')}
          value={s.hraReceived}
          onChange={(v) => updateSalaryPrivate({ hraReceived: v })}
          tooltip={t('tooltipHRA')}
          badge={s.hraReceived > 0 ? `Exempt: ${formatBDT(hraExempt)}` : undefined}
        />
        <CurrencyInput
          label={t('salary.medical')}
          value={s.medical}
          onChange={(v) => updateSalaryPrivate({ medical: v })}
          badge={s.medical > 0 ? `Exempt: ${formatBDT(Math.min(s.medical, cfg.medicalAllowanceCap))}` : undefined}
        />
        <CurrencyInput
          label={t('salary.conveyance')}
          value={s.conveyance}
          onChange={(v) => updateSalaryPrivate({ conveyance: v })}
          badge={s.conveyance > 0 ? `Exempt: ${formatBDT(Math.min(s.conveyance, cfg.conveyanceAllowanceCap))}` : undefined}
        />

        <CurrencyInput
          label={t('salary.festivalBonusCount')}
          value={s.festivalBonusCount}
          onChange={(v) => updateSalaryPrivate({ festivalBonusCount: v })}
          badge={s.festivalBonusCount > 0 && s.basic > 0 ? `Exempt: ${formatBDT(Math.min(s.festivalBonusCount, s.basic * 2))}` : undefined}
          action={s.basic > 0 ? { label: 'Auto calculate', onClick: () => updateSalaryPrivate({ festivalBonusCount: Math.round((s.basic / 12) * 2) }) } : undefined}
        />

        <CurrencyInput label={t('salary.otherAllowances')} value={s.otherAllowances} onChange={(v) => updateSalaryPrivate({ otherAllowances: v })} />
      </div>

      {/* Optional sections */}
      {active.has('wppf') && (
        <OptionalSection title="WPPF / Profit Share / Overtime Pay" onRemove={() => remove('wppf')}>
          <CurrencyInput
            label={t('salary.wppf')}
            value={s.wppf}
            onChange={(v) => updateSalaryPrivate({ wppf: v })}
            badge={s.wppf > 0 ? `Exempt: ${formatBDT(Math.min(s.wppf, cfg.wppfExemptCap))} (up to ৳5L)` : undefined}
          />
          <CurrencyInput label={t('salary.performanceBonus')} value={s.performanceBonus} onChange={(v) => updateSalaryPrivate({ performanceBonus: v })} />
          <CurrencyInput label={t('salary.overtime')} value={s.overtime} onChange={(v) => updateSalaryPrivate({ overtime: v })} />
        </OptionalSection>
      )}

      {active.has('leaveEncashment') && (
        <OptionalSection title="Leave Encashment" onRemove={() => remove('leaveEncashment')}>
          <CurrencyInput label={t('salary.leaveEncashment')} value={s.leaveEncashment} onChange={(v) => updateSalaryPrivate({ leaveEncashment: v })} note="Exempt at retirement" />
        </OptionalSection>
      )}

      {active.has('gratuity') && (
        <OptionalSection title="Gratuity" onRemove={() => remove('gratuity')}>
          <CurrencyInput label={t('salary.gratuity')} value={s.gratuity} onChange={(v) => updateSalaryPrivate({ gratuity: v })} note="Exempt up to ৳4.5 crore from approved fund" />
        </OptionalSection>
      )}

      {active.has('pf') && (
        <OptionalSection title="Provident Fund (PF)" onRemove={() => remove('pf')}>
          <CurrencyInput
            label={t('salary.ownPF')}
            value={s.ownPFContribution}
            onChange={(v) => updateSalaryPrivate({ ownPFContribution: v })}
            note="Eligible for 15% investment rebate"
          />
        </OptionalSection>
      )}

      <SalaryResultBox
        grossTotal={result.grossTotal}
        totalExemption={result.totalExemption}
        standardDeduction={result.standardDeduction}
        taxableIncome={result.taxableIncome}
        t={t}
      />

      <AddIncomeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        options={PRIVATE_OPTIONS}
        active={active}
        onAdd={(selected) => setActive((prev) => new Set([...prev, ...selected] as PrivateSection[]))}
      />
    </div>
  );
}

// ── Govt Salary ───────────────────────────────────────────────────────────────

type GovtSection = 'pension' | 'gratuity' | 'leaveEncashment';

const GOVT_OPTIONS: { key: GovtSection; label: string }[] = [
  { key: 'pension', label: 'Pension Income' },
  { key: 'gratuity', label: 'Gratuity' },
  { key: 'leaveEncashment', label: 'Leave Encashment' },
];

function GovtSalary({ cfg }: { cfg: AYConfig }) {
  const { t } = useTranslation();
  const { inputs, updateSalaryGovt } = useTaxStore();
  const s = inputs.salaryGovt;
  const result = computeGovtSalary(s, cfg);
  const [active, setActive] = useState<Set<GovtSection>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);

  const hraExempt = s.residingInGovtQuarter
    ? 0
    : Math.min(s.hraReceived, cfg.hra.basicPercent * s.basic, cfg.hra.yearlyCapBDT);

  function remove(key: GovtSection) {
    setActive((prev) => { const next = new Set(prev); next.delete(key); return next; });
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-lg font-bold text-slate-100">{t('salary.title')}</h2>
          <p className="text-xs text-slate-500">Government Employee</p>
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

      <div className="mt-4 grid grid-cols-2 gap-x-4">
        {/* ── Group 1: Primary fields ── */}
        <CurrencyInput label={t('salary.basic')} value={s.basic} onChange={(v) => updateSalaryGovt({ basic: v })} />
        <CurrencyInput
          label={t('salary.hraReceived')}
          value={s.hraReceived}
          onChange={(v) => updateSalaryGovt({ hraReceived: v })}
          tooltip={t('tooltipHRA')}
          badge={hraExempt > 0 ? `Exempt: ${formatBDT(hraExempt)}` : undefined}
        />
        <CurrencyInput
          label={t('salary.medical')}
          value={s.medical}
          onChange={(v) => updateSalaryGovt({ medical: v })}
          badge={s.medical > 0 ? `Exempt: ${formatBDT(Math.min(s.medical, cfg.medicalAllowanceCap))}` : undefined}
        />
        <CurrencyInput
          label={t('salary.conveyance')}
          value={s.conveyance}
          onChange={(v) => updateSalaryGovt({ conveyance: v })}
          badge={s.conveyance > 0 ? `Exempt: ${formatBDT(Math.min(s.conveyance, cfg.conveyanceAllowanceCap))}` : undefined}
        />
        <CurrencyInput
          label={t('salary.festivalBonusCount')}
          value={s.festivalBonusCount}
          onChange={(v) => updateSalaryGovt({ festivalBonusCount: v })}
          badge={s.festivalBonusCount > 0 && s.basic > 0 ? `Exempt: ${formatBDT(Math.min(s.festivalBonusCount, s.basic * 2))}` : undefined}
          action={s.basic > 0 ? { label: 'Auto calculate', onClick: () => updateSalaryGovt({ festivalBonusCount: Math.round((s.basic / 12) * 2) }) } : undefined}
        />
        <CurrencyInput
          label={t('salary.gpfOwn')}
          value={s.ownGpfContribution}
          onChange={(v) => updateSalaryGovt({ ownGpfContribution: v })}
          note="Eligible for 15% investment rebate"
        />

        {/* ── Group 2: Other Allowances ── */}
        <div className="col-span-2 mt-2 mb-6 flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Other Allowances</span>
          <div className="flex-1 border-t border-[#1E2D47]" />
        </div>
        <CurrencyInput label={t('salary.da')} value={s.da} onChange={(v) => updateSalaryGovt({ da: v })} />
        <CurrencyInput label={t('salary.travelAllowance')} value={s.travelAllowance} onChange={(v) => updateSalaryGovt({ travelAllowance: v })} note="Fully exempt (official travel reimbursement)" />
        <CurrencyInput label={t('salary.entertainmentAllowance')} value={s.entertainmentAllowance} onChange={(v) => updateSalaryGovt({ entertainmentAllowance: v })} />
        <CurrencyInput label={t('salary.uniformAllowance')} value={s.uniformAllowance} onChange={(v) => updateSalaryGovt({ uniformAllowance: v })} note="Fully exempt for official uniform" />
        <CurrencyInput label={t('salary.honorarium')} value={s.honorarium} onChange={(v) => updateSalaryGovt({ honorarium: v })} note="Fully taxable" />
        <CurrencyInput label={t('salary.otherAllowances')} value={s.otherAllowances} onChange={(v) => updateSalaryGovt({ otherAllowances: v })} />
      </div>

      {/* Optional sections */}
      {active.has('pension') && (
        <OptionalSection title="Pension Income" onRemove={() => remove('pension')}>
          <CurrencyInput label={t('salary.pensionCommuted')} value={s.pensionCommuted} onChange={(v) => updateSalaryGovt({ pensionCommuted: v })} note="Lump-sum from approved govt fund — fully exempt" />
          <CurrencyInput label={t('salary.pensionUncommuted')} value={s.pensionUncommuted} onChange={(v) => updateSalaryGovt({ pensionUncommuted: v })} note="Monthly pension — taxable as salary income" />
        </OptionalSection>
      )}

      {active.has('gratuity') && (
        <OptionalSection title="Gratuity" onRemove={() => remove('gratuity')}>
          <CurrencyInput label={t('salary.gratuity')} value={s.gratuity} onChange={(v) => updateSalaryGovt({ gratuity: v })} note="Exempt up to ৳4.5 crore from approved govt fund" />
        </OptionalSection>
      )}

      {active.has('leaveEncashment') && (
        <OptionalSection title="Leave Encashment" onRemove={() => remove('leaveEncashment')}>
          <CurrencyInput label={t('salary.leaveEncashment')} value={s.leaveEncashment} onChange={(v) => updateSalaryGovt({ leaveEncashment: v })} note="Fully exempt at retirement" />
        </OptionalSection>
      )}

      <SalaryResultBox
        grossTotal={result.grossTotal}
        totalExemption={result.totalExemption}
        standardDeduction={result.standardDeduction}
        taxableIncome={result.taxableIncome}
        t={t}
      />

      <AddIncomeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        options={GOVT_OPTIONS}
        active={active}
        onAdd={(selected) => setActive((prev) => new Set([...prev, ...selected] as GovtSection[]))}
      />
    </div>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function OptionalSection({ title, onRemove, children }: {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="section-slide-in mb-4 bg-[#0F1828] border border-[#1E2D47] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1E2D47]">
        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{title}</p>
        <button
          onClick={onRemove}
          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-red-400 transition-colors"
          title="Remove"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Remove
        </button>
      </div>
      <div className="px-4 pt-3 pb-1">
        {children}
      </div>
    </div>
  );
}

const INCOME_ICONS: Record<string, React.ReactNode> = {
  pf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <ellipse cx="12" cy="10" rx="7" ry="5" />
      <path strokeLinecap="round" d="M5 10v4c0 2.8 3.1 5 7 5s7-2.2 7-5v-4" />
      <path strokeLinecap="round" d="M12 6V3M10 3h4" />
    </svg>
  ),
  wppf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path strokeLinecap="round" d="M3 10h18M7 15h2M12 15h2" />
    </svg>
  ),
  gratuity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12V22H4V12" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 7H2v5h20V7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V7M12 7a3 3 0 0 0-3-3 3 3 0 0 0 0 6h3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7a3 3 0 0 1 3-3 3 3 0 0 1 0 6h-3z" />
    </svg>
  ),
  leaveEncashment: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 16l2 2 4-4" />
    </svg>
  ),
  pension: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <circle cx="12" cy="7" r="3" />
      <path strokeLinecap="round" d="M9 13s-2 1-2 4l1 4h8l1-4c0-3-2-4-2-4" />
      <path strokeLinecap="round" d="M14 16l2 2 2-1" />
    </svg>
  ),
};

function AddIncomeModal<T extends string>({
  open, onClose, options, active, onAdd,
}: {
  open: boolean;
  onClose: () => void;
  options: { key: T; label: string; description?: string }[];
  active: Set<T>;
  onAdd: (selected: T[]) => void;
}) {
  const [checked, setChecked] = useState<Set<T>>(new Set());

  if (!open) return null;

  const available = options.filter((o) => !active.has(o.key));

  function toggle(key: T) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  function handleAdd() {
    onAdd([...checked]);
    setChecked(new Set());
    onClose();
  }

  function handleClose() {
    setChecked(new Set());
    onClose();
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* dim overlay */}
      <div className="modal-backdrop absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      {/* card */}
      <div className="modal-card relative bg-[#172035] rounded-2xl border border-[#1E2D47] w-96 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2D47]">
          <h3 className="text-sm font-bold text-slate-100">Add Income Components</h3>
          <button onClick={handleClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Options grid */}
        <div className="px-5 py-4">
          {available.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">All income components are already added.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {available.map((opt) => {
                const isChecked = checked.has(opt.key);
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => toggle(opt.key)}
                    className={`thumb-card aspect-square flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-2 transition-colors ${
                      isChecked
                        ? 'border-[#BBFF47] bg-[#BBFF47]/10 text-[#BBFF47]'
                        : 'border-[#1E2D47] text-slate-400 hover:border-[#BBFF47]/40 hover:text-slate-200'
                    }`}
                  >
                    {INCOME_ICONS[opt.key] ?? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
                        <circle cx="12" cy="12" r="8" />
                      </svg>
                    )}
                    <span className="text-[11px] font-semibold text-center leading-tight">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-sm font-medium border border-[#1E2D47] rounded-xl text-slate-400
                       hover:bg-white/5 hover:border-[#253A5E] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={checked.size === 0}
            className="flex-1 px-4 py-2 text-sm font-semibold bg-[#BBFF47] text-[#0F1828] rounded-xl
                       hover:bg-[#A3E83B] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Add Selected
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function SalaryResultBox({ grossTotal, totalExemption, standardDeduction, taxableIncome, t }: {
  grossTotal: number; totalExemption: number; standardDeduction: number; taxableIncome: number;
  t: (k: string) => string;
}) {
  return (
    <div className="mt-6 bg-[#0F1828] rounded-lg p-4 border border-[#253A5E]">
      <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Salary Computation</p>
      <ReadOnlyRow label="Gross Salary Total" value={grossTotal} />
      <ReadOnlyRow label="Less: Allowable Exemptions" value={-totalExemption} />
      <ReadOnlyRow label={t('salary.standardDeduction') + ' (1/3 or ৳4.5L)'} value={-standardDeduction} />
      <ReadOnlyRow label={t('salary.taxableSalary')} value={taxableIncome} className="font-bold text-brand" />
    </div>
  );
}
