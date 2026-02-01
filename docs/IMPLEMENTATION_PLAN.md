# Phase-by-Phase Implementation Plan
## Salat and Saom Timing API - React Frontend, Node.js Backend, MySQL Database

---

## Overview

This document outlines a comprehensive, phase-by-phase implementation plan for building the Salat and Saom Timing API application with React frontend, Node.js backend, and MySQL database.

**Technology Stack:**
- **Frontend**: React 18+ with modern tooling
- **Backend**: Node.js 18+ with Express.js
- **Database**: MySQL 8.0+ (with database caching)
- **Additional**: Docker (containerization, optional)

**Total Estimated Timeline**: 12-16 weeks (3-4 months)

---

## Phase 0: Project Setup and Planning (Week 1)

### Objectives
- Set up development environment
- Initialize project structure
- Configure development tools
- Set up version control

### Tasks

#### 0.1 Repository Setup
- [ ] Initialize Git repository
- [ ] Create project structure (monorepo or separate repos)
- [ ] Set up `.gitignore` files
- [ ] Create initial README files
- [ ] Set up branch strategy (main, develop, feature branches)

#### 0.2 Development Environment
- [ ] Install Node.js 18+ LTS
- [ ] Install MySQL 8.0+
- [ ] Install Docker and Docker Compose (optional)
- [ ] Set up code editor (VS Code recommended)
- [ ] Install essential extensions (ESLint, Prettier, etc.)

#### 0.3 Project Structure
```
ramadan/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   ├── tests/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js (or similar)
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── schema.sql
├── docs/
│   └── TECHNICAL_DOCUMENT.md
└── docker-compose.yml
```

#### 0.4 Tool Configuration
- [ ] Set up ESLint for backend and frontend
- [ ] Set up Prettier for code formatting
- [ ] Configure pre-commit hooks (Husky)
- [ ] Set up environment variable templates
- [ ] Create initial package.json files

### Deliverables
- ✅ Git repository initialized
- ✅ Development environment configured
- ✅ Project structure created
- ✅ Basic tooling configured

**Estimated Time**: 3-5 days

---

## Phase 1: Database Setup and Backend Foundation (Week 2-3)

### Objectives
- Set up MySQL database
- Create database schema
- Set up database connection
- Implement basic backend structure

### Tasks

#### 1.1 Database Setup
- [ ] Install and configure MySQL
- [ ] Create database: `salat_saom_db`
- [ ] Set up database user and permissions
- [ ] Configure connection pooling
- [ ] Test database connectivity

#### 1.2 Database Schema Implementation
- [ ] Create `calculation_methods` table
- [ ] Create `locations` table
- [ ] Create `prayer_times_cache` table
- [ ] Create `fasting_times_cache` table
- [ ] Create `api_requests` table (optional, for logging)
- [ ] Create all indexes
- [ ] Add constraints and validations

**Database Migration Script:**
```sql
-- Run migrations in order
1. Create database
2. Create calculation_methods table
3. Create locations table
4. Create prayer_times_cache table
5. Create fasting_times_cache table
6. Create indexes
7. Seed initial data
```

#### 1.3 Backend Project Setup
- [ ] Initialize Node.js project (`npm init`)
- [ ] Install dependencies:
  - express
  - mysql2
  - dotenv
  - cors
  - helmet
  - express-rate-limit
  - joi (validation)
  - compression
  - uuid
- [ ] Set up project structure
- [ ] Configure environment variables
- [ ] Create database connection module

#### 1.4 Database Connection Module
**File**: `backend/src/config/database.js`
- [ ] Create MySQL connection pool
- [ ] Implement connection error handling
- [ ] Add connection health check
- [ ] Configure connection pool settings

#### 1.5 Database Migration System
**File**: `backend/src/database/migrate.js`
- [ ] Create migration runner
- [ ] Implement schema.sql execution
- [ ] Add migration rollback capability
- [ ] Create migration status tracking

#### 1.6 Database Seeding
**File**: `backend/src/database/seed.js`
- [ ] Seed calculation methods (all 20 methods)
- [ ] Seed major locations (8 major cities)
- [ ] Seed district centers (64 districts)
- [ ] Verify seed data

### Deliverables
- ✅ MySQL database configured
- ✅ All tables created with indexes
- ✅ Database connection module working
- ✅ Migration system implemented
- ✅ Initial data seeded

**Estimated Time**: 1.5-2 weeks

---

## Phase 2: Core Calculation Engine (Week 4-5)

### Objectives
- Implement astronomical calculations
- Create calculation service
- Test calculation accuracy
- Validate against known sources

### Tasks

#### 2.1 Astronomical Calculation Functions
**File**: `backend/src/utils/calculations.js`

- [ ] Implement `getDayOfYear(date)`
- [ ] Implement `calculateSolarDeclination(date)`
- [ ] Implement `calculateEquationOfTime(date)`
- [ ] Implement `calculateSolarNoon(longitude, date)`
- [ ] Implement `calculateHourAngle(latitude, declination, altitude)`
- [ ] Implement `hourAngleToTime(hourAngle)`
- [ ] Implement `minutesToTime(minutes)`
- [ ] Implement `calculatePrayerTime(solarNoon, hourAngle, isBeforeNoon)`

#### 2.2 Prayer Time Calculation
- [ ] Implement `calculatePrayerTimes(lat, lng, date, method)`
- [ ] Support all 20 calculation methods
- [ ] Handle custom angles (fajr_angle, isha_angle)
- [ ] Implement Dhuhr adjustment
- [ ] Implement Maghrib adjustment
- [ ] Handle time-based Isha (Umm Al-Qura method)
- [ ] Implement Asr calculation (standard and Hanafi)

#### 2.3 Fasting Time Calculation
- [ ] Implement `calculateFastingTimes(lat, lng, date, method, sehriMargin)`
- [ ] Calculate Sehri end time
- [ ] Calculate fasting duration
- [ ] Calculate day length
- [ ] Format duration strings

#### 2.4 Method Configuration System
**File**: `backend/src/config/methods.js`

- [ ] Define all 20 calculation methods with parameters
- [ ] Create method lookup function
- [ ] Implement method parameter resolution
- [ ] Handle custom method configuration

