/**
 * Turn a normalized API error (`{ message, code, status }` from `services/api.js`), a JS Error
 * or a string into a short, localized message for users. Never surfaces server messages (they
 * are English-only and may leak internals); 4xx errors get a localized category message instead.
 * A plain string is assumed to already be a user-facing, localized message and is returned as-is.
 */
import { tr } from '../i18n/translations.js';

/**
 * Which bucket an error falls into:
 * 'network' | 'not_found' | 'server' | 'invalid' | 'auth' | 'rate_limited' | 'generic'.
 */
export function errorKind(error) {
  if (!error || typeof error !== 'object') return 'generic';
  const status = typeof error.status === 'number' ? error.status : undefined;
  if (error.code === 'NETWORK_ERROR' || status === 0) return 'network';
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return 'network';
  if (status === 404) return 'not_found';
  if (status >= 500) return 'server';
  if (status === 401 || status === 403) return 'auth';
  if (status === 429) return 'rate_limited';
  if (status === 400 || status === 422) return 'invalid';
  return 'generic';
}

export function userErrorMessage(error, language = 'en') {
  if (!error) return '';
  if (typeof error === 'string') return error; // caller-supplied, already user-facing
  switch (errorKind(error)) {
    case 'network':
      return tr('error_network', language);
    case 'not_found':
      return tr('error_not_found', language);
    case 'server':
      return tr('error_server', language);
    case 'invalid':
      return tr('error_invalid', language);
    case 'auth':
      return tr('error_auth', language);
    case 'rate_limited':
      return tr('error_rate_limited', language);
    default:
      return tr('error_generic', language);
  }
}
