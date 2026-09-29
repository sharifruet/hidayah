/**
 * Keeps every enabled reminder (prayer / adhan, check-in, Ramadan, jamah, Jumu'ah, Islamic
 * days, sunnah fasts) scheduled days ahead, so they keep firing even if the app isn't
 * opened. Times are calculated on-device (`prayerCalc`), so this needs no network and can
 * run from a background task. Also refreshes the home-screen widget.
 *
 * Reads settings straight from storage rather than React state so the background task
 * (which mounts no UI) can call it too.
 */
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';

import { storage } from './storage';
import { SUPPORTED_LANGUAGES, type LanguageCode } from './constants';
import { addDays } from './dates';
import { upcomingPrayerDays, type PrayerDay } from './prayerDays';
import { gregorianToHijri } from './hijri';
import { islamicDaysOn } from './islamicDays';
import { readMyMasjid, myMasjidName } from './myMasjid';
import type { JamahPrayer } from './services/masjids';
import { fmt, tr } from '../data/translations';
import { formatTime, getTimeFormat } from './format';
import {
  CHANNELS,
  TAGS,
  notificationsAvailable,
  replaceScheduledNotifications,
  type PlannedNotification,
} from './notifications';
import { updateWidgets } from '../widgets/updateWidgets';
import {
  ADHAN_SOUND_KEY,
  CHECKIN_KEY,
  FAJR_SOFT_ADHAN_KEY,
  ISLAMIC_DAY_REMINDERS_KEY,
  JAMAH_LEAD_KEY,
  JAMAH_REMINDERS_KEY,
  JUMUAH_REMINDER_KEY,
  LANGUAGE_KEY,
  NOTIFICATIONS_KEY,
  RAMADAN_REMINDERS_KEY,
  SUNNAH_FAST_REMINDERS_KEY,
  DEFAULT_JAMAH_LEAD_MINUTES,
} from '../context/AppContext';

type Prayer = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

// Enough days that sparse categories (Islamic days, Jumu'ah) are covered; the planner keeps
// only the earliest notifications anyway (see MAX_SCHEDULED in notifications.ts).
const HORIZON_DAYS = 7;
const RAMADAN_MONTH = 9;
const PRAYERS: Prayer[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
// Minutes after a prayer's start time before the "did you pray?" check-in fires — long
// enough that the prayer window has clearly passed, short enough to still be a same-window
// reminder rather than an end-of-day catch-all.
const CHECKIN_DELAY_MINUTES = 20;
const SUHOOR_WARNING_MINUTES = 20;
const JUMUAH_LEAD_MINUTES = 60;
const EVE_REMINDER = { hour: 20, minute: 0 };
const FAST_REMINDER = { hour: 21, minute: 0 };

const BACKGROUND_TASK = 'hidayah-reschedule-reminders';

const enabled = (key: string) => storage.getString(key) === 'true';

function language(): LanguageCode {
  const stored = storage.getString(LANGUAGE_KEY) as LanguageCode | undefined;
  return stored && SUPPORTED_LANGUAGES.includes(stored) ? stored : 'bn';
}

/** A notification's "HH:MM" in the saved language and 12/24-hour preference. */
function showTime(hhmm: string, lang: LanguageCode): string {
  return formatTime(hhmm, lang, getTimeFormat());
}

function at(day: Date, time: string, offsetMinutes = 0): Date {
  const [h, m] = time.split(':').map(Number);
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m + offsetMinutes);
}

function atClock(day: Date, { hour, minute }: { hour: number; minute: number }): Date {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute);
}

type Day = PrayerDay;

function planPrayerAlerts(days: Day[], lang: LanguageCode): PlannedNotification[] {
  const adhan = (storage.getString(ADHAN_SOUND_KEY) ?? 'makkah') === 'makkah';
  const softFajr = storage.getString(FAJR_SOFT_ADHAN_KEY) !== 'false';
  return days.flatMap(({ date, times }) =>
    PRAYERS.filter((p) => times[p]).map((p) => {
      const name = tr(`prayer_${p}`, lang);
      const channelId = !adhan ? CHANNELS.prayerSystem : p === 'fajr' && softFajr ? CHANNELS.adhanFajr : CHANNELS.adhan;
      return {
        date: at(date, times[p]),
        title: fmt('notif_prayer_title', lang, { prayer: name }),
        body: fmt('notif_prayer_body', lang, { prayer: name }),
        channelId,
        data: { tag: TAGS.prayer, prayer: p },
      };
    })
  );
}

