import { useState } from 'react';
import { tr } from '../../i18n/translations.js';
import { localDigits } from '../../utils/format.js';
import ErrorMessage from '../common/ErrorMessage.jsx';

const TRANSLITERATION_EDITION = 'en.transliteration';

const LANG_TRANSLATION_MAP = {
  bn: 'bn.bengali',
  ur: 'ur.ahmedali',
  tr: 'tr.diyanet',
  id: 'id.indonesian',
  en: 'en.sahih',
};

export default function ReaderSettingsDrawer({
  open,
  onClose,
  settings,
  onSettingsChange,
  availableTranslations,
  availableReciters,
  translationsError,
  onRetryTranslations,
  recitersError,
  onRetryReciters,
  language,
}) {
  const [tab, setTab] = useState('display');

  if (!open) return null;

  function toggle(key, value) {
    onSettingsChange({ ...settings, [key]: value });
  }

  function toggleTranslation(id) {
    const current = settings.selectedTranslations || ['en.sahih'];
    const next = current.includes(id)
      ? current.filter((t) => t !== id)
      : [...current, id];
    const realTranslations = next.filter((t) => t !== TRANSLITERATION_EDITION);
    if (realTranslations.length === 0) return;
    toggle('selectedTranslations', next);
  }

  function toggleTransliteration() {
    const current = settings.selectedTranslations || ['en.sahih'];
    const has = current.includes(TRANSLITERATION_EDITION);
    toggle(
      'selectedTranslations',
      has
        ? current.filter((t) => t !== TRANSLITERATION_EDITION)
        : [...current, TRANSLITERATION_EDITION]
    );
  }

  const hasTransliteration = (settings.selectedTranslations || []).includes(TRANSLITERATION_EDITION);
  const translations = availableTranslations || [];
  const reciters = availableReciters || [];

  const popularLangs = ['en', 'bn', 'ur', 'tr', 'fr', 'id'];
  const prioritised = [language, ...popularLangs.filter((l) => l !== language)];
  const popular = translations
    .filter((t) => prioritised.includes(t.language))
    .sort((a, b) => prioritised.indexOf(a.language) - prioritised.indexOf(b.language));

  const tabs = [
    { id: 'display',      labelKey: 'qr_tab_display' },
    { id: 'translations', labelKey: 'qr_tab_translations' },
    { id: 'audio',        labelKey: 'qr_tab_audio' },
  ];

  const repeatCount = settings.repeatCount || 1;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} aria-hidden="true" />

      <aside
        className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700"
        role="dialog"
        aria-label={tr('qr_reader_settings', language)}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            {tr('settings_title', language)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            aria-label={tr('qr_close', language)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tr(t.labelKey, language)}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-white dark:bg-gray-900">

          {/* ── Display tab ── */}
          {tab === 'display' && (
            <>
              {/* Font size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {tr('qr_font_size', language)}
                </label>
                <div className="flex gap-2">
                  {['sm', 'md', 'lg', 'xl'].map((s) => (
                    <button
                      key={s}
                      onClick={() => toggle('fontSize', s)}
                      className={`flex-1 py-1.5 text-sm rounded border transition-colors ${
                        settings.fontSize === s
                          ? 'bg-green-600 text-white border-green-600'
                          : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-400 dark:hover:border-green-500 dark:bg-gray-800'
                      }`}
                    >
                      {tr(`qr_font_${s}`, language)}
                    </button>
                  ))}
                </div>
              </div>

              <ToggleRow
                label={tr('qr_show_translation', language)}
                value={settings.showTranslation !== false}
                onChange={(v) => toggle('showTranslation', v)}
              />

              <ToggleRow
                label={tr('qr_transliteration', language)}
                description={tr('qr_transliteration_desc', language)}
                value={hasTransliteration}
                onChange={toggleTransliteration}
              />

              <ToggleRow
                label={tr('qr_word_by_word', language)}
                description={tr('qr_word_by_word_desc', language)}
                value={settings.wordByWord === true}
                onChange={(v) => toggle('wordByWord', v)}
              />

              <ToggleRow
                label={tr('quran_tafsir', language)}
                description={tr('qr_tafsir_desc', language)}
                value={settings.showTafsir === true}
                onChange={(v) => toggle('showTafsir', v)}
              />

              <ToggleRow
                label={tr('qr_memorisation_mode', language)}
                description={tr('qr_memorisation_desc', language)}
                value={settings.memorisationMode === true}
                onChange={(v) => toggle('memorisationMode', v)}
              />

              {settings.memorisationMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {tr('qr_repeat_each', language)}
                    <span className="ms-1 text-gray-400 dark:text-gray-500 font-normal">({localDigits(repeatCount, language)}×)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggle('repeatCount', Math.max(1, repeatCount - 1))}
                      disabled={repeatCount <= 1}
                      aria-label={tr('qr_decrease', language)}
                      className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-green-400 disabled:opacity-40 flex items-center justify-center text-lg dark:bg-gray-800"
                    >−</button>
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-100 w-8 text-center">{localDigits(repeatCount, language)}</span>
                    <button
                      onClick={() => toggle('repeatCount', Math.min(20, repeatCount + 1))}
                      disabled={repeatCount >= 20}
                      aria-label={tr('qr_increase', language)}
                      className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-green-400 disabled:opacity-40 flex items-center justify-center text-lg dark:bg-gray-800"
                    >+</button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Translations tab ── */}
          {tab === 'translations' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {tr('qr_select_one_translation', language)}
                </p>
                <button
                  onClick={() => {
                    const def = LANG_TRANSLATION_MAP[language] || 'en.sahih';
                    toggle('selectedTranslations', [def]);
                  }}
                  className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                >
                  {tr('qr_reset', language)}
                </button>
              </div>
              {translationsError && !popular.length && (
                <ErrorMessage error={translationsError} onRetry={onRetryTranslations} variant="inline" />
              )}
              <div className="space-y-2">
                {popular.map((t) => {
                  const checked = (settings.selectedTranslations || ['en.sahih']).includes(t.id);
                  const isLangMatch = t.language === language;
                  return (
                    <label
                      key={t.id}
                      className={`flex items-start gap-3 cursor-pointer p-2 rounded-lg transition-colors ${
                        isLangMatch
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleTranslation(t.id)}
                        className="mt-0.5 accent-green-600"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {t.name}
                          {isLangMatch && (
                            <span className="ms-1.5 text-[10px] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full font-normal">
                              {tr('qr_your_language', language)}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t.language.toUpperCase()}{t.author ? ` • ${t.author}` : ''}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Audio tab ── */}
          {tab === 'audio' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {tr('qr_reciter', language)}
              </label>
              {recitersError && !reciters.length && (
                <ErrorMessage error={recitersError} onRetry={onRetryReciters} variant="inline" />
              )}
              <div className="space-y-2">
                {reciters.map((r) => (
                  <label key={r.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <input
                      type="radio"
                      name="reciter"
                      value={r.id}
                      checked={settings.reciterId === r.id}
                      onChange={() => toggle('reciterId', r.id)}
                      className="accent-green-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{r.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{r.style}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function ToggleRow({ label, description, value, onChange }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm text-gray-700 dark:text-gray-300">{label}</p>
        {description && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
          value ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform mt-0.5 ${
            value ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
