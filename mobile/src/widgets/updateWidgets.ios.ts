import { isRunningInExpoGo } from 'expo';

import type { LanguageCode } from '../lib/constants';
import { savedLocation, upcomingPrayerDays, type PrayerDay } from '../lib/prayerDays';
import { nextPrayerTimeline } from './nextPrayer';

/**
 * Pushes a timeline of "next prayer" entries (one per prayer hand-off, ~3 days) to the iOS
 * widget. WidgetKit advances through it on its own and the countdown ticks natively; the
 * app refreshes it whenever reminders are rescheduled (launch, foreground, settings change,
 * background task).
 */
export async function updateWidgets(days?: PrayerDay[], language: LanguageCode = 'en'): Promise<void> {
  // The native widget module only exists in development/store builds.
  if (isRunningInExpoGo()) return;
  const { default: NextPrayerWidget } = await import('./NextPrayerWidget.ios');
  const source = days && days.length >= 3 ? days.slice(0, 3) : upcomingPrayerDays(3);
  const entries = nextPrayerTimeline(source, language, savedLocation().name);
  if (entries.length) NextPrayerWidget.updateTimeline(entries);
}
