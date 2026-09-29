/**
 * Headless handler Android calls when the widget is added, resized or due for its periodic
 * update. Computes everything on-device from saved settings — no app UI is running.
 */
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';

import { storage } from '../lib/storage';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '../lib/constants';
import { savedLocation, upcomingPrayerDays } from '../lib/prayerDays';
import { coarseTimeLeft, nextPrayerTimeline } from './nextPrayer';
import { NextPrayerAndroidWidget } from './NextPrayerAndroidWidget';
import { tr } from '../data/translations';

function savedLanguage(): LanguageCode {
  const stored = storage.getString('app_language') as LanguageCode | undefined;
  return stored && SUPPORTED_LANGUAGES.includes(stored) ? stored : 'bn';
}

export function renderNextPrayerWidget() {
  const language = savedLanguage();
  const [entry] = nextPrayerTimeline(upcomingPrayerDays(2), language, savedLocation().name, new Date(), 1);
  const props = entry?.props ?? null;
  return (
    <NextPrayerAndroidWidget
      props={props}
      timeLeft={props ? coarseTimeLeft(props.target, language) : ''}
      fallbackLabel={tr('widget_next', language)}
    />
  );
}

export async function widgetTaskHandler({ widgetAction, renderWidget }: WidgetTaskHandlerProps) {
  switch (widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
      renderWidget(renderNextPrayerWidget());
      break;
    default:
      break;
  }
}
