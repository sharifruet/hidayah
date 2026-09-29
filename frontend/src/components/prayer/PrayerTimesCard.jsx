import { usePrayerTimes } from '../../hooks/usePrayerTimes.js';
import { useApp } from '../../context/AppContext.jsx';
import Loading from '../common/Loading.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import PrayerTimeItem from './PrayerTimeItem.jsx';
import { getCurrentPrayer, getTimeUntilNextPrayer } from '../../utils/formatters.js';
import { formatDate, formatDuration, formatTime } from '../../utils/format.js';
import { tr } from '../../i18n/translations.js';
import { useState, useEffect } from 'react';
import { placeName } from '../../utils/place.js';

const ROWS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

export default function PrayerTimesCard({ date = new Date(), onMethodChange = null }) {
  const { location, method, language, timeFormat } = useApp();
  const { data, isLoading, error, refetch } = usePrayerTimes(location.lat, location.lng, date, method);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const label = (key) => tr(`prayer_${key}`, language);
  const time = (hhmm) => formatTime(hhmm, language, timeFormat);

  useEffect(() => {
    if (data?.times) {
      const updatePrayerInfo = () => {
        const now = new Date();
        const prayerInfo = getCurrentPrayer(data.times, now);
        setCurrentPrayer(prayerInfo);

        if (prayerInfo) {
          const minutesUntil = getTimeUntilNextPrayer(data.times, now);
          setCountdown(minutesUntil);
        }
      };

      // Initial update
      updatePrayerInfo();

      // Update countdown every minute
      const interval = setInterval(updatePrayerInfo, 60000);

      return () => clearInterval(interval);
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage error={error} title={tr('error_load_times', language)} onRetry={refetch} />;
  }

  if (!data?.times) {
    return <ErrorMessage error={tr('error_load_times', language)} onRetry={refetch} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {tr('pr_title', language)}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {formatDate(date, language)} • {placeName(location, language) || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
        </p>
      </div>

      {currentPrayer && countdown !== null && (
        <div className="mb-4 p-4 bg-primary-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {tr('widget_next', language)}
          </p>
          <p className="text-lg font-semibold text-primary-700">
            {label(currentPrayer.next)}: {time(data.times[currentPrayer.next])}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {tr('pr_time_remaining', language)}: {formatDuration(countdown, language)}
          </p>
        </div>
      )}

      <div className="space-y-2">
        {ROWS.map((key) => (
          <PrayerTimeItem
            key={key}
            label={label(key)}
            time={time(data.times[key])}
            isCurrent={currentPrayer?.current === key}
          />
        ))}
      </div>

      {onMethodChange && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {tr('settings_calc_method', language)}
          </label>
          <select
            value={method}
            onChange={(e) => onMethodChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="karachi">Karachi</option>
            <option value="mwl">MWL</option>
            <option value="isna">ISNA</option>
            <option value="umm_al_qura">Umm Al-Qura</option>
            <option value="hanafi">Hanafi</option>
          </select>
        </div>
      )}
    </div>
  );
}
