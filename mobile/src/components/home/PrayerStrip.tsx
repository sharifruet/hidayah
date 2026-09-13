import { Text, View } from 'react-native';

import type { PrayerTimesResponse } from '../../lib/services/prayer';
import { getCurrentPrayer, type PrayerName } from '../../lib/prayerMath';
import { Card } from '../ui/Card';
import { tr } from '../../data/translations';
import { useApp } from '../../context/AppContext';

const VISIBLE: PrayerName[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
const NAME_KEYS: Record<PrayerName, string> = {
  fajr: 'prayer_fajr',
  sunrise: 'prayer_sunrise',
  dhuhr: 'prayer_dhuhr',
  asr: 'prayer_asr',
  maghrib: 'prayer_maghrib',
  isha: 'prayer_isha',
};

export function PrayerStrip({ times }: { times?: PrayerTimesResponse['times'] }) {
  const { language } = useApp();
  const info = getCurrentPrayer(times);

  return (
    <Card className="flex-row px-1 py-3">
      {VISIBLE.map((name) => {
        const isCurrent = info?.current === name;
        const isNext = info?.next === name;
        return (
          <View key={name} className="flex-1 items-center px-1">
            <Text
              className={`font-body-medium text-[11px] mb-1 ${
                isCurrent
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-ink-400 dark:text-ink-400'
              }`}
            >
              {tr(NAME_KEYS[name], language)}
            </Text>
            <View
              className={`w-full items-center rounded-xl py-1.5 ${
                isCurrent ? 'bg-primary-50 dark:bg-primary-900/40' : ''
              }`}
            >
              <Text
                className={`font-body-semibold text-xs ${
                  isCurrent
                    ? 'text-primary-700 dark:text-primary-300'
                    : isNext
                      ? 'text-ink-800 dark:text-ink-100'
                      : 'text-ink-500 dark:text-ink-400'
                }`}
              >
                {times ? times[name] : '--:--'}
              </Text>
            </View>
          </View>
        );
      })}
    </Card>
  );
}
