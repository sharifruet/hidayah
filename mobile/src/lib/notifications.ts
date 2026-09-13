import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { PrayerTimesResponse } from './services/prayer';
import { PRAYER_LABELS } from './constants';

const NOTIFIABLE: (keyof PrayerTimesResponse['times'])[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const NOTIFICATION_TAG = 'hidayah-prayer';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === 'granted') return true;
  const requested = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
  });
  return requested.status === 'granted';
}

async function scheduleForDay(times: PrayerTimesResponse['times'], forDate: Date, now: Date): Promise<void> {
  for (const key of NOTIFIABLE) {
    const timeStr = times[key];
    if (!timeStr) continue;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const fireDate = new Date(forDate);
    fireDate.setHours(hours, minutes, 0, 0);
    if (fireDate.getTime() <= now.getTime()) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${PRAYER_LABELS[key]} time`,
        body: `It's time for ${PRAYER_LABELS[key]} prayer.`,
        sound: Platform.OS === 'ios' ? 'default' : undefined,
        data: { tag: NOTIFICATION_TAG, prayer: key },
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
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.content.data?.tag === NOTIFICATION_TAG)
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );
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
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.content.data?.tag === NOTIFICATION_TAG)
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );

  const now = new Date();
  await scheduleForDay(todayTimes, now, now);

  if (tomorrowTimes) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    await scheduleForDay(tomorrowTimes, tomorrow, now);
  }
}

export async function cancelAllPrayerNotifications(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.content.data?.tag === NOTIFICATION_TAG)
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );
}
