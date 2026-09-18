import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext.jsx';
import { tr } from '../i18n/translations.js';
import { getNearbyMasjids, searchMasjids } from '../services/masjidService.js';
import MasjidMap from '../components/masjid/MasjidMap.jsx';
import MasjidCard from '../components/masjid/MasjidCard.jsx';

const RADIUS_OPTIONS = [1, 2, 5, 10, 25];

export default function Masjids() {
  const { location, language } = useApp();
  // "Origin" is the point we search around: browser geolocation if granted,
  // otherwise the app's saved location (Dhaka by default).
  const [origin, setOrigin] = useState({ lat: location.lat, lng: location.lng, fromDevice: false });
  const [radius, setRadius] = useState(5);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [rawQ, setRawQ] = useState('');
  const [q, setQ] = useState('');
  const debounceRef = useRef(null);

  const handleSearchInput = useCallback((value) => {
    setRawQ(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setQ(value.trim()), 350);
  }, []);

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError(tr('masjids_geo_error', language));
      return;
    }
    setLocating(true);
    setGeoError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude, fromDevice: true });
        setLocating(false);
      },
      () => {
        setGeoError(tr('masjids_geo_error', language));
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [language]);

  const isSearch = q.length > 0;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['masjids', isSearch ? 'search' : 'nearby', origin.lat, origin.lng, radius, q],
    queryFn: () =>
      isSearch
        ? searchMasjids(q, { lat: origin.lat, lng: origin.lng, limit: 50 })
        : getNearbyMasjids(origin.lat, origin.lng, radius, 50),
    placeholderData: (prev) => prev,
    staleTime: 60 * 1000,
  });

  const masjids = data?.masjids ?? [];
  const userLocation = [origin.lat, origin.lng];
  const mapZoom = radius <= 2 ? 15 : radius <= 5 ? 13 : radius <= 10 ? 12 : 10;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tr('masjids_title', language)}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">{tr('masjids_subtitle', language)}</p>
          </div>
          <Link
            to="/masjids/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {tr('masjids_add', language)}
          </Link>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <button
              type="button"
              onClick={useMyLocation}
              disabled={locating}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                origin.fromDevice
                  ? 'bg-primary-50 dark:bg-green-900/30 border-primary-300 dark:border-green-700 text-primary-700 dark:text-green-400'
                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              } disabled:opacity-60`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v3m0 14v3M2 12h3m14 0h3" />
              </svg>
              {locating ? tr('masjids_locating', language) : tr('masjids_use_my_location', language)}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">{tr('masjids_within', language)}</span>
              <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                {RADIUS_OPTIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRadius(r)}
                    disabled={isSearch}
                    className={`px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                      radius === r && !isSearch
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                    } disabled:opacity-50`}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex-1">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={rawQ}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder={tr('masjids_search_placeholder', language)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          {geoError && <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">{geoError}</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Map */}
          <div className="lg:col-span-3">
            <MasjidMap
              center={userLocation}
              zoom={mapZoom}
              masjids={masjids}
              userLocation={userLocation}
              radiusKm={isSearch ? null : radius}
              height="480px"
            />
          </div>

          {/* List */}
          <div className="lg:col-span-2 space-y-3">
            {isLoading && (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                </div>
              ))
            )}

            {isError && (
              <p className="text-sm text-red-600 dark:text-red-400">{tr('masjids_load_error', language)}</p>
            )}

            {!isLoading && !isError && masjids.length === 0 && (
              <div className="text-center py-12 px-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-sm">{isSearch ? tr('masjids_none_search', language) : tr('masjids_none_nearby', language)}</p>
                {!isSearch && (
                  <Link to="/masjids/new" className="inline-block mt-3 text-sm font-medium text-primary-700 dark:text-green-400 hover:underline">
                    {tr('masjids_add', language)} →
                  </Link>
                )}
              </div>
            )}

            {masjids.map((m) => <MasjidCard key={m.id} masjid={m} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
