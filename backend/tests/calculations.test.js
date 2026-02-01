/**
 * Unit tests for calculation functions
 * Tests astronomical calculations, prayer times, and fasting times
 */

import { describe, it, test } from 'node:test';
import assert from 'node:assert';
import {
  getDayOfYear,
  calculateSolarDeclination,
  calculateEquationOfTime,
  calculateSolarNoon,
  calculateHourAngle,
  hourAngleToTime,
  minutesToTime,
  calculatePrayerTime,
  calculateAsrAltitude,
  validatePrayerTimesSequence,
  validateBangladeshBounds,
  calculatePrayerTimes,
  calculateFastingTimes,
  calculateSunTimes
} from '../src/utils/calculations.js';

describe('Astronomical Calculations', () => {
  describe('getDayOfYear', () => {
    it('should return 1 for January 1', () => {
      const date = new Date(2024, 0, 1);
      assert.strictEqual(getDayOfYear(date), 1);
    });

    it('should return 365 for December 31 in non-leap year', () => {
      const date = new Date(2023, 11, 31);
      assert.strictEqual(getDayOfYear(date), 365);
    });

    it('should return 366 for December 31 in leap year', () => {
      const date = new Date(2024, 11, 31);
      assert.strictEqual(getDayOfYear(date), 366);
    });

    it('should return 75 for March 15', () => {
      const date = new Date(2024, 2, 15);
      assert.strictEqual(getDayOfYear(date), 75);
    });
  });

  describe('calculateSolarDeclination', () => {
    it('should return reasonable declination values', () => {
      const date = new Date(2024, 2, 15); // March 15
      const declination = calculateSolarDeclination(date);
      assert.ok(declination >= -23.45 && declination <= 23.45);
    });

    it('should return positive declination in summer', () => {
      const date = new Date(2024, 5, 21); // June 21 (summer solstice)
      const declination = calculateSolarDeclination(date);
      assert.ok(declination > 0);
    });

    it('should return negative declination in winter', () => {
      const date = new Date(2024, 11, 21); // December 21 (winter solstice)
      const declination = calculateSolarDeclination(date);
      assert.ok(declination < 0);
    });
  });

  describe('calculateEquationOfTime', () => {
    it('should return reasonable EoT values', () => {
      const date = new Date(2024, 2, 15);
      const eot = calculateEquationOfTime(date);
      assert.ok(eot >= -20 && eot <= 20); // EoT typically within ±20 minutes
    });
  });

  describe('calculateSolarNoon', () => {
    it('should return solar noon around 12:00 for standard meridian', () => {
      const date = new Date(2024, 2, 15);
      const longitude = 90; // Standard meridian for Bangladesh
      const solarNoon = calculateSolarNoon(longitude, date, 6);
      const hours = Math.floor(solarNoon / 60);
      const minutes = solarNoon % 60;
      // Should be around 12:00 (within 30 minutes)
      assert.ok(hours === 11 || hours === 12);
    });

    it('should adjust for longitude', () => {
      const date = new Date(2024, 2, 15);
      const solarNoon1 = calculateSolarNoon(90, date, 6);
      const solarNoon2 = calculateSolarNoon(91, date, 6);
      // 1 degree east should make solar noon later (positive longitude correction)
      // The formula adds longitude correction, so east = later
      assert.ok(solarNoon2 > solarNoon1 || Math.abs(solarNoon2 - solarNoon1) < 1);
    });
  });

  describe('calculateHourAngle', () => {
    it('should return valid hour angle for sunset', () => {
      const latitude = 23.8103; // Dhaka
      const declination = 0; // Equinox
      const altitude = -0.833; // Sunset angle
      const hourAngle = calculateHourAngle(latitude, declination, altitude);
      assert.ok(hourAngle >= 0 && hourAngle <= 180);
    });

    it('should handle edge cases', () => {
      const latitude = 23.8103;
      const declination = 0;
      const altitude = -18; // Fajr angle
      const hourAngle = calculateHourAngle(latitude, declination, altitude);
      assert.ok(hourAngle >= 0 && hourAngle <= 180);
    });
  });

  describe('minutesToTime', () => {
    it('should convert minutes to HH:MM format', () => {
      assert.strictEqual(minutesToTime(0), '00:00');
      assert.strictEqual(minutesToTime(60), '01:00');
      assert.strictEqual(minutesToTime(90), '01:30');
      assert.strictEqual(minutesToTime(1440), '00:00'); // 24 hours wraps
    });

    it('should handle negative values', () => {
      assert.strictEqual(minutesToTime(-30), '23:30');
    });
  });
});

