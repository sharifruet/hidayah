import type * as NotificationsModule from 'expo-notifications';
import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';

import { tr } from '../data/translations';
import type { LanguageCode } from './constants';

// On Android, Expo Go (SDK 53+) throws as soon as expo-notifications is imported, so
// reminders are unavailable there. Dev-client and store builds are unaffected.
export const notificationsAvailable = !(isRunningInExpoGo() && Platform.OS === 'android');

// Only dereferenced behind a `notificationsAvailable` check.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Notifications = (notificationsAvailable ? require('expo-notifications') : undefined) as typeof NotificationsModule;

// Every notification this app schedules carries a `data.tag` with this prefix, so a
// reschedule can clear exactly its own.
const TAG_PREFIX = 'hidayah-';

// iOS keeps at most 64 pending local notifications per app and silently drops the rest.
// Planned notifications are sorted by time and only the earliest are queued; the
// foreground/background reschedule tops the queue back up.
const MAX_SCHEDULED = 60;

/**
 * Android channels. A channel's sound can't be changed after it's created, so each sound
 * gets its own channel. The sound files are bundled by the expo-notifications config
 * plugin (`app.json` → `sounds`) into res/raw and the iOS app bundle; iOS notification
 * sounds must be under 30 s, which is why they're clips rather than the full adhan.
 */
export const CHANNELS = {
  prayerSystem: 'hidayah-prayer-alarm',
  adhan: 'hidayah-adhan-makkah',
  adhanFajr: 'hidayah-adhan-fajr',
  checkin: 'hidayah-checkin',
  ramadan: 'hidayah-ramadan',
  reminders: 'hidayah-reminders',
} as const;
export type ChannelId = (typeof CHANNELS)[keyof typeof CHANNELS];

export const ADHAN_FILES = { makkah: 'adhan_makkah.wav', fajr: 'adhan_fajr.wav' } as const;

/** iOS sound for each channel (Android takes it from the channel). */
const IOS_SOUNDS: Record<ChannelId, string> = {
  [CHANNELS.prayerSystem]: 'default',
  [CHANNELS.adhan]: ADHAN_FILES.makkah,
  [CHANNELS.adhanFajr]: ADHAN_FILES.fajr,
  [CHANNELS.checkin]: 'default',
  [CHANNELS.ramadan]: 'default',
  [CHANNELS.reminders]: 'default',
};

if (notificationsAvailable) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export function addNotificationResponseListener(
  listener: (response: NotificationsModule.NotificationResponse) => void
): { remove: () => void } {
  if (!notificationsAvailable) return { remove: () => {} };
  return Notifications.addNotificationResponseReceivedListener(listener);
}

/** Android 8+ needs a channel per alert style; without one, notifications silently fall back
 * to default/low-priority settings. Idempotent; re-running it renames the channels (shown in
 * the system's notification settings) into `language` — a channel's sound can't change. iOS
 * ignores this. */
async function ensureAndroidChannels(language: LanguageCode): Promise<void> {
  if (Platform.OS !== 'android') return;
  const { AndroidImportance } = Notifications;
  const alarm = { importance: AndroidImportance.HIGH, vibrationPattern: [0, 250, 250, 250] };
  await Promise.all([
    Notifications.setNotificationChannelAsync(CHANNELS.prayerSystem, { name: tr('channel_prayer_system', language), sound: 'default', ...alarm }),
    Notifications.setNotificationChannelAsync(CHANNELS.adhan, { name: tr('channel_adhan', language), sound: ADHAN_FILES.makkah, ...alarm }),
    Notifications.setNotificationChannelAsync(CHANNELS.adhanFajr, { name: tr('channel_adhan_fajr', language), sound: ADHAN_FILES.fajr, ...alarm }),
    Notifications.setNotificationChannelAsync(CHANNELS.checkin, { name: tr('channel_checkin', language), importance: AndroidImportance.DEFAULT, sound: 'default' }),
    Notifications.setNotificationChannelAsync(CHANNELS.ramadan, { name: tr('channel_ramadan', language), sound: 'default', ...alarm }),
    Notifications.setNotificationChannelAsync(CHANNELS.reminders, { name: tr('channel_reminders', language), importance: AndroidImportance.HIGH, sound: 'default' }),
  ]);
}

export async function requestNotificationPermissions(language: LanguageCode): Promise<boolean> {
  if (!notificationsAvailable) return false;
  const existing = await Notifications.getPermissionsAsync();
  let granted = existing.status === 'granted';
  if (!granted) {
    const requested = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: true, allowSound: true },
    });
    granted = requested.status === 'granted';
  }
  if (granted) await ensureAndroidChannels(language);
  return granted;
}

/** One notification to deliver at `date`. */
export interface PlannedNotification {
  date: Date;
  title: string;
  body: string;
  channelId: ChannelId;
  /** `tag` must be one of the category tags below; `screen` deep-links on tap. */
  data: { tag: string; screen?: string; [key: string]: unknown };
}

export const TAGS = {
  prayer: `${TAG_PREFIX}prayer`,
  checkin: `${TAG_PREFIX}checkin`,
  ramadan: `${TAG_PREFIX}ramadan`,
  jamah: `${TAG_PREFIX}jamah`,
  jumuah: `${TAG_PREFIX}jumuah`,
  islamicDay: `${TAG_PREFIX}islamic-day`,
  sunnahFast: `${TAG_PREFIX}sunnah-fast`,
} as const;

async function cancelAllOurs(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => String(n.content.data?.tag ?? '').startsWith(TAG_PREFIX))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );
}

/**
 * Replaces everything this app has queued with the earliest `MAX_SCHEDULED` of `planned`.
 * `language` names the Android channels.
 */
export async function replaceScheduledNotifications(planned: PlannedNotification[], language: LanguageCode): Promise<void> {
  if (!notificationsAvailable) return;
  await cancelAllOurs();
  if (!planned.length) return;
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') return;
  await ensureAndroidChannels(language);

  const now = Date.now();
  const queue = planned
    .filter((p) => p.date.getTime() > now)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, MAX_SCHEDULED);

  for (const p of queue) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: p.title,
        body: p.body,
        sound: Platform.OS === 'ios' ? IOS_SOUNDS[p.channelId] : undefined,
        data: p.data,
      },
      // Android reads the channel from the trigger, not the content.
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: p.date, channelId: p.channelId },
    });
  }
}
