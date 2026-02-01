import { batchPrayerTimesService } from '../services/batchService.js';

/**
 * Batch calculate prayer times for multiple coordinates
 */
export async function batchPrayerTimes(req, res, next) {
  try {
    const { coordinates, date, method } = req.body;
    
    if (!coordinates || !Array.isArray(coordinates)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'coordinates array is required',
          details: {
            parameter: 'coordinates',
            expected: 'array of {latitude, longitude} objects'
          },
          request_id: req.id
        }
      });
    }
    
    if (coordinates.length === 0) {
      return res.status(400).json({
        error: {
          code: 'EMPTY_COORDINATES',
          message: 'At least one coordinate is required',
          request_id: req.id
        }
      });
    }
    
    if (coordinates.length > 100) {
      return res.status(400).json({
        error: {
          code: 'TOO_MANY_COORDINATES',
          message: 'Maximum 100 coordinates allowed per request',
          details: {
            provided: coordinates.length,
            maximum: 100
          },
          request_id: req.id
        }
      });
    }
    
    // Validate coordinates
    for (let i = 0; i < coordinates.length; i++) {
      const coord = coordinates[i];
      
      if (!coord || typeof coord !== 'object') {
        return res.status(400).json({
          error: {
            code: 'INVALID_COORDINATE',
            message: `Invalid coordinate at index ${i}`,
            details: {
              index: i,
              coordinate: coord
            },
            request_id: req.id
          }
        });
      }
      
      if (typeof coord.latitude !== 'number' || typeof coord.longitude !== 'number') {
        return res.status(400).json({
          error: {
            code: 'INVALID_COORDINATE',
            message: `Invalid coordinate at index ${i}: latitude and longitude must be numbers`,
            details: {
              index: i,
              coordinate: coord
            },
            request_id: req.id
          }
        });
      }
      
      // Validate latitude range
      if (coord.latitude < -90 || coord.latitude > 90) {
        return res.status(400).json({
          error: {
            code: 'INVALID_COORDINATE',
            message: `Invalid coordinate at index ${i}: latitude must be between -90 and 90 degrees`,
            details: {
              index: i,
              coordinate: coord,
              error: 'Latitude must be between -90 and 90 degrees'
            },
            request_id: req.id
          }
        });
      }
      
      // Validate longitude range
      if (coord.longitude < -180 || coord.longitude > 180) {
        return res.status(400).json({
          error: {
            code: 'INVALID_COORDINATE',
            message: `Invalid coordinate at index ${i}: longitude must be between -180 and 180 degrees`,
            details: {
              index: i,
              coordinate: coord,
              error: 'Longitude must be between -180 and 180 degrees'
            },
            request_id: req.id
          }
        });
      }
      
      // Validate Bangladesh bounds
      if (coord.latitude < 20.738 || coord.latitude > 26.638 || 
          coord.longitude < 88.084 || coord.longitude > 92.673) {
        return res.status(400).json({
          error: {
            code: 'COORDINATES_OUT_OF_BOUNDS',
            message: `Coordinate at index ${i} is outside Bangladesh bounds`,
            details: {
              index: i,
              latitude: coord.latitude,
              longitude: coord.longitude,
              valid_range: {
                latitude: [20.738, 26.638],
                longitude: [88.084, 92.673]
              }
            },
            request_id: req.id
          }
        });
      }
    }
    
    // Extract optional parameters (same as prayer-times)
    const options = {};
    if (req.body.fajr_angle !== undefined) {
      options.fajrAngle = parseFloat(req.body.fajr_angle);
    }
    if (req.body.isha_angle !== undefined) {
      options.ishaAngle = parseFloat(req.body.isha_angle);
    }
    if (req.body.asr_method !== undefined) {
      options.asrMethod = req.body.asr_method.toLowerCase();
    }
    if (req.body.dhuhr_adjustment !== undefined) {
      options.dhuhrAdjustment = parseInt(req.body.dhuhr_adjustment);
    }
    if (req.body.maghrib_adjustment !== undefined) {
      options.maghribAdjustment = parseInt(req.body.maghrib_adjustment);
    }
    if (req.body.hijri_adjustment !== undefined) {
      options.hijriAdjustment = parseInt(req.body.hijri_adjustment);
    }
    if (req.body.timezone !== undefined) {
      // Parse timezone offset (e.g., "+06:00" -> 6)
      const tzMatch = req.body.timezone.match(/^([+-])(\d{2}):(\d{2})$/);
      if (tzMatch) {
        const sign = tzMatch[1] === '+' ? 1 : -1;
        const hours = parseInt(tzMatch[2]);
        const minutes = parseInt(tzMatch[3]);
        options.timezoneOffset = sign * (hours + minutes / 60);
      }
    }
    
    const result = await batchPrayerTimesService(
      coordinates, 
      date || new Date().toISOString().split('T')[0], 
      method || 'hanafi',
      options
    );
    
    // Determine timezone string for response
    const timezoneOffset = options.timezoneOffset !== undefined ? options.timezoneOffset : 6;
    const tzSign = timezoneOffset >= 0 ? '+' : '-';
    const tzHours = Math.abs(Math.floor(timezoneOffset));
    const tzMinutes = Math.abs((timezoneOffset % 1) * 60);
    const timezone = `${tzSign}${String(tzHours).padStart(2, '0')}:${String(tzMinutes).padStart(2, '0')}`;
    
    res.json({
      date: date || new Date().toISOString().split('T')[0],
      method: method || 'hanafi',
      timezone: timezone,
      total_coordinates: coordinates.length,
      results: result,
      calculated_at: new Date().toISOString(),
      request_id: req.id
    });
    
  } catch (error) {
    next(error);
  }
}
