import { format } from 'date-fns';
import { gregorianToHijri } from '../../utils/hijri.js';

const PRAYERS = [
  { key: 'fajr',    labelEn: 'Fajr',    labelBn: 'ফজর',    color: 'text-indigo-500 dark:text-indigo-300' },
  { key: 'sunrise', labelEn: 'Sunrise',  labelBn: 'সূর্যোদয়', color: 'text-amber-500 dark:text-amber-300' },
  { key: 'dhuhr',   labelEn: 'Dhuhr',   labelBn: 'যোহর',   color: 'text-yellow-600 dark:text-yellow-300' },
  { key: 'asr',     labelEn: 'Asr',     labelBn: 'আসর',    color: 'text-orange-500 dark:text-orange-300' },
  { key: 'maghrib', labelEn: 'Maghrib', labelBn: 'মাগরিব', color: 'text-rose-500 dark:text-rose-300' },
  { key: 'isha',    labelEn: 'Isha',    labelBn: 'ইশা',    color: 'text-violet-500 dark:text-violet-300' },
];

export default function CalendarDay({ day, dayData, isToday = false, onClick = null, language = 'en' }) {
  const dayNumber = format(day, 'd');
  const hijri = gregorianToHijri(day);
  const isBn = language === 'bn';

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
          {hijri.day} {hijri.monthNameAr}
        </span>
      </div>

      {/* Prayer times */}
      {dayData?.prayer_times ? (
        <div className="space-y-0.5">
          {PRAYERS.map(({ key, labelEn, labelBn, color }) => {
            const time = dayData.prayer_times[key];
            if (!time) return null;
            return (
              <div key={key} className="flex items-center justify-between gap-1">
                <span className={`text-[10px] font-medium leading-none ${color}`}>
                  {isBn ? labelBn : labelEn}
                </span>
                <span className="text-[10px] text-gray-600 dark:text-gray-300 tabular-nums leading-none">
                  {time}
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
