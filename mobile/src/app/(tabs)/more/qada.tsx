import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { useApp } from '../../../context/AppContext';
import { tr } from '../../../data/translations';
import { getQadaCounts, incrementQada, decrementQada, type QadaCounts } from '../../../lib/qada';

const PRAYERS: (keyof QadaCounts)[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const NAME_KEYS: Record<keyof QadaCounts, string> = {
  fajr: 'prayer_fajr',
  dhuhr: 'prayer_dhuhr',
  asr: 'prayer_asr',
  maghrib: 'prayer_maghrib',
  isha: 'prayer_isha',
};

export default function QadaScreen() {
  const { language } = useApp();
  const [counts, setCounts] = useState<QadaCounts>(() => getQadaCounts());
  const total = counts.fajr + counts.dhuhr + counts.asr + counts.maghrib + counts.isha;

  function inc(prayer: keyof QadaCounts) {
    setCounts(incrementQada(prayer));
  }
  function dec(prayer: keyof QadaCounts) {
    setCounts(decrementQada(prayer));
  }

  return (
    <Screen>
      <View className="flex-row items-center mt-4 mb-2">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white">{tr('qada_title', language)}</Text>
      </View>
      <Text className="font-body text-sm text-ink-500 dark:text-ink-400 mb-5">{tr('qada_subtitle', language)}</Text>

      {total > 0 ? (
        <Card className="p-4 mb-5 bg-gold-500/10 border-gold-500/30">
          <Text className="font-body-medium text-sm text-gold-700 dark:text-gold-400">
            {tr('qada_total_owed', language)} {total}
          </Text>
        </Card>
      ) : null}

      {PRAYERS.map((prayer) => (
        <Card key={prayer} className="flex-row items-center justify-between p-4 mb-2.5">
          <Text className="font-body-semibold text-base text-ink-800 dark:text-ink-200">{tr(NAME_KEYS[prayer], language)}</Text>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => dec(prayer)}
              disabled={counts[prayer] === 0}
              className={`w-9 h-9 rounded-full items-center justify-center border border-ink-200 dark:border-ink-700 ${
                counts[prayer] === 0 ? 'opacity-30' : ''
              }`}
            >
              <Ionicons name="remove" size={18} color="#5b6579" />
            </TouchableOpacity>
            <Text className="font-body-bold text-lg text-ink-900 dark:text-white w-8 text-center">{counts[prayer]}</Text>
            <TouchableOpacity
              onPress={() => inc(prayer)}
              className="w-9 h-9 rounded-full items-center justify-center bg-primary-600"
            >
              <Ionicons name="add" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </Card>
      ))}
    </Screen>
  );
}
