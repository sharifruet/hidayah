import crypto from 'crypto';

/**
 * Sync codes: the only credential for optional cloud sync. 16 Crockford base32 characters
 * (80 bits of randomness) shown as XXXX-XXXX-XXXX-XXXX. The server stores only a SHA-256 of
 * the normalised code; with 80 random bits a fast hash is enough (no dictionary to guess from).
 */
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Crockford: no I, L, O, U
const LENGTH = 16;

export function generateSyncCode() {
  const bytes = crypto.randomBytes(LENGTH);
  let raw = '';
  for (let i = 0; i < LENGTH; i++) raw += ALPHABET[bytes[i] & 31]; // 256 % 32 === 0 → unbiased
  return formatSyncCode(raw);
}

/** Uppercase, drop spaces/dashes, and map look-alikes (O→0, I/L→1) the way Crockford does. */
export function normalizeSyncCode(input) {
  if (typeof input !== 'string') return null;
  const raw = input.toUpperCase().replace(/[\s-]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1');
  return /^[0-9A-HJKMNP-TV-Z]{16}$/.test(raw) ? raw : null;
}

export function formatSyncCode(raw) {
  return raw.match(/.{4}/g).join('-');
}

export function hashSyncCode(normalized) {
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/** Documents a client may sync — the on-device storage keys (same on web and mobile). */
export const SYNC_DOC_KEYS = [
  'salah_tracker_log',
  'qada_counts',
  'quran_bookmarks',
  'quran_khatm',
  'quran_streak',
  'quran_last_read',
  'tasbih_counts',
  'fav_duas',
  'hadith_bookmarks',
  'book_positions',
];

/** Max serialised size of one document (a decade of prayer-tracker history is ~300 KB). */
export const SYNC_DOC_MAX_BYTES = 512 * 1024;
