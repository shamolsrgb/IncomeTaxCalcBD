import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { TAX_CONFIG } from '../../config/taxConfig';
import type { TaxpayerCategory, ResidenceArea, EmployerType } from '../../types/tax';

const CATEGORIES: TaxpayerCategory[] = ['general', 'female', 'senior', 'disabled', 'freedomFighter', 'thirdGender'];

function CategoryIcon({ cat }: { cat: TaxpayerCategory }) {
  if (cat === 'general') return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <circle cx="12" cy="8" r="4" /><path strokeLinecap="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
  if (cat === 'female') return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <circle cx="12" cy="8" r="4" /><path strokeLinecap="round" d="M12 13v8M9 18h6" />
    </svg>
  );
  if (cat === 'senior') return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <circle cx="12" cy="7" r="3" /><path strokeLinecap="round" d="M9 13s-2 1-2 4l1 4h8l1-4c0-3-2-4-2-4M10 21h4" /><path strokeLinecap="round" d="M14 16l2 2 2-1" />
    </svg>
  );
  if (cat === 'disabled') return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <circle cx="12" cy="4" r="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M10 8h4l1 5H9l-1 3a5 5 0 1 0 9.2 2" />
    </svg>
  );
  if (cat === 'freedomFighter') return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l2.4 4.9L20 7.6l-4 3.9 1 5.5L12 14.4l-5 2.6 1-5.5L4 7.6l5.6-.7z" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <circle cx="12" cy="8" r="4" /><path strokeLinecap="round" d="M12 13v5M9 16h6M17 3l2-1M5 3l2 1M17 3l-2 2M7 3l2 2" />
    </svg>
  );
}

const EMPLOYER_TYPES: EmployerType[] = ['govt', 'private', 'selfEmployed', 'retired'];

function EmployerIcon({ et }: { et: EmployerType }) {
  if (et === 'govt') return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M12 3L3 10h18L12 3zM6 10v11M10 10v11M14 10v11M18 10v11" />
    </svg>
  );
  if (et === 'private') return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path strokeLinecap="round" d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M12 12v4M10 14h4" />
    </svg>
  );
  if (et === 'selfEmployed') return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <circle cx="12" cy="8" r="4" /><path strokeLinecap="round" d="M6 20v-1a6 6 0 0 1 12 0v1" /><path strokeLinecap="round" d="M16 3.5A4 4 0 0 1 18 7" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <circle cx="12" cy="8" r="4" /><path strokeLinecap="round" d="M6 20v-1a6 6 0 0 1 12 0v1M9 14l1.5 4 1.5-2 1.5 2L15 14" />
    </svg>
  );
}
const AREAS: ResidenceArea[] = ['dhakaCTG', 'otherCity', 'pourashava', 'other'];

export function Step01_TaxpayerProfile() {
  const { t } = useTranslation();
  const { inputs, updateInputs } = useTaxStore();
  const cfg = TAX_CONFIG[inputs.ayKey];

  const threshold = cfg.thresholds[inputs.taxpayerCategory] +
    (inputs.hasDisabledDependent ? cfg.thresholds.disabledDependentExtra : 0);

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-100 mb-4">{t('profile.title')}</h2>

      {/* Taxpayer Category */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-2">{t('profile.category')}</label>
        <div className="grid grid-cols-6 gap-2">
          {CATEGORIES.map((cat) => {
            const active = inputs.taxpayerCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => updateInputs({ taxpayerCategory: cat })}
                className={`thumb-card aspect-square flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-2 transition-colors ${
                  active
                    ? 'border-[#BBFF47] bg-[#BBFF47]/10 text-[#BBFF47]'
                    : 'border-[#1E2D47] text-slate-400 hover:border-[#BBFF47]/40 hover:text-slate-200'
                }`}
              >
                <CategoryIcon cat={cat} />
                <span className="text-[10px] font-semibold text-center leading-tight">
                  {t(`profile.categories.${cat}`)}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-[#BBFF47] font-medium mt-2">
          Tax-free threshold: ৳{threshold.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Disabled Dependent */}
      <label className="flex items-center gap-2 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={inputs.hasDisabledDependent}
          onChange={(e) => updateInputs({ hasDisabledDependent: e.target.checked })}
          className="w-4 h-4 rounded text-brand accent-brand"
        />
        <span className="text-sm text-slate-300">{t('profile.hasDisabledDependent')}</span>
      </label>

      {/* Employer Type */}
      <div className="mb-4 mt-6">
        <div className="border-t border-[#1E2D47] mb-6" />
        <label className="block text-sm font-medium text-slate-300 mb-2">{t('profile.employerType')}</label>
        <div className="grid grid-cols-6 gap-2">
          {EMPLOYER_TYPES.map((et) => {
            const active = inputs.employerType === et;
            return (
              <button
                key={et}
                type="button"
                onClick={() => updateInputs({ employerType: et })}
                className={`thumb-card aspect-square flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-2 transition-colors ${
                  active
                    ? 'border-[#BBFF47] bg-[#BBFF47]/10 text-[#BBFF47]'
                    : 'border-[#1E2D47] text-slate-400 hover:border-[#BBFF47]/40 hover:text-slate-200'
                }`}
              >
                <EmployerIcon et={et} />
                <span className="text-[10px] font-semibold text-center leading-tight">
                  {t(`profile.employerTypes.${et}`)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Residence Area */}
      <div className="mb-4 mt-6">
        <div className="border-t border-[#1E2D47] mb-6" />
        <label className="block text-sm font-medium text-slate-300 mb-2">{t('profile.residenceArea')}</label>
        <select
          value={inputs.residenceArea}
          onChange={(e) => updateInputs({ residenceArea: e.target.value as ResidenceArea })}
          className="w-full px-3 py-2 border border-[#253A5E] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        >
          {AREAS.map((area) => (
            <option key={area} value={area}>{t(`profile.residenceAreas.${area}`)}</option>
          ))}
        </select>
        <p className="text-xs text-slate-500 mt-1">
          Minimum tax: ৳{TAX_CONFIG[inputs.ayKey].minimumTax[inputs.residenceArea].toLocaleString('en-IN')}
        </p>
      </div>

    </div>
  );
}
