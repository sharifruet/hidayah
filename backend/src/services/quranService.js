/**
 * Quran service — reads from local MySQL database when seeded,
 * falls back to alquran.cloud API automatically when tables are
 * missing or empty (i.e. before running the seeder).
 *
 * Seed local DB: node src/database/quranSeeder.js
 * Download audio: node scripts/downloadAudio.js
 */

import pool from '../config/database.js';

// ─── alquran.cloud fallback ───────────────────────────────────────────────────

const ALQURAN_BASE = 'https://api.alquran.cloud/v1';

async function alquranFetch(path) {
  const url = `${ALQURAN_BASE}${path}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`alquran.cloud error ${res.status} for ${path}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.status || `alquran.cloud returned code ${json.code}`);
  return json.data;
}

// Returns true when the local quran_ayahs table exists and has data.
let _dbReady = null; // null = unchecked, true/false = cached result
async function isDbSeeded() {
  if (_dbReady !== null) return _dbReady;
  try {
    const [[row]] = await pool.execute('SELECT COUNT(*) AS cnt FROM quran_ayahs LIMIT 1');
    _dbReady = row.cnt > 0;
  } catch {
    _dbReady = false;
  }
  // Re-check every 60 s so seeding mid-session is picked up automatically
  setTimeout(() => { _dbReady = null; }, 60_000);
  return _dbReady;
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

const TTL_STATIC = 24 * 60 * 60 * 1000;  // 24 h
const TTL_SURAH  =  6 * 60 * 60 * 1000;  //  6 h
const TTL_SEARCH =      60 * 1000;        //  1 m

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripBismillah(text) {
  if (!text.startsWith('بِسْمِ')) return text;
  for (const ending of ['ٱلرَّحِيمِ', 'الرَّحِيمِ']) {
    const idx = text.indexOf(ending);
    if (idx !== -1) return text.slice(idx + ending.length).trimStart();
  }
  return text;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getSurahIndex() {
  const cacheKey = 'surah-index';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  if (!(await isDbSeeded())) {
    // ── Fallback: alquran.cloud ──
    const data = await alquranFetch('/surah');
    const result = data.map((s) => ({
      number:          s.number,
      name_ar:         s.name,
      name_en:         s.englishName,
      name_en_trans:   s.englishNameTranslation,
      revelation_type: s.revelationType,
      ayah_count:      s.numberOfAyahs,
    }));
    setCache(cacheKey, result, TTL_STATIC);
    return result;
  }

  const [rows] = await pool.execute(
    'SELECT number, name_ar, name_en, name_en_trans, revelation_type, ayah_count FROM quran_surahs ORDER BY number'
  );

  const result = rows.map((s) => ({
    number:          s.number,
    name_ar:         s.name_ar,
    name_en:         s.name_en,
    name_en_trans:   s.name_en_trans,
    revelation_type: s.revelation_type,
    ayah_count:      s.ayah_count,
  }));

  setCache(cacheKey, result, TTL_STATIC);
  return result;
}

export async function getSurahMeta(surahNumber) {
  const index = await getSurahIndex();
  const meta = index.find((s) => s.number === surahNumber);
  if (!meta) throw new Error(`Surah ${surahNumber} not found`);
  return meta;
}

export async function getSurahWithTranslations(surahNumber, translations = ['en.sahih']) {
  const cacheKey = `surah-${surahNumber}-${[...translations].sort().join(',')}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  if (!(await isDbSeeded())) {
    // ── Fallback: alquran.cloud ──
    const editions = ['quran-uthmani', ...translations].join(',');
    const data = await alquranFetch(`/surah/${surahNumber}/editions/${editions}`);
    const arabicEd = data[0];
    const trEds = data.slice(1);
    const needsStrip = surahNumber !== 1 && surahNumber !== 9;
    const ayahs = arabicEd.ayahs.map((ayah, idx) => ({
      number:        ayah.numberInSurah,
      number_global: ayah.number,
      text_ar:       (needsStrip && ayah.numberInSurah === 1) ? stripBismillah(ayah.text) : ayah.text,
      juz:           ayah.juz,
      hizb:          ayah.hizbQuarter,
      page:          ayah.page,
      sajdah:        ayah.sajda || false,
      translations:  trEds.map((ed) => ({
        edition: ed.edition.identifier,
        name:    ed.edition.englishName,
        author:  ed.edition.author || '',
        text:    ed.ayahs[idx]?.text || '',
      })),
    }));
    const result = {
      number:          arabicEd.number,
      name_ar:         arabicEd.name,
      name_en:         arabicEd.englishName,
      name_en_trans:   arabicEd.englishNameTranslation,
      revelation_type: arabicEd.revelationType,
      ayah_count:      arabicEd.numberOfAyahs,
      ayahs,
    };
    setCache(cacheKey, result, TTL_SURAH);
    return result;
  }

  // ── Local DB ──
  const [[surah]] = await pool.execute(
    'SELECT number, name_ar, name_en, name_en_trans, revelation_type, ayah_count FROM quran_surahs WHERE number = ?',
    [surahNumber]
  );
  if (!surah) throw new Error(`Surah ${surahNumber} not found`);

  // Ayahs
  const [ayahRows] = await pool.execute(
    `SELECT ayah_number, number_global, text_ar, page, juz, hizb, sajdah
     FROM quran_ayahs WHERE surah_number = ? ORDER BY ayah_number`,
    [surahNumber]
  );

  // Translations — one query per edition (keeps query simple and cacheable)
  const translationMap = new Map(); // ayah_number → [{edition, name, author, text}]
  for (const editionId of translations) {
    const [trRows] = await pool.execute(
      `SELECT qt.ayah_number, qt.text, qe.name, qe.author
       FROM quran_translations qt
       JOIN quran_editions qe ON qe.identifier = qt.edition
       WHERE qt.edition = ? AND qt.surah_number = ?
       ORDER BY qt.ayah_number`,
      [editionId, surahNumber]
    );
    for (const tr of trRows) {
      if (!translationMap.has(tr.ayah_number)) translationMap.set(tr.ayah_number, []);
      translationMap.get(tr.ayah_number).push({
        edition: editionId,
        name:    tr.name,
        author:  tr.author || '',
        text:    tr.text,
      });
    }
  }

  const needsBismillahStrip = surahNumber !== 1 && surahNumber !== 9;

  const ayahs = ayahRows.map((a) => ({
    number:         a.ayah_number,
    number_global:  a.number_global,
    text_ar:        (needsBismillahStrip && a.ayah_number === 1)
                      ? stripBismillah(a.text_ar)
                      : a.text_ar,
    juz:            a.juz,
    hizb:           a.hizb,
    page:           a.page,
    sajdah:         !!a.sajdah,
    translations:   translationMap.get(a.ayah_number) || [],
  }));

  const result = {
    number:          surah.number,
    name_ar:         surah.name_ar,
    name_en:         surah.name_en,
    name_en_trans:   surah.name_en_trans,
    revelation_type: surah.revelation_type,
    ayah_count:      surah.ayah_count,
    ayahs,
  };

  setCache(cacheKey, result, TTL_SURAH);
  return result;
}

export async function getAyah(surahNumber, ayahNumber, translations = ['en.sahih']) {
  const surah = await getSurahWithTranslations(surahNumber, translations);
  const ayah = surah.ayahs.find((a) => a.number === ayahNumber);
  if (!ayah) throw new Error(`Ayah ${surahNumber}:${ayahNumber} not found`);
  return { surah: { number: surah.number, name_ar: surah.name_ar, name_en: surah.name_en }, ...ayah };
}

export async function getTranslations() {
  const cacheKey = 'editions-list';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  if (!(await isDbSeeded())) {
    const data = await alquranFetch('/edition?type=translation&format=text');
    const result = data.map((ed) => ({
      id: ed.identifier, language: ed.language, name: ed.englishName,
      author: ed.author || '', direction: ed.direction || 'ltr',
    }));
    setCache(cacheKey, result, TTL_STATIC);
    return result;
  }

  const [rows] = await pool.execute(
    'SELECT identifier AS id, language, name, author, direction FROM quran_editions ORDER BY language, name'
  );
  setCache(cacheKey, rows, TTL_STATIC);
  return rows;
}

export function getReciters() {
  const base = process.env.API_BASE_URL || 'http://localhost:3000';
  return [
    {
      id:    'Alafasy_128kbps',
      name:  'Mishary Rashid Alafasy',
      style: 'Murattal',
      audio_url_template: `${base}/audio/Alafasy_128kbps/{surah3}{ayah3}.mp3`,
    },
    {
      id:    'Abdul_Basit_Murattal_64kbps',
      name:  'Abdul Basit Abd us-Samad',
      style: 'Murattal',
      audio_url_template: `${base}/audio/Abdul_Basit_Murattal_64kbps/{surah3}{ayah3}.mp3`,
    },
    {
      id:    'Husary_128kbps',
      name:  'Mahmoud Khalil Al-Husary',
      style: 'Murattal',
      audio_url_template: `${base}/audio/Husary_128kbps/{surah3}{ayah3}.mp3`,
    },
    {
      id:    'Mohammad_al_Tablaway_128kbps',
      name:  'Muhammad al-Tablawi',
      style: 'Murattal',
      audio_url_template: `${base}/audio/Mohammad_al_Tablaway_128kbps/{surah3}{ayah3}.mp3`,
    },
  ];
}

export async function searchQuran(q, edition = 'en.sahih', surah = 'all', page = 1, limit = 20) {
  const cacheKey = `search-${q}-${edition}-${surah}-${page}-${limit}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  if (!(await isDbSeeded())) {
    const keyword = encodeURIComponent(q);
    const surahParam = surah === 'all' ? 'all' : String(surah);
    const data = await alquranFetch(`/search/${keyword}/${surahParam}/${edition}`);
    const matches = data.matches || [];
    const total = matches.length;
    const pageMatches = matches.slice((page - 1) * limit, page * limit);
    const result = {
      q, edition, total, page, limit,
      total_pages: Math.ceil(total / limit),
      matches: pageMatches.map((m) => ({
        surah_number:  m.surah.number,
        surah_name:    m.surah.englishName,
        surah_name_ar: m.surah.name,
        ayah_number:   m.numberInSurah,
        text:          m.text,
      })),
    };
    setCache(cacheKey, result, TTL_SEARCH);
    return result;
  }

  const likeQ = `%${q}%`;
  let whereClause = 'qt.edition = ? AND qt.text LIKE ?';
  const params = [edition, likeQ];

  if (surah !== 'all') {
    whereClause += ' AND qt.surah_number = ?';
    params.push(parseInt(surah));
  }

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM quran_translations qt WHERE ${whereClause}`,
    params
  );
  const total = countRows[0].total;

  const offset = (page - 1) * limit;
  const [rows] = await pool.execute(
    `SELECT qt.surah_number, qt.ayah_number, qt.text,
            qs.name_ar AS surah_name_ar, qs.name_en AS surah_name_en
     FROM quran_translations qt
     JOIN quran_surahs qs ON qs.number = qt.surah_number
     WHERE ${whereClause}
     ORDER BY qt.surah_number, qt.ayah_number
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const result = {
    q, edition, total, page, limit,
    total_pages: Math.ceil(total / limit),
    matches: rows.map((r) => ({
      surah_number:  r.surah_number,
      surah_name:    r.surah_name_en,
      surah_name_ar: r.surah_name_ar,
      ayah_number:   r.ayah_number,
      text:          r.text,
    })),
  };

  setCache(cacheKey, result, TTL_SEARCH);
  return result;
}

export async function getCitation(surahNumber, fromAyah, toAyah, translations, format, includeArabic, includeTranslation) {
  const surah = await getSurahWithTranslations(surahNumber, translations);
  const meta = { number: surah.number, name_ar: surah.name_ar, name_en: surah.name_en };
  const ayahs = surah.ayahs.filter((a) => a.number >= fromAyah && a.number <= toAyah);

  const reference = toAyah === fromAyah
    ? `${surah.name_en} (${surahNumber}:${fromAyah})`
    : `${surah.name_en} (${surahNumber}:${fromAyah}-${toAyah})`;

  const translationParam = translations.join(',');
  const permalink = `/quran/${surahNumber}/${fromAyah}${toAyah !== fromAyah ? `-${toAyah}` : ''}?translations=${translationParam}`;

  const attribution = (ayahs[0]?.translations || []).map((t) => ({
    id: t.edition, name: t.name, author: t.author,
  }));

  const items = ayahs.map((a) => {
    const item = { number: a.number };
    if (includeArabic) item.arabic = a.text_ar;
    if (includeTranslation) item.translations = a.translations;
    return item;
  });

  let textBody = '';
  for (const a of ayahs) {
    if (includeArabic) textBody += `${a.text_ar} (${surahNumber}:${a.number})\n`;
    if (includeTranslation && a.translations.length > 0) {
      textBody += a.translations.map((t) => t.text).join('\n') + '\n';
    }
    textBody += '\n';
  }
  if (includeTranslation && attribution.length > 0) {
    textBody += attribution.map((a) => `— ${a.name}${a.author ? `, ${a.author}` : ''}`).join('\n') + '\n';
  }
  textBody += `\n${reference}\n${permalink}`;

  return { meta, reference, permalink, attribution, items, text: textBody };
}

// ─── Word-by-Word (still from quran.com API — not stored locally) ─────────────

const QURANCOM_BASE = 'https://api.quran.com/api/v4';

async function quranComFetch(path) {
  const url = `${QURANCOM_BASE}${path}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`quran.com API error ${res.status}`);
  return res.json();
}

export async function getWordByWord(surahNumber) {
  const cacheKey = `words-${surahNumber}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const result = {};
    let page = 1, totalPages = 1;

    do {
      const json = await quranComFetch(
        `/verses/by_chapter/${surahNumber}` +
        `?words=true&word_fields=text_uthmani,transliteration,translation&per_page=50&page=${page}`
      );
      for (const verse of json.verses || []) {
        result[verse.verse_number] = (verse.words || [])
          .filter((w) => w.char_type_name === 'word')
          .map((w) => ({
            position:        w.position,
            text_ar:         w.text_uthmani || w.text || '',
            transliteration: w.transliteration?.text || '',
            gloss:           w.translation?.text || '',
          }));
      }
      totalPages = json.pagination?.total_pages || 1;
      page++;
    } while (page <= totalPages);

    setCache(cacheKey, result, TTL_SURAH);
    return result;
  } catch (err) {
    console.warn(`Word-by-word fetch failed for surah ${surahNumber}:`, err.message);
    return {};
  }
}

// ─── Tafsir (still from alquran.cloud — tafsir is large, seed separately if needed) ──

export const TAFSIR_EDITIONS = ['en.kathir', 'en.maarifulquran', 'bn.bengali'];

export async function getTafsir(surahNumber, ayahNumber, edition = 'en.kathir') {
  if (!TAFSIR_EDITIONS.includes(edition)) edition = 'en.kathir';

  const cacheKey = `tafsir-${surahNumber}:${ayahNumber}-${edition}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const url = `${ALQURAN_BASE}/ayah/${surahNumber}:${ayahNumber}/${edition}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.code !== 200) throw new Error(json.status);
    const data = json.data;
    const result = {
      surah: surahNumber, ayah: ayahNumber, edition,
      name:  data.edition?.englishName || edition,
      text:  data.text || '',
    };
    setCache(cacheKey, result, TTL_SURAH);
    return result;
  } catch (err) {
    throw new Error(`Tafsir not available for ${surahNumber}:${ayahNumber} (${edition}): ${err.message}`);
  }
}

