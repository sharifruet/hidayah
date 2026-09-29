/**
 * Platform-neutral data for the "next prayer" home-screen widget: which prayer is next,
 * its time, and a timeline of hand-offs so the widget advances on its own at each prayer.
 */
import type { LanguageCode } from '../lib/constants';
import type { PrayerDay } from '../lib/prayerDays';
import { fmt, tr } from '../data/translations';
import { formatDuration, formatTime, getTimeFormat } from '../lib/format';

const ORDER = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

export interface NextPrayerProps {
  /** Localised prayer name. */
  name: string;
  /** Display time in the saved language and 12/24-hour format ("ভোর ৪:৫২", "4:52 AM"). */
  time: string;
  /** Epoch ms of the prayer — the widget counts down to it. */
  target: number;
  /** Localised "Next prayer" label. */
  label: string;
  location: string;
}

export interface NextPrayerEntry {
  /** When this entry becomes current (the previous prayer's start, or now). */
  date: Date;
  props: NextPrayerProps;
}

function instants(days: PrayerDay[]): { key: (typeof ORDER)[number]; time: string; at: Date }[] {
  return days.flatMap(({ date, times }) =>
    ORDER.filter((k) => times[k]).map((key) => {
      const [h, m] = times[key].split(':').map(Number);
      return { key, time: times[key], at: new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m) };
    })
  );
}

/** Timeline starting now; `maxEntries` bounds how far ahead it runs. */
export function nextPrayerTimeline(
  days: PrayerDay[],
  language: LanguageCode,
  location: string,
  now: Date = new Date(),
  maxEntries = 18
): NextPrayerEntry[] {
  const all = instants(days).sort((a, b) => a.at.getTime() - b.at.getTime());
  const first = all.findIndex((p) => p.at.getTime() > now.getTime());
  if (first < 0) return [];
  const label = tr('widget_next', language);
  const timeFormat = getTimeFormat();
  return all.slice(first, first + maxEntries).map((p, i) => ({
    date: i === 0 ? now : all[first + i - 1].at,
    props: {
      name: tr(`prayer_${p.key}`, language),
      time: formatTime(p.time, language, timeFormat),
      target: p.at.getTime(),
      label,
      location,
    },
  }));
}

/** "in 1h 20m" / "১ ঘণ্টা ২০ মিনিট পর" — for widgets that can't tick (Android). */
export function coarseTimeLeft(target: number, language: LanguageCode, now = Date.now()): string {
  const mins = Math.max(0, Math.round((target - now) / 60000));
  return fmt('widget_in', language, { time: formatDuration(mins, language) });
}
