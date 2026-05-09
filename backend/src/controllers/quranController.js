import {
  getSurahIndex,
  getSurahMeta,
  getSurahWithTranslations,
  getAyah,
  getTranslations,
  getReciters,
  searchQuran,
  getCitation,
  getWordByWord,
  getMushafPage,
  getTafsir,
  TAFSIR_EDITIONS,
} from '../services/quranService.js';
import { ValidationError, NotFoundError } from '../middleware/errorHandler.js';

function parseTranslations(query) {
  if (!query) return ['en.sahih'];
  return String(query).split(',').map((t) => t.trim()).filter(Boolean);
}

// GET /v1/quran/surahs
export async function listSurahs(req, res, next) {
  try {
    const data = await getSurahIndex();
    res.json({ meta: {}, data });
  } catch (err) {
    next(err);
  }
}

// GET /v1/quran/surahs/:surahNumber
export async function getSurah(req, res, next) {
  try {
    const num = parseInt(req.params.surahNumber, 10);
    if (isNaN(num) || num < 1 || num > 114) {
      throw new ValidationError('surahNumber must be between 1 and 114');
    }
    const translations = parseTranslations(req.query.translations);
    const data = await getSurahWithTranslations(num, translations);
    res.json({ meta: { surah: num, translations }, data });
  } catch (err) {
    next(err);
  }
}

