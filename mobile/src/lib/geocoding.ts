import * as Location from 'expo-location';

export interface GeocodedPlace {
  lat: number;
  lng: number;
  name: string;
  district?: string;
  division?: string;
}

function formatPlaceName(place: Location.LocationGeocodedAddress): string {
  return place.city || place.subregion || place.region || place.name || 'Unknown location';
}

/** Reverse-geocode coordinates to a human-readable place name, worldwide (uses the OS's native geocoder). */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodedPlace> {
  try {
    const [place] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
    if (!place) return { lat, lng, name: 'Current location' };
    return {
      lat,
      lng,
      name: formatPlaceName(place),
      district: place.subregion ?? undefined,
      division: place.region ?? undefined,
    };
  } catch {
    return { lat, lng, name: 'Current location' };
  }
}

/** Forward-geocode a free-text place/city name to coordinates, worldwide. */
export async function searchPlace(query: string): Promise<GeocodedPlace[]> {
  try {
    const results = await Location.geocodeAsync(query);
    const withNames = await Promise.all(
      results.slice(0, 8).map(async (r) => reverseGeocode(r.latitude, r.longitude))
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
