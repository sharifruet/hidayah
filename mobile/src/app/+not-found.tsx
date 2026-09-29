import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { tr } from '../data/translations';

export default function NotFoundScreen() {
  const { language } = useApp();
  return (
    <>
      <Stack.Screen options={{ title: tr('not_found_title', language) }} />
      <View className="flex-1 items-center justify-center bg-ink-50 dark:bg-ink-950 px-6">
        <Text className="font-body-semibold text-lg text-ink-900 dark:text-white mb-2">{tr('not_found_message', language)}</Text>
        <Link href="/" className="font-body-medium text-primary-600 dark:text-primary-400">
          {tr('not_found_home', language)}
        </Link>
      </View>
    </>
  );
}
