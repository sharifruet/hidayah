import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { usePrayerTimes } from '../../hooks/usePrayerTimes.js';
import { fmt, tr } from '../../i18n/translations.js';
import { addDays, gregorianToHijri, hijriMonthName } from '../../utils/hijri.js';
import { activeForbiddenWindow } from '../../utils/forbiddenTimes.js';
import { formatCountdownSeconds, formatDate, formatTime, localDigits } from '../../utils/format.js';
import ErrorMessage from '../common/ErrorMessage.jsx';
import { placeName } from '../../utils/place.js';

const ORDER = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
const RAMADAN = 9;

function at(day, hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m);
}

/** Home hero: next-prayer countdown, today's Hijri date, and sehri/iftar during Ramadan. */
export default function NextPrayerCard() {
  const { location, method, language, timeFormat, hijriOffset } = useApp();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = addDays(today, 1);
  const { data: todayData, error: todayError, refetch: refetchToday } = usePrayerTimes(location.lat, location.lng, today, method);
  const { data: tomorrowData, error: tomorrowError, refetch: refetchTomorrow } = usePrayerTimes(location.lat, location.lng, tomorrow, method);

  const hijri = gregorianToHijri(now, hijriOffset);
  const isRamadan = hijri.month === RAMADAN;
  const time = (hhmm) => formatTime(hhmm, language, timeFormat);

  // Next prayer instant: today's remaining ones, else tomorrow's Fajr.
  const candidates = [
    ...ORDER.filter((k) => todayData?.times?.[k]).map((k) => ({ key: k, time: todayData.times[k], at: at(today, todayData.times[k]) })),
    ...(tomorrowData?.times?.fajr ? [{ key: 'fajr', time: tomorrowData.times.fajr, at: at(tomorrow, tomorrowData.times.fajr) }] : []),
  ];
  const next = candidates.find((c) => c.at > now);
  const forbiddenNow = activeForbiddenWindow(todayData?.times, now);
  // Without today's times (or, late at night, tomorrow's) there is no reliable "next prayer".
  const timesError = (todayError && !todayData) || (!next && tomorrowError && !tomorrowData);
  const retry = () => {
    if (todayError) refetchToday();
    if (tomorrowError) refetchTomorrow();
  };

  // Ramadan: sehri = Fajr, iftar = Maghrib; after iftar, show tomorrow's sehri.
  const iftarPassed = todayData?.times?.maghrib && at(today, todayData.times.maghrib) <= now;
  const sehriSource = iftarPassed ? tomorrowData?.times : todayData?.times;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-green-700 to-green-900 text-white shadow-md px-6 py-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-green-200">{tr('home_today_hijri', language)}</p>
          <p className="text-2xl font-bold mt-0.5">
            {localDigits(hijri.day, language)} {hijriMonthName(hijri.month, language)} {localDigits(hijri.year, language)} {tr('pr_hijri_era', language)}
          </p>
          <p className="text-sm text-green-100 mt-0.5">
            {formatDate(now, language, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p className="text-xs text-green-200 mt-2">📍 {placeName(location, language)}</p>
        </div>

        <div className="text-end">
          <p className="text-xs uppercase tracking-wider text-green-200">{tr('widget_next', language)}</p>
          {timesError ? (
            <ErrorMessage
              variant="onDark"
              error={tr('error_load_times', language)}
              onRetry={retry}
              className="mt-2 justify-end max-w-xs"
            />
          ) : (
            <>
              <p className="text-3xl font-bold mt-0.5">{next ? tr(`prayer_${next.key}`, language) : '—'}</p>
              <p className="text-lg text-green-100 tabular-nums">{next ? time(next.time) : '--:--'}</p>
              <p className="text-2xl font-semibold tabular-nums text-amber-300 mt-1" aria-live="off">
                {next ? formatCountdownSeconds((next.at - now) / 1000, language) : '--:--:--'}
              </p>
            </>
          )}
        </div>
      </div>

      {forbiddenNow && (
        <p className="mt-4 px-3 py-2 rounded-lg bg-rose-500/20 text-xs font-medium text-rose-100">
          {fmt('forbidden_now', language, { end: time(forbiddenNow.end) })}
        </p>
      )}

      {isRamadan && todayData?.times && (
        <div className="mt-4 pt-4 border-t border-white/15 flex flex-wrap items-center gap-x-8 gap-y-2">
          <div>
            <p className="text-xs text-green-200">{tr('home_sehri', language)}</p>
            <p className="text-xl font-semibold tabular-nums">{time(sehriSource?.fajr)}</p>
          </div>
          <div>
            <p className="text-xs text-green-200">{tr('home_iftar', language)}</p>
            <p className="text-xl font-semibold tabular-nums">{time(todayData.times.maghrib)}</p>
          </div>
          <Link to="/ramadan" className="ms-auto text-sm font-medium text-amber-300 hover:underline">
            {tr('home_ramadan_timetable', language)} →
          </Link>
        </div>
      )}
    </div>
  );
}
