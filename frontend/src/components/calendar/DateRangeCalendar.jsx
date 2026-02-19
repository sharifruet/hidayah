import { useQuery } from '@tanstack/react-query';
import { getDateRangeCalendar } from '../../services/prayerTimesService.js';
import { useApp } from '../../context/AppContext.jsx';
import Loading from '../common/Loading.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import { format } from 'date-fns';
import { PRAYER_LABELS, PRAYER_LABELS_BN } from '../../utils/constants.js';

export default function DateRangeCalendar({ startDate, endDate }) {
  const { location, method, language } = useApp();
  const startDateStr = format(startDate, 'yyyy-MM-dd');
  const endDateStr = format(endDate, 'yyyy-MM-dd');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['date-range-calendar', location.lat, location.lng, startDateStr, endDateStr, method, 'sunset_adj_29'],
    queryFn: () => getDateRangeCalendar(location.lat, location.lng, startDateStr, endDateStr, method, true, { sunset_adjustment: 29 }),
    enabled: !!location.lat && !!location.lng && !!startDate && !!endDate,
  });

  const labels = language === 'bn' ? PRAYER_LABELS_BN : PRAYER_LABELS;

  if (isLoading) {
    return <Loading message="Loading calendar..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  if (!data?.days) {
    return <ErrorMessage error="No calendar data available" />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
        </h2>
        <p className="text-sm text-gray-600">
          {location.name || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`} • {method} • {data.total_days} days
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {labels.fajr || 'Fajr'}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {labels.sunrise || 'Sunrise'}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {labels.dhuhr || 'Dhuhr'}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {labels.asr || 'Asr'}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {labels.maghrib || 'Maghrib'}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {labels.isha || 'Isha'}
              </th>
              {data.days[0]?.fasting && (
                <>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sehri
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Iftar
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.days.map((day, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {format(new Date(day.date), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {day.prayer_times?.fajr || '--'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {day.prayer_times?.sunrise || '--'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {day.prayer_times?.dhuhr || '--'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {day.prayer_times?.asr || '--'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {day.prayer_times?.maghrib || '--'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {day.prayer_times?.isha || '--'}
                </td>
                {day.fasting && (
                  <>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-orange-600 font-medium">
                      {day.fasting.sehri_end || '--'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-orange-600 font-medium">
                      {day.fasting.iftar || '--'}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
