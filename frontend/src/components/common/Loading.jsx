import { useAppLocale } from '../../context/AppContext.jsx';
import { tr } from '../../i18n/translations.js';

export default function Loading({ message }) {
  const { language } = useAppLocale();
  return (
    <div className="flex items-center justify-center p-8" role="status">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">{message || tr('loading', language)}</p>
      </div>
    </div>
  );
}
