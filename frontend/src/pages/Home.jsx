import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useLocation } from '../hooks/useLocation.js';
import LocationMap from '../components/map/LocationMap.jsx';
import LocationSearch from '../components/location/LocationSearch.jsx';
import PrayerTimesCard from '../components/prayer/PrayerTimesCard.jsx';
import FastingTimesCard from '../components/fasting/FastingTimesCard.jsx';
import MonthlyCalendar from '../components/calendar/MonthlyCalendar.jsx';

export default function Home() {
  const { location, updateLocation, updateMethod, updateSehriMargin, language } = useApp();
  const { getByCoordinates, getCurrentLocation, loading: locationLoading } = useLocation();
  const [mapCenter, setMapCenter] = useState([location.lat, location.lng]);
  const today = new Date();

  const handleMapClick = async (lat, lng) => {
    const locationData = await getByCoordinates(lat, lng);
    if (locationData) {
      updateLocation({
        lat: locationData.latitude,
        lng: locationData.longitude,
        name: locationData.name,
        district: locationData.district,
        division: locationData.division
      });
      setMapCenter([locationData.latitude, locationData.longitude]);
    }
  };

  const handleLocationSelect = (locationData) => {
    updateLocation(locationData);
    setMapCenter([locationData.lat, locationData.lng]);
  };

  const handleGetCurrentLocation = async () => {
    try {
      const locationData = await getCurrentLocation();
      if (locationData) {
        updateLocation({
          lat: locationData.latitude,
          lng: locationData.longitude,
          name: locationData.name,
          district: locationData.district,
          division: locationData.division
        });
        setMapCenter([locationData.latitude, locationData.longitude]);
      }
    } catch (error) {
      console.error('Failed to get current location:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'bn' ? 'সালাত ও সাওমের সময়' : 'Salat & Saom Timing'}
          </h1>
          <p className="mt-2 text-gray-600">
            {language === 'bn' ? 'মানচিত্রে একটি অবস্থান নির্বাচন করুন বা অনুসন্ধান করুন' : 'Select a location on the map or search to view prayer and fasting times'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="mb-4 space-y-2">
              <LocationSearch
                onLocationSelect={handleLocationSelect}
                onMapCenter={setMapCenter}
              />
              <button
                onClick={handleGetCurrentLocation}
                disabled={locationLoading}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {locationLoading
                  ? (language === 'bn' ? 'অবস্থান পাওয়া হচ্ছে...' : 'Getting location...')
                  : (language === 'bn' ? 'বর্তমান অবস্থান ব্যবহার করুন' : 'Use Current Location')
                }
              </button>
            </div>
            <LocationMap
              center={mapCenter}
              onLocationSelect={handleMapClick}
              selectedLocation={location}
              height="500px"
            />
            {location.name && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow">
                <p className="font-semibold">{location.name}</p>
                {location.district && <p className="text-sm text-gray-600">{location.district}, {location.division}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <PrayerTimesCard
              onMethodChange={updateMethod}
            />
            <FastingTimesCard
              onMethodChange={updateMethod}
              onSehriMarginChange={updateSehriMargin}
            />
            <MonthlyCalendar
              year={today.getFullYear()}
              month={today.getMonth() + 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
