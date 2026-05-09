const TOPICS = [
  'hadith', 'seerah', 'fiqh', 'aqeedah', 'tafsir',
  'spirituality', 'history', 'dawah', 'children',
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
  { value: 'bn', label: 'Bengali' },
  { value: 'ur', label: 'Urdu' },
];

export default function BookFilters({ topic, lang, q, onTopic, onLang, onQ }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={q}
          onChange={e => onQ(e.target.value)}
          placeholder="Search books..."
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Topic filter */}
      <select
        value={topic}
        onChange={e => onTopic(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">All Topics</option>
        {TOPICS.map(t => (
          <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
        ))}
      </select>

      {/* Language filter */}
      <select
        value={lang}
        onChange={e => onLang(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">All Languages</option>
        {LANGUAGES.map(l => (
          <option key={l.value} value={l.value}>{l.label}</option>
        ))}
      </select>
    </div>
  );
}
