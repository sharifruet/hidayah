import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { useLocation } from '../hooks/useLocation.js';
import LocationMap from '../components/map/LocationMap.jsx';
import LocationSearch from '../components/location/LocationSearch.jsx';
import PrayerTimesCard from '../components/prayer/PrayerTimesCard.jsx';
import { format } from 'date-fns';

export default function PrayerTimes() {
  const { location, updateLocation, updateMethod, language } = useApp();
  const { getByCoordinates, getCurrentLocation, loading: locationLoading } = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mapCenter, setMapCenter] = useState([location.lat, location.lng]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'bn' ? 'সালাতের সময়' : 'Prayer Times'}
          </h1>
          <p className="mt-2 text-gray-600">
            {language === 'bn' ? 'অবস্থান এবং তারিখ নির্বাচন করুন' : 'Select a location and date to view prayer times'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'bn' ? 'তারিখ নির্বাচন করুন' : 'Select Date'}
              </label>
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                onClick={getCurrentLocation}
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
              height="400px"
            />

            {location.name && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow">
                <p className="font-semibold">{location.name}</p>
                {location.district && <p className="text-sm text-gray-600">{location.district}, {location.division}</p>}
              </div>
            )}
          </div>

          <div>
            <PrayerTimesCard
              date={selectedDate}
              onMethodChange={updateMethod}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
