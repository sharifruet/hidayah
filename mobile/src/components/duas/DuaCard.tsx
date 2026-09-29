import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Card } from '../ui/Card';
import { tr } from '../../data/translations';
import type { LanguageCode } from '../../lib/constants';
import type { Dua } from '../../lib/services/duas';
import { localDigits } from '../../lib/format';

export function DuaCard({
  dua, language, favourite, onToggleFavourite,
}: { dua: Dua; language: LanguageCode; favourite: boolean; onToggleFavourite: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showVirtue, setShowVirtue] = useState(false); // fazilat is hidden until tapped

  async function copy() {
    const text = [dua.arabic, '', dua.transliteration, '', dua.translation_en, '', `(${dua.reference})`].join('\n');
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="mb-3 overflow-hidden">
      <TouchableOpacity onPress={() => setExpanded((e) => !e)} className="p-4" activeOpacity={0.8}>
        <Text className="font-arabic text-3xl leading-[54px] text-right text-ink-900 dark:text-white mb-2">
          {dua.arabic}
        </Text>

        {dua.count > 1 ? (
          <View className="flex-row justify-end mb-1.5">
            <View className="bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">
              <Text className="font-body-medium text-xs text-primary-700 dark:text-primary-400">× {localDigits(dua.count, language)}</Text>
            </View>
          </View>
        ) : null}

        <Text className="font-body text-sm text-ink-500 dark:text-ink-400 italic leading-relaxed">
          {dua.transliteration}
        </Text>

        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-1 flex-row items-center flex-wrap mr-2">
            <Text className="font-body text-xs text-ink-400 mr-2">{dua.reference}</Text>
            {dua.virtue_en ? (
              <TouchableOpacity
                onPress={() => setShowVirtue((v) => !v)}
                hitSlop={6}
                className={`flex-row items-center px-2 py-0.5 rounded-full border ${
                  showVirtue
                    ? 'bg-gold-500/20 border-gold-500/60'
                    : 'bg-gold-500/10 border-gold-500/30'
                }`}
              >
                <Ionicons name={showVirtue ? 'sparkles' : 'sparkles-outline'} size={11} color="#c99a45" />
                <Text className="font-body-medium text-[11px] text-gold-500 ml-1">{tr('dua_virtue', language)}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <TouchableOpacity onPress={onToggleFavourite} hitSlop={10} className="mr-3" accessibilityRole="button">
            <Ionicons name={favourite ? 'heart' : 'heart-outline'} size={18} color={favourite ? '#e11d48' : '#7d879a'} />
          </TouchableOpacity>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color="#7d879a" />
        </View>
      </TouchableOpacity>

      {showVirtue && dua.virtue_en ? (
        <View className="border-t border-gold-500/30 bg-gold-500/10 px-4 py-3">
          <Text className="font-body-semibold text-[10px] uppercase text-gold-500 mb-1">{tr('dua_virtue', language)}</Text>
          <Text className="font-body text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
            {language === 'bn' ? dua.virtue_bn : dua.virtue_en}
          </Text>
          {language === 'bn' ? (
            <Text className="font-body text-xs text-ink-500 dark:text-ink-400 leading-relaxed mt-2">{dua.virtue_en}</Text>
          ) : null}
        </View>
      ) : null}

      {expanded ? (
        <View className="border-t border-ink-100 dark:border-ink-800 px-4 py-3 bg-ink-50 dark:bg-ink-950/40">
          <Text className="font-body text-sm text-ink-700 dark:text-ink-300 leading-relaxed mb-3">
            {language === 'bn' ? dua.translation_bn : dua.translation_en}
          </Text>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={copy}
              className="flex-row items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 rounded-lg"
            >
              <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={13} color={copied ? '#22a06d' : '#5b6579'} />
              <Text className="font-body-medium text-xs text-ink-600 dark:text-ink-300">
                {copied ? tr('copied', language) : tr('copy', language)}
              </Text>
            </TouchableOpacity>
            {dua.quranRef ? (
              <TouchableOpacity
                onPress={() => router.push(`/quran/${dua.quranRef!.surah}/${dua.quranRef!.ayah}` as never)}
                className="flex-row items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-lg"
              >
                <Ionicons name="book-outline" size={13} color="#15805a" />
                <Text className="font-body-medium text-xs text-primary-700 dark:text-primary-400">{tr('quran_view_in_quran', language)}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : null}
    </Card>
  );
}
