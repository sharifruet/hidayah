import apiClient from '../api';

export const JAMAH_PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'jumuah'] as const;
export type JamahPrayer = (typeof JAMAH_PRAYERS)[number];

/** { fajr: 'HH:MM', ... } — only prayers with a saved time are present */
export type JamahTimes = Partial<Record<JamahPrayer, string>>;

export interface Masjid {
  id: number;
  name: string;
  name_bn?: string | null;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  latitude: number;
  longitude: number;
  phone?: string | null;
  description?: string | null;
  status: 'active' | 'hidden';
  created_at: string;
  updated_at: string;
  /** Present when the request included lat/lng */
  distance_km?: number;
  jamah: JamahTimes;
  jamah_updated_at: string | null;
}

export interface MasjidListResponse {
  masjids: Masjid[];
  total_results: number;
  radius_km?: number;
}

export interface CreateMasjidInput {
  name: string;
  name_bn?: string;
  address?: string;
  city?: string;
  district?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  description?: string;
  jamah?: JamahTimes;
}

/** null clears that prayer's jamah time */
export type JamahUpdate = Partial<Record<JamahPrayer, string | null>>;

export const masjidsService = {
  nearby: (lat: number, lng: number, radiusKm = 5, limit = 30) =>
    apiClient.get<MasjidListResponse, MasjidListResponse>('/masjids/nearby', {
      params: { lat, lng, radius_km: radiusKm, limit },
    }),

  search: (q: string, coords?: { lat: number; lng: number }, limit = 30) =>
    apiClient.get<MasjidListResponse, MasjidListResponse>('/masjids', {
      params: { q, limit, ...(coords ?? {}) },
    }),

  get: (id: string | number, coords?: { lat: number; lng: number }) =>
    apiClient.get<Masjid, Masjid>(`/masjids/${id}`, { params: coords ?? {} }),

  create: (data: CreateMasjidInput) => apiClient.post<Masjid, Masjid>('/masjids', data),

  updateJamah: (id: string | number, times: JamahUpdate) =>
    apiClient.put<Masjid, Masjid>(`/masjids/${id}/jamah`, times),
};
