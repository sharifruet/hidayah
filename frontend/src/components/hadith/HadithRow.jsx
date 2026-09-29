import { useState } from 'react';
import { hadithLanguageFor } from '../../services/hadithService.js';
import { fmt, tr } from '../../i18n/translations.js';
import { localDigits } from '../../utils/format.js';
import { isHadithBookmarked, toggleHadithBookmark } from '../../utils/saved.js';

/** `bookmarkContext` ({ slug, collectionName, bookName }) enables the bookmark button. */
export default function HadithRow({ hadith, language, onShare, bookmarkContext }) {
  const translation = hadith.translations?.find((t) => t.language === hadithLanguageFor(language));
  // With no translation to read, the Arabic is all there is — show it up front.
  const [showArabic, setShowArabic] = useState(!translation);
  const number = hadith.in_book_number ?? hadith.hadithnumber;
  const [saved, setSaved] = useState(() => !!bookmarkContext && isHadithBookmarked(bookmarkContext.slug, hadith.hadithnumber));

  function toggleSaved() {
    setSaved(
      toggleHadithBookmark({
        ...bookmarkContext,
        bookNumber: hadith.book_number,
        hadithnumber: hadith.hadithnumber,
        displayNumber: number,
        preview: translation?.text ?? hadith.text_ar,
      })
    );
  }

  return (
    <article id={`h-${hadith.hadithnumber}`} className="scroll-mt-20 border-b border-gray-100 dark:border-gray-700 last:border-0 px-5 py-6">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span className="text-sm font-semibold text-green-700 dark:text-green-400">
            {fmt('ct_hadith_n', language, { n: localDigits(number, language) })}
          </span>
          {hadith.grades?.map((g, i) => (
            <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
              {g.grade}{g.name ? ` · ${g.name}` : ''}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
        {bookmarkContext && (
          <button
            onClick={toggleSaved}
            aria-pressed={saved}
            aria-label={tr(saved ? 'sv_unbookmark_hadith' : 'sv_bookmark_hadith', language)}
            title={tr(saved ? 'sv_unbookmark_hadith' : 'sv_bookmark_hadith', language)}
            className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${saved ? 'text-amber-500' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <svg className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        )}
        {onShare && (
          <button
            onClick={() => onShare(hadith, translation)}
            title={tr('share', language)}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-colors"
            aria-label={fmt('ct_hadith_share_aria', language, { n: localDigits(number, language) })}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        )}
        </div>
      </div>

      {translation ? (
        <p className="text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">{translation.text}</p>
      ) : (
        <p className="text-sm italic text-gray-400 dark:text-gray-500">
          {tr('ct_hadith_no_translation', language)}
        </p>
      )}

      {showArabic && (
        <p
          className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40 text-right font-arabic text-2xl sm:text-3xl leading-loose text-gray-900 dark:text-gray-100"
          dir="rtl"
          lang="ar"
        >
          {hadith.text_ar}
        </p>
      )}

      {translation && (
        <button
          onClick={() => setShowArabic((v) => !v)}
          aria-expanded={showArabic}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-green-700 dark:text-green-400 hover:underline"
        >
          {tr(showArabic ? 'ct_hide_arabic' : 'ct_show_arabic', language)}
          <svg className={`w-4 h-4 transition-transform ${showArabic ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </article>
  );
}
