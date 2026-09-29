import { useQuery } from '@tanstack/react-query';
import { getMonthlyCalendar } from '../../services/prayerTimesService.js';
import { useApp } from '../../context/AppContext.jsx';
import Loading from '../common/Loading.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import CalendarDay from './CalendarDay.jsx';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { gregorianToHijri, hijriMonthName } from '../../utils/hijri.js';
import { tr, fmt } from '../../i18n/translations.js';
import { formatDate, formatMonthYear, localDigits } from '../../utils/format.js';
import { placeName } from '../../utils/place.js';

export default function MonthlyCalendar({ year, month, onDateClick = null }) {
  const { location, method, language, hijriOffset } = useApp();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['monthly-calendar', location.lat, location.lng, year, month, method],
    queryFn: () => getMonthlyCalendar(location.lat, location.lng, year, month, method, true),
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

  // Localized short weekday names, Sunday first (2023-01-01 was a Sunday).
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    formatDate(new Date(2023, 0, 1 + i), language, { weekday: 'short' })
  );

  // Derive Hijri month range (start–end) for display
  const hijriStart = gregorianToHijri(monthStart, hijriOffset);
  const hijriEnd = gregorianToHijri(monthEnd, hijriOffset);
  const sameHijriMonth = hijriStart.month === hijriEnd.month && hijriStart.year === hijriEnd.year;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {formatMonthYear(monthStart, language)}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {placeName(location, language) || localDigits(`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`, language)} • {method}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {sameHijriMonth
            ? `${hijriMonthName(hijriStart.month, language)} ${fmt('cal_hijri_year', language, { year: localDigits(hijriStart.year, language) })} (${hijriStart.monthNameAr})`
            : `${hijriMonthName(hijriStart.month, language)} ${localDigits(hijriStart.year, language)} – ${hijriMonthName(hijriEnd.month, language)} ${fmt('cal_hijri_year', language, { year: localDigits(hijriEnd.year, language) })}`}
        </p>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center font-semibold text-gray-600 dark:text-gray-400 text-sm py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`} />
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
              language={language}
            />
          );
        })}
      </div>
    </div>
  );
}
