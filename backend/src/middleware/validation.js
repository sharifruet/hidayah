import Joi from 'joi';
import { isValidMethod as checkValidMethod } from '../config/methods.js';

/**
 * Validate coordinate parameters
 */
export const validateCoordinates = (req, res, next) => {
  const schema = Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required()
  });

  const { error } = schema.validate({
    latitude: parseFloat(req.query.latitude),
    longitude: parseFloat(req.query.longitude)
  });

  if (error) {
    return res.status(400).json({
      error: {
        code: 'INVALID_COORDINATE',
        message: error.details[0].message,
        details: {
          parameter: error.details[0].path[0],
          value: req.query[error.details[0].path[0]]
        },
        request_id: req.id
      }
    });
  }

  // Validate Bangladesh bounds
  const lat = parseFloat(req.query.latitude);
  const lng = parseFloat(req.query.longitude);

  if (lat < 20.738 || lat > 26.638 || lng < 88.084 || lng > 92.673) {
    return res.status(400).json({
      error: {
        code: 'COORDINATES_OUT_OF_BOUNDS',
        message: 'Coordinates outside Bangladesh bounds',
        details: {
          latitude: lat,
          longitude: lng,
          valid_range: {
            latitude: [20.738, 26.638],
            longitude: [88.084, 92.673]
          }
        },
        request_id: req.id
      }
    });
  }

  next();
};

/**
 * Validate date parameter
 */
export const validateDate = (req, res, next) => {
  const schema = Joi.object({
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).optional()
  });

  const { error } = schema.validate({ date: req.query.date });

  if (error && req.query.date) {
    return res.status(400).json({
      error: {
        code: 'INVALID_DATE',
        message: 'Invalid date format. Use YYYY-MM-DD',
        details: {
          parameter: 'date',
          value: req.query.date,
          expected_format: 'YYYY-MM-DD'
        },
        request_id: req.id
      }
    });
  }

  // Validate date is not too far in future
  if (req.query.date) {
    const date = new Date(req.query.date);
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 10);

    if (isNaN(date.getTime())) {
      return res.status(400).json({
        error: {
          code: 'INVALID_DATE',
          message: 'Invalid date value',
          details: {
            parameter: 'date',
            value: req.query.date
          },
          request_id: req.id
        }
      });
    }

    if (date > maxDate) {
      return res.status(400).json({
        error: {
          code: 'DATE_OUT_OF_RANGE',
          message: 'Date is outside valid range',
          details: {
            parameter: 'date',
            value: req.query.date,
            valid_range: {
              max: maxDate.toISOString().split('T')[0]
            }
          },
          request_id: req.id
        }
      });
    }
  }

  next();
};

/**
 * Validate method parameter - supports all 20 methods
 */
export const validateMethod = (req, res, next) => {
  const method = req.query.method || 'karachi';

  if (!checkValidMethod(method)) {
    return res.status(400).json({
      error: {
        code: 'INVALID_METHOD',
        message: `Invalid calculation method: ${method}`,
        details: {
          parameter: 'method',
          value: method,
          message: 'Use a valid method code. See /v1/methods for available methods.'
        },
        request_id: req.id
      }
    });
  }

  next();
};

/**
 * Validate sehri margin
 */
export const validateSehriMargin = (req, res, next) => {
  const margin = req.query.sehri_margin !== undefined ? parseInt(req.query.sehri_margin) : 10;

  if (req.query.sehri_margin !== undefined && (isNaN(margin) || margin < 5 || margin > 15)) {
    return res.status(400).json({
      error: {
        code: 'INVALID_SEHRI_MARGIN',
        message: 'Sehri margin must be between 5 and 15 minutes',
        details: {
          parameter: 'sehri_margin',
          value: req.query.sehri_margin,
          valid_range: [5, 15]
        },
        request_id: req.id
      }
    });
  }

  next();
};

/**
 * Validate prayer times advanced parameters
 */