#### 2.5 Calculation Validation
- [ ] Validate time sequence (Fajr < Sunrise < Dhuhr < Asr < Maghrib < Isha)
- [ ] Validate time ranges (reasonable for Bangladesh)
- [ ] Validate coordinate bounds
- [ ] Add error handling for edge cases

#### 2.6 Unit Tests for Calculations
**File**: `backend/tests/calculations.test.js`

- [ ] Test solar declination calculations
- [ ] Test equation of time
- [ ] Test prayer time calculations
- [ ] Test fasting time calculations
- [ ] Test all calculation methods
- [ ] Test edge cases

### Deliverables
- ✅ Complete calculation engine implemented
- ✅ All 20 calculation methods supported
- ✅ Calculation functions tested
- ✅ Validation against known prayer times

**Estimated Time**: 2 weeks

---

## Phase 3: Backend API Development (Week 6-8)

### Objectives
- Implement REST API endpoints
- Add middleware (validation, error handling, rate limiting)
- Implement caching layer
- Add request logging

### Tasks

#### 3.1 Express Server Setup
**File**: `backend/src/server.js`

- [ ] Initialize Express application
- [ ] Configure middleware (CORS, helmet, compression)
- [ ] Set up request ID middleware
- [ ] Configure rate limiting
- [ ] Set up error handling middleware
- [ ] Add health check endpoint

#### 3.2 Validation Middleware
**File**: `backend/src/middleware/validation.js`

- [ ] Implement coordinate validation
- [ ] Implement date validation
- [ ] Implement method validation
- [ ] Implement angle validation (fajr_angle, isha_angle)
- [ ] Implement adjustment validation (dhuhr, maghrib, sehri_margin)
- [ ] Add Bangladesh bounds validation

#### 3.3 Error Handling Middleware
**File**: `backend/src/middleware/errorHandler.js`

- [ ] Create custom error classes
- [ ] Implement global error handler
- [ ] Implement 404 handler
- [ ] Add error logging
- [ ] Format error responses

#### 3.4 Prayer Times Controller
**File**: `backend/src/controllers/prayerTimesController.js`

- [ ] Implement `getPrayerTimes` function
- [ ] Add database cache lookup
- [ ] Implement calculation if not cached
- [ ] Store results in cache
- [ ] Add location lookup
- [ ] Format response
- [ ] Add request logging

#### 3.5 Fasting Times Controller
**File**: `backend/src/controllers/fastingTimesController.js`

- [ ] Implement `getFastingTimes` function
- [ ] Add database cache lookup
- [ ] Implement calculation if not cached
- [ ] Store results in cache
- [ ] Format response with durations
- [ ] Add request logging

#### 3.6 Calendar Controllers
**Files**: 
- `backend/src/controllers/monthlyCalendarController.js`
- `backend/src/controllers/yearlyCalendarController.js`
- `backend/src/controllers/dateRangeCalendarController.js`

- [ ] Implement monthly calendar generation
- [ ] Implement yearly calendar generation
- [ ] Implement date range calendar generation
- [ ] Add summary format option
- [ ] Optimize batch calculations
- [ ] Add caching for calendars
- [ ] Implement calendar download endpoints (PDF, CSV, iCal, JSON)
- [ ] Add date range validation (max range limits)
- [ ] Optimize for large date ranges

#### 3.7 Location Controller
**File**: `backend/src/controllers/locationController.js`

- [ ] Implement location search
- [ ] Add fuzzy matching
- [ ] Implement reverse geocoding
- [ ] Add Bengali name support
- [ ] Implement relevance scoring

#### 3.8 Methods Controller
**File**: `backend/src/controllers/methodsController.js`

- [ ] Implement `getAvailableMethods` function
- [ ] Return all methods with parameters
- [ ] Include custom option ranges
- [ ] Add method descriptions

#### 3.9 API Routes
**Files**: `backend/src/routes/*.js`

- [ ] Create prayer times routes
- [ ] Create fasting times routes
- [ ] Create calendar routes:
  - [ ] GET /v1/calendar/monthly (monthly calendar)
  - [ ] GET /v1/calendar/yearly (yearly calendar)
  - [ ] GET /v1/calendar/date-range (date range calendar)
  - [ ] GET /v1/calendar/download (download calendar)
- [ ] Create location routes
- [ ] Create methods routes
- [ ] Add route validation middleware
- [ ] Set up route versioning

#### 3.10 Caching Service
**File**: `backend/src/services/cacheService.js`

- [ ] Implement database cache lookup
- [ ] Implement cache storage in MySQL
- [ ] Add cache key generation
- [ ] Implement cache TTL management
- [ ] Optimize cache queries with proper indexes

#### 3.11 Request Logging
**File**: `backend/src/middleware/logger.js`

- [ ] Implement request logging middleware
- [ ] Log to database (api_requests table)
- [ ] Log to file/console
- [ ] Add structured logging
- [ ] Include performance metrics

#### 3.12 API Documentation
- [ ] Create OpenAPI/Swagger specification
- [ ] Set up Swagger UI
- [ ] Document all endpoints
- [ ] Add request/response examples
- [ ] Document error codes

### Deliverables
- ✅ All API endpoints implemented
- ✅ Middleware configured
- ✅ Caching layer working
- ✅ Request logging functional
- ✅ API documentation complete

**Estimated Time**: 3 weeks

---

## Phase 4: Backend Testing and Optimization (Week 9)

### Objectives
- Write comprehensive tests
- Optimize performance
- Fix bugs and issues
- Prepare for frontend integration

### Tasks

#### 4.1 Unit Tests
- [ ] Test all calculation functions
- [ ] Test validation middleware
- [ ] Test error handling
- [ ] Test utility functions
- [ ] Achieve 90%+ code coverage

#### 4.2 Integration Tests
- [ ] Test all API endpoints
- [ ] Test database operations
- [ ] Test caching mechanisms
- [ ] Test error scenarios
- [ ] Test edge cases

#### 4.3 Performance Testing
- [ ] Load testing (1000+ requests/second)
- [ ] Response time optimization
- [ ] Database query optimization
- [ ] Database cache hit rate optimization
- [ ] Memory leak detection

