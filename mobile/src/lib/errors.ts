import type { ApiError } from './api';
import type { LanguageCode } from './constants';
import { tr } from '../data/translations';

/**
 * A message fit to show a user for a failed request — never raw server/internal detail.
 * Mirrors `frontend/src/utils/errors.js`.
 */
export function userErrorMessage(error: unknown, language: LanguageCode): string {
  const e = (error ?? {}) as Partial<ApiError>;
  if (e.code === 'NETWORK_ERROR' || e.status === 0) return tr('error_offline', language);
  if (e.status === 404) return tr('error_not_found', language);
  if ((e.status ?? 0) >= 500) return tr('error_unavailable', language);
  return tr('error_generic', language);
}
