import { useQuery } from '@tanstack/react-query';
import { getYearlyCalendar } from '../../services/prayerTimesService.js';
import { useApp } from '../../context/AppContext.jsx';
import Loading from '../common/Loading.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import { startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';
import { tr, fmt } from '../../i18n/translations.js';
import { formatDate, formatTime, localDigits } from '../../utils/format.js';
import { placeName } from '../../utils/place.js';

export default function YearlyCalendar({ year, format: viewFormat = 'summary' }) {
  const { location, method, language, timeFormat } = useApp();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['yearly-calendar', location.lat, location.lng, year, method, viewFormat],
    queryFn: () => getYearlyCalendar(location.lat, location.lng, year, method, viewFormat, true),
    enabled: !!location.lat && !!location.lng,
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

  const yearStart = startOfYear(new Date(year, 0, 1));
  const yearEnd = endOfYear(new Date(year, 11, 31));
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  // Group days by month
  const daysByMonth = {};
  data.days.forEach(day => {
    const month = new Date(day.date).getMonth();
    if (!daysByMonth[month]) {
      daysByMonth[month] = [];
    }
    daysByMonth[month].push(day);
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{localDigits(year, language)}</h2>
        <p className="text-sm text-gray-600">
          {placeName(location, language) || localDigits(`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`, language)} • {method}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {months.map((month, index) => {
          const monthDays = daysByMonth[index] || [];
          const monthName = formatDate(month, language, { month: 'long' });

          return (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">{monthName}</h3>
              <div className="space-y-2">
                {viewFormat === 'summary' ? (
                  monthDays.slice(0, 5).map((day, dayIndex) => (
                    <div key={dayIndex} className="text-sm text-gray-600 border-b pb-1">
                      <span className="font-medium">{formatDate(day.date, language, { day: 'numeric' })}:</span>
                      {' '}{tr('prayer_fajr', language)}: {formatTime(day.fajr, language, timeFormat)},{' '}
                      {tr('prayer_maghrib', language)}: {formatTime(day.maghrib, language, timeFormat)}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">
                    {fmt('cal_days_full_details', language, { n: localDigits(monthDays.length, language) })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
