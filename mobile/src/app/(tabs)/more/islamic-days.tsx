import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { useApp } from '../../../context/AppContext';
import { fmt, tr } from '../../../data/translations';
import { addDays } from '../../../lib/dates';
import { formatHijriDate, gregorianToHijri } from '../../../lib/hijri';
import { islamicDaysOn, upcomingIslamicDays, type IslamicDayKind } from '../../../lib/islamicDays';
import { formatDate } from '../../../lib/format';

const KIND_STYLE: Record<IslamicDayKind, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  eid: { icon: 'star', color: '#c99a45' },
  major: { icon: 'calendar', color: '#22a06d' },
  night: { icon: 'moon', color: '#6366f1' },
  fast: { icon: 'restaurant-outline', color: '#0ea5e9' },
};

export default function IslamicDaysScreen() {
  const { language, hijriOffset } = useApp();
  const today = new Date();
  const upcoming = upcomingIslamicDays(today, 400, hijriOffset);

  const fasts = Array.from({ length: 30 }, (_, i) => addDays(today, i + 1))
    .map((date) => ({ date, events: islamicDaysOn(date, hijriOffset).filter((e) => e.kind === 'fast') }))
    .filter((d) => d.events.length);

  function whenLabel(daysAway: number, kind: IslamicDayKind): string {
    if (daysAway === 0) return tr(kind === 'night' ? 'islamic_days_tonight' : 'islamic_days_today', language);
    if (daysAway === 1) return tr('islamic_days_tomorrow', language);
    return fmt('islamic_days_in', language, { n: daysAway });
  }

  const dateLabel = (d: Date) => formatDate(d, language, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <Screen>
      <View className="flex-row items-center mt-4 mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white">{tr('islamic_days_title', language)}</Text>
      </View>

      <Text className="font-body-semibold text-sm text-ink-700 dark:text-ink-300 mb-2">{tr('islamic_days_upcoming', language)}</Text>
      <Card className="mb-4 overflow-hidden">
        {upcoming.map((e, idx) => {
          // Night observances fall on the evening before their Hijri date.
          const h = gregorianToHijri(e.kind === 'night' ? addDays(e.date, 1) : e.date, hijriOffset);
          const style = KIND_STYLE[e.kind];
          return (
            <View key={e.key} className={`flex-row px-4 py-3.5 ${idx < upcoming.length - 1 ? 'border-b border-ink-100 dark:border-ink-800' : ''}`}>
              <View className="w-9 h-9 rounded-full bg-ink-50 dark:bg-ink-800 items-center justify-center mt-0.5">
                <Ionicons name={style.icon} size={16} color={style.color} />
              </View>
              <View className="flex-1 ml-3">
                <View className="flex-row items-center justify-between">
                  <Text className="font-body-semibold text-sm text-ink-900 dark:text-white flex-1">
                    {tr(`iday_${e.key}`, language)}
                    {e.kind === 'night' ? ` ${tr('islamic_days_night_suffix', language)}` : ''}
                  </Text>
                  <Text className={`font-body-medium text-xs ${e.daysAway <= 1 ? 'text-primary-600' : 'text-ink-400'}`}>
                    {whenLabel(e.daysAway, e.kind)}
                  </Text>
                </View>
                <Text className="font-body text-xs text-ink-500 dark:text-ink-400 mt-0.5">
                  {dateLabel(e.date)} · {formatHijriDate(h, language, { era: false })}
                </Text>
                <Text className="font-body text-xs text-ink-400 mt-1 leading-relaxed">{tr(`iday_${e.key}_note`, language)}</Text>
              </View>
            </View>
          );
        })}
      </Card>

      <Text className="font-body-semibold text-sm text-ink-700 dark:text-ink-300 mb-2">{tr('islamic_days_fasts', language)}</Text>
      <Card className="mb-4 overflow-hidden">
        {fasts.map(({ date, events }, idx) => (
          <View key={date.toISOString()} className={`flex-row items-center justify-between px-4 py-3 ${idx < fasts.length - 1 ? 'border-b border-ink-100 dark:border-ink-800' : ''}`}>
            <Text className="font-body-medium text-sm text-ink-900 dark:text-white">{dateLabel(date)}</Text>
            <Text className="font-body text-xs text-sky-600 dark:text-sky-400 text-right flex-1 ml-3">
              {events.map((e) => tr(`iday_${e.key}`, language)).join(' · ')}
            </Text>
          </View>
        ))}
      </Card>

      <Text className="font-body text-xs text-ink-400 leading-relaxed">{tr('islamic_days_note', language)}</Text>
    </Screen>
  );
}
