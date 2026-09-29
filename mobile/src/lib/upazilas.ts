/**
 * Bundled list of Bangladesh's upazilas (Wikidata, CC0 — see backend/src/database/data/
 * upazilas.json), so location search works offline and reaches below district level:
 * prayer times differ by a few minutes across a district.
 */
import UPAZILAS from '../data/upazilas.json';
import { DEFAULT_LOCATION, SUPPORTED_LANGUAGES, type LanguageCode } from './constants';
import { tr } from '../data/translations';

export interface Upazila {
  name: string;
  name_bn: string;
  district: string;
  district_bn: string;
  division: string;
  division_bn: string;
  lat: number;
  lng: number;
}

const LIST = UPAZILAS as Upazila[];

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ\s'’.-]/g, '');

/**
 * Upazilas whose name (or district, as a fallback) matches `query`, in English or Bangla.
 * Name matches rank above district matches; prefix matches above substring matches.
 */
export function searchUpazilas(query: string, limit = 20): Upazila[] {
  const q = norm(query.trim());
  if (q.length < 2) return [];
  const scored: { u: Upazila; score: number }[] = [];
  for (const u of LIST) {
    const names = [norm(u.name), norm(u.name_bn)];
    const districts = [norm(u.district), norm(u.district_bn)];
    let score = 0;
    if (names.some((n) => n === q)) score = 4;
    else if (names.some((n) => n.startsWith(q))) score = 3;
    else if (names.some((n) => n.includes(q))) score = 2;
    else if (districts.some((d) => d.startsWith(q))) score = 1;
    if (score) scored.push({ u, score });
  }
  return scored.sort((a, b) => b.score - a.score || a.u.name.localeCompare(b.u.name)).slice(0, limit).map((s) => s.u);
}

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const rad = Math.PI / 180;
  const dLat = (bLat - aLat) * rad;
  const dLng = (bLng - aLng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * rad) * Math.cos(bLat * rad) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

/** The upazila whose centre is closest to a point, if within `maxKm` (i.e. inside Bangladesh). */
export function nearestUpazila(lat: number, lng: number, maxKm = 30): Upazila | null {
  let best: Upazila | null = null;
  let bestKm = Infinity;
  for (const u of LIST) {
    const d = distanceKm(lat, lng, u.lat, u.lng);
    if (d < bestKm) {
      bestKm = d;
      best = u;
    }
  }
  return best && bestKm <= maxKm ? best : null;
}

/** Display fields for a location record in the UI language. */
export function upazilaLabels(u: Upazila, language: LanguageCode) {
  const bn = language === 'bn';
  return { name: bn ? u.name_bn : u.name, district: bn ? u.district_bn : u.district, division: bn ? u.division_bn : u.division };
}

interface NamedLocation {
  lat: number;
  lng: number;
  name: string;
  district?: string;
  division?: string;
}

/**
 * Location names are saved in the language they were picked in. When the UI language
 * changes, re-label a saved upazila (or the built-in default, Dhaka) in the new language.
 * Returns null when there's nothing to change (e.g. a place named by the OS geocoder).
 */
export function relabelLocation<T extends NamedLocation>(loc: T, language: LanguageCode): T | null {
  let next: Pick<NamedLocation, 'name' | 'district' | 'division'> | null = null;
  const dhakaNames = SUPPORTED_LANGUAGES.map((l) => tr('location_dhaka', l));
  if (loc.lat === DEFAULT_LOCATION.lat && loc.lng === DEFAULT_LOCATION.lng && dhakaNames.includes(loc.name)) {
    const dhaka = tr('location_dhaka', language);
    next = { name: dhaka, district: dhaka, division: dhaka };
  } else {
    const u = nearestUpazila(loc.lat, loc.lng);
    if (u && (loc.name === u.name || loc.name === u.name_bn)) next = upazilaLabels(u, language);
  }
  if (!next || (next.name === loc.name && next.district === loc.district && next.division === loc.division)) return null;
  return { ...loc, ...next };
}
