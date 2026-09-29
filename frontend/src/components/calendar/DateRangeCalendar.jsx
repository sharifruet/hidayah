import { useQuery } from '@tanstack/react-query';
import { getDateRangeCalendar } from '../../services/prayerTimesService.js';
import { useApp } from '../../context/AppContext.jsx';
import Loading from '../common/Loading.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import { format } from 'date-fns';
import { tr, fmt } from '../../i18n/translations.js';
import { formatDate, formatTime, localDigits } from '../../utils/format.js';
import { placeName } from '../../utils/place.js';

const PRAYER_COLUMNS = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
const SHORT_DATE = { day: 'numeric', month: 'short' };
const FULL_DATE = { day: 'numeric', month: 'short', year: 'numeric' };

export default function DateRangeCalendar({ startDate, endDate }) {
  const { location, method, language, timeFormat } = useApp();
  const startDateStr = format(startDate, 'yyyy-MM-dd');
  const endDateStr = format(endDate, 'yyyy-MM-dd');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['date-range-calendar', location.lat, location.lng, startDateStr, endDateStr, method],
    queryFn: () => getDateRangeCalendar(location.lat, location.lng, startDateStr, endDateStr, method, true),
    enabled: !!location.lat && !!location.lng && !!startDate && !!endDate,
  });

  if (isLoading) {
    return <Loading message={tr('cal_loading', language)} />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  if (!data?.days) {
    return <ErrorMessage error={tr('cal_no_data', language)} onRetry={refetch} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {formatDate(startDate, language, SHORT_DATE)} – {formatDate(endDate, language, FULL_DATE)}
        </h2>
        <p className="text-sm text-gray-600">
          {placeName(location, language) || localDigits(`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`, language)} • {method} •{' '}
          {fmt('cal_days_count', language, { n: localDigits(data.total_days ?? data.days.length, language) })}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                {tr('cal_col_date', language)}
              </th>
              {PRAYER_COLUMNS.map((key) => (
                <th key={key} className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {tr(`prayer_${key}`, language)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.days.map((day, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatDate(day.date, language, FULL_DATE)}
                </td>
                {PRAYER_COLUMNS.map((key) => (
                  <td key={key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {formatTime(day.prayer_times?.[key], language, timeFormat)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
