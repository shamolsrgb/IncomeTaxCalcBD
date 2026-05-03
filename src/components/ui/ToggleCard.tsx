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
    <div className={`border rounded-lg mb-3 ${open ? 'border-brand bg-brand-50' : 'border-slate-200 bg-white'}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left"
        aria-expanded={open}
      >
        <div>
          <span className="font-medium text-sm text-slate-800">{title}</span>
          {description && !open && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
        <span className={`text-brand transition-transform ${open ? 'rotate-180' : ''} text-xl leading-none`}>
          ›
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-slate-200">
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
        onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? onChange(!checked) : null}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand ${
          checked ? 'bg-brand' : 'bg-slate-300'
        }`}
      >
        <span className={`inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transform transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0.5'
        }`} />
      </div>
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}