#### 4.4 Bug Fixes
- [ ] Fix identified bugs
- [ ] Resolve performance issues
- [ ] Fix edge cases
- [ ] Improve error messages

#### 4.5 Code Review and Refactoring
- [ ] Code review
- [ ] Refactor for maintainability
- [ ] Improve code documentation
- [ ] Optimize database queries

### Deliverables
- ✅ Comprehensive test suite
- ✅ Performance optimized
- ✅ Bugs fixed
- ✅ Code reviewed and refactored

**Estimated Time**: 1 week

---

## Phase 5: Frontend Setup and Core Components (Week 10-11)

### Objectives
- Set up React application
- Create core UI components
- Implement API service layer
- Build main pages

### Tasks

#### 5.1 React Project Setup
- [ ] Initialize React project (Vite or Create React App)
- [ ] Install dependencies:
  - react, react-dom
  - react-router-dom
  - axios or fetch
  - date-fns (date handling)
  - tailwindcss or styled-components (styling)
  - react-query or SWR (data fetching)
  - leaflet and react-leaflet (map library) OR react-google-maps
  - leaflet CSS (if using Leaflet)
- [ ] Configure build tools
- [ ] Set up environment variables
- [ ] Configure routing
- [ ] Configure map API keys (if using Google Maps)

#### 5.2 Project Structure
```
frontend/src/
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Loading.jsx
│   │   └── ErrorMessage.jsx
│   ├── prayer/
│   │   ├── PrayerTimesCard.jsx
│   │   ├── PrayerTimeItem.jsx
│   │   └── PrayerTimesList.jsx
│   ├── fasting/
│   │   ├── FastingTimesCard.jsx
│   │   └── FastingDuration.jsx
│   ├── calendar/
│   │   ├── CalendarView.jsx
│   │   └── CalendarDay.jsx
│   └── map/
│       ├── LocationMap.jsx
│       ├── MapMarker.jsx
│       └── MapControls.jsx
├── pages/
│   ├── Home.jsx
│   ├── PrayerTimes.jsx
│   ├── FastingTimes.jsx
│   ├── Calendar.jsx
│   └── Settings.jsx
├── services/
│   ├── api.js
│   ├── prayerTimesService.js
│   ├── fastingTimesService.js
│   └── locationService.js
├── hooks/
│   ├── usePrayerTimes.js
│   ├── useFastingTimes.js
│   └── useLocation.js
├── utils/
│   ├── validators.js
│   ├── formatters.js
│   └── constants.js
├── context/
│   └── AppContext.jsx
├── App.jsx
└── main.jsx
```

#### 5.3 API Service Layer
**File**: `frontend/src/services/api.js`

- [ ] Create base API client
- [ ] Configure axios/fetch with base URL
- [ ] Add request interceptors
- [ ] Add response interceptors
- [ ] Handle errors globally
- [ ] Add authentication (if needed)

**File**: `frontend/src/services/prayerTimesService.js`

- [ ] Implement `getPrayerTimes(lat, lng, date, method)`
- [ ] Implement `getMonthlyCalendar(lat, lng, year, month, method)`
- [ ] Implement `getYearlyCalendar(lat, lng, year, method)`
- [ ] Implement `getDateRangeCalendar(lat, lng, startDate, endDate, method)`
- [ ] Implement `downloadCalendar(lat, lng, viewType, params, format, method)`
  - [ ] Support monthly download (year, month)
  - [ ] Support yearly download (year)
  - [ ] Support date range download (startDate, endDate)
- [ ] Implement `printCalendar(lat, lng, viewType, params, method)` (prepare data for printing)
- [ ] Add error handling
- [ ] Add request caching

**File**: `frontend/src/services/fastingTimesService.js`

- [ ] Implement `getFastingTimes(lat, lng, date, method, margin)`
- [ ] Implement `getMonthlyFastingCalendar(lat, lng, year, month, method, margin)`
- [ ] Implement `getDateRangeFastingCalendar(lat, lng, startDate, endDate, method, margin)`
- [ ] Implement `downloadFastingCalendar(lat, lng, startDate, endDate, format, method, margin)`
- [ ] Add error handling

**File**: `frontend/src/services/locationService.js`

- [ ] Implement `searchLocations(query)`
- [ ] Implement `getLocationByCoordinates(lat, lng)`

#### 5.4 Custom Hooks
**File**: `frontend/src/hooks/usePrayerTimes.js`

```javascript
function usePrayerTimes(lat, lng, date, method) {
  // Fetch prayer times
  // Handle loading state
  // Handle error state
  // Return data, loading, error
}
```

**File**: `frontend/src/hooks/useFastingTimes.js`
- [ ] Similar hook for fasting times

**File**: `frontend/src/hooks/useLocation.js`
- [ ] Hook for location search and geolocation
- [ ] Hook for map click coordinates
- [ ] Hook for reverse geocoding (coordinates to address)

**File**: `frontend/src/hooks/useMap.js`
- [ ] Hook for map initialization
- [ ] Hook for map click handling
- [ ] Hook for marker placement
- [ ] Hook for map bounds (Bangladesh boundaries)

#### 5.5 Core UI Components

**Header Component:**
- [ ] Navigation menu
- [ ] Logo/branding
- [ ] Language selector (English/Bengali)
- [ ] Settings link

**Prayer Times Card:**
- [ ] Display all prayer times
- [ ] Show current prayer
- [ ] Countdown to next prayer
- [ ] Method selector
- [ ] Date selector

**Fasting Times Card:**
- [ ] Display Sehri and Iftar times
- [ ] Show fasting duration
- [ ] Show day length
- [ ] Method selector
- [ ] Sehri margin selector

**Calendar Component:**
- [ ] Monthly calendar view (grid layout)
- [ ] Yearly calendar view (overview with all months)
- [ ] Date range calendar view (list/table)
- [ ] Prayer times per day
- [ ] Fasting times per day
- [ ] Date range selector component
- [ ] View mode toggle (Monthly / Yearly / Date Range)
- [ ] Month/year navigation (for monthly view)
- [ ] Year navigation (for yearly view)
- [ ] Export/download options (all formats)
- [ ] Print functionality (monthly, yearly, date range)
- [ ] Print preview
- [ ] Print optimization (page breaks, headers, footers)

