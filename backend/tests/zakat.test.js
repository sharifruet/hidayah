import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getNisabRates } from '../src/config/nisab.js';
import { getNisabService } from '../src/services/zakatService.js';

describe('zakat nisab', () => {
  it('falls back to bundled rates when env is unset or invalid', () => {
    const rates = getNisabRates({ NISAB_GOLD_22K_PER_BHORI: 'abc', NISAB_AS_OF: 'yesterday' });
    assert.ok(rates.gold_22k_per_bhori > 0);
    assert.match(rates.as_of, /^\d{4}-\d{2}-\d{2}$/);
  });

  it('uses env overrides', () => {
    const rates = getNisabRates({ NISAB_GOLD_22K_PER_BHORI: '200000', NISAB_SILVER_22K_PER_BHORI: '4000', NISAB_AS_OF: '2026-10-01' });
    assert.deepStrictEqual(
      [rates.gold_22k_per_bhori, rates.silver_22k_per_bhori, rates.as_of],
      [200000, 4000, '2026-10-01']
    );
  });

  it('derives nisab values from the rates', () => {
    const r = getNisabService();
    assert.strictEqual(r.nisab_value.gold, Math.round(7.5 * r.gold_22k_per_bhori));
    assert.strictEqual(r.nisab_value.silver, Math.round(52.5 * r.silver_22k_per_bhori));
  });
});