// GET /v1/quran/surahs/:surahNumber/ayahs
export async function listAyahs(req, res, next) {
  try {
    const num = parseInt(req.params.surahNumber, 10);
    if (isNaN(num) || num < 1 || num > 114) {
      throw new ValidationError('surahNumber must be between 1 and 114');
    }
    const translations = parseTranslations(req.query.translations);
    const from = parseInt(req.query.from, 10) || 1;
    const surah = await getSurahWithTranslations(num, translations);

    let ayahs = surah.ayahs;
    if (from > 1) ayahs = ayahs.filter((a) => a.number >= from);
    if (req.query.to) {
      const to = parseInt(req.query.to, 10);
      ayahs = ayahs.filter((a) => a.number <= to);
    } else if (req.query.limit) {
      ayahs = ayahs.slice(0, parseInt(req.query.limit, 10));
    }

    res.json({
      meta: {
        surah: num,
        translations,
        from,
        to: req.query.to || null,
        limit: req.query.limit || null,
        total: surah.ayah_count,
        returned: ayahs.length,
      },
      data: {
        surah: {
          number: surah.number,
          name_ar: surah.name_ar,
          name_en: surah.name_en,
          name_en_trans: surah.name_en_trans,
          revelation_type: surah.revelation_type,
          ayah_count: surah.ayah_count,
        },
        ayahs,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /v1/quran/ayah?surah=1&ayah=1&translations=en.sahih
export async function getOneAyah(req, res, next) {
  try {
    const surahNum = parseInt(req.query.surah, 10);
    const ayahNum  = parseInt(req.query.ayah, 10);
    if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
      throw new ValidationError('surah query param must be between 1 and 114');
    }
    if (isNaN(ayahNum) || ayahNum < 1) {
      throw new ValidationError('ayah query param must be a positive integer');
    }
    const translations = parseTranslations(req.query.translations);
    const data = await getAyah(surahNum, ayahNum, translations);
    res.json({ meta: { surah: surahNum, ayah: ayahNum, translations }, data });
  } catch (err) {
    next(err);
  }
}

// GET /v1/quran/translations
export async function listTranslations(req, res, next) {
  try {
    let data = await getTranslations();
    if (req.query.language) {
      data = data.filter((t) => t.language === req.query.language);
    }
    res.json({ meta: { language: req.query.language || null }, data });
  } catch (err) {
    next(err);
  }
}

// GET /v1/quran/reciters
export async function listReciters(req, res, next) {
  try {
    const data = getReciters();
    res.json({ meta: {}, data });
  } catch (err) {
    next(err);
  }
}

// GET /v1/quran/search?q=...&edition=en.sahih&surah=all&page=1&limit=20
export async function search(req, res, next) {
  try {
    const q = (req.query.q || '').trim();
    if (!q || q.length < 2) {
      throw new ValidationError('q must be at least 2 characters');
    }
    if (q.length > 200) {
      throw new ValidationError('q must be at most 200 characters');
    }

    const edition = req.query.translation || req.query.edition || 'en.sahih';
    const surah   = req.query.surah || 'all';
    const page    = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit   = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));

    const data = await searchQuran(q, edition, surah, page, limit);
    res.json({ meta: { q, edition, surah, page, limit }, data });
  } catch (err) {
    next(err);
  }
}

// GET /v1/quran/citation?surah=1&from=1&to=7&translations=en.sahih
export async function citation(req, res, next) {
  try {
    const surahNum = parseInt(req.query.surah, 10);
    const fromAyah = parseInt(req.query.from, 10);
    if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
      throw new ValidationError('surah query param must be between 1 and 114');
    }
    if (isNaN(fromAyah) || fromAyah < 1) {
      throw new ValidationError('from query param must be a positive integer');
    }

    const toAyah = req.query.to ? parseInt(req.query.to, 10) : fromAyah;
    const translations   = parseTranslations(req.query.translations);
    const format         = req.query.format === 'markdown' ? 'markdown' : 'text';
    const includeArabic      = req.query.include_arabic !== 'false';
    const includeTranslation = req.query.include_translation !== 'false';

    const data = await getCitation(
      surahNum, fromAyah, toAyah,
      translations, format,
      includeArabic, includeTranslation
    );
    res.json({ meta: { surah: surahNum, from: fromAyah, to: toAyah, translations, format }, data });
  } catch (err) {
    next(err);
  }
}

// GET /v1/quran/surahs/:surahNumber/words
export async function getWords(req, res, next) {
  try {
    const num = parseInt(req.params.surahNumber, 10);
    if (isNaN(num) || num < 1 || num > 114) {
      throw new ValidationError('surahNumber must be between 1 and 114');
    }
    const data = await getWordByWord(num);
    res.json({ meta: { surah: num }, data });
  } catch (err) {
    next(err);
  }
}

// GET /v1/quran/tafsir?surah=1&ayah=1&edition=en.kathir
export async function getTafsirData(req, res, next) {
  try {
    const surahNum = parseInt(req.query.surah, 10);
    const ayahNum  = parseInt(req.query.ayah, 10);
    if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
      throw new ValidationError('surah query param must be between 1 and 114');
    }
    if (isNaN(ayahNum) || ayahNum < 1) {
      throw new ValidationError('ayah query param must be a positive integer');
    }
    const edition = req.query.edition || 'en.kathir';
    const data = await getTafsir(surahNum, ayahNum, edition);
    res.json({ meta: { surah: surahNum, ayah: ayahNum, edition }, data });
  } catch (err) {
    next(err);
  }
}

// GET /v1/quran/tafsirs – list available tafsir editions
export async function listTafsirs(req, res, next) {
  try {
    const editions = [
      { id: 'en.kathir',       name: 'Ibn Kathir',        language: 'en' },
      { id: 'en.maarifulquran', name: 'Maariful Quran',   language: 'en' },
      { id: 'bn.bengali',      name: 'Bengali Tafsir',    language: 'bn' },
    ];
    res.json({ meta: {}, data: editions });
  } catch (err) {
    next(err);
  }
}

// GET /v1/quran/pages/:pageNumber
export async function getPageData(req, res, next) {
  try {
    const num = parseInt(req.params.pageNumber, 10);
    if (isNaN(num) || num < 1 || num > 604) {
      throw new ValidationError('pageNumber must be between 1 and 604');
    }
    const translations = (req.query.translations || 'en.sahih')
      .split(',').map((t) => t.trim()).filter(Boolean);
    const data = await getMushafPage(num, translations);
    res.json({ meta: { page: num, translations }, data });
  } catch (err) {
    next(err);
  }
}