**Location Map Component:**
- [ ] Interactive map display (Leaflet or Google Maps)
- [ ] Click on map to select location
- [ ] Marker for selected location
- [ ] Bangladesh boundary constraints
- [ ] Current location marker
- [ ] Map controls (zoom, pan)
- [ ] Coordinate display
- [ ] Location name display (if available)

#### 5.6 Main Pages

**Home Page:**
- [ ] Interactive map for location selection
- [ ] Click on map to select coordinates
- [ ] Location input/search with map integration
- [ ] Current location detection (GPS)
- [ ] Today's prayer times (updates on map click)
- [ ] Today's fasting times (updates on map click)
- [ ] Quick access to calendar
- [ ] Map and times side-by-side or stacked layout

**Prayer Times Page:**
- [ ] Interactive map for location selection
- [ ] Click on map to select coordinates
- [ ] Location selector (search + map)
- [ ] Date selector
- [ ] Method selector
- [ ] Prayer times display (updates on map click)
- [ ] Sunrise/sunset times
- [ ] Map view toggle (show/hide map)

**Fasting Times Page:**
- [ ] Interactive map for location selection
- [ ] Click on map to select coordinates
- [ ] Location selector (search + map)
- [ ] Date selector
- [ ] Method selector
- [ ] Sehri margin selector
- [ ] Fasting times display (updates on map click)
- [ ] Map view toggle (show/hide map)

**Calendar Page:**
- [ ] View mode selector (Monthly / Yearly / Date Range)
- [ ] Month/year selector (for monthly view)
- [ ] Year selector (for yearly view)
- [ ] Date range selector (start date / end date)
- [ ] Monthly calendar grid view
- [ ] Yearly calendar overview view
- [ ] Date range list/table view
- [ ] Daily prayer times display
- [ ] Daily fasting times display
- [ ] View/download/export/print options
- [ ] Export functionality (PDF, CSV, iCal, JSON)
- [ ] Print calendar option (monthly, yearly, date range)
- [ ] Print preview functionality

**Settings Page:**
- [ ] Default location
- [ ] Default method
- [ ] Default Sehri margin
- [ ] Language preference
- [ ] Notification settings (future)

### Deliverables
- ✅ React application set up
- ✅ Core components implemented
- ✅ API service layer working
- ✅ Main pages created
- ✅ Basic UI functional

**Estimated Time**: 2 weeks

---

## Phase 6: Frontend Features and Polish (Week 12-13)

### Objectives
- Add advanced features
- Improve user experience
- Add Bengali language support
- Implement responsive design

### Tasks

#### 6.1 Location Features

**Map Integration:**
- [ ] Interactive map with click-to-select location
- [ ] Map marker for selected location (customizable icon)
- [ ] Map bounds restricted to Bangladesh (prevent panning outside)
- [ ] Click on map to get coordinates and update prayer/fasting times
- [ ] Real-time coordinate display on map click
- [ ] Map zoom controls (zoom in/out buttons)
- [ ] Map pan controls (drag to move)
- [ ] Initial map center on Bangladesh (default: Dhaka coordinates)
- [ ] Map style customization (optional themes)

**Location Search Integration:**
- [ ] Location search with autocomplete
- [ ] Search results displayed as markers on map
- [ ] Click search result to center map and show times
- [ ] Search result highlights on map

**GPS Integration:**
- [ ] GPS location detection with map centering
- [ ] Show current location marker on map
- [ ] Auto-update prayer/fasting times on GPS location
- [ ] Permission handling for geolocation API

**Location Management:**
- [ ] Save favorite locations (with map coordinates)
- [ ] Recent locations (with map preview)
- [ ] Location history
- [ ] Quick access to saved locations from map

**Reverse Geocoding:**
- [ ] Show location name on map click
- [ ] Display district/division name when available
- [ ] Show coordinates in tooltip/popup

**Map Component Features:**
- [ ] Responsive map (adapts to screen size)
- [ ] Fullscreen map mode for mobile
- [ ] Map and content layout (side-by-side on desktop, stacked on mobile)
- [ ] Map toggle button (show/hide map)
- [ ] Loading state for map initialization
- [ ] Error handling for map load failures

#### 6.2 Calendar Features

**View Options:**
- [ ] Monthly calendar view (grid layout)
- [ ] Yearly calendar view (12-month overview)
- [ ] Date range view (list/table layout)
- [ ] View mode toggle (Monthly / Yearly / Date Range)
- [ ] Month/year selector (for monthly view)
- [ ] Year selector (for yearly view)
- [ ] Date range selector (start date and end date pickers)
- [ ] Date range validation (max range, valid dates)
- [ ] Navigation between months/years
- [ ] Quick jump to current month/year
- [ ] Ramadan calendar highlight
- [ ] Hijri date display alongside Gregorian dates

**Display Features:**
- [ ] Daily prayer times in calendar grid
- [ ] Daily fasting times in calendar grid
- [ ] Hover tooltip with full details
- [ ] Click day to see detailed times
- [ ] Current date highlighting
- [ ] Today indicator
- [ ] Weekend highlighting (optional)

**Download/Export Features:**
- [ ] Download monthly calendar
- [ ] Download yearly calendar
- [ ] Download date range calendar
- [ ] Export formats:
  - [ ] PDF (printable calendar, optimized for printing)
  - [ ] CSV (spreadsheet format, Excel-compatible)
  - [ ] iCal (calendar import, Google Calendar/Outlook compatible)
  - [ ] JSON (machine-readable, API format)
- [ ] Export options:
  - [ ] Include prayer times
  - [ ] Include fasting times
  - [ ] Include sunrise/sunset
  - [ ] Include Hijri dates
  - [ ] Include location information
  - [ ] Include calculation method
- [ ] Print functionality:
  - [ ] Print monthly calendar
  - [ ] Print yearly calendar
  - [ ] Print date range calendar
  - [ ] Print preview (before printing)
  - [ ] Print optimization (page breaks, headers, footers)
  - [ ] Print styles (landscape/portrait, page size)
  - [ ] Browser print dialog integration
