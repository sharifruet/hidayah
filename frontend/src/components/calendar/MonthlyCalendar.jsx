import { useQuery } from '@tanstack/react-query';
import { getMonthlyCalendar } from '../../services/prayerTimesService.js';
import { useApp } from '../../context/AppContext.jsx';
import Loading from '../common/Loading.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import CalendarDay from './CalendarDay.jsx';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { PRAYER_LABELS, PRAYER_LABELS_BN } from '../../utils/constants.js';

export default function MonthlyCalendar({ year, month, onDateClick = null }) {
  const { location, method, language } = useApp();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['monthly-calendar', location.lat, location.lng, year, month, method],
    queryFn: () => getMonthlyCalendar(location.lat, location.lng, year, month, method, true),
    enabled: !!location.lat && !!location.lng,
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

  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(new Date(year, month - 1));
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of week (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = monthStart.getDay();

  // Create empty cells for days before month starts
  const emptyCells = Array(firstDayOfWeek).fill(null);

  // Get day data from API response
  const getDayData = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return data.days.find(d => d.date === dateStr);
  };

  const weekDays = language === 'bn'
    ? ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {format(monthStart, 'MMMM yyyy')}
        </h2>
        <p className="text-sm text-gray-600">
          {location.name || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`} • {method}
        </p>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center font-semibold text-gray-700 text-sm py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {daysInMonth.map((day) => {
          const dayData = getDayData(day);
          const isCurrentDay = isToday(day);

          return (
            <CalendarDay
              key={format(day, 'yyyy-MM-dd')}
              day={day}
              dayData={dayData}
              isToday={isCurrentDay}
              onClick={() => onDateClick && onDateClick(day)}
              labels={labels}
            />
          );
        })}
      </div>
    </div>
  );
}
