/**
 * Quran Database Seeder
 *
 * Downloads all Quran data from alquran.cloud and stores it in MySQL.
 * Run once: node src/database/quranSeeder.js
 *
 * Options:
 *   --editions en.sahih,bn.bengali,...   (comma-separated, defaults below)
 *   --surahs 1-114                       (range, default: all)
 *   --force                              (re-seed even if data exists)
 */

import pool from '../config/database.js';

const ALQURAN_BASE = 'https://api.alquran.cloud/v1';

// Editions to seed. Add or remove as needed.
const DEFAULT_EDITIONS = [
  'en.sahih',
  'bn.bengali',
  'en.pickthall',
  'en.yusufali',
  'en.transliteration',
  'ur.ahmedali',
  'tr.diyanet',
  'id.indonesian',
];

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function apiFetch(path, retries = 3) {
  const url = `${ALQURAN_BASE}${path}`;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.code !== 200) throw new Error(json.status || `code ${json.code}`);
      return json.data;
    } catch (err) {
      console.warn(`  Attempt ${attempt}/${retries} failed for ${path}: ${err.message}`);
      if (attempt < retries) await sleep(1500 * attempt);
      else throw err;
    }
  }
}

// ─── Parse CLI args ──────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const force = args.includes('--force');

const editionsArg = args.find((a) => a.startsWith('--editions='));
const editions = editionsArg
  ? editionsArg.replace('--editions=', '').split(',').map((s) => s.trim())
  : DEFAULT_EDITIONS;

const surahsArg = args.find((a) => a.startsWith('--surahs='));
let surahStart = 1, surahEnd = 114;
if (surahsArg) {
  const parts = surahsArg.replace('--surahs=', '').split('-');
  surahStart = parseInt(parts[0]) || 1;
  surahEnd   = parseInt(parts[1]) || parseInt(parts[0]) || 114;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function seedSurahs(conn) {
  console.log('\n📖 Fetching surah index...');
  const data = await apiFetch('/surah');

  for (const s of data) {
    await conn.execute(
      `INSERT INTO quran_surahs (number, name_ar, name_en, name_en_trans, revelation_type, ayah_count)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name_ar = VALUES(name_ar),
         name_en = VALUES(name_en),
         name_en_trans = VALUES(name_en_trans),
         revelation_type = VALUES(revelation_type),
         ayah_count = VALUES(ayah_count)`,
      [s.number, s.name, s.englishName, s.englishNameTranslation, s.revelationType, s.numberOfAyahs]
    );
  }
  console.log(`  ✅ ${data.length} surahs stored`);
}

async function seedEditions(conn, editionIds) {
  console.log('\n🌐 Fetching edition metadata...');
  const data = await apiFetch('/edition?type=translation&format=text');

  // Also include transliteration type
  const translit = await apiFetch('/edition?type=transliteration&format=text').catch(() => []);
  const all = [...data, ...(Array.isArray(translit) ? translit : [])];

  const toSeed = all.filter((e) => editionIds.includes(e.identifier));

  for (const e of toSeed) {
    await conn.execute(
      `INSERT INTO quran_editions (identifier, language, name, author, direction)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         language = VALUES(language),
         name = VALUES(name),
         author = VALUES(author),
         direction = VALUES(direction)`,
      [e.identifier, e.language, e.englishName, e.author || '', e.direction || 'ltr']
    );
  }

  // Insert any editions that weren't found via the list (some IDs may be unique)
  const found = new Set(toSeed.map((e) => e.identifier));
  for (const id of editionIds) {
    if (!found.has(id)) {
      const lang = id.split('.')[0];
      await conn.execute(
        `INSERT IGNORE INTO quran_editions (identifier, language, name, author, direction)
         VALUES (?, ?, ?, ?, ?)`,
        [id, lang, id, '', 'ltr']
      );
    }
  }

  console.log(`  ✅ ${toSeed.length} editions stored`);
}

function stripBismillah(text) {
  if (!text.startsWith('بِسْمِ')) return text;
  for (const ending of ['ٱلرَّحِيمِ', 'الرَّحِيمِ']) {
    const idx = text.indexOf(ending);
    if (idx !== -1) return text.slice(idx + ending.length).trimStart();
  }
  return text;
}

async function seedSurah(conn, surahNum, editionIds) {
  // Fetch Arabic
  const arabicData = await apiFetch(`/surah/${surahNum}/quran-uthmani`);

  // Insert ayahs
  const needsBismillahStrip = surahNum !== 1 && surahNum !== 9;
  for (const ayah of arabicData.ayahs) {
    const arabicText = (needsBismillahStrip && ayah.numberInSurah === 1)
      ? stripBismillah(ayah.text)
      : ayah.text;

    await conn.execute(
      `INSERT INTO quran_ayahs
         (surah_number, ayah_number, number_global, text_ar, page, juz, hizb, sajdah)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         number_global = VALUES(number_global),
         text_ar = VALUES(text_ar),
         page = VALUES(page),
         juz = VALUES(juz),
         hizb = VALUES(hizb),
         sajdah = VALUES(sajdah)`,
      [
        surahNum,
        ayah.numberInSurah,
        ayah.number,
        arabicText,
        ayah.page,
        ayah.juz,
        ayah.hizbQuarter,
        ayah.sajda ? 1 : 0,
      ]
    );
  }

  // Fetch and insert each translation edition
  for (const editionId of editionIds) {
    await sleep(150); // be polite to the API
    try {
      const trData = await apiFetch(`/surah/${surahNum}/${editionId}`);
      for (const ayah of trData.ayahs) {
        await conn.execute(
          `INSERT INTO quran_translations (edition, surah_number, ayah_number, text)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE text = VALUES(text)`,
          [editionId, surahNum, ayah.numberInSurah, ayah.text || '']
        );
      }
    } catch (err) {
      console.warn(`    ⚠️  Edition ${editionId} skipped for surah ${surahNum}: ${err.message}`);
    }
  }
}

async function run() {
  console.log('🕌 Quran Database Seeder');
  console.log(`   Surahs: ${surahStart}–${surahEnd}`);
  console.log(`   Editions: ${editions.join(', ')}`);
  console.log(`   Force re-seed: ${force}`);

  let conn;
  try {
    conn = await pool.getConnection();

    // Check if already seeded
    if (!force) {
      const [rows] = await conn.execute('SELECT COUNT(*) AS cnt FROM quran_ayahs');
      if (rows[0].cnt > 0) {
        console.log('\n⚠️  quran_ayahs table already has data.');
        console.log('   Use --force to re-seed.');
        conn.release();
        process.exit(0);
      }
    }

    await seedSurahs(conn);
    await seedEditions(conn, editions);

    console.log(`\n📝 Seeding ${surahEnd - surahStart + 1} surahs with ${editions.length} translation editions...`);

    for (let s = surahStart; s <= surahEnd; s++) {
      process.stdout.write(`  Surah ${s}/${surahEnd}...`);
      await seedSurah(conn, s, editions);
      await sleep(300);
      process.stdout.write(' ✅\n');
    }

    console.log('\n🎉 Seeding complete!');
    conn.release();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seeder failed:', err.message);
    if (conn) conn.release();
    process.exit(1);
  }
}

run();