- [ ] Custom date range download
- [ ] Batch download (multiple months/ranges)
- [ ] Export all formats from same interface

**User Experience:**
- [ ] Loading state during calendar generation
- [ ] Progress indicator for large date ranges
- [ ] Download progress indicator
- [ ] Success notification after download
- [ ] Error handling for download failures
- [ ] File naming convention (location_date_range_format)

#### 6.3 Calculation Method Selection
- [ ] Method dropdown with all 20 methods
- [ ] Method descriptions
- [ ] Custom angle inputs
- [ ] Dhuhr adjustment input
- [ ] Maghrib adjustment input
- [ ] Asr method selection

#### 6.4 Bengali Language Support
- [ ] Bengali translations
- [ ] Language switcher
- [ ] Bengali font support
- [ ] RTL support (if needed)
- [ ] Bengali date formatting

#### 6.5 Responsive Design
- [ ] Mobile-first design
- [ ] Tablet optimization
- [ ] Desktop optimization
- [ ] Touch-friendly interactions
- [ ] Responsive calendar
- [ ] Responsive map (mobile-friendly map controls)
- [ ] Map fullscreen mode for mobile
- [ ] Map and content layout adaptation (side-by-side on desktop, stacked on mobile)

#### 6.6 User Experience Enhancements
- [ ] Loading states
- [ ] Error handling UI
- [ ] Success messages
- [ ] Form validation
- [ ] Smooth animations
- [ ] Dark mode (optional)

#### 6.7 Advanced Features
- [ ] Prayer time notifications (browser notifications)
- [ ] Countdown to next prayer
- [ ] Current prayer indicator
- [ ] Time remaining for current prayer
- [ ] Qibla direction (if implemented)
- [ ] Share functionality
- [ ] Calendar sharing (share calendar link)
- [ ] Quick date range presets (This Month, This Year, Ramadan, Next 30 Days)

#### 6.8 State Management
- [ ] Context API for global state
- [ ] Local storage for preferences
- [ ] Session storage for temporary data
- [ ] State persistence

### Deliverables
- ✅ Advanced features implemented
- ✅ Map-based location selection working
- ✅ Bengali language support
- ✅ Responsive design complete
- ✅ User experience polished

**Estimated Time**: 2 weeks

### Map Implementation Details

#### Map Library Selection

**Recommended: Leaflet (Free and Open-Source)**
- **Package**: `leaflet` and `react-leaflet`
- **CSS**: `leaflet/dist/leaflet.css`
- **Benefits**: Free, no API key required, lightweight, good documentation
- **Installation**: `npm install leaflet react-leaflet`

**Alternative: Google Maps**
- **Package**: `@react-google-maps/api`
- **Requires**: Google Maps API key
- **Benefits**: More features, better satellite imagery
- **Cost**: May require billing for high usage

#### Map Component Implementation

**File**: `frontend/src/components/map/LocationMap.jsx`

**Key Features:**
```javascript
// Example structure
- MapContainer (from react-leaflet)
  - TileLayer (map tiles)
  - Marker (selected location)
  - Marker (current GPS location, if available)
  - Click handler (on map click)
  - Bounds (restrict to Bangladesh)
```

**Bangladesh Boundaries:**
- **North**: 26.638°N
- **South**: 20.738°N
- **East**: 92.673°E
- **West**: 88.084°E
- **Default Center**: Dhaka (23.8103°N, 90.4125°E)
- **Default Zoom**: 7 (country view) or 10 (city view)

**Map Click Handler:**
```javascript
// On map click:
1. Get clicked coordinates (lat, lng)
2. Validate coordinates are within Bangladesh bounds
3. Update selected location state
4. Place marker at clicked location
5. Fetch prayer/fasting times for coordinates
6. Update prayer/fasting times display
7. Optionally: Reverse geocode to get location name
```

**Integration with Prayer/Fasting Times:**
- Map click triggers API call to get prayer/fasting times
- Times update automatically when location changes
- Loading state shown while fetching
- Error handling if API call fails

**Responsive Design:**
- Desktop: Map and times side-by-side
- Tablet: Map and times stacked or side-by-side
- Mobile: Full-width map, times below, or toggle between views

### Calendar Download Implementation Details

#### Calendar View Modes

**Monthly View:**
- Grid layout showing full month
- Each day cell shows prayer/fasting times
- Click day for detailed view
- Navigate between months
- Default to current month

**Date Range View:**
- List/table layout showing selected date range
- Each row represents one day
- Columns: Date, Prayer Times, Fasting Times
- Sortable columns (optional)
- Filterable by date range

#### Date Range Selection

**Date Range Picker Component:**
```javascript
// Features:
- Start date picker
- End date picker
- Date validation (end >= start)
- Max range limit (e.g., 365 days)
- Quick presets:
  - This Month
  - This Year
  - Ramadan (current/next)
  - Next 30 Days
  - Next 90 Days
  - Custom Range
```

**Validation:**
- Start date must be before end date
- Maximum range: 365 days (configurable)
- Minimum range: 1 day
- Dates must be valid
- Dates must be within reasonable range (e.g., 2020-2050)

#### Download/Export Functionality

**Supported Formats:**

1. **PDF Format:**
   - Printable calendar layout
   - Grid format for monthly view
   - Table format for date range
   - Include location and method info
   - Include headers and footers
   - Bengali language support

2. **CSV Format:**
   - Spreadsheet-compatible
   - Columns: Date, Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha, Sehri, Iftar
   - UTF-8 encoding for Bengali
   - Easy to import into Excel/Google Sheets

3. **iCal Format:**
   - Standard calendar format
   - Importable into Google Calendar, Outlook, etc.
   - Each prayer time as event
   - Recurring events for daily prayers
   - Include fasting times as events

4. **JSON Format:**
   - Machine-readable format
   - Complete data structure
   - Easy to process programmatically
   - Include metadata (location, method, etc.)

**Download Implementation:**

**Backend Endpoints:**

**Monthly Calendar:**
```
GET /v1/calendar/monthly
Query Parameters:
- latitude (required)
- longitude (required)
- year (required)
- month (required, 1-12)
- method (optional, default: karachi)
- format (optional: json, pdf, csv, ical)
```

