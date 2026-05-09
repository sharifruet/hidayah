# Product Requirements Document (PRD): Qur’an Module (Quran.com-like)
## 1. Executive Summary

### 1.1 Goal
Add a **Qur’an reading experience** to this project that feels similar to Quran.com: fast, searchable, mobile-first, multilingual, and audio-enabled—while keeping the system maintainable and API-driven.

### 1.2 Non-goals (Initial Release)
- No user accounts, sync, or social features in v1
- No authoring/admin UI in v1 (content is loaded via seed/import pipeline)
- No AI features in v1

---

## 2. Users and Use Cases

### 2.1 Primary Users
- Readers who want to **read by surah/juz**, with translations and tafsir
- Learners who need **word-by-word**, transliteration, and audio recitation
- Users who want **quick search** for ayah text/translation

### 2.2 Core Use Cases
- Open Qur’an and continue where I left off
- Navigate to a surah/ayah quickly
- Read Arabic with one or more translations
- Play recitation (surah or ayah-level) with repeat and speed controls
- Search across Arabic and translations
- Copy/share with proper citation (surah/ayah/range, translation)

---

## 3. Information Architecture (IA)

### 3.1 Primary Navigation
- **Qur’an**
  - Surah list
  - Juz list
  - Page/Mushaf view (optional in v1; recommended in v2)
- **Search**
- **Settings** (reader preferences)
- **Memorization** (optional in v1; recommended in v2)

### 3.2 Key Screens
- Surah list (sortable, searchable)
- Surah reading view (ayah list)
- Mushaf (page) view (page-by-page, with page navigation)
- Ayah actions sheet (copy/share/bookmark/play)
- Search results (grouped by surah, supports filters)
- Settings (translations, font size, display modes, audio reciter)
- Memorization view (repeat, hide/show, test mode)

---

## 4. Functional Requirements

### 4.1 Qur’an Content
**FR-1 Surah index**
- Show 114 surahs with: number, Arabic name, transliterated name, English/Bengali name (if available), ayah count, revelation type (Meccan/Medinan).

**FR-2 Ayah retrieval**
- Fetch ayahs by surah, and optionally by range (e.g., 1–10) for pagination/performance.
- Return Arabic text, ayah number, and metadata (juz, hizb, page, sajdah markers if available).

**FR-3 Multiple translations**
- Support selecting 1..N translations (e.g., English, Bengali).
- Show translations per ayah (stacked or tabbed).
- Support translation discovery UX:
  - search/filter translations by language and name
  - show translator/source metadata (author, brief description if available)
  - show license/copyright attribution where appropriate

**FR-4 Tafsir (optional in v1, required in v2)**
- Support at least one tafsir source and language selection if available.
- Tafsir should be accessible per ayah (expand/collapse).

**FR-5 Word-by-word + transliteration (optional in v1, recommended)**
- Provide word segmentation for Arabic (word position), English gloss, and transliteration.
- Toggleable per user settings.

### 4.2 Reading Experience
**FR-6 Reader settings**
- Font size (Arabic + translation separately)
- Arabic font family (if supported by frontend)
- Line spacing / compact mode
- Show/hide: transliteration, word-by-word, tafsir
- Default translation(s)

**FR-7 Resume**
- Persist last read position (surah + ayah + scroll offset if feasible) locally in browser.
- Persist last-used reader mode (list vs mushaf) and translation selection.

**FR-8 Deep links**
- Support stable URLs like:
  - `/quran` (landing)
  - `/quran/:surah`
  - `/quran/:surah/:ayah`
  - `/quran/:surah/:fromAyah-:toAyah` (ayah range)
  - `/quran/page/:pageNumber` (mushaf page; optional in v1, required in v2)
  - `/search?q=...`

**FR-8.1 Mushaf (page) view**
- Provide a **Mushaf page view** that matches the common 604-page Madani mushaf experience (exact page count depends on the chosen dataset).
- Capabilities:
  - Navigate by page (prev/next, jump to page)
  - Show surah headers and ayah markers as per the mushaf dataset
  - Tap/click an ayah marker to open ayah actions (share/copy/play/bookmark)
- Mapping requirements:
  - Each ayah must be mappable to a mushaf page number (`page`) and position within the page dataset.
  - Deep links to `/quran/page/:pageNumber` must be stable.

**FR-9 Share + citation (surah/ayah/range + translation)**
- **Link sharing**:
  - Share a link to a **surah**, an **ayah**, or an **ayah range**.
  - Shared links must preserve selected translation(s) when appropriate (e.g., `?translations=en.sahih,bn.someone`), but still render a sensible default when the parameter is missing.
