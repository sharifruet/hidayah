/**
 * Hadith service — reads Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah,
 * and Muwatta Malik (Arabic + Bangla + English) from local MySQL tables, seeded
 * once from fawazahmed0/hadith-api (public domain).
 *
 * Seed local DB: node src/database/hadithSeeder.js
 */

import pool from '../config/database.js';

// Canonical presentation order (Sihah Sittah, then Muwatta).
const COLLECTION_ORDER = ['bukhari', 'muslim', 'abudawud', 'tirmidhi', 'nasai', 'ibnmajah', 'malik'];

function defaultEdition(slug, language = 'en') {
  return `${language === 'bn' ? 'ben' : 'eng'}-${slug}`;
}

// ─── In-memory cache (hot path) ───────────────────────────────────────────────

const cache = new Map();

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null; }
  return entry.data;
}

function setCache(key, data, ttlMs) {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

const TTL_STATIC = 24 * 60 * 60 * 1000; // 24 h
const TTL_BOOK   =  6 * 60 * 60 * 1000; //  6 h
const TTL_SEARCH =      60 * 1000;      //  1 m

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseGrades(grades) {
  if (!grades) return [];
  return typeof grades === 'string' ? JSON.parse(grades) : grades;
}

async function fetchTranslationMap(collectionSlug, hadithNumbers, editions) {
  const map = new Map(); // hadithnumber → [{edition, language, name, text}]
  if (!editions.length || !hadithNumbers.length) return map;

  const placeholders = hadithNumbers.map(() => '?').join(',');
  for (const edition of editions) {
    const [rows] = await pool.execute(
      `SELECT ht.hadithnumber, ht.text, he.language, he.name
       FROM hadith_translations ht
       JOIN hadith_editions he ON he.identifier = ht.edition
       WHERE ht.edition = ? AND ht.collection_slug = ? AND ht.hadithnumber IN (${placeholders})`,
      [edition, collectionSlug, ...hadithNumbers]
    );
    for (const row of rows) {
      if (!map.has(row.hadithnumber)) map.set(row.hadithnumber, []);
      map.get(row.hadithnumber).push({
        edition, language: row.language, name: row.name, text: row.text,
      });
    }
  }
  return map;
}

function formatHadith(row, translationMap) {
  return {
    hadithnumber:   row.hadithnumber,
    in_book_number: row.in_book_number,
    arabic_number:  row.arabic_number,
    book_number:    row.book_number,
    text_ar:        row.text_ar,
    grades:         parseGrades(row.grades),
    translations:   translationMap.get(row.hadithnumber) || [],
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getCollections() {
  const cacheKey = 'hadith-collections';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const [rows] = await pool.execute(
    'SELECT slug, name, total_hadiths, total_books FROM hadith_collections'
  );
  const result = rows.sort(
    (a, b) => COLLECTION_ORDER.indexOf(a.slug) - COLLECTION_ORDER.indexOf(b.slug)
  );

  setCache(cacheKey, result, TTL_STATIC);
  return result;
}

export async function getCollection(slug) {
  const collections = await getCollections();
  return collections.find((c) => c.slug === slug) || null;
}

export async function getBooks(slug) {
  const collection = await getCollection(slug);
  if (!collection) return null;

  const cacheKey = `hadith-books-${slug}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const [rows] = await pool.execute(
    `SELECT book_number, name, hadithnumber_first, hadithnumber_last
     FROM hadith_books WHERE collection_slug = ? ORDER BY book_number`,
    [slug]
  );

  setCache(cacheKey, rows, TTL_STATIC);
  return rows;
}

export async function getBook(slug, bookNumber) {
  const books = await getBooks(slug);
  if (!books) return null;
  return books.find((b) => b.book_number === bookNumber) || null;
}

export async function getBookWithHadiths(slug, bookNumber, translations) {
  const [collection, book] = await Promise.all([getCollection(slug), getBook(slug, bookNumber)]);
  if (!collection || !book) return null;

  const editions = translations && translations.length ? translations : [defaultEdition(slug)];
  const cacheKey = `hadith-book-${slug}-${bookNumber}-${[...editions].sort().join(',')}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const [rows] = await pool.execute(
    `SELECT hadithnumber, in_book_number, arabic_number, book_number, text_ar, grades
     FROM hadiths WHERE collection_slug = ? AND book_number = ? ORDER BY hadithnumber`,
    [slug, bookNumber]
  );

  const translationMap = await fetchTranslationMap(slug, rows.map((r) => r.hadithnumber), editions);

  const result = {
    collection,
    book,
    hadiths: rows.map((r) => formatHadith(r, translationMap)),
  };

  setCache(cacheKey, result, TTL_BOOK);
  return result;
}

export async function getHadith(slug, hadithNumber, translations) {
  const collection = await getCollection(slug);
  if (!collection) return null;

  const editions = translations && translations.length ? translations : [defaultEdition(slug)];
  const cacheKey = `hadith-${slug}-${hadithNumber}-${[...editions].sort().join(',')}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const [[row]] = await pool.execute(
    `SELECT hadithnumber, in_book_number, arabic_number, book_number, text_ar, grades
     FROM hadiths WHERE collection_slug = ? AND hadithnumber = ?`,
    [slug, hadithNumber]
  );
  if (!row) return null;

  const translationMap = await fetchTranslationMap(slug, [row.hadithnumber], editions);
  const result = { collection, ...formatHadith(row, translationMap) };

  setCache(cacheKey, result, TTL_BOOK);
  return result;
}

export async function getEditions(language) {
  const cacheKey = `hadith-editions-${language || 'all'}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const params = [];
  let where = '';
  if (language) {
    where = 'WHERE language = ?';
    params.push(language);
  }

  const [rows] = await pool.execute(
    `SELECT identifier AS id, collection_slug, language, name, author, direction
     FROM hadith_editions ${where} ORDER BY collection_slug, language`,
    params
  );

  setCache(cacheKey, rows, TTL_STATIC);
  return rows;
}

export async function searchHadiths({ q, language = 'en', collection = 'all', page = 1, limit = 20 }) {
  const cacheKey = `hadith-search-${q}-${language}-${collection}-${page}-${limit}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const where = [
    'he.language = ?',
    'MATCH(ht.text) AGAINST (? IN BOOLEAN MODE)',
  ];
  const params = [language, `${q}*`];

  if (collection !== 'all') {
    where.push('ht.collection_slug = ?');
    params.push(collection);
  }
  const whereClause = where.join(' AND ');

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM hadith_translations ht
     JOIN hadith_editions he ON he.identifier = ht.edition
     WHERE ${whereClause}`,
    params
  );
  const total = countRows[0].total;

  const offset = (page - 1) * limit;
  // pool.query (not .execute) — mysql2's prepared-statement path errors on LIMIT/OFFSET placeholders.
  const [rows] = await pool.query(
    `SELECT ht.collection_slug, ht.hadithnumber, ht.text, hc.name AS collection_name, h.book_number
     FROM hadith_translations ht
     JOIN hadith_editions he ON he.identifier = ht.edition
     JOIN hadith_collections hc ON hc.slug = ht.collection_slug
     JOIN hadiths h ON h.collection_slug = ht.collection_slug AND h.hadithnumber = ht.hadithnumber
     WHERE ${whereClause}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const result = {
    q, language, collection, total, page, limit,
    total_pages: Math.ceil(total / limit),
    matches: rows.map((r) => ({
      collection_slug: r.collection_slug,
      collection_name: r.collection_name,
      book_number:     r.book_number,
      hadithnumber:    r.hadithnumber,
      text:            r.text,
    })),
  };

  setCache(cacheKey, result, TTL_SEARCH);
  return result;
}
