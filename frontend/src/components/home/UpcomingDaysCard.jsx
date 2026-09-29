import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { tr } from '../../i18n/translations.js';
import { upcomingIslamicDays, whenLabel } from '../../utils/islamicDays.js';
import { formatDate } from '../../utils/format.js';

/** Next few annual observances. */
export default function UpcomingDaysCard({ count = 3 }) {
  const { language, hijriOffset } = useApp();
  const items = upcomingIslamicDays(new Date(), 400, hijriOffset).slice(0, count);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{tr('home_upcoming_days', language)}</h2>
        <Link to="/islamic-days" className="text-xs font-medium text-primary-600 dark:text-green-400 hover:underline">
          {tr('islamic_days_title', language)} →
        </Link>
      </div>
      <ul className="divide-y divide-gray-100 dark:divide-gray-700">
        {items.map((e) => (
          <li key={e.key} className="flex items-center justify-between py-2 gap-3">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {e.kind === 'night' ? '🌙 ' : e.kind === 'eid' ? '⭐ ' : ''}
              {tr(`iday_${e.key}`, language)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 text-right">
              {formatDate(e.date, language, { day: 'numeric', month: 'short' })} · {whenLabel(e, language)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
