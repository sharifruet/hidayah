import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { JUZ_DATA } from '../data/juz.js';
import { getReadSurahs, getKhatmPercent } from '../services/progressService.js';

export default function QuranJuz() {
  const { language } = useApp();
  const readSurahs = getReadSurahs();

  const label = {
    title:    { en: 'Juz Navigator',     bn: 'পারা নেভিগেটর'    },
    subtitle: { en: '30 parts of the Qur\'an', bn: 'কুরআনের ৩০ পারা' },
    juz:      { en: 'Juz',               bn: 'পারা'              },
    surahs:   { en: 'surahs',            bn: 'সুরা'              },
    from:     { en: 'From',              bn: 'থেকে'              },
    to:       { en: 'to',                bn: 'পর্যন্ত'            },
    read:     { en: 'read',              bn: 'পড়া হয়েছে'         },
    start:    { en: 'Start reading',     bn: 'পড়া শুরু করুন'     },
  };
  const t = (k) => label[k]?.[language] || label[k]?.en || k;

  const khatmPct = getKhatmPercent();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('subtitle')}</p>
        </div>

        {/* Overall Khatm progress */}
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {language === 'bn' ? 'খতম অগ্রগতি' : 'Khatm Progress'}
            </p>
            <p className="text-sm font-bold text-green-600 dark:text-green-400">{khatmPct}%</p>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${khatmPct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
            {readSurahs.size} / 114 {language === 'bn' ? 'সুরা সম্পন্ন' : 'surahs completed'}
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
                  {juz.juz}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {t('juz')} {juz.juz} — {juz.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('from')} {juz.start.surah}:{juz.start.ayah} {t('to')} {juz.end.surah}:{juz.end.ayah}
                  </p>
                  {/* Per-juz progress bar */}
                  <div className="mt-1.5 w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-400 rounded-full transition-all"
                      style={{ width: `${juzPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {juzReadCount}/{juzTotal} {t('surahs')} {t('read')}
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
