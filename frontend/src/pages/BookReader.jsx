import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { booksService } from '../services/booksService.js';

export default function BookReader() {
  const { slug } = useParams();
  const [focusMode, setFocusMode] = useState(false);

  const { data: book, isLoading, isError } = useQuery({
    queryKey: ['book', slug],
    queryFn: () => booksService.getBook(slug),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--reader-bg)' }}>
        <p style={{ color: 'var(--reader-text)' }} className="text-sm opacity-60 animate-pulse">Loading…</p>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3" style={{ backgroundColor: 'var(--reader-bg)' }}>
        <p style={{ color: 'var(--reader-text)' }}>Book not found.</p>
        <Link to="/books" className="text-green-600 hover:underline text-sm">← Back to Books</Link>
      </div>
    );
  }

  if (!book.embed_url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3" style={{ backgroundColor: 'var(--reader-bg)' }}>
        <p style={{ color: 'var(--reader-text)' }}>No reader available for this book.</p>
        <Link to={`/books/${slug}`} className="text-green-600 hover:underline text-sm">← Back to book</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--reader-bg)' }}>
      {/* Top bar */}
      {!focusMode && (
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b"
          style={{
            backgroundColor: 'var(--reader-bg)',
            borderColor: 'color-mix(in srgb, var(--reader-text) 15%, transparent)',
          }}
        >
          <Link
            to={`/books/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: 'var(--reader-text)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {book.title}
          </Link>

          <button
            onClick={() => setFocusMode(true)}
            title="Focus mode"
            className="p-1.5 rounded transition-opacity hover:opacity-70"
            style={{ color: 'var(--reader-text)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      )}

      {/* Exit focus mode overlay button */}
      {focusMode && (
        <button
          onClick={() => setFocusMode(false)}
          className="fixed top-3 right-3 z-50 p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
          title="Exit focus mode"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Reader iframe */}
      <div className="flex-1 flex flex-col">
        <div className={`${focusMode ? '' : 'max-w-5xl mx-auto w-full'} flex-1 flex flex-col px-0`} style={{ minHeight: focusMode ? '100vh' : 'calc(100vh - 52px)' }}>
          <iframe
            src={book.embed_url}
            title={book.title}
            className="w-full flex-1 border-0"
            style={{ minHeight: focusMode ? '100vh' : 'calc(100vh - 52px)' }}
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
