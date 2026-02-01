import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateCoordinates, validateDate, validateMethod, validatePrayerTimesParams, validateDateRange, validateSehriMargin } from '../src/middleware/validation.js';

describe('Validation Middleware', () => {
  describe('validateCoordinates', () => {
    it('should pass valid coordinates within Bangladesh bounds', () => {
      const req = {
        query: { latitude: '23.8103', longitude: '90.4125' },
        id: 'test-123'
      };
      const res = {
        status: (code) => ({
          json: (data) => {
            throw new Error(`Validation failed: ${JSON.stringify(data)}`);
          }
        })
      };
      let nextCalled = false;
      const next = () => { nextCalled = true; };

      validateCoordinates(req, res, next);
      assert.strictEqual(nextCalled, true);
    });

    it('should reject coordinates outside Bangladesh bounds', () => {
      const req = {
        query: { latitude: '30.0', longitude: '90.0' },
        id: 'test-123'
      };
      let responseData = null;
      const res = {
        status: (code) => ({
          json: (data) => {
            responseData = { code, data };
          }
        })
      };
      const next = () => {};

      validateCoordinates(req, res, next);
      assert.notStrictEqual(responseData, null);
      assert.strictEqual(responseData.code, 400);
      assert.strictEqual(responseData.data.error.code, 'COORDINATES_OUT_OF_BOUNDS');
    });

    it('should reject invalid latitude', () => {
      const req = {
        query: { latitude: 'invalid', longitude: '90.0' },
        id: 'test-123'
      };
      let responseData = null;
      const res = {
        status: (code) => ({
          json: (data) => {
            responseData = { code, data };
          }
        })
      };
      const next = () => {};

      validateCoordinates(req, res, next);
      assert.notStrictEqual(responseData, null);
      assert.strictEqual(responseData.code, 400);
    });
  });

  describe('validateDate', () => {
    it('should pass valid date format', () => {
      const req = {
        query: { date: '2024-03-15' },
        id: 'test-123'
      };
      let nextCalled = false;
      const next = () => { nextCalled = true; };
      const res = {
        status: () => ({ json: () => {} })
      };

      validateDate(req, res, next);
      assert.strictEqual(nextCalled, true);
    });

    it('should reject invalid date format', () => {
      const req = {
        query: { date: '2024/03/15' },
        id: 'test-123'
      };
      let responseData = null;
      const res = {
        status: (code) => ({
          json: (data) => {
            responseData = { code, data };
          }
        })
      };
      const next = () => {};

      validateDate(req, res, next);
      assert.notStrictEqual(responseData, null);
      assert.strictEqual(responseData.code, 400);
    });

    it('should allow missing date (defaults to today)', () => {
      const req = {
        query: {},
        id: 'test-123'
      };
      let nextCalled = false;
      const next = () => { nextCalled = true; };
      const res = {
        status: () => ({ json: () => {} })
      };

      validateDate(req, res, next);
      assert.strictEqual(nextCalled, true);
    });
  });

  describe('validateMethod', () => {
    it('should pass valid method', () => {
      const req = {
        query: { method: 'karachi' },
        id: 'test-123'
      };
      let nextCalled = false;
      const next = () => { nextCalled = true; };
      const res = {
        status: () => ({ json: () => {} })
      };

      validateMethod(req, res, next);
      assert.strictEqual(nextCalled, true);
    });

    it('should reject invalid method', () => {
      const req = {
        query: { method: 'invalid_method' },
        id: 'test-123'
      };
      let responseData = null;
      const res = {
        status: (code) => ({
          json: (data) => {
            responseData = { code, data };
          }
        })
      };
      const next = () => {};

      validateMethod(req, res, next);
      assert.notStrictEqual(responseData, null);
      assert.strictEqual(responseData.code, 400);
    });
  });

  describe('validatePrayerTimesParams', () => {
    it('should pass valid fajr_angle', () => {
      const req = {
        query: { fajr_angle: '18.0' },
        id: 'test-123'
      };
      let nextCalled = false;
      const next = () => { nextCalled = true; };
      const res = {
        status: () => ({ json: () => {} })
      };

      validatePrayerTimesParams(req, res, next);
      assert.strictEqual(nextCalled, true);
    });

    it('should reject invalid fajr_angle (too low)', () => {
      const req = {
        query: { fajr_angle: '5.0' },
        id: 'test-123'
      };
      let responseData = null;
      const res = {
        status: (code) => ({
          json: (data) => {
            responseData = { code, data };
          }
        })
      };
      const next = () => {};

      validatePrayerTimesParams(req, res, next);
      assert.notStrictEqual(responseData, null);
      assert.strictEqual(responseData.code, 400);
    });

    it('should reject invalid asr_method', () => {
      const req = {
        query: { asr_method: 'invalid' },
        id: 'test-123'
      };
      let responseData = null;
      const res = {
        status: (code) => ({
          json: (data) => {
            responseData = { code, data };
          }
        })
      };
      const next = () => {};

      validatePrayerTimesParams(req, res, next);
      assert.notStrictEqual(responseData, null);
      assert.strictEqual(responseData.code, 400);
    });
  });

  describe('validateDateRange', () => {
    it('should pass valid date range', () => {
      const req = {
        query: { start_date: '2024-01-01', end_date: '2024-01-31' },
        id: 'test-123'
      };
      let nextCalled = false;
      const next = () => { nextCalled = true; };
      const res = {
        status: () => ({ json: () => {} })
      };

      validateDateRange(req, res, next);
      assert.strictEqual(nextCalled, true);
    });

    it('should reject date range exceeding 365 days', () => {
      const req = {
        query: { start_date: '2024-01-01', end_date: '2025-12-31' },
        id: 'test-123'
      };
      let responseData = null;
      const res = {
        status: (code) => ({
          json: (data) => {
            responseData = { code, data };
          }
        })
      };
      const next = () => {};

      validateDateRange(req, res, next);
      assert.notStrictEqual(responseData, null);
      assert.strictEqual(responseData.code, 400);
    });
  });

  describe('validateSehriMargin', () => {
    it('should pass valid sehri_margin', () => {
      const req = {
        query: { sehri_margin: '10' },
        id: 'test-123'
      };
      let nextCalled = false;
      const next = () => { nextCalled = true; };
      const res = {
        status: () => ({ json: () => {} })
      };

      validateSehriMargin(req, res, next);
      assert.strictEqual(nextCalled, true);
    });

    it('should reject sehri_margin outside valid range', () => {
      const req = {
        query: { sehri_margin: '20' },
        id: 'test-123'
      };
      let responseData = null;
      const res = {
        status: (code) => ({
          json: (data) => {
            responseData = { code, data };
          }
        })
      };
      const next = () => {};

      validateSehriMargin(req, res, next);
      assert.notStrictEqual(responseData, null);
      assert.strictEqual(responseData.code, 400);
    });
  });
});
