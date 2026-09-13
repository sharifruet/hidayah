import {
  listBooksService,
  getBookService,
  listTopicsService,
  listChaptersService,
  getChapterService,
} from '../services/booksService.js';

export async function listBooks(req, res, next) {
  try {
    const { topic, lang, q, page, limit } = req.query;
    const result = await listBooksService({ topic, lang, q, page, limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getBook(req, res, next) {
  try {
    const book = await getBookService(req.params.slug);
    if (!book) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Book not found' } });
    }
    res.json(book);
  } catch (err) {
    next(err);
  }
}

export function listTopics(req, res) {
  res.json(listTopicsService());
}

export async function listChapters(req, res, next) {
  try {
    const chapters = await listChaptersService(req.params.slug);
    if (!chapters) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Book not found' } });
    }
    res.json(chapters);
  } catch (err) {
    next(err);
  }
}

export async function getChapter(req, res, next) {
  try {
    const chapter = await getChapterService(req.params.slug, req.params.id);
    if (!chapter) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Chapter not found' } });
    }
    res.json(chapter);
  } catch (err) {
    next(err);
  }
}
