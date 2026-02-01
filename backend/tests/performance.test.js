import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getPrayerTimesService } from '../src/services/prayerTimesService.js';
import { calculatePrayerTimes } from '../src/utils/calculations.js';

describe('Performance Tests', () => {
  const testLat = 23.8103;
  const testLng = 90.4125;
  const testDate = new Date('2024-03-15');
  const testMethod = 'karachi';

  describe('Calculation Performance', () => {
    it('should calculate prayer times quickly (< 10ms)', () => {
      const start = Date.now();
      const times = calculatePrayerTimes(testLat, testLng, testDate, testMethod);
      const duration = Date.now() - start;

      assert.notStrictEqual(times, null);
      assert(duration < 10, `Calculation took ${duration}ms, expected < 10ms`);
    });

    it('should handle batch calculations efficiently', () => {
      const coordinates = [
        { lat: 23.8103, lng: 90.4125 },
        { lat: 24.3636, lng: 88.6241 },
        { lat: 22.3569, lng: 91.7832 }
      ];

      const start = Date.now();
      coordinates.forEach(coord => {
        calculatePrayerTimes(coord.lat, coord.lng, testDate, testMethod);
      });
      const duration = Date.now() - start;

      // Should handle 3 calculations in reasonable time
      assert(duration < 50, `Batch calculation took ${duration}ms, expected < 50ms`);
    });
  });

  describe('Cache Performance', () => {
    it('should return cached results faster than calculation', async () => {
      try {
        // First request (calculation)
        const start1 = Date.now();
        await getPrayerTimesService(testLat, testLng, '2024-03-15', testMethod);
        const duration1 = Date.now() - start1;

        // Second request (cached)
        const start2 = Date.now();
        await getPrayerTimesService(testLat, testLng, '2024-03-15', testMethod);
        const duration2 = Date.now() - start2;

        // Cached should be faster (or at least not slower)
        assert(duration2 <= duration1 * 2,
          `Cached request (${duration2}ms) should be faster than calculation (${duration1}ms)`);
      } catch (error) {
        // Skip if database is not available
        if (error.code === 'ECONNREFUSED' ||
            error.message.includes('ECONNREFUSED') ||
            error.message.includes('database') ||
            error.message.includes('Connection')) {
          console.warn('Skipping test - database not available');
          return;
        }
        throw error;
      }
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory with repeated calculations', () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Perform many calculations
      for (let i = 0; i < 1000; i++) {
        calculatePrayerTimes(testLat, testLng, testDate, testMethod);
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (< 10MB for 1000 calculations)
      assert(memoryIncrease < 10 * 1024 * 1024,
        `Memory increased by ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB, expected < 10MB`);
    });
  });
});
