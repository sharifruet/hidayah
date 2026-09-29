import { describe, it, expect } from 'vitest';
import { userErrorMessage, errorKind } from '../../utils/errors.js';
import { formatDate, localeFor } from '../../utils/format.js';
import { formatTaka } from '../../utils/zakat.js';

describe('userErrorMessage', () => {
  it('maps network errors', () => {
    expect(errorKind({ code: 'NETWORK_ERROR', status: 0 })).toBe('network');
    expect(userErrorMessage({ code: 'NETWORK_ERROR', status: 0 }, 'en')).toMatch(/No internet connection/);
    expect(userErrorMessage({ code: 'NETWORK_ERROR', status: 0 }, 'bn')).toMatch(/ইন্টারনেট/);
  });
  it('maps 404 and 5xx without leaking server text', () => {
    expect(userErrorMessage({ message: 'Surah not found', status: 404 }, 'en')).toBe('Not found.');
    const msg = userErrorMessage({ message: 'ER_ACCESS_DENIED', status: 503 }, 'tr');
    expect(msg).not.toMatch(/ER_ACCESS/);
    expect(msg).toMatch(/Hizmet/);
  });
  it('falls back to a generic message', () => {
    expect(userErrorMessage(new Error('boom'), 'en')).toBe('Something went wrong.');
  });
  it('passes through already-localized strings', () => {
    expect(userErrorMessage('কোনো তথ্য নেই', 'bn')).toBe('কোনো তথ্য নেই');
  });
});

describe('locale helpers', () => {
  it('maps languages to locales', () => {
    expect(localeFor('bn')).toBe('bn-BD');
    expect(localeFor('xx')).toBe('en-US');
  });
  it('formats ISO dates as local dates with Bangla digits', () => {
    expect(formatDate('2026-03-05', 'en', { day: 'numeric', month: 'numeric', year: 'numeric' })).toBe('3/5/2026');
    expect(formatDate('2026-03-05', 'bn', { day: 'numeric' })).toBe('৫');
  });
  it('formats taka with Bangla digits in bn', () => {
    expect(formatTaka(1234567, 'bn')).toBe('৳১২,৩৪,৫৬৭');
  });
});
