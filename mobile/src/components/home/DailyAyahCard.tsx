import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { getDailyAyah } from '../../data/dailyAyahs';
import { tr } from '../../data/translations';
import type { LanguageCode } from '../../lib/constants';

export function DailyAyahCard({ language }: { language: LanguageCode }) {
  const ayah = getDailyAyah();
  const translation = language === 'bn' ? ayah.translation_bn : ayah.translation_en;

  return (
    <View className="rounded-3xl bg-ink-900 dark:bg-ink-900 border border-gold-500/20 px-5 py-5">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="font-body-medium text-[11px] uppercase tracking-wider text-gold-400">
          {tr('home_daily_ayah', language)}
        </Text>
        <Ionicons name="sparkles-outline" size={14} color="#e0b361" />
      </View>

      <Text className="font-arabic text-2xl leading-[42px] text-right text-white mb-3">
        {ayah.arabic}
      </Text>

      <Text className="font-body text-sm leading-relaxed text-ink-200 mb-3">{translation}</Text>

      <View className="flex-row items-center justify-between">
        <Text className="font-body text-xs text-ink-400">{ayah.ref}</Text>
        <TouchableOpacity
          onPress={() => router.push(`/quran/${ayah.surah}/${ayah.ayah}` as never)}
          className="bg-white/10 px-3 py-1.5 rounded-lg"
        >
          <Text className="font-body-medium text-xs text-white">{tr('home_read', language)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
