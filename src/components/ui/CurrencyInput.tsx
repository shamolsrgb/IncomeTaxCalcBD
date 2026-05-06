import { useState, useEffect, useRef } from 'react';
import { formatBDT } from '../../utils/currency';
import gsap from 'gsap';

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  tooltip?: string;
  note?: string;
  badge?: string;
  id?: string;
  disabled?: boolean;
  min?: number;
}

export function CurrencyInput({ label, value, onChange, tooltip, note, badge, id, disabled, min = 0 }: Props) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  const [raw, setRaw] = useState(value === 0 ? '' : String(value));
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRaw(value === 0 ? '' : String(value));
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/[^\d]/g, '');
    setRaw(v);
    onChange(v === '' ? 0 : Math.max(min, parseInt(v, 10)));
  }

  function handleFocus() {
    if (wrapperRef.current && !disabled) {
      gsap.to(wrapperRef.current, { scale: 1.01, duration: 0.2, ease: 'power2.out' });
    }
  }

  function handleBlur() {
    if (wrapperRef.current) {
      gsap.to(wrapperRef.current, { scale: 1, duration: 0.25, ease: 'elastic.out(1, 0.5)' });
    }
  }

  return (
    <div className="mb-4">
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-300 mb-1">
        {label}
        {tooltip && (
          <span
            className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#1E2D47] text-slate-400 text-xs cursor-help"
            title={tooltip}
          >?</span>
        )}
      </label>
      <div ref={wrapperRef} className="relative" style={{ transformOrigin: 'left center' }}>
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm select-none">৳</span>
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          value={raw === '' ? '' : parseInt(raw, 10).toLocaleString('en-IN')}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder="0"
          className={`w-full pl-7 pr-3 py-2 rounded-lg text-sm border focus:outline-none transition-all ${
            disabled
              ? 'bg-[#0F1828]/50 text-slate-500 cursor-not-allowed border-[#1E2D47] opacity-60'
              : 'bg-[#0F1828] border-[#1E2D47] text-slate-100 focus:border-[rgba(187,255,71,0.5)] focus:ring-2 focus:ring-[rgba(187,255,71,0.12)]'
          }`}
          aria-label={label}
        />
      </div>
      {badge && <p className="mt-1 text-xs text-[#BBFF47] font-medium">{badge}</p>}
      {note && <p className="mt-1 text-xs text-slate-500">{note}</p>}
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
    <div className={`flex justify-between items-center py-2 border-b border-[#1E2D47] text-sm ${className}`}>
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-200">{formatBDT(value)}</span>
    </div>
  );
}
