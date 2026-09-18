import { Text, TextInput, View } from 'react-native';

import { useApp } from '../../context/AppContext';
import { JAMAH_PRAYERS } from '../../lib/services/masjids';
import { maskTimeInput, prayerLabel, TIME_HH_MM, type JamahForm } from '../../lib/masjid';

interface Props {
  value: JamahForm;
  onChange: (next: JamahForm) => void;
  disabled?: boolean;
}

/** Six HH:MM inputs in a 2-column grid; invalid entries get a red border. */
export function JamahTimesFields({ value, onChange, disabled = false }: Props) {
  const { language } = useApp();

  return (
    <View className="flex-row flex-wrap -mx-1">
      {JAMAH_PRAYERS.map((prayer) => {
        const v = value[prayer];
        const invalid = !!v && !TIME_HH_MM.test(v);
        return (
          <View key={prayer} className="w-1/2 px-1 mb-3">
            <Text className="font-body-medium text-xs text-ink-500 dark:text-ink-400 mb-1">
              {prayerLabel(prayer, language)}
            </Text>
            <TextInput
              value={v}
              editable={!disabled}
              onChangeText={(t) => onChange({ ...value, [prayer]: maskTimeInput(t) })}
              placeholder="HH:MM"
              placeholderTextColor="#7d879a"
              keyboardType="number-pad"
              maxLength={5}
              className={`font-body text-base text-ink-900 dark:text-white bg-white dark:bg-ink-900 border rounded-xl px-3 py-2.5 ${
                invalid ? 'border-red-400' : 'border-ink-100 dark:border-ink-800'
              }`}
            />
          </View>
        );
      })}
    </View>
  );
}
