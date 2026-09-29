/**
 * Islamic days derived from the (offset-adjusted) Hijri calendar: annual observances,
 * Ayyam al-Bid (13th–15th) and the Monday/Thursday sunnah fasts.
 * Night observances (Shab-e-Barat, Shab-e-Qadr) are reported on the evening they begin —
 * the day before their Hijri date — as Bangladeshi calendars list them.
 * Mirrors `mobile/src/lib/islamicDays.ts`.
 */
import { addDays, gregorianToHijri, getHijriOffset } from './hijri.js';
import { fmt, tr } from '../i18n/translations.js';
import { localDigits } from './format.js';

export const ANNUAL_EVENTS = [
  { key: 'hijri_new_year', kind: 'major', month: 1, day: 1 },
  { key: 'ashura', kind: 'major', month: 1, day: 10 },
  { key: 'shab_e_barat', kind: 'night', month: 8, day: 15 },
  { key: 'ramadan_start', kind: 'major', month: 9, day: 1 },
  { key: 'shab_e_qadr', kind: 'night', month: 9, day: 27 },
  { key: 'eid_al_fitr', kind: 'eid', month: 10, day: 1 },
  { key: 'arafah', kind: 'major', month: 12, day: 9 },
  { key: 'eid_al_adha', kind: 'eid', month: 12, day: 10 },
];

const RAMADAN = 9;

/** Both Eids and the days of Tashriq (11–13 Dhul Hijjah): fasting is prohibited. */
export function isForbiddenFastDay(h) {
  return (h.month === 10 && h.day === 1) || (h.month === 12 && h.day >= 10 && h.day <= 13);
}

/** [{ key, kind }] observed on a local calendar date. kind: eid | major | night | fast */
export function islamicDaysOn(date, offset = getHijriOffset()) {
  const h = gregorianToHijri(date, offset);
  const tomorrow = gregorianToHijri(addDays(date, 1), offset);
  const events = [];
  for (const e of ANNUAL_EVENTS) {
    const target = e.kind === 'night' ? tomorrow : h;
    if (target.month === e.month && target.day === e.day) events.push({ key: e.key, kind: e.kind });
  }
  if (h.month !== RAMADAN && !isForbiddenFastDay(h)) {
    if (h.day >= 13 && h.day <= 15) events.push({ key: 'ayyam_al_bid', kind: 'fast' });
    if (date.getDay() === 1) events.push({ key: 'monday_fast', kind: 'fast' });
    if (date.getDay() === 4) events.push({ key: 'thursday_fast', kind: 'fast' });
  }
  return events;
}

/** Next occurrence of each annual observance, soonest first: [{ key, kind, date, daysAway }]. */
export function upcomingIslamicDays(from = new Date(), horizonDays = 400, offset = getHijriOffset()) {
  const start = addDays(from, 0);
  const seen = new Set();
  const out = [];
  for (let i = 0; i < horizonDays && seen.size < ANNUAL_EVENTS.length; i++) {
    const date = addDays(start, i);
    for (const e of islamicDaysOn(date, offset)) {
      if (e.kind === 'fast' || seen.has(e.key)) continue;
      seen.add(e.key);
      out.push({ ...e, date, daysAway: i });
    }
  }
  return out;
}

/** "Today" / "Tonight" / "Tomorrow" / "in N days" for an upcoming observance. */
export function whenLabel(e, language) {
  if (e.daysAway === 0) return tr(e.kind === 'night' ? 'islamic_days_tonight' : 'islamic_days_today', language);
  if (e.daysAway === 1) return tr('islamic_days_tomorrow', language);
  return fmt('islamic_days_in', language, { n: localDigits(e.daysAway, language) });
}
