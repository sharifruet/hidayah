import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { LocationPickerModal } from '../../../components/prayer/LocationPickerModal';
import { useApp } from '../../../context/AppContext';
import { usePrayerTimes } from '../../../hooks/usePrayerTimes';
import { getCurrentPrayer } from '../../../lib/prayerMath';
import type { PrayerKey } from '../../../lib/constants';
import { tr } from '../../../data/translations';

const ROWS: PrayerKey[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'sunset', 'isha'];
const ROW_KEYS: Record<PrayerKey, string> = {
  fajr: 'prayer_fajr',
  sunrise: 'prayer_sunrise',
  dhuhr: 'prayer_dhuhr',
  asr: 'prayer_asr',
  maghrib: 'prayer_maghrib',
  sunset: 'prayer_sunset',
  isha: 'prayer_isha',
};

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  fajr: 'partly-sunny-outline',
  sunrise: 'sunny-outline',
  dhuhr: 'sunny',
  asr: 'sunny-outline',
  maghrib: 'moon-outline',
  sunset: 'moon-outline',
  isha: 'moon',
};

function addDays(dateStr: string, delta: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

export default function PrayerIndexScreen() {
  const { location, language } = useApp();
  const params = useLocalSearchParams<{ date?: string }>();
  const [date, setDate] = useState(() => params.date ?? new Date().toISOString().slice(0, 10));
  const [pickerVisible, setPickerVisible] = useState(false);
  const { data, isLoading, isError } = usePrayerTimes(date);
  const isToday = date === new Date().toISOString().slice(0, 10);
  const info = isToday ? getCurrentPrayer(data?.times) : null;

  useEffect(() => {
    if (params.date) setDate(params.date);
  }, [params.date]);

  const displayDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Screen>
      <Text className="font-body-bold text-2xl text-ink-900 dark:text-white mt-4 mb-4">{tr('prayer_title', language)}</Text>

      <TouchableOpacity
        onPress={() => setPickerVisible(true)}
        className="flex-row items-center justify-between bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl px-4 py-3 mb-4"
      >
        <View className="flex-row items-center flex-1">
          <Ionicons name="location" size={16} color="#22a06d" />
          <View className="ml-2">
            <Text className="font-body-medium text-sm text-ink-900 dark:text-white">{location.name}</Text>
            {location.division ? <Text className="font-body text-xs text-ink-400">{location.division}</Text> : null}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#7d879a" />
      </TouchableOpacity>

      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity onPress={() => setDate((d) => addDays(d, -1))} className="p-2">
          <Ionicons name="chevron-back" size={20} color="#5b6579" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setDate(new Date().toISOString().slice(0, 10))}>
          <Text className="font-body-semibold text-sm text-ink-900 dark:text-white">{displayDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setDate((d) => addDays(d, 1))} className="p-2">
          <Ionicons name="chevron-forward" size={20} color="#5b6579" />
        </TouchableOpacity>
      </View>

      {isError ? (
        <Card className="p-4 mb-4">
          <Text className="font-body text-sm text-red-500">{tr('prayer_load_error', language)}</Text>
        </Card>
      ) : null}

      <Card className="mb-4 overflow-hidden">
        {ROWS.map((name, idx) => {
          const isCurrent = info?.current === name;
          return (
            <View
              key={name}
              className={`flex-row items-center justify-between px-4 py-3.5 ${
                idx < ROWS.length - 1 ? 'border-b border-ink-100 dark:border-ink-800' : ''
              } ${isCurrent ? 'bg-primary-50 dark:bg-primary-900/30' : ''}`}
            >
              <View className="flex-row items-center">
                <Ionicons name={ICONS[name]} size={18} color={isCurrent ? '#15805a' : '#7d879a'} />
                <Text
                  className={`font-body-medium text-sm ml-3 ${
                    isCurrent ? 'text-primary-700 dark:text-primary-300' : 'text-ink-700 dark:text-ink-200'
                  }`}
                >
                  {tr(ROW_KEYS[name], language)}
                </Text>
              </View>
              <Text
                className={`font-body-semibold text-sm ${
                  isCurrent ? 'text-primary-700 dark:text-primary-300' : 'text-ink-900 dark:text-white'
                }`}
              >
                {isLoading ? '--:--' : data?.times[name] ?? '--:--'}
              </Text>
            </View>
          );
        })}
      </Card>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => router.push('/prayer/methods')}
          className="flex-1 flex-row items-center justify-center bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl py-3"
        >
          <Ionicons name="options-outline" size={16} color="#5b6579" />
          <Text className="font-body-medium text-sm text-ink-700 dark:text-ink-200 ml-2">{tr('prayer_methods_tab', language)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/prayer/calendar')}
          className="flex-1 flex-row items-center justify-center bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl py-3"
        >
          <Ionicons name="calendar-outline" size={16} color="#5b6579" />
          <Text className="font-body-medium text-sm text-ink-700 dark:text-ink-200 ml-2">{tr('prayer_calendar_tab', language)}</Text>
        </TouchableOpacity>
      </View>

      <LocationPickerModal visible={pickerVisible} onClose={() => setPickerVisible(false)} />
    </Screen>
  );
}
