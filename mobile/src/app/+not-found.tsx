import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View className="flex-1 items-center justify-center bg-ink-50 dark:bg-ink-950 px-6">
        <Text className="font-body-semibold text-lg text-ink-900 dark:text-white mb-2">This screen doesn't exist.</Text>
        <Link href="/" className="font-body-medium text-primary-600 dark:text-primary-400">
          Go to home screen
        </Link>
      </View>
    </>
  );
}
