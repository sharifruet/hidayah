/**
 * Islamic days derived from the (offset-adjusted) Hijri calendar: annual observances,
 * the "white days" (Ayyam al-Bid, 13th–15th) and the Monday/Thursday sunnah fasts.
 *
 * Night observances (Shab-e-Barat, Shab-e-Qadr) begin at Maghrib the evening *before*
 * their Hijri date, so they are reported on that evening's Gregorian date — the way
 * Bangladeshi calendars list them.
 */
import { addDays } from './dates';
import { gregorianToHijri, getHijriOffset, type HijriDate } from './hijri';

export type IslamicDayKind = 'eid' | 'major' | 'night' | 'fast';

export interface IslamicDayEvent {
  /** Translation key suffix, e.g. `ashura` → `iday_ashura`. */
  key: string;
  kind: IslamicDayKind;
}

interface AnnualEvent extends IslamicDayEvent {
  month: number;
  day: number;
}

export const ANNUAL_EVENTS: AnnualEvent[] = [
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

/** Days on which fasting is prohibited: both Eids and the days of Tashriq (11–13 Dhul Hijjah). */
export function isForbiddenFastDay(h: HijriDate): boolean {
  return (h.month === 10 && h.day === 1) || (h.month === 12 && h.day >= 10 && h.day <= 13);
}

/** Everything observed on a local calendar date. */
export function islamicDaysOn(date: Date, offset = getHijriOffset()): IslamicDayEvent[] {
  const h = gregorianToHijri(date, offset);
  const tomorrow = gregorianToHijri(addDays(date, 1), offset);
  const events: IslamicDayEvent[] = [];

  for (const e of ANNUAL_EVENTS) {
    const target = e.kind === 'night' ? tomorrow : h;
    if (target.month === e.month && target.day === e.day) events.push({ key: e.key, kind: e.kind });
  }

  // Voluntary fasts — not in Ramadan (already obligatory) and never on a prohibited day.
  if (h.month !== RAMADAN && !isForbiddenFastDay(h)) {
    if (h.day >= 13 && h.day <= 15) events.push({ key: 'ayyam_al_bid', kind: 'fast' });
    const weekday = date.getDay();
    if (weekday === 1) events.push({ key: 'monday_fast', kind: 'fast' });
    if (weekday === 4) events.push({ key: 'thursday_fast', kind: 'fast' });
  }
  return events;
}

export interface UpcomingIslamicDay extends IslamicDayEvent {
  date: Date;
  daysAway: number;
}

/** The next occurrence of each annual observance within `horizonDays`, soonest first. */
export function upcomingIslamicDays(from: Date = new Date(), horizonDays = 400, offset = getHijriOffset()): UpcomingIslamicDay[] {
  const start = addDays(from, 0);
  const seen = new Set<string>();
  const out: UpcomingIslamicDay[] = [];
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
