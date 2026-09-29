import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useApp } from '../context/AppContext.jsx';
import { getDateRangeCalendar } from '../services/prayerTimesService.js';
import { fmt, tr } from '../i18n/translations.js';
import { gregorianToHijri, hijriMonthDays } from '../utils/hijri.js';
import Loading from '../components/common/Loading.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import { formatDate, formatTime, localDigits } from '../utils/format.js';
import { placeName, placeRegion } from '../utils/place.js';

const RAMADAN = 9;

/** Sehri/iftar for every day of the current (or next) Ramadan — printable and shareable. */
export default function Ramadan() {
  const { location, method, language, timeFormat, hijriOffset } = useApp();
  const [copied, setCopied] = useState(false);
  const today = new Date();
  const days = hijriMonthDays(RAMADAN, today, hijriOffset);
  const start = days[0];
  const end = days[days.length - 1];
  const year = start ? gregorianToHijri(start, hijriOffset).year : null;
  const daysUntil = start
    ? Math.round((start - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000)
    : 0;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['ramadan', location.lat, location.lng, method, start && format(start, 'yyyy-MM-dd'), days.length],
    queryFn: () => getDateRangeCalendar(location.lat, location.lng, format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd'), method),
    enabled: !!start,
  });

  const byDate = Object.fromEntries((data?.days ?? []).map((d) => [d.date, d.prayer_times]));
  const rows = days.map((date, i) => ({ date, roza: i + 1, times: byDate[format(date, 'yyyy-MM-dd')] }));
  const title = fmt('ramadan_share_text', language, { place: placeName(location, language) });

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text: title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // user cancelled the share sheet
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 print:bg-white print:min-h-0">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 print:py-0 print:px-0">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 print:hidden">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tr('ramadan_title', language)}</h1>
          <div className="flex gap-2">
            <button onClick={share} className="px-4 py-2 rounded-md text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
              {copied ? '✓' : tr('ramadan_share', language)}
            </button>
            <button onClick={() => window.print()} className="px-4 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700">
              {tr('ramadan_print', language)}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden print:shadow-none print:border-gray-300 print:rounded-none">
          <div className="bg-green-700 text-white px-5 py-4 print:bg-white print:text-black print:border-b print:border-gray-300">
            <h2 className="text-xl font-bold">{year ? fmt('ramadan_heading', language, { year: localDigits(year, language) }) : tr('ramadan_title', language)}</h2>
            <p className="text-sm opacity-90">
              {[placeName(location, language), placeRegion(location, language)].filter(Boolean).join(', ')} · {method}
              {start && ` · ${formatDate(start, language, { day: 'numeric', month: 'short' })} – ${formatDate(end, language, { day: 'numeric', month: 'short', year: 'numeric' })}`}
            </p>
            {daysUntil > 0 && <p className="text-sm font-medium text-amber-300 mt-1 print:hidden">{fmt('ramadan_starts_in', language, { n: localDigits(daysUntil, language) })}</p>}
          </div>

          {isLoading ? (
            <Loading />
          ) : error ? (
            <div className="p-4"><ErrorMessage error={error} onRetry={refetch} /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-200 text-start print:bg-gray-100 print:text-black">
                  <th className="px-4 py-2 font-semibold w-16">{tr('ramadan_col_day', language)}</th>
                  <th className="px-4 py-2 font-semibold">{tr('ramadan_col_date', language)}</th>
                  <th className="px-4 py-2 font-semibold text-end">{tr('ramadan_col_sehri', language)}</th>
                  <th className="px-4 py-2 font-semibold text-end">{tr('ramadan_col_iftar', language)}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const isToday = r.date.toDateString() === today.toDateString();
                  return (
                    <tr
                      key={r.roza}
                      className={`border-t border-gray-100 dark:border-gray-700 print:border-gray-300 ${
                        isToday ? 'bg-amber-50 dark:bg-amber-900/20 font-semibold' : r.roza > 20 ? 'bg-gray-50/60 dark:bg-gray-700/30' : ''
                      }`}
                    >
                      <td className="px-4 py-1.5 font-bold text-gray-900 dark:text-gray-100 print:text-black">{localDigits(r.roza, language)}</td>
                      <td className="px-4 py-1.5 text-gray-600 dark:text-gray-300 print:text-black">
                        {formatDate(r.date, language, { weekday: 'short', day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-4 py-1.5 text-end tabular-nums font-semibold text-gray-900 dark:text-gray-100 print:text-black">{r.times?.fajr ? formatTime(r.times.fajr, language, timeFormat) : '—'}</td>
                      <td className="px-4 py-1.5 text-end tabular-nums font-semibold text-green-700 dark:text-green-400 print:text-black">{r.times?.maghrib ? formatTime(r.times.maghrib, language, timeFormat, { withPeriod: false }) : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <p className="px-5 py-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 print:text-black">
            {tr('ramadan_note', language)} · {tr('app_name', language)}
          </p>
        </div>
      </div>
    </div>
  );
}
