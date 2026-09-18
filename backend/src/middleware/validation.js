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

// ─── Masjids ─────────────────────────────────────────────────────────────────

const JAMAH_PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'jumuah'];
const TIME_HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;

// { fajr: 'HH:MM', ... } — null/'' clears a prayer's jamah time
const jamahSchema = Joi.object(
  Object.fromEntries(
    JAMAH_PRAYERS.map(p => [p, Joi.string().pattern(TIME_HH_MM).allow(null, '')])
  )
).messages({ 'string.pattern.base': '{{#label}} must be a time in HH:MM (24h) format' });

const masjidBodySchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required(),
  name_bn: Joi.string().trim().max(200).allow(null, ''),
  address: Joi.string().trim().max(400).allow(null, ''),
  city: Joi.string().trim().max(100).allow(null, ''),
  district: Joi.string().trim().max(100).allow(null, ''),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  phone: Joi.string().trim().max(40).allow(null, ''),
  description: Joi.string().trim().max(2000).allow(null, ''),
  status: Joi.string().valid('active', 'hidden'),
  jamah: jamahSchema,
});

function sendValidationError(req, res, error, code) {
  const detail = error.details[0];
  return res.status(400).json({
    error: {
      code,
      message: detail.message.replace(/"/g, ''),
      details: { parameter: detail.path.join('.'), value: detail.context?.value },
      request_id: req.id
    }
  });
}

/**
 * Validate masjid create/update body (public POST and admin PUT).
 */
export const validateMasjidBody = (req, res, next) => {
  const { error, value } = masjidBodySchema.validate(req.body || {}, { abortEarly: true, stripUnknown: true });
  if (error) return sendValidationError(req, res, error, 'INVALID_MASJID');
  req.body = value;
  next();
};

/**
 * Validate jamah times body: at least one prayer key, each HH:MM or null.
 */
export const validateJamahBody = (req, res, next) => {
  const { error, value } = jamahSchema.min(1).validate(req.body || {}, { abortEarly: true, stripUnknown: true });
  if (error) return sendValidationError(req, res, error, 'INVALID_JAMAH_TIMES');
  req.body = value;
  next();
};

/**
 * Validate lat/lng query params (required) plus optional radius/limit
 * for the nearby-masjids lookup.
 */
export const validateNearbyQuery = (req, res, next) => {
  const schema = Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
    radius_km: Joi.number().min(0.1).max(50).optional(),
    limit: Joi.number().integer().min(1).max(50).optional(),
  });

  const { error } = schema.validate({
    lat: parseFloat(req.query.lat),
    lng: parseFloat(req.query.lng),
    ...(req.query.radius_km !== undefined && { radius_km: parseFloat(req.query.radius_km) }),
    ...(req.query.limit !== undefined && { limit: parseInt(req.query.limit) }),
  });
  if (error) return sendValidationError(req, res, error, 'INVALID_NEARBY_QUERY');
  next();
};

/**
 * Validate optional lat/lng query params (for distance annotation on search/detail).
 */
export const validateOptionalCoords = (req, res, next) => {
  const hasLat = req.query.lat !== undefined;
  const hasLng = req.query.lng !== undefined;
  if (!hasLat && !hasLng) return next();

  const schema = Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
  });
  const { error } = schema.validate({ lat: parseFloat(req.query.lat), lng: parseFloat(req.query.lng) });
  if (error) return sendValidationError(req, res, error, 'INVALID_COORDINATE');
  next();
};
