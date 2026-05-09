/**
 * Hidayah Service Worker
 *
 * Strategy:
 *  - App shell (HTML, JS, CSS, fonts): Cache-first with network fallback
 *  - Quran API (alquran.cloud, api.quran.com): Stale-while-revalidate
 *  - Own backend API: Network-first (time-sensitive data), 24 h cache fallback
 *  - Everything else: Network-only (pass through)
 */

const SHELL_CACHE  = 'hidayah-shell-v2';
const QURAN_CACHE  = 'hidayah-quran-v2';
const PRAYER_CACHE = 'hidayah-prayer-v2';

const SHELL_URLS = ['/', '/index.html'];

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_URLS).catch(() => {}))
  );
  self.skipWaiting();
});

// ── Activate ──────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const KEEP = new Set([SHELL_CACHE, QURAN_CACHE, PRAYER_CACHE]);
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !KEEP.has(k)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests over http(s)
  if (request.method !== 'GET') return;
  if (!['http:', 'https:'].includes(url.protocol)) return;

  const isSameOrigin = url.origin === self.location.origin;

  // ── External Quran APIs — stale-while-revalidate ─────────────────────────
  if (
    url.hostname === 'api.alquran.cloud' ||
    url.hostname === 'api.quran.com' ||
    url.hostname === 'everyayah.com'
  ) {
    event.respondWith(staleWhileRevalidate(request, QURAN_CACHE));
    return;
  }

  // ── Google Fonts — cache-first ────────────────────────────────────────────
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, SHELL_CACHE));
    return;
  }

  // ── Same-origin backend API — only cache when running on same origin ──────
  // In development the backend is on a different port (cross-origin), so we
  // must NOT intercept those requests — let them go straight to the network.
  if (isSameOrigin && url.pathname.startsWith('/v1/')) {
    if (url.pathname.startsWith('/v1/prayer') || url.pathname.startsWith('/v1/fasting')) {
      event.respondWith(networkFirst(request, PRAYER_CACHE, 24 * 60 * 60));
    } else if (url.pathname.startsWith('/v1/quran')) {
      event.respondWith(staleWhileRevalidate(request, QURAN_CACHE));
    }
    // other /v1/ routes: pass through (no interception)
    return;
  }

  // ── App shell assets (JS/CSS/images/fonts from same origin) ──────────────
  if (
    isSameOrigin &&
    (request.destination === 'script' ||
     request.destination === 'style'  ||
     request.destination === 'image'  ||
     request.destination === 'font')
  ) {
    event.respondWith(cacheFirst(request, SHELL_CACHE));
    return;
  }

  // ── HTML navigation — network with offline fallback ───────────────────────
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/index.html').then((r) => r || Response.error())
      )
    );
    return;
  }

  // All other requests: pass through to network (no interception)
});

// ── Helpers ───────────────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return Response.error();
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Always kick off a background network fetch to refresh the cache
  const networkFetch = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  // Serve stale immediately; wait for network only when nothing is cached
  if (cached) {
    networkFetch; // update cache in background, don't await
    return cached;
  }

  // Nothing in cache — must wait for the network
  const response = await networkFetch;
  return response || Response.error();
}

async function networkFirst(request, cacheName, maxAgeSeconds) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) {
      const headers = new Headers(response.headers);
      headers.set('sw-cached-at', Date.now().toString());
      const toStore = new Response(await response.clone().blob(), { headers });
      cache.put(request, toStore);
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) {
      const cachedAt = parseInt(cached.headers.get('sw-cached-at') || '0', 10);
      if (Date.now() - cachedAt < maxAgeSeconds * 1000) return cached;
    }
    return Response.error();
  }
}
