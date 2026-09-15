import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext.jsx';
import { fetchCollections } from '../services/hadithService.js';
import Loading from '../components/common/Loading.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

export default function Hadith() {
  const { language } = useApp();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['hadith-collections'],
    queryFn: fetchCollections,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const collections = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {language === 'bn' ? 'হাদিস' : 'Hadith'}
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {language === 'bn' ? 'আরবি, বাংলা ও ইংরেজি সহ' : 'In Arabic, Bangla, and English'}
            </p>
          </div>

          <Link
            to="/hadith/search"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:inline">{language === 'bn' ? 'অনুসন্ধান' : 'Search'}</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {isLoading && <Loading message={language === 'bn' ? 'লোড হচ্ছে...' : 'Loading collections...'} />}
          {error && <ErrorMessage error={error} onRetry={refetch} />}
          {!isLoading && !error && (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {collections.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/hadith/${c.slug}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{c.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {language === 'bn'
                          ? `${c.total_books} অধ্যায় · ${c.total_hadiths} হাদিস`
                          : `${c.total_books} books · ${c.total_hadiths} hadiths`}
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
