import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Card } from '../ui/Card';
import { useApp } from '../../context/AppContext';
import { tr } from '../../data/translations';
import { formatTime } from '../../lib/format';
import { myMasjidName } from '../../lib/myMasjid';
import { prayerLabel } from '../../lib/masjid';
import type { JamahPrayer } from '../../lib/services/masjids';

const DAILY: JamahPrayer[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

/** Next jamah today at the user's masjid (Jumu'ah replaces Dhuhr on Fridays). */
export function MyMasjidCard() {
  const { myMasjid, language, timeFormat } = useApp();
  if (!myMasjid) return null;

  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const prayers = DAILY.map((p) => (p === 'dhuhr' && now.getDay() === 5 && myMasjid.jamah.jumuah ? 'jumuah' : p));
  const next = prayers
    .map((p) => ({ p, time: myMasjid.jamah[p] }))
    .filter((x): x is { p: JamahPrayer; time: string } => !!x.time)
    .find(({ time }) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m > nowMins;
    });

  return (
    <TouchableOpacity onPress={() => router.push(`/more/masjids/${myMasjid.id}` as never)}>
      <Card className="px-4 py-3 flex-row items-center">
        <View className="w-9 h-9 rounded-full bg-primary-50 dark:bg-primary-900/30 items-center justify-center">
          <Ionicons name="business" size={16} color="#22a06d" />
        </View>
        <View className="flex-1 ml-3">
          <Text className="font-body text-[11px] text-ink-400">{tr('my_masjid', language)}</Text>
          <Text className="font-body-semibold text-sm text-ink-900 dark:text-white" numberOfLines={1}>
            {myMasjidName(myMasjid, language)}
          </Text>
        </View>
        {next ? (
          <View className="items-end">
            <Text className="font-body text-[11px] text-ink-400">
              {tr('my_masjid_next_jamah', language)} · {prayerLabel(next.p, language)}
            </Text>
            <Text className="font-body-bold text-base text-primary-700 dark:text-primary-300">{formatTime(next.time, language, timeFormat)}</Text>
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={16} color="#7d879a" />
        )}
      </Card>
    </TouchableOpacity>
  );
}
