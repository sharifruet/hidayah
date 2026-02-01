import { useState, useEffect, useRef } from 'react';
import { useLocation } from '../../hooks/useLocation.js';
import { useApp } from '../../context/AppContext.jsx';
import Loading from '../common/Loading.jsx';

export default function LocationSearch({ onLocationSelect = null, onMapCenter = null }) {
  const { search, loading, error } = useLocation();
  const { language } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) &&
          resultsRef.current && !resultsRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const searchResults = await search(searchQuery);
    setResults(searchResults);
    setShowResults(true);
  };

  const handleSelect = (location) => {
    setQuery(location.name || `${location.latitude}, ${location.longitude}`);
    setShowResults(false);

    if (onLocationSelect) {
      onLocationSelect({
        lat: location.latitude,
        lng: location.longitude,
        name: location.name,
        district: location.district,
        division: location.division
      });
    }

    if (onMapCenter) {
      onMapCenter([location.latitude, location.longitude]);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          placeholder={language === 'bn' ? 'অবস্থান খুঁজুন...' : 'Search location...'}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleSelect(result)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <div className="font-medium text-gray-900">{result.name}</div>
              {result.district && (
                <div className="text-sm text-gray-600">{result.district}, {result.division}</div>
              )}
              <div className="text-xs text-gray-500">
                {result.latitude.toFixed(4)}, {result.longitude.toFixed(4)}
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && query && results.length === 0 && !loading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center text-gray-500">
          {language === 'bn' ? 'কোন ফলাফল পাওয়া যায়নি' : 'No results found'}
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      )}
    </div>
  );
}
