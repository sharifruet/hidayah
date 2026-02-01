import { describe, it } from 'node:test';
import assert from 'node:assert';
import { errorHandler, notFoundHandler, AppError, ValidationError, NotFoundError, CalculationError } from '../src/middleware/errorHandler.js';

describe('Error Handler Middleware', () => {
  describe('errorHandler', () => {
    it('should handle AppError correctly', () => {
      const err = new ValidationError('Test validation error', { field: 'test' });
      const req = {
        id: 'test-123',
        path: '/test',
        method: 'GET'
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

      errorHandler(err, req, res, next);

      assert.notStrictEqual(responseData, null);
      assert.strictEqual(responseData.code, 400);
      assert.strictEqual(responseData.data.error.code, 'VALIDATION_ERROR');
      assert.strictEqual(responseData.data.error.message, 'Test validation error');
    });

    it('should handle generic errors with 500 status', () => {
      const err = new Error('Generic error');
      const req = {
        id: 'test-123',
        path: '/test',
        method: 'GET'
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

      errorHandler(err, req, res, next);

      assert.notStrictEqual(responseData, null);
      assert.strictEqual(responseData.code, 500);
      assert.strictEqual(responseData.data.error.code, 'INTERNAL_SERVER_ERROR');
    });

    it('should include request_id in error response', () => {
      const err = new ValidationError('Test error');
      const req = {
        id: 'test-request-id',
        path: '/test',
        method: 'GET'
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

      errorHandler(err, req, res, next);

      assert.strictEqual(responseData.data.error.request_id, 'test-request-id');
    });
  });

  describe('notFoundHandler', () => {
    it('should return 404 with correct error format', () => {
      const req = {
        id: 'test-123',
        method: 'GET',
        path: '/nonexistent'
      };
      let responseData = null;
      const res = {
        status: (code) => ({
          json: (data) => {
            responseData = { code, data };
          }
        })
      };

      notFoundHandler(req, res);

      assert.notStrictEqual(responseData, null);
      assert.strictEqual(responseData.code, 404);
      assert.strictEqual(responseData.data.error.code, 'NOT_FOUND');
    });
  });

  describe('Custom Error Classes', () => {
    it('should create ValidationError with correct properties', () => {
      const error = new ValidationError('Validation failed', { field: 'test' });

      assert.strictEqual(error.message, 'Validation failed');
      assert.strictEqual(error.statusCode, 400);
      assert.strictEqual(error.code, 'VALIDATION_ERROR');
      assert.deepStrictEqual(error.details, { field: 'test' });
    });

    it('should create NotFoundError with correct properties', () => {
      const error = new NotFoundError('Resource not found');

      assert.strictEqual(error.message, 'Resource not found');
      assert.strictEqual(error.statusCode, 404);
      assert.strictEqual(error.code, 'NOT_FOUND');
    });

    it('should create CalculationError with correct properties', () => {
      const error = new CalculationError('Calculation failed', { lat: 23.8, lng: 90.4 });

      assert.strictEqual(error.message, 'Calculation failed');
      assert.strictEqual(error.statusCode, 500);
      assert.strictEqual(error.code, 'CALCULATION_ERROR');
    });
  });
});
