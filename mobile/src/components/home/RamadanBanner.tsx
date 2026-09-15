import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { daysUntilHijriMonth, gregorianToHijri } from '../../lib/hijri';
import { tr } from '../../data/translations';
import { useApp } from '../../context/AppContext';
import type { PrayerTimesResponse } from '../../lib/services/prayer';

const RAMADAN_MONTH = 9;
const SHAWWAL_MONTH = 10;

function minutesUntil(timeStr: string | undefined, now: Date): number | null {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':').map(Number);
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  let diff = Math.round((target.getTime() - now.getTime()) / 60000);
  if (diff < 0) diff += 24 * 60;
  return diff;
}

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function RamadanBanner({ times }: { times?: PrayerTimesResponse['times'] }) {
  const { language } = useApp();
  const today = new Date();
  const hijri = gregorianToHijri(today);
  const isRamadan = hijri.month === RAMADAN_MONTH;

  if (isRamadan) {
    const daysLeft = daysUntilHijriMonth(SHAWWAL_MONTH, today);
    const untilFajr = minutesUntil(times?.fajr, today);
    const untilMaghrib = minutesUntil(times?.maghrib, today);
    // Whichever is sooner tells us whether we're currently fasting (heading to Iftar)
    // or in the night window before Suhoor closes (heading to Fajr).
    const showingIftar = untilMaghrib != null && (untilFajr == null || untilMaghrib <= untilFajr);

    return (
      <View className="rounded-2xl bg-gold-500/10 border border-gold-500/30 px-4 py-3">
        <View className="flex-row items-center">
          <Ionicons name="moon" size={18} color="#c99a45" />
          <Text className="font-body-medium text-sm text-gold-600 dark:text-gold-400 ml-2">
            {tr('home_ramadan_mubarak', language)} — {hijri.day} {tr('home_day_of_ramadan', language)} · {tr('home_eid_in', language)}
            {daysLeft} {tr('home_days', language)}
          </Text>
        </View>
        {times ? (
          <View className="flex-row items-center mt-2 pt-2 border-t border-gold-500/20">
            <Ionicons name={showingIftar ? 'restaurant-outline' : 'cafe-outline'} size={14} color="#c99a45" />
            <Text className="font-body-medium text-xs text-gold-700 dark:text-gold-400 ml-1.5">
              {showingIftar
                ? `${tr('home_iftar_in', language)} ${formatMinutes(untilMaghrib!)}`
                : `${tr('home_suhoor_ends_in', language)} ${formatMinutes(untilFajr!)}`}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }

  const daysToRamadan = daysUntilHijriMonth(RAMADAN_MONTH, today);
  if (daysToRamadan > 45) return null;

  return (
    <View className="rounded-2xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 px-4 py-3 flex-row items-center">
      <Ionicons name="moon-outline" size={18} color="#22a06d" />
      <Text className="font-body-medium text-sm text-primary-700 dark:text-primary-300 ml-2">
        {daysToRamadan} {tr('home_until_ramadan', language)}
      </Text>
    </View>
  );
}
