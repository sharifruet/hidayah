# Salat and Saom Timing API

Coordinate-based Salat (Prayer) and Saom (Fasting) Timing API for Bangladesh with React frontend.

## Project Overview

This project provides accurate prayer and fasting times for any location in Bangladesh using coordinate-based calculations instead of district-wise approximations. It supports multiple Islamic calculation methods and provides a modern web interface.

## Project Structure

```
ramadan/
├── backend/          # Node.js/Express API server
├── frontend/         # React frontend application
├── database/         # Database migrations and seeds
├── docs/             # Documentation
└── docker-compose.yml # Docker configuration
```

## Technology Stack

### Backend
- Node.js 18+ LTS
- Express.js
- MySQL 8.0+
- Joi (validation)

### Frontend
- React 18+
- Vite
- React Router
- Leaflet (maps)

## Quick Start

### Option 1: Docker (Recommended for Development)

**Prerequisites:** Docker and Docker Compose

```bash
# Copy environment file
cp .env.docker.example .env

# Start all services with hot reload
docker-compose up --build
```

The API will be available at: **http://localhost:3000**
The Frontend will be available at: **http://localhost:5173**

**Using shell scripts (for container operations):**
```bash
./dev.sh          # Start development environment
./shell.sh        # Access backend container
./mysql.sh        # Access MySQL CLI
```

**Basic docker-compose commands:**
```bash
docker-compose up -d        # Start in background
docker-compose down         # Stop services
docker-compose logs -f      # View logs
```

See [DOCKER.md](./DOCKER.md) for detailed Docker instructions.

### Option 2: Local Development

**Prerequisites:**
- Node.js 18+ LTS
- MySQL 8.0+
- npm or yarn

**Backend Setup:**

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run seed
npm run dev
```

**Frontend Setup:**

```bash
cd frontend
npm install
npm run dev
```

## Documentation

- [Technical Document](./docs/TECHNICAL_DOCUMENT.md) - Complete technical specifications
- [Implementation Plan](./docs/IMPLEMENTATION_PLAN.md) - Phase-by-phase implementation guide
- [Backend README](./backend/README.md) - Backend-specific documentation
- [Setup Guide](./SETUP.md) - Detailed setup instructions

## Features

- ✅ Coordinate-based prayer time calculations
- ✅ Multiple Islamic calculation methods (20+ methods)
- ✅ Fasting time calculations
- ✅ Monthly, yearly, and date range calendars
- ✅ Interactive map for location selection
- ✅ Export/Download calendars (PDF, CSV, iCal, JSON)
- ✅ Print functionality
- ✅ Bengali language support
- ✅ Responsive design

## API Endpoints

- `GET /v1/prayer-times` - Get prayer times
- `GET /v1/fasting-times` - Get fasting times
- `GET /v1/calendar/monthly` - Monthly calendar
- `GET /v1/calendar/yearly` - Yearly calendar
- `GET /v1/calendar/date-range` - Date range calendar
- `GET /v1/locations/search` - Search locations
- `GET /v1/methods` - Available calculation methods

## Development

See [Implementation Plan](./docs/IMPLEMENTATION_PLAN.md) for detailed development phases.

## License

MIT

## Contributing

Contributions are welcome! Please read the documentation and follow the implementation plan.
