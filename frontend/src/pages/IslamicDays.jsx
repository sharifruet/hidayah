import { useApp } from '../context/AppContext.jsx';
import { tr } from '../i18n/translations.js';
import { addDays, gregorianToHijri, hijriMonthName } from '../utils/hijri.js';
import { islamicDaysOn, upcomingIslamicDays, whenLabel } from '../utils/islamicDays.js';
import { formatDate, localDigits } from '../utils/format.js';

const ICON = { eid: '⭐', major: '📅', night: '🌙', fast: '🍽️' };

export default function IslamicDays() {
  const { language, hijriOffset } = useApp();
  const today = new Date();
  const upcoming = upcomingIslamicDays(today, 400, hijriOffset);
  const fasts = Array.from({ length: 30 }, (_, i) => addDays(today, i + 1))
    .map((date) => ({ date, events: islamicDaysOn(date, hijriOffset).filter((e) => e.kind === 'fast') }))
    .filter((d) => d.events.length);
  const dateLabel = (d) => formatDate(d, language, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{tr('islamic_days_title', language)}</h1>

        <div className="grid gap-6 md:grid-cols-5">
          <section className="md:col-span-3">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{tr('islamic_days_upcoming', language)}</h2>
            <ul className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
              {upcoming.map((e) => {
                const h = gregorianToHijri(e.kind === 'night' ? addDays(e.date, 1) : e.date, hijriOffset);
                return (
                  <li key={e.key} className="flex gap-3 px-5 py-4">
                    <span className="text-xl leading-none mt-0.5" aria-hidden>{ICON[e.kind]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {tr(`iday_${e.key}`, language)}
                          {e.kind === 'night' && <span className="font-normal text-gray-500"> {tr('islamic_days_night_suffix', language)}</span>}
                        </p>
                        <span className={`text-xs font-medium ${e.daysAway <= 1 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                          {whenLabel(e, language)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {dateLabel(e.date)} · {localDigits(h.day, language)} {hijriMonthName(h.month, language)} {localDigits(h.year, language)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{tr(`iday_${e.key}_note`, language)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="md:col-span-2">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{tr('islamic_days_fasts', language)}</h2>
            <ul className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
              {fasts.map(({ date, events }) => (
                <li key={date.toISOString()} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {formatDate(date, language, { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-xs text-sky-600 dark:text-sky-400 text-right">
                    {events.map((e) => tr(`iday_${e.key}`, language)).join(' · ')}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">{tr('islamic_days_note', language)}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tr('web_reminders_note', language)}</p>
      </div>
    </div>
  );
}
