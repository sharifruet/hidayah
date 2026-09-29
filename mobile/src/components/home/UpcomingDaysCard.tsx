import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Card } from '../ui/Card';
import { useApp } from '../../context/AppContext';
import { fmt, tr } from '../../data/translations';
import { formatDate } from '../../lib/format';
import { upcomingIslamicDays } from '../../lib/islamicDays';

/** The next three annual observances, e.g. "Shab-e-Barat · in 12 days". */
export function UpcomingDaysCard() {
  const { language, hijriOffset } = useApp();
  const items = upcomingIslamicDays(new Date(), 400, hijriOffset).slice(0, 3);
  if (!items.length) return null;

  return (
    <TouchableOpacity onPress={() => router.push('/more/islamic-days' as never)}>
      <Card className="overflow-hidden">
        {items.map((e, idx) => (
          <View key={e.key} className={`flex-row items-center px-4 py-3 ${idx < items.length - 1 ? 'border-b border-ink-100 dark:border-ink-800' : ''}`}>
            <Ionicons name={e.kind === 'night' ? 'moon' : e.kind === 'eid' ? 'star' : 'calendar-outline'} size={15} color="#c99a45" />
            <Text className="font-body-medium text-sm text-ink-900 dark:text-white ml-2.5 flex-1">{tr(`iday_${e.key}`, language)}</Text>
            <Text className="font-body text-xs text-ink-400">
              {e.daysAway === 0
                ? tr(e.kind === 'night' ? 'islamic_days_tonight' : 'islamic_days_today', language)
                : e.daysAway === 1
                  ? tr('islamic_days_tomorrow', language)
                  : `${formatDate(e.date, language, { day: 'numeric', month: 'short' })} · ${fmt('islamic_days_in', language, { n: e.daysAway })}`}
            </Text>
          </View>
        ))}
      </Card>
    </TouchableOpacity>
  );
}
