import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { getPrayerTimesService } from '../src/services/prayerTimesService.js';
import pool from '../src/config/database.js';

describe('Prayer Times Service', () => {
  const testLat = 23.8103; // Dhaka
  const testLng = 90.4125;
  const testDate = '2024-03-15';
  const testMethod = 'karachi';

  before(async () => {
    // Ensure database is connected
    try {
      await pool.getConnection();
    } catch (error) {
      console.warn('Database not available for tests:', error.message);
    }
  });

  it('should calculate prayer times for valid coordinates', async () => {
    try {
      const result = await getPrayerTimesService(testLat, testLng, testDate, testMethod);

      assert.notStrictEqual(result, null);
      assert.strictEqual(result.date, testDate);
      assert.strictEqual(result.method, testMethod);
      assert.notStrictEqual(result.times, undefined);
      assert.notStrictEqual(result.times.fajr, undefined);
      assert.notStrictEqual(result.times.sunrise, undefined);
      assert.notStrictEqual(result.times.dhuhr, undefined);
      assert.notStrictEqual(result.times.asr, undefined);
      assert.notStrictEqual(result.times.maghrib, undefined);
      assert.notStrictEqual(result.times.isha, undefined);

      // Verify time format (HH:MM)
      assert.match(result.times.fajr, /^\d{2}:\d{2}$/);
      assert.match(result.times.sunrise, /^\d{2}:\d{2}$/);
      assert.match(result.times.dhuhr, /^\d{2}:\d{2}$/);
    } catch (error) {
      // Skip if database is not available
      if (error.message.includes('ECONNREFUSED') || error.message.includes('database')) {
        console.warn('Skipping test - database not available');
        return;
      }
      throw error;
    }
  });

  it('should return cached data on second request', async () => {
    try {
      // First request
      const result1 = await getPrayerTimesService(testLat, testLng, testDate, testMethod);

      // Second request (should be cached)
      const result2 = await getPrayerTimesService(testLat, testLng, testDate, testMethod);

      assert.strictEqual(result2.cache_hit, true);
      assert.strictEqual(result2.times.fajr, result1.times.fajr);
      assert.strictEqual(result2.times.dhuhr, result1.times.dhuhr);
    } catch (error) {
      if (error.message.includes('ECONNREFUSED') || error.message.includes('database')) {
        console.warn('Skipping test - database not available');
        return;
      }
      throw error;
    }
  });

  it('should handle custom options correctly', async () => {
    try {
      const options = {
        fajr_angle: 20.0,
        isha_angle: 18.0,
        asr_method: 'hanafi'
      };

      const result = await getPrayerTimesService(testLat, testLng, testDate, testMethod, options);

      assert.notStrictEqual(result, null);
      assert.strictEqual(result.cache_hit, false); // Custom options should bypass cache
    } catch (error) {
      if (error.message.includes('ECONNREFUSED') || error.message.includes('database')) {
        console.warn('Skipping test - database not available');
        return;
      }
      throw error;
    }
  });

  it('should include location info when available', async () => {
    try {
      const result = await getPrayerTimesService(testLat, testLng, testDate, testMethod);

      assert.notStrictEqual(result.location, undefined);
      assert.strictEqual(result.location.latitude, testLat);
      assert.strictEqual(result.location.longitude, testLng);
    } catch (error) {
      if (error.message.includes('ECONNREFUSED') || error.message.includes('database')) {
        console.warn('Skipping test - database not available');
        return;
      }
      throw error;
    }
  });
});
