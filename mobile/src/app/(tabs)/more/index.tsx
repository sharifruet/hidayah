import { Text, TouchableOpacity, View } from 'react-native';
import { router, type Href } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { useApp } from '../../../context/AppContext';
import { tr } from '../../../data/translations';

interface MenuItem {
  labelKey: string;
  subKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: Href;
}

const ITEMS: MenuItem[] = [
  { labelKey: 'more_books', subKey: 'more_books_sub', icon: 'library-outline', href: '/more/books' as Href },
  { labelKey: 'more_bookmarks', subKey: 'more_bookmarks_sub', icon: 'bookmark-outline', href: '/quran/bookmarks' as Href },
  { labelKey: 'more_qibla', subKey: 'more_qibla_sub', icon: 'compass-outline', href: '/more/qibla' as Href },
  { labelKey: 'nav_calendar', subKey: 'more_calendar_sub', icon: 'calendar-outline', href: '/prayer/calendar' as Href },
  { labelKey: 'methods_title', subKey: 'more_methods_sub', icon: 'options-outline', href: '/prayer/methods' as Href },
  { labelKey: 'nav_settings', subKey: 'more_settings_sub', icon: 'settings-outline', href: '/more/settings' as Href },
];

export default function MoreScreen() {
  const { language } = useApp();
  return (
    <Screen>
      <Text className="font-body-bold text-2xl text-ink-900 dark:text-white mt-4 mb-5">{tr('more_title', language)}</Text>

      <Card className="overflow-hidden">
        {ITEMS.map((item, idx) => (
          <TouchableOpacity
            key={item.labelKey}
            onPress={() => router.push(item.href)}
            className={`flex-row items-center px-4 py-4 ${
              idx < ITEMS.length - 1 ? 'border-b border-ink-100 dark:border-ink-800' : ''
            }`}
          >
            <View className="w-9 h-9 rounded-full bg-primary-50 dark:bg-primary-900/30 items-center justify-center">
              <Ionicons name={item.icon} size={17} color="#22a06d" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="font-body-medium text-sm text-ink-900 dark:text-white">{tr(item.labelKey, language)}</Text>
              <Text className="font-body text-xs text-ink-400 mt-0.5">{tr(item.subKey, language)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#7d879a" />
          </TouchableOpacity>
        ))}
      </Card>

      <Text className="font-body text-xs text-ink-300 dark:text-ink-600 text-center mt-8">Hidayah · v1.0.0</Text>
    </Screen>
  );
}