function planCheckIns(days: Day[], lang: LanguageCode): PlannedNotification[] {
  return days.flatMap(({ date, times }) =>
    PRAYERS.filter((p) => times[p]).map((p) => ({
      date: at(date, times[p], CHECKIN_DELAY_MINUTES),
      title: fmt('notif_checkin_title', lang, { prayer: tr(`prayer_${p}`, lang) }),
      body: fmt('notif_checkin_body', lang),
      channelId: CHANNELS.checkin,
      data: { tag: TAGS.checkin, prayer: p, screen: 'prayer-tracker' },
    }))
  );
}

function planRamadan(days: Day[], lang: LanguageCode): PlannedNotification[] {
  return days
    .filter((d) => gregorianToHijri(d.date).month === RAMADAN_MONTH)
    .flatMap(({ date, times }) => [
      {
        date: at(date, times.fajr, -SUHOOR_WARNING_MINUTES),
        title: fmt('notif_suhoor_title', lang),
        body: fmt('notif_suhoor_body', lang, { minutes: SUHOOR_WARNING_MINUTES, time: showTime(times.fajr, lang) }),
        channelId: CHANNELS.ramadan,
        data: { tag: TAGS.ramadan },
      },
      {
        date: at(date, times.maghrib),
        title: fmt('notif_iftar_title', lang),
        body: fmt('notif_iftar_body', lang),
        channelId: CHANNELS.ramadan,
        data: { tag: TAGS.ramadan },
      },
    ]);
}

function planJamah(days: Day[], lang: LanguageCode): PlannedNotification[] {
  const masjid = readMyMasjid();
  if (!masjid) return [];
  const lead = Number(storage.getString(JAMAH_LEAD_KEY) ?? DEFAULT_JAMAH_LEAD_MINUTES) || DEFAULT_JAMAH_LEAD_MINUTES;
  const name = myMasjidName(masjid, lang);
  return days.flatMap(({ date }) => {
    const isFriday = date.getDay() === 5;
    const prayers: JamahPrayer[] = PRAYERS.map((p) => (p === 'dhuhr' && isFriday && masjid.jamah.jumuah ? 'jumuah' : p));
    return prayers
      .filter((p) => masjid.jamah[p])
      .map((p) => {
        const time = masjid.jamah[p]!;
        const label = p === 'jumuah' ? tr('masjid_jumuah', lang) : tr(`prayer_${p}`, lang);
        return {
          date: at(date, time, -lead),
          title: fmt('notif_jamah_title', lang, { prayer: label, minutes: lead }),
          body: fmt('notif_jamah_body', lang, { masjid: name, time: showTime(time, lang) }),
          channelId: CHANNELS.reminders,
          data: { tag: TAGS.jamah, masjidId: masjid.id, screen: `masjid:${masjid.id}` },
        };
      });
  });
}

function planJumuah(days: Day[], lang: LanguageCode): PlannedNotification[] {
  const masjid = readMyMasjid();
  return days
    .filter((d) => d.date.getDay() === 5)
    .map(({ date, times }) => {
      const jamah = masjid?.jamah.jumuah;
      const time = jamah ?? times.dhuhr;
      return {
        date: at(date, time, -JUMUAH_LEAD_MINUTES),
        title: fmt('notif_jumuah_title', lang),
        body: jamah
          ? fmt('notif_jumuah_body_masjid', lang, { time: showTime(time, lang), masjid: myMasjidName(masjid!, lang) })
          : fmt('notif_jumuah_body', lang),
        channelId: CHANNELS.reminders,
        data: { tag: TAGS.jumuah },
      };
    });
}

