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

  const now = new Date();

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

export async function cancelAllPrayerNotifications(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.content.data?.tag === NOTIFICATION_TAG)
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );
}
