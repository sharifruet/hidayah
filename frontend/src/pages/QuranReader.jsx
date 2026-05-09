import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext.jsx';
import {
  fetchSurahAyahs,
  fetchTranslations,
  fetchReciters,
  fetchWordByWord,
  fetchCitation,
  loadReaderSettings,
  saveReaderSettings,
  saveLastRead,
} from '../services/quranService.js';
import { markSurahRead, recordReadingToday } from '../services/progressService.js';
import AyahRow from '../components/quran/AyahRow.jsx';
import AudioPlayerBar from '../components/quran/AudioPlayerBar.jsx';
import ReaderSettingsDrawer from '../components/quran/ReaderSettingsDrawer.jsx';
import ErrorBoundary from '../components/common/ErrorBoundary.jsx';
import QuranSkeleton from '../components/quran/QuranSkeleton.jsx';
import ErrorMessage from '../components/common/ErrorMessage.jsx';

// Map app language → preferred translation edition on alquran.cloud
const LANG_TRANSLATION_MAP = {
  bn: 'bn.bengali',
  ur: 'ur.ahmedali',
  tr: 'tr.diyanet',
  id: 'id.indonesian',
  en: 'en.sahih',
};

function getDefaultTranslation(language) {
  return LANG_TRANSLATION_MAP[language] || 'en.sahih';
}

const DEFAULT_SETTINGS = {
  fontSize: 'md',
  showTranslation: true,
  selectedTranslations: ['en.sahih'],
  reciterId: 'Alafasy_128kbps',
  wordByWord: false,
  showTafsir: false,
  memorisationMode: false,
  repeatCount: 3,
};

const TRANSLITERATION_EDITION = 'en.transliteration';

/** Encode reader settings into URL search params */
function settingsToParams(s) {
  const p = new URLSearchParams();
  if (s.fontSize && s.fontSize !== 'md') p.set('fs', s.fontSize);
  const realTr = (s.selectedTranslations || ['en.sahih']).filter((t) => t !== 'en.transliteration');
  if (realTr.join(',') !== 'en.sahih') p.set('tr', realTr.join(','));
  if ((s.selectedTranslations || []).includes('en.transliteration')) p.set('tl', '1');
  if (s.wordByWord) p.set('wbw', '1');
  if (s.showTafsir) p.set('tafsir', '1');
  return p;
}

/** Merge URL params into a settings object (URL params take priority) */
function mergeParamsIntoSettings(base, params) {
  const result = { ...base };
  if (params.has('fs')) result.fontSize = params.get('fs');
  if (params.has('tr')) {
    const tr = params.get('tr').split(',').filter(Boolean);
    result.selectedTranslations = params.has('tl') ? [...tr, 'en.transliteration'] : tr;
  } else if (params.has('tl')) {
    result.selectedTranslations = [...(base.selectedTranslations || ['en.sahih']), 'en.transliteration'];
  }
  if (params.has('wbw'))   result.wordByWord  = true;
  if (params.has('tafsir')) result.showTafsir = true;
  return result;
}

