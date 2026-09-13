import { Text, View } from 'react-native';
import { Link, type Href } from 'expo-router';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  actionHref?: Href;
}

export function SectionHeader({ title, actionLabel, actionHref }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-3 mt-2">
      <Text className="font-body-semibold text-base text-ink-900 dark:text-ink-50">{title}</Text>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="font-body-medium text-sm text-primary-600 dark:text-primary-400">
          {actionLabel}
        </Link>
      ) : null}
    </View>
  );
}
