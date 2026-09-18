import pool from '../config/database.js';

function formatCategory(row) {
  return {
    id: row.slug,
    label_en: row.label_en,
    label_bn: row.label_bn || row.label_en,
    label_ur: row.label_ur || row.label_en,
    label_tr: row.label_tr || row.label_en,
    label_id: row.label_id || row.label_en,
  };
}

function formatDua(row) {
  return {
    // Slug is the stable public id (matches the ids the apps used before);
    // admin-created rows without one fall back to the numeric id.
    id: row.slug || `dua-${row.id}`,
    category: row.category,
    arabic: row.arabic,
    transliteration: row.transliteration || '',
    translation_en: row.translation_en,
    translation_bn: row.translation_bn || '',
    reference: row.reference || '',
    count: row.count || 1,
    ...(row.quran_surah && row.quran_ayah && {
      quranRef: { surah: row.quran_surah, ayah: row.quran_ayah },
    }),
    ...(row.virtue_en && { virtue_en: row.virtue_en }),
    ...(row.virtue_bn && { virtue_bn: row.virtue_bn }),
  };
}

/**
 * The whole du'a collection in one payload — small enough (~60 KB) that
 * clients cache it locally and re-sync on an interval rather than page.
 * `updated_at` is the newest change across both tables, so a client can
 * tell whether anything changed since its last sync.
 */
export async function getDuasCollectionService() {
  const [categories] = await pool.query(
    'SELECT * FROM dua_categories ORDER BY sort_order, id'
  );
  const [duas] = await pool.query(
    'SELECT * FROM duas ORDER BY category, sort_order, id'
  );
  const [[meta]] = await pool.query(
    `SELECT GREATEST(
       COALESCE((SELECT MAX(updated_at) FROM duas), '1970-01-01'),
       COALESCE((SELECT MAX(updated_at) FROM dua_categories), '1970-01-01')
     ) AS updated_at`
  );

  return {
    categories: categories.map(formatCategory),
    duas: duas.map(formatDua),
    total: duas.length,
    updated_at: meta.updated_at,
  };
}

export async function listDuaCategoriesService() {
  const [rows] = await pool.query('SELECT * FROM dua_categories ORDER BY sort_order, id');
  return rows.map(formatCategory);
}
