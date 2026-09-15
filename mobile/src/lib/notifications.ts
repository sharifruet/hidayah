import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { PrayerTimesResponse } from './services/prayer';
import { PRAYER_LABELS } from './constants';

const NOTIFIABLE: (keyof PrayerTimesResponse['times'])[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const NOTIFICATION_TAG = 'hidayah-prayer';
const CHECKIN_TAG = 'hidayah-checkin';
const RAMADAN_TAG = 'hidayah-ramadan';

// Minutes after a prayer's start time before the "did you pray?" check-in fires — long
// enough that the prayer window has clearly passed, short enough to still be a same-window
// reminder rather than a end-of-day catch-all.
const CHECKIN_DELAY_MINUTES = 20;
const SUHOOR_WARNING_MINUTES = 20;

const PRAYER_CHANNEL_ID = 'hidayah-prayer-alarm';
const CHECKIN_CHANNEL_ID = 'hidayah-checkin';
const RAMADAN_CHANNEL_ID = 'hidayah-ramadan';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** Android requires a notification channel (8+) for reliable, consistent alert behavior —
 * without one, notifications silently fall back to default/low-priority settings. iOS ignores
 * this. NOTE: this uses the system's default notification sound; swapping in an actual adhan
 * recording later just means pointing `sound` at a bundled audio asset here. */
async function ensureAndroidChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(PRAYER_CHANNEL_ID, {
    name: 'Prayer time alarm',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
  });
  await Notifications.setNotificationChannelAsync(CHECKIN_CHANNEL_ID, {
    name: 'Prayer check-in',
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: 'default',
  });
  await Notifications.setNotificationChannelAsync(RAMADAN_CHANNEL_ID, {
    name: 'Ramadan reminders',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  let granted = existing.status === 'granted';
  if (!granted) {
    const requested = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: true, allowSound: true },
    });
    granted = requested.status === 'granted';
  }
  if (granted) await ensureAndroidChannels();
  return granted;
}

async function cancelByTag(tag: string): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.content.data?.tag === tag)
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );
}

function fireDateFor(timeStr: string, forDate: Date, offsetMinutes = 0): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const d = new Date(forDate);
  d.setHours(hours, minutes, 0, 0);
  d.setMinutes(d.getMinutes() + offsetMinutes);
  return d;
}

async function scheduleForDay(times: PrayerTimesResponse['times'], forDate: Date, now: Date): Promise<void> {
  for (const key of NOTIFIABLE) {
    const timeStr = times[key];
    if (!timeStr) continue;
    const fireDate = fireDateFor(timeStr, forDate);
    if (fireDate.getTime() <= now.getTime()) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${PRAYER_LABELS[key]} time`,
        body: `It's time for ${PRAYER_LABELS[key]} prayer.`,
        sound: Platform.OS === 'ios' ? 'default' : undefined,
        data: { tag: NOTIFICATION_TAG, prayer: key },
        ...(Platform.OS === 'android' ? { channelId: PRAYER_CHANNEL_ID } : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fireDate,
      },
    });
  }
}

/** Cancels previously scheduled prayer reminders and schedules new ones for the given day's times. */
export async function scheduleTodaysPrayerNotifications(
  times: PrayerTimesResponse['times'],
  forDate: Date = new Date()
): Promise<void> {
  await cancelByTag(NOTIFICATION_TAG);
  await scheduleForDay(times, forDate, new Date());
}

/**
 * Cancels previously scheduled prayer reminders and schedules both today's remaining prayers
 * and tomorrow's full day, so reminders still fire tomorrow even if the app isn't reopened
 * before then. `tomorrowTimes` is optional — pass it when available (e.g. from a second
 * prayer-times fetch); today's reminders are still scheduled without it.
 */
export async function scheduleUpcomingPrayerNotifications(
  todayTimes: PrayerTimesResponse['times'],
  tomorrowTimes?: PrayerTimesResponse['times']
): Promise<void> {
  await cancelByTag(NOTIFICATION_TAG);

  const now = new Date();
  await scheduleForDay(todayTimes, now, now);

  if (tomorrowTimes) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    await scheduleForDay(tomorrowTimes, tomorrow, now);
  }
}

export async function cancelAllPrayerNotifications(): Promise<void> {
  await cancelByTag(NOTIFICATION_TAG);
}

// ── "Did you pray?" check-in reminders ──────────────────────────────────────────────────

async function scheduleCheckInsForDay(times: PrayerTimesResponse['times'], forDate: Date, now: Date): Promise<void> {
  for (const key of NOTIFIABLE) {
    const timeStr = times[key];
    if (!timeStr) continue;
    const fireDate = fireDateFor(timeStr, forDate, CHECKIN_DELAY_MINUTES);
    if (fireDate.getTime() <= now.getTime()) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Have you offered ${PRAYER_LABELS[key]}?`,
        body: 'Tap to log it in your Salah tracker.',
        sound: Platform.OS === 'ios' ? 'default' : undefined,
        data: { tag: CHECKIN_TAG, prayer: key, screen: 'prayer-tracker' },
        ...(Platform.OS === 'android' ? { channelId: CHECKIN_CHANNEL_ID } : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fireDate,
      },
    });
  }
}

export async function scheduleUpcomingPrayerCheckIns(
  todayTimes: PrayerTimesResponse['times'],
  tomorrowTimes?: PrayerTimesResponse['times']
): Promise<void> {
  await cancelByTag(CHECKIN_TAG);

  const now = new Date();
  await scheduleCheckInsForDay(todayTimes, now, now);

  if (tomorrowTimes) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    await scheduleCheckInsForDay(tomorrowTimes, tomorrow, now);
  }
}

export async function cancelAllCheckInNotifications(): Promise<void> {
  await cancelByTag(CHECKIN_TAG);
}

// ── Ramadan: Suhoor-ending-soon + Iftar-time reminders ──────────────────────────────────

async function scheduleRamadanForDay(
  times: PrayerTimesResponse['times'],
  forDate: Date,
  now: Date
): Promise<void> {
  if (times.fajr) {
    const suhoorWarning = fireDateFor(times.fajr, forDate, -SUHOOR_WARNING_MINUTES);
    if (suhoorWarning.getTime() > now.getTime()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Suhoor ending soon',
          body: `Fajr is in ${SUHOOR_WARNING_MINUTES} minutes — finish up before the fast begins.`,
          sound: Platform.OS === 'ios' ? 'default' : undefined,
          data: { tag: RAMADAN_TAG },
          ...(Platform.OS === 'android' ? { channelId: RAMADAN_CHANNEL_ID } : {}),
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: suhoorWarning },
      });
    }
  }
  if (times.maghrib) {
    const iftar = fireDateFor(times.maghrib, forDate);
    if (iftar.getTime() > now.getTime()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Iftar time',
          body: "It's Maghrib — time to break your fast.",
          sound: Platform.OS === 'ios' ? 'default' : undefined,
          data: { tag: RAMADAN_TAG },
          ...(Platform.OS === 'android' ? { channelId: RAMADAN_CHANNEL_ID } : {}),
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: iftar },
      });
    }
  }
}

export async function scheduleRamadanReminders(
  todayTimes: PrayerTimesResponse['times'],
  tomorrowTimes?: PrayerTimesResponse['times']
): Promise<void> {
  await cancelByTag(RAMADAN_TAG);

  const now = new Date();
  await scheduleRamadanForDay(todayTimes, now, now);

  if (tomorrowTimes) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    await scheduleRamadanForDay(tomorrowTimes, tomorrow, now);
  }
}

export async function cancelRamadanReminders(): Promise<void> {
  await cancelByTag(RAMADAN_TAG);
}
