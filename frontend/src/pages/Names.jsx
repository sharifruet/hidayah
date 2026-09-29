import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { tr } from '../i18n/translations.js';
import { bnOr, localDigits } from '../utils/format.js';
import NAMES from '../data/asmaulHusna.json';

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ'ʿ-]/g, '');

export default function Names() {
  const { language } = useApp();
  const [query, setQuery] = useState('');
  const list = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return NAMES;
    return NAMES.filter((n) => [n.tr, n.en, n.bnName, n.bn, String(n.n)].some((s) => norm(s).includes(q)) || n.ar.includes(query.trim()));
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tr('names_title', language)}</h1>
        <p className="mt-2 text-sm italic text-gray-600 dark:text-gray-400">{tr('names_hadith', language)}</p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tr('names_search', language)}
          className="mt-4 mb-6 w-full sm:max-w-sm px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((n) => {
            const name = bnOr(language, n.bnName, n.tr);
            return (
              <li key={n.n} className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 px-4 py-3">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold flex items-center justify-center">
                  {localDigits(n.n, language)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{bnOr(language, n.bn, n.en)}</p>
                  {name !== n.tr && <p className="text-xs text-gray-400">{n.tr} · {n.en}</p>}
                </div>
                <span className="text-2xl text-gray-900 dark:text-gray-100 font-arabic" dir="rtl" lang="ar">{n.ar}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
