import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { requireAdmin, signToken } from '../middleware/adminAuth.js';

const router = Router();

// ─── Auth ────────────────────────────────────────────────────────────────────

// POST /admin/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });

  const [rows] = await pool.query(
    'SELECT * FROM admin_users WHERE username = ? AND is_active = 1 LIMIT 1',
    [username]
  );
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  await pool.query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [user.id]);

  const token = signToken({ id: user.id, username: user.username });
  res.json({ token, username: user.username });
});

// GET /admin/me
router.get('/me', requireAdmin, async (req, res) => {
  res.json({ id: req.admin.id, username: req.admin.username });
});

// ─── Books ───────────────────────────────────────────────────────────────────

router.get('/books', requireAdmin, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM books ORDER BY created_at DESC'
  );
  res.json(rows.map(formatBook));
});

router.post('/books', requireAdmin, async (req, res) => {
  const b = req.body;
  const [result] = await pool.query(
    `INSERT INTO books
      (slug, title, title_ar, subtitle, description, language, primary_text_language,
       islamic_topics, author, translator, publisher, published_year,
       cover_url, embed_url, pdf_url, page_count, license_class, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      b.slug, b.title, b.title_ar || null, b.subtitle || null, b.description || null,
      b.language || 'en', b.primary_text_language || 'en',
      JSON.stringify(b.islamic_topics || []),
      b.author || null, b.translator || null, b.publisher || null,
      b.published_year || null, b.cover_url || null, b.embed_url || null,
      b.pdf_url || null, b.page_count || null,
      b.license_class || 'public_domain', b.status || 'draft',
    ]
  );
  const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [result.insertId]);
  res.status(201).json(formatBook(rows[0]));
});

router.put('/books/:id', requireAdmin, async (req, res) => {
  const b = req.body;
  await pool.query(
    `UPDATE books SET
      slug=?, title=?, title_ar=?, subtitle=?, description=?, language=?,
      primary_text_language=?, islamic_topics=?, author=?, translator=?,
      publisher=?, published_year=?, cover_url=?, embed_url=?, pdf_url=?,
      page_count=?, license_class=?, status=?
     WHERE id=?`,
    [
      b.slug, b.title, b.title_ar || null, b.subtitle || null, b.description || null,
      b.language || 'en', b.primary_text_language || 'en',
      JSON.stringify(b.islamic_topics || []),
      b.author || null, b.translator || null, b.publisher || null,
      b.published_year || null, b.cover_url || null, b.embed_url || null,
      b.pdf_url || null, b.page_count || null,
      b.license_class || 'public_domain', b.status || 'draft',
      req.params.id,
    ]
  );
  const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(formatBook(rows[0]));
});

router.delete('/books/:id', requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM books WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

// ─── Duas ────────────────────────────────────────────────────────────────────

router.get('/duas', requireAdmin, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM duas ORDER BY category, sort_order, id');
  res.json(rows);
});

router.post('/duas', requireAdmin, async (req, res) => {
  const d = req.body;
  const [result] = await pool.query(
    `INSERT INTO duas
      (category, arabic, transliteration, translation_en, translation_bn,
       reference, count, quran_surah, quran_ayah, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      d.category, d.arabic, d.transliteration || null,
      d.translation_en, d.translation_bn || null,
      d.reference || null, d.count || 1,
      d.quran_surah || null, d.quran_ayah || null, d.sort_order || 0,
    ]
  );
  const [rows] = await pool.query('SELECT * FROM duas WHERE id = ?', [result.insertId]);
  res.status(201).json(rows[0]);
});

router.put('/duas/:id', requireAdmin, async (req, res) => {
  const d = req.body;
  await pool.query(
    `UPDATE duas SET
      category=?, arabic=?, transliteration=?, translation_en=?, translation_bn=?,
      reference=?, count=?, quran_surah=?, quran_ayah=?, sort_order=?
     WHERE id=?`,
    [
      d.category, d.arabic, d.transliteration || null,
      d.translation_en, d.translation_bn || null,
      d.reference || null, d.count || 1,
      d.quran_surah || null, d.quran_ayah || null, d.sort_order || 0,
      req.params.id,
    ]
  );
  const [rows] = await pool.query('SELECT * FROM duas WHERE id = ?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

router.delete('/duas/:id', requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM duas WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBook(row) {
  return {
    ...row,
    islamic_topics: typeof row.islamic_topics === 'string'
      ? JSON.parse(row.islamic_topics)
      : row.islamic_topics,
  };
}

export default router;
