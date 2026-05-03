import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { CurrencyInput } from '../ui/CurrencyInput';
import { isSenior } from '../../utils/date';
import { TAX_CONFIG } from '../../config/taxConfig';
import type { TaxpayerCategory, ResidenceArea, EmployerType } from '../../types/tax';

const CATEGORIES: TaxpayerCategory[] = ['general', 'female', 'senior', 'disabled', 'freedomFighter', 'thirdGender'];
const EMPLOYER_TYPES: EmployerType[] = ['govt', 'private', 'selfEmployed', 'retired'];
const AREAS: ResidenceArea[] = ['dhakaCTG', 'otherCity', 'pourashava', 'other'];

export function Step01_TaxpayerProfile() {
  const { t } = useTranslation();
  const { inputs, updateInputs } = useTaxStore();
  const cfg = TAX_CONFIG[inputs.ayKey];

  const threshold = cfg.thresholds[inputs.taxpayerCategory] +
    (inputs.hasDisabledDependent ? cfg.thresholds.disabledDependentExtra : 0);

  function handleDOB(dob: string) {
    const updates: Partial<typeof inputs> = { dateOfBirth: dob };
    if (isSenior(dob) && inputs.taxpayerCategory === 'general') {
      updates.taxpayerCategory = 'senior';
    }
    updateInputs(updates);
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-4">{t('profile.title')}</h2>

      {/* Name + TIN */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('profile.fullName')}</label>
          <input
            type="text"
            value={(inputs as any).fullName ?? ''}
            onChange={(e) => updateInputs({ fullName: e.target.value } as any)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('profile.tin')}</label>
          <input
            type="text"
            value={(inputs as any).tin ?? ''}
            onChange={(e) => updateInputs({ tin: e.target.value } as any)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            placeholder={t('profile.tinPlaceholder')}
            maxLength={12}
          />
        </div>
      </div>

      {/* Date of Birth */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('profile.dob')}</label>
        <input
          type="date"
          value={inputs.dateOfBirth}
          onChange={(e) => handleDOB(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      {/* Taxpayer Category */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile.category')}</label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => updateInputs({ taxpayerCategory: cat })}
              className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-colors ${
                inputs.taxpayerCategory === cat
                  ? 'border-brand bg-brand-50 text-brand'
                  : 'border-slate-200 text-slate-700 hover:border-brand'
              }`}
            >
              {t(`profile.categories.${cat}`)}
            </button>
          ))}
        </div>
        <p className="text-xs text-brand font-medium mt-2">
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
        <span className="text-sm text-slate-700">{t('profile.hasDisabledDependent')}</span>
      </label>

      {/* Employer Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile.employerType')}</label>
        <div className="grid grid-cols-2 gap-2">
          {EMPLOYER_TYPES.map((et) => (
            <button
              key={et}
              type="button"
              onClick={() => updateInputs({ employerType: et })}
              className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-colors ${
                inputs.employerType === et
                  ? 'border-brand bg-brand-50 text-brand'
                  : 'border-slate-200 text-slate-700 hover:border-brand'
              }`}
            >
              {t(`profile.employerTypes.${et}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Residence Area */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">{t('profile.residenceArea')}</label>
        <select
          value={inputs.residenceArea}
          onChange={(e) => updateInputs({ residenceArea: e.target.value as ResidenceArea })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        >
          {AREAS.map((area) => (
            <option key={area} value={area}>{t(`profile.residenceAreas.${area}`)}</option>
          ))}
        </select>
        <p className="text-xs text-slate-500 mt-1">
          Minimum tax: ৳{TAX_CONFIG[inputs.ayKey].minimumTax[inputs.residenceArea].toLocaleString('en-IN')}
        </p>
      </div>

      {/* Net Wealth */}
      <CurrencyInput
        label={t('profile.netWealth')}
        value={inputs.netWealth}
        onChange={(v) => updateInputs({ netWealth: v })}
        tooltip={t('tooltipSurcharge')}
        note="Used to compute surcharge on net wealth above ৳4 crore"
      />
    </div>
  );
}
