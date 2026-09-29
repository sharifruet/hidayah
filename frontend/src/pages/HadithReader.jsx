import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext.jsx';
import { fetchBookHadiths, editionFor, saveLastRead } from '../services/hadithService.js';
import HadithRow from '../components/hadith/HadithRow.jsx';
import Loading from '../components/common/Loading.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import { fmt, tr } from '../i18n/translations.js';
import { localDigits } from '../utils/format.js';

export default function HadithReader() {
  const { collectionSlug, bookNumber } = useParams();
  const { hash } = useLocation();
  const { language } = useApp();

  const edition = editionFor(collectionSlug, language);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['hadith-book', collectionSlug, bookNumber, edition],
    queryFn: () => fetchBookHadiths(collectionSlug, bookNumber, [edition]),
    staleTime: 6 * 60 * 60 * 1000,
  });

  useEffect(() => {
    saveLastRead(collectionSlug, bookNumber);
  }, [collectionSlug, bookNumber]);

  const collection = data?.data?.collection;
  const book = data?.data?.book;
  const hadiths = data?.data?.hadiths || [];

  // Deep links (search results, shared URLs) point at #h-<number>; jump there once loaded.
  useEffect(() => {
    if (!hash || !hadiths.length) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
  }, [hash, hadiths.length]);

  function handleShare(hadith, translation) {
    const ref = `${collection?.name || collectionSlug} ${hadith.hadithnumber}`;
    const url = `${window.location.origin}/hadith/${collectionSlug}/${bookNumber}#h-${hadith.hadithnumber}`;
    const text = translation?.text || hadith.text_ar;

    if (navigator.share) {
      navigator.share({ title: ref, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText([text, '', `— ${ref}`, url].join('\n')).catch(() => {});
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to={`/hadith/${collectionSlug}`} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label={tr('qb_back', language)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
              {book?.name || fmt('ct_hadith_book_n', language, { n: localDigits(bookNumber, language) })}
            </h1>
            {collection && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{collection.name}</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {isLoading && <Loading />}
          {error && <ErrorMessage error={error} onRetry={refetch} />}
          {!isLoading && !error && hadiths.map((h) => (
            <HadithRow
              key={h.hadithnumber}
              hadith={h}
              language={language}
              onShare={handleShare}
              bookmarkContext={{ slug: collectionSlug, collectionName: collection?.name ?? collectionSlug, bookName: book?.name ?? '' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
