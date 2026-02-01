import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  getPrayerTimesFromCache,
  storePrayerTimesInCache,
  getFastingTimesFromCache,
  storeFastingTimesInCache
} from '../src/services/cacheService.js';
import pool from '../src/config/database.js';

describe('Cache Service', () => {
  const testLat = 23.8103;
  const testLng = 90.4125;
  const testDate = '2024-03-15';
  const testMethod = 'karachi';

  describe('Prayer Times Cache', () => {
    it('should return null for non-existent cache entry', async () => {
      try {
        const result = await getPrayerTimesFromCache(
          testLat,
          testLng,
          '2099-12-31', // Future date unlikely to be cached
          testMethod
        );
        assert.strictEqual(result, null);
      } catch (error) {
        if (error.message.includes('ECONNREFUSED') || error.message.includes('database')) {
          console.warn('Skipping test - database not available');
          return;
        }
        throw error;
      }
    });

    it('should store and retrieve prayer times from cache', async () => {
      try {
        const testTimes = {
          fajr: '04:45',
          sunrise: '06:00',
          dhuhr: '12:15',
          asr: '15:30',
          maghrib: '18:30',
          sunset: '18:32',
          isha: '19:45'
        };

        // Store in cache
        await storePrayerTimesInCache(
          testLat,
          testLng,
          testDate,
          testMethod,
          testTimes,
          '+06:00'
        );

        // Retrieve from cache
        const cached = await getPrayerTimesFromCache(
          testLat,
          testLng,
          testDate,
          testMethod
        );

        assert.notStrictEqual(cached, null);
        assert.strictEqual(cached.method, testMethod);
        assert.strictEqual(cached.date, testDate);
      } catch (error) {
        if (error.message.includes('ECONNREFUSED') || error.message.includes('database')) {
          console.warn('Skipping test - database not available');
          return;
        }
        throw error;
      }
    });

    it('should bypass cache for custom options', async () => {
      try {
        const options = {
          fajr_angle: 20.0,
          isha_angle: 18.0
        };

        const result = await getPrayerTimesFromCache(
          testLat,
          testLng,
          testDate,
          testMethod,
          options
        );

        // Should return null (bypass cache)
        assert.strictEqual(result, null);
      } catch (error) {
        if (error.message.includes('ECONNREFUSED') || error.message.includes('database')) {
          console.warn('Skipping test - database not available');
          return;
        }
        throw error;
      }
    });
  });

  describe('Fasting Times Cache', () => {
    it('should return null for non-existent cache entry', async () => {
      try {
        const result = await getFastingTimesFromCache(
          testLat,
          testLng,
          '2099-12-31',
          testMethod,
          10
        );
        assert.strictEqual(result, null);
      } catch (error) {
        if (error.message.includes('ECONNREFUSED') || error.message.includes('database')) {
          console.warn('Skipping test - database not available');
          return;
        }
        throw error;
      }
    });
  });
});