export const validatePrayerTimesParams = (req, res, next) => {
  // Validate fajr_angle
  if (req.query.fajr_angle !== undefined) {
    const fajrAngle = parseFloat(req.query.fajr_angle);
    if (isNaN(fajrAngle) || fajrAngle < 10.0 || fajrAngle > 24.5) {
      return res.status(400).json({
        error: {
          code: 'INVALID_FAJR_ANGLE',
          message: 'Fajr angle must be between 10.0 and 24.5 degrees',
          details: {
            parameter: 'fajr_angle',
            value: req.query.fajr_angle,
            valid_range: [10.0, 24.5]
          },
          request_id: req.id
        }
      });
    }
  }

  // Validate isha_angle
  if (req.query.isha_angle !== undefined) {
    const ishaAngle = parseFloat(req.query.isha_angle);
    if (isNaN(ishaAngle) || ishaAngle < 10.0 || ishaAngle > 24.5) {
      return res.status(400).json({
        error: {
          code: 'INVALID_ISHA_ANGLE',
          message: 'Isha angle must be between 10.0 and 24.5 degrees',
          details: {
            parameter: 'isha_angle',
            value: req.query.isha_angle,
            valid_range: [10.0, 24.5]
          },
          request_id: req.id
        }
      });
    }
  }

  // Validate isha_time_adjustment
  if (req.query.isha_time_adjustment !== undefined) {
    const ishaTimeAdj = parseInt(req.query.isha_time_adjustment);
    if (isNaN(ishaTimeAdj) || ishaTimeAdj < 0 || ishaTimeAdj > 180) {
      return res.status(400).json({
        error: {
          code: 'INVALID_ISHA_TIME_ADJUSTMENT',
          message: 'Isha time adjustment must be between 0 and 180 minutes',
          details: {
            parameter: 'isha_time_adjustment',
            value: req.query.isha_time_adjustment,
            valid_range: [0, 180]
          },
          request_id: req.id
        }
      });
    }
  }

  // Validate asr_method
  if (req.query.asr_method !== undefined) {
    const asrMethod = req.query.asr_method.toLowerCase();
    if (!['standard', 'hanafi'].includes(asrMethod)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_ASR_METHOD',
          message: 'Asr method must be "standard" or "hanafi"',
          details: {
            parameter: 'asr_method',
            value: req.query.asr_method,
            valid_values: ['standard', 'hanafi']
          },
          request_id: req.id
        }
      });
    }
  }

  // Validate dhuhr_adjustment
  if (req.query.dhuhr_adjustment !== undefined) {
    const dhuhrAdj = parseInt(req.query.dhuhr_adjustment);
    if (isNaN(dhuhrAdj) || dhuhrAdj < 1 || dhuhrAdj > 60) {
      return res.status(400).json({
        error: {
          code: 'INVALID_DHUHR_ADJUSTMENT',
          message: 'Dhuhr adjustment must be between 1 and 60 minutes',
          details: {
            parameter: 'dhuhr_adjustment',
            value: req.query.dhuhr_adjustment,
            valid_range: [1, 60]
          },
          request_id: req.id
        }
      });
    }
  }

  // Validate maghrib_adjustment
  if (req.query.maghrib_adjustment !== undefined) {
    const maghribAdj = parseInt(req.query.maghrib_adjustment);
    if (isNaN(maghribAdj) || maghribAdj < 1 || maghribAdj > 15) {
      return res.status(400).json({
        error: {
          code: 'INVALID_MAGHRIB_ADJUSTMENT',
          message: 'Maghrib adjustment must be between 1 and 15 minutes',
          details: {
            parameter: 'maghrib_adjustment',
            value: req.query.maghrib_adjustment,
            valid_range: [1, 15]
          },
          request_id: req.id
        }
      });
    }
  }

  // Validate hijri_adjustment
  if (req.query.hijri_adjustment !== undefined) {
    const hijriAdj = parseInt(req.query.hijri_adjustment);
    if (isNaN(hijriAdj) || hijriAdj < -2 || hijriAdj > 2) {
      return res.status(400).json({
        error: {
          code: 'INVALID_HIJRI_ADJUSTMENT',
          message: 'Hijri adjustment must be between -2 and +2 days',
          details: {
            parameter: 'hijri_adjustment',
            value: req.query.hijri_adjustment,
            valid_range: [-2, 2]
          },
          request_id: req.id
        }
      });
    }
  }

  // Validate timezone
  if (req.query.timezone !== undefined) {
    const timezonePattern = /^[+-]\d{2}:\d{2}$/;
    if (!timezonePattern.test(req.query.timezone)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_TIMEZONE',
          message: 'Timezone must be in ISO 8601 format (±HH:MM)',
          details: {
            parameter: 'timezone',
            value: req.query.timezone,
            expected_format: '±HH:MM (e.g., +06:00)'
          },
          request_id: req.id
        }
      });
    }
  }

  next();
};

/**
 * Validate date range parameters
 */
export const validateDateRange = (req, res, next) => {
  const startDate = req.query.start_date;
  const endDate = req.query.end_date;

  if (!startDate || !endDate) {
    return res.status(400).json({
      error: {
        code: 'MISSING_DATE_RANGE',
        message: 'Both start_date and end_date are required',
        details: {
          parameters: ['start_date', 'end_date']
        },
        request_id: req.id
      }
    });
  }

  // Validate date format
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(startDate) || !datePattern.test(endDate)) {
    return res.status(400).json({
      error: {
        code: 'INVALID_DATE_FORMAT',
        message: 'Dates must be in YYYY-MM-DD format',
        details: {
          start_date: startDate,
          end_date: endDate
        },
        request_id: req.id
      }
    });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      error: {
        code: 'INVALID_DATE',
        message: 'Invalid date values',
        details: {
          start_date: startDate,
          end_date: endDate
        },
        request_id: req.id
      }
    });
  }

  if (start > end) {
    return res.status(400).json({
      error: {
        code: 'INVALID_DATE_RANGE',
        message: 'start_date must be before or equal to end_date',
        details: {
          start_date: startDate,
          end_date: endDate
        },
        request_id: req.id
      }
    });
  }

  // Limit range to 1 year
  const maxRange = 365;
  const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  if (daysDiff > maxRange) {
    return res.status(400).json({
      error: {
        code: 'DATE_RANGE_TOO_LARGE',
        message: `Date range cannot exceed ${maxRange} days`,
        details: {
          start_date: startDate,
          end_date: endDate,
          days: daysDiff,
          max_days: maxRange
        },
        request_id: req.id
      }
    });
  }

  next();
};

/**
 * Validate year parameter
 */
export const validateYear = (req, res, next) => {
  const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

  if (isNaN(year) || year < 1900 || year > 2100) {
    return res.status(400).json({
      error: {
        code: 'INVALID_YEAR',
        message: 'Year must be between 1900 and 2100',
        details: {
          parameter: 'year',
          value: req.query.year,
          valid_range: [1900, 2100]
        },
        request_id: req.id
      }
    });
  }

  next();
};

/**
 * Validate month parameter
 */
export const validateMonth = (req, res, next) => {
  const month = req.query.month ? parseInt(req.query.month) : new Date().getMonth() + 1;

  if (isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({
      error: {
        code: 'INVALID_MONTH',
        message: 'Month must be between 1 and 12',
        details: {
          parameter: 'month',
          value: req.query.month,
          valid_range: [1, 12]
        },
        request_id: req.id
      }
    });
  }

  next();
};
