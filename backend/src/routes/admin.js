import { Router } from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';
import { requireAdmin, signToken } from '../middleware/adminAuth.js';
import { validateMasjidBody, validateJamahBody } from '../middleware/validation.js';
import {
  listAllMasjidsService,
  getMasjidService,
  createMasjidService,
  updateMasjidService,
  deleteMasjidService,
  upsertJamahTimesService,
} from '../services/masjidsService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

// Without this, a rejected promise in any handler below is an unhandled
// rejection that crashes the whole process instead of returning a 500.
const ah = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// ─── Uploads ─────────────────────────────────────────────────────────────────

const COVERS_DIR = path.join(__dirname, '..', '..', 'public', 'uploads', 'covers');
fs.mkdirSync(COVERS_DIR, { recursive: true });

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const upload = multer({
  storage: multer.diskStorage({
    destination: COVERS_DIR,
    filename: (req, file, cb) => {
      cb(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, WEBP, or GIF images are allowed'));
    }
    cb(null, true);
  },
});

router.post('/uploads/cover', requireAdmin, (req, res, next) => {
  upload.single('cover')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'Upload failed' });
    next();
  });
}, ah(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `${req.protocol}://${req.get('host')}/uploads/covers/${req.file.filename}`;
  res.status(201).json({ url });
}));

// ─── Auth ────────────────────────────────────────────────────────────────────

// POST /admin/login
router.post('/login', ah(async (req, res) => {
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
}));

// GET /admin/me
router.get('/me', requireAdmin, ah(async (req, res) => {
  res.json({ id: req.admin.id, username: req.admin.username });
}));

// ─── Books ───────────────────────────────────────────────────────────────────

router.get('/books', requireAdmin, ah(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM books ORDER BY created_at DESC'
  );
  res.json(rows.map(formatBook));
}));

router.get('/books/:id', requireAdmin, ah(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(formatBook(rows[0]));
}));

router.post('/books', requireAdmin, ah(async (req, res) => {
  const b = req.body;
  const [result] = await pool.query(
    `INSERT INTO books
      (slug, title, title_ar, subtitle, description, language, primary_text_language,
       islamic_topics, author, translator, publisher, published_year,
       cover_url, embed_url, pdf_url, content_type, page_count, license_class, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      b.slug, b.title, b.title_ar || null, b.subtitle || null, b.description || null,
      b.language || 'en', b.primary_text_language || 'en',
      JSON.stringify(b.islamic_topics || []),
      b.author || null, b.translator || null, b.publisher || null,
      b.published_year || null, b.cover_url || null, b.embed_url || null,
      b.pdf_url || null, b.content_type || 'pdf', b.page_count || null,
      b.license_class || 'public_domain', b.status || 'draft',
    ]
  );
  const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [result.insertId]);
  res.status(201).json(formatBook(rows[0]));
}));

router.put('/books/:id', requireAdmin, ah(async (req, res) => {
  const b = req.body;
  await pool.query(
    `UPDATE books SET
      slug=?, title=?, title_ar=?, subtitle=?, description=?, language=?,
      primary_text_language=?, islamic_topics=?, author=?, translator=?,
      publisher=?, published_year=?, cover_url=?, embed_url=?, pdf_url=?,
      content_type=?, page_count=?, license_class=?, status=?
     WHERE id=?`,
    [
      b.slug, b.title, b.title_ar || null, b.subtitle || null, b.description || null,
      b.language || 'en', b.primary_text_language || 'en',
      JSON.stringify(b.islamic_topics || []),
      b.author || null, b.translator || null, b.publisher || null,
      b.published_year || null, b.cover_url || null, b.embed_url || null,
      b.pdf_url || null, b.content_type || 'pdf', b.page_count || null,
      b.license_class || 'public_domain', b.status || 'draft',
      req.params.id,
    ]
  );
  const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(formatBook(rows[0]));
}));

router.delete('/books/:id', requireAdmin, ah(async (req, res) => {
  await pool.query('DELETE FROM books WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

// ─── Book Chapters ──────────────────────────────────────────────────────────

router.get('/books/:bookId/chapters', requireAdmin, ah(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM book_chapters WHERE book_id = ? ORDER BY parent_id IS NULL DESC, parent_id, position',
    [req.params.bookId]
  );
  res.json(rows);
}));

router.post('/books/:bookId/chapters', requireAdmin, ah(async (req, res) => {
  const c = req.body;
  const [result] = await pool.query(
    `INSERT INTO book_chapters (book_id, parent_id, type, position, title, content) VALUES (?, ?, ?, ?, ?, ?)`,
    [req.params.bookId, c.parent_id || null, c.type || 'chapter', c.position, c.title || null, c.content || null]
  );
  const [rows] = await pool.query('SELECT * FROM book_chapters WHERE id = ?', [result.insertId]);
  res.status(201).json(rows[0]);
}));

router.put('/chapters/:id', requireAdmin, ah(async (req, res) => {
  const c = req.body;
  if (c.parent_id && Number(c.parent_id) === Number(req.params.id)) {
    return res.status(400).json({ error: 'A node cannot be its own parent' });
  }
  await pool.query(
    `UPDATE book_chapters SET parent_id=?, type=?, position=?, title=?, content=? WHERE id=?`,
    [c.parent_id || null, c.type || 'chapter', c.position, c.title || null, c.content || null, req.params.id]
  );
  const [rows] = await pool.query('SELECT * FROM book_chapters WHERE id = ?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
}));

router.delete('/chapters/:id', requireAdmin, ah(async (req, res) => {
  await pool.query('DELETE FROM book_chapters WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

// ─── Duas ────────────────────────────────────────────────────────────────────

router.get('/duas', requireAdmin, ah(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM duas ORDER BY category, sort_order, id');
  res.json(rows);
}));

router.get('/duas/categories', requireAdmin, ah(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM dua_categories ORDER BY sort_order, id');
  res.json(rows);
}));

router.post('/duas', requireAdmin, ah(async (req, res) => {
  const d = req.body;
  const [result] = await pool.query(
    `INSERT INTO duas
      (slug, category, arabic, transliteration, translation_en, translation_bn,
       virtue_en, virtue_bn, reference, count, quran_surah, quran_ayah, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      d.slug?.trim() || null, d.category, d.arabic, d.transliteration || null,
      d.translation_en, d.translation_bn || null,
      d.virtue_en || null, d.virtue_bn || null,
      d.reference || null, d.count || 1,
      d.quran_surah || null, d.quran_ayah || null, d.sort_order || 0,
    ]
  );
  const [rows] = await pool.query('SELECT * FROM duas WHERE id = ?', [result.insertId]);
  res.status(201).json(rows[0]);
}));

