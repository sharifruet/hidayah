import { useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { fetchSearch } from '../services/quranService.js';
import Loading from '../components/common/Loading.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

export default function QuranSearch() {
  const { language } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery]   = useState(searchParams.get('q') || '');
  const [edition, setEdition] = useState(searchParams.get('edition') || 'en.sahih');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);
  const [page, setPage]     = useState(1);

  const doSearch = useCallback(async (q, ed, pg) => {
    if (!q || q.trim().length < 2) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSearch(q.trim(), { edition: ed, page: pg });
      setResults(data.data);
      setSearchParams({ q: q.trim(), edition: ed });
    } catch (err) {
      setError(err?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [setSearchParams]);

  function handleSubmit(e) {
    e.preventDefault();
    setPage(1);
    doSearch(query, edition, 1);
  }

  function handlePage(pg) {
    setPage(pg);
    doSearch(query, edition, pg);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const editions = [
    { id: 'en.sahih',  label: 'English – Saheeh International' },
    { id: 'bn.bengali', label: 'বাংলা – মুহিউদ্দিন খান' },
    { id: 'en.pickthall', label: 'English – Pickthall' },
    { id: 'en.yusufali', label: 'English – Yusuf Ali' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/quran" className="text-gray-500 hover:text-gray-700" aria-label="Back">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'bn' ? 'কুরআন অনুসন্ধান' : 'Search Qur\'an'}
          </h1>
        </div>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <div className="flex gap-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === 'bn' ? 'শব্দ বা বাক্যাংশ লিখুন...' : 'Enter a word or phrase...'}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              aria-label="Search query"
              minLength={2}
              maxLength={200}
            />
            <button
              type="submit"
              disabled={loading || query.trim().length < 2}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {language === 'bn' ? 'খুঁজুন' : 'Search'}
            </button>
          </div>

          <select
            value={edition}
            onChange={(e) => setEdition(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm"
            aria-label="Translation to search in"
          >
            {editions.map((ed) => (
              <option key={ed.id} value={ed.id}>{ed.label}</option>
            ))}
          </select>
        </form>

        {/* Loading */}
        {loading && <Loading message={language === 'bn' ? 'অনুসন্ধান করা হচ্ছে...' : 'Searching...'} />}

        {/* Error */}
        {error && <ErrorMessage error={error} onRetry={() => doSearch(query, edition, page)} />}

        {/* Results */}
        {results && !loading && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {language === 'bn'
                ? `${results.total}টি ফলাফল`
                : `${results.total} results`}
              {results.total > 0 &&
                ` (${language === 'bn' ? 'পৃষ্ঠা' : 'page'} ${results.page} ${language === 'bn' ? 'এর' : 'of'} ${results.total_pages})`}
            </p>

            <div className="space-y-3">
              {results.matches.map((match, idx) => (
                <Link
                  key={idx}
                  to={`/quran/${match.surah_number}/${match.ayah_number}?translations=${edition}`}
                  className="block bg-white rounded-lg border border-gray-100 shadow-sm px-4 py-4 hover:border-green-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">
                      {match.surah_name} {match.surah_number}:{match.ayah_number}
                    </span>
                    <span className="text-xs text-gray-400" dir="rtl" lang="ar">{match.surah_name_ar}</span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3">{match.text}</p>
                </Link>
              ))}
            </div>

            {results.total_pages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => handlePage(page - 1)}
                  disabled={page <= 1}
                  className="px-3 py-2 rounded border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50"
                >
                  {language === 'bn' ? 'আগের' : 'Prev'}
                </button>
                <span className="px-3 py-2 text-sm text-gray-600">
                  {page} / {results.total_pages}
                </span>
                <button
                  onClick={() => handlePage(page + 1)}
                  disabled={page >= results.total_pages}
                  className="px-3 py-2 rounded border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50"
                >
                  {language === 'bn' ? 'পরের' : 'Next'}
                </button>
              </div>
            )}

            {results.matches.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">
                  {language === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No results found'}
                </p>
                <p className="text-sm">
                  {language === 'bn' ? 'অন্য শব্দ দিয়ে চেষ্টা করুন' : 'Try different keywords'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
