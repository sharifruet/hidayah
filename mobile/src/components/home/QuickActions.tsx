import { Text, TouchableOpacity, View } from 'react-native';
import { router, type Href } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { loadLastRead, getKhatmPercent } from '../../lib/progress';
import { tr } from '../../data/translations';
import { useApp } from '../../context/AppContext';

interface Action {
  label: string;
  sub?: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: Href;
  tint: string;
}

export function QuickActions() {
  const { language } = useApp();
  const lastRead = loadLastRead();
  const khatmPct = getKhatmPercent();

  const actions: Action[] = [
    {
      label: tr('nav_quran', language),
      sub: lastRead ? `${khatmPct}% khatm` : tr('home_start_reading', language),
      icon: 'book',
      // Same destination as the Qur'an tab in the bottom bar
      href: '/quran' as Href,
      tint: 'bg-primary-50 dark:bg-primary-900/30',
    },
    { label: tr('more_hadith', language), sub: tr('more_hadith_sub', language), icon: 'chatbox-ellipses', href: '/more/hadith' as Href, tint: 'bg-teal-500/10' },
    { label: tr('nav_duas', language), sub: tr('home_adhkar', language), icon: 'hand-left', href: '/duas' as Href, tint: 'bg-gold-500/10' },
    { label: tr('more_books', language), sub: tr('home_library', language), icon: 'library', href: '/more/books' as Href, tint: 'bg-blue-500/10' },
    { label: tr('more_qibla', language), sub: tr('home_compass', language), icon: 'compass', href: '/more/qibla' as Href, tint: 'bg-purple-500/10' },
    { label: tr('more_masjids', language), sub: tr('more_masjids_sub', language), icon: 'business', href: '/more/masjids' as Href, tint: 'bg-orange-500/10' },
  ];

  return (
    <View className="flex-row flex-wrap -mx-1.5">
      {actions.map((action) => (
        <View key={action.label} className="w-1/2 px-1.5 mb-3">
          <TouchableOpacity
            onPress={() => router.push(action.href)}
            className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-4"
            activeOpacity={0.7}
          >
            <View className={`w-10 h-10 rounded-xl items-center justify-center mb-2 ${action.tint}`}>
              <Ionicons name={action.icon} size={19} color="#22a06d" />
            </View>
            <Text className="font-body-semibold text-sm text-ink-900 dark:text-ink-50">{action.label}</Text>
            {action.sub ? (
              <Text className="font-body text-xs text-ink-400 dark:text-ink-400 mt-0.5">{action.sub}</Text>
            ) : null}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
