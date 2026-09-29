import { useRef, useState } from 'react';
import { ActivityIndicator, Platform, Share, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

import { Screen } from '../../../components/ui/Screen';
import { useApp } from '../../../context/AppContext';
import { fmt, tr } from '../../../data/translations';
import { formatDate, formatTime, localDigits } from '../../../lib/format';
import { gregorianToHijri, hijriMonthDays } from '../../../lib/hijri';
import { calculatePrayerTimes } from '../../../lib/prayerCalc';

const RAMADAN = 9;

export default function RamadanTimetableScreen() {
  const { location, method, language, hijriOffset, timeFormat } = useApp();
  const sheetRef = useRef<View>(null);
  const [sharing, setSharing] = useState(false);

  const today = new Date();
  const days = hijriMonthDays(RAMADAN, today, hijriOffset);
  const rows = days.map((date, i) => ({ date, roza: i + 1, times: calculatePrayerTimes(location.lat, location.lng, date, method) }));
  const year = days.length ? gregorianToHijri(days[0], hijriOffset).year : undefined;
  const todayKey = today.toDateString();
  const daysUntil = days.length ? Math.round((days[0].getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / 86400000) : 0;

  async function share() {
    const title = fmt('ramadan_share_text', language, { place: location.name });
    // Native: share the rendered table as an image (what people forward on WhatsApp/Facebook).
    if (Platform.OS !== 'web' && sheetRef.current && (await Sharing.isAvailableAsync())) {
      setSharing(true);
      try {
        const uri = await captureRef(sheetRef, { format: 'png', quality: 1 });
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: title, UTI: 'public.png' });
      } finally {
        setSharing(false);
      }
      return;
    }
    const lines = rows.map(
      (r) =>
        `${localDigits(r.roza, language)}. ${formatDate(r.date, language, { day: 'numeric', month: 'short' })} — ${tr('ramadan_col_sehri', language)} ${formatTime(r.times.fajr, language, timeFormat)}, ${tr('ramadan_col_iftar', language)} ${formatTime(r.times.maghrib, language, timeFormat)}`
    );
    await Share.share({ message: `${title}\n\n${lines.join('\n')}` });
  }

  return (
    <Screen>
      <View className="flex-row items-center mt-4 mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white flex-1">{tr('ramadan_title', language)}</Text>
        <TouchableOpacity onPress={share} disabled={sharing} className="flex-row items-center bg-primary-600 rounded-full px-3.5 py-2">
          {sharing ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="share-outline" size={15} color="#fff" />}
          <Text className="font-body-semibold text-xs text-white ml-1.5">{tr('ramadan_share', language)}</Text>
        </TouchableOpacity>
      </View>

      {/* Captured as the shared image — keep it self-contained (title, place, table, note). */}
      <View ref={sheetRef} collapsable={false} className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 overflow-hidden">
        <View className="bg-primary-700 px-4 py-4">
          <Text className="font-body-bold text-lg text-white">{year ? fmt('ramadan_heading', language, { year }) : tr('ramadan_title', language)}</Text>
          <Text className="font-body text-xs text-primary-100 mt-0.5">
            {location.name}
            {location.division && location.division !== location.name ? `, ${location.division}` : ''} · {method}
          </Text>
          {daysUntil > 0 ? (
            <Text className="font-body-medium text-xs text-gold-400 mt-1">{fmt('ramadan_starts_in', language, { n: daysUntil })}</Text>
          ) : null}
        </View>

        <View className="flex-row px-3 py-2 bg-primary-50 dark:bg-primary-900/30">
          <Text className="w-10 font-body-semibold text-[11px] text-primary-800 dark:text-primary-200">{tr('ramadan_col_day', language)}</Text>
          <Text className="flex-1 font-body-semibold text-[11px] text-primary-800 dark:text-primary-200">{tr('ramadan_col_date', language)}</Text>
          <Text className="w-20 text-right font-body-semibold text-[11px] text-primary-800 dark:text-primary-200">{tr('ramadan_col_sehri', language)}</Text>
          <Text className="w-16 text-right font-body-semibold text-[11px] text-primary-800 dark:text-primary-200">{tr('ramadan_col_iftar', language)}</Text>
        </View>

        {rows.map((r) => {
          const isToday = r.date.toDateString() === todayKey;
          const lastTen = r.roza > 20;
          return (
            <View
              key={r.roza}
              className={`flex-row items-center px-3 py-2 border-t border-ink-50 dark:border-ink-800 ${
                isToday ? 'bg-gold-500/15' : lastTen ? 'bg-ink-50/60 dark:bg-ink-800/40' : ''
              }`}
            >
              <Text className="w-10 font-body-bold text-sm text-ink-900 dark:text-white">{localDigits(r.roza, language)}</Text>
              <Text className="flex-1 font-body text-xs text-ink-600 dark:text-ink-300">
                {formatDate(r.date, language, { weekday: 'short', day: 'numeric', month: 'short' })}
              </Text>
              <Text className="w-20 text-right font-body-semibold text-sm text-ink-900 dark:text-white">{formatTime(r.times.fajr, language, timeFormat)}</Text>
              <Text className="w-16 text-right font-body-semibold text-sm text-primary-700 dark:text-primary-300">{formatTime(r.times.maghrib, language, timeFormat, { withPeriod: false })}</Text>
            </View>
          );
        })}

        <Text className="font-body text-[10px] text-ink-400 px-4 py-3 leading-relaxed border-t border-ink-100 dark:border-ink-800">
          {tr('ramadan_note', language)} · {tr('app_name', language)}
        </Text>
      </View>
    </Screen>
  );
}
