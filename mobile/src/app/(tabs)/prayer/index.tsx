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
import { addDays, localISODate, parseLocalISODate } from '../../../lib/dates';
import { activeForbiddenWindow, forbiddenWindows } from '../../../lib/forbiddenTimes';
import { fmt, tr } from '../../../data/translations';
import { formatDate, formatTime } from '../../../lib/format';

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

function shiftDate(dateStr: string, delta: number): string {
  return localISODate(addDays(parseLocalISODate(dateStr), delta));
}

export default function PrayerIndexScreen() {
  const { location, language, timeFormat } = useApp();
  const params = useLocalSearchParams<{ date?: string }>();
  const [date, setDate] = useState(() => params.date ?? localISODate());
  const [pickerVisible, setPickerVisible] = useState(false);
  const { data, isLoading, isError } = usePrayerTimes(date);
  const isToday = date === localISODate();
  const info = isToday ? getCurrentPrayer(data?.times) : null;
  const forbidden = forbiddenWindows(data?.times);
  const forbiddenNow = isToday ? activeForbiddenWindow(data?.times) : null;

  useEffect(() => {
    if (params.date) setDate(params.date);
  }, [params.date]);

  const displayDate = formatDate(parseLocalISODate(date), language, {
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
        <TouchableOpacity onPress={() => setDate((d) => shiftDate(d, -1))} className="p-2">
          <Ionicons name="chevron-back" size={20} color="#5b6579" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setDate(localISODate())}>
          <Text className="font-body-semibold text-sm text-ink-900 dark:text-white">{displayDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setDate((d) => shiftDate(d, 1))} className="p-2">
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
                {isLoading ? '--:--' : formatTime(data?.times[name], language, timeFormat)}
              </Text>
            </View>
          );
        })}
      </Card>

      {forbidden.length ? (
        <Card className="p-4 mb-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="ban-outline" size={16} color="#e11d48" />
            <Text className="font-body-semibold text-sm text-ink-900 dark:text-white ml-2">{tr('forbidden_title', language)}</Text>
          </View>
          {forbiddenNow ? (
            <View className="bg-rose-50 dark:bg-rose-900/20 rounded-lg px-3 py-2 mb-2">
              <Text className="font-body-medium text-xs text-rose-700 dark:text-rose-300">
                {fmt('forbidden_now', language, { end: formatTime(forbiddenNow.end, language, timeFormat) })}
              </Text>
            </View>
          ) : null}
          <View className="flex-row">
            {forbidden.map((w) => (
              <View
                key={w.key}
                className={`flex-1 items-center py-2 mx-0.5 rounded-lg ${forbiddenNow?.key === w.key ? 'bg-rose-50 dark:bg-rose-900/20' : 'bg-ink-50 dark:bg-ink-800'}`}
              >
                <Text className="font-body text-[11px] text-ink-500 dark:text-ink-400">{tr(`forbidden_${w.key}`, language)}</Text>
                <Text className="font-body-semibold text-xs text-ink-900 dark:text-white mt-0.5">
                  {formatTime(w.start, language, timeFormat, { withPeriod: false })}–{formatTime(w.end, language, timeFormat, { withPeriod: false })}
                </Text>
              </View>
            ))}
          </View>
          <Text className="font-body text-[10px] text-ink-400 mt-2">{tr('forbidden_note', language)}</Text>
        </Card>
      ) : null}

      <TouchableOpacity
        onPress={() => router.push('/prayer/ramadan' as never)}
        className="flex-row items-center justify-center bg-gold-500/10 border border-gold-500/30 rounded-xl py-3 mb-3"
      >
        <Ionicons name="moon-outline" size={16} color="#c99a45" />
        <Text className="font-body-medium text-sm text-gold-600 dark:text-gold-400 ml-2">{tr('ramadan_title', language)}</Text>
      </TouchableOpacity>

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
