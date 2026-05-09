# Hidayah Books — SRS & PRD

**Document type:** Combined Software Requirements Specification (SRS) and Product Requirements Document (PRD)  
**Version:** 1.0 (Hidayah-adapted)  
**Product:** *Hidayah Books* — Islamic book catalog and reader, integrated into the Hidayah prayer-times app  
**Tech stack:** React 18 + Vite + Tailwind CSS (frontend), Express.js + MySQL (backend), Docker Compose  
**Content focus:** Curated Islamic books (fiqh, seerah, aqeedah, hadith, tafsir, spirituality, history, dawah, children's), with Arabic/RTL support where applicable  
**Related:** Qur'an module requirements: `docs/QURAN_REQUIREMENTS.md`

---

## 1. Executive Summary

Hidayah Books is a free-to-read catalog and reader for Islamic books integrated into the Hidayah app. Books are sourced from public domain archives and publisher agreements. The reading experience defaults to a calm, paper-like surface — warm cream, muted ink, generous margins — that feels like opening a physical book, not a web dashboard.

No user accounts, payments, or DRM in MVP. Every book on the `live` shelf is readable immediately.

---

## 2. Product Vision

**North star:** A reader picks up a free Islamic book in Hidayah and finishes reading it the same week because the experience felt calm, the content was trustworthy, and the Arabic rendered beautifully.

**Vision pillars:**

| Pillar | Outcome |
|--------|---------|
| Reading comfort | Warm paper theme; no pure #FFFFFF reader canvas |
| Trust | Clear author/publisher attribution; license visible |
| Arabic/RTL | Correct direction, legible Arabic font stack |
| Discoverability | Topic + language filters; search |
| Zero friction | No account required; read free books immediately |

**Anti-goals for MVP:** Subscriptions, purchases, DRM, user libraries, highlights sync, social features, offline download packages, admin UI (books added via seed/migration scripts).

---

## 3. Functional Requirements

### 3.1 Catalog (Books page — `/books`)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CAT-01 | Browse all `live` books in a grid (cover, title, author, topic badges) | P0 |
| FR-CAT-02 | Filter by Islamic topic: All, Hadith, Seerah, Fiqh, Aqeedah, Tafsir, Spirituality, History, Dawah, Children | P0 |
| FR-CAT-03 | Filter by language: All, English, Arabic, Bengali, Urdu | P0 |
| FR-CAT-04 | Text search across title, author, description (LIKE query, debounced) | P0 |
| FR-CAT-05 | UI in English + Bengali (consistent with app `language` setting) | P0 |

### 3.2 Book Detail (`/books/:slug`)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DET-01 | Display cover, title (+ Arabic title when available), subtitle, description | P0 |
| FR-DET-02 | Attribution: author, translator, publisher, year, original language | P0 |
| FR-DET-03 | Islamic topic badges + language badge | P0 |
| FR-DET-04 | License class: Public Domain, Creative Commons, All Rights Reserved | P0 |
| FR-DET-05 | Read button → `/books/:slug/read` | P0 |
| FR-DET-06 | Format indicators: PDF available, EPUB available | P0 |

### 3.3 Reader (`/books/:slug/read`)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-RDR-01 | Warm paper theme: cream `#f5f0e8` background, muted ink `#2c2416`; not pure #FFF or #000 | P0 |
| FR-RDR-02 | PDF rendered via `<iframe>` embed (archive.org or direct URL) | P0 |
| FR-RDR-03 | EPUB rendered via archive.org embed iframe | P0 |
| FR-RDR-04 | If both PDF and EPUB available: format toggle in top bar | P1 |
| FR-RDR-05 | Focus mode: hide top bar, full iframe | P1 |
| FR-RDR-06 | Back navigation to book detail page | P0 |
| FR-RDR-07 | Dark mode: dark parchment `#1c1a16`, warm text `#e8dfc8` | P0 |
| FR-RDR-08 | Arabic/RTL books embedded natively via iframe (renderer handles direction) | P0 |

### 3.4 API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/books` | List live books. Query: `?topic=&lang=&q=&page=&limit=` |
| GET | `/v1/books/topics` | Static list of Islamic topic categories with labels |
| GET | `/v1/books/:slug` | Book detail by slug |

---

## 4. Non-Functional Requirements

| ID | Category | Requirement | Target |
|----|----------|-------------|--------|
| NFR-01 | Performance | Books list response | < 200 ms (MySQL indexed query) |
| NFR-02 | Accessibility | Reader theme contrast | WCAG AA body text |
| NFR-03 | RTL | Arabic-primary books | `dir="rtl"` inherited from archive.org embed |
| NFR-04 | Mobile | Touch targets | ≥ 44 px |
| NFR-05 | Dark mode | All surfaces | Full dark mode support via Tailwind `dark:` |

---

## 5. Database Design (MySQL)

```sql
CREATE TABLE IF NOT EXISTS books (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug            VARCHAR(120) NOT NULL,
  title           VARCHAR(255) NOT NULL,
  title_ar        VARCHAR(255),
  subtitle        VARCHAR(255),
  description     TEXT,
  language        ENUM('en','ar','bn','ur') NOT NULL DEFAULT 'en',
  primary_text_language ENUM('en','ar','bn','ur') NOT NULL DEFAULT 'en',
  islamic_topics  JSON NOT NULL,
  author          VARCHAR(255),
  translator      VARCHAR(255),
  publisher       VARCHAR(255),
  published_year  SMALLINT UNSIGNED,
  cover_url       VARCHAR(500),
  pdf_url         VARCHAR(500),
  epub_url        VARCHAR(500),
  embed_url       VARCHAR(500),
  page_count      SMALLINT UNSIGNED,
  license_class   ENUM('public_domain','creative_commons','all_rights_reserved')
                  NOT NULL DEFAULT 'public_domain',
  rights_notes    TEXT,
  status          ENUM('draft','live','archived') NOT NULL DEFAULT 'draft',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_books_slug (slug),
  INDEX idx_books_status (status),
  INDEX idx_books_language (language),
  FULLTEXT INDEX idx_books_search (title, subtitle, author, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

Fields:
- `slug` — stable URL key (e.g. `sealed-nectar`); never auto-generated from title
- `islamic_topics` — JSON array of topic strings (e.g. `["seerah","history"]`)
- `embed_url` — archive.org embed URL for iframe; may differ from `pdf_url`
- `status = 'draft'` default; set to `'live'` in seed to publish

---

## 6. UI/UX Specifications

### 6.1 Reader theme tokens (CSS custom properties in `index.css`)

```css
:root {
  --reader-bg: #f5f0e8;
  --reader-text: #2c2416;
}
.dark {
  --reader-bg: #1c1a16;
  --reader-text: #e8dfc8;
}
```

### 6.2 Topic colour map (static; Tailwind classes)

| Topic | Badge classes |
|-------|--------------|
| hadith | `bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300` |
| seerah | `bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300` |
| fiqh | `bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300` |
| aqeedah | `bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300` |
| tafsir | `bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300` |
| spirituality | `bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300` |
| history | `bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300` |
| children | `bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300` |
| dawah | `bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300` |

### 6.3 Navigation changes

**Bottom tab bar (mobile):** Home | Prayer | Qur'an | **Books** | Settings  
*(Du'a moves to header nav only)*

**Header nav (desktop):** Home | Prayer Times | Calendar | Qur'an | **Books** | Du'a | Settings

### 6.4 Layout

- Books grid: 2 cols (mobile) → 3 cols (md) → 4 cols (xl)
- Book card: fixed aspect-ratio cover (3:4), title, author, topic badges
- Reader max-width: `max-w-5xl mx-auto` for the iframe container; outer bg is `--reader-bg`

---

## 7. Seed Content (MVP)

8 Islamic public domain books from archive.org:

| Slug | Title | Author | Topics |
|------|-------|--------|--------|
| `riyad-as-salihin` | Riyad as-Salihin | Imam al-Nawawi | hadith, spirituality |
| `sealed-nectar` | The Sealed Nectar | Saif ur-Rahman Mubarakpuri | seerah |
| `fiqh-us-sunnah` | Fiqh us-Sunnah (Vol. 1) | Sayyid Sabiq | fiqh |
| `tafsir-ibn-kathir-1` | Tafsir Ibn Kathir (Vol. 1) | Ibn Kathir | tafsir |
| `forty-hadith-nawawi` | Forty Hadith | Imam al-Nawawi | hadith |
| `three-fundamental-principles` | The Three Fundamental Principles | Muhammad ibn Abd al-Wahhab | aqeedah |
| `dont-be-sad` | Don't Be Sad | Aaidh al-Qarni | spirituality |
| `stories-of-the-prophets` | Stories of the Prophets | Ibn Kathir | seerah, history |

Cover images: `https://archive.org/services/img/{identifier}`  
Embed URLs: `https://archive.org/embed/{identifier}`

---

## 8. Tech Stack (Hidayah-specific)

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | React 18 + Vite + Tailwind CSS | Existing stack |
| Routing | React Router v6 | Existing |
| Data fetching | TanStack React Query | Existing |
| Backend | Express.js + mysql2 | Existing |
| Database | MySQL 8 (Docker) | Existing |
| EPUB/PDF rendering | iframe embed (archive.org) | MVP; no epubjs dep |
| Admin / ingestion | Seed script (`booksSeeder.js`) | MVP; web admin is post-MVP |

---

## 9. MVP Scope

**In:** Book catalog with topic/language/search filters; book detail with attribution; paper-themed iframe reader; 8 seeded public-domain books; dark mode; EN/BN UI; REST API.

**Out (post-MVP):** User accounts, highlights/bookmarks, epub.js custom reader, offline download, admin web panel, subscriptions, publisher portal, semantic search, recommendation engine.

---

## 10. Post-MVP Roadmap

| Phase | Features |
|-------|---------|
| P1 | epub.js reader (replace iframe for EPUB); reading progress persistence (localStorage); table of contents navigation |
| P2 | Admin web panel (book CRUD, asset upload, lifecycle); user bookmarks + highlights |
| P3 | Subscriptions/purchases; publisher portal; semantic search (Meilisearch); offline download |

---

*End of document.*
