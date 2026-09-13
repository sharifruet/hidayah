import { useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getCurrentCoords, reverseGeocode, searchPlace, type GeocodedPlace } from '../../lib/geocoding';
import { useApp } from '../../context/AppContext';
import { tr } from '../../data/translations';

export function LocationPickerModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { updateLocation, language } = useApp();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodedPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  async function runSearch(text: string) {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const found = await searchPlace(text.trim());
    setResults(found);
    setLoading(false);
  }

  function choose(place: GeocodedPlace) {
    updateLocation({ lat: place.lat, lng: place.lng, name: place.name, district: place.district, division: place.division });
    setQuery('');
    setResults([]);
    onClose();
  }

  async function useCurrentLocation() {
    setLocating(true);
    const coords = await getCurrentCoords();
    if (coords) {
      const place = await reverseGeocode(coords.lat, coords.lng);
      choose(place);
    }
    setLocating(false);
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View className="flex-1 bg-white dark:bg-ink-950" style={{ paddingTop: insets.top + 8 }}>
        <View className="flex-row items-center justify-between px-4 mb-4">
          <Text className="font-body-bold text-lg text-ink-900 dark:text-white">{tr('prayer_change_location', language)}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#5b6579" />
          </TouchableOpacity>
        </View>

        <View className="px-4 mb-3">
          <View className="flex-row items-center bg-ink-50 dark:bg-ink-900 rounded-xl px-3 py-2.5">
            <Ionicons name="search" size={16} color="#7d879a" />
            <TextInput
              value={query}
              onChangeText={runSearch}
              placeholder={tr('prayer_search_place', language)}
              placeholderTextColor="#7d879a"
              className="flex-1 ml-2 font-body text-ink-900 dark:text-white"
              autoCapitalize="words"
            />
            {loading ? <ActivityIndicator size="small" /> : null}
          </View>
        </View>

        <View className="px-4 mb-3">
          <TouchableOpacity
            onPress={useCurrentLocation}
            disabled={locating}
            className="flex-row items-center bg-primary-50 dark:bg-primary-900/30 rounded-xl px-3 py-3"
          >
            {locating ? (
              <ActivityIndicator size="small" color="#15805a" />
            ) : (
              <Ionicons name="locate" size={18} color="#15805a" />
            )}
            <Text className="font-body-medium text-sm text-primary-700 dark:text-primary-300 ml-2">
              {tr('prayer_use_current_location', language)}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={results}
          keyExtractor={(item, idx) => `${item.lat}-${item.lng}-${idx}`}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => choose(item)}
              className="flex-row items-center py-3 border-b border-ink-100 dark:border-ink-800"
            >
              <Ionicons name="location-outline" size={16} color="#5b6579" />
              <View className="ml-2">
                <Text className="font-body-medium text-sm text-ink-900 dark:text-white">{item.name}</Text>
                {item.division ? (
                  <Text className="font-body text-xs text-ink-400">{item.division}</Text>
                ) : null}
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}
