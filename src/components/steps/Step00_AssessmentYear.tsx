import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { TAX_CONFIG } from '../../config/taxConfig';
import type { AYKey } from '../../types/tax';

const AY_KEYS: AYKey[] = ['2025-26', '2024-25', '2023-24'];

export function Step00_AssessmentYear() {
  const { t } = useTranslation();
  const { inputs, updateInputs } = useTaxStore();

  const isPriorAY = inputs.ayKey !== '2025-26';
  const cfg = TAX_CONFIG[inputs.ayKey];

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-100 mb-1">{t('assessmentYear.title')}</h2>
      <p className="text-sm text-slate-500 mb-6">{cfg.incomePeriod}</p>

      {/* Prior AY banner */}
      {isPriorAY && (
        <div className="mb-4 bg-amber-900/20 border border-amber-700/40 rounded-lg p-3 text-sm text-amber-300">
          {t('assessmentYear.priorAYBanner', { ay: cfg.label })}
        </div>
      )}

      {/* Assessment Year */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {t('assessmentYear.selectAY')}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {AY_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => updateInputs({ ayKey: key })}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                inputs.ayKey === key
                  ? 'border-[#BBFF47] bg-[#BBFF47]/15 text-[#BBFF47]'
                  : 'border-[#1E2D47] text-slate-300 hover:border-[#BBFF47]/50 hover:bg-[#BBFF47]/5'
              }`}
            >
              {TAX_CONFIG[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Resident / NRB */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {t('assessmentYear.taxpayerType')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['resident', 'nrb'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => updateInputs({ taxpayerType: type })}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                inputs.taxpayerType === type
                  ? 'border-[#BBFF47]/60 bg-[#BBFF47]/10'
                  : 'border-[#1E2D47] hover:border-brand'
              }`}
            >
              <p className={`text-sm font-semibold ${inputs.taxpayerType === type ? 'text-brand' : 'text-slate-100'}`}>
                {t(`assessmentYear.${type}`)}
              </p>
              {type === 'nrb' && (
                <p className="text-xs text-slate-500 mt-1">{t('assessmentYear.nrbNote')}</p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
