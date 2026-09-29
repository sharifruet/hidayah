/**
 * Zakat on wealth, in taka. Nisab is 7.5 bhori (tola) of gold or 52.5 bhori of silver;
 * most Bangladeshi scholars (and the Islamic Foundation) advise the silver nisab since it
 * is lower and so benefits more of the poor. Zakat is 2.5% of net zakatable wealth held
 * for one lunar year. Keep in sync with `frontend/src/utils/zakat.js`.
 */
import apiClient from './api';
import { localDigits } from './format';

export const GRAMS_PER_BHORI = 11.664;
export const NISAB_BHORI = { gold: 7.5, silver: 52.5 } as const;
export const ZAKAT_RATE = 0.025;

export type NisabBasis = 'silver' | 'gold';

export interface NisabPrices {
  /** Taka per bhori, 22-carat. */
  goldPerBhori: number;
  silverPerBhori: number;
  asOf: string;
  source?: string;
}

/** Bundled fallback for offline use — the server's `/zakat/nisab` is preferred. */
export const DEFAULT_NISAB_PRICES: NisabPrices = {
  goldPerBhori: 230772,
  silverPerBhori: 4841,
  asOf: '2026-09-29',
  source: 'BAJUS (22K)',
};

export interface ZakatInput {
  cash: number;
  goldBhori: number;
  silverBhori: number;
  business: number;
  receivables: number;
  investments: number;
  other: number;
  debts: number;
}

export const EMPTY_ZAKAT_INPUT: ZakatInput = {
  cash: 0, goldBhori: 0, silverBhori: 0, business: 0, receivables: 0, investments: 0, other: 0, debts: 0,
};

export interface ZakatResult {
  goldValue: number;
  silverValue: number;
  totalAssets: number;
  net: number;
  nisab: number;
  eligible: boolean;
  zakat: number;
}

export function nisabValue(prices: NisabPrices, basis: NisabBasis): number {
  return basis === 'gold' ? NISAB_BHORI.gold * prices.goldPerBhori : NISAB_BHORI.silver * prices.silverPerBhori;
}

export function calculateZakat(input: ZakatInput, prices: NisabPrices, basis: NisabBasis): ZakatResult {
  const n = (v: number) => (Number.isFinite(v) && v > 0 ? v : 0);
  const goldValue = n(input.goldBhori) * prices.goldPerBhori;
  const silverValue = n(input.silverBhori) * prices.silverPerBhori;
  const totalAssets =
    n(input.cash) + goldValue + silverValue + n(input.business) + n(input.receivables) + n(input.investments) + n(input.other);
  const net = Math.max(totalAssets - n(input.debts), 0);
  const nisab = nisabValue(prices, basis);
  const eligible = net > 0 && net >= nisab;
  return { goldValue, silverValue, totalAssets, net, nisab, eligible, zakat: eligible ? net * ZAKAT_RATE : 0 };
}

interface NisabApiResponse {
  gold_22k_per_bhori: number;
  silver_22k_per_bhori: number;
  as_of: string;
  source?: string;
}

export async function fetchNisabPrices(): Promise<NisabPrices> {
  const res = await apiClient.get<NisabApiResponse, NisabApiResponse>('/zakat/nisab');
  return {
    goldPerBhori: res.gold_22k_per_bhori,
    silverPerBhori: res.silver_22k_per_bhori,
    asOf: res.as_of,
    source: res.source,
  };
}

/**
 * "৳1,23,456" — South Asian digit grouping, the way taka amounts are written in Bangladesh —
 * in the UI language's numerals ("৳১,২৩,৪৫৬" for bn).
 */
export function formatTaka(amount: number, language: string = 'en'): string {
  const whole = Math.round(amount);
  const s = String(Math.abs(whole));
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return localDigits(`${whole < 0 ? '-' : ''}৳${rest ? `${rest},${last3}` : last3}`, language);
}
