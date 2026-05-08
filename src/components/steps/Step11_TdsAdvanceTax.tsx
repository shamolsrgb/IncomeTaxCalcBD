import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTaxStore } from '../../store/useTaxStore';
import { CurrencyInput } from '../ui/CurrencyInput';

const VEHICLE_AIT_OPTIONS = [
  { label: 'Up to 1500cc', value: 25000 },
  { label: '1501cc – 2000cc', value: 50000 },
  { label: '2001cc – 2500cc', value: 75000 },
  { label: '2501cc – 3000cc', value: 125000 },
  { label: '3001cc – 3500cc', value: 150000 },
  { label: 'Above 3500cc', value: 200000 },
  { label: 'Microbus', value: 30000 },
];

export function Step11_TdsAdvanceTax() {
  const { t } = useTranslation();
  const { inputs, updateTdsCredits, updateInputs } = useTaxStore();
  const tds = inputs.tdsCredits;
  const [hasVehicle, setHasVehicle] = useState((tds.vehicleAIT ?? 0) > 0);

  const autoBankTDS = Math.round(inputs.securities.bankFdrInterest * 0.10);
  const autoSanchTDS = Math.round(inputs.securities.sanchayapatraInterest * 0.10);

  function handleVehicleToggle(on: boolean) {
    setHasVehicle(on);
    if (!on) updateTdsCredits({ vehicleAIT: 0 });
  }

  function handleEngineSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    updateTdsCredits({ vehicleAIT: Number(e.target.value) });
  }

  const selectedOption = VEHICLE_AIT_OPTIONS.find(o => o.value === (tds.vehicleAIT ?? 0));

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-100 mb-4">{t('tds.title')}</h2>

      <div className="grid grid-cols-2 gap-x-4">
        <CurrencyInput
          label={t('tds.salary')}
          value={tds.salary}
          onChange={(v) => updateTdsCredits({ salary: v })}
          note="Total TDS deducted from salary by employer during the year"
        />
        <CurrencyInput
          label={t('tds.bankInterest')}
          value={tds.bankInterest}
          onChange={(v) => updateTdsCredits({ bankInterest: v })}
          note={autoBankTDS > 0 ? `Auto-computed: ৳${autoBankTDS.toLocaleString('en-IN')} (@10%) — enter actual if different` : undefined}
          badge={tds.bankInterest === 0 && autoBankTDS > 0 ? `Will use auto ৳${autoBankTDS.toLocaleString('en-IN')}` : undefined}
        />
        <CurrencyInput
          label={t('tds.sanchayapatraInterest')}
          value={tds.sanchayapatraInterest}
          onChange={(v) => updateTdsCredits({ sanchayapatraInterest: v })}
          note={autoSanchTDS > 0 ? `Auto-computed: ৳${autoSanchTDS.toLocaleString('en-IN')} (@10%)` : undefined}
          badge={tds.sanchayapatraInterest === 0 && autoSanchTDS > 0 ? `Will use auto ৳${autoSanchTDS.toLocaleString('en-IN')}` : undefined}
        />
        <CurrencyInput label={t('tds.houseRent')} value={tds.houseRent} onChange={(v) => updateTdsCredits({ houseRent: v })} note="TDS deducted by tenant @5% on rent received" />
        <CurrencyInput label={t('tds.professional')} value={tds.professional} onChange={(v) => updateTdsCredits({ professional: v })} note="TDS on professional/consultancy income @10%" />
        <CurrencyInput label={t('tds.dividend')} value={tds.dividend} onChange={(v) => updateTdsCredits({ dividend: v })} />
        <CurrencyInput label={t('tds.other')} value={tds.other} onChange={(v) => updateTdsCredits({ other: v })} />
      </div>

      {/* Vehicle AIT */}
      <div className="mt-4 border border-[#1E2D47] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-[#0F1828]">
          <div>
            <p className="text-sm font-semibold text-slate-200">Annual AIT — Vehicle</p>
            <p className="text-xs text-slate-500 mt-0.5">Advance income tax paid on vehicle registration / fitness renewal</p>
          </div>
          <button
            type="button"
            onClick={() => handleVehicleToggle(!hasVehicle)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
              hasVehicle ? 'bg-[#BBFF47]' : 'bg-[#1E2D47]'
            }`}
            aria-pressed={hasVehicle}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                hasVehicle ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {hasVehicle && (
          <div className="px-4 py-4 section-slide-in grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#1E2D47]">
            <div className="mb-1">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Engine Capacity</label>
              <select
                value={tds.vehicleAIT ?? 0}
                onChange={handleEngineSelect}
                className="input-field"
              >
                <option value={0}>— Select engine capacity —</option>
                {VEHICLE_AIT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label} — ৳{o.value.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-1">
              <label className="block text-sm font-medium text-slate-300 mb-1.5">AIT Amount</label>
              <div className="flex items-center h-10 px-3 rounded-lg border border-[#1E2D47] bg-[#0F1828] text-sm text-slate-300">
                {selectedOption ? `৳${selectedOption.value.toLocaleString('en-IN')}` : '—'}
              </div>
              <p className="text-xs text-slate-500 mt-1">Auto-filled from engine capacity selection</p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[#1E2D47] pt-4 mt-4">
        <CurrencyInput
          label={t('tds.advanceTax')}
          value={inputs.advanceTax}
          onChange={(v) => updateInputs({ advanceTax: v })}
          note="Total advance tax paid in 3 instalments (15 Sep, 15 Dec, 15 Mar)"
        />
      </div>
    </div>
  );
}
