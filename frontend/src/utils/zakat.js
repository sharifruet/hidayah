/**
 * Zakat on wealth, in taka. Nisab: 7.5 bhori of gold or 52.5 bhori of silver (the silver
 * nisab is the common advice in Bangladesh). 2.5% of net zakatable wealth held a lunar
 * year. Keep in sync with `mobile/src/lib/zakat.ts`.
 */
import { localDigits } from './format.js';

export const GRAMS_PER_BHORI = 11.664;
export const NISAB_BHORI = { gold: 7.5, silver: 52.5 };
export const ZAKAT_RATE = 0.025;

/** Bundled fallback — the server's `/zakat/nisab` is preferred. Taka per bhori, 22K. */
export const DEFAULT_NISAB_PRICES = {
  goldPerBhori: 230772,
  silverPerBhori: 4841,
  asOf: '2026-09-29',
  source: 'BAJUS (22K)',
};

export function nisabValue(prices, basis) {
  return basis === 'gold' ? NISAB_BHORI.gold * prices.goldPerBhori : NISAB_BHORI.silver * prices.silverPerBhori;
}

/**
 * input: { cash, goldBhori, silverBhori, business, receivables, investments, other, debts }
 * basis: 'silver' | 'gold'
 */
export function calculateZakat(input, prices, basis) {
  const n = (v) => (Number.isFinite(v) && v > 0 ? v : 0);
  const goldValue = n(input.goldBhori) * prices.goldPerBhori;
  const silverValue = n(input.silverBhori) * prices.silverPerBhori;
  const totalAssets =
    n(input.cash) + goldValue + silverValue + n(input.business) + n(input.receivables) + n(input.investments) + n(input.other);
  const net = Math.max(totalAssets - n(input.debts), 0);
  const nisab = nisabValue(prices, basis);
  const eligible = net > 0 && net >= nisab;
  return { goldValue, silverValue, totalAssets, net, nisab, eligible, zakat: eligible ? net * ZAKAT_RATE : 0 };
}

/** "৳1,23,456" — South Asian digit grouping; Bangla numerals for bn ("৳১,২৩,৪৫৬"). */
export function formatTaka(amount, language = 'en') {
  const whole = Math.round(amount);
  const s = String(Math.abs(whole));
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return localDigits(`${whole < 0 ? '-' : ''}৳${rest ? `${rest},${last3}` : last3}`, language);
}
