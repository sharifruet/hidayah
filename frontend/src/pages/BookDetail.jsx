import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { booksService } from '../services/booksService.js';
import TopicBadge from '../components/books/TopicBadge.jsx';

const LICENSE_LABELS = {
  public_domain: 'Public Domain',
  creative_commons: 'Creative Commons',
  all_rights_reserved: 'All Rights Reserved',
};

const LANG_LABELS = {
  en: 'English', ar: 'Arabic', bn: 'Bengali', ur: 'Urdu',
};

export default function BookDetail() {
  const { slug } = useParams();
  const { data: book, isLoading, isError } = useQuery({
    queryKey: ['book', slug],
    queryFn: () => booksService.getBook(slug),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="flex gap-6 flex-col sm:flex-row">
            <div className="w-48 h-64 bg-gray-200 dark:bg-gray-700 rounded-xl shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">Book not found.</p>
        <Link to="/books" className="mt-4 inline-block text-green-600 hover:underline">← Back to Books</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Back */}
      <Link to="/books" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Islamic Books
      </Link>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Cover */}
        <div className="shrink-0">
          <div className="w-48 rounded-xl overflow-hidden shadow-md bg-gray-100 dark:bg-gray-800 aspect-[3/4]">
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-snug">{book.title}</h1>
          {book.title_ar && (
            <p className="mt-1 text-xl text-gray-600 dark:text-gray-400 font-arabic" dir="rtl">{book.title_ar}</p>
          )}
          {book.subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 italic">{book.subtitle}</p>
          )}

          {/* Topic + language badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            {book.islamic_topics?.map(t => <TopicBadge key={t} topic={t} />)}
            {book.language && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                {LANG_LABELS[book.language] || book.language}
              </span>
            )}
          </div>

          {/* Attribution */}
          <dl className="mt-4 grid grid-cols-1 gap-y-2 text-sm">
            {book.author && (
              <div className="flex gap-2">
                <dt className="text-gray-500 dark:text-gray-400 w-24 shrink-0">Author</dt>
                <dd className="text-gray-900 dark:text-gray-100">{book.author}</dd>
              </div>
            )}
            {book.translator && (
              <div className="flex gap-2">
                <dt className="text-gray-500 dark:text-gray-400 w-24 shrink-0">Translator</dt>
                <dd className="text-gray-900 dark:text-gray-100">{book.translator}</dd>
              </div>
            )}
            {book.publisher && (
              <div className="flex gap-2">
                <dt className="text-gray-500 dark:text-gray-400 w-24 shrink-0">Publisher</dt>
                <dd className="text-gray-900 dark:text-gray-100">{book.publisher}</dd>
              </div>
            )}
            {book.published_year && (
              <div className="flex gap-2">
                <dt className="text-gray-500 dark:text-gray-400 w-24 shrink-0">Year</dt>
                <dd className="text-gray-900 dark:text-gray-100">{book.published_year}</dd>
              </div>
            )}
            {book.license_class && (
              <div className="flex gap-2">
                <dt className="text-gray-500 dark:text-gray-400 w-24 shrink-0">License</dt>
                <dd className="text-gray-900 dark:text-gray-100">{LICENSE_LABELS[book.license_class] || book.license_class}</dd>
              </div>
            )}
          </dl>

          {/* Description */}
          {book.description && (
            <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{book.description}</p>
          )}

          {/* Format indicators */}
          <div className="flex flex-wrap gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
            {book.pdf_url && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                PDF
              </span>
            )}
            {book.epub_url && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                EPUB
              </span>
            )}
          </div>

          {/* Read button */}
          {book.embed_url && (
            <Link
              to={`/books/${book.slug}/read`}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Read Now — Free
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
