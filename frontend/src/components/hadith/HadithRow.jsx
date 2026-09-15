export default function HadithRow({ hadith, showArabic, showBangla, showEnglish, onShare }) {
  const bn = hadith.translations?.find((t) => t.language === 'bn');
  const en = hadith.translations?.find((t) => t.language === 'en');

  return (
    <div className="border-b border-gray-100 dark:border-gray-700 last:border-0 px-4 py-5">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold flex-shrink-0">
            {hadith.in_book_number ?? hadith.hadithnumber}
          </span>
          {hadith.grades?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {hadith.grades.map((g, i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                  {g.grade}{g.name ? ` — ${g.name}` : ''}
                </span>
              ))}
            </div>
          )}
        </div>
        {onShare && (
          <button
            onClick={() => onShare(hadith)}
            title="Share"
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-colors"
            aria-label={`Share hadith ${hadith.hadithnumber}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        )}
      </div>

      {showArabic && (
        <p className="text-right font-arabic leading-loose text-gray-900 dark:text-gray-100 mb-3 text-2xl" dir="rtl" lang="ar">
          {hadith.text_ar}
        </p>
      )}

      {showBangla && bn && (
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm mb-2">{bn.text}</p>
      )}

      {showEnglish && en && (
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">{en.text}</p>
      )}
    </div>
  );
}
