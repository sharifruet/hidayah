import pool from '../config/database.js';

/**
 * Request logging middleware
 * Logs all API requests to database and console
 */
export const requestLogger = async (req, res, next) => {
  const startTime = Date.now();

  // Capture response
  const originalSend = res.json;
  res.json = function (data) {
    const responseTime = Date.now() - startTime;

    // Log to database (async, don't wait)
    logRequestToDatabase(req, res.statusCode, responseTime, data).catch(err => {
      console.error('Failed to log request to database:', err.message);
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${req.method} ${req.path} - ${res.statusCode} - ${responseTime}ms`);
    }

    // Call original send
    return originalSend.call(this, data);
  };

  next();
};

/**
 * Log request to database
 */
async function logRequestToDatabase(req, res, statusCode, responseTime, responseData) {
  try {
    // Extract relevant data from request
    const latitude = req.query.latitude ? parseFloat(req.query.latitude) : null;
    const longitude = req.query.longitude ? parseFloat(req.query.longitude) : null;
    const requestDate = req.query.date || null;
    const calculationMethod = req.query.method || null;
    const cacheHit = responseData?.cache_hit || false;

    // Get IP address
    const ipAddress = req.ip || req.connection.remoteAddress || null;

    await pool.query(
      `INSERT INTO api_requests
       (request_id, endpoint, method, ip_address, latitude, longitude, request_date, calculation_method, status_code, response_time_ms, cache_hit, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.id,
        req.path,
        req.method,
        ipAddress,
        latitude,
        longitude,
        requestDate,
        calculationMethod,
        statusCode,
        responseTime,
        cacheHit,
        req.get('user-agent') || null
      ]
    );
  } catch (error) {
    // Don't throw - logging errors shouldn't break the request
    console.error('Request logging error:', error.message);
  }
}

/**
 * Performance logging middleware
 * Logs slow requests
 */
export const performanceLogger = (threshold = 1000) => {
  return (req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      if (duration > threshold) {
        console.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
      }
    });

    next();
  };
};
