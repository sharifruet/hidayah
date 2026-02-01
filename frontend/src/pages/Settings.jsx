import { useApp } from '../context/AppContext.jsx';
import { getMethods } from '../services/locationService.js';
import { useQuery } from '@tanstack/react-query';

export default function Settings() {
  const { location, method, sehriMargin, language, updateMethod, updateSehriMargin, toggleLanguage } = useApp();
  const { data: methodsData, isLoading } = useQuery({
    queryKey: ['methods'],
    queryFn: getMethods
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Configure your preferences</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calculation Method
            </label>
            {isLoading ? (
              <p className="text-gray-500">Loading methods...</p>
            ) : (
              <select
                value={method}
                onChange={(e) => updateMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {methodsData?.methods?.map((m) => (
                  <option key={m.code} value={m.code}>
                    {m.name} {m.is_default && '(Default)'}
                  </option>
                )) || (
                  <>
                    <option value="karachi">Karachi</option>
                    <option value="mwl">MWL</option>
                    <option value="isna">ISNA</option>
                    <option value="umm_al_qura">Umm Al-Qura</option>
                    <option value="hanafi">Hanafi</option>
                  </>
                )}
              </select>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Select the calculation method for prayer times
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sehri Margin (minutes)
            </label>
            <input
              type="number"
              min="5"
              max="15"
              value={sehriMargin}
              onChange={(e) => updateSehriMargin(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Minutes before Fajr for Sehri end time (5-15 minutes)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Switch to {language === 'en' ? 'Bengali' : 'English'}
            </button>
            <p className="mt-1 text-sm text-gray-500">
              Current language: {language === 'en' ? 'English' : 'বাংলা (Bengali)'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Location
            </label>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="font-semibold">{location.name || 'Unknown'}</p>
              {location.district && (
                <p className="text-sm text-gray-600">{location.district}, {location.division}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
