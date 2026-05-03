import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { CurrencyInput } from '../ui/CurrencyInput';
import { formatBDT } from '../../utils/currency';
import { holdingYearsDisplay } from '../../utils/date';
import type { CapitalGainEntry, CapitalAssetType } from '../../types/tax';

const ASSET_TYPES: CapitalAssetType[] = ['landBuilding', 'listedShares', 'nonListedShares', 'mutualFund', 'other'];

function newEntry(): CapitalGainEntry {
  return {
    id: crypto.randomUUID(),
    assetType: 'landBuilding',
    acquisitionDate: '',
    saleDate: '',
    acquisitionCost: 0,
    salePrice: 0,
    description: '',
  };
}

export function Step07_CapitalGains() {
  const { t } = useTranslation();
  const { inputs, updateInputs, result } = useTaxStore();

  function addEntry() {
    updateInputs({ capitalGains: [...inputs.capitalGains, newEntry()] });
  }

  function updateEntry(id: string, partial: Partial<CapitalGainEntry>) {
    updateInputs({
      capitalGains: inputs.capitalGains.map((e) =>
        e.id === id ? { ...e, ...partial } : e
      ),
    });
  }

  function removeEntry(id: string) {
    updateInputs({ capitalGains: inputs.capitalGains.filter((e) => e.id !== id) });
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-2">{t('capitalGains.title')}</h2>
      <p className="text-xs text-slate-500 mb-4">
        Land/Building held &gt;5 years: 15% flat. Listed shares: first ৳50L exempt, 10% above.
      </p>

      {inputs.capitalGains.map((entry, idx) => {
        const cgr = result.capitalGainResults.find((r) => r.id === entry.id);
        const gain = entry.salePrice - entry.acquisitionCost;
        return (
          <div key={entry.id} className="border border-slate-200 rounded-lg p-4 mb-4 bg-slate-50">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-semibold text-slate-700">Asset {idx + 1}</p>
              <button onClick={() => removeEntry(entry.id)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('capitalGains.assetType')}</label>
              <select
                value={entry.assetType}
                onChange={(e) => updateEntry(entry.id, { assetType: e.target.value as CapitalAssetType })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand"
              >
                {ASSET_TYPES.map((at) => (
                  <option key={at} value={at}>{t(`capitalGains.assetTypes.${at}`)}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('capitalGains.acquisitionDate')}</label>
                <input
                  type="date"
                  value={entry.acquisitionDate}
                  onChange={(e) => updateEntry(entry.id, { acquisitionDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('capitalGains.saleDate')}</label>
                <input
                  type="date"
                  value={entry.saleDate}
                  onChange={(e) => updateEntry(entry.id, { saleDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>

            {entry.acquisitionDate && entry.saleDate && (
              <p className="text-xs text-slate-500 mb-2">
                Holding: {holdingYearsDisplay(entry.acquisitionDate, entry.saleDate)}
                {cgr?.isLongTerm ? ' (Long-term)' : ' (Short-term)'}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <CurrencyInput
                label={t('capitalGains.acquisitionCost')}
                value={entry.acquisitionCost}
                onChange={(v) => updateEntry(entry.id, { acquisitionCost: v })}
              />
              <CurrencyInput
                label={t('capitalGains.salePrice')}
                value={entry.salePrice}
                onChange={(v) => updateEntry(entry.id, { salePrice: v })}
              />
            </div>

            {(entry.acquisitionCost > 0 || entry.salePrice > 0) && (
              <div className={`mt-2 text-sm font-semibold ${gain >= 0 ? 'text-brand' : 'text-red-600'}`}>
                {t('capitalGains.gain')}: {formatBDT(gain)}
                {cgr && cgr.exemption > 0 && (
                  <span className="text-xs text-slate-500 font-normal ml-2">(Exempt: {formatBDT(cgr.exemption)}, Taxable: {formatBDT(cgr.taxableGain)})</span>
                )}
              </div>
            )}

            <input
              type="text"
              value={entry.description ?? ''}
              onChange={(e) => updateEntry(entry.id, { description: e.target.value })}
              placeholder={t('capitalGains.description')}
              className="mt-3 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        );
      })}

      <button
        onClick={addEntry}
        className="w-full py-3 border-2 border-dashed border-brand text-brand text-sm font-medium rounded-lg hover:bg-brand-50 transition-colors mb-4"
      >
        + {t('capitalGains.addAsset')}
      </button>

      <CurrencyInput
        label={t('capitalGains.priorYearLoss')}
        value={inputs.priorYearCapitalLoss}
        onChange={(v) => updateInputs({ priorYearCapitalLoss: v })}
        note="Capital loss carried forward from previous assessment years (up to 6 years)"
      />

      {result.capitalLossCarryForward > 0 && (
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
          Net capital loss {formatBDT(result.capitalLossCarryForward)} can be carried forward to next AY.
        </div>
      )}
    </div>
  );
}
