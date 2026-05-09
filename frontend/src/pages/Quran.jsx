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
  const [activeTab, setActiveTab] = useState('surahs'); // 'surahs' | 'juz'

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
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {language === 'bn' ? 'আল-কুরআন' : 'Al-Qur\'an'}
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {language === 'bn' ? '১১৪টি সুরা' : '114 Surahs'}
            </p>
          </div>
          <div className="flex gap-2">
            {streak > 0 && (
              <div className="flex flex-col items-center bg-orange-50 dark:bg-orange-900/20 rounded-xl px-3 py-2 text-center">
                <span className="text-lg">🔥</span>
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{streak}</span>
                <span className="text-[10px] text-orange-500 dark:text-orange-400">
                  {language === 'bn' ? 'দিন' : 'day'}
                </span>
              </div>
            )}
            <Link
              to="/bookmarks"
              className="flex flex-col items-center bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2 text-center"
            >
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="text-[10px] text-green-600 dark:text-green-400 mt-0.5">
                {language === 'bn' ? 'বুকমার্ক' : 'Marks'}
              </span>
            </Link>
          </div>
        </div>

        {/* Khatm progress */}
        <div className="mb-5 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {language === 'bn' ? 'খতম অগ্রগতি' : 'Khatm Progress'}
            </p>
            <p className="text-xs font-bold text-green-600 dark:text-green-400">{khatmPct}%</p>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${khatmPct}%` }} />
          </div>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
            {readCount}/114 {language === 'bn' ? 'সুরা সম্পন্ন' : 'surahs completed'}
          </p>
        </div>

        {/* Resume banner */}
        {lastRead && (
          <Link
            to={`/quran/${lastRead.surah}/${lastRead.ayah}`}
            className="flex items-center gap-3 mb-5 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                {language === 'bn' ? 'পড়া চালিয়ে যান' : 'Continue reading'}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {language === 'bn'
                  ? `সুরা ${lastRead.surah}, আয়াত ${lastRead.ayah}`
                  : `Surah ${lastRead.surah}, Ayah ${lastRead.ayah}`}
              </p>
            </div>
          </Link>
        )}

        {/* Tabs: Surahs / Juz */}
        <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('surahs')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'surahs'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {language === 'bn' ? 'সুরা' : 'Surahs'}
          </button>
          <button
            onClick={() => setActiveTab('juz')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'juz'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {language === 'bn' ? 'পারা' : 'Juz'}
          </button>
        </div>

        {activeTab === 'juz' ? (
          <div className="text-center py-8">
            <Link
              to="/quran/juz"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              {language === 'bn' ? 'পারা নেভিগেটর দেখুন' : 'Open Juz Navigator'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="relative mb-4">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                placeholder={language === 'bn' ? 'সুরা খুঁজুন...' : 'Search surahs...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Quick nav */}
            <div className="mb-4 flex gap-2">
              <Link
                to="/quran/search"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {language === 'bn' ? 'আয়াত অনুসন্ধান' : 'Search ayahs'}
              </Link>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              {isLoading && <Loading message={language === 'bn' ? 'লোড হচ্ছে...' : 'Loading surahs...'} />}
              {error && <ErrorMessage error={error} onRetry={refetch} />}
              {!isLoading && !error && (
                <SurahList surahs={surahs} language={language} searchTerm={searchTerm} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
