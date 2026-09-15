/**
 * Hadith Database Seeder
 *
 * Downloads Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah, and Muwatta
 * Malik (Arabic + Bangla + English) from fawazahmed0/hadith-api (public domain /
 * Unlicense) and stores them in MySQL.
 *
 * Run once: node src/database/hadithSeeder.js
 *
 * Options:
 *   --collections=bukhari,muslim,...   (comma-separated, default: all 7)
 *   --force                            (re-seed even if data exists)
 */

import pool from '../config/database.js';

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

const COLLECTIONS = [
  'bukhari',
  'muslim',
  'abudawud',
  'tirmidhi',
  'nasai',
  'ibnmajah',
  'malik',
];

const BATCH_SIZE = 500;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function apiFetch(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`  Attempt ${attempt}/${retries} failed for ${url}: ${err.message}`);
      if (attempt < retries) await sleep(1500 * attempt);
      else throw err;
    }
  }
}

// ─── Parse CLI args ──────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const force = args.includes('--force');

const collectionsArg = args.find((a) => a.startsWith('--collections='));
const collections = collectionsArg
  ? collectionsArg.replace('--collections=', '').split(',').map((s) => s.trim())
  : COLLECTIONS;

// ─── Seeding ───────────────────────────────────────────────────────────────

async function seedCollection(conn, slug) {
  process.stdout.write(`\n📕 ${slug}\n`);

  // ── Arabic (canonical text + book/collection structure) ──
  const araUrl = `${CDN_BASE}/ara-${slug}.min.json`;
  process.stdout.write(`  Fetching ${araUrl}...\n`);
  const ara = await apiFetch(araUrl);

  const bookNumbers = Object.keys(ara.metadata.section_details || {})
    .map(Number)
    .filter((n) => {
      const d = ara.metadata.section_details[String(n)];
      return d.hadithnumber_last >= d.hadithnumber_first && d.hadithnumber_last > 0;
    })
    .sort((a, b) => a - b);

  await conn.execute(
    `INSERT INTO hadith_collections (slug, name, total_hadiths, total_books)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE name = VALUES(name), total_hadiths = VALUES(total_hadiths), total_books = VALUES(total_books)`,
    [slug, ara.metadata.name, ara.hadiths.length, bookNumbers.length]
  );

  const bookRows = bookNumbers.map((n) => {
    const d = ara.metadata.section_details[String(n)];
    const name = ara.metadata.sections[String(n)] || `Book ${n}`;
    return [slug, n, name, d.hadithnumber_first, d.hadithnumber_last];
  });
  if (bookRows.length) {
    await conn.execute(
      `INSERT INTO hadith_books (collection_slug, book_number, name, hadithnumber_first, hadithnumber_last)
       VALUES ${bookRows.map(() => '(?,?,?,?,?)').join(',')}
       ON DUPLICATE KEY UPDATE name = VALUES(name),
         hadithnumber_first = VALUES(hadithnumber_first), hadithnumber_last = VALUES(hadithnumber_last)`,
      bookRows.flat()
    );
  }

  const hadithRows = ara.hadiths.map((h) => [
    slug,
    h.reference.book,
    h.hadithnumber,
    h.reference.hadith,
    h.arabicnumber ?? null,
    h.text,
    h.grades && h.grades.length ? JSON.stringify(h.grades) : null,
  ]);
  for (let i = 0; i < hadithRows.length; i += BATCH_SIZE) {
    const chunk = hadithRows.slice(i, i + BATCH_SIZE);
    await conn.execute(
      `INSERT INTO hadiths (collection_slug, book_number, hadithnumber, in_book_number, arabic_number, text_ar, grades)
       VALUES ${chunk.map(() => '(?,?,?,?,?,?,?)').join(',')}
       ON DUPLICATE KEY UPDATE book_number = VALUES(book_number), in_book_number = VALUES(in_book_number),
         arabic_number = VALUES(arabic_number), text_ar = VALUES(text_ar), grades = VALUES(grades)`,
      chunk.flat()
    );
  }
  console.log(`  ✅ ${hadithRows.length} hadiths (${bookRows.length} books) stored`);

  // ── Translations (Bangla + English) ──
  for (const [lang, prefix] of [['bn', 'ben'], ['en', 'eng']]) {
    await sleep(150);
    const identifier = `${prefix}-${slug}`;
    const url = `${CDN_BASE}/${identifier}.min.json`;
    process.stdout.write(`  Fetching ${url}...\n`);
    const data = await apiFetch(url);

    await conn.execute(
      `INSERT INTO hadith_editions (identifier, collection_slug, language, name, author, direction)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      [identifier, slug, lang, data.metadata.name, '', 'ltr']
    );

    const trRows = data.hadiths.map((h) => [identifier, slug, h.hadithnumber, h.text || '']);
    for (let i = 0; i < trRows.length; i += BATCH_SIZE) {
      const chunk = trRows.slice(i, i + BATCH_SIZE);
      await conn.execute(
        `INSERT INTO hadith_translations (edition, collection_slug, hadithnumber, text)
         VALUES ${chunk.map(() => '(?,?,?,?)').join(',')}
         ON DUPLICATE KEY UPDATE text = VALUES(text)`,
        chunk.flat()
      );
    }
    console.log(`  ✅ ${trRows.length} ${identifier} translations stored`);
  }
}

async function run() {
  console.log('📗 Hadith Database Seeder');
  console.log(`   Collections: ${collections.join(', ')}`);
  console.log(`   Force re-seed: ${force}`);

  let conn;
  try {
    conn = await pool.getConnection();

    if (!force) {
      const [rows] = await conn.execute('SELECT COUNT(*) AS cnt FROM hadiths');
      if (rows[0].cnt > 0) {
        console.log('\n⚠️  hadiths table already has data.');
        console.log('   Use --force to re-seed.');
        conn.release();
        process.exit(0);
      }
    }

    for (const slug of collections) {
      if (!COLLECTIONS.includes(slug)) {
        console.warn(`\n⚠️  Unknown collection "${slug}", skipping.`);
        continue;
      }
      await seedCollection(conn, slug);
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
