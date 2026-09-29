/**
 * Gold/silver rates used for the zakat nisab (Bangladesh, taka per bhori, 22-carat, as
 * published by BAJUS). Update the defaults when BAJUS revises its rates, or override
 * without a deploy via env: NISAB_GOLD_22K_PER_BHORI, NISAB_SILVER_22K_PER_BHORI,
 * NISAB_AS_OF (YYYY-MM-DD).
 */
export const GRAMS_PER_BHORI = 11.664;

// Nisab thresholds in bhori (= tola): 7.5 of gold, 52.5 of silver.
export const NISAB_BHORI = { gold: 7.5, silver: 52.5 };

const DEFAULTS = {
  gold_22k_per_bhori: 230772,
  silver_22k_per_bhori: 4841,
  as_of: '2026-09-29',
  source: 'BAJUS (22K)',
};

function positiveNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function getNisabRates(env = process.env) {
  return {
    gold_22k_per_bhori: positiveNumber(env.NISAB_GOLD_22K_PER_BHORI, DEFAULTS.gold_22k_per_bhori),
    silver_22k_per_bhori: positiveNumber(env.NISAB_SILVER_22K_PER_BHORI, DEFAULTS.silver_22k_per_bhori),
    as_of: /^\d{4}-\d{2}-\d{2}$/.test(env.NISAB_AS_OF ?? '') ? env.NISAB_AS_OF : DEFAULTS.as_of,
    source: env.NISAB_SOURCE || DEFAULTS.source,
  };
}
