import { Router } from 'express';
import { listBooks, getBook, listTopics } from '../controllers/booksController.js';

const router = Router();

// Static routes before dynamic :slug
router.get('/topics', listTopics);
router.get('/', listBooks);
router.get('/:slug', getBook);

export default router;
