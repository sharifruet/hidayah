import { Link } from 'react-router-dom';
import { getReadSurahs } from '../../services/progressService.js';

export default function SurahList({ surahs, language, searchTerm = '' }) {
  const readSurahs = getReadSurahs();

  const filtered = surahs.filter((s) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      s.name_en.toLowerCase().includes(q) ||
      s.name_en_trans.toLowerCase().includes(q) ||
      String(s.number).includes(q)
    );
  });

  if (filtered.length === 0) {
    return (
      <p className="p-6 text-center text-gray-500 dark:text-gray-400">
        {language === 'bn' ? 'কোনো সুরা পাওয়া যায়নি' : 'No surahs found'}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y divide-gray-100 dark:divide-gray-700 sm:divide-y-0 sm:gap-px sm:bg-gray-100 dark:sm:bg-gray-700 overflow-hidden">
      {filtered.map((surah) => {
        const isRead = readSurahs.has(surah.number);
        return (
          <Link
            key={surah.number}
            to={`/quran/${surah.number}`}
            className="flex items-center px-4 py-3 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
          >
            {/* Number badge */}
            <span className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold flex-shrink-0 ${
              isRead
                ? 'bg-green-500 text-white'
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            }`}>
              {isRead ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : surah.number}
            </span>

            <div className="ml-3 flex-1 min-w-0">
              <span className="font-medium text-gray-900 dark:text-gray-100 block truncate">
                {surah.name_en}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {surah.name_en_trans} · {surah.ayah_count}{' '}
                {language === 'bn' ? 'আয়াত' : 'ayahs'} ·{' '}
                {surah.revelation_type}
              </span>
            </div>

            <span className="text-3xl font-arabic text-gray-700 dark:text-gray-300 ml-2 leading-none flex-shrink-0">
              {surah.name_ar}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
