import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext.jsx';
import { fetchSurahs } from '../services/quranService.js';
import { loadLastRead } from '../services/quranService.js';
import { getKhatmPercent, getReadSurahs, getStreak } from '../services/progressService.js';
import SurahList from '../components/quran/SurahList.jsx';
import Loading from '../components/common/Loading.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';
import { Link } from 'react-router-dom';

export default function Quran() {
  const { language } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['quran-surahs'],
    queryFn: fetchSurahs,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const lastRead = loadLastRead();
  const surahs = data?.data || [];
  const khatmPct = getKhatmPercent();
  const readCount = getReadSurahs().size;
  const streak = getStreak();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {language === 'bn' ? 'আল-কুরআন' : 'Al-Qur\'an'}
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {language === 'bn' ? '১১৪টি সুরা' : '114 Surahs'}
            </p>
          </div>

          {/* Compact icon chips */}
          <div className="flex gap-2 flex-shrink-0">

            {/* Streak */}
            {streak > 0 && (
              <div className="flex flex-col items-center bg-orange-50 dark:bg-orange-900/20 rounded-xl px-3 py-2 text-center">
                <span className="text-lg leading-none">🔥</span>
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400 mt-0.5">{streak}</span>
                <span className="text-[10px] text-orange-500 dark:text-orange-400">
                  {language === 'bn' ? 'দিন' : 'day'}
                </span>
              </div>
            )}

            {/* Khatm progress */}
            <div className="flex flex-col items-center bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2 text-center">
              {/* Calendar / day icon */}
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 leading-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-bold text-green-600 dark:text-green-400 mt-0.5">{khatmPct}%</span>
              <span className="text-[10px] text-green-500 dark:text-green-400">
                {language === 'bn' ? 'খতম' : 'khatm'}
              </span>
            </div>

            {/* Continue reading */}
            {lastRead ? (
              <Link
                to={`/quran/${lastRead.surah}/${lastRead.ayah}`}
                className="flex flex-col items-center bg-blue-50 dark:bg-blue-900/20 rounded-xl px-3 py-2 text-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                title={language === 'bn' ? `সুরা ${lastRead.surah}, আয়াত ${lastRead.ayah}` : `Surah ${lastRead.surah}, Ayah ${lastRead.ayah}`}
              >
                {/* Bookmark icon */}
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 leading-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">{lastRead.surah}</span>
                <span className="text-[10px] text-blue-500 dark:text-blue-400">
                  {language === 'bn' ? 'চালিয়ে যান' : 'resume'}
                </span>
              </Link>
            ) : (
              <Link
                to="/bookmarks"
                className="flex flex-col items-center bg-blue-50 dark:bg-blue-900/20 rounded-xl px-3 py-2 text-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 leading-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className="text-[10px] text-blue-500 dark:text-blue-400 mt-0.5">
                  {language === 'bn' ? 'বুকমার্ক' : 'marks'}
                </span>
              </Link>
            )}

          </div>
        </div>

        {/* Single toolbar row: tabs + search surah + search ayahs */}
        <div className="flex items-center gap-2 mb-4">

          {/* Surah / Para tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 shrink-0">
            <span className="px-3 py-1.5 text-sm font-medium rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm">
              {language === 'bn' ? 'সুরা' : 'Surah'}
            </span>
            <Link
              to="/quran/juz"
              className="px-3 py-1.5 text-sm font-medium rounded-md transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {language === 'bn' ? 'পারা' : 'Para'}
            </Link>
          </div>

          {/* Search surah */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder={language === 'bn' ? 'সুরা খুঁজুন...' : 'Search surah...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Search ayahs */}
          <Link
            to="/quran/search"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:inline">{language === 'bn' ? 'আয়াত অনুসন্ধান' : 'Search ayahs'}</span>
          </Link>

        </div>

        {/* Surah list */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {isLoading && <Loading message={language === 'bn' ? 'লোড হচ্ছে...' : 'Loading surahs...'} />}
          {error && <ErrorMessage error={error} onRetry={refetch} />}
          {!isLoading && !error && (
            <SurahList surahs={surahs} language={language} searchTerm={searchTerm} />
          )}
        </div>
      </div>
    </div>
  );
}
