import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { getDayStatus, togglePrayer, type DayStatus } from '../../lib/prayerTracker';
import { tr } from '../../data/translations';
import { useApp } from '../../context/AppContext';

const PRAYERS: (keyof DayStatus)[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const NAME_KEYS: Record<keyof DayStatus, string> = {
  fajr: 'prayer_fajr',
  dhuhr: 'prayer_dhuhr',
  asr: 'prayer_asr',
  maghrib: 'prayer_maghrib',
  isha: 'prayer_isha',
};

/** Compact "did you pray?" row for Home — tap a prayer to mark it done, independent of
 * whether check-in notifications are enabled. Full history lives in the Prayer Tracker screen. */
export function PrayerTrackerRow() {
  const { language } = useApp();
  const [status, setStatus] = useState<DayStatus>(() => getDayStatus());

  function onToggle(prayer: keyof DayStatus) {
    togglePrayer(prayer);
    setStatus(getDayStatus());
  }

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/more/prayer-tracker' as never)}>
      <View className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-3.5">
        <View className="flex-row items-center justify-between mb-2.5">
          <Text className="font-body-semibold text-sm text-ink-800 dark:text-ink-200">{tr('tracker_home_title', language)}</Text>
          <Ionicons name="chevron-forward" size={14} color="#7d879a" />
        </View>
        <View className="flex-row justify-between">
          {PRAYERS.map((prayer) => {
            const done = status[prayer];
            return (
              <TouchableOpacity
                key={prayer}
                onPress={(e) => {
                  e.stopPropagation();
                  onToggle(prayer);
                }}
                className="items-center"
              >
                <View
                  className={`w-9 h-9 rounded-full items-center justify-center mb-1 ${
                    done ? 'bg-primary-600' : 'border-2 border-ink-200 dark:border-ink-700'
                  }`}
                >
                  {done ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
                </View>
                <Text className="font-body-medium text-[10px] text-ink-500 dark:text-ink-400">
                  {tr(NAME_KEYS[prayer], language)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </TouchableOpacity>
  );
}
