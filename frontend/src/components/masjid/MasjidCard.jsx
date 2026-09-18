import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { tr } from '../../i18n/translations.js';
import { JAMAH_PRAYERS, prayerLabel, relativeTime, absoluteTime, formatDistance } from '../../utils/masjid.js';

export default function MasjidCard({ masjid }) {
  const { language } = useApp();
  const name = language === 'bn' && masjid.name_bn ? masjid.name_bn : masjid.name;
  const jamahEntries = JAMAH_PRAYERS.filter((p) => masjid.jamah?.[p]);

  return (
    <Link
      to={`/masjids/${masjid.id}`}
      className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-primary-400 dark:hover:border-green-500 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{name}</h3>
          {language === 'bn' && masjid.name_bn && masjid.name !== masjid.name_bn && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{masjid.name}</p>
          )}
          {(masjid.address || masjid.city) && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 truncate">
              {[masjid.address, masjid.city].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
        {masjid.distance_km != null && (
          <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-medium text-primary-700 dark:text-green-400 bg-primary-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {formatDistance(masjid.distance_km)}
          </span>
        )}
      </div>

      {jamahEntries.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {jamahEntries.map((p) => (
            <span key={p} className="inline-flex items-baseline gap-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1">
              <span className="text-gray-500 dark:text-gray-400">{prayerLabel(p, language)}</span>
              <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">{masjid.jamah[p]}</span>
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 italic">{tr('masjid_no_jamah', language)}</p>
      )}

      {masjid.jamah_updated_at && (
        <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500" title={absoluteTime(masjid.jamah_updated_at)}>
          {tr('masjid_last_updated', language)}: {relativeTime(masjid.jamah_updated_at)}
        </p>
      )}
    </Link>
  );
}
