import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, SectionList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getCurrentCoords, reverseGeocode, searchPlace, type GeocodedPlace } from '../../lib/geocoding';
import { nearestUpazila, searchUpazilas, upazilaLabels, type Upazila } from '../../lib/upazilas';
import { useApp } from '../../context/AppContext';
import { tr } from '../../data/translations';

type Row = { kind: 'upazila'; u: Upazila } | { kind: 'place'; place: GeocodedPlace };

export function LocationPickerModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { updateLocation, language } = useApp();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);
  const [places, setPlaces] = useState<GeocodedPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const searchSeq = useRef(0);

  // Upazilas are bundled, so they match instantly (and offline); the OS geocoder is only
  // asked (debounced) for anything else — other towns, or places outside Bangladesh.
  function onChangeQuery(text: string) {
    setQuery(text);
    setUpazilas(searchUpazilas(text));
  }

  useEffect(() => {
    const q = query.trim();
    const seq = ++searchSeq.current;
    if (q.length < 3) {
      setPlaces([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      const found = await searchPlace(q, language);
      if (seq === searchSeq.current) {
        setPlaces(found);
        setLoading(false);
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [query, language]);

  function reset() {
    setQuery('');
    setUpazilas([]);
    setPlaces([]);
  }

  function chooseUpazila(u: Upazila) {
    const l = upazilaLabels(u, language);
    updateLocation({ lat: u.lat, lng: u.lng, name: l.name, district: l.district, division: l.division });
    reset();
    onClose();
  }

  function choosePlace(place: GeocodedPlace) {
    updateLocation({ lat: place.lat, lng: place.lng, name: place.name, district: place.district, division: place.division });
    reset();
    onClose();
  }

  async function useCurrentLocation() {
    setLocating(true);
    try {
      const coords = await getCurrentCoords();
      if (!coords) return;
      // Keep the exact GPS point for the times, but name it after the upazila it's in.
      const u = nearestUpazila(coords.lat, coords.lng);
      if (u) {
        const l = upazilaLabels(u, language);
        choosePlace({ lat: coords.lat, lng: coords.lng, name: l.name, district: l.district, division: l.division });
      } else {
        choosePlace(await reverseGeocode(coords.lat, coords.lng, language));
      }
    } finally {
      setLocating(false);
    }
  }

  const sections: { title: string; data: Row[] }[] = [];
  if (upazilas.length) sections.push({ title: tr('location_upazilas', language), data: upazilas.map((u) => ({ kind: 'upazila', u })) });
  if (places.length) sections.push({ title: tr('location_other_places', language), data: places.map((place) => ({ kind: 'place', place })) });

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View className="flex-1 bg-white dark:bg-ink-950" style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center justify-between px-4 mb-4">
          <Text className="font-body-bold text-lg text-ink-900 dark:text-white">{tr('prayer_change_location', language)}</Text>
          <TouchableOpacity onPress={onClose} accessibilityRole="button" accessibilityLabel={tr('close', language)}>
            <Ionicons name="close" size={24} color="#5b6579" />
          </TouchableOpacity>
        </View>

        <View className="px-4 mb-3">
          <View className="flex-row items-center bg-ink-50 dark:bg-ink-900 rounded-xl px-3 py-2.5">
            <Ionicons name="search" size={16} color="#7d879a" />
            <TextInput
              value={query}
              onChangeText={onChangeQuery}
              placeholder={tr('prayer_search_place', language)}
              placeholderTextColor="#7d879a"
              className="flex-1 ml-2 font-body text-ink-900 dark:text-white"
              autoCapitalize="words"
              autoCorrect={false}
            />
            {loading ? <ActivityIndicator size="small" /> : null}
          </View>
          <Text className="font-body text-[11px] text-ink-400 mt-1.5">{tr('location_search_hint', language)}</Text>
        </View>

        <View className="px-4 mb-3">
          <TouchableOpacity
            onPress={useCurrentLocation}
            disabled={locating}
            className="flex-row items-center bg-primary-50 dark:bg-primary-900/30 rounded-xl px-3 py-3"
          >
            {locating ? <ActivityIndicator size="small" color="#15805a" /> : <Ionicons name="locate" size={18} color="#15805a" />}
            <Text className="font-body-medium text-sm text-primary-700 dark:text-primary-300 ml-2">
              {tr('prayer_use_current_location', language)}
            </Text>
          </TouchableOpacity>
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(row, idx) => (row.kind === 'upazila' ? `u-${row.u.district}-${row.u.name}` : `p-${row.place.lat}-${row.place.lng}-${idx}`)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <Text className="font-body-semibold text-xs uppercase tracking-wider text-ink-400 mt-3 mb-1">{section.title}</Text>
          )}
          ListEmptyComponent={
            query.trim().length >= 3 && !loading ? (
              <Text className="font-body text-sm text-ink-400 text-center mt-6">{tr('location_no_results', language)}</Text>
            ) : null
          }
          renderItem={({ item }) => {
            const title = item.kind === 'upazila' ? upazilaLabels(item.u, language).name : item.place.name;
            const sub =
              item.kind === 'upazila'
                ? `${upazilaLabels(item.u, language).district}, ${upazilaLabels(item.u, language).division}`
                : item.place.division ?? '';
            return (
              <TouchableOpacity
                onPress={() => (item.kind === 'upazila' ? chooseUpazila(item.u) : choosePlace(item.place))}
                className="flex-row items-center py-3 border-b border-ink-100 dark:border-ink-800"
              >
                <Ionicons name={item.kind === 'upazila' ? 'location' : 'location-outline'} size={16} color={item.kind === 'upazila' ? '#15805a' : '#5b6579'} />
                <View className="ml-2 flex-1">
                  <Text className="font-body-medium text-sm text-ink-900 dark:text-white">{title}</Text>
                  {sub ? <Text className="font-body text-xs text-ink-400">{sub}</Text> : null}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Modal>
  );
}
