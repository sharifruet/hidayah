import { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../components/ui/Screen';
import { getBookmarks, removeBookmark, type Bookmark } from '../../../lib/bookmarks';
import { backOr } from '../../../lib/navigation';
import { useApp } from '../../../context/AppContext';
import { tr } from '../../../data/translations';

export default function BookmarksScreen() {
  const { language } = useApp();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => getBookmarks());

  function remove(b: Bookmark) {
    removeBookmark(b.surah, b.ayah);
    setBookmarks(getBookmarks());
  }

  return (
    <Screen scroll={false}>
      <View className="px-4 flex-row items-center mt-4 mb-4">
        <TouchableOpacity onPress={() => backOr('/quran')} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white">{tr('quran_bookmarks_title', language)}</Text>
      </View>

      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 128 }}
        ListEmptyComponent={
          <Text className="font-body text-sm text-ink-400 text-center mt-10">{tr('quran_no_bookmarks', language)}</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/quran/${item.surah}/${item.ayah}` as never)}
            className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl p-4 mb-2.5"
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-body-medium text-xs text-primary-600 dark:text-primary-400">
                {item.surahName} · {tr('quran_ayah', language)} {item.ayah}
              </Text>
              <TouchableOpacity onPress={() => remove(item)}>
                <Ionicons name="trash-outline" size={16} color="#7d879a" />
              </TouchableOpacity>
            </View>
            <Text className="font-arabic text-lg text-right text-ink-900 dark:text-white mb-1.5">
              {item.text_ar}
            </Text>
            {item.translationText ? (
              <Text className="font-body text-sm text-ink-600 dark:text-ink-300">{item.translationText}</Text>
            ) : null}
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}
