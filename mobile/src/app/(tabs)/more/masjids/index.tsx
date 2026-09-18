import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Screen } from '../../../../components/ui/Screen';
import { useApp } from '../../../../context/AppContext';
import { tr } from '../../../../data/translations';
import { getCurrentCoords } from '../../../../lib/geocoding';
import { masjidsService, type Masjid, JAMAH_PRAYERS } from '../../../../lib/services/masjids';
import { formatDistance, prayerLabel, relativeTime } from '../../../../lib/masjid';
import { Palette } from '../../../../constants/theme';

const RADIUS_OPTIONS = [1, 2, 5, 10, 25];

export default function MasjidsListScreen() {
  const { location, language } = useApp();
  // Search origin: device GPS when granted, else the app's saved location.
  const [origin, setOrigin] = useState<{ lat: number; lng: number; fromDevice: boolean }>({
    lat: location.lat, lng: location.lng, fromDevice: false,
  });
  const [radius, setRadius] = useState(5);
  // Starts true: we try GPS once on first open so "near you" is actually near the user.
  const [locating, setLocating] = useState(true);
  const [geoError, setGeoError] = useState(false);
  const [rawQ, setRawQ] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setQ(rawQ.trim()), 350);
    return () => clearTimeout(t);
  }, [rawQ]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const coords = await getCurrentCoords();
        if (cancelled) return;
        if (coords) setOrigin({ ...coords, fromDevice: true });
        else setGeoError(true);
      } catch {
        if (!cancelled) setGeoError(true);
      } finally {
        if (!cancelled) setLocating(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function locateMe() {
    setLocating(true);
    setGeoError(false);
    try {
      const coords = await getCurrentCoords();
      if (coords) setOrigin({ ...coords, fromDevice: true });
      else setGeoError(true);
    } catch {
      setGeoError(true);
    } finally {
      setLocating(false);
    }
  }

  const isSearch = q.length > 0;
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['masjids', isSearch ? 'search' : 'nearby', origin.lat, origin.lng, radius, q],
    queryFn: () =>
      isSearch
        ? masjidsService.search(q, { lat: origin.lat, lng: origin.lng })
        : masjidsService.nearby(origin.lat, origin.lng, radius),
    placeholderData: (prev) => prev,
    staleTime: 60 * 1000,
  });
  const masjids = data?.masjids ?? [];

  return (
    <Screen scroll={false}>
      <View className="px-4 flex-row items-center mt-4 mb-3">
        <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
          <Ionicons name="chevron-back" size={22} color="#5b6579" />
        </TouchableOpacity>
        <Text className="font-body-bold text-2xl text-ink-900 dark:text-white flex-1">{tr('masjids_title', language)}</Text>
        <TouchableOpacity
          onPress={() => router.push('/more/masjids/add' as never)}
          className="flex-row items-center bg-primary-600 rounded-full px-3 py-2"
        >
          <Ionicons name="add" size={16} color="#fff" />
          <Text className="font-body-semibold text-xs text-white ml-1">{tr('masjids_add', language)}</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View className="px-4 mb-3">
        <View className="flex-row items-center bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl px-3 py-2.5">
          <Ionicons name="search" size={15} color="#7d879a" />
          <TextInput
            value={rawQ}
            onChangeText={setRawQ}
            placeholder={tr('masjids_search_placeholder', language)}
            placeholderTextColor="#7d879a"
            className="flex-1 ml-2 font-body text-sm text-ink-900 dark:text-white"
          />
          {rawQ ? (
            <TouchableOpacity onPress={() => setRawQ('')}>
              <Ionicons name="close-circle" size={16} color="#7d879a" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Location + radius */}
      <View className="px-4 mb-3">
        <TouchableOpacity
          onPress={locateMe}
          disabled={locating}
          className={`flex-row items-center rounded-xl px-3 py-2.5 mb-2 ${
            origin.fromDevice ? 'bg-primary-50 dark:bg-primary-900/30' : 'bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800'
          }`}
        >
          {locating ? (
            <ActivityIndicator size="small" color={Palette.primary[600]} />
          ) : (
            <Ionicons name={origin.fromDevice ? 'locate' : 'locate-outline'} size={17} color={Palette.primary[600]} />
          )}
          <Text className="font-body-medium text-sm text-primary-700 dark:text-primary-300 ml-2 flex-1">
            {locating
              ? tr('masjids_locating', language)
              : origin.fromDevice
                ? `${tr('masjids_searching_near', language)}: ${origin.lat.toFixed(3)}, ${origin.lng.toFixed(3)}`
                : `${tr('masjids_searching_near', language)}: ${location.name}`}
          </Text>
          {!origin.fromDevice && !locating ? (
            <Text className="font-body-medium text-xs text-primary-600">{tr('masjids_use_my_location', language)}</Text>
          ) : null}
        </TouchableOpacity>
        {geoError ? (
          <Text className="font-body text-xs text-gold-500 mb-2">{tr('masjids_geo_error', language)}</Text>
        ) : null}

        {!isSearch ? (
          <View className="flex-row bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl overflow-hidden">
            {RADIUS_OPTIONS.map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => setRadius(r)}
                className={`flex-1 items-center py-2 ${radius === r ? 'bg-primary-600' : ''}`}
              >
                <Text className={`font-body-medium text-xs ${radius === r ? 'text-white' : 'text-ink-600 dark:text-ink-300'}`}>
                  {r} km
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>

      {isError && masjids.length === 0 ? (
        <Text className="font-body text-sm text-red-500 px-4 mb-2">{tr('masjids_load_error', language)}</Text>
      ) : null}
      {isLoading && masjids.length === 0 ? (
        <Text className="font-body text-sm text-ink-400 px-4">{tr('loading', language)}</Text>
      ) : null}

      <FlatList
        data={masjids}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 128 }}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={
          !isLoading && !isError ? (
            <View className="items-center py-10 px-6">
              <Ionicons name="business-outline" size={32} color="#7d879a" />
              <Text className="font-body text-sm text-ink-400 text-center mt-3">
                {isSearch ? tr('masjids_none_search', language) : tr('masjids_none_nearby', language)}
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }: { item: Masjid }) => <MasjidRow masjid={item} />}
      />
    </Screen>
  );
}

