import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext.jsx';
import {
  fetchBookHadiths,
  loadReaderSettings,
  saveReaderSettings,
  saveLastRead,
} from '../services/hadithService.js';
import HadithRow from '../components/hadith/HadithRow.jsx';
import Loading from '../components/common/Loading.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

const DEFAULT_SETTINGS = { showArabic: true, showBangla: true, showEnglish: true };

export default function HadithReader() {
  const { collectionSlug, bookNumber } = useParams();
  const { language } = useApp();
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS, ...loadReaderSettings() }));

  const translations = [`ben-${collectionSlug}`, `eng-${collectionSlug}`];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['hadith-book', collectionSlug, bookNumber],
    queryFn: () => fetchBookHadiths(collectionSlug, bookNumber, translations),
    staleTime: 6 * 60 * 60 * 1000,
  });

  useEffect(() => {
    saveLastRead(collectionSlug, bookNumber);
  }, [collectionSlug, bookNumber]);

  function toggleSetting(key) {
    setSettings((s) => {
      const next = { ...s, [key]: !s[key] };
      saveReaderSettings(next);
      return next;
    });
  }

  const collection = data?.data?.collection;
  const book = data?.data?.book;
  const hadiths = data?.data?.hadiths || [];

  function handleShare(hadith) {
    const bn = hadith.translations?.find((t) => t.language === 'bn');
    const en = hadith.translations?.find((t) => t.language === 'en');
    const lines = [];
    if (settings.showArabic) lines.push(hadith.text_ar);
    if (settings.showBangla && bn) lines.push(bn.text);
    if (settings.showEnglish && en) lines.push(en.text);
    const ref = `${collection?.name || collectionSlug} ${hadith.hadithnumber}`;
    const url = `${window.location.origin}/hadith/${collectionSlug}/${bookNumber}`;

    if (navigator.share) {
      navigator.share({ title: ref, text: lines.join('\n\n'), url }).catch(() => {});
    } else {
      navigator.clipboard.writeText([...lines, '', `— ${ref}`, url].join('\n')).catch(() => {});
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-2">
          <Link to={`/hadith/${collectionSlug}`} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Back">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
              {book?.name || `${language === 'bn' ? 'অধ্যায়' : 'Book'} ${bookNumber}`}
            </h1>
            {collection && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{collection.name}</p>
            )}
          </div>
        </div>

        {/* Language toggles */}
        <div className="flex gap-2 mb-6">
          {[
            ['showArabic', 'العربية'],
            ['showBangla', 'বাংলা'],
            ['showEnglish', 'English'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggleSetting(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                settings[key]
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {isLoading && <Loading message={language === 'bn' ? 'লোড হচ্ছে...' : 'Loading hadiths...'} />}
          {error && <ErrorMessage error={error} onRetry={refetch} />}
          {!isLoading && !error && hadiths.map((h) => (
            <HadithRow
              key={h.hadithnumber}
              hadith={h}
              showArabic={settings.showArabic}
              showBangla={settings.showBangla}
              showEnglish={settings.showEnglish}
              onShare={handleShare}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
