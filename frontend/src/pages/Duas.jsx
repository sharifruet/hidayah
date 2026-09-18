import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext.jsx';
import { getDuasCollection, loadCachedDuasCollection, duaCategoryLabel } from '../services/duasService.js';
import { tr } from '../i18n/translations.js';
import Loading from '../components/common/Loading.jsx';

export default function Duas() {
  const { language } = useApp();
  const [activeCategory, setActiveCategory] = useState('morning');
  const [expandedId, setExpandedId]         = useState(null);
  const [copiedId, setCopiedId]             = useState(null);
  const [virtueId, setVirtueId]             = useState(null); // which card shows its fazilat

  // Du'as live in the DB (GET /v1/duas). The last successful payload is kept in
  // localStorage so a flaky/offline connection still shows the collection.
  const { data, isLoading, isError } = useQuery({
    queryKey: ['duas-collection'],
    queryFn: getDuasCollection,
    initialData: loadCachedDuasCollection,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const categories = data?.categories ?? [];
  const catLabel = (cat) => duaCategoryLabel(cat, language);
  const duas = (data?.duas ?? []).filter((d) => d.category === activeCategory);

  async function copyDua(dua) {
    const text = [dua.arabic, '', dua.transliteration, '', dua.translation_en, '', `(${dua.reference})`].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(dua.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {language === 'bn' ? 'দু\'আ ও আযকার' : "Du'a & Adhkar"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {language === 'bn' ? 'কুরআন ও সুন্নাহ থেকে প্রামাণিক দু\'আসমূহ' : "Authentic supplications from the Qur'an & Sunnah"}
          </p>
        </div>

        {isLoading && !data && <Loading message={tr('loading', language)} />}
        {isError && !data && (
          <p className="text-sm text-red-600 dark:text-red-400">{tr('error_generic', language)}</p>
        )}

        {/* Category tabs — horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600'
              }`}
            >
              {catLabel(cat)}
            </button>
          ))}
        </div>

        {/* Du'a cards */}
        <div className="space-y-3">
          {duas.map((dua) => {
            const expanded = expandedId === dua.id;
            const showVirtue = virtueId === dua.id;
            return (
              <div
                key={dua.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
              >
                {/* Arabic text */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedId(expanded ? null : dua.id)}
                >
                  <p
                    className="text-3xl font-arabic text-gray-900 dark:text-gray-100 leading-loose text-right mb-3"
                    dir="rtl"
                    lang="ar"
                  >
                    {dua.arabic}
                  </p>

                  {/* Count badge */}
                  {dua.count > 1 && (
                    <div className="flex justify-end mb-2">
                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                        × {dua.count}
                      </span>
                    </div>
                  )}

                  {/* Transliteration always visible */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed">
                    {dua.transliteration}
                  </p>

                  <div className="flex items-center justify-between gap-3 mt-2">
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      <span className="text-xs text-gray-400 dark:text-gray-500">{dua.reference}</span>
                      {dua.virtue_en && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setVirtueId(showVirtue ? null : dua.id); }}
                          aria-expanded={showVirtue}
                          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border transition-colors ${
                            showVirtue
                              ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300'
                              : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                          }`}
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {tr('dua_virtue', language)}
                        </button>
                      )}
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Fazilat — hidden until the button is pressed */}
                {showVirtue && dua.virtue_en && (
                  <div className="border-t border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-900/15 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400 mb-1">
                      {tr('dua_virtue', language)}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {language === 'bn' ? dua.virtue_bn : dua.virtue_en}
                    </p>
                    {language === 'bn' && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-2">{dua.virtue_en}</p>
                    )}
                  </div>
                )}

                {/* Expanded: translation + actions */}
                {expanded && (
                  <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                      {language === 'bn' ? dua.translation_bn : dua.translation_en}
                    </p>
                    {language === 'bn' && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                        {dua.translation_en}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyDua(dua)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-green-400 transition-colors"
                      >
                        {copiedId === dua.id ? (
                          <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                        {copiedId === dua.id
                          ? (language === 'bn' ? 'কপি হয়েছে!' : 'Copied!')
                          : (language === 'bn' ? 'কপি করুন' : 'Copy')
                        }
                      </button>
                      {dua.quranRef && (
                        <Link
                          to={`/quran/${dua.quranRef.surah}/${dua.quranRef.ayah}`}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          {language === 'bn' ? 'কুরআনে দেখুন' : 'View in Qur\'an'}
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