function MasjidRow({ masjid }: { masjid: Masjid }) {
  const { language } = useApp();
  const name = language === 'bn' && masjid.name_bn ? masjid.name_bn : masjid.name;
  const jamah = JAMAH_PRAYERS.filter((p) => masjid.jamah?.[p]);

  return (
    <TouchableOpacity
      onPress={() => router.push(`/more/masjids/${masjid.id}` as never)}
      className="bg-white dark:bg-ink-900 border border-ink-100 dark:border-ink-800 rounded-xl p-3.5 mb-2.5"
    >
      <View className="flex-row items-start">
        <View className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/30 items-center justify-center">
          <Ionicons name="business" size={18} color={Palette.primary[500]} />
        </View>
        <View className="flex-1 ml-3">
          <Text className="font-body-semibold text-sm text-ink-900 dark:text-white" numberOfLines={1}>{name}</Text>
          {masjid.address || masjid.city ? (
            <Text className="font-body text-xs text-ink-400 mt-0.5" numberOfLines={1}>
              {[masjid.address, masjid.city].filter(Boolean).join(', ')}
            </Text>
          ) : null}
        </View>
        {masjid.distance_km != null ? (
          <View className="bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-full ml-2">
            <Text className="font-body-medium text-[11px] text-primary-700 dark:text-primary-300">
              {formatDistance(masjid.distance_km)}
            </Text>
          </View>
        ) : null}
      </View>

      {jamah.length > 0 ? (
        <View className="flex-row flex-wrap mt-2.5 -mx-0.5">
          {jamah.map((p) => (
            <View key={p} className="flex-row items-baseline bg-ink-50 dark:bg-ink-800 rounded-md px-2 py-1 mx-0.5 mb-1">
              <Text className="font-body text-[10px] text-ink-400 mr-1">{prayerLabel(p, language)}</Text>
              <Text className="font-body-semibold text-xs text-ink-900 dark:text-white">{masjid.jamah[p]}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text className="font-body text-xs text-ink-300 dark:text-ink-600 mt-2 italic">{tr('masjid_no_jamah', language)}</Text>
      )}

      {masjid.jamah_updated_at ? (
        <Text className="font-body text-[10px] text-ink-300 dark:text-ink-600 mt-1.5">
          {tr('masjid_last_updated', language)}: {relativeTime(masjid.jamah_updated_at)}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}