- **Copy/citation formats** (user-selectable from an actions sheet):
  - Copy **Arabic only**
  - Copy **translation only** (choose which translation if multiple are enabled)
  - Copy **Arabic + translation**
- **Citation requirements** (always included unless user explicitly toggles “no citation”):
  - Include reference as `SurahName (SurahNumber:AyahNumber)` or `SurahName (SurahNumber:From-To)` for ranges
  - Include translation attribution when copying translations: `— <Translation Name>, <Author>` (or equivalent metadata)
  - Include canonical deep link at the end (or as “Copied link” action)
- **Range sharing behavior**:
  - When copying a range, include each ayah as a separate paragraph (Arabic then translation), and the final citation should reference the **range**.
- **Easy UI access**:
  - Share/copy must be available from:
    - Surah header (share surah / copy citation)
    - Each ayah row (share/copy this ayah)
    - Range selection mode (share/copy selected range)

### 4.3 Audio
**FR-10 Reciter selection**
- Provide a list of reciters (id, name, style, available quality/bitrate).

**FR-11 Playback**
- Play by ayah (primary)
- Play continuous surah from a selected ayah
- Controls: play/pause, next/prev ayah, seek (if file supports), speed (0.75x–1.5x), repeat (ayah, range, surah)
- Listening modes:
  - **Follow-along**: auto-scroll/highlight current ayah while playing (basic in v1; polished in v2)
  - **Background audio**: keep playing with screen off where the browser/platform allows
  - **Sleep timer** (optional in v1; recommended in v2)

**FR-12 Highlight sync (v2)**
- Highlight currently playing ayah.
- Optional word-level highlight if timing data exists.

### 4.4 Search
**FR-13 Search across Arabic + translations**
- Query returns matched ayahs with context: surah, ayah, snippet, matched fields.
- Filters: surah, juz, translation source, language.

**FR-14 Search UX**
- Typeahead suggestions (optional)
- Recent searches (local)

### 4.5 Memorization
**FR-15 Memorization tools (recommended for v2; partial in v1)**
- Provide memorization-friendly features:
  - **Repeat loop**: repeat one ayah or a selected range with configurable repeat count (e.g., 1–99) and optional pause between repeats
  - **Hide/show**: toggle visibility of Arabic text and/or translation for self-testing
  - **Chunking**: quick selection of common ranges (e.g., 1 ayah, 3 ayah, 5 ayah, 10 ayah; or “from current to end of page” in mushaf mode)
- Persist memorization preferences locally.
- (v2) Optional “test mode” that prompts the next ayah without showing it until revealed.

---

## 5. API Requirements (Backend)

### 5.1 Public Endpoints (v1)
All endpoints are prefixed with `/v1/`.

- `GET /v1/quran/surahs`
  - Returns surah index.
- `GET /v1/quran/surahs/:surahNumber`
  - Returns surah metadata + optionally first page of ayahs.
- `GET /v1/quran/surahs/:surahNumber/ayahs`
  - Query:
    - `from` (default 1)
    - `to` (optional) OR `limit` (optional)
    - `translations` (comma-separated translation ids)
    - `include_words` (bool)
    - `include_tafsir` (bool)
- `GET /v1/quran/ayah`
  - Query: `surah`, `ayah`, `translations`, `include_words`, `include_tafsir`
- `GET /v1/quran/translations`
  - Returns available translations (id, language, name, author, copyright/license).
- `GET /v1/quran/tafsirs`
  - Returns available tafsir sources (id, language, name).
- `GET /v1/quran/reciters`
  - Returns available reciters (id, name, baseUrl/template, supported formats).
- `GET /v1/quran/search`
  - Query:
    - `q` (required)
    - `lang` (optional)
    - `translation` (optional, translation id)
    - `surah` (optional)
    - `page` / `limit`

- `GET /v1/quran/pages/:pageNumber`
  - Purpose: mushaf page retrieval.
  - Query:
    - `translations` (optional, comma-separated translation ids)
    - `include_words` (bool)
  - Returns:
    - page metadata and the ordered ayah segments required to render that page.

- `GET /v1/quran/citation`
  - Purpose: return **pre-formatted** citation/copy payloads so clients are consistent.
  - Query:
    - `surah` (required)
    - `from` (required)
    - `to` (optional; default = `from`)
    - `translations` (optional, comma-separated ids)
    - `format` (optional): `text` | `markdown`
    - `include_arabic` (bool, default true)
    - `include_translation` (bool, default true)
  - Response includes:
    - `reference` (e.g., `Al-Fātiḥah (1:1-7)`)
    - `items[]` (each ayah: arabic + selected translation text(s))
    - `attribution[]` (translation id → name/author/license)
    - `permalink` (canonical URL for the same surah/ayah/range + translation params)

