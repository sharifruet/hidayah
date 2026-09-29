import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTafsir } from '../../services/quranService.js';
import { tr } from '../../i18n/translations.js';
import ErrorMessage from '../common/ErrorMessage.jsx';

const EDITIONS = [
  { id: 'en.kathir',        labelKey: 'qr_tafsir_ibn_kathir' },
  { id: 'en.maarifulquran', labelKey: 'qr_tafsir_maariful' },
  { id: 'bn.bengali',       labelKey: 'qr_tafsir_zakaria' },
];

// Bangla readers default to the Bangla tafsir (Abu Bakr Zakaria); everyone else to Ibn Kathir.
const defaultEdition = (language) => (language === 'bn' ? 'bn.bengali' : 'en.kathir');

export default function AyahTafsir({ surahNumber, ayahNumber, language }) {
  const [open, setOpen]       = useState(false);
  const [edition, setEdition] = useState(() => defaultEdition(language));

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tafsir', surahNumber, ayahNumber, edition],
    queryFn:  () => fetchTafsir(surahNumber, ayahNumber, edition),
    enabled:  open,
    staleTime: 6 * 60 * 60 * 1000,
  });

  const text = data?.data?.text || '';

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-800 font-medium transition-colors"
        aria-expanded={open}
      >
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-90' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {tr('quran_tafsir', language)}
      </button>

      {open && (
        <div className="mt-2 p-3 bg-teal-50 border border-teal-100 rounded-lg">
          {/* Edition selector */}
          <div className="flex gap-1 mb-3 flex-wrap">
            {EDITIONS.map((ed) => (
              <button
                key={ed.id}
                onClick={() => setEdition(ed.id)}
                className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                  edition === ed.id
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'border-teal-300 text-teal-700 hover:border-teal-500'
                }`}
              >
                {tr(ed.labelKey, language)}
              </button>
            ))}
          </div>

          {isLoading && (
            <p className="text-xs text-gray-400 animate-pulse">
              {tr('qr_tafsir_loading', language)}
            </p>
          )}

          {error && (error.status === 404 ? (
            <p className="text-xs text-gray-500">{tr('qr_tafsir_empty', language)}</p>
          ) : (
            <ErrorMessage error={error} onRetry={refetch} variant="inline" />
          ))}

          {!isLoading && !error && (text ? (
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{text}</p>
          ) : (
            <p className="text-xs text-gray-500">{tr('qr_tafsir_empty', language)}</p>
          ))}
        </div>
      )}
    </div>
  );
}
