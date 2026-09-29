import { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../components/ui/Screen';
import { DuaCard } from '../../../components/duas/DuaCard';
import { getBookmarks, removeBookmark, type Bookmark } from '../../../lib/bookmarks';
import {
  getFavouriteDuaIds, getHadithBookmarks, removeHadithBookmark, toggleFavouriteDua, type HadithBookmark,
} from '../../../lib/saved';
import { useDuas } from '../../../lib/duasSync';
import { backOr } from '../../../lib/navigation';
import { localDigits } from '../../../lib/format';
import { useApp } from '../../../context/AppContext';
import { tr } from '../../../data/translations';
import type { Dua } from '../../../lib/services/duas';

type Tab = 'quran' | 'duas' | 'hadith';

/** Everything the user has saved: Qur'an ayahs, favourite du'as and bookmarked hadith. */
export default function SavedScreen() {
  const { language } = useApp();
  const [tab, setTab] = useState<Tab>('quran');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => getBookmarks());
  const [hadith, setHadith] = useState<HadithBookmark[]>(() => getHadithBookmarks());
  const [favIds, setFavIds] = useState<string[]>(() => getFavouriteDuaIds());
  const { duas } = useDuas();
  const byId = new Map(duas.map((d) => [d.id, d]));
  const favDuas = favIds.map((id) => byId.get(id)).filter((d): d is Dua => !!d);

  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: 'quran', label: tr('saved_tab_quran', language), count: bookmarks.length },
    { key: 'duas', label: tr('saved_tab_duas', language), count: favDuas.length },
    { key: 'hadith', label: tr('saved_tab_hadith', language), count: hadith.length },
  ];

  const empty = (key: string) => <Text className="font-body text-sm text-ink-400 text-center mt-10 px-6">{tr(key, language)}</Text>;
  const listProps = { contentContainerStyle: { paddingHorizontal: 16, paddingBottom: 128 } };

  return (
    <Screen scroll={false}>
      <View className="px-4 flex-row items-center mt-4 mb-3">
        <TouchableOpacity onPress={() => backOr('/quran')} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white">{tr('saved_title', language)}</Text>
      </View>

      <View className="mx-4 flex-row bg-ink-100 dark:bg-ink-800 rounded-lg p-1 mb-3">
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setTab(t.key)}
            className={`flex-1 items-center py-1.5 rounded-md ${tab === t.key ? 'bg-white dark:bg-ink-700' : ''}`}
          >
            <Text className={`font-body-medium text-sm ${tab === t.key ? 'text-ink-900 dark:text-white' : 'text-ink-400'}`}>
              {t.label}
              {t.count ? ` · ${localDigits(t.count, language)}` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tab === 'quran' ? (
        <FlatList
          {...listProps}
          data={bookmarks}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={empty('quran_no_bookmarks')}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/quran/${item.surah}/${item.ayah}` as never)}
              className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl p-4 mb-2.5"
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-body-medium text-xs text-primary-600 dark:text-primary-400">
                  {item.surahName} · {tr('quran_ayah', language)} {localDigits(item.ayah, language)}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    removeBookmark(item.surah, item.ayah);
                    setBookmarks(getBookmarks());
                  }}
                  hitSlop={8}
                >
                  <Ionicons name="trash-outline" size={16} color="#7d879a" />
                </TouchableOpacity>
              </View>
              <Text className="font-arabic text-lg text-right text-ink-900 dark:text-white mb-1.5">{item.text_ar}</Text>
              {item.translationText ? (
                <Text className="font-body text-sm text-ink-600 dark:text-ink-300">{item.translationText}</Text>
              ) : null}
            </TouchableOpacity>
          )}
        />
      ) : tab === 'duas' ? (
        <FlatList
          {...listProps}
          data={favDuas}
          keyExtractor={(d) => d.id}
          ListEmptyComponent={empty('saved_empty_duas')}
          renderItem={({ item }) => (
            <DuaCard dua={item} language={language} favourite onToggleFavourite={() => setFavIds(toggleFavouriteDua(item.id))} />
          )}
        />
      ) : (
        <FlatList
          {...listProps}
          data={hadith}
          keyExtractor={(b) => b.id}
          ListEmptyComponent={empty('saved_empty_hadith')}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/more/hadith/[slug]/[bookNumber]',
                  params: { slug: item.slug, bookNumber: String(item.bookNumber), h: String(item.hadithnumber) },
                } as never)
              }
              className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl p-4 mb-2.5"
            >
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="font-body-medium text-xs text-primary-600 dark:text-primary-400 flex-1 mr-2" numberOfLines={1}>
                  {item.collectionName} · {tr('hadith_number', language)} {localDigits(item.displayNumber, language)}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    removeHadithBookmark(item.id);
                    setHadith(getHadithBookmarks());
                  }}
                  hitSlop={8}
                >
                  <Ionicons name="trash-outline" size={16} color="#7d879a" />
                </TouchableOpacity>
              </View>
              {item.bookName ? <Text className="font-body text-[11px] text-ink-400 mb-1">{item.bookName}</Text> : null}
              <Text className="font-body text-sm text-ink-700 dark:text-ink-300" numberOfLines={4}>
                {item.preview}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </Screen>
  );
}
