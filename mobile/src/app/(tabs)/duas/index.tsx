import { useMemo, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../components/ui/Screen';
import { DuaCard } from '../../../components/duas/DuaCard';
import { useApp } from '../../../context/AppContext';
import { duaCategoryLabel, type Dua } from '../../../lib/services/duas';
import { useDuas, DUAS_SYNC_INTERVAL_DAYS } from '../../../lib/duasSync';
import { fmt, tr } from '../../../data/translations';
import { getFavouriteDuaIds, toggleFavouriteDua } from '../../../lib/saved';
import { formatRelative, localDigits } from '../../../lib/format';

const FAVOURITES = '__favourites';

/** Case/diacritic-insensitive match across every text field of a du'a. */
function duaMatches(dua: Dua, query: string): boolean {
  const norm = (v: string) => v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f\u064b-\u065f'ʿ’-]/g, '');
  const q = norm(query.trim());
  if (!q) return true;
  return [dua.arabic, dua.transliteration, dua.translation_en, dua.translation_bn, dua.reference, dua.virtue_en ?? '', dua.virtue_bn ?? '']
    .some((field) => norm(field).includes(q));
}

export default function DuasScreen() {
  const { language } = useApp();
  const [activeCategory, setActiveCategory] = useState('morning');
  // Local copy of the collection (synced from the API every DUAS_SYNC_INTERVAL_DAYS)
  const { categories, duas: allDuas, lastSyncAt, syncing, refresh } = useDuas();
  const [favourites, setFavourites] = useState<string[]>(getFavouriteDuaIds);
  const [query, setQuery] = useState('');
  // A search spans every category; otherwise show the chosen category (or favourites).
  const duas = useMemo(() => {
    if (query.trim()) return allDuas.filter((d) => duaMatches(d, query));
    if (activeCategory === FAVOURITES) {
      const byId = new Map(allDuas.map((d) => [d.id, d]));
      return favourites.map((id) => byId.get(id)).filter((d): d is Dua => !!d);
    }
    return allDuas.filter((d) => d.category === activeCategory);
  }, [allDuas, activeCategory, favourites, query]);

  return (
    <Screen>
      <View className="flex-row items-start justify-between mt-4 mb-1">
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white">{tr('duas_title', language)}</Text>
        <TouchableOpacity
          onPress={refresh}
          disabled={syncing}
          hitSlop={8}
          className="p-1 mt-1"
          accessibilityRole="button"
          accessibilityLabel={tr('duas_refresh', language)}
        >
          {syncing ? <ActivityIndicator size="small" color="#7d879a" /> : <Ionicons name="refresh" size={18} color="#7d879a" />}
        </TouchableOpacity>
      </View>
      <Text className="font-body text-sm text-ink-500 dark:text-ink-400 mb-4">{tr('duas_subtitle', language)}</Text>

      <View className="flex-row items-center bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl px-3 mb-3">
        <Ionicons name="search" size={16} color="#7d879a" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={tr('duas_search', language)}
          placeholderTextColor="#adb5c2"
          className="flex-1 py-2.5 ml-2 font-body text-sm text-ink-900 dark:text-white"
          returnKeyType="search"
        />
        {query ? (
          <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={16} color="#adb5c2" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View className={`flex-row flex-wrap -mx-1 mb-4 ${query.trim() ? 'opacity-40' : ''}`}>
        <TouchableOpacity
          onPress={() => setActiveCategory(FAVOURITES)}
          className={`m-1 px-3.5 py-2 rounded-full ${
            activeCategory === FAVOURITES ? 'bg-rose-600' : 'bg-white dark:bg-ink-900 border border-rose-200 dark:border-rose-900'
          }`}
        >
          <Text className={`font-body-medium text-xs ${activeCategory === FAVOURITES ? 'text-white' : 'text-rose-600 dark:text-rose-400'}`}>
            {tr('duas_favourites', language)} {favourites.length ? localDigits(favourites.length, language) : ''}
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => {
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
        <DuaCard
          key={dua.id}
          dua={dua}
          language={language}
          favourite={favourites.includes(dua.id)}
          onToggleFavourite={() => setFavourites(toggleFavouriteDua(dua.id))}
        />
      ))}
      {duas.length === 0 ? (
        <Text className="font-body text-sm text-ink-400 text-center mt-6 px-6">
          {query.trim() ? tr('duas_no_results', language) : activeCategory === FAVOURITES ? tr('saved_empty_duas', language) : ''}
        </Text>
      ) : null}

      <Text className="font-body text-[11px] text-ink-300 dark:text-ink-600 text-center mt-4">
        {lastSyncAt
          ? `${tr('duas_last_synced', language)} ${formatRelative(lastSyncAt, language)} · ${fmt('duas_sync_interval', language, { days: DUAS_SYNC_INTERVAL_DAYS })}`
          : tr('duas_not_synced', language)}
      </Text>
    </Screen>
  );
}
