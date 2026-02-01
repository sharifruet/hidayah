# Testing Guide

This document provides comprehensive information about testing the Salat & Saom Timing API and Frontend.

## Test Structure

### Backend Tests

Located in `backend/tests/`:

- **Unit Tests:**
  - `calculations.test.js` - Astronomical and prayer time calculations
  - `middleware.validation.test.js` - Input validation
  - `middleware.errorHandler.test.js` - Error handling
  - `services.prayerTimes.test.js` - Prayer times service
  - `services.cache.test.js` - Caching service

- **Integration Tests:**
  - `integration.api.test.js` - API endpoint integration tests

- **Performance Tests:**
  - `performance.test.js` - Calculation performance
  - `load.test.js` - Load and stress testing

- **Security Tests:**
  - `security.test.js` - Security vulnerability testing

### Frontend Tests

Located in `frontend/src/tests/` and `frontend/e2e/`:

- **Unit Tests:**
  - Component tests
  - Hook tests
  - Utility tests
  - Integration tests

- **E2E Tests:**
  - `e2e/home.spec.js` - Home page tests
  - `e2e/prayer-times.spec.js` - Prayer times page
  - `e2e/calendar.spec.js` - Calendar page
  - `e2e/export.spec.js` - Export functionality
  - `e2e/responsive.spec.js` - Responsive design
  - `e2e/accessibility.spec.js` - Accessibility tests
  - `e2e/performance.spec.js` - Performance tests

## Running Tests

### Backend Tests

```bash
# Run all tests
cd backend
npm test

# Run specific test file
npm test calculations.test.js

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Frontend Tests

```bash
# Run unit tests
cd frontend
npm test

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui

# Run specific test file
npm test formatters.test.js
```

### Docker Tests

```bash
# Backend tests in Docker
docker-compose exec backend npm test

# Frontend tests in Docker
docker-compose exec frontend npm test
```

## Test Categories

### 1. Unit Tests

Test individual functions and components in isolation.

**Backend Examples:**
- Calculation functions
- Validation logic
- Service methods

**Frontend Examples:**
- Component rendering
- Hook behavior
- Utility functions

### 2. Integration Tests

Test how different parts work together.

**Backend:**
- API endpoints with database
- Service layer integration
- Middleware chain

**Frontend:**
- API service integration
- Context providers
- Component interactions

### 3. E2E Tests

Test complete user flows from start to finish.

**Examples:**
- User selects location on map
- User views prayer times
- User exports calendar
- User changes language

### 4. Performance Tests

Test application performance under load.

**Backend:**
- Response times
- Concurrent request handling
- Database query performance
- Cache effectiveness

**Frontend:**
- Page load times
- API call performance
- Bundle sizes
- Rendering performance

### 5. Security Tests

Test for security vulnerabilities.

**Backend:**
- Input validation
- SQL injection prevention
- XSS prevention
- Rate limiting
- CORS configuration

**Frontend:**
- XSS prevention
- CSRF protection
- Secure headers

### 6. Accessibility Tests

Test for accessibility compliance.

**Tests:**
- Screen reader compatibility
- Keyboard navigation
- Color contrast
- ARIA attributes
- Semantic HTML

## Test Data

### Test Coordinates

Default test location (Dhaka):
- Latitude: 23.8103
- Longitude: 90.4125

### Test Dates

- Current date: `new Date()`
- Specific date: `2024-03-15`
- Ramadan dates: Varies by year

### Test Methods

- Default: `karachi`
- Alternative: `hanafi`, `mwl`, `isna`

## Continuous Integration

### GitHub Actions

Tests run automatically on:
- Push to main/develop branches
- Pull requests
- Scheduled runs (optional)

### Test Reports

- Unit test results in CI logs
- E2E test reports in `playwright-report/`
- Coverage reports in `coverage/`

## Best Practices

### Writing Tests

1. **Test one thing at a time**
   - Each test should verify one behavior
   - Keep tests focused and simple

2. **Use descriptive names**
   - Test names should describe what is being tested
   - Example: `should calculate Fajr time correctly for Dhaka`

3. **Arrange-Act-Assert pattern**
   - Arrange: Set up test data
   - Act: Execute the code being tested
   - Assert: Verify the results

4. **Test edge cases**
   - Boundary values
   - Error conditions
   - Empty/null inputs

5. **Keep tests independent**
   - Tests should not depend on each other
   - Each test should be able to run in isolation

### Test Maintenance

1. **Update tests with code changes**
   - When functionality changes, update tests
   - Remove obsolete tests

2. **Keep tests fast**
   - Unit tests should be very fast
   - E2E tests can be slower but should be optimized

3. **Use mocks appropriately**
   - Mock external dependencies
   - Don't mock what you're testing

4. **Test coverage**
   - Aim for high coverage but focus on quality
   - Cover critical paths first

## Troubleshooting

### Tests Failing

1. **Check test output**
   - Read error messages carefully
   - Check stack traces

2. **Verify test data**
   - Ensure test data is correct
   - Check for data dependencies

3. **Check environment**
   - Verify environment variables
   - Check database connection

4. **Run tests individually**
   - Isolate failing tests
   - Check for test interdependencies

### Performance Issues

1. **Check database**
   - Verify indexes are in place
   - Check query performance

2. **Check caching**
   - Verify cache is working
   - Check cache hit rates

3. **Check network**
   - Verify API endpoints are accessible
   - Check for network latency

## Test Coverage Goals

- **Unit Tests:** 80%+ coverage
- **Integration Tests:** Critical paths covered
- **E2E Tests:** Main user flows covered
- **Security Tests:** All security features tested
- **Accessibility Tests:** WCAG 2.1 AA compliance

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
