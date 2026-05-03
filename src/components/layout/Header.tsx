import { useTranslation } from 'react-i18next';
import { LanguageToggle } from '../ui/LanguageToggle';
import { useTaxStore } from '../../store/useTaxStore';
import { TAX_CONFIG } from '../../config/taxConfig';

export function Header() {
  const { t } = useTranslation();
  const { inputs, resetDraft } = useTaxStore();
  const cfg = TAX_CONFIG[inputs.ayKey];

  return (
    <header className="bg-brand text-white px-4 py-3 flex items-center justify-between shadow-md no-print">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-brand font-bold text-xs">৳</span>
        </div>
        <div>
          <h1 className="text-sm font-bold leading-tight">{t('appName')}</h1>
          <p className="text-xs text-brand-100 hidden sm:block">{cfg.label} · {t('appSubtitle')}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <LanguageToggle />
        <button
          onClick={resetDraft}
          className="hidden sm:block px-3 py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          {t('newCalculation')}
        </button>
      </div>
    </header>
  );
}
