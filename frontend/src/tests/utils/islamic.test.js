import { describe, it, expect, beforeEach } from 'vitest';
import { gregorianToHijri, hijriMonthDays, HIJRI_OFFSET_KEY } from '../../utils/hijri.js';
import { islamicDaysOn, upcomingIslamicDays } from '../../utils/islamicDays.js';
import { forbiddenWindows, activeForbiddenWindow } from '../../utils/forbiddenTimes.js';
import { calculateZakat, formatTaka, DEFAULT_NISAB_PRICES } from '../../utils/zakat.js';

beforeEach(() => localStorage.removeItem(HIJRI_OFFSET_KEY));

describe('hijri', () => {
  it('converts with a 1-based Gregorian month (1 Ramadan 1447 = 18 Feb 2026)', () => {
    expect(gregorianToHijri(new Date(2026, 1, 18))).toMatchObject({ year: 1447, month: 9, day: 1 });
  });

  it('applies the moon-sighting offset, explicit or saved', () => {
    expect(gregorianToHijri(new Date(2026, 1, 18), -1)).toMatchObject({ month: 8, day: 29 });
    localStorage.setItem(HIJRI_OFFSET_KEY, '-1');
    expect(gregorianToHijri(new Date(2026, 1, 18)).month).toBe(8);
  });

  it('lists the days of the current Ramadan from mid-month', () => {
    const days = hijriMonthDays(9, new Date(2026, 1, 25), 0);
    expect(days[0].toDateString()).toBe(new Date(2026, 1, 18).toDateString());
    expect(days.length).toBeGreaterThanOrEqual(29);
  });
});

describe('islamic days', () => {
  it('puts Shab-e-Barat on the evening before 15 Sha\'ban', () => {
    // 15 Sha'ban 1447 is 3 Feb 2026 in the tabular calendar → observed the night of 2 Feb.
    expect(islamicDaysOn(new Date(2026, 1, 2), 0).map((e) => e.key)).toContain('shab_e_barat');
  });

  it('never suggests a sunnah fast in Ramadan or on Eid', () => {
    const ramadanMonday = new Date(2026, 1, 23);
    expect(islamicDaysOn(ramadanMonday, 0).filter((e) => e.kind === 'fast')).toEqual([]);
    const eid = islamicDaysOn(new Date(2026, 2, 20), 0);
    expect(eid.map((e) => e.key)).toContain('eid_al_fitr');
    expect(eid.filter((e) => e.kind === 'fast')).toEqual([]);
  });

  it('returns each annual observance once, soonest first', () => {
    const list = upcomingIslamicDays(new Date(2026, 8, 29), 400, 0);
    expect(list).toHaveLength(8);
    expect(list.map((e) => e.daysAway)).toEqual([...list.map((e) => e.daysAway)].sort((a, b) => a - b));
  });
});

describe('forbidden times', () => {
  const times = { sunrise: '05:50', dhuhr: '11:55', sunset: '17:40' };
  it('derives the three windows', () => {
    expect(forbiddenWindows(times)).toEqual([
      { key: 'sunrise', start: '05:50', end: '06:05' },
      { key: 'zawal', start: '11:49', end: '11:55' },
      { key: 'sunset', start: '17:25', end: '17:40' },
    ]);
  });
  it('detects the active window', () => {
    expect(activeForbiddenWindow(times, new Date(2026, 0, 1, 11, 50))?.key).toBe('zawal');
    expect(activeForbiddenWindow(times, new Date(2026, 0, 1, 12, 0))).toBeNull();
  });
});

describe('zakat', () => {
  const prices = { ...DEFAULT_NISAB_PRICES, goldPerBhori: 200000, silverPerBhori: 4000 };
  it('is due at 2.5% above the silver nisab', () => {
    const r = calculateZakat({ cash: 300000, debts: 50000 }, prices, 'silver');
    expect(r.nisab).toBe(52.5 * 4000);
    expect(r.net).toBe(250000);
    expect(r.zakat).toBe(6250);
  });
  it('is not due below the gold nisab', () => {
    expect(calculateZakat({ cash: 300000 }, prices, 'gold').eligible).toBe(false);
  });
  it('formats taka with South Asian grouping', () => {
    expect(formatTaka(1234567)).toBe('৳12,34,567');
    expect(formatTaka(999)).toBe('৳999');
  });
});
