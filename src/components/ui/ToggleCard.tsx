import { useState, type ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function ToggleCard({ title, description, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`border rounded-xl mb-3 overflow-hidden ${
      open ? 'border-[rgba(187,255,71,0.3)] bg-[rgba(187,255,71,0.04)]' : 'border-[#1E2D47] bg-[#0F1828]/40'
    }`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left"
        aria-expanded={open}
      >
        <div>
          <span className="font-medium text-sm text-slate-200">{title}</span>
          {description && !open && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-[#1E2D47]">
          {children}
        </div>
      )}
    </div>
  );
}

interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  id?: string;
}

export function Switch({ label, checked, onChange, id }: SwitchProps) {
  const switchId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <label htmlFor={switchId} className="flex items-center gap-3 cursor-pointer py-2">
      <div
        role="switch"
        aria-checked={checked}
        id={switchId}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ' ? onChange(!checked) : null)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#BBFF47] ${
          checked ? 'bg-[#BBFF47]' : 'bg-[#1E2D47]'
        }`}
      >
        <span className={`inline-block h-4 w-4 mt-0.5 rounded-full shadow transform transition-transform ${
          checked ? 'translate-x-4 bg-[#0F1828]' : 'translate-x-0.5 bg-slate-400'
        }`} />
      </div>
      <span className="text-sm text-slate-300">{label}</span>
    </label>
  );
}
