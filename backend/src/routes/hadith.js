import express from 'express';
import {
  listCollections,
  getCollectionDetail,
  listBooks,
  getBookDetail,
  getOneHadith,
  listEditions,
  search,
} from '../controllers/hadithController.js';

const router = express.Router();

// GET /v1/hadith/collections
router.get('/collections', listCollections);

// GET /v1/hadith/collections/:slug
router.get('/collections/:slug', getCollectionDetail);

// GET /v1/hadith/collections/:slug/books
router.get('/collections/:slug/books', listBooks);

// GET /v1/hadith/collections/:slug/books/:bookNumber
router.get('/collections/:slug/books/:bookNumber', getBookDetail);

// GET /v1/hadith/hadith
router.get('/hadith', getOneHadith);

// GET /v1/hadith/editions
router.get('/editions', listEditions);

// GET /v1/hadith/search
router.get('/search', search);

export default router;
