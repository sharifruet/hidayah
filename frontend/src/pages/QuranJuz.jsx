import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { JUZ_DATA } from '../data/juz.js';
import { getReadSurahs, getKhatmPercent } from '../services/progressService.js';
import { tr, fmt } from '../i18n/translations.js';
import { localDigits } from '../utils/format.js';

const TOTAL_SURAHS = 114;

export default function QuranJuz() {
  const { language } = useApp();
  const readSurahs = getReadSurahs();

  const num = (n) => localDigits(n, language);
  const khatmPct = getKhatmPercent();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/quran" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label={tr('qb_back_to_quran', language)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{tr('qb_juz_title', language)}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{fmt('qb_juz_subtitle', language, { count: num(JUZ_DATA.length) })}</p>
          </div>
        </div>

        {/* Overall Khatm progress */}
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {tr('qb_khatm_progress', language)}
            </p>
            <p className="text-sm font-bold text-green-600 dark:text-green-400">{num(`${khatmPct}%`)}</p>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${khatmPct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
            {fmt('qb_surahs_completed', language, { done: num(readSurahs.size), total: num(TOTAL_SURAHS) })}
          </p>
        </div>

        {/* Juz grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {JUZ_DATA.map((juz) => {
            const juzReadCount = juz.surahs.filter((s) => readSurahs.has(s)).length;
            const juzTotal     = juz.surahs.length;
            const juzPct       = Math.round((juzReadCount / juzTotal) * 100);
            const allRead      = juzReadCount === juzTotal;

            return (
              <Link
                key={juz.juz}
                to={`/quran/${juz.start.surah}/${juz.start.ayah}`}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              >
                {/* Juz number */}
                <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                  allRead
                    ? 'bg-green-500 text-white'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                }`}>
                  {num(juz.juz)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {fmt('qb_juz_n', language, { n: num(juz.juz) })} — {juz.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {fmt('qb_juz_from_to', language, {
                      from: num(`${juz.start.surah}:${juz.start.ayah}`),
                      to: num(`${juz.end.surah}:${juz.end.ayah}`),
                    })}
                  </p>
                  {/* Per-juz progress bar */}
                  <div className="mt-1.5 w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-400 rounded-full transition-all"
                      style={{ width: `${juzPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {fmt('qb_juz_surahs_read', language, { done: num(juzReadCount), total: num(juzTotal) })}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
