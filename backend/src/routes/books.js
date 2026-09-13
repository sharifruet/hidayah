import { Router } from 'express';
import { listBooks, getBook, listTopics, listChapters, getChapter } from '../controllers/booksController.js';

const router = Router();

// Static routes before dynamic :slug
router.get('/topics', listTopics);
router.get('/', listBooks);
router.get('/:slug/chapters/:id', getChapter);
router.get('/:slug/chapters', listChapters);
router.get('/:slug', getBook);

export default router;