function planIslamicDays(days: Day[], lang: LanguageCode, withAnnual: boolean, withFasts: boolean): PlannedNotification[] {
  const out: PlannedNotification[] = [];
  // Look one day past the horizon so "tomorrow is …" reminders on the last day are covered.
  for (const { date, times } of [...days, ...upcomingPrayerDays(days.length + 1).slice(days.length)]) {
    const events = islamicDaysOn(date);
    const eve = addDays(date, -1);
    for (const e of events) {
      if (e.kind === 'fast' || !withAnnual) continue;
      const name = tr(`iday_${e.key}`, lang);
      out.push(
        e.kind === 'night'
          ? {
              date: at(date, times.maghrib),
              title: fmt('notif_night_title', lang, { name }),
              body: tr(`iday_${e.key}_note`, lang),
              channelId: CHANNELS.reminders,
              data: { tag: TAGS.islamicDay, key: e.key, screen: 'islamic-days' },
            }
          : {
              date: atClock(eve, EVE_REMINDER),
              title: fmt('notif_tomorrow_title', lang, { name }),
              body: tr(`iday_${e.key}_note`, lang),
              channelId: CHANNELS.reminders,
              data: { tag: TAGS.islamicDay, key: e.key, screen: 'islamic-days' },
            }
      );
    }
    const fasts = events.filter((e) => e.kind === 'fast');
    if (withFasts && fasts.length) {
      out.push({
        date: atClock(eve, FAST_REMINDER),
        title: fmt('notif_fast_title', lang),
        body: fmt('notif_fast_body', lang, {
          reasons: fasts.map((e) => tr(`iday_${e.key}`, lang)).join(' · '),
          time: showTime(times.fajr, lang),
        }),
        channelId: CHANNELS.reminders,
        data: { tag: TAGS.sunnahFast },
      });
    }
  }
  return out;
}

async function reschedule(): Promise<void> {
  const days = upcomingPrayerDays(HORIZON_DAYS);
  const lang = language();

  if (notificationsAvailable) {
    const planned: PlannedNotification[] = [];
    if (enabled(NOTIFICATIONS_KEY)) planned.push(...planPrayerAlerts(days, lang));
    if (enabled(CHECKIN_KEY)) planned.push(...planCheckIns(days, lang));
    if (enabled(RAMADAN_REMINDERS_KEY)) planned.push(...planRamadan(days, lang));
    if (enabled(JAMAH_REMINDERS_KEY)) planned.push(...planJamah(days, lang));
    if (enabled(JUMUAH_REMINDER_KEY)) planned.push(...planJumuah(days, lang));
    const annual = enabled(ISLAMIC_DAY_REMINDERS_KEY);
    const fasts = enabled(SUNNAH_FAST_REMINDERS_KEY);
    if (annual || fasts) planned.push(...planIslamicDays(days, lang, annual, fasts));
    await replaceScheduledNotifications(planned, lang);
  }

  await updateWidgets(days, lang).catch(() => {});
}

// Every reschedule cancels then re-adds; running two at once would interleave and
// leave duplicates, so calls are chained one after another.
let queue: Promise<void> = Promise.resolve();

/** Re-plans every enabled reminder from now forward. Safe to call often. */
export function rescheduleReminders(): Promise<void> {
  queue = queue.then(reschedule).catch(() => {});
  return queue;
}

// Background refresh — TaskManager needs a development/store build (it isn't available
// in Expo Go on Android and can't run in the background there on iOS).
const backgroundAvailable = !isRunningInExpoGo() && Platform.OS !== 'web';

if (backgroundAvailable) {
  // Must be defined at module scope: a background launch mounts no components.
  TaskManager.defineTask(BACKGROUND_TASK, async () => {
    try {
      await rescheduleReminders();
      return BackgroundTask.BackgroundTaskResult.Success;
    } catch {
      return BackgroundTask.BackgroundTaskResult.Failed;
    }
  });
}

/** Registers the periodic background refresh (at most every 12 h; the OS decides exactly when). */
export async function registerReminderBackgroundTask(): Promise<void> {
  if (!backgroundAvailable) return;
  try {
    if (await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK)) return;
    await BackgroundTask.registerTaskAsync(BACKGROUND_TASK, { minimumInterval: 12 * 60 });
  } catch {
    // Background execution unavailable (e.g. restricted by the OS) — foreground
    // rescheduling still keeps a week of reminders queued.
  }
}
