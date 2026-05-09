import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { booksService } from '../services/booksService.js';
import BookCard from '../components/books/BookCard.jsx';
import BookFilters from '../components/books/BookFilters.jsx';

export default function Books() {
  const [topic, setTopic] = useState('');
  const [lang, setLang] = useState('');
  const [rawQ, setRawQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const debounceRef = useState({ timer: null })[0];

  const handleQ = useCallback((v) => {
    setRawQ(v);
    clearTimeout(debounceRef.timer);
    debounceRef.timer = setTimeout(() => setDebouncedQ(v), 350);
  }, [debounceRef]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['books', topic, lang, debouncedQ],
    queryFn: () => booksService.listBooks({ topic: topic || undefined, lang: lang || undefined, q: debouncedQ || undefined, limit: 50 }),
    keepPreviousData: true,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Islamic Books</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Free Islamic books — read online, no account needed
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <BookFilters
          topic={topic}
          lang={lang}
          q={rawQ}
          onTopic={setTopic}
          onLang={setLang}
          onQ={handleQ}
        />
      </div>

      {/* Results */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse">
              <div className="aspect-[3/4]" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <p>Failed to load books. Is the backend running?</p>
        </div>
      )}

      {!isLoading && !isError && data?.books?.length === 0 && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p>No books found.</p>
        </div>
      )}

      {!isLoading && !isError && data?.books?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.books.map(book => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
