// App entry: expo-router, plus the headless Android widget handler, which must be registered
// at startup because Android can launch the JS runtime just to render the widget.
import 'expo-router/entry';
import { Platform } from 'react-native';
import { isRunningInExpoGo } from 'expo';

if (Platform.OS === 'android' && !isRunningInExpoGo()) {
  /* eslint-disable @typescript-eslint/no-require-imports */
  const { registerWidgetTaskHandler } = require('react-native-android-widget');
  const { widgetTaskHandler } = require('./src/widgets/widgetTaskHandler');
  /* eslint-enable @typescript-eslint/no-require-imports */
  registerWidgetTaskHandler(widgetTaskHandler);
}
