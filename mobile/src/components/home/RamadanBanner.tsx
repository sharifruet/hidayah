import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { daysUntilHijriMonth, gregorianToHijri } from '../../lib/hijri';
import { tr } from '../../data/translations';
import { useApp } from '../../context/AppContext';

const RAMADAN_MONTH = 9;
const SHAWWAL_MONTH = 10;

export function RamadanBanner() {
  const { language } = useApp();
  const today = new Date();
  const hijri = gregorianToHijri(today);
  const isRamadan = hijri.month === RAMADAN_MONTH;

  if (isRamadan) {
    const daysLeft = daysUntilHijriMonth(SHAWWAL_MONTH, today);
    return (
      <View className="rounded-2xl bg-gold-500/10 border border-gold-500/30 px-4 py-3 flex-row items-center">
        <Ionicons name="moon" size={18} color="#c99a45" />
        <Text className="font-body-medium text-sm text-gold-600 dark:text-gold-400 ml-2">
          {tr('home_ramadan_mubarak', language)} — {hijri.day} {tr('home_day_of_ramadan', language)} · {tr('home_eid_in', language)}
          {daysLeft} {tr('home_days', language)}
        </Text>
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
