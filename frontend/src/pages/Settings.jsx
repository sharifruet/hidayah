import { useApp } from '../context/AppContext.jsx';
import { getMethods } from '../services/locationService.js';
import { useQuery } from '@tanstack/react-query';
import { tr, LANGUAGE_LABELS } from '../i18n/translations.js';

export default function Settings() {
  const {
    location, method, language,
    updateMethod, setLanguage, supportedLanguages,
    darkMode, toggleDarkMode,
  } = useApp();

  const { data: methodsData, isLoading } = useQuery({
    queryKey: ['methods'],
    queryFn: getMethods,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tr('settings_title', language)}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{tr('settings_subtitle', language)}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
          {/* Dark mode */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {language === 'bn' ? 'ডার্ক মোড' : 'Dark Mode'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {language === 'bn' ? 'রাতের জন্য উপযুক্ত থিম' : 'Easy on the eyes at night'}
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              role="switch"
              aria-checked={darkMode}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700" />

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {tr('settings_language', language)}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {supportedLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  dir={lang === 'ur' ? 'rtl' : 'ltr'}
                  className={`px-3 py-2.5 rounded-lg border text-sm font-medium text-center transition-colors ${
                    language === lang
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {LANGUAGE_LABELS[lang]}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">{tr('settings_language_note', language)}</p>
          </div>

          {/* Calculation method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {tr('settings_calc_method', language)}
            </label>
            {isLoading ? (
              <p className="text-gray-500 dark:text-gray-400">{tr('loading', language)}</p>
            ) : (
              <select
                value={method}
                onChange={(e) => updateMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {methodsData?.methods?.map((m) => (
                  <option key={m.code} value={m.code}>
                    {m.name} {m.is_default && '(Default)'}
                  </option>
                )) || (
                  <>
                    <option value="karachi">Karachi</option>
                    <option value="mwl">MWL</option>
                    <option value="isna">ISNA</option>
                    <option value="umm_al_qura">Umm Al-Qura</option>
                    <option value="hanafi">Hanafi</option>
                  </>
                )}
              </select>
            )}
            <p className="mt-1 text-sm text-gray-500">{tr('settings_calc_note', language)}</p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {tr('settings_location', language)}
            </label>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <p className="font-semibold text-gray-900 dark:text-gray-100">{location.name || 'Unknown'}</p>
              {location.district && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{location.district}, {location.division}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