**Yearly Calendar:**
```
GET /v1/calendar/yearly
Query Parameters:
- latitude (required)
- longitude (required)
- year (required)
- method (optional, default: karachi)
- format (optional: json, pdf, csv, ical)
- include_fasting (optional, default: true)
```

**Date Range Calendar:**
```
GET /v1/calendar/date-range
Query Parameters:
- latitude (required)
- longitude (required)
- start_date (required)
- end_date (required)
- method (optional, default: karachi)
- format (optional: json, pdf, csv, ical)
- include_fasting (optional, default: true)
```

**Download Endpoint:**
```
GET /v1/calendar/download
Query Parameters:
- latitude (required)
- longitude (required)
- start_date (required for date range)
- end_date (required for date range)
- OR year (required for yearly)
- OR year + month (required for monthly)
- format (required: pdf, csv, ical, json)
- method (optional, default: karachi)
- include_fasting (optional, default: true)
- view_type (required: monthly, yearly, date_range)
```

**Frontend Download Flow:**
1. User selects date range
2. User selects format
3. User clicks download button
4. Show loading indicator
5. Make API request
6. Receive file/blob
7. Trigger browser download
8. Show success notification

**File Naming Convention:**
- Monthly: `salat-saom-{location}-{year}-{month}.{format}`
  - Example: `salat-saom-dhaka-2024-03.pdf`
- Yearly: `salat-saom-{location}-{year}.{format}`
  - Example: `salat-saom-dhaka-2024.pdf`
- Date Range: `salat-saom-{location}-{start-date}-{end-date}.{format}`
  - Example: `salat-saom-dhaka-2024-03-01-2024-03-31.pdf`
- Sanitize location name for filename
- Use ISO date format (YYYY-MM-DD)

#### Calendar Display Features

**Monthly Calendar Grid:**
- 7 columns (Sunday-Saturday or Monday-Sunday, configurable)
- Rows for each week (4-6 rows depending on month)
- Highlight current date
- Highlight Ramadan dates (if applicable)
- Highlight weekends (optional)
- Show Hijri date (optional)
- Color code prayer times
- Hover tooltip with full details
- Click day to see detailed times
- Responsive grid (adapts to screen size)

**Yearly Calendar Overview:**
- 12-month grid layout (3×4 or 4×3)
- Each month shows mini calendar
- Key dates highlighted (Ramadan, Eid, etc.)
- Month names in Bengali/English
- Click month to navigate to monthly view
- Summary information per month
- Current month/year highlighted
- Responsive layout (stacks on mobile)

**Date Range List/Table:**
- Sortable by date
- Filterable (optional)
- Pagination for large ranges
- Search within range (optional)
- Export visible data or all data
- Print-friendly layout
- Responsive table (scrollable on mobile)

**Quick Actions:**
- Download current view (monthly/yearly/date range)
- Export in multiple formats (PDF, CSV, iCal, JSON)
- Print current view (monthly/yearly/date range)
- Print preview before printing
- Share calendar link
- Copy to clipboard (CSV format)
- Email calendar (optional)
- Quick export buttons (one-click export)

**Print Functionality Details:**

**Print Features:**
- Print-optimized layouts for each view type
- Page break management (avoid splitting months/days)
- Headers and footers (location, method, date range)
- Print styles (CSS @media print)
- Landscape/Portrait orientation options
- Page size selection (A4, Letter, etc.)
- Print margins configuration
- Hide non-essential elements when printing
- Print preview before actual printing
- Browser print dialog integration

**Print Optimization:**
- Monthly: Fit one month per page
- Yearly: Fit all months on pages (multiple pages if needed)
- Date Range: Paginate with headers on each page
- Include location and method information
- Include page numbers
- Include generation date/time
- Optimize font sizes for printing
- Ensure good contrast for black & white printing

---

## Phase 7: Integration and End-to-End Testing (Week 14)

### Objectives
- Integrate frontend with backend
- End-to-end testing
- Fix integration issues
- Performance optimization

### Tasks

#### 7.1 Frontend-Backend Integration
- [ ] Connect frontend to backend API
- [ ] Test all API calls
- [ ] Handle CORS issues
- [ ] Test error scenarios
- [ ] Verify data flow

#### 7.2 End-to-End Testing
- [ ] Test complete user flows
- [ ] Test prayer times flow
- [ ] Test fasting times flow
- [ ] Test calendar generation
- [ ] Test location search
- [ ] Test method selection

#### 7.3 Cross-Browser Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Test on mobile browsers

#### 7.4 Performance Optimization
- [ ] Optimize API calls
- [ ] Implement request caching
- [ ] Optimize bundle size
- [ ] Lazy load components
- [ ] Optimize images/assets

#### 7.5 Bug Fixes
- [ ] Fix integration bugs
- [ ] Fix UI/UX issues
- [ ] Fix performance issues
- [ ] Fix browser compatibility issues

### Deliverables
- ✅ Frontend and backend integrated
- ✅ End-to-end tests passing
- ✅ Cross-browser compatible
- ✅ Performance optimized
- ✅ All bugs fixed

**Estimated Time**: 1 week

---

## Phase 8: Deployment Preparation (Week 15)

### Objectives
- Prepare for production deployment
- Set up production environment
- Configure production database
- Set up monitoring

### Tasks

#### 8.1 Production Environment Setup
- [ ] Set up production server/cloud
- [ ] Configure production database
- [ ] Optimize database for caching performance
- [ ] Configure environment variables
- [ ] Set up SSL certificates
- [ ] Configure domain and DNS

#### 8.2 Database Migration
- [ ] Run migrations on production database
- [ ] Seed production data
- [ ] Verify database setup
- [ ] Set up database backups
- [ ] Configure read replicas (if needed)

#### 8.3 Backend Deployment
- [ ] Build production backend
- [ ] Set up process manager (PM2)
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up load balancer (if needed)
- [ ] Configure auto-scaling (if needed)
- [ ] Set up monitoring

#### 8.4 Frontend Deployment
- [ ] Build production frontend
- [ ] Optimize build
- [ ] Deploy to CDN/hosting
- [ ] Configure environment variables
- [ ] Set up CI/CD pipeline