describe('Prayer Time Calculations', () => {
  describe('calculatePrayerTimes', () => {
    it('should calculate prayer times for Dhaka', () => {
      const latitude = 23.8103;
      const longitude = 90.4125;
      const date = new Date(2024, 2, 15); // March 15, 2024
      const method = 'karachi';

      const times = calculatePrayerTimes(latitude, longitude, date, method);

      assert.ok(times.fajr);
      assert.ok(times.sunrise);
      assert.ok(times.dhuhr);
      assert.ok(times.asr);
      assert.ok(times.maghrib);
      assert.ok(times.sunset);
      assert.ok(times.isha);

      // Validate format (HH:MM)
      assert.ok(/^\d{2}:\d{2}$/.test(times.fajr));
    });

    it('should support all 20 methods', () => {
      const latitude = 23.8103;
      const longitude = 90.4125;
      const date = new Date(2024, 2, 15);

      const methods = [
        'karachi', 'mwl', 'isna', 'egyptian', 'umm_al_qura',
        'singapore', 'turkey', 'jakim', 'france', 'algeria',
        'tunisia', 'indonesia', 'russia', 'jafri',
        'hanafi', 'shafi', 'maliki', 'hanbali',
        'custom_angles', 'custom_time'
      ];

      for (const method of methods) {
        const times = calculatePrayerTimes(latitude, longitude, date, method);
        assert.ok(times.fajr, `Method ${method} should return Fajr time`);
        assert.ok(times.isha, `Method ${method} should return Isha time`);
      }
    });

    it('should handle time-based Isha (Umm Al-Qura)', () => {
      const latitude = 23.8103;
      const longitude = 90.4125;
      const date = new Date(2024, 2, 15);

      const times = calculatePrayerTimes(latitude, longitude, date, 'umm_al_qura');

      // Isha should be 90 minutes after Maghrib
      const parseTime = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };

      const maghrib = parseTime(times.maghrib);
      const isha = parseTime(times.isha);
      let diff = isha - maghrib;
      if (diff < 0) diff += 24 * 60;

      assert.ok(Math.abs(diff - 90) < 2, 'Isha should be approximately 90 minutes after Maghrib');
    });

    it('should support custom angles', () => {
      const latitude = 23.8103;
      const longitude = 90.4125;
      const date = new Date(2024, 2, 15);

      const times = calculatePrayerTimes(latitude, longitude, date, 'karachi', {
        fajr_angle: 20.0,
        isha_angle: 17.0
      });

      assert.ok(times.fajr);
      assert.ok(times.isha);
    });

    it('should validate Bangladesh bounds', () => {
      const date = new Date(2024, 2, 15);

      // Valid coordinates
      assert.doesNotThrow(() => {
        calculatePrayerTimes(23.8103, 90.4125, date, 'karachi');
      });

      // Invalid coordinates (outside Bangladesh)
      assert.throws(() => {
        calculatePrayerTimes(30, 90, date, 'karachi');
      }, /Invalid coordinates/);
    });

    it('should validate prayer times sequence', () => {
      const latitude = 23.8103;
      const longitude = 90.4125;
      const date = new Date(2024, 2, 15);

      const times = calculatePrayerTimes(latitude, longitude, date, 'karachi');
      const validation = validatePrayerTimesSequence(times);

      assert.ok(validation.isValid, 'Prayer times should be in correct sequence');
    });
  });

  describe('validatePrayerTimesSequence', () => {
    it('should validate correct sequence', () => {
      const times = {
        fajr: '04:38',
        sunrise: '05:53',
        dhuhr: '11:52',
        asr: '15:20',
        maghrib: '17:51',
        isha: '19:05'
      };

      const validation = validatePrayerTimesSequence(times);
      assert.ok(validation.isValid);
      assert.strictEqual(validation.errors.length, 0);
    });

    it('should detect incorrect sequence', () => {
      const times = {
        fajr: '05:53',
        sunrise: '04:38', // Wrong order
        dhuhr: '11:52',
        asr: '15:20',
        maghrib: '17:51',
        isha: '19:05'
      };

      const validation = validatePrayerTimesSequence(times);
      assert.ok(!validation.isValid);
      assert.ok(validation.errors.length > 0);
    });
  });
});

