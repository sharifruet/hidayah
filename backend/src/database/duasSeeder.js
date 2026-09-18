import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, 'data', 'duas.json');

/**
 * Databases created before du'as moved into the DB lack the categories table
 * and the slug/virtue columns. Apply those here so `seed:duas` works anywhere
 * (MySQL 8 has no ADD COLUMN IF NOT EXISTS, hence the information_schema check).
 */
async function ensureSchema(conn) {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS dua_categories (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      slug        VARCHAR(50) UNIQUE NOT NULL,
      label_en    VARCHAR(100) NOT NULL,
      label_bn    VARCHAR(100),
      label_ur    VARCHAR(100),
      label_tr    VARCHAR(100),
      label_id    VARCHAR(100),
      sort_order  SMALLINT NOT NULL DEFAULT 0,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS duas (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      slug            VARCHAR(60) UNIQUE,
      category        VARCHAR(50) NOT NULL,
      arabic          TEXT NOT NULL,
      transliteration TEXT,
      translation_en  TEXT NOT NULL,
      translation_bn  TEXT,
      virtue_en       TEXT,
      virtue_bn       TEXT,
      reference       VARCHAR(200),
      count           TINYINT UNSIGNED NOT NULL DEFAULT 1,
      quran_surah     TINYINT UNSIGNED,
      quran_ayah      SMALLINT UNSIGNED,
      sort_order      SMALLINT NOT NULL DEFAULT 0,
      created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_duas_category (category),
      INDEX idx_duas_sort (category, sort_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  const [cols] = await conn.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'duas'`
  );
  const have = new Set(cols.map(c => c.COLUMN_NAME));
  if (!have.has('slug')) {
    await conn.query('ALTER TABLE duas ADD COLUMN slug VARCHAR(60) UNIQUE NULL AFTER id');
    console.log('  + added duas.slug');
  }
  if (!have.has('virtue_en')) {
    await conn.query('ALTER TABLE duas ADD COLUMN virtue_en TEXT NULL AFTER translation_bn');
    console.log('  + added duas.virtue_en');
  }
  if (!have.has('virtue_bn')) {
    await conn.query('ALTER TABLE duas ADD COLUMN virtue_bn TEXT NULL AFTER virtue_en');
    console.log('  + added duas.virtue_bn');
  }
}

/**
 * Upsert categories and du'as from data/duas.json. Rows are keyed by slug so
 * re-running is idempotent and edits to the JSON propagate; rows added via the
 * admin panel (no slug, or a slug not in the file) are left untouched.
 */
export async function seedDuas(conn) {
  const { categories, duas } = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  console.log('🤲 Seeding du\'as...');
  await ensureSchema(conn);

  for (const c of categories) {
    await conn.query(
      `INSERT INTO dua_categories (slug, label_en, label_bn, label_ur, label_tr, label_id, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         label_en = VALUES(label_en), label_bn = VALUES(label_bn), label_ur = VALUES(label_ur),
         label_tr = VALUES(label_tr), label_id = VALUES(label_id), sort_order = VALUES(sort_order)`,
      [c.slug, c.label_en, c.label_bn, c.label_ur, c.label_tr, c.label_id, c.sort_order]
    );
  }

  for (const d of duas) {
    await conn.query(
      `INSERT INTO duas
        (slug, category, arabic, transliteration, translation_en, translation_bn,
         virtue_en, virtue_bn, reference, count, quran_surah, quran_ayah, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         category = VALUES(category), arabic = VALUES(arabic),
         transliteration = VALUES(transliteration), translation_en = VALUES(translation_en),
         translation_bn = VALUES(translation_bn), virtue_en = VALUES(virtue_en),
         virtue_bn = VALUES(virtue_bn), reference = VALUES(reference), count = VALUES(count),
         quran_surah = VALUES(quran_surah), quran_ayah = VALUES(quran_ayah),
         sort_order = VALUES(sort_order)`,
      [
        d.slug, d.category, d.arabic, d.transliteration, d.translation_en, d.translation_bn,
        d.virtue_en, d.virtue_bn, d.reference, d.count, d.quran_surah, d.quran_ayah, d.sort_order,
      ]
    );
  }

  const [[{ total }]] = await conn.query('SELECT COUNT(*) AS total FROM duas');
  console.log(`✅ Du'as seeded: ${categories.length} categories, ${duas.length} from file, ${total} total in DB`);
}

// Run standalone: `npm run seed:duas`
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let conn;
  try {
    conn = await pool.getConnection();
    await seedDuas(conn);
    process.exit(0);
  } catch (err) {
    console.error('❌ Du\'as seeder failed:', err);
    process.exit(1);
  } finally {
    if (conn) conn.release();
  }
}
