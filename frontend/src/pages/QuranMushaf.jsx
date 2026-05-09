import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext.jsx';
import { fetchMushafPage } from '../services/quranService.js';
import Loading from '../components/common/Loading.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

export default function QuranMushaf() {
  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const { language } = useApp();
  const [jumpInput, setJumpInput] = useState('');

  const pageNum = parseInt(pageNumber, 10);

  // No translations in mushaf mode — Arabic only
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['mushaf-page', pageNum],
    queryFn: () => fetchMushafPage(pageNum, []),
    enabled: !isNaN(pageNum) && pageNum >= 1 && pageNum <= 604,
    staleTime: 24 * 60 * 60 * 1000,
  });

  function goToPage(n) {
    navigate(`/quran/page/${Math.max(1, Math.min(604, n))}`);
  }

  function handleJump(e) {
    e.preventDefault();
    const n = parseInt(jumpInput, 10);
    if (!isNaN(n)) { goToPage(n); setJumpInput(''); }
  }

  const pageData = data?.data;

  if (isNaN(pageNum) || pageNum < 1 || pageNum > 604) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Invalid page number (1–604)</p>
          <Link to="/quran" className="text-green-700 dark:text-green-400 hover:underline">← Back to Qur'an</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6ef] dark:bg-gray-950 pb-16">

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-[#faf6ef]/95 dark:bg-gray-950/95 backdrop-blur border-b border-amber-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center gap-3">

          <Link
            to="/quran"
            className="text-green-800 dark:text-green-500 hover:text-green-600 flex-shrink-0"
            aria-label="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          {/* Prev page */}
          <button
            onClick={() => goToPage(pageNum - 1)}
            disabled={pageNum <= 1}
            className="text-green-800 dark:text-green-500 disabled:opacity-30"
            aria-label="Previous page"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Page / Juz info */}
          <div className="flex-1 text-center">
            <p className="text-sm font-semibold text-green-900 dark:text-green-400">
              {language === 'bn' ? `পৃষ্ঠা ${pageNum}` : `Page ${pageNum}`}
              {pageData && (
                <span className="font-normal text-green-700 dark:text-green-600 ml-2">
                  · {language === 'bn' ? `জুজ ${pageData.juz}` : `Juz ${pageData.juz}`}
                </span>
              )}
            </p>
          </div>

          {/* Next page */}
          <button
            onClick={() => goToPage(pageNum + 1)}
            disabled={pageNum >= 604}
            className="text-green-800 dark:text-green-500 disabled:opacity-30"
            aria-label="Next page"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Jump to page */}
          <form onSubmit={handleJump} className="flex items-center gap-1">
            <input
              type="number"
              min={1}
              max={604}
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              placeholder={language === 'bn' ? 'পৃষ্ঠা' : 'Page'}
              className="w-14 px-2 py-1 text-xs border border-amber-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-green-600"
              aria-label="Jump to page"
            />
            <button
              type="submit"
              className="text-xs px-2 py-1 bg-green-700 dark:bg-green-800 text-white rounded hover:bg-green-800"
            >
              {language === 'bn' ? 'যান' : 'Go'}
            </button>
          </form>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-5 pt-6">
        {isLoading && <Loading message={language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'} />}
        {error && <ErrorMessage error={error} onRetry={refetch} />}

        {pageData && !isLoading && (
          <div>
            {pageData.surahs.map((surah, surahIdx) => (
              <div key={surah.number} className={surahIdx > 0 ? 'mt-8' : ''}>

                {/* ── Surah header ─────────────────────────────────── */}
                {surah.ayahs[0]?.number === 1 && (
                  <div className="text-center mb-5">
                    {/* Decorative border frame */}
                    <div className="relative inline-block w-full">
                      {/* Corner ornaments */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-700 dark:border-green-600" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-700 dark:border-green-600" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-700 dark:border-green-600" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-700 dark:border-green-600" />

                      <div className="border border-green-600/40 dark:border-green-700/40 rounded px-6 py-4 bg-green-50/60 dark:bg-green-950/30">
                        <Link to={`/quran/${surah.number}`}>
                          <p
                            className="font-arabic text-4xl text-green-900 dark:text-green-300 leading-loose"
                            dir="rtl"
                            lang="ar"
                          >
                            {surah.name_ar}
                          </p>
                          <p className="text-sm font-medium text-green-800 dark:text-green-500 mt-1">
                            {surah.name_en}
                            <span className="mx-1.5 text-green-400">·</span>
                            {surah.ayah_count} {language === 'bn' ? 'আয়াত' : 'Ayahs'}
                            <span className="mx-1.5 text-green-400">·</span>
                            {surah.revelation_type}
                          </p>
                        </Link>
                      </div>
                    </div>

                    {/* Bismillah — all surahs except Al-Fatiha (1) and At-Tawbah (9) */}
                    {surah.number !== 1 && surah.number !== 9 && (
                      <p
                        className="font-arabic text-3xl text-gray-800 dark:text-gray-200 leading-loose mt-5 mb-1"
                        dir="rtl"
                        lang="ar"
                      >
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                      </p>
                    )}
                  </div>
                )}

                {/* Al-Fatiha header shows Bismillah as first ayah naturally */}
                {surah.number === 1 && surah.ayahs[0]?.number === 1 && (
                  <div className="text-center mb-5">
                    <div className="relative inline-block w-full">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-700 dark:border-green-600" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-700 dark:border-green-600" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-700 dark:border-green-600" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-700 dark:border-green-600" />
                      <div className="border border-green-600/40 dark:border-green-700/40 rounded px-6 py-4 bg-green-50/60 dark:bg-green-950/30">
                        <Link to={`/quran/${surah.number}`}>
                          <p className="font-arabic text-4xl text-green-900 dark:text-green-300 leading-loose" dir="rtl" lang="ar">
                            {surah.name_ar}
                          </p>
                          <p className="text-sm font-medium text-green-800 dark:text-green-500 mt-1">
                            {surah.name_en}
                            <span className="mx-1.5 text-green-400">·</span>
                            {surah.ayah_count} {language === 'bn' ? 'আয়াত' : 'Ayahs'}
                            <span className="mx-1.5 text-green-400">·</span>
                            {surah.revelation_type}
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Continuous Arabic text ────────────────────────── */}
                <p
                  className="font-arabic text-[1.65rem] leading-[3rem] text-gray-900 dark:text-gray-100 text-justify"
                  dir="rtl"
                  lang="ar"
                  style={{ fontFeatureSettings: '"kern" 1', wordSpacing: '0.05em' }}
                >
                  {surah.ayahs.map((ayah) => (
                    <span key={ayah.number}>
                      {ayah.text_ar}
                      {/* Inline ayah number marker */}
                      <span
                        className="inline-flex items-center justify-center mx-1 align-middle"
                        aria-label={`Ayah ${ayah.number}`}
                      >
                        <span className="relative inline-flex items-center justify-center w-7 h-7">
                          {/* Ornate circle using Arabic end-of-ayah Unicode */}
                          <span className="font-arabic text-2xl text-green-700 dark:text-green-500 leading-none select-none">
                            ۝
                          </span>
                          <span
                            className="absolute inset-0 flex items-center justify-center font-sans text-[9px] font-bold text-green-900 dark:text-green-300 leading-none"
                            style={{ marginTop: '1px' }}
                          >
                            {ayah.number}
                          </span>
                        </span>
                      </span>
                    </span>
                  ))}
                </p>
              </div>
            ))}

            {/* ── Page number ───────────────────────────────────────── */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <span className="flex-1 h-px bg-amber-200 dark:bg-gray-800" />
              <span className="text-sm text-green-800 dark:text-green-600 font-medium tabular-nums px-3">
                {pageNum}
              </span>
              <span className="flex-1 h-px bg-amber-200 dark:bg-gray-800" />
            </div>

            {/* ── Page navigation ───────────────────────────────────── */}
            <div className="flex justify-between mt-4 mb-2">
              <button
                onClick={() => goToPage(pageNum - 1)}
                disabled={pageNum <= 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-green-800 dark:text-green-500 border border-amber-200 dark:border-gray-800 hover:bg-amber-100 dark:hover:bg-gray-900 disabled:opacity-30 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {language === 'bn' ? 'আগের পৃষ্ঠা' : 'Previous'}
              </button>

              <button
                onClick={() => goToPage(pageNum + 1)}
                disabled={pageNum >= 604}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-green-800 dark:text-green-500 border border-amber-200 dark:border-gray-800 hover:bg-amber-100 dark:hover:bg-gray-900 disabled:opacity-30 transition-colors"
              >
                {language === 'bn' ? 'পরের পৃষ্ঠা' : 'Next'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
