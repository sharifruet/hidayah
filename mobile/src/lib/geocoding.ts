import * as Location from 'expo-location';

import { tr } from '../data/translations';
import type { LanguageCode } from './constants';

export interface GeocodedPlace {
  lat: number;
  lng: number;
  name: string;
  district?: string;
  division?: string;
  /** True when the OS geocoder gave no name and `name` is our generic fallback label. */
  unnamed?: boolean;
}

function placeName(place: Location.LocationGeocodedAddress): string | null {
  return place.city || place.subregion || place.region || place.name || null;
}

/**
 * Reverse-geocode coordinates to a human-readable place name, worldwide (uses the OS's native
 * geocoder). Falls back to a generic label in `language` when the OS knows no name.
 */
export async function reverseGeocode(lat: number, lng: number, language: LanguageCode = 'en'): Promise<GeocodedPlace> {
  try {
    const [place] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
    if (!place) return { lat, lng, name: tr('location_current', language), unnamed: true };
    const name = placeName(place);
    return {
      lat,
      lng,
      name: name ?? tr('location_unknown', language),
      unnamed: !name,
      district: place.subregion ?? undefined,
      division: place.region ?? undefined,
    };
  } catch {
    return { lat, lng, name: tr('location_current', language), unnamed: true };
  }
}

/** Forward-geocode a free-text place/city name to coordinates, worldwide. */
export async function searchPlace(query: string, language: LanguageCode = 'en'): Promise<GeocodedPlace[]> {
  try {
    const results = await Location.geocodeAsync(query);
    const withNames = await Promise.all(
      results.slice(0, 8).map(async (r) => reverseGeocode(r.latitude, r.longitude, language))
    );
    return withNames;
  } catch {
    return [];
  }
}

export async function getCurrentCoords(): Promise<{ lat: number; lng: number } | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;
  const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  return { lat: position.coords.latitude, lng: position.coords.longitude };
}
