import apiClient from './api.js';

/** Current 22K gold/silver rates per bhori, mapped to the calculator's shape. */
export async function getNisabPrices() {
  const res = await apiClient.get('/zakat/nisab');
  return {
    goldPerBhori: res.gold_22k_per_bhori,
    silverPerBhori: res.silver_22k_per_bhori,
    asOf: res.as_of,
    source: res.source,
  };
}
