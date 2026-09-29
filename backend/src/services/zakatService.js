import { getNisabRates, GRAMS_PER_BHORI, NISAB_BHORI } from '../config/nisab.js';

/** Current rates plus the nisab thresholds they imply, in taka. */
export function getNisabService() {
  const rates = getNisabRates();
  return {
    currency: 'BDT',
    unit: 'bhori',
    grams_per_bhori: GRAMS_PER_BHORI,
    ...rates,
    nisab_bhori: NISAB_BHORI,
    nisab_value: {
      gold: Math.round(NISAB_BHORI.gold * rates.gold_22k_per_bhori),
      silver: Math.round(NISAB_BHORI.silver * rates.silver_22k_per_bhori),
    },
    zakat_rate: 0.025,
  };
}