// ─── Mushaf page view ─────────────────────────────────────────────────────────

export async function getMushafPage(pageNumber, translations = ['en.sahih']) {
  if (pageNumber < 1 || pageNumber > 604) throw new Error('Page number must be between 1 and 604');

  const cacheKey = `mushaf-page-${pageNumber}-${[...translations].sort().join(',')}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  if (!(await isDbSeeded())) {
    // ── Fallback: alquran.cloud (fetch Arabic + translations separately) ──
    const [arabicData, ...translationData] = await Promise.all([
      alquranFetch(`/page/${pageNumber}/quran-uthmani`),
      ...translations.map((ed) => alquranFetch(`/page/${pageNumber}/${ed}`).catch(() => null)),
    ]);
    const arabicEd = Array.isArray(arabicData) ? arabicData[0] : arabicData;
    const translationIndex = new Map();
    translationData.forEach((trData) => {
      if (!trData) return;
      const ed = Array.isArray(trData) ? trData[0] : trData;
      (ed.ayahs || []).forEach((a) => {
        if (!translationIndex.has(a.number)) translationIndex.set(a.number, []);
        translationIndex.get(a.number).push({
          edition: ed.edition?.identifier || '',
          name:    ed.edition?.englishName || '',
          author:  ed.edition?.author || '',
          text:    a.text || '',
        });
      });
    });
    const surahMap = new Map();
    (arabicEd.ayahs || []).forEach((ayah) => {
      const sn = ayah.surah.number;
      if (!surahMap.has(sn)) {
        surahMap.set(sn, {
          number: sn, name_ar: ayah.surah.name, name_en: ayah.surah.englishName,
          name_en_trans: ayah.surah.englishNameTranslation,
          revelation_type: ayah.surah.revelationType, ayah_count: ayah.surah.numberOfAyahs,
          ayahs: [],
        });
      }
      const needsStrip = ayah.numberInSurah === 1 && sn !== 1 && sn !== 9;
      surahMap.get(sn).ayahs.push({
        number: ayah.numberInSurah, number_global: ayah.number,
        text_ar: needsStrip ? stripBismillah(ayah.text) : ayah.text,
        juz: ayah.juz, hizb: ayah.hizbQuarter, page: ayah.page,
        sajdah: ayah.sajda || false,
        translations: translationIndex.get(ayah.number) || [],
      });
    });
    const result = {
      page_number: pageNumber,
      juz: arabicEd.ayahs?.[0]?.juz || 1,
      surahs: Array.from(surahMap.values()),
    };
    setCache(cacheKey, result, TTL_SURAH);
    return result;
  }

  // ── Local DB ──
  // Fetch ayahs on this page
  const [ayahRows] = await pool.execute(
    `SELECT qa.surah_number, qa.ayah_number, qa.number_global,
            qa.text_ar, qa.juz, qa.hizb, qa.page, qa.sajdah,
            qs.name_ar, qs.name_en, qs.name_en_trans, qs.revelation_type, qs.ayah_count
     FROM quran_ayahs qa
     JOIN quran_surahs qs ON qs.number = qa.surah_number
     WHERE qa.page = ?
     ORDER BY qa.number_global`,
    [pageNumber]
  );

  if (ayahRows.length === 0) throw new Error(`No ayahs found for page ${pageNumber}`);

  // Fetch translations for these specific ayahs
  const globalNums = ayahRows.map((a) => a.number_global);
  const translationMap = new Map();

  for (const editionId of translations) {
    const surahNums = [...new Set(ayahRows.map((a) => a.surah_number))];

    for (const surahNum of surahNums) {
      const ayahNums = ayahRows
        .filter((a) => a.surah_number === surahNum)
        .map((a) => a.ayah_number);

      if (ayahNums.length === 0) continue;

      const placeholders = ayahNums.map(() => '?').join(',');
      const [trRows] = await pool.execute(
        `SELECT qt.ayah_number, qt.text, qe.name, qe.author
         FROM quran_translations qt
         JOIN quran_editions qe ON qe.identifier = qt.edition
         WHERE qt.edition = ? AND qt.surah_number = ? AND qt.ayah_number IN (${placeholders})`,
        [editionId, surahNum, ...ayahNums]
      );

      for (const tr of trRows) {
        const key = `${surahNum}:${tr.ayah_number}`;
        if (!translationMap.has(key)) translationMap.set(key, []);
        translationMap.get(key).push({
          edition: editionId,
          name:    tr.name,
          author:  tr.author || '',
          text:    tr.text,
        });
      }
    }
  }

  // Group by surah
  const surahMap = new Map();
  for (const a of ayahRows) {
    if (!surahMap.has(a.surah_number)) {
      surahMap.set(a.surah_number, {
        number:          a.surah_number,
        name_ar:         a.name_ar,
        name_en:         a.name_en,
        name_en_trans:   a.name_en_trans,
        revelation_type: a.revelation_type,
        ayah_count:      a.ayah_count,
        ayahs: [],
      });
    }

    const needsStrip = a.ayah_number === 1 && a.surah_number !== 1 && a.surah_number !== 9;
    surahMap.get(a.surah_number).ayahs.push({
      number:        a.ayah_number,
      number_global: a.number_global,
      text_ar:       needsStrip ? stripBismillah(a.text_ar) : a.text_ar,
      juz:           a.juz,
      hizb:          a.hizb,
      page:          a.page,
      sajdah:        !!a.sajdah,
      translations:  translationMap.get(`${a.surah_number}:${a.ayah_number}`) || [],
    });
  }

  const result = {
    page_number: pageNumber,
    juz:         ayahRows[0].juz,
    surahs:      Array.from(surahMap.values()),
  };

  setCache(cacheKey, result, TTL_SURAH);
  return result;
}
