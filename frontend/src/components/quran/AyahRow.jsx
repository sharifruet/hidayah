import { useRef, useEffect, useState } from 'react';
import WordToken from './WordToken.jsx';
import AyahTafsir from './AyahTafsir.jsx';
import AyahImageCard from './AyahImageCard.jsx';
import { isBookmarked, addBookmark, removeBookmark } from '../../services/bookmarkService.js';

const TRANSLITERATION_EDITION = 'en.transliteration';

export default function AyahRow({
  ayah,
  surahNumber,
  surahName,
  language,
  isPlaying,
  isHighlighted,
  selectedTranslations,
  fontSize,
  wordByWord,
  wordData,        // Array<{position,text_ar,transliteration,gloss}> | null
  showTafsir,
  memorisationMode,
  isRevealed,
  onReveal,
  selectionMode,
  isSelected,
  onToggleSelect,
  onPlay,
  onCopy,
  onShare,
}) {
  const rowRef = useRef(null);
  const [activeWord, setActiveWord]   = useState(null);
  const [showImageCard, setShowImageCard] = useState(false);
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(surahNumber, ayah.number));

  function toggleBookmark() {
    if (bookmarked) {
      removeBookmark(surahNumber, ayah.number);
      setBookmarked(false);
    } else {
      const translationText = (ayah.translations || []).find((t) => t.edition === 'en.sahih')?.text || '';
      addBookmark({ surah: surahNumber, ayah: ayah.number, surahName, text_ar: ayah.text_ar, translationText });
      setBookmarked(true);
    }
  }

  // Audio follow-along: scroll highlighted ayah into view
  useEffect(() => {
    if (isHighlighted && rowRef.current) {
      rowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isHighlighted]);

  // Dismiss word tooltip when this ayah loses highlight or playback stops
  useEffect(() => {
    if (!isHighlighted) setActiveWord(null);
  }, [isHighlighted]);

  const arabicFontSize = { sm: 'text-3xl', md: 'text-4xl', lg: 'text-5xl', xl: 'text-6xl' }[fontSize] || 'text-4xl';
  const translationFontSize = { sm: 'text-xs', md: 'text-sm', lg: 'text-base', xl: 'text-lg' }[fontSize] || 'text-sm';

  // Separate transliteration edition from regular translations
  const transliterationItem = ayah.translations?.find((t) => t.edition === TRANSLITERATION_EDITION);
  const visibleTranslations = (ayah.translations || []).filter(
    (t) => t.edition !== TRANSLITERATION_EDITION && selectedTranslations.includes(t.edition)
  );
  const showTranslitLine = selectedTranslations.includes(TRANSLITERATION_EDITION) && transliterationItem;

  // Fallback words: split Arabic text on spaces when no API word data is available
  const words = wordData && wordData.length > 0
    ? wordData
    : (ayah.text_ar || '').split(' ').filter(Boolean).map((w, i) => ({
        position: i + 1,
        text_ar: w,
        transliteration: '',
        gloss: '',
      }));

  const hidden = memorisationMode && !isRevealed;

  return (
    <div
      ref={rowRef}
      id={`ayah-${ayah.number}`}
      className={`ayah-row-container border-b border-gray-100 dark:border-gray-700 last:border-0 px-4 py-5 transition-colors duration-300 ${
        isSelected
          ? 'border-l-4 border-l-green-500'
          : isHighlighted
          ? 'border-l-4 border-l-green-500 ayah-playing'
          : isPlaying
          ? 'border-l-4 border-l-amber-400'
          : ''
      }`}
    >
      {/* Ayah number + action buttons */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Selection checkbox */}
          {selectionMode && (
            <input
              type="checkbox"
              checked={!!isSelected}
              onChange={() => onToggleSelect(ayah.number)}
              className="w-4 h-4 accent-green-600 cursor-pointer"
              aria-label={`Select ayah ${ayah.number}`}
            />
          )}
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold flex-shrink-0">
            {ayah.number}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Bookmark */}
          <button
            onClick={toggleBookmark}
            title={language === 'bn' ? (bookmarked ? 'বুকমার্ক সরান' : 'বুকমার্ক করুন') : (bookmarked ? 'Remove bookmark' : 'Bookmark')}
            className={`p-1.5 rounded-full transition-colors ${
              bookmarked ? 'text-green-600 dark:text-green-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500'
            }`}
            aria-label={bookmarked ? `Remove bookmark for ayah ${ayah.number}` : `Bookmark ayah ${ayah.number}`}
          >
            <svg className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>

          <button
            onClick={() => onPlay(ayah)}
            title={language === 'bn' ? 'চালান' : 'Play'}
            className={`p-1.5 rounded-full transition-colors ${
              isPlaying ? 'bg-yellow-200 text-yellow-800' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
            aria-label={`${isPlaying ? 'Pause' : 'Play'} ayah ${ayah.number}`}
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm4-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button
            onClick={() => onCopy(ayah)}
            title={language === 'bn' ? 'কপি করুন' : 'Copy'}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            aria-label={`Copy ayah ${ayah.number}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>

          {/* Image card */}
          <button
            onClick={() => setShowImageCard(true)}
            title={language === 'bn' ? 'ছবি কার্ড' : 'Image card'}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            aria-label={`Generate image card for ayah ${ayah.number}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>

          <button
            onClick={() => onShare(ayah)}
            title={language === 'bn' ? 'শেয়ার করুন' : 'Share'}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            aria-label={`Share ayah ${ayah.number}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Memorisation mode overlay */}
      {hidden ? (
        <button
          onClick={() => onReveal(ayah.number)}
          className="w-full py-6 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center gap-2 mb-3"
          aria-label={`Reveal ayah ${ayah.number}`}
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-sm text-gray-400">
            {language === 'bn' ? 'ট্যাপ করুন প্রকাশ করতে' : 'Tap to reveal'}
          </span>
        </button>
      ) : (
        <>
          {/* Arabic text — word-by-word tokens OR plain text */}
          {wordByWord ? (
            <div
              className="flex flex-wrap gap-x-1 gap-y-3 justify-end mb-3"
              dir="rtl"
              lang="ar"
              onClick={(e) => { if (e.target === e.currentTarget) setActiveWord(null); }}
            >
              {words.map((word, i) => (
                <WordToken
                  key={i}
                  word={word}
                  showTranslit={selectedTranslations.includes(TRANSLITERATION_EDITION)}
                  isActive={activeWord?.position === word.position && activeWord?.text_ar === word.text_ar}
                  onClick={setActiveWord}
                />
              ))}
            </div>
          ) : (
            <p
              className={`text-right font-arabic leading-loose text-gray-900 dark:text-gray-100 mb-2 ${arabicFontSize}`}
              dir="rtl"
              lang="ar"
            >
              {ayah.text_ar}
            </p>
          )}

          {/* Word gloss card (word-by-word mode) */}
          {wordByWord && activeWord && (
            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-3xl font-arabic text-gray-900 leading-loose" dir="rtl" lang="ar">
                  {activeWord.text_ar}
                </p>
                {activeWord.transliteration && (
                  <p className="text-xs text-gray-500 italic mt-0.5">{activeWord.transliteration}</p>
                )}
                {activeWord.gloss ? (
                  <p className="text-sm text-gray-700 font-medium mt-1">{activeWord.gloss}</p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1 italic">
                    {language === 'bn' ? 'অর্থ পাওয়া যায়নি' : 'Gloss unavailable'}
                  </p>
                )}
              </div>
              <button
                onClick={() => setActiveWord(null)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0 text-lg leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
          )}

          {/* Full-ayah transliteration line (non-word-by-word mode) */}
          {!wordByWord && showTranslitLine && (
            <p className={`text-gray-400 italic mb-3 leading-relaxed ${translationFontSize}`} dir="ltr">
              {transliterationItem.text}
            </p>
          )}

          {/* Translations */}
          {visibleTranslations.map((t) => (
            <div key={t.edition} className="mt-2">
              <p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${translationFontSize}`}>{t.text}</p>
              {visibleTranslations.length > 1 && (
                <p className="text-xs text-gray-400 mt-1">
                  — {t.name}{t.author ? `, ${t.author}` : ''}
                </p>
              )}
            </div>
          ))}
        </>
      )}

      {/* Tafsir */}
      {showTafsir && (
        <AyahTafsir
          surahNumber={surahNumber}
          ayahNumber={ayah.number}
          language={language}
        />
      )}

      {/* Image card modal */}
      {showImageCard && (
        <AyahImageCard
          ayah={ayah}
          surahName={surahName || `Surah ${surahNumber}`}
          surahNumber={surahNumber}
          language={language}
          onClose={() => setShowImageCard(false)}
        />
      )}
    </div>
  );
}
