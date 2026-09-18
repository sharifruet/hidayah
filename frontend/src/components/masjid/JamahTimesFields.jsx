import { useApp } from '../../context/AppContext.jsx';
import { JAMAH_PRAYERS, prayerLabel } from '../../utils/masjid.js';

const inputCls = 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500';

/**
 * Six <input type="time"> fields keyed by prayer. `value` is { fajr: 'HH:MM' | '', ... }.
 */
export default function JamahTimesFields({ value, onChange, disabled = false }) {
  const { language } = useApp();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {JAMAH_PRAYERS.map((prayer) => (
        <label key={prayer} className="block">
          <span className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            {prayerLabel(prayer, language)}
          </span>
          <input
            type="time"
            step="60"
            value={value[prayer] || ''}
            disabled={disabled}
            onChange={(e) => onChange({ ...value, [prayer]: e.target.value })}
            className={inputCls}
          />
        </label>
      ))}
    </div>
  );
}
