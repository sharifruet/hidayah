import { Text, TouchableOpacity, View } from 'react-native';

import { gregorianToHijri, HIJRI_MONTH_NAMES_EN } from '../../lib/hijri';
import { useApp } from '../../context/AppContext';
import { tr } from '../../data/translations';
import type { LanguageCode } from '../../lib/constants';

const LOCALE_MAP: Record<LanguageCode, string> = { en: 'en-US', bn: 'bn-BD', ur: 'ur-PK', tr: 'tr-TR', id: 'id-ID' };

/** Which Hijri month(s) a Gregorian month overlaps, for a quick at-a-glance year overview. */
function hijriMonthsInGregorianMonth(year: number, month: number): string {
  const names = new Set<string>();
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d += 7) {
    const h = gregorianToHijri(new Date(year, month - 1, d));
    names.add(HIJRI_MONTH_NAMES_EN[h.month - 1] ?? '');
  }
  // Also check the last day, in case the 7-day stride skipped a month boundary near month-end.
  const lastH = gregorianToHijri(new Date(year, month - 1, daysInMonth));
  names.add(HIJRI_MONTH_NAMES_EN[lastH.month - 1] ?? '');
  return Array.from(names).filter(Boolean).join(' / ');
}

export function YearCalendarGrid({ year, onSelectMonth }: { year: number; onSelectMonth: (month: number) => void }) {
  const { language } = useApp();
  const today = new Date();

  return (
    <View className="flex-row flex-wrap gap-2.5">
      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
        const label = new Date(year, month - 1, 1).toLocaleDateString(LOCALE_MAP[language], { month: 'long' });
        const isCurrent = today.getFullYear() === year && today.getMonth() + 1 === month;
        return (
          <TouchableOpacity
            key={month}
            onPress={() => onSelectMonth(month)}
            style={{ width: '31.5%' }}
            className={`rounded-xl border px-2.5 py-3 ${
              isCurrent ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900'
            }`}
          >
            <Text className={`font-body-semibold text-sm ${isCurrent ? 'text-primary-700 dark:text-primary-400' : 'text-ink-900 dark:text-white'}`}>
              {label}
            </Text>
            <Text className="font-body text-[10px] text-ink-400 mt-0.5" numberOfLines={1}>
              {hijriMonthsInGregorianMonth(year, month)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
