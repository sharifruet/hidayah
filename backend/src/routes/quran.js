import express from 'express';
import {
  listSurahs,
  getSurah,
  listAyahs,
  getOneAyah,
  listTranslations,
  listReciters,
  search,
  citation,
  getWords,
  getPageData,
  getTafsirData,
  listTafsirs,
} from '../controllers/quranController.js';

const router = express.Router();

// GET /v1/quran/surahs
router.get('/surahs', listSurahs);

// GET /v1/quran/surahs/:surahNumber
router.get('/surahs/:surahNumber', getSurah);

// GET /v1/quran/surahs/:surahNumber/ayahs
router.get('/surahs/:surahNumber/ayahs', listAyahs);

// GET /v1/quran/surahs/:surahNumber/words
router.get('/surahs/:surahNumber/words', getWords);

// GET /v1/quran/ayah
router.get('/ayah', getOneAyah);

// GET /v1/quran/translations
router.get('/translations', listTranslations);

// GET /v1/quran/reciters
router.get('/reciters', listReciters);

// GET /v1/quran/search
router.get('/search', search);

// GET /v1/quran/citation
router.get('/citation', citation);

// GET /v1/quran/tafsirs
router.get('/tafsirs', listTafsirs);

// GET /v1/quran/tafsir?surah=1&ayah=1&edition=en.kathir
router.get('/tafsir', getTafsirData);

// GET /v1/quran/pages/:pageNumber
router.get('/pages/:pageNumber', getPageData);

export default router;