router.put('/duas/:id', requireAdmin, ah(async (req, res) => {
  const d = req.body;
  await pool.query(
    `UPDATE duas SET
      slug=?, category=?, arabic=?, transliteration=?, translation_en=?, translation_bn=?,
      virtue_en=?, virtue_bn=?, reference=?, count=?, quran_surah=?, quran_ayah=?, sort_order=?
     WHERE id=?`,
    [
      d.slug?.trim() || null, d.category, d.arabic, d.transliteration || null,
      d.translation_en, d.translation_bn || null,
      d.virtue_en || null, d.virtue_bn || null,
      d.reference || null, d.count || 1,
      d.quran_surah || null, d.quran_ayah || null, d.sort_order || 0,
      req.params.id,
    ]
  );
  const [rows] = await pool.query('SELECT * FROM duas WHERE id = ?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
}));

router.delete('/duas/:id', requireAdmin, ah(async (req, res) => {
  await pool.query('DELETE FROM duas WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

// ─── Masjids ─────────────────────────────────────────────────────────────────

router.get('/masjids', requireAdmin, ah(async (req, res) => {
  res.json(await listAllMasjidsService());
}));

router.get('/masjids/:id', requireAdmin, ah(async (req, res) => {
  const masjid = await getMasjidService(req.params.id, { includeHidden: true });
  if (!masjid) return res.status(404).json({ error: 'Not found' });
  res.json(masjid);
}));

router.post('/masjids', requireAdmin, validateMasjidBody, ah(async (req, res) => {
  res.status(201).json(await createMasjidService(req.body));
}));

router.put('/masjids/:id', requireAdmin, validateMasjidBody, ah(async (req, res) => {
  const masjid = await updateMasjidService(req.params.id, req.body);
  if (!masjid) return res.status(404).json({ error: 'Not found' });
  res.json(masjid);
}));

router.put('/masjids/:id/jamah', requireAdmin, validateJamahBody, ah(async (req, res) => {
  const masjid = await upsertJamahTimesService(req.params.id, req.body, { includeHidden: true });
  if (!masjid) return res.status(404).json({ error: 'Not found' });
  res.json(masjid);
}));

router.delete('/masjids/:id', requireAdmin, ah(async (req, res) => {
  await deleteMasjidService(req.params.id);
  res.json({ ok: true });
}));

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
