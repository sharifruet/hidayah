# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

"Hidayah" (repo name `ramadan`, package name `salat-saom-api`) is a coordinate-based Islamic prayer times platform for Bangladesh, built out into a broader app: prayer/sun times, calendars, a Quran reader (text/translations/audio), an Islamic e-book library with a hierarchical reader, and du'a collections — plus an admin panel for managing books/chapters/du'as. Backend is a Node.js/Express REST API (`backend/`) backed by MySQL; frontend is a React SPA (`frontend/`) built with Vite.

Note: the root `README.md`/`SETUP.md`/`backend/STRUCTURE.md`/`frontend/README.md` describe an earlier "Salat and Saom" (prayer + fasting) phase and are stale — fasting was removed from the API/UI in a later commit, and Quran/Books/admin features were added afterward without those docs being updated. Prefer reading the source (`backend/src/server.js`, `frontend/src/App.jsx`) over those docs for current routes/pages.

## Commands

All commands below are run from `backend/` or `frontend/` respectively unless noted.

### Backend (`backend/`)
- `npm run dev` — start with nodemon (hot reload)
- `npm start` — start production server
- `npm run test:unit` — the `node:test` suites (masjids, zakat, sync; the sync API test runs the real routes against an in-memory pool stand-in, no DB needed)
- `npm test` — run Jest tests (ESM via `--experimental-vm-modules`); run a single file with `npm test -- tests/calculations.test.js` or a single case with `npm test -- -t "test name"`
- `npm run lint` — ESLint (`eslint . --ext .js`); there is no `lint:fix` script — use `npx eslint . --ext .js --fix`
- `npm run format` — Prettier write on `src/**/*.js`
- `npm run migrate` / `npm run migrate:status` / `npm run migrate:rollback` — schema migration runner (see below)
- `npm run seed` — seed base data (locations, calculation methods, du'as)
- `npm run seed:upazilas` — (re)load all ~500 upazilas into `locations` (type `upazila`) from `src/database/data/upazilas.json` (Wikidata, CC0); also adds the enum value on an older DB (see `database/migrations/003_upazila_locations.sql`). Run by `npm run seed` too
- `npm run seed:duas` — (re)seed the du'a collection from `src/database/data/duas.json` (idempotent, keyed by slug; also creates/upgrades the tables on an older DB)
- `npm run seed:quran` / `npm run seed:quran:force` — seed Quran text/translations from `src/database/quranSeeder.js` (force re-seeds)
- `npm run download:audio` — fetch per-ayah recitation audio into `backend/public/audio/` (`scripts/downloadAudio.js`)
- `npm run generate:sql` — dump current DB state to SQL (`scripts/generateSqlDump.js`)

### Frontend (`frontend/`)
- `npm run dev` / `npm start` — Vite dev server (default http://localhost:5173)
- `npm run build` — production build
- `npm run lint` — ESLint 8 with `.eslintrc.cjs` (zero warnings allowed)
- `npm run format` — Prettier write on `src/**/*.{js,jsx}`
- `npm test` — Vitest unit/component tests (jsdom); run one file with `npx vitest run src/tests/hooks/usePrayerTimes.test.js`
- `npm run test:ui` — Vitest with UI
- `npm run test:e2e` — Playwright e2e tests against `e2e/` (auto-starts the dev server; needs `npx playwright install` once locally)

### Docker (repo root)
`docker-compose up --build` starts MySQL + backend + frontend together with hot reload (backend runs migrate + seed on container start). Convenience wrappers: `./dev.sh`, `./shell.sh` (backend shell), `./mysql.sh` / `./mysql-root.sh` (MySQL CLI), `./migrate.sh`, `./seed.sh`, `./test.sh`, `./lint.sh`, `./format.sh` — these all just call `docker-compose exec backend npm run …`, so they require the stack to already be running. See `DOCKER.md` for details.

## Architecture

### Backend layering
Express request flow is strictly layered: `routes/*.js` → `middleware/validation.js` (Joi schemas) → `controllers/*.js` (parse/format only) → `services/*.js` (business logic + DB queries via the shared `mysql2` pool) → MySQL. Routes are mounted in `src/server.js` under `/${API_VERSION}` (default `/v1`): `prayer-times`, `sun-times`, `calendar`, `batch`, `locations`, `methods`, `quran`, `hadith`, `books`, `masjids`, `duas`, `zakat`, `admin`. Admin routes (`routes/admin.js`) are protected by `middleware/adminAuth.js` (JWT bearer, `requireAdmin`); non-admin routes are public/unauthenticated.

### Prayer/sun time calculation engine
`src/utils/calculations.js` implements the astronomical formulas (solar declination, equation of time, solar noon, hour angles) directly — no external prayer-times library. `src/config/methods.js` defines ~20 named calculation methods (e.g. `karachi` [default], `mwl`, `isna`, `egyptian`, …) as angle/adjustment parameter sets that `calculations.js` consumes. Results are cached in MySQL (`prayer_times_cache`) via `src/services/cacheService.js`, keyed on lat/lng/date/method — custom angle/adjustment overrides bypass the cache entirely (see `generatePrayerTimesCacheKey`). Hijri calendar conversion is a separate self-contained tabular approximation in `src/utils/hijri.js` (and its frontend mirror `frontend/src/utils/hijri.js`).

### Quran module
`src/services/quranService.js` reads Quran text/translations from local MySQL tables (`quran_surahs`, `quran_ayahs`, `quran_editions`, `quran_translations`) when seeded, and **automatically falls back to the public `api.alquran.cloud` API** when those tables are missing or empty — so Quran endpoints work before `seed:quran` has been run. It layers an in-memory TTL cache on top (static data 24h, per-surah 6h, search 1m) independent of the seeded/fallback check, which itself is cached for 60s. Ayah audio is served as static files from `backend/public/audio/` (see `/audio` static mount in `server.js` and `scripts/downloadAudio.js`).

### Books module
Islamic e-books live in `books` (metadata: slug, topics, language, license, `content_type` = `pdf`/`epub`/`text`/embed) and, for `content_type='text'` books, `book_chapters` — a **self-referencing tree** (`parent_id` + sibling `position`) representing book/section/chapter/scene/paragraph nesting; a node is only directly readable when `content` is non-null, otherwise it's a pure container. Admin CRUD for books/chapters is in `routes/admin.js`; the public reader is `frontend/src/pages/BookReader.jsx` with admin editing in `frontend/src/pages/admin/AdminBookChapters.jsx`.

### Masjids module
Community-contributed masjid directory: `masjids` (name/address/coords/status) + `masjid_jamah_times` (one row per `(masjid_id, prayer)`, prayers `fajr|dhuhr|asr|maghrib|isha|jumuah`). `services/masjidsService.js` does nearby lookups with a bounding-box prefilter (`utils/geo.js`) then an exact Haversine in SQL (`HAVING distance_km <= ?`). Public routes (`routes/masjids.js`) allow unauthenticated create (`POST /masjids`, `status` is forced to `active`) and jamah upserts (`PUT /masjids/:id/jamah`, `HH:MM` or `null` to clear) — the upsert sets `updated_at = NOW()` explicitly so re-confirming an unchanged time still bumps `jamah_updated_at` (the "last updated" shown in the UI). Admin CRUD (incl. `status: hidden`) lives in `routes/admin.js`. Joi validators are in `middleware/validation.js` (`validateMasjidBody`, `validateJamahBody`, `validateNearbyQuery`). Web pages: `pages/Masjids.jsx`, `MasjidDetail.jsx`, `MasjidNew.jsx`, `admin/AdminMasjids.jsx`; mobile: `app/(tabs)/more/masjids/`.

### Du'as module
The du'a collection is DB-backed (`dua_categories` + `duas`, the latter keyed by a stable `slug` such as `major-4`, with optional `virtue_en/virtue_bn` "fazilat" text). `backend/src/database/data/duas.json` is the canonical seed file (`npm run seed:duas`, also run by `npm run seed`). `GET /v1/duas` returns the whole collection plus `updated_at`. Clients don't page: web (`pages/Duas.jsx`) fetches it via react-query and keeps the last copy in `localStorage`; mobile (`lib/duasSync.ts`) copies it into MMKV at startup and re-syncs every `DUAS_SYNC_INTERVAL_DAYS` (7), falling back to the bundled snapshot `mobile/src/data/duas.json` until the first sync. Regenerate that snapshot from the seed JSON when the seed data changes.

### Islamic calendar, reminders & tools
Hijri conversion exists in three copies (`backend/src/utils/hijri.js`, `frontend/src/utils/hijri.js`, `mobile/src/lib/hijri.ts`). The Julian-day step must use `Math.trunc` for `(month - 14) / 12` and a 1-based month; flooring it, or passing `getMonth()`, shifts dates. Client copies apply a user moon-sighting offset (±2 days, key `app_hijri_offset`) by default. Pure helpers are mirrored between web (`frontend/src/utils/*.js`) and mobile (`mobile/src/lib/*.ts`): `islamicDays` (Eids, Shab-e-Barat/Qadr on the evening before, Ashura, Arafah, Ayyam al-Bid, Mon/Thu fasts), `forbiddenTimes`, `zakat` (nisab rates come from `GET /v1/zakat/nisab`, configured in `backend/src/config/nisab.js` or via `NISAB_*` env vars). Feature strings (en + bn) live in `featureStrings` files on both clients, merged into `tr`/`fmt`.

Mobile reminders (`mobile/src/lib/reminders.ts`) plan all notification categories and hand them to `notifications.ts`. That file keeps only the earliest 60 because of iOS's 64-pending limit; the Android channel goes on the *trigger*. The planner also refreshes the home-screen widget (`mobile/src/widgets/`). iOS uses `expo-widgets` with a native countdown. Android uses `react-native-android-widget`, whose task handler is registered in `mobile/index.ts` (the package `main`). Adhan clips live in `mobile/assets/sounds/` (see `CREDITS.md`) and are bundled via the expo-notifications `sounds` option. "My masjid" (jamah reminders) is cached in storage (`lib/myMasjid.ts`).

### Localisation (both clients)
Bangla is the default language on web and mobile. There is one translation system per client: `tr(key, lang)` / `fmt(key, lang, vars)`. On web, `frontend/src/i18n/translations.js` merges `featureStrings.js` and the area modules in `i18n/strings/*.js`. On mobile, `mobile/src/data/translations.ts` merges `featureStrings.ts`. Every entry needs all five languages (en/bn/ur/tr/id), and keys must not be redefined across modules. Don't write inline `language === 'bn' ? … : …` for UI text; choosing a *data* field (e.g. `translation_bn`) is fine, and on web the helper is `bnOr`. Display numbers and times through the format helpers (`frontend/src/utils/format.js`, `mobile/src/lib/format.ts`). In Bangla they show Bangla numerals and 12-hour times with a part-of-day word (ভোর/সকাল/দুপুর/বিকাল/সন্ধ্যা/রাত). Pass `timeFormat` from `useApp()` so components re-render when it changes. Stored/API values stay ASCII `HH:MM`. Turn API failures into user-facing text with `userErrorMessage` (`utils/errors.js` / `lib/errors.ts`), and show them through `ErrorMessage` (web) or `ErrorState` (mobile) with a retry button.

User favourites are device-local: Qur'an bookmarks are in `bookmarkService`/`lib/bookmarks.ts`. Favourite du'as, hadith bookmarks and each book's last position are in `frontend/src/utils/saved.js` / `mobile/src/lib/saved.ts`. Mobile location search uses the bundled `mobile/src/data/upazilas.json`, so it works offline; keep it in sync with the backend copy.

### Optional backup & sync (sync codes)
Users can back up device-local data without an account: `POST /v1/sync/accounts` returns a code (`XXXX-XXXX-XXXX-XXXX`, 80 random bits). The server stores only its SHA-256, and the code is sent as `Authorization: Sync <code>` (`middleware/syncAuth.js`). Data is one JSON document per client storage key (`SYNC_DOC_KEYS` in `backend/src/utils/syncCode.js`: tracker, qada, Qur'an bookmarks/progress, tasbih, favourite du'as, hadith bookmarks, book positions), stored in `sync_documents` with a version. `PUT /sync/documents/:key` takes `base_version` and returns 409 if the stored version has moved on. `syncService` creates the tables on first use (also in `schema.sql`, `setup.sql` and `database/migrations/004_sync.sql`).

The clients (`mobile/src/lib/sync.ts`, `frontend/src/utils/sync.js`) keep the last-synced version and hash per document. A document that changed on only one side is copied to the other. One that changed on both sides is merged with the rules in `syncMerge.ts/.js`: unions for lists, OR for tracker marks, max for owed-prayer counts. To sync a new store, add its key to `SYNC_DOC_KEYS` **and** to `MERGERS` on both clients. Mobile keeps the code in expo-secure-store and syncs on launch, foreground and background; web keeps it in localStorage and syncs on load, visibility changes and every 10 minutes.

### Web fonts
Web fonts are self-hosted from `@fontsource/*` packages, imported in `frontend/src/main.jsx`: Noto Sans Bengali, Amiri, Scheherazade New and Noto Nastaliq Urdu. Don't add Google Fonts links; the service worker caches the bundled fonts for offline use. Mobile fonts are bundled through `@expo-google-fonts/*`, which ships the font files inside the app.

### Database schema / migrations
There are **two schema sources** — be aware which one you're editing:
- `backend/src/database/schema.sql` — used by `npm run migrate` (via `src/database/migrate.js`) and by `docker-compose.yml`'s MySQL init mount; tracks execution in a `migrations` table (batch number, status) but does **not** support true up/down rollback — `migrate:rollback` only marks rows as `rolled_back`, it doesn't reverse SQL (see `backend/README_MIGRATIONS.md`).
- `backend/scripts/setup.sql` — the fuller, more current hand-maintained schema (includes `books`, `book_chapters`, `admin_users`, Quran tables, etc.) used for setting up the production database directly.
When adding/changing tables, check whether both files need updating. Because `migrate` skips `schema.sql` once it has completed, new tables for an *existing* database must be applied by hand — standalone SQL for that goes in `database/migrations/` (e.g. `001_masjids.sql`).

The large `quran_data.sql` at the repo root is a standalone data dump (not part of the migration flow) — consumed via the seeder scripts.

### Frontend structure
Vite + React Router SPA. `App.jsx` mounts two route trees: unauthenticated `/admin/login` plus `ProtectedRoute`-gated `/admin/*` pages (no shared header/footer), and everything else under a shared `AppShell` (`Header`/`Footer`/`BottomTabBar`/`OfflineBanner`). Two React contexts drive global state: `AppContext` (location, calculation method, language, dark mode — all persisted to `localStorage`) and `AdminContext` (admin auth/session). Data fetching goes through `@tanstack/react-query` calling `services/*.js`, which wrap a shared `axios` instance (`services/api.js`) that normalizes API errors into `{ message, code, status, details, requestId }`. `i18n/translations.js` supports `en`/`bn`/`ur`/`tr`/`id` with RTL handling for `ur`; Bengali (`bn`) is the default language. Map/location picking uses `react-leaflet`, constrained to Bangladesh bounds (`utils/constants.js`).

### Environment variables
Backend reads DB connection (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`), `PORT`, `API_VERSION`, `CORS_ORIGIN`, `RATE_LIMIT_*`, and `JWT_SECRET` (admin auth — has an insecure dev default, must be overridden in production) from `.env`. Frontend reads `VITE_API_URL`/`VITE_API_VERSION` via `import.meta.env`. Rate limiting and the `helmet`/custom security middleware are only enabled when `NODE_ENV=production`.
