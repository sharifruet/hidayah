import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useLocation } from '../hooks/useLocation.js';
import LocationMap from '../components/map/LocationMap.jsx';
import LocationSearch from '../components/location/LocationSearch.jsx';
import PrayerTimesCard from '../components/prayer/PrayerTimesCard.jsx';
import ForbiddenTimesCard from '../components/prayer/ForbiddenTimesCard.jsx';
import { usePrayerTimes } from '../hooks/usePrayerTimes.js';
import { format } from 'date-fns';
import { tr } from '../i18n/translations.js';
import { placeName, placeRegion, toAppLocation } from '../utils/place.js';

export default function PrayerTimes() {
  const { location, method, updateLocation, updateMethod, language } = useApp();
  const { getByCoordinates, getCurrentLocation, loading: locationLoading, error: locationError } = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mapCenter, setMapCenter] = useState([location.lat, location.lng]);
  const { data: dayData } = usePrayerTimes(location.lat, location.lng, selectedDate, method);
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const applyLocation = (locationData) => {
    if (!locationData) return;
    updateLocation(toAppLocation(locationData));
    setMapCenter([locationData.latitude, locationData.longitude]);
  };

  const handleMapClick = async (lat, lng) => {
    applyLocation(await getByCoordinates(lat, lng));
  };

  const handleUseCurrentLocation = async () => {
    try {
      applyLocation(await getCurrentLocation());
    } catch {
      // the hook exposes a localized `error`, shown below the button
    }
  };

  const handleLocationSelect = (locationData) => {
    updateLocation(locationData);
    setMapCenter([locationData.lat, locationData.lng]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {tr('pr_title', language)}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {tr('pr_subtitle', language)}
          </p>
        </div>

        {/* Calendar link card */}
        <div className="mb-6">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {tr('pr_calendar_card_title', language)}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {tr('pr_calendar_card_body', language)}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/calendar?view=monthly&year=${selectedDate.getFullYear()}&month=${selectedDate.getMonth() + 1}`}
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700"
              >
                {tr('pr_this_month_calendar', language)}
              </Link>
              <Link
                to={`/calendar?view=date-range&startDate=${format(selectedDate, 'yyyy-MM-dd')}&endDate=${format(selectedDate, 'yyyy-MM-dd')}`}
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {tr('pr_calendar_for_date', language)}
              </Link>
            </div>
          </div>
        </div>

        {/* Nearby masjids link card */}
        <div className="mb-6">
          <Link
            to="/masjids"
            className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-green-600 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-50 dark:bg-green-900/30 text-primary-700 dark:text-green-400 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{tr('masjid_nearby_link', language)}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{tr('masjid_nearby_link_sub', language)}</p>
              </div>
            </div>
            <svg className="w-5 h-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left column — controls + map */}
          <div>
            <div className="mb-4">
              <label htmlFor="prayer-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {tr('pr_select_date', language)}
              </label>
              <input
                id="prayer-date"
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="mb-4">
              <LocationSearch
                onLocationSelect={handleLocationSelect}
                onMapCenter={setMapCenter}
              />
            </div>

            <div className="mb-4">
              <button
                onClick={handleUseCurrentLocation}
                disabled={locationLoading}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {locationLoading ? tr('pr_getting_location', language) : tr('pr_use_current_location', language)}
              </button>
              {locationError && (
                <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">{locationError}</p>
              )}
            </div>

            <LocationMap
              center={mapCenter}
              onLocationSelect={handleMapClick}
              selectedLocation={location}
              height="400px"
            />

            {placeName(location, language) && (
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{placeName(location, language)}</p>
                {placeRegion(location, language) && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{placeRegion(location, language)}</p>
                )}
              </div>
            )}
          </div>

          {/* Right column — prayer times card */}
          <div>
            <PrayerTimesCard
              date={selectedDate}
              onMethodChange={updateMethod}
            />
            <div className="mt-6">
              <ForbiddenTimesCard times={dayData?.times} isToday={isToday} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
