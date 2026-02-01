/**
 * Custom error classes
 */
export class AppError extends Error {
  constructor(message, statusCode, code, details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, details = {}) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details = {}) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

export class DatabaseError extends AppError {
  constructor(message, details = {}) {
    super(message, 500, 'DATABASE_ERROR', details);
  }
}

export class CalculationError extends AppError {
  constructor(message, details = {}) {
    super(message, 500, 'CALCULATION_ERROR', details);
  }
}

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, _next) => {
  // Log error
  console.error('Error:', {
    request_id: req.id,
    path: req.path,
    method: req.method,
    error: {
      name: err.name,
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });

  // Determine status code and error code
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'Internal Server Error';

  // Format error response
  const errorResponse = {
    error: {
      code: code,
      message: message,
      details: err.details || {},
      request_id: req.id,
      timestamp: new Date().toISOString()
    }
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    errorResponse.error.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Endpoint ${req.method} ${req.path} not found`,
      details: {
        path: req.path,
        method: req.method
      },
      request_id: req.id,
      timestamp: new Date().toISOString()
    }
  });
};
