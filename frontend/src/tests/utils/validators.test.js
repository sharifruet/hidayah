import { describe, it, expect } from 'vitest';
import {
  validateLatitude,
  validateLongitude,
  validateCoordinates,
  validateBangladeshBounds,
  validateDateString,
  validateDateRange
} from '../../utils/validators.js';

describe('Validators', () => {
  describe('validateLatitude', () => {
    it('should validate valid latitude', () => {
      expect(validateLatitude(23.8103).valid).toBe(true);
      expect(validateLatitude(0).valid).toBe(true);
      expect(validateLatitude(-90).valid).toBe(true);
      expect(validateLatitude(90).valid).toBe(true);
    });

    it('should reject invalid latitude', () => {
      expect(validateLatitude(91).valid).toBe(false);
      expect(validateLatitude(-91).valid).toBe(false);
      expect(validateLatitude('invalid').valid).toBe(false);
    });
  });

  describe('validateLongitude', () => {
    it('should validate valid longitude', () => {
      expect(validateLongitude(90.4125).valid).toBe(true);
      expect(validateLongitude(0).valid).toBe(true);
      expect(validateLongitude(-180).valid).toBe(true);
      expect(validateLongitude(180).valid).toBe(true);
    });

    it('should reject invalid longitude', () => {
      expect(validateLongitude(181).valid).toBe(false);
      expect(validateLongitude(-181).valid).toBe(false);
    });
  });

  describe('validateCoordinates', () => {
    it('should validate valid coordinates', () => {
      expect(validateCoordinates(23.8103, 90.4125).valid).toBe(true);
    });

    it('should reject invalid coordinates', () => {
      expect(validateCoordinates(91, 90.4125).valid).toBe(false);
      expect(validateCoordinates(23.8103, 181).valid).toBe(false);
    });
  });

  describe('validateBangladeshBounds', () => {
    it('should validate coordinates within Bangladesh', () => {
      expect(validateBangladeshBounds(23.8103, 90.4125).valid).toBe(true);
      expect(validateBangladeshBounds(24.3636, 88.6241).valid).toBe(true);
    });

    it('should reject coordinates outside Bangladesh', () => {
      expect(validateBangladeshBounds(30.0, 90.0).valid).toBe(false);
      expect(validateBangladeshBounds(20.0, 85.0).valid).toBe(false);
    });
  });

  describe('validateDateString', () => {
    it('should validate valid date string', () => {
      expect(validateDateString('2024-03-15').valid).toBe(true);
      expect(validateDateString('2024-12-31').valid).toBe(true);
    });

    it('should reject invalid date string', () => {
      expect(validateDateString('2024/03/15').valid).toBe(false);
      expect(validateDateString('invalid').valid).toBe(false);
      expect(validateDateString('').valid).toBe(false);
    });
  });

  describe('validateDateRange', () => {
    it('should validate valid date range', () => {
      expect(validateDateRange('2024-01-01', '2024-01-31').valid).toBe(true);
    });

    it('should reject invalid date range', () => {
      expect(validateDateRange('2024-01-31', '2024-01-01').valid).toBe(false);
      expect(validateDateRange('2024-01-01', '2025-12-31').valid).toBe(false);
    });
  });
});
