import { useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { fetchHadithSearch } from '../services/hadithService.js';
import Loading from '../components/common/Loading.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

export default function HadithSearch() {
  const { language: appLanguage } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchLang, setSearchLang] = useState(searchParams.get('language') || 'en');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const doSearch = useCallback(async (q, lang, pg) => {
    if (!q || q.trim().length < 2) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHadithSearch(q.trim(), { language: lang, page: pg });
      setResults(data.data);
      setSearchParams({ q: q.trim(), language: lang });
    } catch (err) {
      setError(err?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [setSearchParams]);

  function handleSubmit(e) {
    e.preventDefault();
    setPage(1);
    doSearch(query, searchLang, 1);
  }

  function handlePage(pg) {
    setPage(pg);
    doSearch(query, searchLang, pg);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/hadith" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Back">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {appLanguage === 'bn' ? 'হাদিস অনুসন্ধান' : 'Search Hadith'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <div className="flex gap-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={appLanguage === 'bn' ? 'শব্দ বা বাক্যাংশ লিখুন...' : 'Enter a word or phrase...'}
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              aria-label="Search query"
              minLength={2}
              maxLength={200}
            />
            <button
              type="submit"
              disabled={loading || query.trim().length < 2}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {appLanguage === 'bn' ? 'খুঁজুন' : 'Search'}
            </button>
          </div>

          <select
            value={searchLang}
            onChange={(e) => setSearchLang(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
            aria-label="Language to search in"
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
        </form>

        {loading && <Loading message={appLanguage === 'bn' ? 'অনুসন্ধান করা হচ্ছে...' : 'Searching...'} />}
        {error && <ErrorMessage error={error} onRetry={() => doSearch(query, searchLang, page)} />}

        {results && !loading && (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {appLanguage === 'bn'
                ? `${results.total}টি ফলাফল`
                : `${results.total} results`}
              {results.total > 0 &&
                ` (${appLanguage === 'bn' ? 'পৃষ্ঠা' : 'page'} ${results.page} ${appLanguage === 'bn' ? 'এর' : 'of'} ${results.total_pages})`}
            </p>

            <div className="space-y-3">
              {results.matches.map((match) => (
                <Link
                  key={`${match.collection_slug}-${match.hadithnumber}`}
                  to={`/hadith/${match.collection_slug}/${match.book_number}`}
                  className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm px-4 py-4 hover:border-green-300 hover:shadow-md transition-all"
                >
                  <span className="text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">
                    {match.collection_name} — {match.hadithnumber}
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mt-2">{match.text}</p>
                </Link>
              ))}
            </div>

            {results.total_pages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => handlePage(page - 1)}
                  disabled={page <= 1}
                  className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {appLanguage === 'bn' ? 'আগের' : 'Prev'}
                </button>
                <span className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
                  {page} / {results.total_pages}
                </span>
                <button
                  onClick={() => handlePage(page + 1)}
                  disabled={page >= results.total_pages}
                  className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {appLanguage === 'bn' ? 'পরের' : 'Next'}
                </button>
              </div>
            )}

            {results.matches.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                {appLanguage === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No results found'}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