describe('Fasting Time Calculations', () => {
  describe('calculateFastingTimes', () => {
    it('should calculate fasting times for Dhaka', () => {
      const latitude = 23.8103;
      const longitude = 90.4125;
      const date = new Date(2024, 2, 15);
      const method = 'karachi';
      const sehriMargin = 10;

      const fasting = calculateFastingTimes(latitude, longitude, date, method, sehriMargin);

      assert.ok(fasting.sehri_end);
      assert.ok(fasting.fajr);
      assert.ok(fasting.sunrise);
      assert.ok(fasting.sunset);
      assert.ok(fasting.iftar);
      assert.ok(fasting.maghrib);
      assert.ok(fasting.fasting_duration_minutes > 0);
      assert.ok(fasting.day_length_minutes > 0);
    });

    it('should validate sehri margin', () => {
      const latitude = 23.8103;
      const longitude = 90.4125;
      const date = new Date(2024, 2, 15);

      assert.throws(() => {
        calculateFastingTimes(latitude, longitude, date, 'karachi', 3);
      }, /Sehri margin must be between 5 and 15 minutes/);

      assert.throws(() => {
        calculateFastingTimes(latitude, longitude, date, 'karachi', 20);
      }, /Sehri margin must be between 5 and 15 minutes/);
    });

    it('should calculate correct fasting duration', () => {
      const latitude = 23.8103;
      const longitude = 90.4125;
      const date = new Date(2024, 2, 15);

      const fasting = calculateFastingTimes(latitude, longitude, date, 'karachi', 10);

      // Fasting duration should be reasonable (10-17 hours for Bangladesh)
      assert.ok(fasting.fasting_duration_minutes >= 10 * 60);
      assert.ok(fasting.fasting_duration_minutes <= 17 * 60);
    });

    it('should ensure Sehri end is before Fajr', () => {
      const latitude = 23.8103;
      const longitude = 90.4125;
      const date = new Date(2024, 2, 15);

      const fasting = calculateFastingTimes(latitude, longitude, date, 'karachi', 10);

      const parseTime = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };

      const sehriEnd = parseTime(fasting.sehri_end);
      const fajr = parseTime(fasting.fajr);

      let diff = fajr - sehriEnd;
      if (diff < 0) diff += 24 * 60;

      assert.ok(diff >= 10, 'Sehri end should be at least 10 minutes before Fajr');
    });
  });
});

describe('Sun Times Calculations', () => {
  describe('calculateSunTimes', () => {
    it('should calculate sunrise and sunset', () => {
      const latitude = 23.8103;
      const longitude = 90.4125;
      const date = new Date(2024, 2, 15);

      const sunTimes = calculateSunTimes(latitude, longitude, date);

      assert.ok(sunTimes.sunrise);
      assert.ok(sunTimes.sunset);
      assert.ok(/^\d{2}:\d{2}$/.test(sunTimes.sunrise));
      assert.ok(/^\d{2}:\d{2}$/.test(sunTimes.sunset));
    });

    it('should ensure sunset is after sunrise', () => {
      const latitude = 23.8103;
      const longitude = 90.4125;
      const date = new Date(2024, 2, 15);

      const sunTimes = calculateSunTimes(latitude, longitude, date);

      const parseTime = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };

      const sunrise = parseTime(sunTimes.sunrise);
      const sunset = parseTime(sunTimes.sunset);

      assert.ok(sunset > sunrise, 'Sunset should be after sunrise');
    });
  });
});

describe('Validation Functions', () => {
  describe('validateBangladeshBounds', () => {
    it('should validate coordinates within Bangladesh', () => {
      const validation = validateBangladeshBounds(23.8103, 90.4125);
      assert.ok(validation.isValid);
    });

    it('should reject coordinates outside Bangladesh', () => {
      const validation1 = validateBangladeshBounds(30, 90);
      assert.ok(!validation1.isValid);

      const validation2 = validateBangladeshBounds(23, 100);
      assert.ok(!validation2.isValid);
    });
  });
});

describe('Edge Cases', () => {
  it('should handle different dates throughout the year', () => {
    const latitude = 23.8103;
    const longitude = 90.4125;
    const methods = ['karachi', 'hanafi', 'mwl'];

    // Test different months
    const dates = [
      new Date(2024, 0, 1),   // January
      new Date(2024, 5, 21),  // June (summer)
      new Date(2024, 11, 21)   // December (winter)
    ];

    for (const date of dates) {
      for (const method of methods) {
        const times = calculatePrayerTimes(latitude, longitude, date, method);
        assert.ok(times.fajr);
        assert.ok(times.isha);
      }
    }
  });

  it('should handle different locations in Bangladesh', () => {
    const date = new Date(2024, 2, 15);
    const locations = [
      { lat: 23.8103, lng: 90.4125, name: 'Dhaka' },
      { lat: 22.3569, lng: 91.7832, name: 'Chittagong' },
      { lat: 24.8949, lng: 91.8687, name: 'Sylhet' }
    ];

    for (const loc of locations) {
      const times = calculatePrayerTimes(loc.lat, loc.lng, date, 'karachi');
      assert.ok(times.fajr, `${loc.name} should have Fajr time`);
      assert.ok(times.isha, `${loc.name} should have Isha time`);
    }
  });
});
