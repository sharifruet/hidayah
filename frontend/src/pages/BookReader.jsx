import { useState, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { booksService } from '../services/booksService.js';

// Pre-order DFS over the tree, collecting only "readable" (has_content) nodes
// in document order, each carrying its ancestor titles for a breadcrumb.
function computeReadingOrder(tree, ancestors = []) {
  let order = [];
  for (const node of tree) {
    if (node.has_content) order.push({ id: node.id, title: node.title, type: node.type, breadcrumb: ancestors });
    order = order.concat(computeReadingOrder(node.children, [...ancestors, node.title].filter(Boolean)));
  }
  return order;
}

function TocTree({ tree, currentId, onSelect }) {
  return (
    <ul className="space-y-0.5">
      {tree.map(node => (
        <li key={node.id}>
          {node.has_content ? (
            <button
              onClick={() => onSelect(node.id)}
              className={`block w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                node.id === currentId ? 'bg-green-100 dark:bg-green-900/40 font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              style={{ color: 'var(--reader-text)' }}
            >
              {node.title || `${node.type} ${node.position}`}
            </button>
          ) : (
            <div className="px-2 py-1 text-xs font-semibold uppercase opacity-50" style={{ color: 'var(--reader-text)' }}>
              {node.title || node.type}
            </div>
          )}
          {node.children.length > 0 && (
            <div className="ml-3 border-l pl-2" style={{ borderColor: 'color-mix(in srgb, var(--reader-text) 15%, transparent)' }}>
              <TocTree tree={node.children} currentId={currentId} onSelect={onSelect} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function BookReader() {
  const { slug } = useParams();
  const [focusMode, setFocusMode] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: book, isLoading, isError } = useQuery({
    queryKey: ['book', slug],
    queryFn: () => booksService.getBook(slug),
  });

  const isText = book?.content_type === 'text';

  const { data: tree } = useQuery({
    queryKey: ['book-chapters', slug],
    queryFn: () => booksService.listChapters(slug),
    enabled: isText,
  });

  const readingOrder = useMemo(() => (tree ? computeReadingOrder(tree) : []), [tree]);

  const currentId = Number(searchParams.get('id')) || readingOrder[0]?.id || null;

  const { data: chapter, isLoading: chapterLoading } = useQuery({
    queryKey: ['book-chapter', slug, currentId],
    queryFn: () => booksService.getChapter(slug, currentId),
    enabled: isText && !!currentId,
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

  if (!isText && !book.embed_url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3" style={{ backgroundColor: 'var(--reader-bg)' }}>
        <p style={{ color: 'var(--reader-text)' }}>No reader available for this book.</p>
        <Link to={`/books/${slug}`} className="text-green-600 hover:underline text-sm">← Back to book</Link>
      </div>
    );
  }

  if (isText && tree && readingOrder.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3" style={{ backgroundColor: 'var(--reader-bg)' }}>
        <p style={{ color: 'var(--reader-text)' }}>No chapters available for this book yet.</p>
        <Link to={`/books/${slug}`} className="text-green-600 hover:underline text-sm">← Back to book</Link>
      </div>
    );
  }

  const currentIndex = readingOrder.findIndex(n => n.id === currentId);
  const prevEntry = currentIndex > 0 ? readingOrder[currentIndex - 1] : null;
  const nextEntry = currentIndex >= 0 && currentIndex < readingOrder.length - 1 ? readingOrder[currentIndex + 1] : null;

  function goTo(nodeId) {
    setSearchParams({ id: String(nodeId) });
    setTocOpen(false);
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

          <div className="flex items-center gap-2">
            {isText && (
              <button
                onClick={() => setTocOpen(v => !v)}
                title="Contents"
                className="p-1.5 rounded transition-opacity hover:opacity-70"
                style={{ color: 'var(--reader-text)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
            )}
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

      {isText ? (
        <div className="flex-1 flex">
          {/* TOC panel */}
          {tocOpen && (
            <>
              <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setTocOpen(false)} />
              <div
                className="fixed left-0 top-0 h-full w-72 z-50 overflow-y-auto border-r px-3 py-4"
                style={{ backgroundColor: 'var(--reader-bg)', borderColor: 'color-mix(in srgb, var(--reader-text) 15%, transparent)' }}
              >
                <div className="flex items-center justify-between mb-3 px-2">
                  <h2 className="text-sm font-semibold" style={{ color: 'var(--reader-text)' }}>Contents</h2>
                  <button onClick={() => setTocOpen(false)} style={{ color: 'var(--reader-text)' }}>✕</button>
                </div>
                {tree && <TocTree tree={tree} currentId={currentId} onSelect={goTo} />}
              </div>
            </>
          )}

          <div className="flex-1 flex flex-col">
            {/* Chapter nav */}
            {!focusMode && (
              <div
                className="flex items-center justify-between gap-3 px-4 py-2 border-b max-w-3xl mx-auto w-full"
                style={{ borderColor: 'color-mix(in srgb, var(--reader-text) 10%, transparent)' }}
              >
                <button
                  onClick={() => prevEntry && goTo(prevEntry.id)}
                  disabled={!prevEntry}
                  className="text-sm font-medium disabled:opacity-30 hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--reader-text)' }}
                >
                  ← Prev
                </button>
                <span className="text-xs opacity-60" style={{ color: 'var(--reader-text)' }}>
                  {currentIndex + 1} / {readingOrder.length}
                </span>
                <button
                  onClick={() => nextEntry && goTo(nextEntry.id)}
                  disabled={!nextEntry}
                  className="text-sm font-medium disabled:opacity-30 hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--reader-text)' }}
                >
                  Next →
                </button>
              </div>
            )}

            {/* Chapter content */}
            <div className="flex-1 max-w-3xl mx-auto w-full px-5 py-8 sm:px-6">
              {chapterLoading || !chapter ? (
                <p style={{ color: 'var(--reader-text)' }} className="text-sm opacity-60 animate-pulse">Loading…</p>
              ) : (
                <article>
                  {chapter.breadcrumb?.length > 0 && (
                    <p className="text-xs opacity-60 mb-2" style={{ color: 'var(--reader-text)' }}>
                      {chapter.breadcrumb.join(' › ')}
                    </p>
                  )}
                  {chapter.title && (
                    <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--reader-text)' }}>
                      {chapter.title}
                    </h1>
                  )}
                  {chapter.content.split(/\n\s*\n/).map((para, i) => (
                    <p key={i} className="mb-4 leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--reader-text)' }}>
                      {para}
                    </p>
                  ))}
                </article>
              )}

              {(prevEntry || nextEntry) && (
                <div className="flex items-center justify-between mt-10 pt-6 border-t" style={{ borderColor: 'color-mix(in srgb, var(--reader-text) 10%, transparent)' }}>
                  <button
                    onClick={() => prevEntry && goTo(prevEntry.id)}
                    disabled={!prevEntry}
                    className="text-sm font-medium disabled:opacity-30 hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--reader-text)' }}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => nextEntry && goTo(nextEntry.id)}
                    disabled={!nextEntry}
                    className="text-sm font-medium disabled:opacity-30 hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--reader-text)' }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* PDF/embed reader */
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
      )}
    </div>
  );
}
