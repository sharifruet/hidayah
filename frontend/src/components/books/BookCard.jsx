import { Link } from 'react-router-dom';
import TopicBadge from './TopicBadge.jsx';

export default function BookCard({ book }) {
  return (
    <Link
      to={`/books/${book.slug}`}
      className="group flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all"
    >
      {/* Cover */}
      <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
          {book.title}
        </h3>
        {book.author && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{book.author}</p>
        )}
        {book.islamic_topics?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {book.islamic_topics.slice(0, 2).map(t => (
              <TopicBadge key={t} topic={t} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
