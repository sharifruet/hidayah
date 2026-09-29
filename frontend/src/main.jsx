import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Self-hosted fonts (bundled by Vite, cached by the service worker) so Bangla, Arabic and
// Urdu text render on a first visit even when Google's font servers are unreachable.
// Each file declares per-script unicode-range subsets; the browser fetches only what a
// page actually uses (e.g. Nastaliq only when Urdu text is shown).
import '@fontsource/noto-sans-bengali/400.css'
import '@fontsource/noto-sans-bengali/500.css'
import '@fontsource/noto-sans-bengali/600.css'
import '@fontsource/noto-sans-bengali/700.css'
import '@fontsource/amiri/400.css'
import '@fontsource/amiri/400-italic.css'
import '@fontsource/amiri/700.css'
import '@fontsource/scheherazade-new/400.css'
import '@fontsource/scheherazade-new/500.css'
import '@fontsource/scheherazade-new/600.css'
import '@fontsource/scheherazade-new/700.css'
import '@fontsource/noto-nastaliq-urdu/400.css'
import '@fontsource/noto-nastaliq-urdu/700.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Register service worker for PWA / offline support.
// Production only — in dev it cache-firsts JS and silently serves stale code.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .catch((err) => console.warn('SW registration failed:', err));
  });
}
