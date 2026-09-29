import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext.jsx';
import { getDuasCollection, loadCachedDuasCollection, duaCategoryLabel } from '../services/duasService.js';
import { tr } from '../i18n/translations.js';
import Loading from '../components/common/Loading.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import { bnOr, localDigits } from '../utils/format.js';
import { getFavouriteDuaIds, toggleFavouriteDua } from '../utils/saved.js';

const FAVOURITES = 'favourites';

/** Case/diacritic-insensitive match across every text field of a du'a. */
function duaMatches(dua, query) {
  const norm = (v) => String(v ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f\u064b-\u065f'ʿ’-]/g, '');
  const q = norm(query.trim());
  if (!q) return true;
  return [dua.arabic, dua.transliteration, dua.translation_en, dua.translation_bn, dua.reference, dua.virtue_en, dua.virtue_bn]
    .some((field) => norm(field).includes(q));
}

export default function Duas() {
  const { language } = useApp();
  // `?view=favourites` opens the favourites list directly (linked from the Saved page).
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(() => (searchParams.get('view') === FAVOURITES ? FAVOURITES : 'morning'));
  const [favourites, setFavourites] = useState(getFavouriteDuaIds);
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId]         = useState(null);
  const [copiedId, setCopiedId]             = useState(null);
  const [virtueId, setVirtueId]             = useState(null); // which card shows its fazilat

  // Du'as live in the DB (GET /v1/duas). The last successful payload is kept in
  // localStorage so a flaky/offline connection still shows the collection.
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['duas-collection'],
    queryFn: getDuasCollection,
    initialData: loadCachedDuasCollection,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const categories = data?.categories ?? [];
  const catLabel = (cat) => duaCategoryLabel(cat, language);
  // A search spans every category; otherwise show the chosen category (or favourites).
  const duas = useMemo(() => {
    const all = data?.duas ?? [];
    if (query.trim()) return all.filter((d) => duaMatches(d, query));
    if (activeCategory === FAVOURITES) {
      const byId = new Map(all.map((d) => [d.id, d]));
      return favourites.map((id) => byId.get(id)).filter(Boolean);
    }
    return all.filter((d) => d.category === activeCategory);
  }, [data, activeCategory, favourites, query]);

  async function copyDua(dua) {
    const translation = bnOr(language, dua.translation_bn, dua.translation_en);
    const text = [dua.arabic, '', dua.transliteration, '', translation, '', `(${dua.reference})`].join('\n');
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
            {tr('ct_duas_title', language)}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {tr('ct_duas_subtitle', language)}
          </p>
        </div>

        {isLoading && !data && <Loading />}
        {error && !data && <ErrorMessage error={error} onRetry={refetch} />}

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tr('sv_search_duas', language)}
          aria-label={tr('sv_search_duas', language)}
          className="w-full sm:max-w-md mb-4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Category tabs — horizontal scroll */}
        <div className={`flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none ${query.trim() ? 'opacity-40' : ''}`}>
          <button
            onClick={() => setActiveCategory(FAVOURITES)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === FAVOURITES
                ? 'bg-rose-600 text-white'
                : 'bg-white dark:bg-gray-800 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:border-rose-400'
            }`}
          >
            {tr('sv_favourites', language)}{favourites.length ? ` ${localDigits(favourites.length, language)}` : ''}
          </button>
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
            // Bangla text when the UI is Bangla (and it exists), with the English beneath it.
            const virtue = bnOr(language, dua.virtue_bn, dua.virtue_en);
            const translation = bnOr(language, dua.translation_bn, dua.translation_en);
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
                    className="text-4xl font-arabic text-gray-900 dark:text-gray-100 leading-loose text-right mb-3"
                    dir="rtl"
                    lang="ar"
                  >
                    {dua.arabic}
                  </p>

                  {/* Count badge */}
                  {dua.count > 1 && (
                    <div className="flex justify-end mb-2">
                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                        × {localDigits(dua.count, language)}
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
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFavourites(toggleFavouriteDua(dua.id)); }}
                      aria-pressed={favourites.includes(dua.id)}
                      aria-label={tr(favourites.includes(dua.id) ? 'sv_remove_favourite' : 'sv_add_favourite', language)}
                      title={tr(favourites.includes(dua.id) ? 'sv_remove_favourite' : 'sv_add_favourite', language)}
                      className={`ms-auto text-lg leading-none ${favourites.includes(dua.id) ? 'text-rose-600' : 'text-gray-400 hover:text-rose-500'}`}
                    >
                      {favourites.includes(dua.id) ? '♥' : '♡'}
                    </button>
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
                      {virtue}
                    </p>
                    {virtue !== dua.virtue_en && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-2">{dua.virtue_en}</p>
                    )}
                  </div>
                )}

                {/* Expanded: translation + actions */}
                {expanded && (
                  <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                      {translation}
                    </p>
                    {translation !== dua.translation_en && (
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
                        {tr(copiedId === dua.id ? 'ct_copied' : 'copy', language)}
                      </button>
                      {dua.quranRef && (
                        <Link
                          to={`/quran/${dua.quranRef.surah}/${dua.quranRef.ayah}`}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          {tr('ct_view_in_quran', language)}
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {data && duas.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              {query.trim() ? tr('sv_no_results', language) : activeCategory === FAVOURITES ? tr('sv_empty_duas', language) : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
