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
    content_type: row.content_type || 'pdf',
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

async function getLiveBookId(slug) {
  const [rows] = await pool.query(
    'SELECT id FROM books WHERE slug = ? AND status = "live"',
    [slug]
  );
  return rows[0]?.id || null;
}

function buildChapterTree(rows) {
  const byId = new Map(rows.map(r => [r.id, {
    id: r.id,
    parent_id: r.parent_id,
    type: r.type,
    position: r.position,
    title: r.title,
    has_content: !!r.has_content,
    children: [],
  }]));

  const roots = [];
  for (const node of byId.values()) {
    if (node.parent_id && byId.has(node.parent_id)) {
      byId.get(node.parent_id).children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortTree = (nodes) => {
    nodes.sort((a, b) => a.position - b.position);
    nodes.forEach(n => sortTree(n.children));
  };
  sortTree(roots);
  return roots;
}

export async function listChaptersService(slug) {
  const bookId = await getLiveBookId(slug);
  if (!bookId) return null;

  const [rows] = await pool.query(
    `SELECT id, parent_id, type, position, title,
            (content IS NOT NULL AND content != '') AS has_content
     FROM book_chapters WHERE book_id = ?`,
    [bookId]
  );
  return buildChapterTree(rows);
}

export async function getChapterService(slug, id) {
  const bookId = await getLiveBookId(slug);
  if (!bookId) return null;

  const [rows] = await pool.query(
    'SELECT id, parent_id, type, position, title, content FROM book_chapters WHERE book_id = ? AND id = ?',
    [bookId, id]
  );
  const node = rows[0];
  if (!node) return null;

  const breadcrumb = [];
  let parentId = node.parent_id;
  while (parentId) {
    const [prows] = await pool.query(
      'SELECT id, parent_id, title FROM book_chapters WHERE id = ?',
      [parentId]
    );
    if (!prows[0]) break;
    breadcrumb.unshift(prows[0].title);
    parentId = prows[0].parent_id;
  }

  return { ...node, breadcrumb };
}