#### 8.5 Monitoring and Logging
- [ ] Set up application monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Set up log aggregation
- [ ] Set up performance monitoring
- [ ] Configure alerts

#### 8.6 Security Hardening
- [ ] Security audit
- [ ] Enable HTTPS
- [ ] Configure security headers
- [ ] Set up rate limiting
- [ ] Review access controls
- [ ] Penetration testing (optional)

### Deliverables
- ✅ Production environment configured
- ✅ Applications deployed
- ✅ Monitoring set up
- ✅ Security hardened

**Estimated Time**: 1 week

---

## Phase 9: Testing and Quality Assurance (Week 16)

### Objectives
- Comprehensive testing
- User acceptance testing
- Performance testing
- Security testing

### Tasks

#### 9.1 User Acceptance Testing
- [ ] Test with real users
- [ ] Collect feedback
- [ ] Fix user-reported issues
- [ ] Improve based on feedback

#### 9.2 Performance Testing
- [ ] Load testing
- [ ] Stress testing
- [ ] Response time testing
- [ ] Database performance testing
- [ ] Frontend performance testing

#### 9.3 Security Testing
- [ ] Security vulnerability scan
- [ ] SQL injection testing
- [ ] XSS testing
- [ ] Authentication testing
- [ ] Rate limiting testing

#### 9.4 Accessibility Testing
- [ ] Screen reader compatibility
- [ ] Keyboard navigation
- [ ] Color contrast
- [ ] Text scaling
- [ ] WCAG compliance

#### 9.5 Final Bug Fixes
- [ ] Fix all critical bugs
- [ ] Fix high-priority bugs
- [ ] Fix medium-priority bugs
- [ ] Document known issues

### Deliverables
- ✅ All tests passing
- ✅ User acceptance complete
- ✅ Performance validated
- ✅ Security validated
- ✅ Ready for production

**Estimated Time**: 1 week

---

## Phase 10: Launch and Post-Launch (Week 17+)

### Objectives
- Launch application
- Monitor performance
- Collect user feedback
- Plan improvements

### Tasks

#### 10.1 Pre-Launch Checklist
- [ ] Final code review
- [ ] Documentation complete
- [ ] Backup procedures tested
- [ ] Rollback plan prepared
- [ ] Support channels ready
- [ ] Launch announcement prepared

#### 10.2 Launch
- [ ] Deploy to production
- [ ] Verify deployment
- [ ] Monitor for issues
- [ ] Announce launch
- [ ] Share with community

#### 10.3 Post-Launch Monitoring
- [ ] Monitor error rates
- [ ] Monitor performance
- [ ] Monitor user feedback
- [ ] Track usage metrics
- [ ] Respond to issues

#### 10.4 Documentation
- [ ] User documentation
- [ ] API documentation
- [ ] Developer documentation
- [ ] Deployment documentation
- [ ] Troubleshooting guide

#### 10.5 Support
- [ ] Set up support channels
- [ ] Create FAQ
- [ ] Prepare support documentation
- [ ] Train support team (if applicable)

### Deliverables
- ✅ Application launched
- ✅ Monitoring active
- ✅ Documentation complete
- ✅ Support channels ready

**Estimated Time**: Ongoing

---

## Detailed Task Breakdown

### Backend Tasks (Weeks 2-9)

#### Week 2-3: Database and Foundation
**Day 1-2: Database Setup**
- Install MySQL
- Create database schema
- Create all tables
- Add indexes and constraints

**Day 3-4: Backend Setup**
- Initialize Node.js project
- Install dependencies
- Set up project structure
- Create database connection

**Day 5-7: Migration and Seeding**
- Create migration system
- Run migrations
- Create seed script
- Seed initial data
- Test database operations

#### Week 4-5: Calculation Engine
**Day 1-3: Basic Calculations**
- Implement solar declination
- Implement equation of time
- Implement solar noon
- Implement hour angle

**Day 4-6: Prayer Times**
- Implement prayer time calculations
- Support all methods
- Handle custom angles
- Handle adjustments

**Day 7-10: Fasting Times**
- Implement fasting calculations
- Calculate durations
- Format output

#### Week 6-8: API Development
**Day 1-2: Server Setup**
- Express server configuration
- Middleware setup
- Error handling

**Day 3-4: Validation**
- Input validation middleware
- Coordinate validation
- Date validation
- Method validation

**Day 5-7: Controllers**
- Prayer times controller
- Fasting times controller
- Calendar controllers
- Location controller

**Day 8-10: Routes and Services**
- API routes
- Caching service
- Request logging
- API documentation

#### Week 9: Testing and Optimization
**Day 1-3: Testing**
- Unit tests
- Integration tests
- Performance tests

**Day 4-5: Optimization**
- Performance optimization
- Bug fixes
- Code review

### Frontend Tasks (Weeks 10-13)

#### Week 10-11: Core Components
**Day 1-2: Project Setup**
- Initialize React project
- Install dependencies
- Configure build tools
- Set up routing

**Day 3-4: API Services**
- Create API client
- Implement service functions
- Add error handling
- Add request caching

**Day 5-7: Core Components**
- Header and Footer
- Location Map component (interactive map with click-to-select)
- Prayer times card
- Fasting times card
- Calendar component

**Day 8-10: Main Pages**
- Home page
- Prayer times page
- Fasting times page
- Calendar page
- Settings page

#### Week 12-13: Features and Polish
**Day 1-3: Advanced Features**
- Location search
- GPS detection
- Method selection
- Calendar export

**Day 4-5: Language Support**
- Bengali translations
- Language switcher
- Bengali formatting

**Day 6-7: Responsive Design**
- Mobile optimization
- Tablet optimization
- Desktop optimization

**Day 8-10: UX Enhancements**
- Loading states
- Error handling
- Animations
- Dark mode (optional)

### Integration and Deployment (Weeks 14-16)

#### Week 14: Integration
- Frontend-backend integration
- End-to-end testing
- Cross-browser testing
- Performance optimization

#### Week 15: Deployment Prep
- Production environment
- Database migration
- Application deployment
- Monitoring setup

#### Week 16: QA and Launch
- User acceptance testing
- Performance testing
- Security testing
- Launch preparation

---

