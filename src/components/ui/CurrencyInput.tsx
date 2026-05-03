import { useState, useEffect } from 'react';
import { formatBDT } from '../../utils/currency';

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  tooltip?: string;
  note?: string;
  badge?: string; // e.g. "Auto: ৳1,20,000 exempt"
  id?: string;
  disabled?: boolean;
  min?: number;
}

export function CurrencyInput({ label, value, onChange, tooltip, note, badge, id, disabled, min = 0 }: Props) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  const [raw, setRaw] = useState(value === 0 ? '' : String(value));

  useEffect(() => {
    setRaw(value === 0 ? '' : String(value));
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/[^\d]/g, '');
    setRaw(v);
    onChange(v === '' ? 0 : Math.max(min, parseInt(v, 10)));
  }

  return (
    <div className="mb-4">
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
        {tooltip && (
          <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-slate-500 text-xs cursor-help" title={tooltip}>?</span>
        )}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-sm select-none">৳</span>
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          value={raw}
          onChange={handleChange}
          disabled={disabled}
          placeholder="0"
          className={`w-full pl-7 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent ${
            disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white border-slate-300'
          }`}
          aria-label={label}
        />
      </div>
      {badge && (
        <p className="mt-1 text-xs text-brand font-medium">{badge}</p>
      )}
      {note && (
        <p className="mt-1 text-xs text-slate-500">{note}</p>
      )}
    </div>
  );
}

interface ReadOnlyRowProps {
  label: string;
  value: number;
  className?: string;
}

export function ReadOnlyRow({ label, value, className = '' }: ReadOnlyRowProps) {
  return (
    <div className={`flex justify-between items-center py-2 border-b border-slate-100 text-sm ${className}`}>
      <span className="text-slate-600">{label}</span>
      <span className="font-medium text-slate-900">{formatBDT(value)}</span>
    </div>
  );
}
