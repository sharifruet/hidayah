/**
 * iOS home/lock-screen widget (expo-widgets). The function below is serialised by the
 * `'widget'` directive and runs in WidgetKit's isolated runtime: only @expo/ui/swift-ui
 * components, no hooks, no module-scope values, no other imports. The countdown is a
 * native SwiftUI timer, so it ticks without the app running.
 */
import { HStack, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle, padding, widgetURL } from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

import type { NextPrayerProps } from './nextPrayer';

const NextPrayer = (props: NextPrayerProps, env: WidgetEnvironment) => {
  'widget';
  const target = new Date(props.target);
  const green = '#15805a';

  if (env.widgetFamily === 'accessoryInline') {
    return <Text>{`${props.name} ${props.time}`}</Text>;
  }

  if (env.widgetFamily === 'accessoryRectangular') {
    return (
      <VStack alignment="leading">
        <Text modifiers={[font({ size: 12, weight: 'semibold' })]}>{props.label}</Text>
        <Text modifiers={[font({ size: 16, weight: 'bold' })]}>{`${props.name} · ${props.time}`}</Text>
        <Text date={target} dateStyle="timer" modifiers={[font({ size: 13 })]} />
      </VStack>
    );
  }

  if (env.widgetFamily === 'systemMedium') {
    return (
      <HStack modifiers={[padding({ all: 4 }), widgetURL('hidayah://prayer')]}>
        <VStack alignment="leading">
          <Text modifiers={[font({ size: 13, weight: 'medium' }), foregroundStyle(green)]}>{props.label}</Text>
          <Text modifiers={[font({ size: 30, weight: 'bold' })]}>{props.name}</Text>
          <Text modifiers={[font({ size: 13 }), foregroundStyle({ type: 'hierarchical', style: 'secondary' })]}>{props.location}</Text>
        </VStack>
        <Spacer />
        <VStack alignment="trailing">
          <Text modifiers={[font({ size: 26, weight: 'semibold' })]}>{props.time}</Text>
          <Text date={target} dateStyle="timer" modifiers={[font({ size: 17, weight: 'medium' }), foregroundStyle(green)]} />
        </VStack>
      </HStack>
    );
  }

  return (
    <VStack alignment="leading" modifiers={[widgetURL('hidayah://prayer')]}>
      <Text modifiers={[font({ size: 12, weight: 'medium' }), foregroundStyle(green)]}>{props.label}</Text>
      <Text modifiers={[font({ size: 24, weight: 'bold' })]}>{props.name}</Text>
      <Text modifiers={[font({ size: 20, weight: 'semibold' })]}>{props.time}</Text>
      <Spacer />
      <Text date={target} dateStyle="timer" modifiers={[font({ size: 15, weight: 'medium' }), foregroundStyle(green)]} />
      <Text modifiers={[font({ size: 11 }), foregroundStyle({ type: 'hierarchical', style: 'secondary' })]}>{props.location}</Text>
    </VStack>
  );
};

export default createWidget('NextPrayer', NextPrayer);
