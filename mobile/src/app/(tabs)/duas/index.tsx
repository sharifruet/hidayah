import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../components/ui/Screen';
import { Card } from '../../../components/ui/Card';
import { useApp } from '../../../context/AppContext';
import { DUA_CATEGORIES, DUAS, duaCategoryLabel, type Dua } from '../../../data/duas';
import { tr } from '../../../data/translations';
import type { LanguageCode } from '../../../lib/constants';

function DuaCard({ dua, language }: { dua: Dua; language: LanguageCode }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = [dua.arabic, '', dua.transliteration, '', dua.translation_en, '', `(${dua.reference})`].join('\n');
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="mb-3 overflow-hidden">
      <TouchableOpacity onPress={() => setExpanded((e) => !e)} className="p-4" activeOpacity={0.8}>
        <Text className="font-arabic text-2xl leading-[40px] text-right text-ink-900 dark:text-white mb-2">
          {dua.arabic}
        </Text>

        {dua.count > 1 ? (
          <View className="flex-row justify-end mb-1.5">
            <View className="bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">
              <Text className="font-body-medium text-xs text-primary-700 dark:text-primary-400">× {dua.count}</Text>
            </View>
          </View>
        ) : null}

        <Text className="font-body text-sm text-ink-500 dark:text-ink-400 italic leading-relaxed">
          {dua.transliteration}
        </Text>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="font-body text-xs text-ink-400">{dua.reference}</Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color="#7d879a" />
        </View>
      </TouchableOpacity>

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

export default function DuasScreen() {
  const { language } = useApp();
  const [activeCategory, setActiveCategory] = useState('morning');
  const duas = DUAS.filter((d) => d.category === activeCategory);

  return (
    <Screen>
      <Text className="font-body-bold text-2xl text-ink-900 dark:text-white mt-4 mb-1">{tr('duas_title', language)}</Text>
      <Text className="font-body text-sm text-ink-500 dark:text-ink-400 mb-4">{tr('duas_subtitle', language)}</Text>

      <View className="flex-row flex-wrap -mx-1 mb-4">
        {DUA_CATEGORIES.map((cat) => {
          const active = activeCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.id)}
              className={`m-1 px-3.5 py-2 rounded-full ${
                active ? 'bg-primary-600' : 'bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700'
              }`}
            >
              <Text className={`font-body-medium text-xs ${active ? 'text-white' : 'text-ink-600 dark:text-ink-300'}`}>
                {duaCategoryLabel(cat, language)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {duas.map((dua) => (
        <DuaCard key={dua.id} dua={dua} language={language} />
      ))}
    </Screen>
  );
}
