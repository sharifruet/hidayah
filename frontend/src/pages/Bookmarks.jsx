import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import {
  getBookmarks,
  removeBookmark,
  updateNote,
  clearBookmarks,
} from '../services/bookmarkService.js';

export default function Bookmarks() {
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
    if (window.confirm(language === 'bn' ? 'সব বুকমার্ক মুছে ফেলবেন?' : 'Clear all bookmarks?')) {
      clearBookmarks();
      setBookmarks([]);
    }
  }

  const label = {
    title:      { en: 'Bookmarks',            bn: 'বুকমার্ক'              },
    empty:      { en: 'No bookmarks yet',     bn: 'কোনো বুকমার্ক নেই'     },
    empty_sub:  { en: 'Tap the bookmark icon in the reader to save an ayah.', bn: 'পাঠকে বুকমার্ক আইকনে ট্যাপ করুন।' },
    jump:       { en: 'Jump to ayah',         bn: 'আয়াতে যান'             },
    note_ph:    { en: 'Add a personal note…', bn: 'একটি নোট লিখুন…'       },
    save:       { en: 'Save',                 bn: 'সংরক্ষণ'               },
    edit:       { en: 'Edit note',            bn: 'নোট সম্পাদনা'          },
    remove:     { en: 'Remove',              bn: 'সরান'                   },
    clear_all:  { en: 'Clear all',            bn: 'সব মুছুন'              },
    added:      { en: 'Added',                bn: 'যোগ করা হয়েছে'         },
  };
  const t = (k) => label[k]?.[language] || label[k]?.en || k;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('title')}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{bookmarks.length} ayahs</p>
          </div>
          {bookmarks.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-red-500 hover:text-red-700 border border-red-200 dark:border-red-800 rounded-lg px-3 py-1.5"
            >
              {t('clear_all')}
            </button>
          )}
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{t('empty')}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t('empty_sub')}</p>
            <Link to="/quran" className="mt-4 inline-block text-green-600 text-sm hover:underline">
              {language === 'bn' ? 'কুরআনে যান' : 'Go to Qur\'an'}
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
                      {bm.surahName} — {language === 'bn' ? 'আয়াত' : 'Ayah'} {bm.ayah}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {t('added')} {new Date(bm.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Link
                      to={`/quran/${bm.surah}/${bm.ayah}`}
                      className="text-xs px-2.5 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                    >
                      {t('jump')}
                    </Link>
                    <button
                      onClick={() => handleRemove(bm.surah, bm.ayah)}
                      className="text-xs px-2.5 py-1 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      {t('remove')}
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
                      placeholder={t('note_ph')}
                      className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => saveNote(bm.surah, bm.ayah)}
                        className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        {t('save')}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        {language === 'bn' ? 'বাতিল' : 'Cancel'}
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
                    {bm.note ? bm.note : t('edit')}
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
