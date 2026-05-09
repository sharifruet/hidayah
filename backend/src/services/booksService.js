import pool from '../config/database.js';

const TOPICS = [
  { value: 'hadith',       label: { en: 'Hadith',       bn: 'হাদিস' } },
  { value: 'seerah',       label: { en: 'Seerah',       bn: 'সীরাহ' } },
  { value: 'fiqh',         label: { en: 'Fiqh',         bn: 'ফিকহ' } },
  { value: 'aqeedah',      label: { en: 'Aqeedah',      bn: 'আকীদাহ' } },
  { value: 'tafsir',       label: { en: 'Tafsir',       bn: 'তাফসীর' } },
  { value: 'spirituality', label: { en: 'Spirituality', bn: 'আধ্যাত্মিকতা' } },
  { value: 'history',      label: { en: 'History',      bn: 'ইতিহাস' } },
  { value: 'dawah',        label: { en: 'Dawah',        bn: 'দাওয়াহ' } },
  { value: 'children',     label: { en: 'Children',     bn: 'শিশু' } },
];

function formatBook(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    title_ar: row.title_ar || null,
    subtitle: row.subtitle || null,
    description: row.description || null,
    language: row.language,
    primary_text_language: row.primary_text_language,
    islamic_topics: typeof row.islamic_topics === 'string'
      ? JSON.parse(row.islamic_topics)
      : row.islamic_topics,
    author: row.author || null,
    translator: row.translator || null,
    publisher: row.publisher || null,
    published_year: row.published_year || null,
    cover_url: row.cover_url || null,
    pdf_url: row.pdf_url || null,
    epub_url: row.epub_url || null,
    embed_url: row.embed_url || null,
    page_count: row.page_count || null,
    license_class: row.license_class,
    status: row.status,
  };
}

export async function listBooksService({ topic, lang, q, page = 1, limit = 20 } = {}) {
  const offset = (Math.max(1, parseInt(page)) - 1) * Math.min(100, parseInt(limit) || 20);
  const safeLimit = Math.min(100, parseInt(limit) || 20);

  let where = ['status = "live"'];
  const params = [];

  if (lang) {
    where.push('language = ?');
    params.push(lang);
  }

  if (topic) {
    where.push('JSON_CONTAINS(islamic_topics, ?)');
    params.push(JSON.stringify(topic));
  }

  if (q && q.trim()) {
    where.push('MATCH(title, subtitle, author, description) AGAINST(? IN BOOLEAN MODE)');
    params.push(`${q.trim()}*`);
  }

  const whereClause = where.join(' AND ');

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM books WHERE ${whereClause}`,
    params
  );
  const total = countRows[0].total;

  const [rows] = await pool.query(
    `SELECT * FROM books WHERE ${whereClause}
     ORDER BY title ASC
     LIMIT ? OFFSET ?`,
    [...params, safeLimit, offset]
  );

  return {
    books: rows.map(formatBook),
    pagination: {
      total,
      page: parseInt(page),
      limit: safeLimit,
      pages: Math.ceil(total / safeLimit),
    },
  };
}

export async function getBookService(slug) {
  const [rows] = await pool.query(
    'SELECT * FROM books WHERE slug = ? AND status = "live"',
    [slug]
  );
  if (rows.length === 0) return null;
  return formatBook(rows[0]);
}

export function listTopicsService() {
  return TOPICS;
}
