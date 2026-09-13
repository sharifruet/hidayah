import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';

import type { PrayerTimesResponse } from '../../lib/services/prayer';
import { formatCountdown, getCurrentPrayer, getTimeUntilNextPrayer, getWindowProgress } from '../../lib/prayerMath';
import { tr } from '../../data/translations';
import { useApp } from '../../context/AppContext';

const PRAYER_NAME_KEYS: Record<string, string> = {
  fajr: 'prayer_fajr',
  sunrise: 'prayer_sunrise',
  dhuhr: 'prayer_dhuhr',
  asr: 'prayer_asr',
  maghrib: 'prayer_maghrib',
  isha: 'prayer_isha',
};

const RING_SIZE = 148;
const STROKE = 10;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PRAYER_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  fajr: 'partly-sunny-outline',
  sunrise: 'sunny-outline',
  dhuhr: 'sunny',
  asr: 'sunny-outline',
  maghrib: 'moon-outline',
  isha: 'moon',
};

export function NextPrayerHero({ times, locationName }: { times?: PrayerTimesResponse['times']; locationName?: string }) {
  const { language } = useApp();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const info = getCurrentPrayer(times, now);
  const minutesUntil = getTimeUntilNextPrayer(times, now);
  const progress = getWindowProgress(times, now);
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View className="rounded-3xl overflow-hidden bg-primary-700 dark:bg-primary-900 px-5 py-6">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="font-body-medium text-xs uppercase tracking-wider text-primary-200">{tr('home_next_prayer', language)}</Text>
          <Text className="font-body-bold text-3xl text-white mt-1 capitalize">
            {info ? tr(PRAYER_NAME_KEYS[info.next], language) : '—'}
          </Text>
          {locationName ? (
            <View className="flex-row items-center mt-2">
              <Ionicons name="location-outline" size={13} color="#d6f5e1" />
              <Text className="font-body text-xs text-primary-200 ml-1">{locationName}</Text>
            </View>
          ) : null}
          <Text className="font-body text-xs text-primary-300 mt-3">
            {tr('home_currently', language)}:{' '}
            <Text className="font-body-medium text-primary-100 capitalize">
              {info ? tr(PRAYER_NAME_KEYS[info.current], language) : '—'}
            </Text>
          </Text>
        </View>

        <View style={{ width: RING_SIZE, height: RING_SIZE }} className="items-center justify-center">
          <Svg width={RING_SIZE} height={RING_SIZE} style={{ position: 'absolute' }}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={STROKE}
              fill="none"
            />
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke="#e0b361"
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              rotation={-90}
              originX={RING_SIZE / 2}
              originY={RING_SIZE / 2}
            />
          </Svg>
          <Ionicons
            name={info ? PRAYER_ICONS[info.next] ?? 'time-outline' : 'time-outline'}
            size={22}
            color="#e0b361"
          />
          <Text className="font-body-bold text-xl text-white mt-1">{formatCountdown(minutesUntil)}</Text>
          <Text className="font-body text-[10px] text-primary-200">
            {tr('home_until', language)} {info ? tr(PRAYER_NAME_KEYS[info.next], language) : '—'}
          </Text>
        </View>
      </View>
    </View>
  );
}
