import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** A single navigable month grid for picking a start/end date range by tapping two days. */
export function RangePickerGrid({
  viewYear,
  viewMonth,
  onNavigate,
  start,
  end,
  onPickDate,
}: {
  viewYear: number;
  viewMonth: number;
  onNavigate: (year: number, month: number) => void;
  start: string | null;
  end: string | null;
  onPickDate: (iso: string) => void;
}) {
  const firstOfMonth = new Date(viewYear, viewMonth - 1, 1);
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const startWeekday = firstOfMonth.getDay();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth - 1, d));
  while (cells.length % 7 !== 0) cells.push(null);

  function shift(delta: number) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    onNavigate(y, m);
  }

  const monthLabel = firstOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <View>
      <View className="flex-row items-center justify-between mb-3">
        <TouchableOpacity onPress={() => shift(-1)} className="p-2">
          <Ionicons name="chevron-back" size={16} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-semibold text-sm text-ink-900 dark:text-white">{monthLabel}</Text>
        <TouchableOpacity onPress={() => shift(1)} className="p-2">
          <Ionicons name="chevron-forward" size={16} color="#5b6579" />
        </TouchableOpacity>
      </View>

      <View className="flex-row mb-1">
        {WEEKDAYS.map((w, i) => (
          <View key={i} className="flex-1 items-center">
            <Text className="font-body-medium text-[10px] text-ink-400">{w}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {cells.map((date, idx) => {
          if (!date) return <View key={idx} style={{ width: '14.28%' }} className="aspect-square" />;
          const iso = toISO(date);
          const isStart = iso === start;
          const isEnd = iso === end;
          const inRange = start && end && iso > start && iso < end;
          return (
            <TouchableOpacity
              key={idx}
              style={{ width: '14.28%' }}
              className="aspect-square items-center justify-center"
              onPress={() => onPickDate(iso)}
            >
              <View
                className={`w-8 h-8 items-center justify-center rounded-full ${
                  isStart || isEnd ? 'bg-primary-600' : inRange ? 'bg-primary-100 dark:bg-primary-900/30' : ''
                }`}
              >
                <Text
                  className={`font-body-medium text-xs ${
                    isStart || isEnd ? 'text-white' : 'text-ink-900 dark:text-white'
                  }`}
                >
                  {date.getDate()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
