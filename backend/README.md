# Salat and Saom Timing API - Backend

Coordinate-based Salat (Prayer) and Saom (Fasting) Timing API for Bangladesh.

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (database, etc.)
│   ├── controllers/     # Request handlers
│   ├── database/        # Database migrations and seeds
│   ├── middleware/      # Express middleware
│   ├── models/          # Data models (if needed)
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   └── server.js        # Application entry point
├── tests/               # Test files
├── package.json
└── .env.example         # Environment variables template
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials

4. Run database migrations:
```bash
npm run migrate
```

5. Seed initial data:
```bash
npm run seed
```

6. Start development server:
```bash
npm run dev
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with watch mode
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with initial data
- `npm test` - Run tests

## API Endpoints

- `GET /v1/prayer-times` - Get prayer times for coordinates
- `GET /v1/fasting-times` - Get fasting times for coordinates
- `GET /v1/sun-times` - Get sunrise/sunset times
- `GET /v1/calendar/monthly` - Get monthly calendar
- `GET /v1/calendar/yearly` - Get yearly calendar
- `GET /v1/calendar/date-range` - Get date range calendar
- `GET /v1/locations/search` - Search locations
- `GET /v1/methods` - Get available calculation methods

## Environment Variables

See `.env.example` for required environment variables.
