import { usePrayerTimes } from '../../hooks/usePrayerTimes.js';
import { useApp } from '../../context/AppContext.jsx';
import Loading from '../common/Loading.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import PrayerTimeItem from './PrayerTimeItem.jsx';
import { formatDate, getCurrentPrayer, getTimeUntilNextPrayer, formatCountdown } from '../../utils/formatters.js';
import { format } from 'date-fns';
import { PRAYER_LABELS, PRAYER_LABELS_BN } from '../../utils/constants.js';
import { useState, useEffect } from 'react';

export default function PrayerTimesCard({ date = new Date(), onMethodChange = null }) {
  const { location, method, language } = useApp();
  const { data, isLoading, error, refetch } = usePrayerTimes(location.lat, location.lng, date, method, { sunset_adjustment: 29 });
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [countdown, setCountdown] = useState(null);

  const labels = language === 'bn' ? PRAYER_LABELS_BN : PRAYER_LABELS;

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
    return <Loading message="Loading prayer times..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  if (!data?.times) {
    return <ErrorMessage error="No prayer times data available" />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {language === 'bn' ? 'সালাতের সময়' : 'Prayer Times'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {formatDate(date)} • {location.name || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
        </p>
      </div>

      {currentPrayer && countdown !== null && (
        <div className="mb-4 p-4 bg-primary-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {language === 'bn' ? 'পরবর্তী সালাত' : 'Next Prayer'}
          </p>
          <p className="text-lg font-semibold text-primary-700">
            {labels[currentPrayer.next]}: {data.times[currentPrayer.next]}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {language === 'bn' ? 'সময় বাকি' : 'Time remaining'}: {formatCountdown(countdown)}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <PrayerTimeItem
          label={labels.fajr}
          time={data.times.fajr}
          isCurrent={currentPrayer?.current === 'fajr'}
        />
        <PrayerTimeItem
          label={labels.sunrise}
          time={data.times.sunrise}
          isCurrent={currentPrayer?.current === 'sunrise'}
        />
        <PrayerTimeItem
          label={labels.dhuhr}
          time={data.times.dhuhr}
          isCurrent={currentPrayer?.current === 'dhuhr'}
        />
        <PrayerTimeItem
          label={labels.asr}
          time={data.times.asr}
          isCurrent={currentPrayer?.current === 'asr'}
        />
        <PrayerTimeItem
          label={labels.maghrib}
          time={data.times.maghrib}
          isCurrent={currentPrayer?.current === 'maghrib'}
        />
        <PrayerTimeItem
          label={labels.isha}
          time={data.times.isha}
          isCurrent={currentPrayer?.current === 'isha'}
        />
      </div>

      {onMethodChange && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'bn' ? 'গণনা পদ্ধতি' : 'Calculation Method'}
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
