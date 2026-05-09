/**
 * Quran SQL Dump Generator
 *
 * Fetches all Quran data from alquran.cloud and writes a single portable
 * .sql file you can import on any MySQL server:
 *
 *   node scripts/generateSqlDump.js
 *   mysql -u root -p hidayah_db < quran_data.sql
 *
 * Options:
 *   --output=quran_data.sql          (default: quran_data.sql in project root)
 *   --editions=en.sahih,bn.bengali   (default: 8 popular editions)
 *   --surahs=1-114                   (default: all)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ALQURAN_BASE = 'https://api.alquran.cloud/v1';

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

// ─── CLI args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

const outputArg = args.find((a) => a.startsWith('--output='));
const OUTPUT_FILE = outputArg
  ? path.resolve(outputArg.replace('--output=', ''))
  : path.join(__dirname, '..', '..', 'quran_data.sql');

const editionsArg = args.find((a) => a.startsWith('--editions='));
const EDITIONS = editionsArg
  ? editionsArg.replace('--editions=', '').split(',').map((s) => s.trim())
  : DEFAULT_EDITIONS;

const surahsArg = args.find((a) => a.startsWith('--surahs='));
let SURAH_START = 1, SURAH_END = 114;
if (surahsArg) {
  const parts = surahsArg.replace('--surahs=', '').split('-');
  SURAH_START = parseInt(parts[0]) || 1;
  SURAH_END   = parseInt(parts[1]) || parseInt(parts[0]) || 114;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function apiFetch(path, retries = 4) {
  const url = `${ALQURAN_BASE}${path}`;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.code !== 200) throw new Error(json.status || `code ${json.code}`);
      return json.data;
    } catch (err) {
      if (attempt < retries) {
        await sleep(1500 * attempt);
      } else {
        throw err;
      }
    }
  }
}

/** Escape a string for SQL single-quote context. */
function esc(str) {
  if (str == null) return 'NULL';
  return "'" + String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

function stripBismillah(text) {
  if (!text.startsWith('بِسْمِ')) return text;
  for (const ending of ['ٱلرَّحِيمِ', 'الرَّحِيمِ']) {
    const idx = text.indexOf(ending);
    if (idx !== -1) return text.slice(idx + ending.length).trimStart();
  }
  return text;
}

// ─── Writer ───────────────────────────────────────────────────────────────────

class SqlWriter {
  constructor(filePath) {
    this._fd = fs.openSync(filePath, 'w');
  }

  write(str) {
    fs.writeSync(this._fd, str);
  }

  writeln(str = '') {
    fs.writeSync(this._fd, str + '\n');
  }

  close() {
    fs.closeSync(this._fd);
  }
}

// ─── Schema ───────────────────────────────────────────────────────────────────

function writeSchema(w) {
  w.writeln('-- ============================================================');
  w.writeln('-- Hidayah — Quran Data SQL Dump');
  w.writeln(`-- Generated: ${new Date().toISOString()}`);
  w.writeln(`-- Editions: ${EDITIONS.join(', ')}`);
  w.writeln('-- Import: mysql -u root -p YOUR_DB < quran_data.sql');
  w.writeln('-- ============================================================');
  w.writeln();
  w.writeln('SET NAMES utf8mb4;');
  w.writeln('SET FOREIGN_KEY_CHECKS = 0;');
  w.writeln();

  w.writeln('-- ─── Tables ──────────────────────────────────────────────────');
  w.writeln();

  w.writeln(`CREATE TABLE IF NOT EXISTS quran_surahs (
  number        TINYINT UNSIGNED PRIMARY KEY,
  name_ar       VARCHAR(100)  NOT NULL,
  name_en       VARCHAR(100)  NOT NULL,
  name_en_trans VARCHAR(200)  NOT NULL,
  revelation_type ENUM('Meccan','Medinan') NOT NULL,
  ayah_count    SMALLINT UNSIGNED NOT NULL,
  INDEX idx_qs_revelation (revelation_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  w.writeln();

  w.writeln(`CREATE TABLE IF NOT EXISTS quran_ayahs (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  surah_number  TINYINT UNSIGNED NOT NULL,
  ayah_number   SMALLINT UNSIGNED NOT NULL,
  number_global SMALLINT UNSIGNED NOT NULL,
  text_ar       TEXT NOT NULL,
  page          SMALLINT UNSIGNED NOT NULL,
  juz           TINYINT UNSIGNED NOT NULL,
  hizb          TINYINT UNSIGNED NOT NULL,
  sajdah        TINYINT(1) NOT NULL DEFAULT 0,
  UNIQUE KEY uq_surah_ayah (surah_number, ayah_number),
  UNIQUE KEY uq_global (number_global),
  INDEX idx_qa_page (page),
  INDEX idx_qa_juz (juz),
  FOREIGN KEY (surah_number) REFERENCES quran_surahs(number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  w.writeln();

  w.writeln(`CREATE TABLE IF NOT EXISTS quran_editions (
  identifier  VARCHAR(50) PRIMARY KEY,
  language    VARCHAR(10)  NOT NULL,
  name        VARCHAR(200) NOT NULL,
  author      VARCHAR(200) NOT NULL DEFAULT '',
  direction   ENUM('ltr','rtl') NOT NULL DEFAULT 'ltr',
  INDEX idx_qe_language (language)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  w.writeln();

  w.writeln(`CREATE TABLE IF NOT EXISTS quran_translations (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  edition      VARCHAR(50)  NOT NULL,
  surah_number TINYINT UNSIGNED NOT NULL,
  ayah_number  SMALLINT UNSIGNED NOT NULL,
  text         MEDIUMTEXT   NOT NULL,
  UNIQUE KEY uq_tr_edition_ayah (edition, surah_number, ayah_number),
  INDEX idx_tr_surah (edition, surah_number),
  FULLTEXT INDEX idx_tr_fulltext (text),
  FOREIGN KEY (edition) REFERENCES quran_editions(identifier),
  FOREIGN KEY (surah_number, ayah_number) REFERENCES quran_ayahs(surah_number, ayah_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  w.writeln();
  w.writeln();
}

// ─── Data sections ────────────────────────────────────────────────────────────

function writeSurahs(w, surahs) {
  w.writeln('-- ─── Surahs ──────────────────────────────────────────────────');
  w.writeln();
  w.writeln('INSERT INTO quran_surahs (number, name_ar, name_en, name_en_trans, revelation_type, ayah_count) VALUES');

  const lines = surahs.map((s) =>
    `  (${s.number}, ${esc(s.name)}, ${esc(s.englishName)}, ${esc(s.englishNameTranslation)}, ${esc(s.revelationType)}, ${s.numberOfAyahs})`
  );
  w.writeln(lines.join(',\n'));
  w.writeln('ON DUPLICATE KEY UPDATE');
  w.writeln('  name_ar = VALUES(name_ar), name_en = VALUES(name_en),');
  w.writeln('  name_en_trans = VALUES(name_en_trans), revelation_type = VALUES(revelation_type),');
  w.writeln('  ayah_count = VALUES(ayah_count);');
  w.writeln();
}

function writeEditions(w, editions) {
  w.writeln('-- ─── Editions ────────────────────────────────────────────────');
  w.writeln();
  w.writeln('INSERT INTO quran_editions (identifier, language, name, author, direction) VALUES');

  const lines = editions.map((e) =>
    `  (${esc(e.identifier)}, ${esc(e.language)}, ${esc(e.englishName)}, ${esc(e.author || '')}, ${esc(e.direction || 'ltr')})`
  );
  w.writeln(lines.join(',\n'));
  w.writeln('ON DUPLICATE KEY UPDATE');
  w.writeln('  language = VALUES(language), name = VALUES(name),');
  w.writeln('  author = VALUES(author), direction = VALUES(direction);');
  w.writeln();
}

/** Write ayahs in batches of 200 rows per INSERT statement. */
function writeAyahBatch(w, batch) {
  w.writeln('INSERT INTO quran_ayahs');
  w.writeln('  (surah_number, ayah_number, number_global, text_ar, page, juz, hizb, sajdah)');
  w.writeln('VALUES');
  const lines = batch.map(
    (a) => `  (${a.surah_number}, ${a.ayah_number}, ${a.number_global}, ${esc(a.text_ar)}, ${a.page}, ${a.juz}, ${a.hizb}, ${a.sajdah})`
  );
  w.writeln(lines.join(',\n'));
  w.writeln('ON DUPLICATE KEY UPDATE');
  w.writeln('  text_ar = VALUES(text_ar), page = VALUES(page), juz = VALUES(juz),');
  w.writeln('  hizb = VALUES(hizb), sajdah = VALUES(sajdah);');
  w.writeln();
}

function writeTranslationBatch(w, batch) {
  w.writeln('INSERT INTO quran_translations (edition, surah_number, ayah_number, text) VALUES');
  const lines = batch.map(
    (t) => `  (${esc(t.edition)}, ${t.surah_number}, ${t.ayah_number}, ${esc(t.text)})`
  );
  w.writeln(lines.join(',\n'));
  w.writeln('ON DUPLICATE KEY UPDATE text = VALUES(text);');
  w.writeln();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log('🕌 Quran SQL Dump Generator');
  console.log(`   Output : ${OUTPUT_FILE}`);
  console.log(`   Surahs : ${SURAH_START}–${SURAH_END}`);
  console.log(`   Editions: ${EDITIONS.join(', ')}`);
  console.log();

  const w = new SqlWriter(OUTPUT_FILE);
  writeSchema(w);

  // ── 1. Surah index ──────────────────────────────────────────────────────────
  process.stdout.write('📖 Fetching surah index...');
  const allSurahs = await apiFetch('/surah');
  writeSurahs(w, allSurahs);
  console.log(' ✅');

  // ── 2. Edition metadata ─────────────────────────────────────────────────────
  process.stdout.write('🌐 Fetching edition metadata...');
  const editionData = await apiFetch('/edition?type=translation&format=text');
  const translitData = await apiFetch('/edition?type=transliteration&format=text').catch(() => []);
  const allEditions  = [...editionData, ...(Array.isArray(translitData) ? translitData : [])];
  const matchedEditions = allEditions.filter((e) => EDITIONS.includes(e.identifier));

  // Fallback stubs for editions not returned by the list endpoint
  const matchedIds = new Set(matchedEditions.map((e) => e.identifier));
  for (const id of EDITIONS) {
    if (!matchedIds.has(id)) {
      matchedEditions.push({ identifier: id, language: id.split('.')[0], englishName: id, author: '', direction: 'ltr' });
    }
  }
  writeEditions(w, matchedEditions);
  console.log(' ✅');

  // ── 3. Ayahs + translations per surah ───────────────────────────────────────
  w.writeln('-- ─── Ayahs ───────────────────────────────────────────────────');
  w.writeln();

  const BATCH_SIZE = 200;
  let ayahBatch = [];
  let totalAyahs = 0;

  console.log(`\n📝 Fetching ${SURAH_END - SURAH_START + 1} surahs...\n`);

  for (let s = SURAH_START; s <= SURAH_END; s++) {
    process.stdout.write(`  [${s}/${SURAH_END}] Surah ${s} Arabic...`);
    const arabicData = await apiFetch(`/surah/${s}/quran-uthmani`);
    const needsBismillahStrip = s !== 1 && s !== 9;

    for (const ayah of arabicData.ayahs) {
      const arabicText = (needsBismillahStrip && ayah.numberInSurah === 1)
        ? stripBismillah(ayah.text)
        : ayah.text;

      ayahBatch.push({
        surah_number:  s,
        ayah_number:   ayah.numberInSurah,
        number_global: ayah.number,
        text_ar:       arabicText,
        page:          ayah.page,
        juz:           ayah.juz,
        hizb:          ayah.hizbQuarter,
        sajdah:        ayah.sajda ? 1 : 0,
      });
      totalAyahs++;

      if (ayahBatch.length >= BATCH_SIZE) {
        writeAyahBatch(w, ayahBatch);
        ayahBatch = [];
      }
    }

    process.stdout.write(' translations...');

    // Translations
    w.writeln(`-- Surah ${s} translations`);
    for (const editionId of EDITIONS) {
      await sleep(120);
      try {
        const trData = await apiFetch(`/surah/${s}/${editionId}`);
        const trBatch = trData.ayahs.map((a) => ({
          edition:      editionId,
          surah_number: s,
          ayah_number:  a.numberInSurah,
          text:         a.text || '',
        }));
        // Write in chunks
        for (let i = 0; i < trBatch.length; i += BATCH_SIZE) {
          writeTranslationBatch(w, trBatch.slice(i, i + BATCH_SIZE));
        }
      } catch (err) {
        w.writeln(`-- ⚠️  Edition ${editionId} skipped for surah ${s}: ${err.message}`);
        console.warn(`\n    ⚠️  ${editionId} skipped for surah ${s}`);
      }
    }

    console.log(' ✅');
    await sleep(250);
  }

  // Flush remaining ayahs
  if (ayahBatch.length > 0) {
    writeAyahBatch(w, ayahBatch);
  }

  // ── Footer ──────────────────────────────────────────────────────────────────
  w.writeln();
  w.writeln('SET FOREIGN_KEY_CHECKS = 1;');
  w.writeln();
  w.writeln(`-- ✅ Done — ${totalAyahs} ayahs, ${EDITIONS.length} editions`);
  w.close();

  const bytes = fs.statSync(OUTPUT_FILE).size;
  const mb = (bytes / 1024 / 1024).toFixed(1);
  console.log(`\n🎉 Done!`);
  console.log(`   File: ${OUTPUT_FILE}`);
  console.log(`   Size: ${mb} MB`);
  console.log(`\nImport with:`);
  console.log(`   mysql -u root -p YOUR_DATABASE < ${path.basename(OUTPUT_FILE)}`);
}

run().catch((err) => {
  console.error('\n❌ Fatal:', err.message);
  process.exit(1);
});
