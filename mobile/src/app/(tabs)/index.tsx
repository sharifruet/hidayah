import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

import { Screen } from '../../components/ui/Screen';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { NextPrayerHero } from '../../components/home/NextPrayerHero';
import { PrayerStrip } from '../../components/home/PrayerStrip';
import { PrayerTrackerRow } from '../../components/home/PrayerTrackerRow';
import { DailyAyahCard } from '../../components/home/DailyAyahCard';
import { QuickActions } from '../../components/home/QuickActions';
import { RamadanBanner } from '../../components/home/RamadanBanner';
import { useApp } from '../../context/AppContext';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';
import { MyMasjidCard } from '../../components/home/MyMasjidCard';
import { UpcomingDaysCard } from '../../components/home/UpcomingDaysCard';
import { formatHijriDate, gregorianToHijri } from '../../lib/hijri';
import { activeForbiddenWindow } from '../../lib/forbiddenTimes';
import { fmt, tr } from '../../data/translations';
import { formatDate, formatTime } from '../../lib/format';

function greetingKey(hour: number): string {
  if (hour < 12) return 'home_greeting_morning';
  if (hour < 17) return 'home_greeting_afternoon';
  return 'home_greeting_evening';
}

export default function HomeScreen() {
  const { location, language, hijriOffset, timeFormat } = useApp();
  const { data } = usePrayerTimes();
  const today = new Date();
  const hijri = gregorianToHijri(today, hijriOffset);
  const forbiddenNow = activeForbiddenWindow(data?.times, today);

  return (
    <Screen>
      <View className="flex-row items-center justify-between mt-2 mb-5">
        <View>
          <Text className="font-body text-sm text-ink-500 dark:text-ink-400">{tr(greetingKey(today.getHours()), language)}</Text>
          <Text className="font-body-bold text-2xl text-ink-900 dark:text-white mt-0.5">
            {formatHijriDate(hijri, language)}
          </Text>
          <Text className="font-body text-xs text-ink-400 mt-0.5">
            {formatDate(today, language, { weekday: 'long', month: 'long', day: 'numeric' })}
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
        <RamadanBanner times={data?.times} />
      </View>

      <View className="mb-4">
        <NextPrayerHero times={data?.times} locationName={location.name} />
      </View>

      {forbiddenNow ? (
        <View className="flex-row items-center bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-900 rounded-xl px-3 py-2 mb-4">
          <Ionicons name="ban-outline" size={14} color="#e11d48" />
          <Text className="font-body-medium text-xs text-rose-700 dark:text-rose-300 ml-2 flex-1">
            {fmt('forbidden_now', language, { end: formatTime(forbiddenNow.end, language, timeFormat) })}
          </Text>
        </View>
      ) : null}

      <View className="mb-4">
        <PrayerStrip times={data?.times} />
      </View>

      <View className="mb-4">
        <MyMasjidCard />
      </View>

      <View className="mb-6">
        <PrayerTrackerRow />
      </View>

      <SectionHeader title={tr('home_upcoming_days', language)} />
      <View className="mb-6">
        <UpcomingDaysCard />
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
