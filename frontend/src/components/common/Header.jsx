import { useState } from 'react';
import { Link, useLocation as useRouterLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { tr, LANGUAGE_LABELS } from '../../i18n/translations.js';

export default function Header() {
  const { language, setLanguage, supportedLanguages, isRTL, darkMode, toggleDarkMode } = useApp();
  const routerLocation = useRouterLocation();
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const isActive = (path) => routerLocation.pathname === path;

  const navLinks = [
    { path: '/',               key: 'nav_home' },
    { path: '/prayer-times',   key: 'nav_prayer' },
    { path: '/quran',          key: 'nav_quran',    prefix: true },
    { path: '/books',          key: 'nav_books',    prefix: true },
    { path: '/duas',           key: 'nav_duas' },
    { path: '/settings',       key: 'nav_settings' },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              {/* Logo mark — mix-blend-mode:multiply knocks out the white background;
                  dark mode wrapper restores a white surface for the blend to work on */}
              <span className="flex items-center justify-center w-8 h-8 rounded-md dark:bg-white dark:p-0.5 overflow-hidden flex-shrink-0">
                <img
                  src="/icons/logo.png"
                  alt="Hidayah logo"
                  className="w-full h-full object-contain mix-blend-multiply"
                  style={{ filter: 'hue-rotate(122deg) saturate(1.4) brightness(0.72)' }}
                />
              </span>
              <h1 className="text-xl font-bold text-primary-600 dark:text-green-400">
                {tr('app_name', language)}
              </h1>
            </Link>
          </div>

          {/* Nav + language */}
          <nav className="flex items-center gap-1 flex-wrap">
            {navLinks.map(({ path, key, prefix }) => (
              <Link
                key={path}
                to={path}
                className={`px-3 py-2 rounded-md text-sm font-medium hidden sm:inline-flex ${
                  (prefix ? routerLocation.pathname.startsWith(path) : isActive(path))
                    ? 'bg-primary-100 text-primary-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tr(key, language)}
              </Link>
            ))}

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Language picker */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen((v) => !v)}
                onBlur={() => setTimeout(() => setLangMenuOpen(false), 150)}
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Change language"
                aria-expanded={langMenuOpen}
                aria-haspopup="listbox"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="hidden sm:inline">{LANGUAGE_LABELS[language]}</span>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {langMenuOpen && (
                <ul
                  role="listbox"
                  aria-label="Select language"
                  className={`absolute top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50 min-w-[140px] ${isRTL ? 'left-0' : 'right-0'}`}
                >
                  {supportedLanguages.map((lang) => (
                    <li key={lang} role="option" aria-selected={lang === language}>
                      <button
                        onClick={() => { setLanguage(lang); setLangMenuOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          lang === language ? 'text-primary-700 dark:text-green-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                        }`}
                        dir={lang === 'ur' ? 'rtl' : 'ltr'}
                      >
                        <span>{LANGUAGE_LABELS[lang]}</span>
                        {lang === language && (
                          <svg className="w-3.5 h-3.5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
