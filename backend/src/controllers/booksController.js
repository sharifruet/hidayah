import { listBooksService, getBookService, listTopicsService } from '../services/booksService.js';

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
