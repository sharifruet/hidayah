import { useApp } from '../../context/AppContext.jsx';
import { tr } from '../../i18n/translations.js';
import { localDigits } from '../../utils/format.js';

export default function Footer() {
  const { language } = useApp();
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto hidden sm:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© {localDigits(new Date().getFullYear(), language)} {tr('app_name', language)}</p>
          <p className="mt-2">{tr('ct_footer_tagline', language)}</p>
        </div>
      </div>
    </footer>
  );
}
