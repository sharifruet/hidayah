import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext.jsx';
import { fetchCollection, fetchBooks } from '../services/hadithService.js';
import Loading from '../components/common/Loading.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

export default function HadithBooks() {
  const { collectionSlug } = useParams();
  const { language } = useApp();

  const collectionQuery = useQuery({
    queryKey: ['hadith-collection', collectionSlug],
    queryFn: () => fetchCollection(collectionSlug),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const booksQuery = useQuery({
    queryKey: ['hadith-books', collectionSlug],
    queryFn: () => fetchBooks(collectionSlug),
    staleTime: 24 * 60 * 60 * 1000,
  });

  const collection = collectionQuery.data?.data;
  const books = booksQuery.data?.data || [];
  const isLoading = collectionQuery.isLoading || booksQuery.isLoading;
  const error = collectionQuery.error || booksQuery.error;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/hadith" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Back">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {collection?.name || collectionSlug}
            </h1>
            {collection && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {language === 'bn'
                  ? `${collection.total_books} অধ্যায় · ${collection.total_hadiths} হাদিস`
                  : `${collection.total_books} books · ${collection.total_hadiths} hadiths`}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {isLoading && <Loading message={language === 'bn' ? 'লোড হচ্ছে...' : 'Loading books...'} />}
          {error && <ErrorMessage error={error} onRetry={() => { collectionQuery.refetch(); booksQuery.refetch(); }} />}
          {!isLoading && !error && (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {books.map((b) => (
                <li key={b.book_number}>
                  <Link
                    to={`/hadith/${collectionSlug}/${b.book_number}`}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold flex-shrink-0">
                      {b.book_number}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{b.name}</p>
                      <p className="text-xs text-gray-400">
                        {language === 'bn'
                          ? `হাদিস ${b.hadithnumber_first}–${b.hadithnumber_last}`
                          : `Hadith ${b.hadithnumber_first}–${b.hadithnumber_last}`}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
