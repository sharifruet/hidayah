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
- `npm test` — run Jest tests (ESM via `--experimental-vm-modules`); run a single file with `npm test -- tests/calculations.test.js` or a single case with `npm test -- -t "test name"`
- `npm run lint` — ESLint (`eslint . --ext .js`); there is no `lint:fix` script — use `npx eslint . --ext .js --fix`
- `npm run format` — Prettier write on `src/**/*.js`
- `npm run migrate` / `npm run migrate:status` / `npm run migrate:rollback` — schema migration runner (see below)
- `npm run seed` — seed base data (locations, calculation methods, etc.)
- `npm run seed:quran` / `npm run seed:quran:force` — seed Quran text/translations from `src/database/quranSeeder.js` (force re-seeds)
- `npm run download:audio` — fetch per-ayah recitation audio into `backend/public/audio/` (`scripts/downloadAudio.js`)
- `npm run generate:sql` — dump current DB state to SQL (`scripts/generateSqlDump.js`)

### Frontend (`frontend/`)
- `npm run dev` / `npm start` — Vite dev server (default http://localhost:5173)
- `npm run build` — production build
- `npm run lint` — ESLint (zero warnings allowed)
- `npm run format` — Prettier write on `src/**/*.{js,jsx}`
- `npm test` — Vitest unit/component tests (jsdom); run one file with `npx vitest run src/tests/hooks/usePrayerTimes.test.js`
- `npm run test:ui` — Vitest with UI
- `npm run test:e2e` — Playwright e2e tests against `e2e/` (auto-starts the dev server; needs `npx playwright install` once locally)

### Docker (repo root)
`docker-compose up --build` starts MySQL + backend + frontend together with hot reload (backend runs migrate + seed on container start). Convenience wrappers: `./dev.sh`, `./shell.sh` (backend shell), `./mysql.sh` / `./mysql-root.sh` (MySQL CLI), `./migrate.sh`, `./seed.sh`, `./test.sh`, `./lint.sh`, `./format.sh` — these all just call `docker-compose exec backend npm run …`, so they require the stack to already be running. See `DOCKER.md` for details.

## Architecture

### Backend layering
Express request flow is strictly layered: `routes/*.js` → `middleware/validation.js` (Joi schemas) → `controllers/*.js` (parse/format only) → `services/*.js` (business logic + DB queries via the shared `mysql2` pool) → MySQL. Routes are mounted in `src/server.js` under `/${API_VERSION}` (default `/v1`): `prayer-times`, `sun-times`, `calendar`, `batch`, `locations`, `methods`, `quran`, `books`, `admin`. Admin routes (`routes/admin.js`) are protected by `middleware/adminAuth.js` (JWT bearer, `requireAdmin`); non-admin routes are public/unauthenticated.

### Prayer/sun time calculation engine
`src/utils/calculations.js` implements the astronomical formulas (solar declination, equation of time, solar noon, hour angles) directly — no external prayer-times library. `src/config/methods.js` defines ~20 named calculation methods (e.g. `karachi` [default], `mwl`, `isna`, `egyptian`, …) as angle/adjustment parameter sets that `calculations.js` consumes. Results are cached in MySQL (`prayer_times_cache`) via `src/services/cacheService.js`, keyed on lat/lng/date/method — custom angle/adjustment overrides bypass the cache entirely (see `generatePrayerTimesCacheKey`). Hijri calendar conversion is a separate self-contained tabular approximation in `src/utils/hijri.js` (and its frontend mirror `frontend/src/utils/hijri.js`).

### Quran module
`src/services/quranService.js` reads Quran text/translations from local MySQL tables (`quran_surahs`, `quran_ayahs`, `quran_editions`, `quran_translations`) when seeded, and **automatically falls back to the public `api.alquran.cloud` API** when those tables are missing or empty — so Quran endpoints work before `seed:quran` has been run. It layers an in-memory TTL cache on top (static data 24h, per-surah 6h, search 1m) independent of the seeded/fallback check, which itself is cached for 60s. Ayah audio is served as static files from `backend/public/audio/` (see `/audio` static mount in `server.js` and `scripts/downloadAudio.js`).

### Books module
Islamic e-books live in `books` (metadata: slug, topics, language, license, `content_type` = `pdf`/`epub`/`text`/embed) and, for `content_type='text'` books, `book_chapters` — a **self-referencing tree** (`parent_id` + sibling `position`) representing book/section/chapter/scene/paragraph nesting; a node is only directly readable when `content` is non-null, otherwise it's a pure container. Admin CRUD for books/chapters is in `routes/admin.js`; the public reader is `frontend/src/pages/BookReader.jsx` with admin editing in `frontend/src/pages/admin/AdminBookChapters.jsx`.

### Database schema / migrations
There are **two schema sources** — be aware which one you're editing:
- `backend/src/database/schema.sql` — used by `npm run migrate` (via `src/database/migrate.js`) and by `docker-compose.yml`'s MySQL init mount; tracks execution in a `migrations` table (batch number, status) but does **not** support true up/down rollback — `migrate:rollback` only marks rows as `rolled_back`, it doesn't reverse SQL (see `backend/README_MIGRATIONS.md`).
- `backend/scripts/setup.sql` — the fuller, more current hand-maintained schema (includes `books`, `book_chapters`, `admin_users`, Quran tables, etc.) used for setting up the production database directly.
When adding/changing tables, check whether both files need updating.

The large `quran_data.sql` at the repo root is a standalone data dump (not part of the migration flow) — consumed via the seeder scripts.

### Frontend structure
Vite + React Router SPA. `App.jsx` mounts two route trees: unauthenticated `/admin/login` plus `ProtectedRoute`-gated `/admin/*` pages (no shared header/footer), and everything else under a shared `AppShell` (`Header`/`Footer`/`BottomTabBar`/`OfflineBanner`). Two React contexts drive global state: `AppContext` (location, calculation method, language, dark mode — all persisted to `localStorage`) and `AdminContext` (admin auth/session). Data fetching goes through `@tanstack/react-query` calling `services/*.js`, which wrap a shared `axios` instance (`services/api.js`) that normalizes API errors into `{ message, code, status, details, requestId }`. `i18n/translations.js` supports `en`/`bn`/`ur`/`tr`/`id` with RTL handling for `ur`; Bengali (`bn`) is the default language. Map/location picking uses `react-leaflet`, constrained to Bangladesh bounds (`utils/constants.js`).

### Environment variables
Backend reads DB connection (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`), `PORT`, `API_VERSION`, `CORS_ORIGIN`, `RATE_LIMIT_*`, and `JWT_SECRET` (admin auth — has an insecure dev default, must be overridden in production) from `.env`. Frontend reads `VITE_API_URL`/`VITE_API_VERSION` via `import.meta.env`. Rate limiting and the `helmet`/custom security middleware are only enabled when `NODE_ENV=production`.
