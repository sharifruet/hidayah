import { isRunningInExpoGo } from 'expo';

import type { LanguageCode } from '../lib/constants';
import type { PrayerDay } from '../lib/prayerDays';

/** Re-renders any placed widgets with fresh data (reads saved settings itself). */
export async function updateWidgets(_days?: PrayerDay[], _language?: LanguageCode): Promise<void> {
  // The widget's native module only exists in development/store builds.
  if (isRunningInExpoGo()) return;
  /* eslint-disable @typescript-eslint/no-require-imports */
  const { requestWidgetUpdate } = require('react-native-android-widget') as typeof import('react-native-android-widget');
  const { ANDROID_WIDGET_NAME } = require('./NextPrayerAndroidWidget') as typeof import('./NextPrayerAndroidWidget');
  const { renderNextPrayerWidget } = require('./widgetTaskHandler') as typeof import('./widgetTaskHandler');
  /* eslint-enable @typescript-eslint/no-require-imports */
  await requestWidgetUpdate({
    widgetName: ANDROID_WIDGET_NAME,
    renderWidget: () => renderNextPrayerWidget(),
    widgetNotFound: () => {},
  });
}