## Technology Stack Details

### Backend Stack

**Core:**
- Node.js 18+ LTS
- Express.js 4.x
- MySQL2 (database driver)

**Middleware:**
- cors (CORS handling)
- helmet (security headers)
- express-rate-limit (rate limiting)
- compression (response compression)
- joi (validation)

**Development:**
- nodemon (auto-reload)
- jest (testing)
- eslint (linting)
- prettier (formatting)

### Frontend Stack

**Core:**
- React 18+
- React Router (routing)
- Axios or Fetch (API calls)

**State Management:**
- React Context API
- React Query or SWR (data fetching)

**Styling:**
- Tailwind CSS or Styled Components
- CSS Modules (optional)

**Utilities:**
- date-fns (date handling)
- react-icons (icons)
- jspdf or react-pdf (PDF generation, optional)
- file-saver (file download helper)

**Build Tool:**
- Vite (recommended) or Create React App

### Database

**MySQL 8.0+:**
- InnoDB engine
- utf8mb4 character set
- Connection pooling
- Database caching (prayer_times_cache, fasting_times_cache tables)
- Read replicas (optional, for scaling)

---

## Development Workflow

### Daily Workflow
1. **Morning**: Review tasks, plan day
2. **Development**: Implement features
3. **Testing**: Write and run tests
4. **Commit**: Commit with meaningful messages
5. **Review**: Code review (if team)

### Weekly Workflow
1. **Monday**: Plan week, review previous week
2. **Tuesday-Thursday**: Development
3. **Friday**: Testing, documentation, review

### Git Workflow
- **main**: Production-ready code
- **develop**: Integration branch
- **feature/***: Feature branches
- **hotfix/***: Critical bug fixes

**Commit Message Format:**
```
feat(backend): add prayer times endpoint
fix(frontend): fix date picker issue
docs: update API documentation
test: add calculation unit tests
```

---

## Risk Management

### Technical Risks

**Risk 1: Calculation Accuracy**
- **Mitigation**: Validate against known sources, extensive testing
- **Contingency**: Adjust formulas based on validation results

**Risk 2: Performance Issues**
- **Mitigation**: Implement caching, optimize queries, load testing
- **Contingency**: Scale infrastructure, optimize code

**Risk 3: Database Performance**
- **Mitigation**: Proper indexing, query optimization, read replicas
- **Contingency**: Database scaling, query optimization

### Schedule Risks

**Risk 1: Scope Creep**
- **Mitigation**: Strict phase boundaries, feature freeze dates
- **Contingency**: Defer non-critical features to future phases

**Risk 2: Integration Issues**
- **Mitigation**: Early integration testing, API contracts
- **Contingency**: Additional integration time

### Resource Risks

**Risk 1: Developer Availability**
- **Mitigation**: Clear documentation, knowledge sharing
- **Contingency**: Adjust timeline, prioritize critical features

---

## Success Criteria

### Phase Completion Criteria

**Phase 1 (Database):**
- ✅ All tables created
- ✅ Indexes optimized
- ✅ Data seeded
- ✅ Connection tested

**Phase 2 (Calculations):**
- ✅ All calculations accurate
- ✅ All methods supported
- ✅ Tests passing
- ✅ Validated against known sources

**Phase 3 (API):**
- ✅ All endpoints working
- ✅ Validation complete
- ✅ Caching functional
- ✅ Documentation complete

**Phase 4 (Testing):**
- ✅ 90%+ test coverage
- ✅ Performance targets met
- ✅ No critical bugs

**Phase 5-6 (Frontend):**
- ✅ All pages functional
- ✅ Responsive design
- ✅ Bengali support
- ✅ Good UX

**Phase 7 (Integration):**
- ✅ Frontend-backend integrated
- ✅ E2E tests passing
- ✅ Cross-browser compatible

**Phase 8-9 (Deployment):**
- ✅ Production deployed
- ✅ Monitoring active
- ✅ Security validated

**Phase 10 (Launch):**
- ✅ Application live
- ✅ Users can access
- ✅ Support channels ready

---

## Timeline Summary

| Phase | Duration | Weeks | Key Deliverables |
|-------|----------|-------|------------------|
| Phase 0 | 1 week | Week 1 | Project setup, environment |
| Phase 1 | 2 weeks | Weeks 2-3 | Database, backend foundation |
| Phase 2 | 2 weeks | Weeks 4-5 | Calculation engine |
| Phase 3 | 3 weeks | Weeks 6-8 | Backend API |
| Phase 4 | 1 week | Week 9 | Testing, optimization |
| Phase 5 | 2 weeks | Weeks 10-11 | Frontend core |
| Phase 6 | 2 weeks | Weeks 12-13 | Frontend features |
| Phase 7 | 1 week | Week 14 | Integration |
| Phase 8 | 1 week | Week 15 | Deployment prep |
| Phase 9 | 1 week | Week 16 | QA and testing |
| Phase 10 | Ongoing | Week 17+ | Launch and support |

**Total Timeline**: 16 weeks (4 months) to production launch

---

## Resource Requirements

### Development Team

**Minimum Team:**
- 1 Full-stack Developer (can handle both frontend and backend)
- 1 Database Administrator (part-time, for setup)

**Ideal Team:**
- 1 Backend Developer
- 1 Frontend Developer
- 1 Database Administrator (part-time)
- 1 QA Tester (part-time)

### Infrastructure

**Development:**
- Local MySQL instance
- Local development servers
- Git repository

**Production:**
- Cloud server (AWS, Azure, GCP) or VPS
- MySQL database (managed or self-hosted)
- Domain name
- SSL certificate
- CDN (optional)

### Tools and Services

**Development Tools:**
- Code editor (VS Code)
- Git
- Docker (optional)
- Postman/Insomnia (API testing)

**Services:**
- GitHub/GitLab (version control)
- CI/CD service (GitHub Actions, etc.)
- Monitoring service (optional)
- Error tracking (Sentry, optional)

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Adjust timeline** based on team size and availability
3. **Set up development environment** (Phase 0)
4. **Begin Phase 1** (Database setup)
5. **Regular reviews** at end of each phase
6. **Adjust plan** as needed based on progress

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Author**: Development Team
