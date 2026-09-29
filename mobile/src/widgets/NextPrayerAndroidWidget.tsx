/**
 * Android home-screen widget (react-native-android-widget). Android widgets can't run a
 * live countdown, so "time left" is refreshed by the app, the reminder background task and
 * the widget's own 30-minute update — the prayer name and time are the reliable parts.
 */
import { FlexWidget, TextWidget } from 'react-native-android-widget';

import type { NextPrayerProps } from './nextPrayer';

export const ANDROID_WIDGET_NAME = 'NextPrayer';

export function NextPrayerAndroidWidget({
  props,
  timeLeft,
  fallbackLabel,
}: {
  props: NextPrayerProps | null;
  timeLeft: string;
  /** Localised "Next prayer", shown when there's no data yet. */
  fallbackLabel: string;
}) {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 14,
        borderRadius: 20,
        backgroundColor: '#12654a',
      }}
    >
      <FlexWidget style={{ flexDirection: 'column' }}>
        <TextWidget text={props?.label ?? fallbackLabel} style={{ fontSize: 12, color: '#aeeac8' }} />
        <TextWidget
          text={props ? `${props.name}  ${props.time}` : '—'}
          style={{ fontSize: 22, fontWeight: 'bold', color: '#ffffff' }}
          maxLines={1}
          truncate="END"
        />
      </FlexWidget>
      <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', width: 'match_parent' }}>
        <TextWidget text={timeLeft} style={{ fontSize: 14, fontWeight: '600', color: '#e0b361' }} />
        <TextWidget text={props?.location ?? ''} style={{ fontSize: 12, color: '#d6f5e1' }} maxLines={1} truncate="END" />
      </FlexWidget>
    </FlexWidget>
  );
}
