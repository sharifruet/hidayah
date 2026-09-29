import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDuasCollection, loadCachedDuasCollection } from '../services/duasService.js';
import { getFavouriteDuaIds, toggleFavouriteDua, getHadithBookmarks, removeHadithBookmark } from '../utils/saved.js';
import { bnOr } from '../utils/format.js';
import { useApp } from '../context/AppContext.jsx';
import {
  getBookmarks,
  removeBookmark,
  updateNote,
  clearBookmarks,
} from '../services/bookmarkService.js';
import { tr, fmt } from '../i18n/translations.js';
import { formatDate, localDigits } from '../utils/format.js';

function QuranBookmarks() {
  const { language } = useApp();
  const [bookmarks, setBookmarks] = useState([]);
  const [editingId, setEditingId]  = useState(null);
  const [noteText, setNoteText]    = useState('');

  useEffect(() => { setBookmarks(getBookmarks()); }, []);

  function handleRemove(surah, ayah) {
    removeBookmark(surah, ayah);
    setBookmarks(getBookmarks());
  }

  function startEdit(bm) {
    setEditingId(bm.id);
    setNoteText(bm.note || '');
  }

  function saveNote(surah, ayah) {
    updateNote(surah, ayah, noteText);
    setBookmarks(getBookmarks());
    setEditingId(null);
  }

  function handleClearAll() {
    if (window.confirm(tr('qb_bm_clear_confirm', language))) {
      clearBookmarks();
      setBookmarks([]);
    }
  }

  const t = (key) => tr(key, language);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('qb_bookmarks')}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {fmt('qb_ayah_count', language, { count: localDigits(bookmarks.length, language) })}
            </p>
          </div>
          {bookmarks.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-red-500 hover:text-red-700 border border-red-200 dark:border-red-800 rounded-lg px-3 py-1.5"
            >
              {t('qb_bm_clear_all')}
            </button>
          )}
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{t('qb_bm_empty')}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t('qb_bm_empty_sub')}</p>
            <Link to="/quran" className="mt-4 inline-block text-green-600 text-sm hover:underline">
              {t('qb_go_to_quran')}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-xs font-medium text-green-700 dark:text-green-400">
                      {bm.surahName} — {fmt('qb_ayah_n', language, { n: localDigits(bm.ayah, language) })}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {fmt('qb_bm_added', language, {
                        date: formatDate(new Date(bm.createdAt), language, { day: 'numeric', month: 'short', year: 'numeric' }),
                      })}
                    </p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Link
                      to={`/quran/${bm.surah}/${bm.ayah}`}
                      className="text-xs px-2.5 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                    >
                      {t('qb_bm_jump')}
                    </Link>
                    <button
                      onClick={() => handleRemove(bm.surah, bm.ayah)}
                      className="text-xs px-2.5 py-1 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      {t('qb_bm_remove')}
                    </button>
                  </div>
                </div>

                {/* Arabic snippet */}
                {bm.text_ar && (
                  <p className="text-3xl font-arabic text-right text-gray-800 dark:text-gray-200 leading-loose mb-2" dir="rtl" lang="ar">
                    {bm.text_ar.length > 80 ? bm.text_ar.slice(0, 80) + '…' : bm.text_ar}
                  </p>
                )}

                {/* Translation snippet */}
                {bm.translationText && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {bm.translationText}
                  </p>
                )}

                {/* Note */}
                {editingId === bm.id ? (
                  <div className="mt-2">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder={t('qb_bm_note_ph')}
                      className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => saveNote(bm.surah, bm.ayah)}
                        className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        {t('qb_bm_save')}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        {t('cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(bm)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 mt-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {bm.note ? bm.note : t('qb_bm_edit_note')}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FavouriteDuas() {
  const { language } = useApp();
  const [ids, setIds] = useState(getFavouriteDuaIds);
  const { data } = useQuery({
    queryKey: ['duas-collection'],
    queryFn: getDuasCollection,
    initialData: loadCachedDuasCollection,
    staleTime: 24 * 60 * 60 * 1000,
  });
  const byId = new Map((data?.duas ?? []).map((d) => [d.id, d]));
  const duas = ids.map((id) => byId.get(id)).filter(Boolean);

  if (!duas.length) {
    return <p className="text-center text-gray-500 dark:text-gray-400 py-16">{tr('sv_empty_duas', language)}</p>;
  }
  return (
    <div className="space-y-3">
      {duas.map((d) => (
        <div key={d.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
          <div className="flex items-start gap-3">
            <p className="flex-1 text-2xl font-arabic leading-loose text-right text-gray-900 dark:text-gray-100" dir="rtl" lang="ar">{d.arabic}</p>
            <button
              onClick={() => setIds(toggleFavouriteDua(d.id))}
              aria-label={tr('sv_remove_favourite', language)}
              title={tr('sv_remove_favourite', language)}
              className="text-lg text-rose-600 leading-none"
            >
              ♥
            </button>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{bnOr(language, d.translation_bn, d.translation_en)}</p>
          <p className="text-xs text-gray-400 mt-1">{d.reference}</p>
        </div>
      ))}
      <Link to="/duas?view=favourites" className="inline-block text-sm text-green-600 hover:underline">
        {tr('nav_duas', language)} →
      </Link>
    </div>
  );
}

function HadithBookmarks() {
  const { language } = useApp();
  const [items, setItems] = useState(getHadithBookmarks);
  if (!items.length) {
    return <p className="text-center text-gray-500 dark:text-gray-400 py-16">{tr('sv_empty_hadith', language)}</p>;
  }
  return (
    <div className="space-y-3">
      {items.map((b) => (
        <div key={b.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
          <div className="flex items-center justify-between gap-3 mb-1">
            <Link to={`/hadith/${b.slug}/${b.bookNumber}#h-${b.hadithnumber}`} className="text-sm font-semibold text-green-700 dark:text-green-400 hover:underline truncate">
              {b.collectionName} · {fmt('ct_hadith_n', language, { n: localDigits(b.displayNumber, language) })}
            </Link>
            <button
              onClick={() => { removeHadithBookmark(b.id); setItems(getHadithBookmarks()); }}
              className="text-xs text-red-500 hover:text-red-700"
            >
              {tr('sv_remove', language)}
            </button>
          </div>
          {b.bookName && <p className="text-xs text-gray-400 mb-1">{b.bookName}</p>}
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4">{b.preview}</p>
        </div>
      ))}
    </div>
  );
}

const TABS = [
  { key: 'quran', label: 'sv_tab_quran' },
  { key: 'duas', label: 'sv_tab_duas' },
  { key: 'hadith', label: 'sv_tab_hadith' },
];

/** Everything saved on this browser: Qur'an bookmarks, favourite du'as, bookmarked hadith. */
export default function Bookmarks() {
  const { language } = useApp();
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((x) => x.key === params.get('tab')) ? params.get('tab') : 'quran';

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div role="tablist" className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
          {TABS.map((x) => (
            <button
              key={x.key}
              role="tab"
              aria-selected={tab === x.key}
              onClick={() => setParams(x.key === 'quran' ? {} : { tab: x.key })}
              className={`px-4 py-1.5 rounded-md text-sm font-medium ${
                tab === x.key ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {tr(x.label, language)}
            </button>
          ))}
        </div>
      </div>
      {tab === 'quran' ? (
        <QuranBookmarks />
      ) : (
        <div className="min-h-screen max-w-7xl mx-auto px-4 py-6">
          {tab === 'duas' ? <FavouriteDuas /> : <HadithBookmarks />}
        </div>
      )}
    </div>
  );
}
