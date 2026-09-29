import { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Card } from '../../../components/ui/Card';
import { useApp } from '../../../context/AppContext';
import { tr } from '../../../data/translations';
import { localDigits } from '../../../lib/format';
import NAMES from '../../../data/asmaulHusna.json';

type Name = (typeof NAMES)[number];

/** Case/diacritic-insensitive match on transliteration, meanings and number. */
function matches(n: Name, q: string): boolean {
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ'ʿ-]/g, '');
  const needle = norm(q.trim());
  return !needle || [n.tr, n.en, n.bnName, n.bn, String(n.n)].some((s) => norm(s).includes(needle)) || n.ar.includes(q.trim());
}

export default function NamesScreen() {
  const { language } = useApp();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const list = useMemo(() => NAMES.filter((n) => matches(n, query)), [query]);
  const isBn = language === 'bn';

  return (
    <View className="flex-1 bg-ink-50 dark:bg-ink-950" style={{ paddingTop: insets.top }}>
      <FlatList
        data={list}
        keyExtractor={(n) => String(n.n)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 128 }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            <View className="flex-row items-center mt-4 mb-3">
              <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
                <Ionicons name="chevron-back" size={22} color="#5b6579" />
              </TouchableOpacity>
              <Text className="font-body-bold text-2xl text-ink-900 dark:text-white">{tr('names_title', language)}</Text>
            </View>
            <Text className="font-body text-xs text-ink-500 dark:text-ink-400 italic mb-3 leading-relaxed">{tr('names_hadith', language)}</Text>
            <View className="flex-row items-center bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl px-3 mb-3">
              <Ionicons name="search" size={16} color="#7d879a" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={tr('names_search', language)}
                placeholderTextColor="#adb5c2"
                className="flex-1 py-2.5 ml-2 font-body text-sm text-ink-900 dark:text-white"
              />
            </View>
          </>
        }
        renderItem={({ item }) => (
          <Card className="px-4 py-3 mb-2 flex-row items-center">
            <View className="w-9 h-9 rounded-full bg-primary-50 dark:bg-primary-900/30 items-center justify-center">
              <Text className="font-body-semibold text-xs text-primary-700 dark:text-primary-300">{localDigits(item.n, language)}</Text>
            </View>
            <View className="flex-1 ml-3">
              <Text className="font-body-semibold text-sm text-ink-900 dark:text-white">{isBn ? item.bnName : item.tr}</Text>
              <Text className="font-body text-xs text-ink-500 dark:text-ink-400 mt-0.5">{isBn ? item.bn : item.en}</Text>
              {isBn ? <Text className="font-body text-[11px] text-ink-400 mt-0.5">{item.tr} · {item.en}</Text> : null}
            </View>
            <Text className="font-arabic text-2xl text-ink-900 dark:text-white ml-2">{item.ar}</Text>
          </Card>
        )}
      />
    </View>
  );
}