### 5.2 Response Standards
- JSON only in v1
- Consistent envelope:
  - `meta` (request parameters echoed, paging info, sources)
  - `data`
- Standard error shape:
  - `error.code`, `error.message`, `error.details`

### 5.3 Versioning and Compatibility
- Backward-compatible additions only within `/v1/`.
- Breaking changes require `/v2/`.

---

## 6. Data Requirements

### 6.1 Core Entities
- **Surah**
  - `number`, `name_ar`, `name_translit`, `name_en` (and/or `name_bn`), `ayah_count`, `revelation_type`
- **Ayah**
  - `surah_number`, `ayah_number`, `text_ar`
  - optional metadata: `juz`, `hizb`, `page`, `sajdah_type`
- **Translation**
  - `id`, `language`, `name`, `author`, `license`, `text` keyed by (surah, ayah)
- **Tafsir**
  - `id`, `language`, `name`, `text` keyed by (surah, ayah)
- **Word**
  - `surah_number`, `ayah_number`, `position`, `text_ar`, `transliteration`, `gloss`
- **Reciter**
  - `id`, `name`, `audio_template` (e.g., `https://.../{surah}/{ayah}.mp3`)

### 6.2 Storage Approach (Recommendation)
- MySQL tables for indexes + text content (UTF-8 `utf8mb4`)
- Add full-text search strategy:
  - v1: MySQL FULLTEXT on translation text + optional Arabic (limited)
  - v2: dedicated search engine (Meilisearch/Elasticsearch) if needed

### 6.3 Content Sourcing / Licensing
- Must track:
  - Source name, version, and license for Arabic text and each translation/tafsir
- Ensure the repo includes a `docs/` note on licenses used for distributed content.

---

## 7. Frontend Requirements

### 7.1 Routing
- Add a `Quran` section to the React app with routes described in **FR-8**.

### 7.2 Components (Suggested)
- `SurahList`
- `SurahHeader`
- `AyahRow` (Arabic, translation(s), actions)
- `ReaderSettingsDrawer`
- `AudioPlayerBar`
- `SearchBox`, `SearchResults`

### 7.3 Performance
- Virtualized list rendering for long surahs (or pagination by range).
- Cache responses per surah/translation selection.

### 7.4 Localization
- UI labels should support **English + Bengali** (consistent with existing app direction).

---

## 8. Non-Functional Requirements

### 8.1 Accessibility
- Keyboard navigable reader
- Proper semantics for headings (surah) and list items (ayah)
- Audio controls accessible via keyboard and screen readers

### 8.2 Security
- Rate limiting on search endpoints
- Input validation (query length, allowed params)
- Content is read-only; no user-auth required in v1

### 8.3 Observability
- Log endpoint latency and cache hit ratio (especially search + surah fetch)

---

## 9. Analytics (Optional)
- Track (privacy-preserving) events:
  - surah viewed, ayah played, search executed
- Store only aggregates (no PII) unless explicit consent is added later.

---

## 10. Milestones / Phasing

### Phase A (MVP)
- Surah list + surah reader
- 1–2 translations (including Bengali if available)
- Ayah-level audio playback (1 reciter)
- Basic search over translations
- Reader settings + resume
- Share/copy with citations (surah/ayah/range) + translation attribution

### Phase B
- Multiple translations + tafsir
- Word-by-word + transliteration
- Better search filters + highlighting
- Listening UX upgrades (follow-along highlight, sleep timer)
- Memorization (repeat loop + hide/show)

### Phase C
- Mushaf page view (complete), bookmarks, sync (requires accounts), audio timing sync

---

## 11. Acceptance Criteria (MVP)
- User can open `/quran`, pick a surah, read Arabic + translation(s) with fast load.
- User can play an ayah, auto-advance, and see which ayah is playing.
- Search for a term returns relevant ayahs in < 500ms for typical queries (dev environment may differ).
- Deep links to `/quran/:surah/:ayah` open at the correct ayah.
- User can share/copy a **surah link**, a **single ayah link**, and an **ayah range link**.
- User can copy **translation text with attribution** and a clear reference (`surah:ayah` or `surah:from-to`).
- User can switch translations from settings and see them applied consistently in the reader.
- Settings persist between reloads (local storage).

