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
      <h2 className="text-lg font-bold text-slate-800 mb-1">{t('assessmentYear.title')}</h2>
      <p className="text-sm text-slate-500 mb-6">{cfg.incomePeriod}</p>

      {/* Prior AY banner */}
      {isPriorAY && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
          {t('assessmentYear.priorAYBanner', { ay: cfg.label })}
        </div>
      )}

      {/* Assessment Year */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
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
                  ? 'border-brand bg-brand text-white'
                  : 'border-slate-200 text-slate-700 hover:border-brand hover:bg-brand-50'
              }`}
            >
              {TAX_CONFIG[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Resident / NRB */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
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
                  ? 'border-brand bg-brand-50'
                  : 'border-slate-200 hover:border-brand'
              }`}
            >
              <p className={`text-sm font-semibold ${inputs.taxpayerType === type ? 'text-brand' : 'text-slate-800'}`}>
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
