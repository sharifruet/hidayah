import {
  getCollections,
  getCollection,
  getBooks,
  getBookWithHadiths,
  getHadith,
  getEditions,
  searchHadiths,
} from '../services/hadithService.js';
import { ValidationError, NotFoundError } from '../middleware/errorHandler.js';

function parseTranslations(query) {
  if (!query) return null;
  return String(query).split(',').map((t) => t.trim()).filter(Boolean);
}

// GET /v1/hadith/collections
export async function listCollections(req, res, next) {
  try {
    const data = await getCollections();
    res.json({ meta: {}, data });
  } catch (err) {
    next(err);
  }
}

// GET /v1/hadith/collections/:slug
export async function getCollectionDetail(req, res, next) {
  try {
    const { slug } = req.params;
    const data = await getCollection(slug);
    if (!data) throw new NotFoundError(`Collection "${slug}" not found`);
    res.json({ meta: {}, data });
  } catch (err) {
    next(err);
  }
}

// GET /v1/hadith/collections/:slug/books
export async function listBooks(req, res, next) {
  try {
    const { slug } = req.params;
    const data = await getBooks(slug);
    if (!data) throw new NotFoundError(`Collection "${slug}" not found`);
    res.json({ meta: { collection: slug }, data });
  } catch (err) {
    next(err);
  }
}

// GET /v1/hadith/collections/:slug/books/:bookNumber
export async function getBookDetail(req, res, next) {
  try {
    const { slug } = req.params;
    const bookNumber = parseInt(req.params.bookNumber, 10);
    if (isNaN(bookNumber) || bookNumber < 1) {
      throw new ValidationError('bookNumber must be a positive integer');
    }
    const translations = parseTranslations(req.query.translations);
    const data = await getBookWithHadiths(slug, bookNumber, translations);
    if (!data) throw new NotFoundError(`Book ${bookNumber} not found in "${slug}"`);
    res.json({ meta: { collection: slug, book: bookNumber, translations }, data });
  } catch (err) {
    next(err);
  }
}

// GET /v1/hadith/hadith?collection=bukhari&number=1&translations=ben-bukhari,eng-bukhari
export async function getOneHadith(req, res, next) {
  try {
    const slug = req.query.collection;
    if (!slug) throw new ValidationError('collection query param is required');
    const number = parseInt(req.query.number, 10);
    if (isNaN(number) || number < 1) {
      throw new ValidationError('number query param must be a positive integer');
    }
    const translations = parseTranslations(req.query.translations);
    const data = await getHadith(slug, number, translations);
    if (!data) throw new NotFoundError(`Hadith ${number} not found in "${slug}"`);
    res.json({ meta: { collection: slug, number, translations }, data });
  } catch (err) {
    next(err);
  }
}

// GET /v1/hadith/editions?language=bn
export async function listEditions(req, res, next) {
  try {
    const data = await getEditions(req.query.language);
    res.json({ meta: { language: req.query.language || null }, data });
  } catch (err) {
    next(err);
  }
}

// GET /v1/hadith/search?q=...&language=en&collection=all&page=1&limit=20
export async function search(req, res, next) {
  try {
    const q = (req.query.q || '').trim();
    if (!q || q.length < 2) {
      throw new ValidationError('q must be at least 2 characters');
    }
    if (q.length > 200) {
      throw new ValidationError('q must be at most 200 characters');
    }

    const language   = req.query.language || 'en';
    const collection = req.query.collection || 'all';
    const page       = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit      = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));

    const data = await searchHadiths({ q, language, collection, page, limit });
    res.json({ meta: { q, language, collection, page, limit }, data });
  } catch (err) {
    next(err);
  }
}
