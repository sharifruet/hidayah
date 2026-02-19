import { useQuery } from '@tanstack/react-query';
import { getYearlyCalendar } from '../../services/prayerTimesService.js';
import { useApp } from '../../context/AppContext.jsx';
import Loading from '../common/Loading.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import { format, startOfYear, endOfYear, eachMonthOfInterval } from 'date-fns';

export default function YearlyCalendar({ year, format: viewFormat = 'summary' }) {
  const { location, method, language } = useApp();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['yearly-calendar', location.lat, location.lng, year, method, viewFormat, 'sunset_adj_29'],
    queryFn: () => getYearlyCalendar(location.lat, location.lng, year, method, viewFormat, true, { sunset_adjustment: 29 }),
    enabled: !!location.lat && !!location.lng,
  });

  if (isLoading) {
    return <Loading message="Loading yearly calendar..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  if (!data?.days) {
    return <ErrorMessage error="No calendar data available" />;
  }

  const yearStart = startOfYear(new Date(year, 0, 1));
  const yearEnd = endOfYear(new Date(year, 11, 31));
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  const monthNames = language === 'bn'
    ? ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
        <h2 className="text-2xl font-bold text-gray-800">{year}</h2>
        <p className="text-sm text-gray-600">
          {location.name || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`} • {method}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {months.map((month, index) => {
          const monthDays = daysByMonth[index] || [];
          const monthName = monthNames[index];

          return (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">{monthName}</h3>
              <div className="space-y-2">
                {viewFormat === 'summary' ? (
                  monthDays.slice(0, 5).map((day, dayIndex) => (
                    <div key={dayIndex} className="text-sm text-gray-600 border-b pb-1">
                      <span className="font-medium">{format(new Date(day.date), 'd')}:</span>
                      {' '}Fajr: {day.fajr}, Maghrib: {day.maghrib}
                      {day.iftar && <span className="text-orange-600">, Iftar: {day.iftar}</span>}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">
                    {monthDays.length} days with full details
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
