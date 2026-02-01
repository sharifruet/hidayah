import { describe, it, expect } from 'vitest';
import {
  formatTime,
  formatDate,
  formatDuration,
  formatDurationDetailed,
  getCurrentPrayer,
  formatCountdown
} from '../../utils/formatters.js';
import { parseISO } from 'date-fns';

describe('Formatters', () => {
  describe('formatTime', () => {
    it('should format time string correctly', () => {
      expect(formatTime('04:45')).toBe('04:45');
      expect(formatTime('12:30')).toBe('12:30');
    });

    it('should handle null/undefined', () => {
      expect(formatTime(null)).toBe('--:--');
      expect(formatTime(undefined)).toBe('--:--');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = parseISO('2024-03-15');
      expect(formatDate(date)).toContain('Mar');
      expect(formatDate(date)).toContain('2024');
    });

    it('should handle custom format', () => {
      const date = parseISO('2024-03-15');
      expect(formatDate(date, 'yyyy-MM-dd')).toBe('2024-03-15');
    });
  });

  describe('formatDuration', () => {
    it('should format duration in minutes', () => {
      expect(formatDuration(90)).toBe('1h 30m');
      expect(formatDuration(60)).toBe('1h 0m');
      expect(formatDuration(30)).toBe('0h 30m');
    });

    it('should handle null/undefined', () => {
      expect(formatDuration(null)).toBe('--');
      expect(formatDuration(undefined)).toBe('--');
    });
  });

  describe('formatDurationDetailed', () => {
    it('should format duration with detailed text', () => {
      expect(formatDurationDetailed(90)).toContain('hour');
      expect(formatDurationDetailed(90)).toContain('minute');
    });

    it('should handle zero hours', () => {
      const result = formatDurationDetailed(30);
      expect(result).toContain('minute');
      expect(result).not.toContain('hour');
    });
  });

  describe('getCurrentPrayer', () => {
    it('should return current prayer', () => {
      const times = {
        fajr: '04:45',
        sunrise: '06:00',
        dhuhr: '12:15',
        asr: '15:30',
        maghrib: '18:30',
        isha: '19:45'
      };

      // Test at 10:00 (between sunrise and dhuhr)
      const currentTime = new Date('2024-03-15T10:00:00');
      const result = getCurrentPrayer(times, currentTime);

      expect(result).not.toBeNull();
      expect(result.next).toBe('dhuhr');
    });
  });

  describe('formatCountdown', () => {
    it('should format countdown correctly', () => {
      expect(formatCountdown(90)).toBe('01:30');
      expect(formatCountdown(30)).toBe('00:30');
      expect(formatCountdown(0)).toBe('00:00');
    });

    it('should handle null/undefined', () => {
      expect(formatCountdown(null)).toBe('--:--');
      expect(formatCountdown(undefined)).toBe('--:--');
    });
  });
});