export default function QuranReader() {
  const { surahNumber, ayahRef } = useParams();
  const { language } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const targetAyah = ayahRef ? parseInt(ayahRef.split('-')[0], 10) : null;
  const surahNum = parseInt(surahNumber, 10);

  const [settings, setSettings] = useState(() => {
    const saved = loadReaderSettings();
    // If the user has never customised translations (or has only the English
    // default), pick a translation that matches their current app language.
    const savedTr = saved.selectedTranslations;
    const isDefaultEnOnly = !savedTr || (savedTr.length === 1 && savedTr[0] === 'en.sahih');
    if (isDefaultEnOnly) {
      saved.selectedTranslations = [getDefaultTranslation(language)];
    }
    return mergeParamsIntoSettings({ ...DEFAULT_SETTINGS, ...saved }, searchParams);
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [playingAyah, setPlayingAyah]   = useState(null);
  const [jumpValue, setJumpValue]       = useState('');

  // Memorisation: track which ayahs have been revealed
  const [revealedAyahs, setRevealedAyahs] = useState(new Set());

  // Range selection
  const [selectionMode, setSelectionMode]     = useState(false);
  const [selectedAyahs, setSelectedAyahs]     = useState(new Set());
  const [rangeActionMsg, setRangeActionMsg]   = useState('');

  function handleSettingsChange(next) {
    setSettings(next);
    saveReaderSettings(next);
    // Sync relevant settings into URL so sharable links preserve context
    const params = settingsToParams(next);
    setSearchParams(params, { replace: true });
    if (!next.memorisationMode) setRevealedAyahs(new Set());
  }

  // Derive which translation editions to fetch (exclude transliteration)
  const translationsToFetch = (settings.selectedTranslations || ['en.sahih']).filter(
    (t) => t !== TRANSLITERATION_EDITION
  );
  const needsTransliteration = (settings.selectedTranslations || []).includes(TRANSLITERATION_EDITION);

  const editionsForFetch = needsTransliteration
    ? [...translationsToFetch, TRANSLITERATION_EDITION]
    : translationsToFetch;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['quran-ayahs', surahNum, editionsForFetch],
    queryFn: () => fetchSurahAyahs(surahNum, { translations: editionsForFetch }),
    enabled: !isNaN(surahNum) && surahNum >= 1 && surahNum <= 114,
    staleTime: 30 * 60 * 1000,
  });

  const { data: translationsData } = useQuery({
    queryKey: ['quran-translations'],
    queryFn: fetchTranslations,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const { data: recitersData } = useQuery({
    queryKey: ['quran-reciters'],
    queryFn: fetchReciters,
    staleTime: 24 * 60 * 60 * 1000,
  });

  const { data: wordsData } = useQuery({
    queryKey: ['quran-words', surahNum],
    queryFn: () => fetchWordByWord(surahNum),
    enabled: settings.wordByWord === true && !isNaN(surahNum) && surahNum >= 1 && surahNum <= 114,
    staleTime: 6 * 60 * 60 * 1000,
  });

  const surah = data?.data?.surah;
  const ayahs = data?.data?.ayahs || [];
  const wordsMap = wordsData?.data || {};

  // Scroll to target ayah once
  const scrolled = useRef(false);
  useEffect(() => {
    if (ayahs.length && targetAyah && !scrolled.current) {
      const el = document.getElementById(`ayah-${targetAyah}`);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); scrolled.current = true; }
    }
  }, [ayahs, targetAyah]);

  // Track last-read position via IntersectionObserver
  const observerRef = useRef(null);
  useEffect(() => {
    if (!ayahs.length) return;
    observerRef.current?.disconnect();
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const num = parseInt(visible[0].target.id.replace('ayah-', ''), 10);
        if (!isNaN(num)) {
          saveLastRead(surahNum, num);
          recordReadingToday();
          if (num === ayahs[ayahs.length - 1]?.number) markSurahRead(surahNum);
        }
      },
      { threshold: 0.5 }
    );
    observerRef.current = observer;
    ayahs.forEach((a) => {
      const el = document.getElementById(`ayah-${a.number}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ayahs, surahNum]);

  const reciter = (recitersData?.data || []).find((r) => r.id === settings.reciterId)
    || (recitersData?.data || [])[0];

  // ── Keyboard navigation ───────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      // Don't hijack when typing in an input/select/textarea
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const currentIdx = playingAyah
        ? ayahs.findIndex((a) => a.number === playingAyah.number)
        : -1;

      switch (e.key) {
        case 'ArrowDown':
        case 'j': {
          e.preventDefault();
          const next = currentIdx < 0 ? ayahs[0] : ayahs[currentIdx + 1];
          if (next) setPlayingAyah(next);
          break;
        }
        case 'ArrowUp':
        case 'k': {
          e.preventDefault();
          if (currentIdx > 0) setPlayingAyah(ayahs[currentIdx - 1]);
          break;
        }
        case ' ': {
          e.preventDefault();
          if (!playingAyah && ayahs[0]) setPlayingAyah(ayahs[0]);
          // Actual play/pause is handled inside AudioPlayerBar via its own space key
          // We just ensure something is selected
          break;
        }
        case 'm':
        case 'M': {
          if (settings.memorisationMode && playingAyah) {
            // Reveal the currently playing/focused ayah
            handleReveal(playingAyah.number);
          }
          break;
        }
        case 'Escape': {
          setPlayingAyah(null);
          if (selectionMode) exitSelectionMode();
          break;
        }
        default:
          break;
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ayahs, playingAyah, settings.memorisationMode, selectionMode]);

  function handlePlay(ayah) {
    setPlayingAyah((prev) => (prev?.number === ayah.number ? null : ayah));
  }

  async function handleCopy(ayah) {
    const lines = [ayah.text_ar];
    const visible = (ayah.translations || []).filter(
      (t) => t.edition !== TRANSLITERATION_EDITION && settings.selectedTranslations.includes(t.edition)
    );
    visible.forEach((t) => lines.push(t.text));
    lines.push(`\n— ${surah?.name_en} (${surahNum}:${ayah.number})`);
    try { await navigator.clipboard.writeText(lines.join('\n')); } catch {}
  }

  function handleShare(ayah) {
    const url = `${window.location.origin}/quran/${surahNum}/${ayah.number}?translations=${translationsToFetch.join(',')}`;
    if (navigator.share) {
      navigator.share({ title: `${surah?.name_en} ${surahNum}:${ayah.number}`, url });
    } else {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  }

  function handleReveal(ayahNumber) {
    setRevealedAyahs((prev) => new Set([...prev, ayahNumber]));
  }

  function handleToggleSelect(ayahNumber) {
    setSelectedAyahs((prev) => {
      const next = new Set(prev);
      if (next.has(ayahNumber)) next.delete(ayahNumber);
      else next.add(ayahNumber);
      return next;
    });
  }

  async function handleRangeCopy() {
    if (!selectedAyahs.size) return;
    const sorted = [...selectedAyahs].sort((a, b) => a - b);
    const from = sorted[0];
    const to   = sorted[sorted.length - 1];
    try {
      const res = await fetchCitation(surahNum, from, to, translationsToFetch);
      await navigator.clipboard.writeText(res.data?.text || '');
      setRangeActionMsg(language === 'bn' ? 'কপি হয়েছে!' : 'Copied!');
    } catch {
      setRangeActionMsg(language === 'bn' ? 'ব্যর্থ হয়েছে' : 'Failed');
    }
    setTimeout(() => setRangeActionMsg(''), 2000);
  }

  function handleRangeShare() {
    if (!selectedAyahs.size) return;
    const sorted = [...selectedAyahs].sort((a, b) => a - b);
    const from = sorted[0];
    const to   = sorted[sorted.length - 1];
    const ref = to === from ? `${surahNum}:${from}` : `${surahNum}:${from}-${to}`;
    const url = `${window.location.origin}/quran/${surahNum}/${from}-${to}?translations=${translationsToFetch.join(',')}`;
    if (navigator.share) {
      navigator.share({ title: `${surah?.name_en} ${ref}`, url });
    } else {
      navigator.clipboard.writeText(url).catch(() => {});
      setRangeActionMsg(language === 'bn' ? 'লিংক কপি হয়েছে!' : 'Link copied!');
      setTimeout(() => setRangeActionMsg(''), 2000);
    }
  }

  function handleSelectAll() {
    setSelectedAyahs(new Set(ayahs.map((a) => a.number)));
  }

  function exitSelectionMode() {
    setSelectionMode(false);
    setSelectedAyahs(new Set());
  }

  const prevSurah = surahNum > 1 ? surahNum - 1 : null;
  const nextSurah = surahNum < 114 ? surahNum + 1 : null;

  if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Invalid surah number</p>
          <Link to="/quran" className="text-green-600 hover:underline">← Back to Quran</Link>
        </div>
      </div>
    );
  }

  const activeBadges = [
    settings.wordByWord && (language === 'bn' ? 'শব্দ ভিত্তিক' : 'Word by Word'),
    (settings.selectedTranslations || []).includes(TRANSLITERATION_EDITION) && (language === 'bn' ? 'প্রতিবর্ণীকরণ' : 'Transliteration'),
    settings.showTafsir && (language === 'bn' ? 'তাফসির' : 'Tafsir'),
    settings.memorisationMode && (language === 'bn' ? 'মুখস্থ মোড' : 'Memorisation'),
    selectionMode && (language === 'bn' ? 'নির্বাচন মোড' : 'Selection Mode'),
  ].filter(Boolean);

  const badgeColors = {
    'Word by Word': 'bg-amber-100 text-amber-700',
    'শব্দ ভিত্তিক': 'bg-amber-100 text-amber-700',
    'Transliteration': 'bg-blue-100 text-blue-700',
    'প্রতিবর্ণীকরণ': 'bg-blue-100 text-blue-700',
    'Tafsir': 'bg-teal-100 text-teal-700',
    'তাফসির': 'bg-teal-100 text-teal-700',
    'Memorisation': 'bg-purple-100 text-purple-700',
    'মুখস্থ মোড': 'bg-purple-100 text-purple-700',
    'Selection Mode': 'bg-orange-100 text-orange-700',
    'নির্বাচন মোড': 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/quran" className="text-gray-500 hover:text-gray-700 flex-shrink-0" aria-label="Back">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          <div className="text-center flex-1 min-w-0">
            {surah ? (
              <>
                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">{surah.name_en}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{surah.name_en_trans} • {surah.ayah_count} ayahs</p>
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Surah {surahNum}</p>
            )}
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Mushaf view */}
            {surah && ayahs.length > 0 && (
              <Link
                to={`/quran/page/${ayahs[0].page}`}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                title={language === 'bn' ? 'মুসহাফ দৃশ্য' : 'Mushaf view'}
                aria-label="Open Mushaf page view"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </Link>
            )}

            {/* Range selection toggle */}
            <button
              onClick={() => (selectionMode ? exitSelectionMode() : setSelectionMode(true))}
              className={`p-1.5 rounded-full transition-colors ${
                selectionMode
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
              title={language === 'bn' ? 'আয়াত নির্বাচন করুন' : 'Select ayahs'}
              aria-label="Toggle selection mode"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </button>

            <Link to="/quran/search" className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            <button
              onClick={() => setSettingsOpen(true)}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              aria-label="Reader settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Active feature badges + keyboard hint */}
        {(activeBadges.length > 0 || true) && (
          <div className="max-w-7xl mx-auto px-4 pb-2 flex gap-2 flex-wrap items-center">
            {activeBadges.map((badge) => (
              <span
                key={badge}
                className={`text-xs px-2 py-0.5 rounded-full ${badgeColors[badge] || 'bg-gray-100 text-gray-600'}`}
              >
                {badge}
              </span>
            ))}
            <span className="text-xs text-gray-300 ml-auto hidden sm:inline select-none" title="Keyboard: ↑↓ navigate · Space play · M reveal · Esc stop">
              ↑↓ · Space · M · Esc
            </span>
          </div>
        )}
      </div>

      {/* Jump to ayah */}
      {surah && (
        <div className="max-w-7xl mx-auto px-4 pt-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = parseInt(jumpValue, 10);
              if (!isNaN(n) && n >= 1 && n <= surah.ayah_count) {
                const el = document.getElementById(`ayah-${n}`);
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
              setJumpValue('');
            }}
            className="flex gap-2"
          >
            <input
              type="number"
              min={1}
              max={surah?.ayah_count}
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              placeholder={language === 'bn' ? 'আয়াত নং...' : 'Jump to ayah...'}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {language === 'bn' ? 'যান' : 'Go'}
            </button>
          </form>
        </div>
      )}

      {/* Surah header */}
      {surah && (
        <div className="max-w-7xl mx-auto px-4 pt-6 pb-4 text-center">
          <p className="text-5xl font-arabic text-gray-900 dark:text-gray-100 mb-1" dir="rtl" lang="ar">{surah.name_ar}</p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{surah.name_en}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {surah.name_en_trans} • {surah.revelation_type} • {surah.ayah_count}{' '}
            {language === 'bn' ? 'আয়াত' : 'ayahs'}
          </p>

          {surahNum !== 1 && surahNum !== 9 && (
            <div className="mt-6 flex items-center gap-3 justify-center" aria-label="Bismillah">
              <span className="flex-1 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />
              <p className="text-3xl font-arabic text-gray-800 leading-loose tracking-wide" dir="rtl" lang="ar">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </p>
              <span className="flex-1 h-px bg-gradient-to-l from-transparent via-green-200 to-transparent" />
            </div>
          )}
        </div>
      )}

      {/* Ayahs */}
      <div className="max-w-7xl mx-auto">
        {isLoading && <QuranSkeleton />}
        {error && <ErrorMessage error={error} onRetry={refetch} />}

        {!isLoading && !error && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mx-4 mb-4 overflow-hidden">
            {ayahs.map((ayah) => (
              <ErrorBoundary key={ayah.number} label={`Ayah ${ayah.number}`} compact>
              <AyahRow
                key={ayah.number}
                ayah={ayah}
                surahNumber={surahNum}
                surahName={surah?.name_en}
                language={language}
                isPlaying={playingAyah?.number === ayah.number}
                isHighlighted={playingAyah?.number === ayah.number}
                selectedTranslations={
                  settings.showTranslation !== false
                    ? (settings.selectedTranslations || ['en.sahih'])
                    : []
                }
                fontSize={settings.fontSize || 'md'}
                wordByWord={settings.wordByWord === true}
                wordData={settings.wordByWord ? (wordsMap[ayah.number] || null) : null}
                showTafsir={settings.showTafsir === true}
                memorisationMode={settings.memorisationMode === true}
                isRevealed={revealedAyahs.has(ayah.number)}
                onReveal={handleReveal}
                selectionMode={selectionMode}
                isSelected={selectedAyahs.has(ayah.number)}
                onToggleSelect={handleToggleSelect}
                onPlay={handlePlay}
                onCopy={handleCopy}
                onShare={handleShare}
              />
              </ErrorBoundary>
            ))}
          </div>
        )}

        {/* Surah navigation */}
        {!isLoading && !error && (
          <div className="flex justify-between px-4 pb-8 gap-4">
            {prevSurah ? (
              <Link to={`/quran/${prevSurah}`} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {language === 'bn' ? `সুরা ${prevSurah}` : `Surah ${prevSurah}`}
              </Link>
            ) : <div />}
            {nextSurah ? (
              <Link to={`/quran/${nextSurah}`} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors ml-auto">
                {language === 'bn' ? `সুরা ${nextSurah}` : `Surah ${nextSurah}`}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : <div />}
          </div>
        )}
      </div>

      <ReaderSettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        availableTranslations={translationsData?.data || []}
        availableReciters={recitersData?.data || []}
        language={language}
      />

      {/* Range selection action bar */}
      {selectionMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">
                {selectedAyahs.size > 0
                  ? (language === 'bn'
                    ? `${selectedAyahs.size}টি আয়াত নির্বাচিত`
                    : `${selectedAyahs.size} ayah${selectedAyahs.size > 1 ? 's' : ''} selected`)
                  : (language === 'bn' ? 'আয়াত নির্বাচন করুন' : 'Select ayahs')}
                {rangeActionMsg && (
                  <span className="ml-2 text-green-600 font-medium">{rangeActionMsg}</span>
                )}
              </p>
              <button
                onClick={exitSelectionMode}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                className="flex-1 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {language === 'bn' ? 'সব নির্বাচন' : 'Select all'}
              </button>
              <button
                onClick={handleRangeCopy}
                disabled={!selectedAyahs.size}
                className="flex-1 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 transition-colors"
              >
                {language === 'bn' ? 'কপি করুন' : 'Copy range'}
              </button>
              <button
                onClick={handleRangeShare}
                disabled={!selectedAyahs.size}
                className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors"
              >
                {language === 'bn' ? 'শেয়ার করুন' : 'Share range'}
              </button>
            </div>
          </div>
        </div>
      )}

      {!selectionMode && playingAyah && surah && (
        <AudioPlayerBar
          surah={surah}
          ayah={playingAyah}
          ayahs={ayahs}
          reciter={reciter}
          language={language}
          repeatCount={settings.memorisationMode ? (settings.repeatCount || 3) : 1}
          onAyahChange={setPlayingAyah}
          onClose={() => setPlayingAyah(null)}
        />
      )}
    </div>
  );
}
