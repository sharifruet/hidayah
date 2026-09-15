import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../components/ui/Screen';
import { JUZ_DATA, type JuzInfo } from '../../../data/juz';
import { getReadSurahs } from '../../../lib/progress';
import { backOr } from '../../../lib/navigation';
import { useApp } from '../../../context/AppContext';
import { tr } from '../../../data/translations';

export default function JuzScreen() {
  const { language } = useApp();
  const readSet = getReadSurahs();

  return (
    <Screen scroll={false}>
      <View className="px-4 flex-row items-center mt-4 mb-4">
        <TouchableOpacity onPress={() => backOr('/quran')} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white">{tr('quran_juz_tab', language)}</Text>
      </View>

      <FlatList
        data={JUZ_DATA}
        keyExtractor={(item) => String(item.juz)}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 128 }}
        columnWrapperStyle={{ gap: 8 }}
        renderItem={({ item }: { item: JuzInfo }) => {
          const progress = item.surahs.filter((s) => readSet.has(s)).length / item.surahs.length;
          return (
            <TouchableOpacity
              onPress={() => router.push(`/quran/${item.start.surah}/${item.start.ayah}` as never)}
              className="flex-1 bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-2xl p-4 mb-3"
            >
              <View className="flex-row items-center justify-between mb-2">
                <View className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/30 items-center justify-center">
                  <Text className="font-body-semibold text-xs text-primary-700 dark:text-primary-400">{item.juz}</Text>
                </View>
                {progress === 1 ? <Ionicons name="checkmark-circle" size={18} color="#15805a" /> : null}
              </View>
              <Text className="font-body-semibold text-sm text-ink-900 dark:text-white">{item.name}</Text>
              <Text className="font-body text-xs text-ink-400 mt-0.5">
                {tr('quran_surah_tab', language)} {item.start.surah}:{item.start.ayah} – {item.end.surah}:{item.end.ayah}
              </Text>
              <View className="h-1.5 bg-ink-100 dark:bg-ink-800 rounded-full mt-3 overflow-hidden">
                <View className="h-full bg-primary-500" style={{ width: `${progress * 100}%` }} />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </Screen>
  );
}
