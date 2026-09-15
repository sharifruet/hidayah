import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { useApp } from '../../../context/AppContext';
import { tr } from '../../../data/translations';
import {
  getDayStatus,
  togglePrayer,
  getRecentDays,
  getCompletionStreak,
  type DayStatus,
} from '../../../lib/prayerTracker';

const PRAYERS: (keyof DayStatus)[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const NAME_KEYS: Record<keyof DayStatus, string> = {
  fajr: 'prayer_fajr',
  dhuhr: 'prayer_dhuhr',
  asr: 'prayer_asr',
  maghrib: 'prayer_maghrib',
  isha: 'prayer_isha',
};
const WEEKDAY_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function PrayerTrackerScreen() {
  const { language } = useApp();
  const [today, setToday] = useState<DayStatus>(() => getDayStatus());
  const [recent, setRecent] = useState(() => getRecentDays(7));
  const [streak, setStreak] = useState(() => getCompletionStreak());

  function refresh() {
    setToday(getDayStatus());
    setRecent(getRecentDays(7));
    setStreak(getCompletionStreak());
  }

  function onToggle(prayer: keyof DayStatus) {
    togglePrayer(prayer);
    refresh();
  }

  const doneCount = PRAYERS.filter((p) => today[p]).length;

  return (
    <Screen>
      <View className="flex-row items-center mt-4 mb-5">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white flex-1">{tr('tracker_title', language)}</Text>
        {streak > 0 ? (
          <View className="flex-row items-center bg-orange-50 dark:bg-orange-900/20 rounded-xl px-2.5 py-1.5">
            <Text className="text-sm leading-none">🔥</Text>
            <Text className="font-body-bold text-xs text-orange-600 dark:text-orange-400 ml-1">{streak}</Text>
          </View>
        ) : null}
      </View>

      <Text className="font-body text-sm text-ink-500 dark:text-ink-400 mb-4">
        {tr('tracker_today_progress', language)} {doneCount}/5
      </Text>

      <View className="mb-6">
        {PRAYERS.map((prayer) => {
          const done = today[prayer];
          return (
            <TouchableOpacity
              key={prayer}
              onPress={() => onToggle(prayer)}
              activeOpacity={0.7}
              className={`flex-row items-center justify-between rounded-2xl border p-4 mb-2.5 ${
                done
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
                  : 'bg-white dark:bg-ink-900 border-ink-100 dark:border-ink-800'
              }`}
            >
              <Text
                className={`font-body-semibold text-base ${
                  done ? 'text-primary-700 dark:text-primary-300' : 'text-ink-800 dark:text-ink-200'
                }`}
              >
                {tr(NAME_KEYS[prayer], language)}
              </Text>
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  done ? 'bg-primary-600' : 'border-2 border-ink-200 dark:border-ink-700'
                }`}
              >
                {done ? <Ionicons name="checkmark" size={18} color="#fff" /> : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text className="font-body-semibold text-sm text-ink-700 dark:text-ink-300 mb-2">{tr('tracker_this_week', language)}</Text>
      <Card className="p-4">
        <View className="flex-row">
          <View className="w-16" />
          <View className="flex-1 flex-row">
            {recent.map((day) => (
              <View key={day.date} className="flex-1 items-center">
                <Text className="font-body-medium text-[10px] text-ink-400">
                  {WEEKDAY_SHORT[new Date(day.date).getDay()]}
                </Text>
              </View>
            ))}
          </View>
        </View>
        {PRAYERS.map((prayer) => (
          <View key={prayer} className="flex-row items-center mt-2.5">
            <Text className="w-16 font-body-medium text-xs text-ink-500 dark:text-ink-400">
              {tr(NAME_KEYS[prayer], language)}
            </Text>
            <View className="flex-1 flex-row">
              {recent.map((day) => (
                <View key={day.date} className="flex-1 items-center">
                  <View
                    className={`w-5 h-5 rounded-full items-center justify-center ${
                      day.status[prayer] ? 'bg-primary-600' : 'bg-ink-100 dark:bg-ink-800'
                    }`}
                  >
                    {day.status[prayer] ? <Ionicons name="checkmark" size={11} color="#fff" /> : null}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
}
