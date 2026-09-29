import { useApp } from '../../context/AppContext.jsx';
import { tr } from '../../i18n/translations.js';
import { BOOK_LANGUAGES, BOOK_TOPICS, bookLanguageLabel, topicLabel } from './labels.js';

export default function BookFilters({ topic, lang, q, onTopic, onLang, onQ }) {
  const { language } = useApp();
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={q}
          onChange={e => onQ(e.target.value)}
          placeholder={tr('ct_books_search', language)}
          aria-label={tr('ct_books_search', language)}
          className="w-full ps-9 pe-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Topic filter */}
      <select
        value={topic}
        onChange={e => onTopic(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">{tr('ct_all_topics', language)}</option>
        {BOOK_TOPICS.map(t => (
          <option key={t} value={t}>{topicLabel(t, language)}</option>
        ))}
      </select>

      {/* Language filter */}
      <select
        value={lang}
        onChange={e => onLang(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">{tr('ct_all_languages', language)}</option>
        {BOOK_LANGUAGES.map(code => (
          <option key={code} value={code}>{bookLanguageLabel(code, language)}</option>
        ))}
      </select>
    </div>
  );
}
