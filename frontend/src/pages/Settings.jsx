import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { getMethods } from '../services/locationService.js';
import { useQuery } from '@tanstack/react-query';
import { fmt, tr, LANGUAGE_LABELS } from '../i18n/translations.js';
import { formatHijriDate, gregorianToHijri, HIJRI_OFFSET_RANGE } from '../utils/hijri.js';
import { formatTime, localDigits } from '../utils/format.js';
import { placeName, placeRegion } from '../utils/place.js';

const TIME_FORMATS = [
  { value: '12h', key: 'settings_time_format_12h' },
  { value: '24h', key: 'settings_time_format_24h' },
];

// Sample times for the time-format preview.
const EXAMPLE_FAJR = '04:52';
const EXAMPLE_MAGHRIB = '18:10';

export default function Settings() {
  const {
    location, method, language,
    updateMethod, setLanguage, supportedLanguages,
    darkMode, toggleDarkMode, hijriOffset, setHijriOffset,
    timeFormat, setTimeFormat,
  } = useApp();
  const hijriToday = gregorianToHijri(new Date(), hijriOffset);

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
                {tr('ct_dark_mode', language)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {tr('ct_dark_mode_note', language)}
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              role="switch"
              aria-checked={darkMode}
              aria-label={tr('ct_dark_mode', language)}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${darkMode ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-1 rtl:-translate-x-1'}`} />
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

          {/* Hijri moon-sighting adjustment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {tr('settings_hijri_offset', language)}
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{tr('settings_hijri_offset_note', language)}</p>
            <div className="flex flex-wrap gap-2">
              {HIJRI_OFFSET_RANGE.map((d) => (
                <button
                  key={d}
                  onClick={() => setHijriOffset(d)}
                  className={`w-14 px-3 py-2 rounded-lg border text-sm font-medium ${
                    hijriOffset === d
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-400'
                  }`}
                >
                  {localDigits(d > 0 ? `+${d}` : d, language)}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {fmt('settings_hijri_today', language, { date: formatHijriDate(hijriToday, language) })}
            </p>
          </div>

          {/* Time format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {tr('settings_time_format', language)}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TIME_FORMATS.map(({ value, key }) => (
                <button
                  key={value}
                  onClick={() => setTimeFormat(value)}
                  aria-pressed={timeFormat === value}
                  className={`px-3 py-2.5 rounded-lg border text-sm font-medium text-center transition-colors ${
                    timeFormat === value
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="block">{tr(key, language)}</span>
                  <span className={`block text-xs font-normal mt-0.5 ${timeFormat === value ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                    {formatTime(EXAMPLE_MAGHRIB, language, value)}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {tr('settings_time_format_example', language)}: {tr('prayer_fajr', language)} {formatTime(EXAMPLE_FAJR, language, timeFormat)}
              {' · '}
              {tr('prayer_maghrib', language)} {formatTime(EXAMPLE_MAGHRIB, language, timeFormat)}
            </p>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700" />

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
                    {m.name}{m.is_default ? ` (${tr('methods_default_badge', language)})` : ''}
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
            <Link to="/methods" className="mt-2 inline-block text-sm font-medium text-primary-600 dark:text-green-400 hover:underline">
              {tr('settings_view_methods', language)}
            </Link>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {tr('settings_location', language)}
            </label>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <p className="font-semibold text-gray-900 dark:text-gray-100">{placeName(location, language) || tr('ct_unknown_location', language)}</p>
              {placeRegion(location, language) && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{placeRegion(location, language)}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {localDigits(`${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`, language)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
