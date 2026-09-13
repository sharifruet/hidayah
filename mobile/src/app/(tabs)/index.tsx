import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

import { Screen } from '../../components/ui/Screen';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { NextPrayerHero } from '../../components/home/NextPrayerHero';
import { PrayerStrip } from '../../components/home/PrayerStrip';
import { DailyAyahCard } from '../../components/home/DailyAyahCard';
import { QuickActions } from '../../components/home/QuickActions';
import { RamadanBanner } from '../../components/home/RamadanBanner';
import { useApp } from '../../context/AppContext';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import { gregorianToHijri } from '../../lib/hijri';
import { scheduleUpcomingPrayerNotifications } from '../../lib/notifications';
import { tr } from '../../data/translations';
import type { LanguageCode } from '../../lib/constants';

function greetingKey(hour: number): string {
  if (hour < 12) return 'home_greeting_morning';
  if (hour < 17) return 'home_greeting_afternoon';
  return 'home_greeting_evening';
}

const LOCALE_MAP: Record<LanguageCode, string> = { en: 'en-US', bn: 'bn-BD', ur: 'ur-PK', tr: 'tr-TR', id: 'id-ID' };

const tomorrowISO = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
})();

export default function HomeScreen() {
  const { location, language, notificationsEnabled } = useApp();
  const { data } = usePrayerTimes();
  const { data: tomorrowData } = usePrayerTimes(tomorrowISO);
  const today = new Date();
  const hijri = gregorianToHijri(today);

  useEffect(() => {
    if (notificationsEnabled && data?.times) {
      scheduleUpcomingPrayerNotifications(data.times, tomorrowData?.times).catch(() => {});
    }
  }, [notificationsEnabled, data?.times, tomorrowData?.times]);

  return (
    <Screen>
      <View className="flex-row items-center justify-between mt-2 mb-5">
        <View>
          <Text className="font-body text-sm text-ink-500 dark:text-ink-400">{tr(greetingKey(today.getHours()), language)}</Text>
          <Text className="font-body-bold text-2xl text-ink-900 dark:text-white mt-0.5">
            {hijri.day} {hijri.monthNameEn} {hijri.year} AH
          </Text>
          <Text className="font-body text-xs text-ink-400 mt-0.5">
            {today.toLocaleDateString(LOCALE_MAP[language], { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/more/settings' as never)}
          className="w-10 h-10 rounded-full bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 items-center justify-center"
        >
          <Ionicons name="settings-outline" size={18} color="#5b6579" />
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <RamadanBanner />
      </View>

      <View className="mb-4">
        <NextPrayerHero times={data?.times} locationName={location.name} />
      </View>

      <View className="mb-6">
        <PrayerStrip times={data?.times} />
      </View>

      <SectionHeader title={tr('home_daily_ayah', language)} />
      <View className="mb-6">
        <DailyAyahCard language={language} />
      </View>

      <SectionHeader title={tr('home_quick_actions', language)} />
      <QuickActions />
    </Screen>
  );
}
