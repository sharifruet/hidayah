import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { DUAS, DUA_CATEGORIES, getDuasByCategory } from '../data/duas.js';

export default function Duas() {
  const { language } = useApp();
  const [activeCategory, setActiveCategory] = useState('morning');
  const [expandedId, setExpandedId]         = useState(null);
  const [copiedId, setCopiedId]             = useState(null);

  const catLabel = (cat) => cat[`label_${language}`] || cat.label_en;
  const duas = getDuasByCategory(activeCategory);

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

        {/* Category tabs — horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none">
          {DUA_CATEGORIES.map((cat) => (
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

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500">{dua.reference}</span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

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
