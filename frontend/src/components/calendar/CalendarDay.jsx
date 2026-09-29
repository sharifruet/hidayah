import { gregorianToHijri } from '../../utils/hijri.js';
import { islamicDaysOn } from '../../utils/islamicDays.js';
import { tr } from '../../i18n/translations.js';
import { useApp } from '../../context/AppContext.jsx';
import { formatTime, localDigits } from '../../utils/format.js';

const PRAYERS = [
  { key: 'fajr',    color: 'text-indigo-500 dark:text-indigo-300' },
  { key: 'sunrise', color: 'text-amber-500 dark:text-amber-300' },
  { key: 'dhuhr',   color: 'text-yellow-600 dark:text-yellow-300' },
  { key: 'asr',     color: 'text-orange-500 dark:text-orange-300' },
  { key: 'maghrib', color: 'text-rose-500 dark:text-rose-300' },
  { key: 'isha',    color: 'text-violet-500 dark:text-violet-300' },
];

export default function CalendarDay({ day, dayData, isToday = false, onClick = null, language = 'en' }) {
  const { timeFormat } = useApp();
  const dayNumber = localDigits(day.getDate(), language);
  const hijri = gregorianToHijri(day);
  const events = islamicDaysOn(day);
  const special = events.filter((e) => e.kind !== 'fast');
  const fasts = events.filter((e) => e.kind === 'fast');

  return (
    <div
      onClick={onClick}
      className={`
        border rounded-lg p-2 transition-all
        ${isToday
          ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-700 border-2'
          : 'bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-600/50 hover:bg-white dark:hover:bg-gray-700'}
        ${onClick ? 'cursor-pointer hover:shadow-sm' : ''}
      `}
    >
      {/* Day number + Hijri */}
      <div className="flex items-baseline justify-between mb-1.5">
        <span className={`text-sm font-bold ${isToday ? 'text-green-700 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'}`}>
          {dayNumber}
        </span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 leading-none">
          {localDigits(hijri.day, language)} {hijri.monthNameAr}
        </span>
      </div>

      {/* Islamic days */}
      {special.map((e) => (
        <div key={e.key} className="mb-1 rounded px-1 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-[10px] font-semibold leading-tight text-amber-800 dark:text-amber-300">
          {e.kind === 'night' ? '🌙 ' : ''}{tr(`iday_${e.key}`, language)}
        </div>
      ))}
      {fasts.length > 0 && (
        <div className="mb-1 text-[9px] leading-tight text-sky-600 dark:text-sky-400" title={fasts.map((e) => tr(`iday_${e.key}`, language)).join(' · ')}>
          ● {fasts.map((e) => tr(`iday_${e.key}`, language)).join(' · ')}
        </div>
      )}

      {/* Prayer times */}
      {dayData?.prayer_times ? (
        <div className="space-y-0.5">
          {PRAYERS.map(({ key, color }) => {
            const time = dayData.prayer_times[key];
            if (!time) return null;
            return (
              <div key={key} className="flex items-center justify-between gap-1">
                <span className={`text-[10px] font-medium leading-none ${color}`}>
                  {tr(`prayer_${key}`, language)}
                </span>
                <span className="text-[10px] text-gray-600 dark:text-gray-300 tabular-nums leading-none">
                  {formatTime(time, language, timeFormat, { withPeriod: false })}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-[10px] text-gray-300 dark:text-gray-600 text-center py-1">—</div>
      )}
    </div>
  );
}
