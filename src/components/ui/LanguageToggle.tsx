import { useTranslation } from 'react-i18next';

export function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const isBn = i18n.language === 'bn';

  function toggle() {
    i18n.changeLanguage(isBn ? 'en' : 'bn');
  }

  return (
    <button
      onClick={toggle}
      className="px-3 py-1.5 text-sm font-medium border border-brand text-brand rounded-lg hover:bg-brand-50 transition-colors"
      aria-label="Switch language"
    >
      {t('switchLanguage')}
    </button>
  );
}
