# Backend Code Structure

This document describes the backend code structure according to the implementation plan.

## Directory Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   └── database.js      # MySQL connection pool configuration
│   │
│   ├── controllers/         # Request handlers (route handlers)
│   │   ├── batchController.js
│   │   ├── calendarController.js
│   │   ├── fastingTimesController.js
│   │   ├── locationsController.js
│   │   ├── methodsController.js
│   │   ├── prayerTimesController.js
│   │   └── sunTimesController.js
│   │
│   ├── database/            # Database related files
│   │   ├── migrate.js       # Database migration runner
│   │   ├── schema.sql       # Database schema definition
│   │   └── seed.js          # Database seeding script
│   │
│   ├── middleware/          # Express middleware
│   │   ├── errorHandler.js  # Global error handling middleware
│   │   └── validation.js    # Input validation middleware
│   │
│   ├── models/              # Data models (if needed)
│   │   └── .gitkeep         # Placeholder (models can be added here)
│   │
│   ├── routes/              # API route definitions
│   │   ├── batch.js         # Batch processing routes
│   │   ├── calendar.js      # Calendar routes
│   │   ├── fastingTimes.js  # Fasting times routes
│   │   ├── locations.js     # Location search routes
│   │   ├── methods.js       # Calculation methods routes
│   │   ├── prayerTimes.js   # Prayer times routes
│   │   └── sunTimes.js      # Sun times routes
│   │
│   ├── services/            # Business logic services
│   │   ├── batchService.js
│   │   ├── calendarService.js
│   │   ├── fastingTimesService.js
│   │   ├── locationsService.js
│   │   ├── methodsService.js
│   │   ├── prayerTimesService.js
│   │   └── sunTimesService.js
│   │
│   ├── utils/               # Utility functions
│   │   └── calculations.js  # Astronomical calculation functions
│   │
│   └── server.js            # Application entry point
│
├── tests/                   # Test files
│   └── .gitkeep            # Placeholder (tests will be added here)
│
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Node.js dependencies and scripts
└── README.md               # Backend documentation
```

## File Responsibilities

### Configuration (`config/`)
- **database.js**: MySQL connection pool setup and configuration

### Controllers (`controllers/`)
- Handle HTTP requests
- Validate input (using middleware)
- Call services for business logic
- Format and send responses
- Handle errors

### Services (`services/`)
- Business logic implementation
- Database operations
- Data transformation
- Caching logic
- External API calls (if any)

### Routes (`routes/`)
- Define API endpoints
- Map routes to controllers
- Apply middleware
- Route versioning

### Middleware (`middleware/`)
- **errorHandler.js**: Global error handling, format error responses
- **validation.js**: Input validation using Joi

### Database (`database/`)
- **schema.sql**: Complete database schema
- **migrate.js**: Run migrations
- **seed.js**: Seed initial data

### Utils (`utils/`)
- **calculations.js**: Astronomical calculations for prayer/fasting times

### Models (`models/`)
- Data models (currently empty, can be added if needed for ORM)

## Code Flow

1. **Request** → `server.js` (entry point)
2. **Route** → `routes/*.js` (route definition)
3. **Middleware** → `middleware/validation.js` (input validation)
4. **Controller** → `controllers/*.js` (request handling)
5. **Service** → `services/*.js` (business logic)
6. **Database** → MySQL via `config/database.js`
7. **Response** → Formatted JSON response

## API Endpoints Structure

All endpoints are prefixed with `/v1/`:

- `/v1/prayer-times` - Prayer times
- `/v1/fasting-times` - Fasting times
- `/v1/sun-times` - Sunrise/sunset times
- `/v1/calendar/monthly` - Monthly calendar
- `/v1/calendar/yearly` - Yearly calendar
- `/v1/calendar/date-range` - Date range calendar
- `/v1/locations/search` - Location search
- `/v1/methods` - Available calculation methods
- `/v1/batch/*` - Batch operations

## Environment Variables

Required environment variables (see `.env.example`):
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `PORT` - Server port
- `NODE_ENV` - Environment (development/production)
- `API_VERSION` - API version (default: v1)

## Next Steps

According to the implementation plan:
1. ✅ Project structure created
2. ✅ Code organized into proper directories
3. ⏳ Add comprehensive tests (Phase 4)
4. ⏳ Add API documentation (Swagger/OpenAPI)
5. ⏳ Add logging middleware
6. ⏳ Add caching service implementation
7. ⏳ Add request logging
