# Technical Document: Coordinate-Based Salat and Saom Timing API for Bangladesh

## 1. Executive Summary

### 1.1 Problem Statement

#### 1.1.1 Current System Limitations
Traditional district-wise fasting calendars in Bangladesh have significant accuracy issues that affect millions of Muslims across the country. The current approach uses a single prayer and fasting time for entire districts, which creates substantial inaccuracies due to geographical variations.

#### 1.1.2 Geographic Scale Issues
Bangladesh has 64 districts with varying sizes:
- **Large Districts**: Some districts span over 6,000 km² (e.g., Rangamati: ~6,116 km², Bandarban: ~4,479 km²)
- **Time Variation**: Within large districts, sunset times can differ by **2-4 minutes** from one edge to another
- **Latitude Impact**: Bangladesh spans approximately 6° of latitude (20.738°N to 26.638°N), causing significant seasonal variations
- **Longitude Impact**: The country spans approximately 4.6° of longitude (88.084°E to 92.673°E), affecting local solar time

#### 1.1.3 Religious and Practical Implications
The inaccuracies in current district-based calendars have serious consequences:

**Religious Significance:**
- **Breaking Fast Early**: Breaking fast (Iftar) before actual sunset invalidates the day's fast according to Islamic jurisprudence
- **Starting Fast Late**: Missing Sehri deadline or starting fast after Fajr compromises the fast's validity
- **Prayer Timing**: Incorrect Maghrib and Fajr times affect the validity of prayers, which are time-sensitive obligations

**Practical Impact:**
- **Health Concerns**: Breaking fast too early or starting too late can cause confusion and health issues
- **Community Disunity**: Different areas within the same district may follow different times, causing confusion
- **Mobile Population**: People traveling within districts face uncertainty about correct times
- **Rural vs Urban**: Remote areas often have less access to accurate timing information

#### 1.1.4 Current Solution Gaps
- **Static Calendars**: Printed calendars cannot account for exact location variations
- **Limited Accessibility**: Not all areas have access to accurate district calendars
- **No Real-time Calculation**: Cannot provide times for arbitrary coordinates
- **Single Method**: Most calendars use only one calculation method (typically Hanafi)
- **No Digital Integration**: Difficult to integrate into mobile apps, websites, or smart devices

### 1.2 Solution Overview

#### 1.2.1 Core Innovation
A comprehensive, coordinate-based API system that calculates precise Salat (prayer) and Saom (fasting) times using exact geographical coordinates (latitude/longitude) rather than district boundaries. This approach ensures **accuracy within ±30 seconds** for any location in Bangladesh, addressing the critical timing variations that affect religious observance.

#### 1.2.2 Technical Approach
- **Astronomical Calculations**: Uses precise solar position algorithms based on established astronomical formulas
- **Coordinate-Based Precision**: Each calculation uses exact latitude/longitude, eliminating district-level approximations
- **Multiple Calculation Methods**: Supports all major Islamic schools of thought (Hanafi, Shafi, Maliki, Hanbali)
- **RESTful API Design**: Modern, scalable API architecture for easy integration
- **Caching Strategy**: Pre-calculated times for common coordinates to ensure fast response times
- **Real-time Calculation**: On-demand calculation for any coordinate, date, and method combination

#### 1.2.3 Key Benefits

**Accuracy Improvements:**
- **Precision**: ±30 seconds accuracy vs. ±2-4 minutes with district-based approach
- **Location-Specific**: Every coordinate gets its own calculated time
- **Consistency**: Same calculation method produces consistent results

**Accessibility:**
- **Universal Access**: Works for any location in Bangladesh, including remote areas
- **Digital Integration**: Easy to integrate into mobile apps, websites, and IoT devices
- **Multiple Formats**: JSON API responses suitable for various applications

**Flexibility:**
- **Multiple Methods**: Support for different Islamic calculation schools
- **Date Ranges**: Daily, monthly, and yearly calendar generation
- **Batch Processing**: Calculate times for multiple locations simultaneously

**Reliability:**
- **Standardized Calculations**: Based on established astronomical and Islamic calculation standards
- **Validation**: Cross-referenced with multiple authoritative sources
- **Scalability**: Designed to handle high-volume requests

### 1.3 Objectives

#### 1.3.1 Primary Objectives
- **Prayer Times Accuracy**: Provide accurate prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) based on exact coordinates
- **Sunrise/Sunset Precision**: Calculate precise sunrise and sunset times for any coordinate with astronomical accuracy
- **Fasting Times Calculation**: Calculate precise fasting start (Sehri) and end (Iftar) times based on Fajr and sunset
- **Multi-Method Support**: Support multiple Islamic calculation methods (Hanafi, Shafi, Maliki, Hanbali) with configurable parameters
- **Complete Coverage**: Cover all areas of Bangladesh (64 districts, 8 divisions) with coordinate-level precision
- **Calendar Generation**: Provide daily, monthly, and yearly calendars for any location

#### 1.3.2 Secondary Objectives
- **API Performance**: Achieve sub-200ms response times for single coordinate calculations
- **Scalability**: Support concurrent requests for multiple coordinates and batch operations
- **Integration Ease**: Provide well-documented RESTful API for easy integration
- **Data Accessibility**: Enable location search and coordinate lookup functionality
- **Future Extensibility**: Design architecture to support additional features (Qibla direction, moon sighting, etc.)

#### 1.3.3 Success Metrics
- **Accuracy**: ±1 minute accuracy for 99.9% of calculations
- **Coverage**: Support for all 64 districts and any coordinate within Bangladesh's boundaries
- **Performance**: API response time < 200ms for 95% of requests
- **Reliability**: 99.9% uptime availability
- **Adoption**: API integration by mobile apps, websites, and community organizations

### 1.4 Target Audience

#### 1.4.1 Primary Users
- **Muslims in Bangladesh**: Over 150 million people who need accurate prayer and fasting times
- **Mobile App Developers**: Developers creating Islamic apps for the Bangladeshi market
- **Mosque Administrations**: Mosques needing accurate times for announcements and displays
- **Community Organizations**: Islamic organizations providing community services

#### 1.4.2 Secondary Users
- **Web Developers**: Websites providing Islamic content and services
- **Smart Device Manufacturers**: IoT devices, smart speakers, and home automation systems
- **Calendar Publishers**: Organizations creating printed or digital Islamic calendars
- **Researchers**: Academics studying Islamic timekeeping and astronomical calculations

### 1.5 Scope and Limitations

#### 1.5.1 In Scope
- **Geographic Coverage**: All of Bangladesh (latitude: 20.738°N to 26.638°N, longitude: 88.084°E to 92.673°E)
- **Time Calculations**: Prayer times, sunrise, sunset, and fasting times
- **Calculation Methods**: Hanafi, Shafi, Maliki, Hanbali, and custom methods
- **Date Range**: Current year and future years (with historical data capability)
- **API Services**: RESTful API with standard endpoints
- **Data Formats**: JSON responses with standard time formats

#### 1.5.2 Out of Scope (Initial Version)
- **Qibla Direction**: Not included in initial release (planned for future)
- **Moon Sighting Integration**: Not included in initial release (planned for future)
- **Push Notifications**: Not included in initial release (planned for future)
- **Mobile Apps**: API only, no native mobile applications in initial release
- **Offline Functionality**: Requires internet connection (offline support planned for future)
- **International Coverage**: Focused on Bangladesh only (expansion possible in future)

#### 1.5.3 Known Limitations
- **Horizon Obstructions**: Calculations assume clear horizon; urban areas with tall buildings may need local adjustments
- **Altitude Effects**: Standard calculations assume sea level; high-altitude locations may need altitude corrections
- **Atmospheric Conditions**: Standard refraction corrections used; extreme weather conditions may cause minor variations
- **Time Zone**: All calculations use Bangladesh Standard Time (UTC+6); no daylight saving time support needed

### 1.6 Project Impact

#### 1.6.1 Religious Impact
- **Improved Observance**: Enables accurate fasting and prayer observance for millions of Muslims
- **Religious Compliance**: Helps ensure fasts and prayers are performed at correct times according to Islamic jurisprudence
- **Community Unity**: Provides consistent, accurate times that can be adopted across communities

#### 1.6.2 Social Impact
- **Accessibility**: Makes accurate timing information available to all, including remote areas
- **Education**: Helps educate communities about the importance of location-specific timing
- **Digital Inclusion**: Brings modern technology to support traditional religious practices

#### 1.6.3 Technical Impact
- **Innovation**: Introduces coordinate-based precision to Islamic timekeeping in Bangladesh
- **Standardization**: Establishes a standard API for Islamic time calculations
- **Open Architecture**: Enables innovation by third-party developers and organizations

---

## 2. Technical Requirements

### 2.1 Functional Requirements

#### 2.1.1 Core Calculation Requirements

**Prayer Times Calculation:**
- Calculate all five daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) based on exact coordinates
- Support date range from current date to at least 10 years in the future
- Handle leap years correctly (366-day years)
- Account for seasonal variations throughout the year
- **Input Requirements**: Latitude (-90° to +90°), Longitude (-180° to +180°), Date (ISO 8601 format), Calculation Method
- **Output Format**: Times in HH:MM format (24-hour) in Bangladesh Standard Time (BST)

**Sunrise and Sunset Calculation:**
- Calculate precise sunrise time (when upper edge of sun appears above horizon)
- Calculate precise sunset time (when upper edge of sun disappears below horizon)
- Account for atmospheric refraction (0.833° standard correction)
- Account for sun's angular radius (0.25°)
- Calculate solar noon (highest point of sun)
- **Accuracy Target**: ±30 seconds for standard conditions
- **Output Format**: Times in HH:MM format with optional seconds precision

**Fasting Times Calculation:**
- Calculate Sehri end time (Fajr time minus configurable safety margin, default 10 minutes)
- Calculate Iftar time (same as sunset/Maghrib time)
- Calculate fasting duration (time from Fajr to Iftar)
- Calculate day length (time from sunrise to sunset)
- **Safety Margin**: Configurable (5-15 minutes recommended, default 10 minutes)
- **Validation**: Ensure Sehri end time is always before Fajr time

**Day Length Calculation:**
- Calculate duration from sunrise to sunset in minutes and hours
- Provide human-readable format (hours and minutes)
- Account for seasonal variations (shortest day ~10.5 hours, longest day ~13.5 hours in Bangladesh)

**Multiple Calculation Methods:**
- Support Hanafi, Shafi, Maliki, and Hanbali methods
- Support custom method with user-defined Fajr and Isha angles
- Allow method-specific Asr calculations
- Store method parameters in configuration
- **Default Method**: Hanafi (most common in Bangladesh)

**Date Range Support:**
- Single date calculation (default: current date)
- Date range calculation (start date to end date)
- Monthly calendar generation (all days in a month)
- Yearly calendar generation (all days in a year)
- **Date Format**: ISO 8601 (YYYY-MM-DD)
- **Validation**: Reject invalid dates, handle leap years correctly

**Time Zone Handling:**
- All calculations use Bangladesh Standard Time (UTC+6)
- No daylight saving time support (Bangladesh does not observe DST)
- Convert all astronomical calculations to local time
- Account for longitude-based time corrections
- **Timezone Format**: ISO 8601 offset format (+06:00)

#### 2.1.2 API Endpoint Requirements

**Prayer Times Endpoint:**
- **Endpoint**: `GET /prayer-times`
- **Purpose**: Get all prayer times for a specific date and coordinate
- **Required Parameters**: latitude, longitude
- **Optional Parameters**: date (default: today), method (default: hanafi), timezone (default: +06:00)
- **Response**: JSON with all prayer times, sunrise, sunset, and metadata
- **Error Handling**: Validate coordinates, date format, and method

**Sunrise/Sunset Endpoint:**
- **Endpoint**: `GET /sun-times`
- **Purpose**: Get sunrise, sunset, solar noon, and day length
- **Required Parameters**: latitude, longitude
- **Optional Parameters**: date (default: today), timezone (default: +06:00)
- **Response**: JSON with sunrise, sunset, solar noon, day length
- **Use Cases**: General solar information, non-Islamic applications

**Fasting Times Endpoint:**
- **Endpoint**: `GET /fasting-times`
- **Purpose**: Get fasting-related times (Sehri, Fajr, Iftar, Maghrib)
- **Required Parameters**: latitude, longitude, date
- **Optional Parameters**: method (default: hanafi), sehri_margin (default: 10 minutes)
- **Response**: JSON with fasting times, durations, and day length
- **Special Features**: Configurable Sehri safety margin

**Monthly Calendar Endpoint:**
- **Endpoint**: `GET /calendar/monthly`
- **Purpose**: Get prayer and fasting times for all days in a month
- **Required Parameters**: latitude, longitude, year, month
- **Optional Parameters**: method (default: hanafi)
- **Response**: JSON array with daily prayer and fasting times
- **Optimization**: Batch calculation for performance

**Yearly Calendar Endpoint:**
- **Endpoint**: `GET /calendar/yearly`
- **Purpose**: Get prayer and fasting times for all days in a year
- **Required Parameters**: latitude, longitude, year
- **Optional Parameters**: method (default: hanafi), format (full/summary)
- **Response**: JSON with yearly calendar data
- **Format Options**: Full (all times) or Summary (key times only)

**Batch Calculation Endpoint:**
- **Endpoint**: `POST /batch/prayer-times`
- **Purpose**: Calculate times for multiple coordinates simultaneously
- **Request Body**: JSON array of coordinates with optional date and method
- **Response**: JSON array of results for each coordinate
- **Limits**: Maximum 100 coordinates per request (configurable)
- **Performance**: Parallel processing for efficiency

**Location Search Endpoint:**
- **Endpoint**: `GET /locations/search`
- **Purpose**: Search for locations by name and get coordinates
- **Required Parameters**: query (location name)
- **Optional Parameters**: limit (default: 10), district, division
- **Response**: JSON array of matching locations with coordinates
- **Features**: Fuzzy matching, district/division filtering

#### 2.1.3 Calculation Methods Support

**Hanafi Method:**
- **Fajr Angle**: 18° below horizon (configurable: 15° or 18° based on region)
- **Isha Angle**: 18° below horizon (configurable: 17° or 18° based on region)
- **Asr Calculation**: Shadow = object length + shadow at noon (Hanafi standard)
- **Regional Variations**: Support for northern (15° Fajr) and southern (18° Fajr) Bangladesh
- **Default for Bangladesh**: Most common method, used in most printed calendars

**Shafi Method:**
- **Fajr Angle**: 20° below horizon
- **Isha Angle**: 18° below horizon
- **Asr Calculation**: Shadow = object length + shadow at noon
- **Usage**: Common in some regions of Bangladesh

**Maliki Method:**
- **Fajr Angle**: 18° below horizon
- **Isha Angle**: 17° below horizon
- **Asr Calculation**: Shadow = object length + shadow at noon
- **Usage**: Less common in Bangladesh, included for completeness

**Hanbali Method:**
- **Fajr Angle**: 18° below horizon
- **Isha Angle**: 17° below horizon
- **Asr Calculation**: Shadow = object length + shadow at noon
- **Usage**: Less common in Bangladesh, included for completeness

**Custom Method:**
- **Configuration**: User-defined Fajr angle (typically 15°-20°)
- **Configuration**: User-defined Isha angle (typically 17°-18°)
- **Asr Calculation**: Standard shadow-based calculation
- **Use Case**: Special requirements, local mosque preferences, research

#### 2.1.4 Data Requirements

**Input Data Validation:**
- **Latitude**: Must be between -90° and +90°, validate for Bangladesh bounds (20.738°N to 26.638°N)
- **Longitude**: Must be between -180° and +180°, validate for Bangladesh bounds (88.084°E to 92.673°E)
- **Date**: Must be valid ISO 8601 date, reject past dates beyond reasonable range, handle leap years
- **Method**: Must be one of: hanafi, shafi, maliki, hanbali, custom
- **Custom Angles**: If custom method, validate Fajr angle (15°-20°) and Isha angle (17°-18°)

**Output Data Format:**
- **Time Format**: HH:MM (24-hour format) in Bangladesh Standard Time
- **Date Format**: ISO 8601 (YYYY-MM-DD)
- **JSON Structure**: Consistent structure across all endpoints
- **Timezone Information**: Include timezone in response metadata
- **Metadata**: Include calculation method, coordinate used, calculation timestamp

**Location Data:**
- **Coordinate Database**: Pre-populated database of major cities, districts, and landmarks
- **District Information**: All 64 districts with representative coordinates
- **Division Information**: All 8 divisions with representative coordinates
- **Search Functionality**: Fuzzy search for location names in Bengali and English

#### 2.1.5 Integration Requirements

**API Standards:**
- **RESTful Design**: Follow REST principles (GET for retrieval, POST for batch operations)
- **HTTP Methods**: Standard HTTP methods (GET, POST)
- **Status Codes**: Standard HTTP status codes (200, 400, 404, 429, 500)
- **Content Type**: JSON for requests and responses
- **API Versioning**: URL-based versioning (/v1/, /v2/)

**Authentication:**
- **API Keys**: Support API key authentication for rate limiting and usage tracking
- **Optional OAuth 2.0**: Support OAuth 2.0 for advanced integrations
- **Public Access**: Allow limited public access for basic queries
- **Rate Limiting**: Different limits for authenticated vs. unauthenticated users

**Documentation:**
- **OpenAPI/Swagger**: Complete API documentation in OpenAPI 3.0 format
- **Code Examples**: Examples in multiple languages (JavaScript, Python, PHP, Java)
- **Integration Guides**: Step-by-step guides for common use cases
- **Error Reference**: Complete error code and message reference

### 2.2 Non-Functional Requirements

#### 2.2.1 Performance Requirements

**Response Time:**
- **Single Coordinate Calculation**: < 200ms for 95% of requests (p50: < 100ms, p95: < 200ms, p99: < 500ms)
- **Cached Requests**: < 50ms for cached coordinate/date combinations
- **Batch Requests**: < 1 second per coordinate for batch operations (up to 100 coordinates)
- **Location Search**: < 300ms for search queries
- **Monthly Calendar**: < 2 seconds for full month calculation
- **Yearly Calendar**: < 10 seconds for full year calculation (summary format)

**Throughput:**
- **Concurrent Requests**: Support at least 1,000 concurrent requests
- **Requests Per Second**: Handle at least 10,000 requests per second (with caching)
- **Peak Load**: Handle 5x normal load during Ramadan period
- **Batch Processing**: Process up to 100 coordinates per batch request

**Caching Strategy:**
- **Coordinate Grid Cache**: Pre-calculate and cache times for 0.01° grid (popular areas)
- **Date Range Cache**: Cache full year for frequently requested coordinates
- **Cache Hit Rate Target**: > 80% cache hit rate for common requests
- **Cache TTL**: 1 year for pre-calculated times (astronomical data doesn't change)

#### 2.2.2 Accuracy Requirements

**Calculation Accuracy:**
- **Prayer Times**: ±1 minute accuracy for 99.9% of calculations
- **Sunrise/Sunset**: ±30 seconds accuracy for standard conditions
- **Coordinate Precision**: Support up to 6 decimal places (0.1 meter precision)
- **Validation**: Cross-validate with established prayer time tables and astronomical observatories

**Data Accuracy:**
- **Astronomical Formulas**: Use established formulas (NOAA, US Naval Observatory standards)
- **Refraction Correction**: Standard 0.833° correction for atmospheric refraction
- **Sun Radius**: Account for 0.25° angular radius
- **Equation of Time**: Accurate EoT calculation for date-specific corrections

**Edge Cases:**
- **Polar Regions**: Handle edge cases (though not applicable for Bangladesh)
- **Date Boundaries**: Correct handling of year boundaries, leap years
- **Extreme Coordinates**: Validate and handle coordinates at Bangladesh boundaries

#### 2.2.3 Scalability Requirements

**Horizontal Scaling:**
- **Stateless Design**: API should be stateless to enable horizontal scaling
- **Load Balancing**: Support multiple API server instances behind load balancer
- **Database Scaling**: Support read replicas for database queries
- **Cache Distribution**: Distributed caching (Redis cluster) for high availability

**Vertical Scaling:**
- **Resource Efficiency**: Optimize memory and CPU usage for cost-effective scaling
- **Database Optimization**: Efficient indexing and query optimization
- **Calculation Optimization**: Optimize astronomical calculations for performance

**Geographic Distribution:**
- **CDN Support**: Support CDN for static assets and documentation
- **Regional Deployment**: Potential for regional deployments if needed
- **Edge Caching**: Edge caching for popular coordinates

#### 2.2.4 Reliability Requirements

**Availability:**
- **Uptime Target**: 99.9% availability (less than 8.76 hours downtime per year)
- **Scheduled Maintenance**: Planned maintenance windows with advance notice
- **Failover**: Automatic failover for critical components
- **Health Checks**: Regular health check endpoints for monitoring

**Fault Tolerance:**
- **Database Failover**: Automatic failover to backup database
- **Cache Failover**: Graceful degradation if cache is unavailable
- **Error Handling**: Graceful error handling without exposing internal details
- **Retry Logic**: Support for client-side retry with exponential backoff

**Data Durability:**
- **Backup Strategy**: Daily automated backups of database
- **Backup Retention**: 30 days of backup retention
- **Disaster Recovery**: Recovery time objective (RTO) of 4 hours
- **Data Integrity**: Checksums and validation for data integrity

#### 2.2.5 Security Requirements

**API Security:**
- **HTTPS Only**: All API communication over HTTPS (TLS 1.2+)
- **Input Validation**: Strict input validation to prevent injection attacks
- **Rate Limiting**: Rate limiting to prevent abuse and DDoS attacks
- **CORS Policy**: Appropriate CORS policy for web applications

**Authentication Security:**
- **API Key Security**: Secure storage and transmission of API keys
- **Key Rotation**: Support for API key rotation
- **Access Control**: Role-based access control for different API tiers

**Data Security:**
- **Data Encryption**: Encryption at rest for sensitive data
- **Privacy**: No storage of personal information or user data
- **Logging**: Secure logging without exposing sensitive information

#### 2.2.6 Maintainability Requirements

**Code Quality:**
- **Code Standards**: Follow language-specific coding standards
- **Documentation**: Comprehensive code documentation and comments
- **Testing**: Unit tests, integration tests, and end-to-end tests
- **Code Review**: Mandatory code review process

**Monitoring and Logging:**
- **Application Monitoring**: APM tools for performance monitoring
- **Error Tracking**: Error tracking and alerting system
- **Logging**: Structured logging for debugging and analysis
- **Metrics**: Key performance metrics (response time, error rate, cache hit rate)

**Documentation:**
- **API Documentation**: Complete, up-to-date API documentation
- **Technical Documentation**: Technical architecture and design documents
- **Runbooks**: Operational runbooks for common tasks
- **Change Log**: Maintain change log for API versions

#### 2.2.7 Compliance Requirements

**Standards Compliance:**
- **Astronomical Standards**: Compliance with NOAA and US Naval Observatory standards
- **Islamic Standards**: Compliance with established Islamic calculation methods
- **API Standards**: RESTful API best practices
- **Data Formats**: Standard JSON, ISO 8601 date formats

**Regulatory Compliance:**
- **Data Protection**: Compliance with data protection regulations (if applicable)
- **Privacy**: No collection of personal data
- **Accessibility**: API accessible to all users without discrimination

#### 2.2.8 Usability Requirements

**API Usability:**
- **Intuitive Endpoints**: Clear, intuitive endpoint naming
- **Consistent Responses**: Consistent response structure across endpoints
- **Error Messages**: Clear, actionable error messages
- **Documentation**: Easy-to-understand documentation with examples

**Developer Experience:**
- **SDKs**: Optional SDKs for popular languages (JavaScript, Python, PHP)
- **Code Examples**: Comprehensive code examples
- **Sandbox Environment**: Test/sandbox environment for development
- **Support**: Developer support channels (documentation, email, community forum)

---

## 3. Astronomical Calculations

### 3.1 Solar Position Calculations

#### 3.1.1 Key Parameters

**Geographic Coordinates:**
- **Latitude (φ)**: North-south position measured in degrees
  - Range: -90° (South Pole) to +90° (North Pole)
  - Bangladesh range: 20.738°N to 26.638°N
  - Positive values for Northern Hemisphere (Bangladesh)
  - Precision: At least 6 decimal places (0.000001°) for accuracy
- **Longitude (λ)**: East-west position measured in degrees
  - Range: -180° (International Date Line West) to +180° (International Date Line East)
  - Bangladesh range: 88.084°E to 92.673°E
  - Positive values for Eastern Hemisphere (Bangladesh)
  - Precision: At least 6 decimal places (0.000001°) for accuracy

**Temporal Parameters:**
- **Date**: Gregorian calendar date (ISO 8601 format: YYYY-MM-DD)
  - Must handle leap years correctly (366 days in leap years)
  - Day of year (n): Sequential day number from 1 (January 1) to 365/366 (December 31)
- **Time Zone**: UTC+6 (Bangladesh Standard Time - BST)
  - No daylight saving time (Bangladesh does not observe DST)
  - Standard meridian: 90°E (15° × 6 = 90°)
  - All times converted to BST for consistency

**Coordinate Validation:**
- Validate latitude is within Bangladesh bounds: 20.738° ≤ φ ≤ 26.638°
- Validate longitude is within Bangladesh bounds: 88.084° ≤ λ ≤ 92.673°
- Reject coordinates outside Bangladesh for initial version (with clear error message)
- Handle edge cases at boundaries gracefully

#### 3.1.2 Solar Declination

**Definition:**
Solar declination (δ) is the angle between the rays of the sun and the plane of the Earth's equator. It varies throughout the year due to Earth's axial tilt of approximately 23.45°.

**Formula:**
```
δ = 23.45° × sin(360° × (284 + n) / 365.25)
```

**Parameters:**
- `δ`: Solar declination in degrees
- `n`: Day of the year (1 = January 1, 365/366 = December 31)
- `23.45°`: Earth's axial tilt (obliquity of the ecliptic)
- `284`: Offset to align with perihelion (closest approach to sun)
- `365.25`: Average length of year (accounts for leap years)

**Characteristics:**
- **Range**: -23.45° (winter solstice) to +23.45° (summer solstice)
- **Zero Crossing**: Equinoxes (around March 20 and September 22)
- **Maximum Positive**: Around June 21 (summer solstice in Northern Hemisphere)
- **Maximum Negative**: Around December 21 (winter solstice in Northern Hemisphere)

**Example Calculation:**
For March 15, 2024 (day 74 of non-leap year):
```
δ = 23.45° × sin(360° × (284 + 74) / 365.25)
δ = 23.45° × sin(360° × 358 / 365.25)
δ = 23.45° × sin(352.8°)
δ = 23.45° × (-0.102)
δ ≈ -2.39°
```

**Implementation Notes:**
- Use `365.25` instead of `365` to account for leap years more accurately
- Convert degrees to radians for trigonometric functions in most programming languages
- Store declination values for common dates to optimize performance
- Validate result is within expected range (-23.45° to +23.45°)

#### 3.1.3 Equation of Time

**Definition:**
The Equation of Time (EoT) accounts for the difference between apparent solar time (based on actual sun position) and mean solar time (based on average sun position). This difference occurs due to:
1. Earth's elliptical orbit (eccentricity effect)
2. Earth's axial tilt (obliquity effect)

**Formula:**
```
B = 360° × (n - 81) / 365.25
EoT = 9.87 × sin(2B) - 7.53 × cos(B) - 1.5 × sin(B)
```

**Parameters:**
- `EoT`: Equation of Time in minutes
- `B`: Intermediate calculation in degrees
- `n`: Day of the year
- `81`: Offset to align with perihelion
- Coefficients: Derived from orbital mechanics

**Characteristics:**
- **Range**: Approximately -16 to +16 minutes
- **Zero Crossing**: Four times per year (around April 15, June 13, September 1, December 25)
- **Maximum Positive**: Around November 3 (+16 minutes)
- **Maximum Negative**: Around February 11 (-14 minutes)

**Example Calculation:**
For March 15, 2024 (day 74):
```
B = 360° × (74 - 81) / 365.25
B = 360° × (-7) / 365.25
B ≈ -6.89°

EoT = 9.87 × sin(2 × -6.89°) - 7.53 × cos(-6.89°) - 1.5 × sin(-6.89°)
EoT = 9.87 × sin(-13.78°) - 7.53 × cos(-6.89°) - 1.5 × sin(-6.89°)
EoT = 9.87 × (-0.238) - 7.53 × (0.993) - 1.5 × (-0.120)
EoT ≈ -2.35 - 7.47 + 0.18
EoT ≈ -9.64 minutes
```

**Implementation Notes:**
- Result is in minutes; convert to hours for time calculations
- Negative EoT means apparent solar time is behind mean solar time
- Positive EoT means apparent solar time is ahead of mean solar time
- Use radians for trigonometric functions in most programming languages

#### 3.1.4 Hour Angle

**Definition:**
The hour angle (H) is the angular distance of the sun from the meridian (local noon). It measures how far the sun has moved from its highest point in the sky.

**Formula:**
```
H = arccos((sin(α) - sin(φ) × sin(δ)) / (cos(φ) × cos(δ)))
```

**Parameters:**
- `H`: Hour angle in degrees
- `α`: Solar altitude angle (angle of sun above/below horizon) in degrees
- `φ`: Latitude in degrees
- `δ`: Solar declination in degrees

**Characteristics:**
- **Range**: -180° to +180° (or 0° to 360° depending on convention)
- **At Solar Noon**: H = 0° (sun at highest point)
- **Morning**: Negative hour angles (before noon)
- **Afternoon**: Positive hour angles (after noon)
- **Sunrise/Sunset**: H = ±90° (approximately, depends on latitude and declination)

**Special Cases:**
- **Polar Day/Night**: When the formula results in values outside [-1, 1] for arccos, it indicates:
  - Polar day (sun never sets): Use H = 0° or handle specially
  - Polar night (sun never rises): Use H = 180° or handle specially
- **Bangladesh**: No polar day/night issues (too far from poles)

**Example Calculation:**
For Fajr at 18° below horizon in Dhaka (23.8103°N) on March 15, 2024:
- Latitude: φ = 23.8103°
- Declination: δ = -2.39° (from previous calculation)
- Altitude: α = -18° (18° below horizon)

```
H = arccos((sin(-18°) - sin(23.8103°) × sin(-2.39°)) / (cos(23.8103°) × cos(-2.39°)))
H = arccos((sin(-18°) - sin(23.8103°) × sin(-2.39°)) / (cos(23.8103°) × cos(-2.39°)))
H = arccos((-0.309 - 0.404 × (-0.042)) / (0.915 × 0.999))
H = arccos((-0.309 + 0.017) / 0.914)
H = arccos(-0.292 / 0.914)
H = arccos(-0.319)
H ≈ 108.6°
```

**Time Conversion:**
Hour angle to time:
```
Time from Solar Noon = H / 15° (hours)
```
(15° per hour because Earth rotates 360° in 24 hours)

**Implementation Notes:**
- Validate input to arccos is within [-1, 1] range
- Handle edge cases where sun never rises or sets (not applicable for Bangladesh)
- Use radians for trigonometric functions
- Result in degrees; convert to hours by dividing by 15
- Handle negative hour angles correctly (before noon)

#### 3.1.5 Solar Noon Calculation

**Definition:**
Solar noon is the moment when the sun reaches its highest point in the sky for a given location. This is when the sun crosses the local meridian.

**Formula:**
```
Solar Noon = 12:00 + (4 × (λ - λ_std)) / 60 + EoT
```

**Parameters:**
- `λ`: Longitude of location in degrees
- `λ_std`: Standard meridian for time zone (90°E for Bangladesh)
- `EoT`: Equation of Time in minutes
- `4`: Minutes per degree of longitude (60 minutes / 15 degrees per hour)

**Explanation:**
- **Longitude Correction**: Each degree of longitude represents 4 minutes of time difference
  - Locations east of standard meridian: add time
  - Locations west of standard meridian: subtract time
- **Equation of Time**: Adjusts for Earth's orbital eccentricity and axial tilt

**Example Calculation:**
For Dhaka (90.4125°E) on March 15, 2024:
- Longitude: λ = 90.4125°
- Standard meridian: λ_std = 90°E
- EoT: -9.64 minutes (from previous calculation)

```
Longitude Correction = 4 × (90.4125 - 90) / 60
Longitude Correction = 4 × 0.4125 / 60
Longitude Correction = 1.65 / 60
Longitude Correction ≈ 0.0275 hours = 1.65 minutes

Solar Noon = 12:00 + 1.65 minutes + (-9.64 minutes)
Solar Noon = 12:00 - 7.99 minutes
Solar Noon ≈ 11:52:00
```

**Implementation Notes:**
- Convert all components to same time unit (minutes or hours)
- Add longitude correction (positive for east, negative for west)
- Add EoT (can be positive or negative)
- Result is in local mean solar time; convert to standard time if needed

### 3.2 Prayer Time Calculations

#### 3.2.1 Fajr (Dawn Prayer)

**Definition:**
Fajr is the dawn prayer, performed before sunrise when there is enough light to distinguish between a white thread and a black thread. It begins when the sun is at a specific angle below the horizon, indicating the start of true dawn (al-fajr al-sadiq).

**Calculation Method:**
```
1. Determine Fajr angle (α_fajr) based on calculation method:
   - Hanafi: -18° (or -15° in some regions)
   - Shafi: -20°
   - Maliki: -18°
   - Hanbali: -18°

2. Calculate hour angle for Fajr:
   H_fajr = arccos((sin(α_fajr) - sin(φ) × sin(δ)) / (cos(φ) × cos(δ)))

3. Convert hour angle to time:
   Time from Solar Noon = H_fajr / 15° (hours)

4. Calculate Fajr time:
   Fajr Time = Solar Noon - (H_fajr / 15°)
```

**Method-Specific Parameters:**

**Hanafi Method:**
- **Standard Angle**: -18° below horizon
- **Regional Variations**:
  - Northern Bangladesh: -15° (more conservative, earlier Fajr)
  - Southern Bangladesh: -18° (standard)
- **Rationale**: Based on traditional Hanafi jurisprudence
- **Implementation**: Allow configuration for regional preference

**Shafi Method:**
- **Angle**: -20° below horizon
- **Rationale**: More conservative approach, earlier Fajr time
- **Usage**: Common in some regions of Bangladesh

**Example Calculation:**
For Dhaka (23.8103°N, 90.4125°E) on March 15, 2024, using Hanafi method (-18°):
- Latitude: φ = 23.8103°
- Declination: δ = -2.39°
- Fajr angle: α_fajr = -18°
- Solar Noon: 11:52:00 (from previous calculation)

```
H_fajr = arccos((sin(-18°) - sin(23.8103°) × sin(-2.39°)) / (cos(23.8103°) × cos(-2.39°)))
H_fajr = arccos((-0.309 - 0.404 × (-0.042)) / (0.915 × 0.999))
H_fajr = arccos(-0.319)
H_fajr ≈ 108.6°

Time from Solar Noon = 108.6° / 15° = 7.24 hours = 7 hours 14.4 minutes

Fajr Time = 11:52:00 - 7:14:24
Fajr Time = 04:37:36 ≈ 04:38
```

**Implementation Notes:**
- Handle cases where arccos result is undefined (should not occur for Bangladesh)
- Round to nearest minute for display (or keep seconds for precision)
- Validate Fajr time is before sunrise
- Store method-specific angles in configuration

#### 3.2.2 Dhuhr (Midday Prayer)

**Definition:**
Dhuhr is the midday prayer, performed when the sun has passed its highest point (zenith) and begins to decline. It is the easiest prayer time to calculate as it occurs at solar noon.

**Calculation Method:**
```
Dhuhr Time = Solar Noon
Dhuhr Time = 12:00 + (4 × (λ - λ_std)) / 60 + EoT
```

**Parameters:**
- `λ`: Longitude of location
- `λ_std`: Standard meridian (90°E for Bangladesh)
- `EoT`: Equation of Time in minutes

**Characteristics:**
- **Simplest Calculation**: Directly related to solar noon
- **No Angle Dependency**: Not dependent on calculation method
- **Longitude Dependent**: Varies with longitude within time zone
- **Seasonal Variation**: Varies slightly due to Equation of Time

**Example Calculation:**
For Dhaka (90.4125°E) on March 15, 2024:
- Longitude correction: +1.65 minutes
- EoT: -9.64 minutes

```
Dhuhr Time = 12:00 + 1.65 - 9.64
Dhuhr Time = 12:00 - 7.99
Dhuhr Time ≈ 11:52:00
```

**Implementation Notes:**
- Dhuhr is the same as solar noon
- No method-specific variations
- Simplest prayer time to calculate
- Can be used as reference point for other calculations

#### 3.2.3 Asr (Afternoon Prayer)

**Definition:**
Asr is the afternoon prayer, performed when the shadow of an object equals the object's length plus the shadow length at noon. This occurs when the sun has declined sufficiently in the afternoon.

**Calculation Method:**

**Step 1: Calculate Shadow Factor**
```
Shadow Factor (k) depends on method:
- Hanafi: k = 1 (shadow = object + shadow at noon)
- Shafi: k = 1 (shadow = object + shadow at noon)
- Maliki: k = 1 (shadow = object + shadow at noon)
- Hanbali: k = 1 (shadow = object + shadow at noon)

Note: Some sources use k = 2 for Hanafi (shadow = 2 × object), but k = 1 is more common in Bangladesh.
```

**Step 2: Calculate Solar Altitude for Asr**
```
tan(α_asr) = (1 + k) / (cot(δ) + tan(φ - δ))

For k = 1:
tan(α_asr) = 2 / (cot(δ) + tan(φ - δ))

Or using alternative formula:
α_asr = arctan(1 / (1 + tan(φ - δ)))
```

**Step 3: Calculate Hour Angle for Asr**
```
H_asr = arccos((sin(α_asr) - sin(φ) × sin(δ)) / (cos(φ) × cos(δ)))
```

**Step 4: Calculate Asr Time**
```
Asr Time = Solar Noon + (H_asr / 15°)
```

**Method-Specific Considerations:**

**Hanafi Method:**
- **Shadow Factor**: Typically k = 1 (shadow = object + shadow at noon)
- **Alternative**: Some use k = 2 (shadow = 2 × object length)
- **Implementation**: Support both options, default to k = 1

**Other Methods:**
- Shafi, Maliki, Hanbali: Generally use k = 1
- Calculation is method-independent for standard k = 1

**Example Calculation:**
For Dhaka (23.8103°N) on March 15, 2024:
- Latitude: φ = 23.8103°
- Declination: δ = -2.39°
- Shadow factor: k = 1

```
tan(α_asr) = 2 / (cot(-2.39°) + tan(23.8103° - (-2.39°)))
tan(α_asr) = 2 / (cot(-2.39°) + tan(26.20°))
tan(α_asr) = 2 / (-23.95 + 0.492)
tan(α_asr) = 2 / (-23.46)
α_asr ≈ arctan(-0.085)
α_asr ≈ -4.86°

H_asr = arccos((sin(-4.86°) - sin(23.8103°) × sin(-2.39°)) / (cos(23.8103°) × cos(-2.39°)))
H_asr ≈ 63.2°

Time from Solar Noon = 63.2° / 15° = 4.21 hours = 4 hours 12.6 minutes

Asr Time = 11:52:00 + 4:12:36
Asr Time ≈ 16:04:36 ≈ 16:05
```

**Implementation Notes:**
- Asr calculation is more complex than other prayers
- Validate Asr time is between Dhuhr and Maghrib
- Handle edge cases for high latitudes (not applicable for Bangladesh)
- Consider alternative formulas if primary formula fails

#### 3.2.4 Maghrib (Sunset Prayer)

**Definition:**
Maghrib is the sunset prayer, performed immediately after sunset when the sun's upper edge disappears below the horizon. It is time-critical and must be performed promptly.

**Calculation Method:**
```
1. Calculate hour angle for sunset (0.833° below horizon):
   H_maghrib = arccos((sin(-0.833°) - sin(φ) × sin(δ)) / (cos(φ) × cos(δ)))

2. Convert hour angle to time:
   Time from Solar Noon = H_maghrib / 15° (hours)

3. Calculate Maghrib time:
   Maghrib Time = Solar Noon + (H_maghrib / 15°)
```

**Sunset Angle (-0.833°):**
The -0.833° angle accounts for:
- **Sun's Angular Radius**: ~0.25° (half of sun's diameter)
- **Atmospheric Refraction**: ~0.583° (bending of light through atmosphere)
- **Total Correction**: 0.25° + 0.583° = 0.833°

**Characteristics:**
- **Method Independent**: Same calculation for all Islamic schools
- **Critical Timing**: Must be accurate for Iftar (breaking fast)
- **Same as Sunset**: Maghrib time equals sunset time
- **Daily Variation**: Changes throughout the year

**Example Calculation:**
For Dhaka (23.8103°N) on March 15, 2024:
- Latitude: φ = 23.8103°
- Declination: δ = -2.39°
- Sunset angle: α_sunset = -0.833°
- Solar Noon: 11:52:00

```
H_maghrib = arccos((sin(-0.833°) - sin(23.8103°) × sin(-2.39°)) / (cos(23.8103°) × cos(-2.39°)))
H_maghrib = arccos((-0.0145 - 0.404 × (-0.042)) / (0.915 × 0.999))
H_maghrib = arccos(0.0025 / 0.914)
H_maghrib = arccos(0.0027)
H_maghrib ≈ 89.84°

Time from Solar Noon = 89.84° / 15° = 5.99 hours = 5 hours 59.4 minutes

Maghrib Time = 11:52:00 + 5:59:24
Maghrib Time ≈ 17:51:24 ≈ 17:51
```

**Implementation Notes:**
- Maghrib is critical for Iftar timing
- Must validate Maghrib is after Dhuhr and Asr
- Same calculation as sunset (see Section 3.3.2)
- Round appropriately for display (typically to nearest minute)

#### 3.2.5 Isha (Night Prayer)

**Definition:**
Isha is the night prayer, performed after the twilight has completely disappeared. It begins when the sun is at a specific angle below the horizon, indicating the end of twilight.

**Calculation Method:**
```
1. Determine Isha angle (α_isha) based on calculation method:
   - Hanafi: -18° (or -17° in some regions)
   - Shafi: -18°
   - Maliki: -17°
   - Hanbali: -17°

2. Calculate hour angle for Isha:
   H_isha = arccos((sin(α_isha) - sin(φ) × sin(δ)) / (cos(φ) × cos(δ)))

3. Convert hour angle to time:
   Time from Solar Noon = H_isha / 15° (hours)

4. Calculate Isha time:
   Isha Time = Solar Noon + (H_isha / 15°)
```

**Method-Specific Parameters:**

**Hanafi Method:**
- **Standard Angle**: -18° below horizon
- **Regional Variations**: Some regions use -17°
- **Rationale**: Based on traditional Hanafi jurisprudence
- **Implementation**: Allow configuration for regional preference

**Shafi Method:**
- **Angle**: -18° below horizon
- **Rationale**: Standard Shafi calculation

**Maliki and Hanbali Methods:**
- **Angle**: -17° below horizon
- **Rationale**: Slightly earlier Isha time

**Example Calculation:**
For Dhaka (23.8103°N) on March 15, 2024, using Hanafi method (-18°):
- Latitude: φ = 23.8103°
- Declination: δ = -2.39°
- Isha angle: α_isha = -18°
- Solar Noon: 11:52:00

```
H_isha = arccos((sin(-18°) - sin(23.8103°) × sin(-2.39°)) / (cos(23.8103°) × cos(-2.39°)))
H_isha = arccos(-0.319)
H_isha ≈ 108.6°

Time from Solar Noon = 108.6° / 15° = 7.24 hours = 7 hours 14.4 minutes

Isha Time = 11:52:00 + 7:14:24
Isha Time = 19:06:24 ≈ 19:06
```

**Implementation Notes:**
- Similar calculation to Fajr but after sunset
- Validate Isha time is after Maghrib
- Handle method-specific angle variations
- Store method-specific angles in configuration

### 3.3 Sunrise and Sunset Calculations

#### 3.3.1 Sunrise

**Definition:**
Sunrise is the moment when the upper edge of the sun's disk first appears above the horizon. This is the astronomical definition used for precise calculations.

**Astronomical Components:**
The -0.833° angle below horizon accounts for:
- **Sun's Angular Radius**: ~0.25° (half of sun's apparent diameter)
- **Atmospheric Refraction**: ~0.583° (bending of light through Earth's atmosphere)
- **Total Correction**: 0.25° + 0.583° = 0.833°

**Calculation Method:**
```
1. Calculate hour angle for sunrise:
   H_sunrise = arccos((sin(-0.833°) - sin(φ) × sin(δ)) / (cos(φ) × cos(δ)))

2. Convert hour angle to time:
   Time from Solar Noon = H_sunrise / 15° (hours)

3. Calculate sunrise time:
   Sunrise Time = Solar Noon - (H_sunrise / 15°)
```

**Local Time Conversion:**
The calculation already accounts for:
- Longitude correction (built into solar noon)
- Equation of Time (built into solar noon)
- Time zone offset (applied when converting to BST)

**Example Calculation:**
For Dhaka (23.8103°N, 90.4125°E) on March 15, 2024:
- Latitude: φ = 23.8103°
- Declination: δ = -2.39°
- Solar Noon: 11:52:00

```
H_sunrise = arccos((sin(-0.833°) - sin(23.8103°) × sin(-2.39°)) / (cos(23.8103°) × cos(-2.39°)))
H_sunrise = arccos((-0.0145 - 0.404 × (-0.042)) / (0.915 × 0.999))
H_sunrise = arccos(0.0027)
H_sunrise ≈ 89.84°

Time from Solar Noon = 89.84° / 15° = 5.99 hours = 5 hours 59.4 minutes

Sunrise Time = 11:52:00 - 5:59:24
Sunrise Time ≈ 05:52:36 ≈ 05:53
```

**Precision and Accuracy:**
- **Standard Conditions**: ±30 seconds accuracy
- **Factors Affecting Accuracy**:
  - Horizon obstruction (buildings, mountains)
  - Atmospheric conditions (extreme weather)
  - Altitude (higher elevations may need adjustment)
- **Validation**: Compare with established sunrise tables

**Implementation Notes:**
- Sunrise calculation is identical to sunset but before solar noon
- Validate sunrise is before solar noon
- Validate sunrise is after Fajr (should always be true)
- Round to nearest minute for display

#### 3.3.2 Sunset

**Definition:**
Sunset is the moment when the upper edge of the sun's disk disappears below the horizon. This is critical for Iftar (breaking fast) timing.

**Astronomical Components:**
Same as sunrise:
- **Sun's Angular Radius**: ~0.25°
- **Atmospheric Refraction**: ~0.583°
- **Total Correction**: 0.833° below horizon

**Calculation Method:**
```
1. Calculate hour angle for sunset:
   H_sunset = arccos((sin(-0.833°) - sin(φ) × sin(δ)) / (cos(φ) × cos(δ)))

2. Convert hour angle to time:
   Time from Solar Noon = H_sunset / 15° (hours)

3. Calculate sunset time:
   Sunset Time = Solar Noon + (H_sunset / 15°)
```

**Relationship to Maghrib:**
- **Maghrib Prayer**: Performed immediately after sunset
- **Timing**: Maghrib time = Sunset time (same calculation)
- **Iftar Timing**: Iftar (breaking fast) occurs at sunset/Maghrib time
- **Critical Importance**: Must be accurate for religious observance

**Example Calculation:**
For Dhaka (23.8103°N, 90.4125°E) on March 15, 2024:
- Latitude: φ = 23.8103°
- Declination: δ = -2.39°
- Solar Noon: 11:52:00

```
H_sunset = arccos((sin(-0.833°) - sin(23.8103°) × sin(-2.39°)) / (cos(23.8103°) × cos(-2.39°)))
H_sunset = arccos(0.0027)
H_sunset ≈ 89.84°

Time from Solar Noon = 89.84° / 15° = 5.99 hours = 5 hours 59.4 minutes

Sunset Time = 11:52:00 + 5:59:24
Sunset Time ≈ 17:51:24 ≈ 17:51
```

**Precision and Accuracy:**
- **Standard Conditions**: ±30 seconds accuracy
- **Critical for Iftar**: Must be precise for breaking fast
- **Validation**: Cross-check with Maghrib calculation (should be identical)

**Implementation Notes:**
- Sunset calculation is identical to Maghrib
- Validate sunset is after solar noon
- Validate sunset is after Dhuhr and Asr
- Critical timing - must be accurate
- Round appropriately for display

#### 3.3.3 Day Length Calculation

**Definition:**
Day length is the duration from sunrise to sunset, representing the time the sun is above the horizon.

**Calculation Method:**
```
Day Length = Sunset Time - Sunrise Time
```

**Conversion to Minutes and Hours:**
```
Day Length (minutes) = (Sunset Time - Sunrise Time) × 60
Day Length (hours) = Day Length (minutes) / 60
```

**Seasonal Variation:**
Day length varies throughout the year due to Earth's axial tilt and orbital position:

**For Bangladesh (approximately 24°N):**
- **Summer Solstice** (around June 21):
  - Longest day: ~13.5 hours (~810 minutes)
  - Shortest night: ~10.5 hours
- **Winter Solstice** (around December 21):
  - Shortest day: ~10.5 hours (~630 minutes)
  - Longest night: ~13.5 hours
- **Equinoxes** (around March 20 and September 22):
  - Approximately 12 hours day and night

**Example Calculation:**
For Dhaka on March 15, 2024:
- Sunrise: 05:53
- Sunset: 17:51

```
Day Length = 17:51 - 05:53
Day Length = 11 hours 58 minutes
Day Length = 718 minutes
Day Length = 11.97 hours
```

**Use Cases:**
- General solar information
- Agricultural planning
- Energy calculations
- Understanding seasonal variations

**Implementation Notes:**
- Simple subtraction of times
- Handle time crossing midnight (not applicable for day length)
- Provide in multiple formats (hours, minutes, human-readable)
- Validate day length is positive and reasonable (10-14 hours for Bangladesh)

#### 3.3.4 Solar Noon (Detailed)

**Definition:**
Solar noon is when the sun reaches its highest point in the sky for a given location. It occurs when the sun crosses the local meridian.

**Calculation Method:**
```
Solar Noon = 12:00 + Longitude Correction + EoT
```

**Components:**

**1. Longitude Correction:**
```
Longitude Correction = 4 × (λ - λ_std) / 60 (hours)
```
- `λ`: Location longitude
- `λ_std`: Standard meridian (90°E for Bangladesh)
- `4`: Minutes per degree (60 minutes / 15 degrees per hour)

**2. Equation of Time (EoT):**
- Accounts for Earth's orbital eccentricity and axial tilt
- Can be positive or negative
- Varies throughout the year

**Example Calculation:**
For Dhaka (90.4125°E) on March 15, 2024:
- Longitude: λ = 90.4125°
- Standard meridian: λ_std = 90°E
- EoT: -9.64 minutes

```
Longitude Correction = 4 × (90.4125 - 90) / 60
Longitude Correction = 4 × 0.4125 / 60
Longitude Correction = 1.65 / 60
Longitude Correction = 0.0275 hours = 1.65 minutes

Solar Noon = 12:00 + 1.65 minutes + (-9.64 minutes)
Solar Noon = 12:00 - 7.99 minutes
Solar Noon = 11:52:00
```

**Characteristics:**
- **Reference Point**: Used as reference for all other prayer times
- **Longitude Dependent**: Varies with longitude within time zone
- **Seasonal Variation**: Varies slightly due to EoT
- **Same as Dhuhr**: Dhuhr prayer time equals solar noon

**Implementation Notes:**
- Solar noon is the foundation for all other calculations
- Calculate once per location/date combination
- Store for reuse in other calculations
- Validate is reasonable (around 12:00, typically 11:45-12:15 for Bangladesh)

### 3.4 Fasting Times (Saom)

#### 3.4.1 Sehri (Pre-Dawn Meal)

**Definition:**
Sehri (also spelled Suhoor) is the pre-dawn meal consumed before beginning the fast. It must be completed before Fajr time begins. The Sehri end time is the last moment when one can eat or drink before the fast begins.

**Calculation Method:**
```
Sehri End Time = Fajr Time - Safety Margin
```

**Safety Margin:**
The safety margin ensures that eating is completed before Fajr begins, accounting for:
- **Eating Time**: Time needed to finish eating
- **Digestion**: Time for food/drink to be swallowed
- **Religious Requirement**: Must complete eating before Fajr time
- **Recommended Margin**: 10 minutes (default)
- **Configurable Range**: 5-15 minutes (user configurable)

**Calculation Steps:**
```
1. Calculate Fajr time (see Section 3.2.1)

2. Apply safety margin:
   Sehri End Time = Fajr Time - Safety Margin

3. Validate:
   - Sehri End Time < Fajr Time (must be true)
   - Sehri End Time < Sunrise Time (should be true)
```

**Example Calculation:**
For Dhaka on March 15, 2024, using Hanafi method:
- Fajr Time: 04:38
- Safety Margin: 10 minutes (default)

```
Sehri End Time = 04:38 - 10 minutes
Sehri End Time = 04:28
```

**Religious Significance:**
- **Critical Timing**: Eating after Fajr invalidates the fast
- **Safety First**: Better to finish early than risk invalidating fast
- **Community Practice**: Standard practice in Bangladesh is 10-minute margin

**Implementation Notes:**
- Safety margin is configurable (default: 10 minutes)
- Validate Sehri end time is before Fajr
- Provide clear indication that this is the last time to eat
- Consider local customs and recommendations

#### 3.4.2 Iftar (Breaking Fast)

**Definition:**
Iftar is the time to break the fast at sunset. It occurs exactly when the sun's upper edge disappears below the horizon, which is the same as Maghrib prayer time.

**Calculation Method:**
```
Iftar Time = Sunset Time = Maghrib Time
```

**Relationship to Sunset:**
- **Identical Timing**: Iftar occurs at the exact moment of sunset
- **Same as Maghrib**: Maghrib prayer time equals sunset time
- **Critical Accuracy**: Must be precise - breaking fast too early invalidates the day's fast
- **Coordinate Dependent**: Exact timing varies with coordinates

**Calculation Steps:**
```
1. Calculate sunset time (see Section 3.3.2)
   OR
   Calculate Maghrib time (see Section 3.2.4)

2. Iftar Time = Sunset Time (or Maghrib Time)
```

**Example Calculation:**
For Dhaka on March 15, 2024:
- Sunset Time: 17:51
- Maghrib Time: 17:51

```
Iftar Time = 17:51
```

**Religious Significance:**
- **Critical Timing**: Breaking fast before sunset invalidates the fast
- **Exact Moment**: Should occur at exact sunset time
- **Community Practice**: Typically announced at mosques at Maghrib time

**Implementation Notes:**
- Iftar time is identical to sunset/Maghrib time
- No safety margin needed (unlike Sehri)
- Critical to use accurate coordinate-based calculation
- Validate Iftar is after Fajr (should always be true)

#### 3.4.3 Fasting Duration

**Definition:**
Fasting duration is the total time from Fajr (start of fast) to Iftar (end of fast). This represents the actual time one abstains from food and drink.

**Calculation Method:**
```
Fasting Duration = Iftar Time - Fajr Time
```

**Conversion to Minutes:**
```
Fasting Duration (minutes) = (Iftar Time - Fajr Time) × 60
```

**Example Calculation:**
For Dhaka on March 15, 2024:
- Fajr Time: 04:38
- Iftar Time: 17:51

```
Fasting Duration = 17:51 - 04:38
Fasting Duration = 13 hours 13 minutes
Fasting Duration = 793 minutes
```

**Seasonal Variation:**
Fasting duration varies throughout the year:
- **Longest Fast**: During summer (around June) - ~15-16 hours
- **Shortest Fast**: During winter (around December) - ~11-12 hours
- **Ramadan Variation**: Depends on which month Ramadan falls in the Gregorian calendar

**For Bangladesh:**
- **Summer Ramadan**: ~15-16 hours fasting
- **Winter Ramadan**: ~11-12 hours fasting
- **Spring/Autumn Ramadan**: ~13-14 hours fasting

**Implementation Notes:**
- Simple time difference calculation
- Provide in multiple formats (hours:minutes, total minutes)
- Validate duration is positive and reasonable (10-17 hours for Bangladesh)
- Useful for planning and information purposes

#### 3.4.4 Complete Fasting Schedule

**Complete Daily Fasting Schedule:**
For a given date and location, the complete fasting schedule includes:

1. **Sehri End Time**: Last time to eat (Fajr - safety margin)
2. **Fajr Time**: Start of fast (dawn prayer time)
3. **Sunrise Time**: When sun appears (informational)
4. **Sunset Time**: When sun disappears (same as Iftar)
5. **Iftar Time**: Time to break fast (same as sunset/Maghrib)
6. **Maghrib Time**: Sunset prayer (same as Iftar)
7. **Fasting Duration**: Total time from Fajr to Iftar
8. **Day Length**: Time from sunrise to sunset (informational)

**Example Complete Schedule:**
For Dhaka on March 15, 2024 (Hanafi method, 10-minute Sehri margin):
```
Sehri End:     04:28  (Last time to eat)
Fajr:          04:38  (Start of fast)
Sunrise:       05:53  (Sun appears)
Sunset:        17:51  (Sun disappears)
Iftar:          17:51  (Break fast)
Maghrib:        17:51  (Sunset prayer)
Fasting Duration: 13 hours 13 minutes (793 minutes)
Day Length:     11 hours 58 minutes (718 minutes)
```

**Implementation Notes:**
- Provide all times in consistent format
- Include both prayer times and fasting-specific times
- Clearly indicate which times are critical for fasting
- Provide duration calculations for planning

### 3.5 Calculation Validation and Error Handling

#### 3.5.1 Input Validation

**Coordinate Validation:**
```
- Latitude: Must be between -90° and +90°
- Longitude: Must be between -180° and +180°
- Bangladesh Bounds:
  - Latitude: 20.738°N ≤ φ ≤ 26.638°N
  - Longitude: 88.084°E ≤ λ ≤ 92.673°E
- Precision: Accept at least 6 decimal places
- Reject: Coordinates outside Bangladesh (with clear error message)
```

**Date Validation:**
```
- Format: ISO 8601 (YYYY-MM-DD)
- Range: Current date to 10 years in future (configurable)
- Leap Years: Handle correctly (366 days)
- Invalid Dates: Reject (e.g., February 30)
- Past Dates: Allow for historical calculations (optional)
```

**Method Validation:**
```
- Valid Methods: hanafi, shafi, maliki, hanbali, custom
- Custom Method: Require fajr_angle and isha_angle parameters
- Angle Validation: Fajr angle 15°-20°, Isha angle 17°-18°
- Default: hanafi if not specified
```

#### 3.5.2 Calculation Validation

**Mathematical Validation:**
```
- Hour Angle: Validate arccos input is within [-1, 1]
- Edge Cases: Handle polar day/night (not applicable for Bangladesh)
- Division by Zero: Check cos(φ) × cos(δ) ≠ 0
- Invalid Results: Flag and handle gracefully
```

**Time Sequence Validation:**
```
Prayer times must follow this sequence:
1. Fajr < Sunrise < Dhuhr < Asr < Maghrib < Isha

Fasting times must follow this sequence:
1. Sehri End < Fajr < Sunrise < Sunset (Iftar) < Isha

Validation checks:
- Fajr before Sunrise (should always be true)
- Dhuhr between Sunrise and Sunset
- Asr between Dhuhr and Maghrib
- Maghrib before Isha
- Sehri End before Fajr
```

**Range Validation:**
```
Reasonable time ranges for Bangladesh:
- Fajr: 03:30 - 05:30 (varies by season)
- Sunrise: 05:00 - 06:30
- Dhuhr: 11:30 - 12:30
- Asr: 14:30 - 17:00
- Maghrib: 17:00 - 19:00
- Isha: 18:00 - 20:00

Flag times outside these ranges for review
```

#### 3.5.3 Error Handling

**Calculation Errors:**
```
- Invalid Input: Return 400 Bad Request with clear error message
- Calculation Failure: Return 500 Internal Server Error with error details
- Edge Cases: Handle gracefully with appropriate warnings
- Logging: Log all errors for debugging and monitoring
```

**Common Error Scenarios:**
```
1. Coordinates outside Bangladesh:
   Error: "Coordinates outside Bangladesh bounds"

2. Invalid date format:
   Error: "Invalid date format. Use YYYY-MM-DD"

3. Invalid calculation method:
   Error: "Invalid method. Use: hanafi, shafi, maliki, hanbali"

4. Mathematical error (e.g., arccos domain):
   Error: "Calculation error. Please verify coordinates"

5. Time sequence violation:
   Warning: "Time sequence validation failed. Review calculation"
```

#### 3.5.4 Precision and Rounding

**Calculation Precision:**
```
- Internal Calculations: Use high precision (at least 6 decimal places)
- Intermediate Values: Keep full precision during calculations
- Final Results: Round to nearest minute for display
- Seconds: Optional seconds precision for advanced use cases
```

**Rounding Rules:**
```
- Standard Display: Round to nearest minute (HH:MM format)
- Seconds Precision: Optional (HH:MM:SS format)
- Rounding Method: Standard rounding (0.5 rounds up)
- Consistency: Apply same rounding to all times
```

**Example:**
```
Calculated Fajr: 04:37:36
Rounded Fajr: 04:38 (standard)
Precise Fajr: 04:37:36 (if seconds requested)
```

### 3.6 Implementation Algorithm

#### 3.6.1 Complete Calculation Flow

**Step-by-Step Algorithm:**
```
1. Validate Inputs
   - Validate coordinates (latitude, longitude)
   - Validate date
   - Validate method
   - Return error if validation fails

2. Calculate Base Parameters
   - Calculate day of year (n)
   - Calculate solar declination (δ)
   - Calculate equation of time (EoT)
   - Calculate solar noon

3. Calculate Prayer Times
   - Calculate Fajr (based on method angle)
   - Calculate Sunrise
   - Calculate Dhuhr (same as solar noon)
   - Calculate Asr (based on shadow calculation)
   - Calculate Maghrib (sunset)
   - Calculate Isha (based on method angle)

4. Calculate Fasting Times
   - Calculate Sehri End (Fajr - safety margin)
   - Calculate Iftar (same as Maghrib/Sunset)
   - Calculate Fasting Duration
   - Calculate Day Length

5. Validate Results
   - Validate time sequence
   - Validate time ranges
   - Flag any anomalies

6. Format and Return
   - Round to appropriate precision
   - Format as HH:MM or HH:MM:SS
   - Return JSON response
```

#### 3.6.2 Optimization Strategies

**Caching:**
```
- Pre-calculate common coordinates
- Cache solar declination by day of year
- Cache equation of time by day of year
- Cache full year for popular coordinates
```

**Performance:**
```
- Calculate solar noon once, reuse for all prayers
- Reuse hour angle calculations where possible
- Batch calculations for multiple dates
- Parallel processing for batch requests
```

**Accuracy:**
```
- Use high-precision arithmetic
- Minimize rounding errors
- Validate against authoritative sources
- Cross-check with multiple calculation methods
```

---

## 4. Coordinate-Based Calculation System

### 4.1 Why Coordinate-Based?

#### 4.1.1 District Limitations

**Problem Statement:**
Traditional district-wise calendars assign a single prayer and fasting time to an entire district, regardless of the actual geographic location within that district. This approach creates significant inaccuracies, especially in large districts.

**District Size Variations:**
Bangladesh's 64 districts vary dramatically in size:

**Large Districts (High Time Variation):**
- **Rangamati**: ~6,116 km²
  - Northern edge: ~23.65°N, 92.20°E
  - Southern edge: ~22.20°N, 92.10°E
  - Latitude difference: ~1.45° ≈ 161 km
  - **Time difference**: ~2-3 minutes for sunset
- **Bandarban**: ~4,479 km²
  - Significant north-south variation
  - **Time difference**: ~2 minutes
- **Mymensingh**: ~4,363 km²
  - Large east-west span
  - **Time difference**: ~1.5-2 minutes

**Medium Districts:**
- **Dhaka**: ~1,463 km²
  - Relatively compact but still has variation
  - **Time difference**: ~30-60 seconds
- **Chittagong**: ~5,283 km²
  - Coastal district with significant variation
  - **Time difference**: ~1.5-2 minutes

**Small Districts:**
- **Narayanganj**: ~684 km²
  - More uniform timing
  - **Time difference**: ~20-30 seconds

**Time Difference Calculation:**
For sunset time, the difference between two points depends on longitude:
```
Time Difference (minutes) = 4 × (Longitude Difference in degrees)
```

**Example:**
Rangamati district spans approximately 0.5° longitude:
```
Time Difference = 4 × 0.5° = 2 minutes
```

**Impact on Fasting:**
- **Breaking Fast Early**: If someone at the eastern edge follows western edge time, they break fast 2 minutes early (invalidates fast)
- **Starting Fast Late**: If someone at the western edge follows eastern edge time, they start fast late (invalidates fast)
- **Prayer Timing**: Incorrect Maghrib and Fajr times affect prayer validity

**Real-World Scenarios:**
1. **Rural vs Urban**: Rural areas within large districts often have different times than district center
2. **Border Areas**: People living near district borders may be closer to adjacent district's timing
3. **Travel**: People traveling within districts face uncertainty
4. **Mobile Population**: Workers commuting across districts need accurate times

#### 4.1.2 Coordinate Precision

**Geographic Precision:**
Coordinate-based calculation provides location-specific accuracy:

**Latitude Precision:**
- **1° latitude**: ≈ 111 km (constant worldwide)
- **0.1° latitude**: ≈ 11.1 km
- **0.01° latitude**: ≈ 1.11 km
- **0.001° latitude**: ≈ 111 meters
- **0.0001° latitude**: ≈ 11.1 meters

**Longitude Precision:**
Longitude precision varies with latitude:
```
1° longitude = 111 km × cos(latitude)
```

**For Bangladesh (approximately 24°N):**
- **1° longitude**: ≈ 111 km × cos(24°) ≈ 101.4 km
- **0.1° longitude**: ≈ 10.14 km
- **0.01° longitude**: ≈ 1.014 km
- **0.001° longitude**: ≈ 101.4 meters
- **0.0001° longitude**: ≈ 10.14 meters

**Time Precision:**
Time difference per degree of longitude:
```
Time per degree = 4 minutes (constant)
Time per 0.1° = 0.4 minutes = 24 seconds
Time per 0.01° = 0.04 minutes = 2.4 seconds
Time per 0.001° = 0.004 minutes = 0.24 seconds
```

**Coordinate-Based Accuracy:**
- **±0.01° precision**: Provides ±2.4 seconds time accuracy
- **±0.001° precision**: Provides ±0.24 seconds time accuracy
- **±0.0001° precision**: Provides ±0.024 seconds time accuracy

**Recommended Precision:**
- **Input**: Accept up to 6 decimal places (0.000001° ≈ 0.1 meters)
- **Calculation**: Use full precision internally
- **Output**: Round to nearest minute for display
- **Target Accuracy**: ±30 seconds for standard conditions

**Comparison with District-Based:**
- **District-Based**: ±2-3 minutes (worst case in large districts)
- **Coordinate-Based**: ±30 seconds (with 0.01° precision)
- **Improvement**: 4-6x more accurate

#### 4.1.3 Advantages of Coordinate-Based System

**Accuracy Benefits:**
1. **Location-Specific**: Each coordinate gets its own calculated time
2. **No Approximation**: No averaging or district-level approximation
3. **Consistent**: Same coordinate always produces same time
4. **Scalable**: Works for any location, not just district centers

**Practical Benefits:**
1. **Mobile Users**: GPS coordinates provide instant accurate times
2. **Rural Areas**: Remote locations get accurate times, not district approximations
3. **Border Areas**: No confusion about which district time to follow
4. **Travel**: Accurate times while traveling within or between districts

**Technical Benefits:**
1. **Standardized**: Uses standard geographic coordinate system (WGS84)
2. **Compatible**: Works with GPS, mapping systems, location services
3. **Precise**: Can achieve sub-minute accuracy
4. **Flexible**: Supports any location, not limited to predefined districts

### 4.2 Bangladesh Geographic Coverage

#### 4.2.1 Geographic Bounds

**National Boundaries:**
- **Northernmost Point**: 26.638°N (Panchagarh district)
- **Southernmost Point**: 20.738°N (Cox's Bazar district)
- **Easternmost Point**: 92.673°E (Bandarban district)
- **Westernmost Point**: 88.084°E (Chapai Nawabganj district)

**Geographic Statistics:**
- **Latitude Span**: 5.9° (20.738°N to 26.638°N)
- **Longitude Span**: 4.589° (88.084°E to 92.673°E)
- **Total Area**: ~147,570 km²
- **Geographic Center**: Approximately 23.688°N, 90.379°E (near Dhaka)

**Administrative Divisions:**
- **8 Divisions**: Barisal, Chittagong, Dhaka, Khulna, Mymensingh, Rajshahi, Rangpur, Sylhet
- **64 Districts**: All districts covered
- **Upazilas**: ~495 upazilas (sub-districts)
- **Unions**: ~4,554 unions (lowest administrative unit)

**Coordinate Validation:**
```
Valid Bangladesh Coordinates:
- Latitude: 20.738° ≤ φ ≤ 26.638°
- Longitude: 88.084° ≤ λ ≤ 92.673°

Validation Rules:
- Reject coordinates outside these bounds
- Provide clear error message for out-of-bounds coordinates
- Allow future expansion if needed
```

#### 4.2.2 Administrative Structure

**Division-Level Coverage:**
Each of the 8 divisions has representative coordinates:

**Dhaka Division:**
- **Area**: ~20,593 km²
- **Districts**: 13 districts
- **Representative Coordinate**: 23.8103°N, 90.4125°E (Dhaka city)
- **Time Zone**: UTC+6 (BST)

**Chittagong Division:**
- **Area**: ~33,771 km²
- **Districts**: 11 districts
- **Representative Coordinate**: 22.3569°N, 91.7832°E (Chittagong city)
- **Coastal Variation**: Significant due to coastal geography

**Sylhet Division:**
- **Area**: ~12,595 km²
- **Districts**: 4 districts
- **Representative Coordinate**: 24.8949°N, 91.8687°E (Sylhet city)
- **Northern Location**: Slightly different timing from southern areas

**Rajshahi Division:**
- **Area**: ~18,153 km²
- **Districts**: 8 districts
- **Representative Coordinate**: 24.3745°N, 88.6042°E (Rajshahi city)
- **Western Location**: Different longitude affects timing

**Khulna Division:**
- **Area**: ~22,285 km²
- **Districts**: 10 districts
- **Representative Coordinate**: 22.8456°N, 89.5403°E (Khulna city)
- **Southwestern Location**: Coastal and inland variations

**Barisal Division:**
- **Area**: ~13,225 km²
- **Districts**: 6 districts
- **Representative Coordinate**: 22.7010°N, 90.3531°E (Barisal city)
- **Coastal Location**: River delta region

**Rangpur Division:**
- **Area**: ~16,185 km²
- **Districts**: 8 districts
- **Representative Coordinate**: 25.7439°N, 89.2756°E (Rangpur city)
- **Northernmost Division**: Highest latitude in Bangladesh

**Mymensingh Division:**
- **Area**: ~10,584 km²
- **Districts**: 4 districts
- **Representative Coordinate**: 24.7471°N, 90.4203°E (Mymensingh city)
- **Central Location**: Moderate variations

**District-Level Examples:**
Major districts with coordinates:

| District | Latitude | Longitude | Area (km²) | Time Variation |
|----------|----------|-----------|------------|----------------|
| Dhaka | 23.8103°N | 90.4125°E | 1,463 | ±30-60 sec |
| Chittagong | 22.3569°N | 91.7832°E | 5,283 | ±1.5-2 min |
| Sylhet | 24.8949°N | 91.8687°E | 3,490 | ±1-1.5 min |
| Rajshahi | 24.3745°N | 88.6042°E | 2,407 | ±1 min |
| Khulna | 22.8456°N | 89.5403°E | 4,394 | ±1-1.5 min |
| Rangamati | 22.65°N | 92.20°E | 6,116 | ±2-3 min |
| Bandarban | 22.20°N | 92.22°E | 4,479 | ±2 min |

#### 4.2.3 Coordinate Grid System

**Grid Resolution Strategy:**
To optimize performance while maintaining accuracy, a coordinate grid system is used for caching:

**Recommended Grid Resolution:**
- **Grid Size**: 0.01° × 0.01° (approximately 1.1 km × 1.0 km)
- **Rationale**: 
  - Time difference within grid: ~2.4 seconds (negligible)
  - Storage efficiency: Reasonable number of grid points
  - Accuracy: Maintains ±30 second target

**Grid Coverage:**
```
Latitude Range: 20.738°N to 26.638°N = 5.9°
Longitude Range: 88.084°E to 92.673°E = 4.589°

Grid Points:
- Latitude Points: 5.9° / 0.01° = 590 points
- Longitude Points: 4.589° / 0.01° = 459 points
- Total Grid Points: 590 × 459 = 270,810 points
```

**Grid Point Calculation:**
For any coordinate, find nearest grid point:
```
Grid Latitude = round(latitude / 0.01) × 0.01
Grid Longitude = round(longitude / 0.01) × 0.01
```

**Example:**
Coordinate: 23.8103°N, 90.4125°E
```
Grid Latitude = round(23.8103 / 0.01) × 0.01 = 2381 × 0.01 = 23.81°N
Grid Longitude = round(90.4125 / 0.01) × 0.01 = 9041 × 0.01 = 90.41°E
```

**Caching Strategy:**
1. **Pre-calculate**: Calculate times for all grid points for common dates
2. **Cache Lookup**: For any coordinate, find nearest grid point
3. **Interpolation**: Optionally interpolate between grid points for higher accuracy
4. **On-demand**: Calculate for uncached coordinates on demand

**Storage Requirements:**
For one year of data per grid point:
```
Grid Points: 270,810
Days per Year: 365
Prayer Times per Day: 7 (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Sunset, Isha)
Methods: 4 (Hanafi, Shafi, Maliki, Hanbali)

Total Calculations: 270,810 × 365 × 7 × 4 = 276,707,820 calculations

Storage (assuming 100 bytes per record):
Total Storage: ~27.7 GB per year
```

**Optimization Strategies:**
1. **Selective Caching**: Cache only popular coordinates and dates
2. **Compression**: Compress stored data
3. **Incremental Calculation**: Calculate on-demand for uncached points
4. **Popular Dates**: Pre-calculate Ramadan and other important periods
5. **Regional Focus**: Cache more densely in populated areas

#### 4.2.4 Location Lookup and Reverse Geocoding

**Location Database:**
Maintain a database of known locations with coordinates:

**Location Types:**
1. **Cities**: Major cities with coordinates
2. **Districts**: District centers with coordinates
3. **Upazilas**: Sub-district centers (optional)
4. **Landmarks**: Important mosques, landmarks (optional)

**Location Search:**
```
Search by:
- Location name (fuzzy matching)
- District name
- Division name
- Coordinate proximity
```

**Example Location Database Entry:**
```json
{
  "name": "Dhaka",
  "latitude": 23.8103,
  "longitude": 90.4125,
  "district": "Dhaka",
  "division": "Dhaka",
  "type": "city",
  "population": 21000000,
  "altitude": 4
}
```

**Reverse Geocoding:**
Given coordinates, find nearest known location:
```
1. Calculate distance to all locations
2. Find nearest location
3. Return location name and metadata
```

**Distance Calculation:**
Haversine formula for great-circle distance:
```
a = sin²(Δφ/2) + cos(φ1) × cos(φ2) × sin²(Δλ/2)
c = 2 × atan2(√a, √(1-a))
distance = R × c
```
Where R = Earth's radius (6,371 km)

**Use Cases:**
1. **User Input**: User enters location name, system finds coordinates
2. **GPS Integration**: GPS provides coordinates, system shows location name
3. **Validation**: Verify coordinates are within expected location
4. **Display**: Show location name in API responses

#### 4.2.5 Coordinate Validation and Error Handling

**Input Validation:**
```
1. Format Validation:
   - Latitude: Decimal number, -90 to +90
   - Longitude: Decimal number, -180 to +180
   - Precision: Accept up to 6 decimal places

2. Bangladesh Bounds Validation:
   - Latitude: 20.738° ≤ φ ≤ 26.638°
   - Longitude: 88.084° ≤ λ ≤ 92.673°

3. Precision Validation:
   - Minimum: 2 decimal places (city-level)
   - Recommended: 4-6 decimal places (street-level)
   - Maximum: 6 decimal places (sub-meter precision)
```

**Error Messages:**
```
- "Latitude must be between -90 and 90 degrees"
- "Longitude must be between -180 and 180 degrees"
- "Coordinates outside Bangladesh bounds. Latitude: 20.738-26.638°N, Longitude: 88.084-92.673°E"
- "Invalid coordinate format. Use decimal degrees."
```

**Edge Case Handling:**
1. **Boundary Coordinates**: Handle coordinates exactly at boundaries
2. **Precision Issues**: Handle very high precision coordinates
3. **Invalid Format**: Handle non-numeric or malformed coordinates
4. **Missing Coordinates**: Handle missing latitude or longitude

#### 4.2.6 Coordinate Examples for Bangladesh

**Major Cities:**
```
Dhaka:          23.8103°N, 90.4125°E
Chittagong:     22.3569°N, 91.7832°E
Sylhet:          24.8949°N, 91.8687°E
Rajshahi:        24.3745°N, 88.6042°E
Khulna:          22.8456°N, 89.5403°E
Barisal:         22.7010°N, 90.3531°E
Rangpur:         25.7439°N, 89.2756°E
Mymensingh:      24.7471°N, 90.4203°E
```

**District Centers:**
Representative coordinates for all 64 districts should be maintained in the location database for quick lookup and validation.

**Geographic Extremes:**
```
Northernmost:   26.638°N, 88.084°E (Panchagarh)
Southernmost:   20.738°N, 92.673°E (Cox's Bazar)
Easternmost:    24.8949°N, 92.673°E (Bandarban)
Westernmost:    26.638°N, 88.084°E (Chapai Nawabganj)
```

**Time Variation Examples:**
For March 15, 2024 (approximate):
- **Northernmost vs Southernmost**: ~2-3 minutes difference in sunset
- **Easternmost vs Westernmost**: ~18 minutes difference in local solar time (but same BST)
- **Dhaka vs Chittagong**: ~1-2 minutes difference in sunset

---

## 5. API Design

### 5.1 API Architecture

#### 5.1.1 RESTful Design Principles

**Base URL:**
```
Production: https://api.salat-saom.bd/v1
Staging: https://staging-api.salat-saom.bd/v1
Development: https://dev-api.salat-saom.bd/v1
```

**REST Principles:**
- **Resource-Based URLs**: URLs represent resources (e.g., `/prayer-times`, `/fasting-times`)
- **HTTP Methods**: Use appropriate HTTP methods (GET for retrieval, POST for batch operations)
- **Stateless**: Each request contains all information needed to process it
- **Cacheable**: Responses include cache headers where appropriate
- **Uniform Interface**: Consistent request/response formats

**API Versioning:**
- **URL-Based Versioning**: Version in URL path (`/v1/`, `/v2/`)
- **Current Version**: v1
- **Backward Compatibility**: Maintain backward compatibility within major versions
- **Deprecation Policy**: 6-month notice before removing deprecated endpoints

**Response Format:**
- **Content-Type**: `application/json`
- **Character Encoding**: UTF-8
- **Date Format**: ISO 8601 (YYYY-MM-DD for dates, HH:MM or HH:MM:SS for times)
- **Timezone**: All times in Bangladesh Standard Time (UTC+6)

**Request Format:**
- **Content-Type**: `application/json` for POST requests
- **Query Parameters**: URL-encoded for GET requests
- **Character Encoding**: UTF-8

#### 5.1.2 Authentication

**API Key Authentication:**
```
Header: X-API-Key: your-api-key-here
```

**OAuth 2.0 (Optional):**
```
Authorization: Bearer {access_token}
```

**Authentication Levels:**
1. **Public Access**: Limited requests per day (e.g., 100 requests/day)
2. **Authenticated (API Key)**: Higher rate limits (e.g., 10,000 requests/day)
3. **OAuth 2.0**: Full access with user-specific rate limits

**API Key Management:**
- **Registration**: Sign up at developer portal to get API key
- **Key Rotation**: Support for key rotation and regeneration
- **Key Scoping**: Different keys for different environments (dev, staging, prod)
- **Revocation**: Ability to revoke compromised keys

#### 5.1.3 Rate Limiting

**Rate Limit Headers:**
```
X-RateLimit-Limit: 10000
X-RateLimit-Remaining: 9999
X-RateLimit-Reset: 1640995200
```

**Rate Limit Tiers:**
- **Public (No Auth)**: 100 requests/day
- **Free Tier**: 1,000 requests/day
- **Basic Tier**: 10,000 requests/day
- **Premium Tier**: 100,000 requests/day
- **Enterprise**: Custom limits

**Rate Limit Enforcement:**
- **Per API Key**: Rate limits applied per API key
- **Per IP**: Additional IP-based rate limiting for abuse prevention
- **Sliding Window**: Rate limits use sliding window algorithm
- **429 Response**: Return 429 Too Many Requests when limit exceeded

**Rate Limit Response:**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "details": {
      "limit": 10000,
      "remaining": 0,
      "reset_at": "2024-03-16T00:00:00Z"
    }
  }
}
```

#### 5.1.4 Request/Response Headers

**Required Request Headers:**
```
Content-Type: application/json (for POST requests)
Accept: application/json
X-API-Key: your-api-key (if authenticated)
```

**Optional Request Headers:**
```
Accept-Language: en (for error messages)
User-Agent: YourApp/1.0 (for analytics)
```

**Response Headers:**
```
Content-Type: application/json; charset=utf-8
X-API-Version: 1.0
X-Request-ID: unique-request-id (for debugging)
Cache-Control: public, max-age=3600 (where applicable)
ETag: "version-hash" (for caching)
```

#### 5.1.5 CORS (Cross-Origin Resource Sharing)

**CORS Configuration:**
```
Access-Control-Allow-Origin: * (or specific domains)
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-API-Key
Access-Control-Max-Age: 3600
```

**Preflight Requests:**
- Support OPTIONS requests for CORS preflight
- Return appropriate CORS headers

#### 5.1.6 API Documentation

**OpenAPI/Swagger Specification:**
- Complete OpenAPI 3.0 specification
- Interactive API documentation (Swagger UI)
- Code examples in multiple languages
- Request/response examples

**Documentation Features:**
- Endpoint descriptions
- Parameter documentation
- Response schema documentation
- Error code reference
- Authentication guide
- Rate limiting guide
- Code examples (JavaScript, Python, PHP, Java, cURL)

### 5.2 Endpoint Specifications

#### 5.2.1 Get Prayer Times

**Endpoint:**
```
GET /v1/prayer-times
```

**Description:**
Retrieve all five daily prayer times (Fajr, Dhuhr, Asr, Maghrib, Isha) along with sunrise and sunset times for a specific coordinate and date. This is the primary endpoint for getting prayer times.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `latitude` | float | Yes | - | Latitude in decimal degrees (-90 to 90) |
| `longitude` | float | Yes | - | Longitude in decimal degrees (-180 to 180) |
| `date` | string | No | Today | Date in ISO 8601 format (YYYY-MM-DD) |
| `method` | string | No | karachi | Calculation method (see Section 6 for full list) |
| `fajr_angle` | float | No | - | Custom Fajr angle (10.0-24.5°, overrides method default) |
| `isha_angle` | float | No | - | Custom Isha angle (10.0-24.5°, overrides method default) |
| `asr_method` | string | No | standard | Asr calculation: standard, hanafi |
| `dhuhr_adjustment` | integer | No | 1 | Minutes after Zawal for Dhuhr (1-60) |
| `maghrib_adjustment` | integer | No | 1 | Minutes after sunset for Maghrib (1-15) |
| `hijri_adjustment` | integer | No | 0 | Hijri date adjustment (-2 to +2 days) |
| `timezone` | string | No | +06:00 | Timezone offset in ISO 8601 format |

**Parameter Details:**

**latitude:**
- **Type**: Decimal number
- **Range**: -90.0 to 90.0
- **Precision**: Up to 6 decimal places
- **Bangladesh Range**: 20.738°N to 26.638°N
- **Example**: `23.8103` (Dhaka)

**longitude:**
- **Type**: Decimal number
- **Range**: -180.0 to 180.0
- **Precision**: Up to 6 decimal places
- **Bangladesh Range**: 88.084°E to 92.673°E
- **Example**: `90.4125` (Dhaka)

**date:**
- **Type**: String (ISO 8601 date)
- **Format**: YYYY-MM-DD
- **Range**: Current date to 10 years in future
- **Example**: `2024-03-15`
- **Default**: Current date (today)

**method:**
- **Type**: String (enum)
- **Values**: `hanafi`, `shafi`, `maliki`, `hanbali`
- **Default**: `hanafi`
- **Description**: Islamic calculation method (madhab)

**timezone:**
- **Type**: String (ISO 8601 timezone offset)
- **Format**: ±HH:MM
- **Default**: `+06:00` (Bangladesh Standard Time)
- **Example**: `+06:00`

**Request Example:**
```bash
curl -X GET "https://api.salat-saom.bd/v1/prayer-times?latitude=23.8103&longitude=90.4125&date=2024-03-15&method=hanafi" \
  -H "X-API-Key: your-api-key"
```

**Success Response (200 OK):**
```json
{
  "date": "2024-03-15",
  "location": {
    "latitude": 23.8103,
    "longitude": 90.4125,
    "timezone": "+06:00",
    "name": "Dhaka",
    "district": "Dhaka",
    "division": "Dhaka"
  },
  "method": "hanafi",
  "times": {
    "fajr": "04:45",
    "sunrise": "06:12",
    "dhuhr": "12:08",
    "asr": "15:32",
    "maghrib": "18:04",
    "sunset": "18:04",
    "isha": "19:31"
  },
  "coordinates": {
    "latitude": 23.8103,
    "longitude": 90.4125
  },
  "calculated_at": "2024-03-15T10:30:00Z",
  "request_id": "req_abc123"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Date for which times were calculated |
| `location` | object | Location information |
| `location.latitude` | float | Latitude used |
| `location.longitude` | float | Longitude used |
| `location.timezone` | string | Timezone used |
| `location.name` | string | Location name (if found) |
| `location.district` | string | District name (if found) |
| `location.division` | string | Division name (if found) |
| `method` | string | Calculation method used |
| `times` | object | Prayer and solar times |
| `times.fajr` | string | Fajr prayer time (HH:MM) |
| `times.sunrise` | string | Sunrise time (HH:MM) |
| `times.dhuhr` | string | Dhuhr prayer time (HH:MM) |
| `times.asr` | string | Asr prayer time (HH:MM) |
| `times.maghrib` | string | Maghrib prayer time (HH:MM) |
| `times.sunset` | string | Sunset time (HH:MM) |
| `times.isha` | string | Isha prayer time (HH:MM) |
| `coordinates` | object | Original coordinates |
| `calculated_at` | string | Timestamp of calculation (ISO 8601) |
| `request_id` | string | Unique request identifier |

**Error Responses:**

**400 Bad Request - Invalid Latitude:**
```json
{
  "error": {
    "code": "INVALID_LATITUDE",
    "message": "Latitude must be between -90 and 90 degrees",
    "details": {
      "parameter": "latitude",
      "value": 95.5,
      "valid_range": [-90, 90]
    },
    "request_id": "req_abc123"
  }
}
```

**400 Bad Request - Invalid Longitude:**
```json
{
  "error": {
    "code": "INVALID_LONGITUDE",
    "message": "Longitude must be between -180 and 180 degrees",
    "details": {
      "parameter": "longitude",
      "value": 200.0,
      "valid_range": [-180, 180]
    },
    "request_id": "req_abc123"
  }
}
```

**400 Bad Request - Coordinates Outside Bangladesh:**
```json
{
  "error": {
    "code": "COORDINATES_OUT_OF_BOUNDS",
    "message": "Coordinates outside Bangladesh bounds",
    "details": {
      "latitude": 30.0,
      "longitude": 90.0,
      "valid_range": {
        "latitude": [20.738, 26.638],
        "longitude": [88.084, 92.673]
      }
    },
    "request_id": "req_abc123"
  }
}
```

**400 Bad Request - Invalid Date:**
```json
{
  "error": {
    "code": "INVALID_DATE",
    "message": "Invalid date format. Use YYYY-MM-DD",
    "details": {
      "parameter": "date",
      "value": "2024-13-45",
      "expected_format": "YYYY-MM-DD"
    },
    "request_id": "req_abc123"
  }
}
```

**400 Bad Request - Invalid Method:**
```json
{
  "error": {
    "code": "INVALID_METHOD",
    "message": "Invalid calculation method. See /v1/methods for available methods",
    "details": {
      "parameter": "method",
      "value": "invalid_method",
      "common_values": ["karachi", "mwl", "isna", "hanafi", "shafi", "maliki", "hanbali", "custom_angles"],
      "see_section": "Section 6 for complete list of methods"
    },
    "request_id": "req_abc123"
  }
}
```

**Use Cases:**
1. **Mobile Apps**: Get prayer times for user's current location
2. **Websites**: Display prayer times for a specific location
3. **Mosque Displays**: Show prayer times for mosque location
4. **Smart Devices**: IoT devices showing prayer times
5. **Calendar Integration**: Import prayer times into calendars

**Performance:**
- **Response Time**: < 200ms (p95)
- **Caching**: Responses cached for 1 hour
- **Rate Limit**: Varies by tier (see Section 5.1.3)

#### 5.2.2 Get Sunrise and Sunset Times

**Endpoint:**
```
GET /v1/sun-times
```

**Description:**
Retrieve sunrise, sunset, solar noon, and day length for a specific coordinate and date. Useful for general solar information, not just Islamic purposes.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `latitude` | float | Yes | - | Latitude in decimal degrees |
| `longitude` | float | Yes | - | Longitude in decimal degrees |
| `date` | string | No | Today | Date in ISO 8601 format (YYYY-MM-DD) |
| `timezone` | string | No | +06:00 | Timezone offset in ISO 8601 format |

**Request Example:**
```bash
curl -X GET "https://api.salat-saom.bd/v1/sun-times?latitude=23.8103&longitude=90.4125&date=2024-03-15" \
  -H "X-API-Key: your-api-key"
```

**Success Response (200 OK):**
```json
{
  "date": "2024-03-15",
  "location": {
    "latitude": 23.8103,
    "longitude": 90.4125,
    "timezone": "+06:00",
    "name": "Dhaka",
    "district": "Dhaka",
    "division": "Dhaka"
  },
  "sunrise": "06:12",
  "sunset": "18:04",
  "solar_noon": "12:08",
  "day_length_minutes": 712,
  "day_length_hours": 11.87,
  "day_length_formatted": "11 hours 52 minutes",
  "calculated_at": "2024-03-15T10:30:00Z",
  "request_id": "req_abc123"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Date for which times were calculated |
| `location` | object | Location information |
| `sunrise` | string | Sunrise time (HH:MM) |
| `sunset` | string | Sunset time (HH:MM) |
| `solar_noon` | string | Solar noon time (HH:MM) |
| `day_length_minutes` | integer | Day length in minutes |
| `day_length_hours` | float | Day length in hours (decimal) |
| `day_length_formatted` | string | Human-readable day length |
| `calculated_at` | string | Timestamp of calculation |
| `request_id` | string | Unique request identifier |

**Use Cases:**
1. **General Solar Information**: Sunrise/sunset for any purpose
2. **Photography**: Golden hour calculations
3. **Agriculture**: Farming and agricultural planning
4. **Energy Systems**: Solar energy calculations
5. **Outdoor Activities**: Planning outdoor events

#### 5.2.3 Get Fasting Times

**Endpoint:**
```
GET /v1/fasting-times
```

**Description:**
Retrieve fasting-related times including Sehri (pre-dawn meal) end time, Fajr (start of fast), Iftar (breaking fast), and fasting duration for a specific coordinate and date. Critical for Ramadan and other fasting periods.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `latitude` | float | Yes | - | Latitude in decimal degrees |
| `longitude` | float | Yes | - | Longitude in decimal degrees |
| `date` | string | Yes | - | Date in ISO 8601 format (YYYY-MM-DD) |
| `method` | string | No | karachi | Calculation method (see Section 6) |
| `fajr_angle` | float | No | - | Custom Fajr angle 10.0-24.5° (overrides method default) |
| `isha_angle` | float | No | - | Custom Isha angle 10.0-24.5° (overrides method default) |
| `asr_method` | string | No | standard | Asr calculation: standard, hanafi |
| `dhuhr_adjustment` | integer | No | 1 | Minutes after Zawal for Dhuhr (1-60) |
| `maghrib_adjustment` | integer | No | 1 | Minutes after sunset for Maghrib (1-15) |
| `sehri_margin` | integer | No | 10 | Minutes before Fajr for Sehri end time (5-15) |
| `hijri_adjustment` | integer | No | 0 | Hijri date adjustment (-2 to +2 days) |

**Parameter Details:**

**sehri_margin:**
- **Type**: Integer
- **Range**: 5 to 15 minutes
- **Default**: 10 minutes
- **Description**: Safety margin before Fajr for completing Sehri meal
- **Recommendation**: 10 minutes is standard practice in Bangladesh

**Request Example:**
```bash
curl -X GET "https://api.salat-saom.bd/v1/fasting-times?latitude=23.8103&longitude=90.4125&date=2024-03-15&method=hanafi&sehri_margin=10" \
  -H "X-API-Key: your-api-key"
```

**Success Response (200 OK):**
```json
{
  "date": "2024-03-15",
  "location": {
    "latitude": 23.8103,
    "longitude": 90.4125,
    "timezone": "+06:00",
    "name": "Dhaka",
    "district": "Dhaka",
    "division": "Dhaka"
  },
  "method": "hanafi",
  "fasting": {
    "sehri_end": "04:35",
    "fajr": "04:45",
    "sunrise": "06:12",
    "sunset": "18:04",
    "iftar": "18:04",
    "maghrib": "18:04",
    "fasting_duration_minutes": 799,
    "fasting_duration_hours": 13.32,
    "fasting_duration_formatted": "13 hours 19 minutes",
    "day_length_minutes": 712,
    "day_length_hours": 11.87,
    "day_length_formatted": "11 hours 52 minutes"
  },
  "calculated_at": "2024-03-15T10:30:00Z",
  "request_id": "req_abc123"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Date for which times were calculated |
| `location` | object | Location information |
| `method` | string | Calculation method used |
| `fasting` | object | Fasting-related times |
| `fasting.sehri_end` | string | Last time to eat (Fajr - margin) |
| `fasting.fajr` | string | Start of fast (Fajr prayer time) |
| `fasting.sunrise` | string | Sunrise time |
| `fasting.sunset` | string | Sunset time |
| `fasting.iftar` | string | Time to break fast (same as sunset) |
| `fasting.maghrib` | string | Maghrib prayer time (same as sunset) |
| `fasting.fasting_duration_minutes` | integer | Fasting duration in minutes |
| `fasting.fasting_duration_hours` | float | Fasting duration in hours |
| `fasting.fasting_duration_formatted` | string | Human-readable fasting duration |
| `fasting.day_length_minutes` | integer | Day length in minutes |
| `fasting.day_length_hours` | float | Day length in hours |
| `fasting.day_length_formatted` | string | Human-readable day length |
| `calculated_at` | string | Timestamp of calculation |
| `request_id` | string | Unique request identifier |

**Error Responses:**

**400 Bad Request - Invalid Sehri Margin:**
```json
{
  "error": {
    "code": "INVALID_SEHRI_MARGIN",
    "message": "Sehri margin must be between 5 and 15 minutes",
    "details": {
      "parameter": "sehri_margin",
      "value": 20,
      "valid_range": [5, 15]
    },
    "request_id": "req_abc123"
  }
}
```

**Use Cases:**
1. **Ramadan Calendars**: Generate fasting calendars for Ramadan
2. **Mobile Apps**: Show fasting times in Islamic apps
3. **Notifications**: Send Sehri and Iftar reminders
4. **Community Services**: Mosque announcements and displays
5. **Personal Planning**: Plan meals and activities around fasting times

#### 5.2.4 Get Monthly Calendar

**Endpoint:**
```
GET /v1/calendar/monthly
```

**Description:**
Retrieve prayer and fasting times for all days in a specific month. Useful for generating monthly calendars, printing, or displaying full month schedules.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `latitude` | float | Yes | - | Latitude in decimal degrees |
| `longitude` | float | Yes | - | Longitude in decimal degrees |
| `year` | integer | Yes | - | 4-digit year (e.g., 2024) |
| `month` | integer | Yes | - | Month number (1-12) |
| `method` | string | No | hanafi | Calculation method |
| `include_fasting` | boolean | No | true | Include fasting times |

**Request Example:**
```bash
curl -X GET "https://api.salat-saom.bd/v1/calendar/monthly?latitude=23.8103&longitude=90.4125&year=2024&month=3&method=hanafi" \
  -H "X-API-Key: your-api-key"
```

**Success Response (200 OK):**
```json
{
  "year": 2024,
  "month": 3,
  "month_name": "March",
  "location": {
    "latitude": 23.8103,
    "longitude": 90.4125,
    "timezone": "+06:00",
    "name": "Dhaka",
    "district": "Dhaka",
    "division": "Dhaka"
  },
  "method": "hanafi",
  "total_days": 31,
  "days": [
    {
      "date": "2024-03-01",
      "day_of_week": "Friday",
      "prayer_times": {
        "fajr": "04:48",
        "sunrise": "06:10",
        "dhuhr": "12:08",
        "asr": "15:30",
        "maghrib": "18:02",
        "sunset": "18:02",
        "isha": "19:29"
      },
      "fasting": {
        "sehri_end": "04:38",
        "fajr": "04:48",
        "sunrise": "06:10",
        "sunset": "18:02",
        "iftar": "18:02",
        "maghrib": "18:02",
        "fasting_duration_minutes": 804,
        "day_length_minutes": 712
      }
    }
    // ... 30 more days
  ],
  "calculated_at": "2024-03-15T10:30:00Z",
  "request_id": "req_abc123"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `year` | integer | Year |
| `month` | integer | Month number (1-12) |
| `month_name` | string | Month name |
| `location` | object | Location information |
| `method` | string | Calculation method used |
| `total_days` | integer | Number of days in month |
| `days` | array | Array of daily prayer and fasting times |
| `days[].date` | string | Date (YYYY-MM-DD) |
| `days[].day_of_week` | string | Day of week |
| `days[].prayer_times` | object | Prayer times for the day |
| `days[].fasting` | object | Fasting times for the day (if included) |

**Performance:**
- **Response Time**: < 2 seconds for full month
- **Caching**: Responses cached for 24 hours
- **Rate Limit**: Higher rate limit for calendar endpoints

**Use Cases:**
1. **Monthly Calendars**: Generate printable monthly calendars
2. **Mobile Apps**: Display full month schedule
3. **Websites**: Show monthly prayer times
4. **Mosque Displays**: Monthly schedule displays

#### 5.2.5 Get Yearly Calendar

**Endpoint:**
```
GET /v1/calendar/yearly
```

**Description:**
Retrieve prayer and fasting times for all days in a specific year. Available in full format (all times) or summary format (key times only) to reduce response size.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `latitude` | float | Yes | - | Latitude in decimal degrees |
| `longitude` | float | Yes | - | Longitude in decimal degrees |
| `year` | integer | Yes | - | 4-digit year (e.g., 2024) |
| `method` | string | No | hanafi | Calculation method |
| `format` | string | No | summary | Format: full, summary |
| `include_fasting` | boolean | No | true | Include fasting times |

**Format Options:**

**summary (default):**
- Includes: Fajr, Dhuhr, Maghrib, Iftar
- Excludes: Sunrise, Asr, Isha, detailed fasting info
- Smaller response size (~50% reduction)

**full:**
- Includes: All prayer times, all fasting times, all details
- Complete information for all days

**Request Example:**
```bash
curl -X GET "https://api.salat-saom.bd/v1/calendar/yearly?latitude=23.8103&longitude=90.4125&year=2024&method=hanafi&format=summary" \
  -H "X-API-Key: your-api-key"
```

**Success Response (200 OK) - Summary Format:**
```json
{
  "year": 2024,
  "location": {
    "latitude": 23.8103,
    "longitude": 90.4125,
    "timezone": "+06:00",
    "name": "Dhaka",
    "district": "Dhaka",
    "division": "Dhaka"
  },
  "method": "hanafi",
  "format": "summary",
  "total_days": 366,
  "days": [
    {
      "date": "2024-01-01",
      "day_of_week": "Monday",
      "fajr": "05:15",
      "dhuhr": "12:05",
      "maghrib": "17:25",
      "iftar": "17:25"
    }
    // ... 365 more days
  ],
  "calculated_at": "2024-03-15T10:30:00Z",
  "request_id": "req_abc123"
}
```

**Performance:**
- **Response Time**: < 10 seconds for full year (summary), < 30 seconds (full)
- **Response Size**: ~500 KB (summary), ~2 MB (full)
- **Caching**: Responses cached for 1 year (data doesn't change)
- **Rate Limit**: Lower rate limit due to large responses

**Use Cases:**
1. **Yearly Calendars**: Generate complete yearly calendars
2. **Offline Storage**: Download full year for offline use
3. **Printing**: Print yearly calendars
4. **Data Analysis**: Analyze yearly patterns

#### 5.2.6 Batch Calculation

**Endpoint:**
```
POST /v1/batch/prayer-times
```

**Description:**
Calculate prayer times for multiple coordinates in a single request. Efficient for processing multiple locations simultaneously, such as generating times for multiple cities or districts.

**Request Body:**
```json
{
  "coordinates": [
    {"latitude": 23.8103, "longitude": 90.4125},
    {"latitude": 22.3569, "longitude": 91.7832},
    {"latitude": 24.8949, "longitude": 91.8687}
  ],
  "date": "2024-03-15",
  "method": "hanafi",
  "timezone": "+06:00"
}
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `coordinates` | array | Yes | Array of coordinate objects |
| `coordinates[].latitude` | float | Yes | Latitude |
| `coordinates[].longitude` | float | Yes | Longitude |
| `date` | string | No | Date (defaults to today) |
| `method` | string | No | Calculation method (default: hanafi) |
| `timezone` | string | No | Timezone (default: +06:00) |

**Limits:**
- **Maximum Coordinates**: 100 per request
- **Rate Limit**: Counts as 1 request (not per coordinate)

**Request Example:**
```bash
curl -X POST "https://api.salat-saom.bd/v1/batch/prayer-times" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "coordinates": [
      {"latitude": 23.8103, "longitude": 90.4125},
      {"latitude": 22.3569, "longitude": 91.7832}
    ],
    "date": "2024-03-15",
    "method": "hanafi"
  }'
```

**Success Response (200 OK):**
```json
{
  "date": "2024-03-15",
  "method": "hanafi",
  "timezone": "+06:00",
  "total_coordinates": 2,
  "results": [
    {
      "coordinates": {
        "latitude": 23.8103,
        "longitude": 90.4125
      },
      "location": {
        "name": "Dhaka",
        "district": "Dhaka",
        "division": "Dhaka"
      },
      "times": {
        "fajr": "04:45",
        "sunrise": "06:12",
        "dhuhr": "12:08",
        "asr": "15:32",
        "maghrib": "18:04",
        "sunset": "18:04",
        "isha": "19:31"
      }
    },
    {
      "coordinates": {
        "latitude": 22.3569,
        "longitude": 91.7832
      },
      "location": {
        "name": "Chittagong",
        "district": "Chittagong",
        "division": "Chittagong"
      },
      "times": {
        "fajr": "04:42",
        "sunrise": "06:08",
        "dhuhr": "12:05",
        "asr": "15:28",
        "maghrib": "18:01",
        "sunset": "18:01",
        "isha": "19:28"
      }
    }
  ],
  "calculated_at": "2024-03-15T10:30:00Z",
  "request_id": "req_abc123"
}
```

**Error Responses:**

**400 Bad Request - Too Many Coordinates:**
```json
{
  "error": {
    "code": "TOO_MANY_COORDINATES",
    "message": "Maximum 100 coordinates per request",
    "details": {
      "provided": 150,
      "maximum": 100
    },
    "request_id": "req_abc123"
  }
}
```

**400 Bad Request - Invalid Coordinate:**
```json
{
  "error": {
    "code": "INVALID_COORDINATE",
    "message": "Invalid coordinate in batch request",
    "details": {
      "index": 2,
      "coordinate": {"latitude": 95.0, "longitude": 90.0},
      "error": "Latitude must be between -90 and 90 degrees"
    },
    "request_id": "req_abc123"
  }
}
```

**Use Cases:**
1. **Multi-City Apps**: Get times for multiple cities
2. **District Comparisons**: Compare times across districts
3. **Bulk Processing**: Process large numbers of coordinates
4. **Data Export**: Export times for multiple locations

#### 5.2.7 Get Available Calculation Methods

**Endpoint:**
```
GET /v1/methods
```

**Description:**
Retrieve list of all available calculation methods with their parameters. Useful for displaying method options in user interfaces.

**Query Parameters:**
- None (returns all available methods)

**Request Example:**
```bash
curl -X GET "https://api.salat-saom.bd/v1/methods" \
  -H "X-API-Key: your-api-key"
```

**Success Response (200 OK):**
```json
{
  "methods": [
    {
      "code": "karachi",
      "numeric_code": 3,
      "name": "University of Islamic Sciences, Karachi",
      "fajr_angle": 18.0,
      "isha_angle": 18.0,
      "isha_calculation_type": "angle",
      "asr_method": "standard",
      "dhuhr_adjustment": 1,
      "maghrib_adjustment": 1,
      "is_default": true,
      "regional_preference": ["Pakistan", "India", "Bangladesh"],
      "description": "Most commonly used method in South Asia"
    },
    {
      "code": "mwl",
      "numeric_code": 1,
      "name": "Muslim World League",
      "fajr_angle": 18.0,
      "isha_angle": 17.0,
      "isha_calculation_type": "angle",
      "asr_method": "standard",
      "dhuhr_adjustment": 1,
      "maghrib_adjustment": 1,
      "is_default": false,
      "regional_preference": ["International"],
      "description": "Used by many Islamic organizations worldwide"
    },
    {
      "code": "isna",
      "numeric_code": 5,
      "name": "Islamic Society of North America",
      "fajr_angle": 15.0,
      "isha_angle": 15.0,
      "isha_calculation_type": "angle",
      "asr_method": "standard",
      "dhuhr_adjustment": 1,
      "maghrib_adjustment": 1,
      "is_default": false,
      "regional_preference": ["United States", "Canada"],
      "description": "Common in North America"
    },
    {
      "code": "umm_al_qura",
      "numeric_code": 4,
      "name": "Umm Al-Qura",
      "fajr_angle": 18.5,
      "isha_angle": null,
      "isha_calculation_type": "time",
      "isha_time_adjustment": 90,
      "asr_method": "standard",
      "dhuhr_adjustment": 1,
      "maghrib_adjustment": 1,
      "is_default": false,
      "regional_preference": ["Saudi Arabia", "Gulf countries"],
      "description": "Official method for Saudi Arabia. Isha is time-based (90 minutes after Maghrib)"
    },
    {
      "code": "hanafi",
      "name": "Hanafi",
      "fajr_angle": 18.0,
      "isha_angle": 18.0,
      "isha_calculation_type": "angle",
      "asr_method": "hanafi",
      "dhuhr_adjustment": 1,
      "maghrib_adjustment": 1,
      "is_default": false,
      "regional_preference": ["Hanafi communities"],
      "description": "Hanafi school of thought"
    }
    // ... more methods
  ],
  "total_methods": 18,
  "custom_options": {
    "fajr_angle_range": [10.0, 24.5],
    "fajr_angle_increment": 0.5,
    "isha_angle_range": [10.0, 24.5],
    "isha_angle_increment": 0.5,
    "dhuhr_adjustment_range": [1, 60],
    "maghrib_adjustment_range": [1, 15],
    "hijri_adjustment_range": [-2, 2]
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `methods` | array | Array of available calculation methods |
| `methods[].code` | string | Method code (e.g., "karachi", "mwl") |
| `methods[].numeric_code` | integer | Numeric code (for compatibility with Islamic Finder) |
| `methods[].name` | string | Full method name |
| `methods[].fajr_angle` | float | Default Fajr angle in degrees |
| `methods[].isha_angle` | float | Default Isha angle in degrees (null if time-based) |
| `methods[].isha_calculation_type` | string | "angle" or "time" |
| `methods[].isha_time_adjustment` | integer | Minutes after Maghrib (if time-based) |
| `methods[].asr_method` | string | Asr calculation method: "standard" or "hanafi" |
| `methods[].dhuhr_adjustment` | integer | Default Dhuhr adjustment in minutes |
| `methods[].maghrib_adjustment` | integer | Default Maghrib adjustment in minutes |
| `methods[].is_default` | boolean | Whether this is the default method |
| `methods[].regional_preference` | array | Regions where this method is commonly used |
| `methods[].description` | string | Description of the method |
| `total_methods` | integer | Total number of available methods |
| `custom_options` | object | Available ranges for custom parameters |

**Use Cases:**
1. **UI Dropdowns**: Populate calculation method selection dropdowns
2. **Method Information**: Display method details to users
3. **Configuration**: Help users understand available options
4. **Compatibility**: Match Islamic Finder method codes

#### 5.2.8 Location Search

**Endpoint:**
```
GET /v1/locations/search
```

**Description:**
Search for locations by name and retrieve their coordinates. Supports fuzzy matching for city names, district names, and landmarks. Useful for converting location names to coordinates for API calls.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | Yes | - | Location name to search |
| `limit` | integer | No | 10 | Maximum number of results (1-50) |
| `district` | string | No | - | Filter by district name |
| `division` | string | No | - | Filter by division name |
| `fuzzy` | boolean | No | true | Enable fuzzy matching |

**Request Example:**
```bash
curl -X GET "https://api.salat-saom.bd/v1/locations/search?query=Dhaka&limit=5" \
  -H "X-API-Key: your-api-key"
```

**Success Response (200 OK):**
```json
{
  "query": "Dhaka",
  "total_results": 3,
  "results": [
    {
      "name": "Dhaka",
      "latitude": 23.8103,
      "longitude": 90.4125,
      "district": "Dhaka",
      "division": "Dhaka",
      "type": "city",
      "population": 21000000,
      "altitude": 4,
      "relevance_score": 1.0
    },
    {
      "name": "Dhaka Cantonment",
      "latitude": 23.8333,
      "longitude": 90.4000,
      "district": "Dhaka",
      "division": "Dhaka",
      "type": "area",
      "relevance_score": 0.8
    },
    {
      "name": "Old Dhaka",
      "latitude": 23.7167,
      "longitude": 90.4167,
      "district": "Dhaka",
      "division": "Dhaka",
      "type": "area",
      "relevance_score": 0.7
    }
  ],
  "request_id": "req_abc123"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `query` | string | Original search query |
| `total_results` | integer | Total number of matching results |
| `results` | array | Array of matching locations |
| `results[].name` | string | Location name |
| `results[].latitude` | float | Latitude coordinate |
| `results[].longitude` | float | Longitude coordinate |
| `results[].district` | string | District name |
| `results[].division` | string | Division name |
| `results[].type` | string | Location type (city, district, area, landmark) |
| `results[].population` | integer | Population (if available) |
| `results[].altitude` | integer | Altitude in meters (if available) |
| `results[].relevance_score` | float | Relevance score (0.0-1.0) |

**Search Features:**
- **Fuzzy Matching**: Finds similar names (e.g., "Dacca" finds "Dhaka")
- **Partial Matching**: Matches partial names
- **Case Insensitive**: Not case-sensitive
- **Bengali Support**: Supports Bengali script searches
- **Relevance Ranking**: Results sorted by relevance

**Error Responses:**

**400 Bad Request - Empty Query:**
```json
{
  "error": {
    "code": "EMPTY_QUERY",
    "message": "Search query cannot be empty",
    "request_id": "req_abc123"
  }
}
```

**404 Not Found - No Results:**
```json
{
  "query": "InvalidLocationName",
  "total_results": 0,
  "results": [],
  "message": "No locations found matching your query",
  "request_id": "req_abc123"
}
```

**Use Cases:**
1. **Location Input**: Convert user-entered location names to coordinates
2. **Autocomplete**: Provide location suggestions in search boxes
3. **GPS Alternative**: Use location names when GPS unavailable
4. **User-Friendly**: Allow users to search by name instead of coordinates

### 5.3 Error Responses

#### 5.3.1 Standard Error Format

All error responses follow a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error-specific details
    },
    "request_id": "req_abc123",
    "timestamp": "2024-03-15T10:30:00Z"
  }
}
```

**Error Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `error` | object | Error object |
| `error.code` | string | Machine-readable error code |
| `error.message` | string | Human-readable error message |
| `error.details` | object | Additional error-specific information |
| `error.request_id` | string | Unique request identifier for debugging |
| `error.timestamp` | string | Timestamp when error occurred (ISO 8601) |

#### 5.3.2 HTTP Status Codes

**Success Codes:**
- **200 OK**: Request successful
- **201 Created**: Resource created (for future POST endpoints)

**Client Error Codes:**
- **400 Bad Request**: Invalid request parameters or malformed request
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Valid authentication but insufficient permissions
- **404 Not Found**: Resource not found (endpoint or resource)
- **409 Conflict**: Resource conflict (for future PUT/PATCH endpoints)
- **422 Unprocessable Entity**: Valid format but semantic errors
- **429 Too Many Requests**: Rate limit exceeded

**Server Error Codes:**
- **500 Internal Server Error**: Unexpected server error
- **502 Bad Gateway**: Upstream server error
- **503 Service Unavailable**: Service temporarily unavailable
- **504 Gateway Timeout**: Upstream server timeout

#### 5.3.3 Error Code Reference

**Validation Errors (400 Bad Request):**

**INVALID_LATITUDE:**
```json
{
  "error": {
    "code": "INVALID_LATITUDE",
    "message": "Latitude must be between -90 and 90 degrees",
    "details": {
      "parameter": "latitude",
      "value": 95.5,
      "valid_range": [-90, 90]
    },
    "request_id": "req_abc123"
  }
}
```

**INVALID_LONGITUDE:**
```json
{
  "error": {
    "code": "INVALID_LONGITUDE",
    "message": "Longitude must be between -180 and 180 degrees",
    "details": {
      "parameter": "longitude",
      "value": 200.0,
      "valid_range": [-180, 180]
    },
    "request_id": "req_abc123"
  }
}
```

**COORDINATES_OUT_OF_BOUNDS:**
```json
{
  "error": {
    "code": "COORDINATES_OUT_OF_BOUNDS",
    "message": "Coordinates outside Bangladesh bounds",
    "details": {
      "latitude": 30.0,
      "longitude": 90.0,
      "valid_range": {
        "latitude": [20.738, 26.638],
        "longitude": [88.084, 92.673]
      }
    },
    "request_id": "req_abc123"
  }
}
```

**INVALID_DATE:**
```json
{
  "error": {
    "code": "INVALID_DATE",
    "message": "Invalid date format. Use YYYY-MM-DD",
    "details": {
      "parameter": "date",
      "value": "2024-13-45",
      "expected_format": "YYYY-MM-DD"
    },
    "request_id": "req_abc123"
  }
}
```

**DATE_OUT_OF_RANGE:**
```json
{
  "error": {
    "code": "DATE_OUT_OF_RANGE",
    "message": "Date is outside valid range",
    "details": {
      "parameter": "date",
      "value": "2035-01-01",
      "valid_range": {
        "min": "2024-01-01",
        "max": "2034-12-31"
      }
    },
    "request_id": "req_abc123"
  }
}
```

**INVALID_METHOD:**
```json
{
  "error": {
    "code": "INVALID_METHOD",
    "message": "Invalid calculation method. Use: hanafi, shafi, maliki, hanbali",
    "details": {
      "parameter": "method",
      "value": "invalid_method",
      "valid_values": ["hanafi", "shafi", "maliki", "hanbali"]
    },
    "request_id": "req_abc123"
  }
}
```

**INVALID_SEHRI_MARGIN:**
```json
{
  "error": {
    "code": "INVALID_SEHRI_MARGIN",
    "message": "Sehri margin must be between 5 and 15 minutes",
    "details": {
      "parameter": "sehri_margin",
      "value": 20,
      "valid_range": [5, 15]
    },
    "request_id": "req_abc123"
  }
}
```

**MISSING_REQUIRED_PARAMETER:**
```json
{
  "error": {
    "code": "MISSING_REQUIRED_PARAMETER",
    "message": "Required parameter is missing",
    "details": {
      "parameter": "latitude",
      "required_parameters": ["latitude", "longitude"]
    },
    "request_id": "req_abc123"
  }
}
```

**Authentication Errors (401 Unauthorized):**

**MISSING_API_KEY:**
```json
{
  "error": {
    "code": "MISSING_API_KEY",
    "message": "API key is required for this endpoint",
    "details": {
      "header": "X-API-Key"
    },
    "request_id": "req_abc123"
  }
}
```

**INVALID_API_KEY:**
```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid or expired API key",
    "details": {
      "header": "X-API-Key"
    },
    "request_id": "req_abc123"
  }
}
```

**Rate Limiting Errors (429 Too Many Requests):**

**RATE_LIMIT_EXCEEDED:**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "details": {
      "limit": 10000,
      "remaining": 0,
      "reset_at": "2024-03-16T00:00:00Z",
      "retry_after": 3600
    },
    "request_id": "req_abc123"
  }
}
```

**Server Errors (500 Internal Server Error):**

**CALCULATION_ERROR:**
```json
{
  "error": {
    "code": "CALCULATION_ERROR",
    "message": "An error occurred during calculation",
    "details": {
      "error_type": "mathematical_error",
      "coordinates": {
        "latitude": 23.8103,
        "longitude": 90.4125
      }
    },
    "request_id": "req_abc123"
  }
}
```

**DATABASE_ERROR:**
```json
{
  "error": {
    "code": "DATABASE_ERROR",
    "message": "Database error occurred",
    "details": {
      "error_type": "connection_timeout"
    },
    "request_id": "req_abc123"
  }
}
```

**INTERNAL_SERVER_ERROR:**
```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred",
    "details": {},
    "request_id": "req_abc123"
  }
}
```

**Service Unavailable (503 Service Unavailable):**

**SERVICE_UNAVAILABLE:**
```json
{
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "Service is temporarily unavailable",
    "details": {
      "retry_after": 60,
      "maintenance_mode": false
    },
    "request_id": "req_abc123"
  }
}
```

#### 5.3.4 Error Handling Best Practices

**Client-Side Error Handling:**
1. **Check Status Code**: Handle different HTTP status codes appropriately
2. **Parse Error Response**: Extract error code and message
3. **Display User-Friendly Messages**: Show human-readable messages to users
4. **Log Request ID**: Log request_id for debugging
5. **Retry Logic**: Implement retry with exponential backoff for 5xx errors
6. **Rate Limit Handling**: Respect retry_after for 429 errors

**Example Error Handling (JavaScript):**
```javascript
try {
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    switch (error.error.code) {
      case 'RATE_LIMIT_EXCEEDED':
        // Wait and retry
        await sleep(error.error.details.retry_after * 1000);
        return retry();
      case 'INVALID_COORDINATE':
        // Show validation error to user
        showError(error.error.message);
        break;
      default:
        // Log and show generic error
        console.error('Request ID:', error.error.request_id);
        showError('An error occurred. Please try again.');
    }
  }
} catch (error) {
  // Network or other errors
  showError('Network error. Please check your connection.');
}
```

**Server-Side Error Handling:**
1. **Consistent Format**: Always return errors in standard format
2. **Request ID**: Include unique request_id for tracking
3. **Detailed Logging**: Log full error details server-side
4. **User-Friendly Messages**: Don't expose internal error details
5. **Error Codes**: Use consistent, machine-readable error codes
6. **HTTP Status Codes**: Use appropriate HTTP status codes

---

## 6. Calculation Methods (Madhabs)

### 6.1 Overview

The API supports multiple calculation methods used by various Islamic organizations worldwide. Each method has specific parameters for Fajr and Isha angles, and may have different approaches for Asr calculation. Users can also configure custom angles and time adjustments.

### 6.2 Standard Calculation Methods

#### 6.2.1 University of Islamic Sciences, Karachi (Default)

**Method Code**: `karachi` or `3`

**Parameters:**
- **Fajr Angle**: 18.0°
- **Isha Angle**: 18.0°
- **Asr Calculation**: Standard (shadow = object + shadow at noon)
- **Dhuhr Adjustment**: 1 minute after Zawal (default)
- **Maghrib Adjustment**: 1 minute after sunset (default)

**Usage**: Most commonly used method in South Asia, including Bangladesh. This is the default method for the API.

**Regional Preference**: Pakistan, India, Bangladesh, and parts of South Asia

#### 6.2.2 Muslim World League (MWL)

**Method Code**: `mwl` or `1`

**Parameters:**
- **Fajr Angle**: 18.0°
- **Isha Angle**: 17.0°
- **Asr Calculation**: Standard
- **Dhuhr Adjustment**: 1 minute after Zawal
- **Maghrib Adjustment**: 1 minute after sunset

**Usage**: Used by many Islamic organizations worldwide

**Regional Preference**: International, many countries in Europe and Americas

#### 6.2.3 Islamic Society of North America (ISNA)

**Method Code**: `isna` or `5`

**Parameters:**
- **Fajr Angle**: 15.0°
- **Isha Angle**: 15.0°
- **Asr Calculation**: Standard
- **Dhuhr Adjustment**: 1 minute after Zawal
- **Maghrib Adjustment**: 1 minute after sunset

**Usage**: Common in North America

**Regional Preference**: United States, Canada

#### 6.2.4 Egyptian General Authority of Survey

**Method Code**: `egyptian` or `2`

**Parameters:**
- **Fajr Angle**: 19.5°
- **Isha Angle**: 17.5°
- **Asr Calculation**: Standard
- **Dhuhr Adjustment**: 1 minute after Zawal
- **Maghrib Adjustment**: 1 minute after sunset

**Usage**: Official method used in Egypt

**Regional Preference**: Egypt, parts of Middle East

#### 6.2.5 Umm Al-Qura

**Method Code**: `umm_al_qura` or `4`

**Parameters:**
- **Fajr Angle**: 18.5° (fixed time at 90 minutes before sunrise in some implementations)
- **Isha Angle**: 90 minutes after Maghrib (time-based, not angle-based)
- **Asr Calculation**: Standard
- **Dhuhr Adjustment**: 1 minute after Zawal
- **Maghrib Adjustment**: 1 minute after sunset

**Usage**: Official method for Saudi Arabia

**Regional Preference**: Saudi Arabia, Gulf countries

**Note**: Isha is calculated as time-based (90 minutes after Maghrib) rather than angle-based.

#### 6.2.6 Majlis Ugama Islam Singapura (MUIS)

**Method Code**: `singapore` or `9`

**Parameters:**
- **Fajr Angle**: 20.0°
- **Isha Angle**: 18.0°
- **Asr Calculation**: Standard
- **Dhuhr Adjustment**: 1 minute after Zawal
- **Maghrib Adjustment**: 1 minute after sunset

**Usage**: Official method for Singapore

**Regional Preference**: Singapore, parts of Southeast Asia

#### 6.2.7 Diyanet İşleri Başkanlığı, Turkey

**Method Code**: `turkey` or `16`

**Parameters:**
- **Fajr Angle**: 18.0°
- **Isha Angle**: 17.0°
- **Asr Calculation**: Standard
- **Dhuhr Adjustment**: 1 minute after Zawal
- **Maghrib Adjustment**: 1 minute after sunset

**Usage**: Official method for Turkey

**Regional Preference**: Turkey

#### 6.2.8 JAKIM (Jabatan Kemajuan Islam Malaysia)

**Method Code**: `jakim` or `13`

**Parameters:**
- **Fajr Angle**: 20.0°
- **Isha Angle**: 18.0°
- **Asr Calculation**: Standard
- **Dhuhr Adjustment**: 1 minute after Zawal
- **Maghrib Adjustment**: 1 minute after sunset

**Usage**: Official method for Malaysia

**Regional Preference**: Malaysia

#### 6.2.9 Union des Organisations Islamiques de France (UOIF)

**Method Code**: `france` or `8`

**Parameters:**
- **Fajr Angle**: 12.0°
- **Isha Angle**: 12.0°
- **Asr Calculation**: Standard
- **Dhuhr Adjustment**: 1 minute after Zawal
- **Maghrib Adjustment**: 1 minute after sunset

**Usage**: Used by French Islamic organizations

**Regional Preference**: France, parts of Europe

#### 6.2.10 Algerian Ministry of Religious Affairs and Wakfs

**Method Code**: `algeria` or `15`

**Parameters:**
- **Fajr Angle**: 18.0°
- **Isha Angle**: 17.0°
- **Asr Calculation**: Standard
- **Dhuhr Adjustment**: 1 minute after Zawal
- **Maghrib Adjustment**: 1 minute after sunset

**Usage**: Official method for Algeria

**Regional Preference**: Algeria

#### 6.2.11 Tunisian Ministry of Religious Affairs

**Method Code**: `tunisia` or `12`

**Parameters:**
- **Fajr Angle**: 18.0°
- **Isha Angle**: 18.0°
- **Asr Calculation**: Standard
- **Dhuhr Adjustment**: 1 minute after Zawal
- **Maghrib Adjustment**: 1 minute after sunset

**Usage**: Official method for Tunisia

**Regional Preference**: Tunisia

#### 6.2.12 Sihat/Kemenag (Indonesia)

**Method Code**: `indonesia` or `11`

**Parameters:**
- **Fajr Angle**: 20.0°
- **Isha Angle**: 18.0°
- **Asr Calculation**: Standard
- **Dhuhr Adjustment**: 1 minute after Zawal
- **Maghrib Adjustment**: 1 minute after sunset

**Usage**: Official method for Indonesia

**Regional Preference**: Indonesia

#### 6.2.13 Spiritual Administration of Muslims of Russia

**Method Code**: `russia` or `14`

**Parameters:**
- **Fajr Angle**: 16.0°
- **Isha Angle**: 15.0°
- **Asr Calculation**: Standard
- **Dhuhr Adjustment**: 1 minute after Zawal
- **Maghrib Adjustment**: 1 minute after sunset

**Usage**: Used in Russia

**Regional Preference**: Russia, parts of Central Asia

#### 6.2.14 Shia Ithna-Ashari, Leva Institute, Qum (Jafri)

**Method Code**: `jafri` or `18`

**Parameters:**
- **Fajr Angle**: 16.0°
- **Isha Angle**: 14.0°
- **Asr Calculation**: Standard
- **Dhuhr Adjustment**: 1 minute after Zawal
- **Maghrib Adjustment**: 1 minute after sunset

**Usage**: Used by Shia Ithna-Ashari communities

**Regional Preference**: Shia communities worldwide

**Note**: This method is used by Shia Muslims and may differ from Sunni methods.

### 6.3 Traditional Madhab Methods

#### 6.3.1 Hanafi Method

**Method Code**: `hanafi`

**Parameters:**
- **Fajr Angle**: 18.0° (or 15.0° in some regions)
- **Isha Angle**: 18.0° (or 17.0° in some regions)
- **Asr Calculation**: Hanafi (shadow = 2 × object length, or shadow = object + shadow at noon)
- **Dhuhr Adjustment**: 1 minute after Zawal
- **Maghrib Adjustment**: 1 minute after sunset

**Regional Variations:**
- **Northern Bangladesh**: May use 15.0° for Fajr
- **Southern Bangladesh**: Typically 18.0° for Fajr
- **Configuration**: Allow method customization

**Asr Calculation Options:**
- **Standard Hanafi**: Shadow = object length + shadow at noon
- **Alternative Hanafi**: Shadow = 2 × object length

#### 6.3.2 Shafi Method

**Method Code**: `shafi`

**Parameters:**
- **Fajr Angle**: 20.0°
- **Isha Angle**: 18.0°
- **Asr Calculation**: Standard (shadow = object + shadow at noon)
- **Dhuhr Adjustment**: 1 minute after Zawal
- **Maghrib Adjustment**: 1 minute after sunset

#### 6.3.3 Maliki Method

**Method Code**: `maliki`

**Parameters:**
- **Fajr Angle**: 18.0°
- **Isha Angle**: 17.0°
- **Asr Calculation**: Standard (shadow = object + shadow at noon)
- **Dhuhr Adjustment**: 1 minute after Zawal
- **Maghrib Adjustment**: 1 minute after sunset

#### 6.3.4 Hanbali Method

**Method Code**: `hanbali`

**Parameters:**
- **Fajr Angle**: 18.0°
- **Isha Angle**: 17.0°
- **Asr Calculation**: Standard (shadow = object + shadow at noon)
- **Dhuhr Adjustment**: 1 minute after Zawal
- **Maghrib Adjustment**: 1 minute after sunset

### 6.4 Custom Method Configuration

#### 6.4.1 Custom Fajr and Isha Angles

**Method Code**: `custom_angles` or `6`

**Configuration:**
```json
{
  "method": "custom_angles",
  "fajr_angle": 18.0,
  "isha_angle": 17.0,
  "asr_method": "standard",
  "dhuhr_adjustment": 1,
  "maghrib_adjustment": 1
}
```

**Parameters:**
- **Fajr Angle**: 10.0° to 24.5° (in 0.5° increments)
- **Isha Angle**: 10.0° to 24.5° (in 0.5° increments)
- **Asr Calculation**: Standard or Hanafi
- **Dhuhr Adjustment**: 1-60 minutes after Zawal
- **Maghrib Adjustment**: 1-15 minutes after sunset

**Use Case**: Users who need specific angles not covered by standard methods

#### 6.4.2 Custom Fajr Angle and Isha Time Adjustment

**Method Code**: `custom_time` or `7`

**Configuration:**
```json
{
  "method": "custom_time",
  "fajr_angle": 18.0,
  "isha_time_adjustment": 90,
  "asr_method": "standard",
  "dhuhr_adjustment": 1,
  "maghrib_adjustment": 1
}
```

**Parameters:**
- **Fajr Angle**: 10.0° to 24.5° (in 0.5° increments)
- **Isha Time Adjustment**: Minutes after Maghrib (instead of angle-based)
- **Asr Calculation**: Standard or Hanafi
- **Dhuhr Adjustment**: 1-60 minutes after Zawal
- **Maghrib Adjustment**: 1-15 minutes after sunset

**Use Case**: Similar to Umm Al-Qura method where Isha is time-based

### 6.5 Additional Configuration Options

#### 6.5.1 Dhuhr Time Adjustment

**Parameter**: `dhuhr_adjustment`

**Description**: Number of minutes after Zawal (solar noon) when Dhuhr prayer should be performed.

**Options:**
- **Range**: 1 to 60 minutes
- **Default**: 1 minute
- **Common Values**: 1-5 minutes (most common), up to 60 minutes for special cases

**Calculation:**
```
Dhuhr Time = Solar Noon + dhuhr_adjustment (minutes)
```

**Use Case**: Some communities prefer to wait a few minutes after Zawal before performing Dhuhr prayer.

**API Parameter:**
```
GET /v1/prayer-times?latitude=23.8103&longitude=90.4125&dhuhr_adjustment=2
```

#### 6.5.2 Maghrib Time Adjustment

**Parameter**: `maghrib_adjustment`

**Description**: Number of minutes after sunset when Maghrib prayer should be performed.

**Options:**
- **Range**: 1 to 15 minutes
- **Default**: 1 minute
- **Common Values**: 1-3 minutes (most common), up to 15 minutes for special cases

**Calculation:**
```
Maghrib Time = Sunset Time + maghrib_adjustment (minutes)
```

**Use Case**: Some communities prefer to wait a few minutes after sunset before performing Maghrib prayer.

**API Parameter:**
```
GET /v1/prayer-times?latitude=23.8103&longitude=90.4125&maghrib_adjustment=2
```

**Note**: This adjustment also affects Iftar time for fasting.

#### 6.5.3 Juristic Settings (Asr Calculation)

**Parameter**: `juristic_method` or `asr_method`

**Description**: Determines how Asr prayer time is calculated based on shadow length.

**Options:**

**Option 1: Standard (Hanbali, Maliki, Shafi)**
- **Code**: `standard` or `1`
- **Calculation**: Shadow = object length + shadow at noon
- **Description**: Standard calculation used by most schools

**Option 2: Hanafi**
- **Code**: `hanafi` or `2`
- **Calculation**: Shadow = object length + shadow at noon (standard)
- **Alternative**: Shadow = 2 × object length (some Hanafi implementations)
- **Description**: Hanafi school calculation

**API Parameter:**
```
GET /v1/prayer-times?latitude=23.8103&longitude=90.4125&asr_method=hanafi
```

**Impact**: Changing juristic settings affects only Asr prayer time, not other prayers.

#### 6.5.4 Hijri Date Adjustment

**Parameter**: `hijri_adjustment`

**Description**: Adjustment for Hijri (Islamic) calendar date display. This adjusts the displayed Hijri date to match local moon sighting practices.

**Options:**
- **Range**: -2 to +2 days
- **Default**: 0 (no adjustment)
- **Values**: -2, -1, 0, +1, +2

**Use Case**: 
- Different regions may have different Hijri dates based on local moon sighting
- Some communities follow Mecca's Hijri date, others follow local sighting
- Adjustment allows synchronization with local calendar

**API Parameter:**
```
GET /v1/prayer-times?latitude=23.8103&longitude=90.4125&hijri_adjustment=1
```

**Response:**
```json
{
  "date": "2024-03-15",
  "hijri_date": "1445-09-05",  // Adjusted Hijri date
  "hijri_adjustment": 1,
  "times": { ... }
}
```

**Note**: This is primarily for display purposes and does not affect prayer time calculations.

### 6.6 Complete Method Configuration

#### 6.6.1 Full Configuration Object

**Complete Request Example:**
```json
{
  "latitude": 23.8103,
  "longitude": 90.4125,
  "date": "2024-03-15",
  "method": "karachi",
  "fajr_angle": 18.0,
  "isha_angle": 18.0,
  "asr_method": "standard",
  "dhuhr_adjustment": 1,
  "maghrib_adjustment": 1,
  "hijri_adjustment": 0
}
```

**API Endpoint with All Parameters:**
```
GET /v1/prayer-times?latitude=23.8103&longitude=90.4125&date=2024-03-15&method=karachi&fajr_angle=18.0&isha_angle=18.0&asr_method=standard&dhuhr_adjustment=1&maghrib_adjustment=1&hijri_adjustment=0
```

#### 6.6.2 Method Parameter Priority

**Priority Order:**
1. **Explicit angles** (`fajr_angle`, `isha_angle`) override method defaults
2. **Method code** sets default angles if not explicitly provided
3. **Default method** (karachi) if no method specified

**Example:**
```
method=karachi&fajr_angle=20.0
```
- Uses Karachi method defaults (18° Fajr, 18° Isha)
- But overrides Fajr to 20.0°

#### 6.6.3 Method Compatibility Matrix

| Method | Fajr Angle | Isha Angle | Asr Method | Regional Use |
|--------|-----------|------------|------------|--------------|
| karachi | 18.0° | 18.0° | Standard | South Asia (Default) |
| mwl | 18.0° | 17.0° | Standard | International |
| isna | 15.0° | 15.0° | Standard | North America |
| egyptian | 19.5° | 17.5° | Standard | Egypt |
| umm_al_qura | 18.5° | 90 min* | Standard | Saudi Arabia |
| singapore | 20.0° | 18.0° | Standard | Singapore |
| turkey | 18.0° | 17.0° | Standard | Turkey |
| jakim | 20.0° | 18.0° | Standard | Malaysia |
| france | 12.0° | 12.0° | Standard | France |
| algeria | 18.0° | 17.0° | Standard | Algeria |
| tunisia | 18.0° | 18.0° | Standard | Tunisia |
| indonesia | 20.0° | 18.0° | Standard | Indonesia |
| russia | 16.0° | 15.0° | Standard | Russia |
| jafri | 16.0° | 14.0° | Standard | Shia communities |
| hanafi | 18.0° | 18.0° | Hanafi | Hanafi communities |
| shafi | 20.0° | 18.0° | Standard | Shafi communities |
| maliki | 18.0° | 17.0° | Standard | Maliki communities |
| hanbali | 18.0° | 17.0° | Standard | Hanbali communities |

*Umm Al-Qura uses time-based Isha (90 minutes after Maghrib) instead of angle-based.

### 6.7 Method Selection Guidelines

#### 6.7.1 For Bangladesh

**Recommended Methods:**
1. **Karachi (Default)**: Most commonly used in Bangladesh
2. **MWL**: Alternative international standard
3. **Hanafi**: For Hanafi communities
4. **Custom**: For specific local preferences

**Regional Considerations:**
- **Northern Bangladesh**: May prefer 15° Fajr angle (can use custom)
- **Southern Bangladesh**: Typically use 18° Fajr angle (Karachi default)
- **Urban Areas**: Usually follow Karachi or MWL
- **Rural Areas**: May have local preferences

#### 6.7.2 Method Selection API

**Get Available Methods:**
```
GET /v1/methods
```

**Response:**
```json
{
  "methods": [
    {
      "code": "karachi",
      "name": "University of Islamic Sciences, Karachi",
      "fajr_angle": 18.0,
      "isha_angle": 18.0,
      "asr_method": "standard",
      "is_default": true,
      "regional_preference": ["Pakistan", "India", "Bangladesh"]
    },
    {
      "code": "mwl",
      "name": "Muslim World League",
      "fajr_angle": 18.0,
      "isha_angle": 17.0,
      "asr_method": "standard",
      "is_default": false,
      "regional_preference": ["International"]
    }
    // ... more methods
  ]
}
```

### 6.8 Implementation Notes

#### 6.8.1 Database Storage

**Calculation Methods Table:**
```sql
CREATE TABLE calculation_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  method_code VARCHAR(50) UNIQUE NOT NULL,
  method_name VARCHAR(255) NOT NULL,
  fajr_angle DECIMAL(4,1) NOT NULL,
  isha_angle DECIMAL(4,1),
  isha_time_adjustment INT, -- Minutes after Maghrib (for time-based Isha)
  isha_calculation_type ENUM('angle', 'time') DEFAULT 'angle',
  asr_method VARCHAR(20) DEFAULT 'standard',
  dhuhr_adjustment INT DEFAULT 1,
  maghrib_adjustment INT DEFAULT 1,
  is_default BOOLEAN DEFAULT FALSE,
  regional_preference TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6.8.2 Calculation Logic

**Method Selection:**
```javascript
function getMethodParameters(methodCode, customParams = {}) {
  const method = METHODS[methodCode] || METHODS['karachi'];
  
  return {
    fajr_angle: customParams.fajr_angle || method.fajr_angle,
    isha_angle: customParams.isha_angle || method.isha_angle,
    isha_time_adjustment: customParams.isha_time_adjustment || method.isha_time_adjustment,
    isha_calculation_type: method.isha_calculation_type || 'angle',
    asr_method: customParams.asr_method || method.asr_method,
    dhuhr_adjustment: customParams.dhuhr_adjustment || method.dhuhr_adjustment || 1,
    maghrib_adjustment: customParams.maghrib_adjustment || method.maghrib_adjustment || 1
  };
}
```

**Isha Calculation (Time-based):**
```javascript
if (method.isha_calculation_type === 'time') {
  const ishaTime = addMinutes(maghribTime, method.isha_time_adjustment);
} else {
  // Standard angle-based calculation
  const ishaTime = calculatePrayerTime(solarNoon, ishaHourAngle, false);
}
```

### 6.9 Summary of Calculation Methods

#### 6.9.1 Method Categories

**Organizational Methods (14 methods):**
Methods used by specific Islamic organizations or countries:
- Karachi (Default for Bangladesh)
- Muslim World League (MWL)
- Islamic Society of North America (ISNA)
- Egyptian General Authority of Survey
- Umm Al-Qura (Saudi Arabia)
- Majlis Ugama Islam Singapura (Singapore)
- Diyanet İşleri Başkanlığı (Turkey)
- JAKIM (Malaysia)
- Union des Organisations Islamiques de France
- Algerian Ministry of Religious Affairs
- Tunisian Ministry of Religious Affairs
- Sihat/Kemenag (Indonesia)
- Spiritual Administration of Muslims of Russia
- Shia Ithna-Ashari (Jafri)

**Traditional Madhab Methods (4 methods):**
Methods based on Islamic schools of jurisprudence:
- Hanafi
- Shafi
- Maliki
- Hanbali

**Custom Methods (2 types):**
- Custom Angles: User-defined Fajr and Isha angles
- Custom Time: Fajr angle + Isha time adjustment

**Total: 20 calculation methods** (14 organizational + 4 madhab + 2 custom)

#### 6.9.2 Configuration Options Summary

**Prayer Time Adjustments:**
- **Dhuhr Adjustment**: 1-60 minutes after Zawal (default: 1 minute)
- **Maghrib Adjustment**: 1-15 minutes after sunset (default: 1 minute)

**Angle Configuration:**
- **Fajr Angle**: 10.0° to 24.5° (in 0.5° increments)
- **Isha Angle**: 10.0° to 24.5° (in 0.5° increments) OR time-based adjustment

**Asr Calculation:**
- **Standard**: Shadow = object + shadow at noon
- **Hanafi**: Shadow = object + shadow at noon (or 2 × object length)

**Hijri Calendar:**
- **Hijri Adjustment**: -2 to +2 days (for display purposes)

#### 6.9.3 Compatibility with Islamic Finder

The API is designed to be compatible with Islamic Finder's calculation methods:
- **Numeric Codes**: Methods support numeric codes (1-18) matching Islamic Finder
- **Method Names**: Method codes match or are compatible with Islamic Finder
- **Parameter Support**: All configuration options from Islamic Finder are supported
- **Default Method**: Karachi (code 3) matches Islamic Finder's default

**Migration Path:**
Users migrating from Islamic Finder can use the same method codes and parameters, ensuring compatibility and easy transition.

---

## 7. Data Models

### 7.1 Core Entities

#### 7.1.1 Location

**TypeScript Interface:**
```typescript
interface Location {
  // Required fields
  latitude: number;      // -90 to 90, decimal degrees
  longitude: number;    // -180 to 180, decimal degrees
  timezone: string;     // ISO 8601 timezone offset, e.g., "+06:00"
  
  // Optional fields
  altitude?: number;    // meters above sea level (optional, for precision)
  name?: string;        // Location name (city, district, area)
  district?: string;    // District name
  division?: string;     // Division name
  country?: string;     // Country code (default: "BD" for Bangladesh)
  type?: LocationType;  // Location type (city, district, area, landmark)
  population?: number;  // Population (if available)
}
```

**Location Type Enum:**
```typescript
enum LocationType {
  CITY = "city",
  DISTRICT = "district",
  AREA = "area",
  LANDMARK = "landmark",
  MOSQUE = "mosque"
}
```

**Validation Rules:**
- **latitude**: Must be between -90 and 90, precision up to 6 decimal places
- **longitude**: Must be between -180 and 180, precision up to 6 decimal places
- **timezone**: Must be valid ISO 8601 timezone offset format (±HH:MM)
- **altitude**: Optional, must be non-negative if provided
- **name**: Optional, max 255 characters
- **district**: Optional, max 100 characters
- **division**: Optional, max 100 characters

**Example:**
```json
{
  "latitude": 23.8103,
  "longitude": 90.4125,
  "timezone": "+06:00",
  "name": "Dhaka",
  "district": "Dhaka",
  "division": "Dhaka",
  "country": "BD",
  "type": "city",
  "population": 21000000,
  "altitude": 4
}
```

**Use Cases:**
- Input validation for API requests
- Location search results
- Reverse geocoding responses
- Coordinate storage and lookup

#### 7.1.2 PrayerTimes

**TypeScript Interface:**
```typescript
interface PrayerTimes {
  // Metadata
  date: string;              // ISO 8601 date (YYYY-MM-DD)
  location: Location;        // Location information
  method: string;            // Calculation method: "hanafi" | "shafi" | "maliki" | "hanbali" | "custom"
  timezone: string;          // Timezone used (ISO 8601 format)
  
  // Prayer Times (HH:MM format, 24-hour)
  fajr: string;             // Dawn prayer time
  sunrise: string;           // Sunrise time
  dhuhr: string;             // Midday prayer time
  asr: string;              // Afternoon prayer time
  maghrib: string;           // Sunset prayer time
  sunset: string;            // Sunset time (same as maghrib)
  isha: string;             // Night prayer time
  
  // Optional precision times (HH:MM:SS format)
  fajr_precise?: string;     // Precise Fajr time with seconds
  sunrise_precise?: string;   // Precise sunrise time with seconds
  dhuhr_precise?: string;     // Precise Dhuhr time with seconds
  asr_precise?: string;       // Precise Asr time with seconds
  maghrib_precise?: string;   // Precise Maghrib time with seconds
  sunset_precise?: string;    // Precise sunset time with seconds
  isha_precise?: string;      // Precise Isha time with seconds
  
  // Metadata
  calculated_at: string;     // ISO 8601 timestamp of calculation
  request_id?: string;       // Unique request identifier
  cache_hit?: boolean;       // Whether result was from cache
}
```

**Validation Rules:**
- **date**: Must be valid ISO 8601 date format (YYYY-MM-DD)
- **location**: Must be valid Location object
- **method**: Must be one of: "hanafi", "shafi", "maliki", "hanbali", "custom"
- **timezone**: Must be valid ISO 8601 timezone offset
- **All times**: Must be valid HH:MM format (24-hour)
- **Time sequence**: Must follow: Fajr < Sunrise < Dhuhr < Asr < Maghrib < Isha

**Example:**
```json
{
  "date": "2024-03-15",
  "location": {
    "latitude": 23.8103,
    "longitude": 90.4125,
    "timezone": "+06:00",
    "name": "Dhaka",
    "district": "Dhaka",
    "division": "Dhaka"
  },
  "method": "hanafi",
  "timezone": "+06:00",
  "fajr": "04:45",
  "sunrise": "06:12",
  "dhuhr": "12:08",
  "asr": "15:32",
  "maghrib": "18:04",
  "sunset": "18:04",
  "isha": "19:31",
  "calculated_at": "2024-03-15T10:30:00Z",
  "request_id": "req_abc123",
  "cache_hit": true
}
```

**Time Format:**
- **Standard**: HH:MM (24-hour format, e.g., "04:45", "18:04")
- **Precise**: HH:MM:SS (with seconds, e.g., "04:45:23", "18:04:15")
- **Timezone**: All times in Bangladesh Standard Time (UTC+6)

#### 7.1.3 FastingTimes

**TypeScript Interface:**
```typescript
interface FastingTimes {
  // Metadata
  date: string;              // ISO 8601 date (YYYY-MM-DD)
  location: Location;        // Location information
  method: string;            // Calculation method
  sehri_margin: number;      // Minutes before Fajr for Sehri end (default: 10)
  
  // Fasting Times
  sehri_end: string;         // Last time to eat (Fajr - sehri_margin)
  fajr: string;             // Start of fast (Fajr prayer time)
  sunrise: string;           // Sunrise time
  sunset: string;            // Sunset time
  iftar: string;             // Break fast time (same as sunset)
  maghrib: string;           // Maghrib prayer time (same as sunset)
  
  // Durations
  fasting_duration_minutes: number;  // Time from Fajr to Iftar in minutes
  fasting_duration_hours: number;   // Time from Fajr to Iftar in hours (decimal)
  fasting_duration_formatted: string; // Human-readable format (e.g., "13 hours 19 minutes")
  day_length_minutes: number;        // Time from sunrise to sunset in minutes
  day_length_hours: number;           // Time from sunrise to sunset in hours (decimal)
  day_length_formatted: string;       // Human-readable format (e.g., "11 hours 52 minutes")
  
  // Metadata
  calculated_at: string;     // ISO 8601 timestamp of calculation
  request_id?: string;       // Unique request identifier
}
```

**Validation Rules:**
- **date**: Must be valid ISO 8601 date format
- **location**: Must be valid Location object
- **method**: Must be valid calculation method
- **sehri_margin**: Must be between 5 and 15 minutes
- **Time sequence**: Sehri End < Fajr < Sunrise < Sunset (Iftar) < Isha
- **Durations**: Must be positive and reasonable (10-17 hours for Bangladesh)

**Example:**
```json
{
  "date": "2024-03-15",
  "location": {
    "latitude": 23.8103,
    "longitude": 90.4125,
    "timezone": "+06:00",
    "name": "Dhaka",
    "district": "Dhaka",
    "division": "Dhaka"
  },
  "method": "hanafi",
  "sehri_margin": 10,
  "sehri_end": "04:35",
  "fajr": "04:45",
  "sunrise": "06:12",
  "sunset": "18:04",
  "iftar": "18:04",
  "maghrib": "18:04",
  "fasting_duration_minutes": 799,
  "fasting_duration_hours": 13.32,
  "fasting_duration_formatted": "13 hours 19 minutes",
  "day_length_minutes": 712,
  "day_length_hours": 11.87,
  "day_length_formatted": "11 hours 52 minutes",
  "calculated_at": "2024-03-15T10:30:00Z",
  "request_id": "req_abc123"
}
```

#### 7.1.4 CalendarResponse

**TypeScript Interface:**
```typescript
interface CalendarResponse {
  // Calendar metadata
  year?: number;             // Year (for yearly calendar)
  month?: number;           // Month (1-12, for monthly calendar)
  month_name?: string;       // Month name (e.g., "March")
  format?: "full" | "summary"; // Calendar format
  
  // Location and method
  location: Location;
  method: string;
  
  // Calendar data
  total_days: number;       // Total number of days in calendar
  days: CalendarDay[];      // Array of daily data
  
  // Metadata
  calculated_at: string;     // ISO 8601 timestamp
  request_id?: string;       // Unique request identifier
}

interface CalendarDay {
  date: string;             // ISO 8601 date (YYYY-MM-DD)
  day_of_week: string;      // Day of week (e.g., "Monday")
  day_of_week_short?: string; // Short day name (e.g., "Mon")
  day_number?: number;      // Day number in month (1-31)
  
  // Prayer times (full format) or key times (summary format)
  prayer_times?: PrayerTimes; // Full prayer times (if format is "full")
  fajr?: string;            // Fajr time (summary format)
  dhuhr?: string;           // Dhuhr time (summary format)
  maghrib?: string;         // Maghrib time (summary format)
  isha?: string;            // Isha time (summary format)
  
  // Fasting times (if included)
  fasting?: FastingTimes;   // Full fasting times (if format is "full")
  iftar?: string;          // Iftar time (summary format)
  
  // Additional information
  is_ramadan?: boolean;     // Whether date is during Ramadan
  hijri_date?: string;      // Hijri date (optional)
}
```

**Example - Monthly Calendar:**
```json
{
  "year": 2024,
  "month": 3,
  "month_name": "March",
  "location": {
    "latitude": 23.8103,
    "longitude": 90.4125,
    "timezone": "+06:00",
    "name": "Dhaka"
  },
  "method": "hanafi",
  "format": "full",
  "total_days": 31,
  "days": [
    {
      "date": "2024-03-01",
      "day_of_week": "Friday",
      "day_of_week_short": "Fri",
      "day_number": 1,
      "prayer_times": {
        "fajr": "04:48",
        "sunrise": "06:10",
        "dhuhr": "12:08",
        "asr": "15:30",
        "maghrib": "18:02",
        "sunset": "18:02",
        "isha": "19:29"
      },
      "fasting": {
        "sehri_end": "04:38",
        "fajr": "04:48",
        "iftar": "18:02",
        "fasting_duration_minutes": 804
      }
    }
    // ... more days
  ],
  "calculated_at": "2024-03-15T10:30:00Z"
}
```

#### 7.1.5 BatchResponse

**TypeScript Interface:**
```typescript
interface BatchResponse {
  // Request metadata
  date?: string;            // Date used for calculations
  method: string;           // Calculation method used
  timezone: string;         // Timezone used
  
  // Results
  total_coordinates: number; // Number of coordinates processed
  results: BatchResult[];    // Array of results for each coordinate
  errors?: BatchError[];     // Array of errors (if any)
  
  // Metadata
  calculated_at: string;    // ISO 8601 timestamp
  request_id?: string;      // Unique request identifier
}

interface BatchResult {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  location?: Location;      // Location information (if found)
  times: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    sunset: string;
    isha: string;
  };
  error?: string;           // Error message (if calculation failed)
}

interface BatchError {
  index: number;            // Index of coordinate in request
  coordinates: {
    latitude: number;
    longitude: number;
  };
  error_code: string;        // Error code
  error_message: string;     // Error message
}
```

**Example:**
```json
{
  "date": "2024-03-15",
  "method": "hanafi",
  "timezone": "+06:00",
  "total_coordinates": 2,
  "results": [
    {
      "coordinates": {
        "latitude": 23.8103,
        "longitude": 90.4125
      },
      "location": {
        "name": "Dhaka",
        "district": "Dhaka"
      },
      "times": {
        "fajr": "04:45",
        "sunrise": "06:12",
        "dhuhr": "12:08",
        "asr": "15:32",
        "maghrib": "18:04",
        "sunset": "18:04",
        "isha": "19:31"
      }
    },
    {
      "coordinates": {
        "latitude": 22.3569,
        "longitude": 91.7832
      },
      "location": {
        "name": "Chittagong",
        "district": "Chittagong"
      },
      "times": {
        "fajr": "04:42",
        "sunrise": "06:08",
        "dhuhr": "12:05",
        "asr": "15:28",
        "maghrib": "18:01",
        "sunset": "18:01",
        "isha": "19:28"
      }
    }
  ],
  "calculated_at": "2024-03-15T10:30:00Z"
}
```

#### 7.1.6 LocationSearchResponse

**TypeScript Interface:**
```typescript
interface LocationSearchResponse {
  query: string;            // Original search query
  total_results: number;    // Total number of matching results
  results: LocationResult[]; // Array of matching locations
  request_id?: string;      // Unique request identifier
}

interface LocationResult {
  name: string;             // Location name
  latitude: number;        // Latitude coordinate
  longitude: number;        // Longitude coordinate
  district?: string;       // District name
  division?: string;        // Division name
  type: LocationType;       // Location type
  population?: number;      // Population (if available)
  altitude?: number;        // Altitude in meters (if available)
  relevance_score: number;  // Relevance score (0.0-1.0)
  distance_km?: number;     // Distance from search center (if applicable)
}
```

**Example:**
```json
{
  "query": "Dhaka",
  "total_results": 3,
  "results": [
    {
      "name": "Dhaka",
      "latitude": 23.8103,
      "longitude": 90.4125,
      "district": "Dhaka",
      "division": "Dhaka",
      "type": "city",
      "population": 21000000,
      "altitude": 4,
      "relevance_score": 1.0
    },
    {
      "name": "Dhaka Cantonment",
      "latitude": 23.8333,
      "longitude": 90.4000,
      "district": "Dhaka",
      "division": "Dhaka",
      "type": "area",
      "relevance_score": 0.8
    }
  ],
  "request_id": "req_abc123"
}
```

#### 7.1.7 ErrorResponse

**TypeScript Interface:**
```typescript
interface ErrorResponse {
  error: {
    code: string;           // Machine-readable error code
    message: string;        // Human-readable error message
    details?: {             // Additional error-specific information
      [key: string]: any;
    };
    request_id?: string;     // Unique request identifier
    timestamp?: string;      // ISO 8601 timestamp
  };
}
```

**Example:**
```json
{
  "error": {
    "code": "INVALID_LATITUDE",
    "message": "Latitude must be between -90 and 90 degrees",
    "details": {
      "parameter": "latitude",
      "value": 95.5,
      "valid_range": [-90, 90]
    },
    "request_id": "req_abc123",
    "timestamp": "2024-03-15T10:30:00Z"
  }
}
```

### 7.2 Database Schema

#### 7.2.1 Pre-calculated Prayer Times Table

**Table: `prayer_times_cache`**

Purpose: Store pre-calculated prayer times for coordinates, dates, and methods to improve API response times.

```sql
CREATE TABLE prayer_times_cache (
  -- Primary Key
  id BIGSERIAL PRIMARY KEY,
  
  -- Coordinates (6 decimal places = ~0.1 meter precision)
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  
  -- Date and Method
  date DATE NOT NULL,
  method VARCHAR(20) NOT NULL CHECK (method IN ('hanafi', 'shafi', 'maliki', 'hanbali', 'custom')),
  
  -- Prayer Times (TIME format: HH:MM:SS)
  fajr TIME NOT NULL,
  sunrise TIME NOT NULL,
  dhuhr TIME NOT NULL,
  asr TIME NOT NULL,
  maghrib TIME NOT NULL,
  sunset TIME NOT NULL,
  isha TIME NOT NULL,
  
  -- Optional Precise Times (with seconds)
  fajr_precise TIME,
  sunrise_precise TIME,
  dhuhr_precise TIME,
  asr_precise TIME,
  maghrib_precise TIME,
  sunset_precise TIME,
  isha_precise TIME,
  
  -- Metadata
  timezone VARCHAR(10) DEFAULT '+06:00',
  calculated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_coordinate_date_method UNIQUE(latitude, longitude, date, method),
  CONSTRAINT check_latitude_range CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT check_longitude_range CHECK (longitude >= -180 AND longitude <= 180),
  CONSTRAINT check_bangladesh_bounds CHECK (
    latitude >= 20.738 AND latitude <= 26.638 AND
    longitude >= 88.084 AND longitude <= 92.673
  )
);

-- Indexes for Performance
CREATE INDEX idx_coordinate_date ON prayer_times_cache(latitude, longitude, date);
CREATE INDEX idx_date_method ON prayer_times_cache(date, method);
CREATE INDEX idx_method ON prayer_times_cache(method);
CREATE INDEX idx_date_range ON prayer_times_cache(date) WHERE date >= CURRENT_DATE;
CREATE INDEX idx_coordinate_grid ON prayer_times_cache(
  ROUND(latitude::numeric, 2),
  ROUND(longitude::numeric, 2)
); -- For 0.01° grid lookups

-- Partial Index for Recent Dates (most queries)
CREATE INDEX idx_recent_dates ON prayer_times_cache(date, method)
WHERE date >= CURRENT_DATE - INTERVAL '1 year';

-- Comments
COMMENT ON TABLE prayer_times_cache IS 'Pre-calculated prayer times cache for performance optimization';
COMMENT ON COLUMN prayer_times_cache.latitude IS 'Latitude in decimal degrees (6 decimal places precision)';
COMMENT ON COLUMN prayer_times_cache.longitude IS 'Longitude in decimal degrees (6 decimal places precision)';
COMMENT ON COLUMN prayer_times_cache.method IS 'Islamic calculation method (madhab)';
```

**Table Statistics:**
- **Estimated Rows**: ~270,810 grid points × 365 days × 4 methods = ~395 million rows (full coverage)
- **Storage per Row**: ~200 bytes
- **Total Storage**: ~79 GB (full coverage, one year)
- **Optimization**: Use selective caching for popular coordinates

#### 7.2.2 Locations Table

**Table: `locations`**

Purpose: Store known locations (cities, districts, landmarks) with coordinates for location search and reverse geocoding.

```sql
CREATE TABLE locations (
  -- Primary Key
  id BIGSERIAL PRIMARY KEY,
  
  -- Location Information
  name VARCHAR(255) NOT NULL,
  name_bengali VARCHAR(255), -- Bengali name for search
  name_alternatives TEXT[], -- Alternative names/spellings
  
  -- Coordinates
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  altitude INTEGER, -- meters above sea level
  
  -- Administrative Information
  district VARCHAR(100),
  division VARCHAR(100),
  country VARCHAR(2) DEFAULT 'BD',
  
  -- Location Type
  type VARCHAR(20) NOT NULL CHECK (type IN ('city', 'district', 'area', 'landmark', 'mosque')),
  
  -- Additional Information
  population BIGINT,
  is_popular BOOLEAN DEFAULT FALSE, -- Popular locations for priority caching
  
  -- Search Optimization
  search_vector tsvector, -- Full-text search vector
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_latitude_range CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT check_longitude_range CHECK (longitude >= -180 AND longitude <= 180),
  CONSTRAINT check_bangladesh_bounds CHECK (
    latitude >= 20.738 AND latitude <= 26.638 AND
    longitude >= 88.084 AND longitude <= 92.673
  )
);

-- Indexes
CREATE INDEX idx_location_coords ON locations(latitude, longitude);
CREATE INDEX idx_location_name ON locations(name);
CREATE INDEX idx_location_name_bengali ON locations(name_bengali);
CREATE INDEX idx_location_district ON locations(district);
CREATE INDEX idx_location_division ON locations(division);
CREATE INDEX idx_location_type ON locations(type);
CREATE INDEX idx_location_popular ON locations(is_popular) WHERE is_popular = TRUE;

-- Full-text Search Index
CREATE INDEX idx_location_search ON locations USING GIN(search_vector);

-- Composite Index for Common Queries
CREATE INDEX idx_location_district_division ON locations(district, division);

-- Comments
COMMENT ON TABLE locations IS 'Known locations for search and reverse geocoding';
COMMENT ON COLUMN locations.search_vector IS 'Full-text search vector for name search';
```

**Initial Data:**
- **Cities**: All major cities (8+ cities)
- **Districts**: All 64 districts
- **Divisions**: All 8 divisions
- **Landmarks**: Major mosques and landmarks (optional)

#### 7.2.3 Fasting Times Cache Table

**Table: `fasting_times_cache`**

Purpose: Store pre-calculated fasting times separately for efficient retrieval.

```sql
CREATE TABLE fasting_times_cache (
  -- Primary Key
  id BIGSERIAL PRIMARY KEY,
  
  -- Reference to prayer_times_cache (optional, for normalization)
  prayer_times_id BIGINT REFERENCES prayer_times_cache(id) ON DELETE CASCADE,
  
  -- Coordinates
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  
  -- Date and Method
  date DATE NOT NULL,
  method VARCHAR(20) NOT NULL,
  sehri_margin INTEGER DEFAULT 10 CHECK (sehri_margin >= 5 AND sehri_margin <= 15),
  
  -- Fasting Times
  sehri_end TIME NOT NULL,
  fajr TIME NOT NULL,
  sunrise TIME NOT NULL,
  sunset TIME NOT NULL,
  iftar TIME NOT NULL,
  maghrib TIME NOT NULL,
  
  -- Durations (stored for quick access)
  fasting_duration_minutes INTEGER NOT NULL,
  day_length_minutes INTEGER NOT NULL,
  
  -- Metadata
  calculated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_fasting_coordinate_date_method UNIQUE(latitude, longitude, date, method, sehri_margin),
  CONSTRAINT check_durations CHECK (
    fasting_duration_minutes > 0 AND
    day_length_minutes > 0 AND
    fasting_duration_minutes <= 1440 AND
    day_length_minutes <= 1440
  )
);

-- Indexes
CREATE INDEX idx_fasting_coordinate_date ON fasting_times_cache(latitude, longitude, date);
CREATE INDEX idx_fasting_date_method ON fasting_times_cache(date, method);
CREATE INDEX idx_fasting_ramadan ON fasting_times_cache(date) 
WHERE date BETWEEN '2024-03-10' AND '2024-04-09'; -- Example Ramadan period
```

#### 7.2.4 API Request Log Table

**Table: `api_requests`**

Purpose: Log API requests for analytics, rate limiting, and debugging.

```sql
CREATE TABLE api_requests (
  -- Primary Key
  id BIGSERIAL PRIMARY KEY,
  
  -- Request Information
  request_id VARCHAR(255) UNIQUE NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL, -- GET, POST
  
  -- Authentication
  api_key_id VARCHAR(255), -- API key identifier (hashed)
  ip_address INET,
  
  -- Request Parameters
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  date DATE,
  calculation_method VARCHAR(20),
  
  -- Response Information
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER, -- Response time in milliseconds
  cache_hit BOOLEAN DEFAULT FALSE,
  
  -- Error Information (if applicable)
  error_code VARCHAR(100),
  error_message TEXT,
  
  -- Metadata
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_requests_api_key ON api_requests(api_key_id, created_at);
CREATE INDEX idx_requests_endpoint ON api_requests(endpoint, created_at);
CREATE INDEX idx_requests_date ON api_requests(created_at);
CREATE INDEX idx_requests_status ON api_requests(status_code, created_at);
CREATE INDEX idx_requests_coordinate ON api_requests(latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Partitioning (optional, for large scale)
-- Partition by month for efficient querying and archiving
```

#### 7.2.5 Calculation Methods Configuration Table

**Table: `calculation_methods`**

Purpose: Store configuration for different calculation methods (madhabs).

```sql
CREATE TABLE calculation_methods (
  -- Primary Key
  id SERIAL PRIMARY KEY,
  
  -- Method Information
  method_code VARCHAR(20) UNIQUE NOT NULL, -- hanafi, shafi, maliki, hanbali
  method_name VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- Calculation Parameters
  fajr_angle DECIMAL(5,2) NOT NULL, -- Default Fajr angle
  isha_angle DECIMAL(5,2) NOT NULL, -- Default Isha angle
  asr_shadow_factor DECIMAL(3,2) DEFAULT 1.0, -- Shadow factor for Asr
  
  -- Regional Variations
  supports_regional_variations BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Initial Data
INSERT INTO calculation_methods (method_code, method_name, fajr_angle, isha_angle, asr_shadow_factor) VALUES
('hanafi', 'Hanafi', 18.0, 18.0, 1.0),
('shafi', 'Shafi', 20.0, 18.0, 1.0),
('maliki', 'Maliki', 18.0, 17.0, 1.0),
('hanbali', 'Hanbali', 18.0, 17.0, 1.0);

-- Indexes
CREATE INDEX idx_methods_active ON calculation_methods(is_active) WHERE is_active = TRUE;
```

#### 7.2.6 Database Relationships

**Entity Relationship Diagram (ERD):**

```
locations (1) ────< (many) prayer_times_cache
                      (coordinates reference)

calculation_methods (1) ────< (many) prayer_times_cache
                              (method reference)

prayer_times_cache (1) ────< (many) fasting_times_cache
                              (optional reference)
```

**Foreign Key Relationships:**
- `fasting_times_cache.prayer_times_id` → `prayer_times_cache.id` (optional, for normalization)
- Both tables can reference `calculation_methods.method_code` (logical relationship)

#### 7.2.7 Database Maintenance

**Table Maintenance:**
```sql
-- Vacuum and Analyze (PostgreSQL)
VACUUM ANALYZE prayer_times_cache;
VACUUM ANALYZE locations;
VACUUM ANALYZE fasting_times_cache;

-- Update Statistics
ANALYZE prayer_times_cache;
ANALYZE locations;
```

**Partitioning Strategy (for large scale):**
```sql
-- Partition prayer_times_cache by date range
CREATE TABLE prayer_times_cache_2024 PARTITION OF prayer_times_cache
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE prayer_times_cache_2025 PARTITION OF prayer_times_cache
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

**Backup Strategy:**
- **Daily Backups**: Full database backup daily
- **Retention**: 30 days of backups
- **Point-in-Time Recovery**: Enable WAL archiving
- **Replication**: Read replicas for scaling

#### 7.2.8 Data Validation and Constraints

**Coordinate Validation:**
- All latitude values: -90 to 90
- All longitude values: -180 to 180
- Bangladesh bounds: Latitude 20.738-26.638, Longitude 88.084-92.673

**Time Validation:**
- All times: Valid TIME format (HH:MM:SS)
- Time sequence: Fajr < Sunrise < Dhuhr < Asr < Maghrib < Isha
- Durations: Positive and reasonable (10-17 hours for Bangladesh)

**Method Validation:**
- Method codes: Must exist in `calculation_methods` table
- Valid methods: hanafi, shafi, maliki, hanbali, custom

**Date Validation:**
- Dates: Valid DATE format
- Range: Current date to 10 years in future
- Leap years: Handled correctly

### 7.3 Data Relationships and Normalization

#### 7.3.1 Entity Relationships

**Primary Relationships:**
1. **Location ↔ Prayer Times**: One-to-many (one location can have many prayer time records)
2. **Location ↔ Fasting Times**: One-to-many (one location can have many fasting time records)
3. **Calculation Method ↔ Prayer Times**: One-to-many (one method can have many prayer time records)
4. **Prayer Times ↔ Fasting Times**: One-to-one (optional, fasting times can reference prayer times)

**Relationship Diagram:**
```
Location (1) ────────< (many) PrayerTimes
                          │
                          │ (optional)
                          ▼
                    FastingTimes

CalculationMethod (1) ────< (many) PrayerTimes
```

#### 7.3.2 Data Normalization

**Normalization Level: 3NF (Third Normal Form)**

**Normalized Tables:**
- `locations`: Stores location information (no duplication)
- `calculation_methods`: Stores method configurations (no duplication)
- `prayer_times_cache`: Stores prayer times (denormalized for performance)
- `fasting_times_cache`: Stores fasting times (denormalized for performance)

**Denormalization Strategy:**
- **Purpose**: Improve query performance
- **Trade-off**: Some data duplication for faster reads
- **Justification**: Prayer times are read-heavy, write-light
- **Storage**: Acceptable storage increase for significant performance gain

**Example of Denormalization:**
```sql
-- Normalized (not used):
prayer_times_cache.location_id → locations.id

-- Denormalized (actual):
prayer_times_cache.latitude, longitude (stored directly)
```

#### 7.3.3 Data Integrity

**Referential Integrity:**
- Foreign keys where applicable
- Cascade deletes for dependent records
- Check constraints for data validation

**Business Rules:**
- Prayer times must follow time sequence
- Fasting duration must be positive
- Coordinates must be within Bangladesh bounds
- Method codes must be valid

**Data Consistency:**
- Unique constraints prevent duplicates
- Check constraints enforce business rules
- Triggers for automatic timestamp updates

### 7.4 Data Access Patterns

#### 7.4.1 Common Query Patterns

**Query 1: Get Prayer Times for Coordinate and Date**
```sql
SELECT * FROM prayer_times_cache
WHERE latitude = 23.8103
  AND longitude = 90.4125
  AND date = '2024-03-15'
  AND method = 'hanafi';
```

**Query 2: Get Monthly Calendar**
```sql
SELECT * FROM prayer_times_cache
WHERE latitude = 23.8103
  AND longitude = 90.4125
  AND date >= '2024-03-01'
  AND date <= '2024-03-31'
  AND method = 'hanafi'
ORDER BY date;
```

**Query 3: Location Search**
```sql
SELECT * FROM locations
WHERE name ILIKE '%dhaka%'
   OR name_bengali ILIKE '%ঢাকা%'
ORDER BY relevance_score DESC
LIMIT 10;
```

**Query 4: Find Nearest Grid Point**
```sql
SELECT latitude, longitude
FROM prayer_times_cache
WHERE ROUND(latitude::numeric, 2) = ROUND(23.8103::numeric, 2)
  AND ROUND(longitude::numeric, 2) = ROUND(90.4125::numeric, 2)
  AND date = '2024-03-15'
  AND method = 'hanafi'
LIMIT 1;
```

#### 7.4.2 Caching Strategy

**Cache Layers:**
1. **Application Cache (Redis)**: Frequently accessed coordinates
2. **Database Cache**: Pre-calculated times table
3. **CDN Cache**: Static responses (if applicable)

**Cache Key Strategy:**
```
prayer_times:{latitude}:{longitude}:{date}:{method}
fasting_times:{latitude}:{longitude}:{date}:{method}:{sehri_margin}
location:{name}
```

**Cache Invalidation:**
- **Time-based**: Cache expires after 1 hour (for today's times)
- **Date-based**: Cache expires at end of day
- **Manual**: Clear cache on method configuration changes

### 7.5 Data Migration and Versioning

#### 7.5.1 Schema Versioning

**Version Control:**
- Use migration files for schema changes
- Track schema versions in database
- Support rollback for failed migrations

**Migration Example:**
```sql
-- Migration: Add precise times column
ALTER TABLE prayer_times_cache
ADD COLUMN fajr_precise TIME;

-- Migration: Add index
CREATE INDEX idx_fajr_precise ON prayer_times_cache(fajr_precise)
WHERE fajr_precise IS NOT NULL;
```

#### 7.5.2 Data Migration Strategy

**Initial Data Population:**
1. **Locations**: Import from CSV/JSON file
2. **Calculation Methods**: Insert default methods
3. **Prayer Times**: Calculate on-demand or batch pre-calculate

**Data Import Script:**
```sql
-- Import locations from CSV
COPY locations(name, latitude, longitude, district, division, type)
FROM '/path/to/locations.csv'
WITH (FORMAT csv, HEADER true);
```

### 7.6 Data Security and Privacy

#### 7.6.1 Data Protection

**Sensitive Data:**
- **API Keys**: Store hashed, never in plain text
- **IP Addresses**: Store for rate limiting, anonymize after retention period
- **User Data**: No personal information stored (privacy by design)

**Access Control:**
- **Database Users**: Separate users for read/write operations
- **Connection Encryption**: SSL/TLS for database connections
- **Backup Encryption**: Encrypt database backups

#### 7.6.2 Data Retention

**Retention Policies:**
- **Prayer Times Cache**: Keep indefinitely (astronomical data doesn't change)
- **API Request Logs**: 90 days retention, then archive
- **Error Logs**: 30 days retention

**Data Archival:**
```sql
-- Archive old request logs
INSERT INTO api_requests_archive
SELECT * FROM api_requests
WHERE created_at < NOW() - INTERVAL '90 days';

DELETE FROM api_requests
WHERE created_at < NOW() - INTERVAL '90 days';
```

### 7.7 Data Model Examples

#### 7.7.1 Complete API Response Example

**Prayer Times Response:**
```json
{
  "date": "2024-03-15",
  "location": {
    "latitude": 23.8103,
    "longitude": 90.4125,
    "timezone": "+06:00",
    "name": "Dhaka",
    "district": "Dhaka",
    "division": "Dhaka",
    "country": "BD",
    "type": "city"
  },
  "method": "hanafi",
  "times": {
    "fajr": "04:45",
    "sunrise": "06:12",
    "dhuhr": "12:08",
    "asr": "15:32",
    "maghrib": "18:04",
    "sunset": "18:04",
    "isha": "19:31"
  },
  "calculated_at": "2024-03-15T10:30:00Z",
  "request_id": "req_abc123",
  "cache_hit": true
}
```

#### 7.7.2 Database Record Example

**Prayer Times Cache Record:**
```sql
INSERT INTO prayer_times_cache (
  latitude, longitude, date, method,
  fajr, sunrise, dhuhr, asr, maghrib, sunset, isha,
  timezone, calculated_at
) VALUES (
  23.8103, 90.4125, '2024-03-15', 'hanafi',
  '04:45:00', '06:12:00', '12:08:00', '15:32:00', '18:04:00', '18:04:00', '19:31:00',
  '+06:00', NOW()
);
```

**Location Record:**
```sql
INSERT INTO locations (
  name, name_bengali, latitude, longitude,
  district, division, type, population, is_popular
) VALUES (
  'Dhaka', 'ঢাকা', 23.8103, 90.4125,
  'Dhaka', 'Dhaka', 'city', 21000000, TRUE
);
```

---

## 8. Implementation Considerations

### 8.1 Technology Stack Selection

#### 8.1.1 Backend Framework Options

**Node.js with Express.js:**
- **Pros**: 
  - Fast development and deployment
  - Large ecosystem and community
  - Excellent for I/O-intensive operations
  - Easy integration with MySQL/PostgreSQL
  - Good performance for API endpoints
- **Cons**: 
  - Single-threaded (mitigated with clustering)
  - Less suitable for CPU-intensive calculations (can use worker threads)
- **Recommended For**: Rapid development, microservices architecture
- **Performance**: High throughput, low latency for API requests

**Python with FastAPI:**
- **Pros**:
  - Excellent for scientific/astronomical calculations
  - Rich ecosystem for mathematical computations
  - FastAPI provides automatic API documentation
  - Strong typing with Pydantic
- **Cons**:
  - Generally slower than Node.js for I/O operations
  - GIL limitations for CPU-bound tasks
- **Recommended For**: Data-heavy calculations, scientific accuracy focus
- **Performance**: Good for calculation-heavy workloads

**Java with Spring Boot:**
- **Pros**:
  - Enterprise-grade reliability
  - Strong typing and compile-time safety
  - Excellent performance and scalability
  - Mature ecosystem
- **Cons**:
  - Higher memory footprint
  - Slower development cycle
  - More verbose code
- **Recommended For**: Enterprise applications, high-scale deployments
- **Performance**: Excellent for high-concurrency scenarios

**Recommendation**: Node.js with Express.js for this project due to:
- Fast API development
- Good MySQL integration
- Sufficient performance for calculation workload
- Easy deployment and scaling

#### 8.1.2 Database Selection

**MySQL:**
- **Pros**:
  - Widely used and well-documented
  - Excellent performance for read-heavy workloads
  - Good caching mechanisms
  - Strong community support
  - Cost-effective hosting options
- **Cons**:
  - Less advanced features compared to PostgreSQL
  - Limited JSON support (improved in MySQL 8.0)
- **Use Case**: Primary database for this project
- **Configuration**: InnoDB engine, proper indexing, connection pooling

**PostgreSQL:**
- **Pros**:
  - Advanced features (JSON, full-text search, arrays)
  - Better for complex queries
  - Strong ACID compliance
  - Excellent for geographic data (PostGIS extension)
- **Cons**:
  - Slightly more complex setup
  - Higher resource usage
- **Use Case**: Alternative option if advanced features needed

**Redis (Caching Layer):**
- **Pros**:
  - Extremely fast in-memory caching
  - Support for complex data structures
  - Pub/sub capabilities
  - Persistence options
- **Cons**:
  - Memory-intensive
  - Additional infrastructure component
- **Use Case**: Secondary cache layer for frequently accessed data

**Recommendation**: MySQL for primary storage, Redis for hot cache (optional)

#### 8.1.3 Calculation Libraries

**JavaScript/Node.js Libraries:**

**Option 1: Custom Implementation (Recommended)**
- **Pros**: Full control, optimized for specific use case, no dependencies
- **Cons**: Requires implementation and testing
- **Implementation**: Use formulas from Section 3 of this document
- **Performance**: Optimal, no external library overhead

**Option 2: Adhan Library (by Batoul Apps)**
- **Package**: `adhan` (npm)
- **Pros**: Well-tested, supports multiple methods
- **Cons**: May need customization for Bangladesh-specific requirements
- **Usage**: `npm install adhan`
- **Example**:
  ```javascript
  import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
  const coordinates = new Coordinates(23.8103, 90.4125);
  const params = CalculationMethod.MuslimWorldLeague();
  const prayerTimes = new PrayerTimes(coordinates, new Date(), params);
  ```

**Python Libraries:**

**Option 1: Astral Library**
- **Package**: `astral`
- **Pros**: Comprehensive astronomical calculations
- **Cons**: May need Islamic calculation method additions
- **Usage**: `pip install astral`

**Option 2: Prayer-Times Library**
- **Package**: `prayer-times`
- **Pros**: Specifically designed for Islamic prayer times
- **Cons**: May need updates for latest methods
- **Usage**: `pip install prayer-times`

**Java Libraries:**

**Custom Implementation Recommended:**
- Use astronomical formulas directly
- Implement using Java's `Math` library
- Better control and performance
- No external dependencies

**C# Libraries:**

**PrayerTimesCalculator:**
- Available on NuGet
- Supports multiple calculation methods
- Well-maintained community library

**Recommendation**: Custom implementation for Node.js to ensure:
- Full control over calculations
- Optimization for Bangladesh-specific requirements
- No external dependencies
- Better performance

### 8.2 Project Structure and Architecture

#### 8.2.1 Recommended Project Structure

**Node.js/Express Structure:**
```
src/
├── config/
│   ├── database.js          # Database configuration
│   ├── constants.js          # Application constants
│   └── environment.js        # Environment variables
├── controllers/
│   ├── prayerTimesController.js
│   ├── fastingTimesController.js
│   └── calendarController.js
├── middleware/
│   ├── validation.js         # Input validation
│   ├── errorHandler.js       # Error handling
│   ├── rateLimiter.js        # Rate limiting
│   └── logger.js             # Request logging
├── models/
│   ├── PrayerTime.js         # Data models
│   ├── Location.js
│   └── FastingTime.js
├── routes/
│   ├── prayerTimes.js
│   ├── fastingTimes.js
│   └── calendar.js
├── services/
│   ├── calculationService.js # Business logic
│   ├── cacheService.js       # Caching logic
│   └── locationService.js    # Location lookup
├── utils/
│   ├── calculations.js       # Astronomical calculations
│   ├── validators.js         # Validation utilities
│   └── formatters.js         # Response formatting
├── database/
│   ├── migrations/           # Database migrations
│   ├── seeds/                # Seed data
│   └── schema.sql            # Database schema
└── server.js                 # Application entry point
```

**Key Principles:**
- **Separation of Concerns**: Controllers, services, and utilities separated
- **Single Responsibility**: Each module has one clear purpose
- **Dependency Injection**: Services injected into controllers
- **Configuration Management**: Centralized configuration
- **Error Handling**: Consistent error handling throughout

#### 8.2.2 Design Patterns

**Repository Pattern:**
- Abstract database access
- Easy to swap database implementations
- Testable with mock repositories
- Example:
  ```javascript
  class PrayerTimeRepository {
    async findByCoordinate(lat, lng, date, method) { }
    async save(prayerTime) { }
    async findByDateRange(lat, lng, startDate, endDate, method) { }
  }
  ```

**Service Layer Pattern:**
- Business logic separated from controllers
- Reusable across different endpoints
- Easier to test
- Example:
  ```javascript
  class CalculationService {
    calculatePrayerTimes(lat, lng, date, method) { }
    calculateFastingTimes(lat, lng, date, method, margin) { }
    validateCoordinates(lat, lng) { }
  }
  ```

**Factory Pattern:**
- Create calculation method objects
- Easy to add new methods
- Example:
  ```javascript
  class CalculationMethodFactory {
    create(methodName) {
      switch(methodName) {
        case 'hanafi': return new HanafiMethod();
        case 'shafi': return new ShafiMethod();
        // ...
      }
    }
  }
  ```

**Strategy Pattern:**
- Different calculation strategies
- Interchangeable algorithms
- Example:
  ```javascript
  class CalculationStrategy {
    calculateFajr(lat, lng, date) { }
    calculateIsha(lat, lng, date) { }
  }
  ```

#### 8.2.3 Code Organization Best Practices

**Module Organization:**
- **One file per class/function group**
- **Clear naming conventions** (camelCase for variables, PascalCase for classes)
- **Consistent file structure** (imports, constants, functions, exports)
- **Documentation** (JSDoc comments for functions)

**Error Handling:**
- **Custom error classes** for different error types
- **Centralized error handling** middleware
- **Consistent error response format**
- **Error logging** for debugging

**Configuration Management:**
- **Environment variables** for configuration
- **Configuration validation** on startup
- **Default values** for optional settings
- **Separate configs** for dev/staging/production

### 8.3 Database Implementation

#### 8.3.1 Database Connection Management

**Connection Pooling:**
```javascript
// MySQL connection pool configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,        // Maximum connections
  queueLimit: 0,              // Unlimited queue
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});
```

**Connection Pool Sizing:**
- **Formula**: `connections = ((core_count * 2) + effective_spindle_count)`
- **For API servers**: 10-20 connections typically sufficient
- **Monitor**: Connection usage and adjust based on load
- **Best Practice**: Start with 10, scale based on metrics

**Connection Lifecycle:**
1. **Acquire**: Get connection from pool
2. **Use**: Execute queries
3. **Release**: Return connection to pool
4. **Error Handling**: Always release connection, even on errors

#### 8.3.2 Query Optimization

**Indexing Strategy:**
```sql
-- Primary indexes for prayer_times_cache
CREATE INDEX idx_coordinate_date ON prayer_times_cache(latitude, longitude, date);
CREATE INDEX idx_date_method ON prayer_times_cache(date, method);

-- Composite index for common queries
CREATE INDEX idx_lat_lng_date_method ON prayer_times_cache(latitude, longitude, date, method);

-- Partial index for recent dates (most queries)
CREATE INDEX idx_recent_dates ON prayer_times_cache(date, method)
WHERE date >= CURRENT_DATE - INTERVAL '1 year';
```

**Query Optimization Techniques:**
- **Use prepared statements** to prevent SQL injection and improve performance
- **Limit result sets** when possible
- **Avoid SELECT *** - specify needed columns
- **Use EXPLAIN** to analyze query plans
- **Batch operations** for multiple inserts/updates

**Example Optimized Query:**
```sql
-- Efficient lookup with index
SELECT fajr, sunrise, dhuhr, asr, maghrib, sunset, isha
FROM prayer_times_cache
WHERE latitude = 23.8103
  AND longitude = 90.4125
  AND date = '2024-03-15'
  AND method = 'hanafi'
LIMIT 1;
```

#### 8.3.3 Caching Strategy

**Multi-Level Caching:**

**Level 1: Application Memory Cache (Node.js)**
- **Technology**: Node.js Map or LRU cache
- **TTL**: 1 hour for today's times
- **Size Limit**: 1000 entries
- **Use Case**: Frequently accessed coordinates
- **Implementation**:
  ```javascript
  const NodeCache = require('node-cache');
  const cache = new NodeCache({ stdTTL: 3600, maxKeys: 1000 });
  ```

**Level 2: Database Cache (MySQL)**
- **Technology**: MySQL tables (prayer_times_cache, fasting_times_cache)
- **TTL**: Indefinite (astronomical data doesn't change)
- **Use Case**: All calculated times
- **Benefits**: Persistent, queryable, sharable across instances

**Level 3: Redis Cache (Optional)**
- **Technology**: Redis
- **TTL**: 1 hour for today, 24 hours for future dates
- **Use Case**: Hot data, frequently accessed coordinates
- **Benefits**: Extremely fast, distributed caching

**Cache Key Strategy:**
```javascript
// Cache key format
const cacheKey = `prayer:${lat}:${lng}:${date}:${method}`;
const fastingKey = `fasting:${lat}:${lng}:${date}:${method}:${margin}`;
```

**Cache Invalidation:**
- **Time-based**: Expire after TTL
- **Manual**: Clear cache on method configuration changes
- **Never invalidate**: Astronomical data doesn't change

### 8.4 Performance Optimization

#### 8.4.1 Calculation Optimization

**Pre-computation:**
- **Solar declination**: Calculate once per day, reuse for all coordinates
- **Equation of time**: Calculate once per day, reuse for all coordinates
- **Method parameters**: Load once, reuse for all calculations

**Calculation Caching:**
```javascript
// Cache intermediate calculations
const declinationCache = new Map();
function getSolarDeclination(date) {
  const dateKey = date.toISOString().split('T')[0];
  if (!declinationCache.has(dateKey)) {
    declinationCache.set(dateKey, calculateSolarDeclination(date));
  }
  return declinationCache.get(dateKey);
}
```

**Batch Processing:**
- **Parallel calculations**: Use Promise.all() for multiple coordinates
- **Worker threads**: Offload CPU-intensive calculations (if needed)
- **Background jobs**: Pre-calculate popular coordinates

**Algorithm Optimization:**
- **Minimize trigonometric calculations**: Cache sin/cos values
- **Use efficient formulas**: Prefer simpler calculations where possible
- **Avoid unnecessary conversions**: Work in consistent units

#### 8.4.2 API Performance

**Response Time Optimization:**
- **Database queries**: Optimize with proper indexes
- **Response compression**: Use gzip compression
- **Minimize payload**: Only return requested data
- **Pagination**: For large result sets (monthly/yearly calendars)

**Concurrent Request Handling:**
- **Connection pooling**: Efficient database connection management
- **Async/await**: Non-blocking I/O operations
- **Clustering**: Multiple Node.js processes (if needed)
- **Load balancing**: Distribute requests across instances

**Example Performance Targets:**
- **Cached requests**: < 50ms response time
- **Uncached requests**: < 200ms response time
- **Batch requests**: < 1 second per coordinate
- **Monthly calendar**: < 2 seconds

#### 8.4.3 Database Performance

**Query Optimization:**
- **Index usage**: Ensure queries use indexes
- **Query analysis**: Use EXPLAIN to identify bottlenecks
- **Connection pooling**: Reuse connections efficiently
- **Prepared statements**: Faster query execution

**Table Optimization:**
- **Partitioning**: Partition by date for large tables (optional)
- **Archiving**: Archive old request logs
- **Vacuum/Analyze**: Regular maintenance (PostgreSQL)
- **OPTIMIZE TABLE**: Regular maintenance (MySQL)

**Monitoring:**
- **Slow query log**: Identify slow queries
- **Connection monitoring**: Track connection pool usage
- **Query performance**: Monitor query execution times
- **Cache hit rates**: Track cache effectiveness

### 8.5 Error Handling and Logging

#### 8.5.1 Error Handling Strategy

**Error Classification:**
- **Validation Errors** (400): Invalid input parameters
- **Authentication Errors** (401): Missing/invalid API key
- **Authorization Errors** (403): Insufficient permissions
- **Not Found Errors** (404): Resource not found
- **Rate Limit Errors** (429): Too many requests
- **Server Errors** (500): Internal server errors
- **Service Unavailable** (503): Service temporarily down

**Error Handling Pattern:**
```javascript
// Custom error classes
class ValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.code = 'VALIDATION_ERROR';
    this.statusCode = 400;
    this.details = details;
  }
}

// Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message,
      details: err.details,
      request_id: req.id
    }
  });
});
```

**Error Recovery:**
- **Graceful degradation**: Return cached data if calculation fails
- **Retry logic**: Retry transient failures
- **Circuit breaker**: Prevent cascade failures
- **Fallback values**: Use defaults when possible

#### 8.5.2 Logging Strategy

**Log Levels:**
- **ERROR**: Errors that need attention
- **WARN**: Warnings that may indicate issues
- **INFO**: General information (requests, responses)
- **DEBUG**: Detailed debugging information

**Logging Implementation:**
```javascript
// Structured logging
const logger = {
  error: (message, meta) => console.error(JSON.stringify({ level: 'error', message, ...meta })),
  warn: (message, meta) => console.warn(JSON.stringify({ level: 'warn', message, ...meta })),
  info: (message, meta) => console.info(JSON.stringify({ level: 'info', message, ...meta })),
  debug: (message, meta) => console.debug(JSON.stringify({ level: 'debug', message, ...meta }))
};

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: Date.now() - start,
      request_id: req.id
    });
  });
  next();
});
```

**Log Storage:**
- **Application logs**: File-based or cloud logging service
- **Database logs**: Store in api_requests table
- **Error tracking**: Use services like Sentry, Rollbar
- **Access logs**: Standard web server access logs

**Log Retention:**
- **Application logs**: 30 days
- **Error logs**: 90 days
- **Request logs**: 90 days (then archive)
- **Access logs**: 7 days

### 8.6 Security Implementation

#### 8.6.1 Input Validation

**Validation Layers:**
1. **API Gateway**: Basic validation (if using)
2. **Middleware**: Parameter validation
3. **Service Layer**: Business rule validation
4. **Database**: Constraint validation

**Validation Implementation:**
```javascript
// Using Joi for validation
const schema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  date: Joi.date().iso().optional(),
  method: Joi.string().valid('hanafi', 'shafi', 'maliki', 'hanbali').optional()
});

const { error, value } = schema.validate(req.query);
if (error) {
  return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: error.message } });
}
```

**SQL Injection Prevention:**
- **Prepared statements**: Always use parameterized queries
- **Input sanitization**: Validate and sanitize all inputs
- **ORM/Query Builder**: Use libraries that prevent SQL injection

#### 8.6.2 API Security

**Authentication:**
- **API Keys**: Simple authentication for API access
- **OAuth 2.0**: For advanced integrations (optional)
- **Rate Limiting**: Prevent abuse
- **IP Whitelisting**: For sensitive endpoints (optional)

**Rate Limiting Implementation:**
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' } }
});
app.use('/api/', limiter);
```

**HTTPS/TLS:**
- **SSL Certificates**: Use valid SSL certificates
- **TLS 1.2+**: Enforce minimum TLS version
- **HSTS**: HTTP Strict Transport Security headers

**Security Headers:**
```javascript
// Using Helmet.js
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: true,
  hsts: { maxAge: 31536000, includeSubDomains: true }
}));
```

### 8.7 Testing Strategy

#### 8.7.1 Unit Testing

**Calculation Function Tests:**
```javascript
// Example test structure
describe('Prayer Time Calculations', () => {
  test('should calculate Fajr correctly for Dhaka', () => {
    const date = new Date('2024-03-15');
    const times = calculatePrayerTimes(23.8103, 90.4125, date, 'hanafi');
    expect(times.fajr).toMatch(/^\d{2}:\d{2}$/);
    expect(times.fajr).toBe('04:45'); // Expected value
  });
  
  test('should handle edge cases', () => {
    // Test polar day/night (not applicable for Bangladesh)
    // Test date boundaries
    // Test invalid coordinates
  });
});
```

**Test Coverage:**
- **Calculation functions**: 100% coverage
- **Validation functions**: 100% coverage
- **Utility functions**: 90%+ coverage
- **Controllers**: 80%+ coverage

#### 8.7.2 Integration Testing

**API Endpoint Tests:**
```javascript
// Example integration test
describe('GET /v1/prayer-times', () => {
  test('should return prayer times for valid coordinates', async () => {
    const response = await request(app)
      .get('/v1/prayer-times')
      .query({ latitude: 23.8103, longitude: 90.4125, date: '2024-03-15' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('times');
    expect(response.body.times).toHaveProperty('fajr');
  });
  
  test('should return 400 for invalid coordinates', async () => {
    const response = await request(app)
      .get('/v1/prayer-times')
      .query({ latitude: 95, longitude: 90.4125 });
    
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_LATITUDE');
  });
});
```

**Database Integration Tests:**
- Test database connections
- Test query execution
- Test caching mechanisms
- Test transaction handling

#### 8.7.3 Performance Testing

**Load Testing:**
- **Tools**: Apache Bench, k6, Artillery
- **Scenarios**: 
  - Normal load: 100 requests/second
  - Peak load: 1000 requests/second
  - Stress test: 5000 requests/second
- **Metrics**: Response time, error rate, throughput

**Example Load Test:**
```bash
# Using Apache Bench
ab -n 10000 -c 100 http://localhost:3000/v1/prayer-times?latitude=23.8103&longitude=90.4125
```

### 8.8 Deployment Considerations

#### 8.8.1 Environment Configuration

**Environment Variables:**
```bash
# Development
NODE_ENV=development
PORT=3000
DB_HOST=localhost

# Production
NODE_ENV=production
PORT=3000
DB_HOST=db.production.com
LOG_LEVEL=info
```

**Configuration Management:**
- **Environment-specific configs**: Separate configs for dev/staging/prod
- **Secrets management**: Use environment variables or secret management services
- **Configuration validation**: Validate on startup
- **Default values**: Sensible defaults for optional settings

#### 8.8.2 Deployment Process

**Build Process:**
1. **Install dependencies**: `npm install --production`
2. **Run tests**: `npm test`
3. **Build assets**: If any (none for this API)
4. **Create deployment package**: Docker image or deployment package

**Deployment Steps:**
1. **Database migration**: Run migrations on target database
2. **Seed data**: Seed initial data if needed
3. **Deploy application**: Deploy to server/container
4. **Health check**: Verify application is running
5. **Smoke tests**: Test critical endpoints

**Rollback Strategy:**
- **Database migrations**: Reversible migrations
- **Application rollback**: Keep previous version available
- **Database backup**: Before major changes
- **Monitoring**: Watch for errors after deployment

#### 8.8.3 Monitoring and Observability

**Application Monitoring:**
- **Health checks**: `/health` endpoint
- **Metrics**: Response times, error rates, request counts
- **Logging**: Structured logging for all requests
- **Alerting**: Alerts for errors, high latency, downtime

**Key Metrics to Monitor:**
- **Response time**: p50, p95, p99 percentiles
- **Error rate**: Percentage of failed requests
- **Throughput**: Requests per second
- **Cache hit rate**: Percentage of cached responses
- **Database connection pool**: Active/idle connections
- **Memory usage**: Application memory consumption
- **CPU usage**: CPU utilization

**Monitoring Tools:**
- **Application Performance Monitoring (APM)**: New Relic, Datadog, AppDynamics
- **Logging**: ELK Stack, Splunk, CloudWatch Logs
- **Metrics**: Prometheus, Grafana, CloudWatch Metrics
- **Error Tracking**: Sentry, Rollbar, Bugsnag

### 8.9 Bangladesh-Specific Considerations

#### 8.9.1 Time Zone Implementation

**Time Zone Handling:**
```javascript
// Always use Bangladesh Standard Time (UTC+6)
const BANGLADESH_TIMEZONE = '+06:00';
const BANGLADESH_OFFSET = 6; // hours

// Convert to BST
function toBST(utcTime) {
  return new Date(utcTime.getTime() + (6 * 60 * 60 * 1000));
}
```

**No Daylight Saving Time:**
- Bangladesh does not observe DST
- All calculations use fixed UTC+6 offset
- No need for DST handling logic
- Simpler implementation

#### 8.9.2 Regional Variations

**Coastal Areas:**
- **Slight refraction differences**: May need fine-tuning
- **Implementation**: Use standard 0.833° correction (sufficient for most cases)
- **Future enhancement**: Location-specific refraction adjustments

**Hill Tracts (Chittagong Hill Tracts):**
- **Altitude considerations**: Higher elevations may need adjustment
- **Current implementation**: Uses sea-level calculations
- **Future enhancement**: Altitude-based adjustments

**Urban vs Rural:**
- **Horizon obstruction**: Urban areas with tall buildings
- **Current implementation**: Assumes clear horizon
- **Future enhancement**: User-configurable horizon adjustments

**Regional Method Preferences:**
- **Northern Bangladesh**: May prefer 15° Fajr angle (Hanafi)
- **Southern Bangladesh**: Typically use 18° Fajr angle (Hanafi)
- **Implementation**: Support both through method configuration

### 8.10 Code Quality and Best Practices

#### 8.10.1 Code Standards

**Coding Style:**
- **ESLint**: Use ESLint for JavaScript
- **Prettier**: Code formatting
- **Consistent naming**: camelCase for variables, PascalCase for classes
- **Comments**: JSDoc comments for functions

**Code Review Checklist:**
- [ ] Code follows style guide
- [ ] Functions are well-documented
- [ ] Error handling is appropriate
- [ ] Tests are included
- [ ] Performance considerations addressed
- [ ] Security considerations addressed

#### 8.10.2 Documentation

**Code Documentation:**
- **JSDoc comments**: For all public functions
- **README files**: For each module
- **API documentation**: OpenAPI/Swagger specification
- **Architecture documentation**: System design documents

**Example JSDoc:**
```javascript
/**
 * Calculate prayer times for a given coordinate and date
 * @param {number} latitude - Latitude in decimal degrees (-90 to 90)
 * @param {number} longitude - Longitude in decimal degrees (-180 to 180)
 * @param {Date} date - Date for calculation
 * @param {string} method - Calculation method ('hanafi', 'shafi', 'maliki', 'hanbali')
 * @returns {Object} Prayer times object with fajr, sunrise, dhuhr, asr, maghrib, sunset, isha
 * @throws {Error} If coordinates are invalid or calculation fails
 */
function calculatePrayerTimes(latitude, longitude, date, method) {
  // Implementation
}
```

#### 8.10.3 Version Control

**Git Workflow:**
- **Main branch**: Production-ready code
- **Develop branch**: Integration branch
- **Feature branches**: New features
- **Release branches**: Release preparation

**Commit Messages:**
- **Format**: `<type>(<scope>): <subject>`
- **Types**: feat, fix, docs, style, refactor, test, chore
- **Example**: `feat(api): add monthly calendar endpoint`

**Branch Naming:**
- **Features**: `feature/prayer-times-endpoint`
- **Bugs**: `fix/coordinate-validation`
- **Hotfixes**: `hotfix/critical-bug`

### 8.11 Maintenance and Updates

#### 8.11.1 Regular Maintenance Tasks

**Daily:**
- Monitor error rates and response times
- Check database connection pool usage
- Review application logs for issues

**Weekly:**
- Review performance metrics
- Check cache hit rates
- Analyze slow queries

**Monthly:**
- Database optimization (VACUUM, OPTIMIZE)
- Review and update dependencies
- Security updates
- Backup verification

**Quarterly:**
- Performance review and optimization
- Capacity planning
- Architecture review
- Documentation updates

#### 8.11.2 Dependency Management

**Dependency Updates:**
- **Regular updates**: Check for updates monthly
- **Security patches**: Apply immediately
- **Major versions**: Test thoroughly before upgrading
- **Lock files**: Use package-lock.json or yarn.lock

**Dependency Audit:**
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

#### 8.11.3 Backup and Recovery

**Database Backups:**
- **Frequency**: Daily full backups
- **Retention**: 30 days
- **Testing**: Monthly restore tests
- **Offsite storage**: Backup to separate location

**Application Backups:**
- **Configuration**: Version control
- **Code**: Git repository
- **Secrets**: Secure secret management
- **Deployment packages**: Keep previous versions

**Disaster Recovery:**
- **Recovery Time Objective (RTO)**: 4 hours
- **Recovery Point Objective (RPO)**: 24 hours
- **Backup verification**: Regular restore tests
- **Documentation**: Recovery procedures documented

---

## 9. Testing Strategy

### 9.1 Testing Overview

#### 9.1.1 Testing Philosophy

**Testing Principles:**
- **Comprehensive Coverage**: Test all critical paths and edge cases
- **Automated Testing**: All tests should be automated and runnable in CI/CD
- **Fast Feedback**: Tests should run quickly for rapid development cycles
- **Maintainable Tests**: Tests should be easy to understand and maintain
- **Realistic Data**: Use real-world test data from Bangladesh

**Testing Pyramid:**
```
        /\
       /  \      E2E Tests (Few)
      /____\     
     /      \    Integration Tests (Some)
    /________\   
   /          \  Unit Tests (Many)
  /____________\
```

**Test Coverage Goals:**
- **Unit Tests**: 90%+ coverage for calculation functions
- **Integration Tests**: 80%+ coverage for API endpoints
- **Validation Tests**: 100% coverage for critical calculations
- **Performance Tests**: All critical endpoints

#### 9.1.2 Testing Tools and Frameworks

**Node.js Testing Stack:**
- **Test Framework**: Jest or Mocha with Chai
- **HTTP Testing**: Supertest for API endpoint testing
- **Mocking**: Sinon for mocks and stubs
- **Coverage**: Istanbul/NYC for code coverage
- **Assertions**: Chai or Jest assertions

**Example Setup:**
```json
{
  "devDependencies": {
    "jest": "^29.0.0",
    "supertest": "^6.3.0",
    "@types/jest": "^29.0.0"
  },
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 9.2 Unit Tests

#### 9.2.1 Astronomical Calculation Tests

**Test Structure:**
```javascript
describe('Astronomical Calculations', () => {
  describe('Solar Declination', () => {
    test('should calculate declination for March 15, 2024', () => {
      const date = new Date('2024-03-15');
      const declination = calculateSolarDeclination(date);
      expect(declination).toBeCloseTo(-2.39, 2);
    });
    
    test('should calculate declination for summer solstice', () => {
      const date = new Date('2024-06-21');
      const declination = calculateSolarDeclination(date);
      expect(declination).toBeCloseTo(23.45, 1);
    });
    
    test('should calculate declination for winter solstice', () => {
      const date = new Date('2024-12-21');
      const declination = calculateSolarDeclination(date);
      expect(declination).toBeCloseTo(-23.45, 1);
    });
  });
  
  describe('Equation of Time', () => {
    test('should calculate EoT for March 15, 2024', () => {
      const date = new Date('2024-03-15');
      const eot = calculateEquationOfTime(date);
      expect(eot).toBeCloseTo(-9.64, 1);
    });
    
    test('should return EoT in minutes', () => {
      const date = new Date('2024-03-15');
      const eot = calculateEquationOfTime(date);
      expect(eot).toBeGreaterThan(-16);
      expect(eot).toBeLessThan(16);
    });
  });
  
  describe('Solar Noon', () => {
    test('should calculate solar noon for Dhaka', () => {
      const date = new Date('2024-03-15');
      const longitude = 90.4125; // Dhaka
      const solarNoon = calculateSolarNoon(longitude, date);
      expect(solarNoon).toBeCloseTo(11.87 * 60, 1); // ~11:52 in minutes
    });
  });
  
  describe('Hour Angle', () => {
    test('should calculate hour angle for Fajr', () => {
      const latitude = 23.8103;
      const declination = -2.39;
      const fajrAngle = -18;
      const hourAngle = calculateHourAngle(latitude, declination, fajrAngle);
      expect(hourAngle).toBeGreaterThan(0);
      expect(hourAngle).toBeLessThan(180);
    });
    
    test('should handle edge case: sun never sets', () => {
      // Test for polar day (not applicable for Bangladesh but good to test)
      const latitude = 80; // High latitude
      const declination = 20; // Summer
      const hourAngle = calculateHourAngle(latitude, declination, -0.833);
      // Should return 0 or handle gracefully
      expect(hourAngle).toBeDefined();
    });
  });
});
```

**Test Data:**
- **Known Values**: Use verified astronomical data for specific dates
- **Edge Cases**: Test solstices, equinoxes, leap years
- **Boundary Conditions**: Test extreme coordinates (within Bangladesh bounds)

#### 9.2.2 Prayer Time Calculation Tests

**Test Structure:**
```javascript
describe('Prayer Time Calculations', () => {
  const dhakaCoords = { lat: 23.8103, lng: 90.4125 };
  const testDate = new Date('2024-03-15');
  
  describe('Hanafi Method', () => {
    test('should calculate all prayer times for Dhaka', () => {
      const times = calculatePrayerTimes(
        dhakaCoords.lat, 
        dhakaCoords.lng, 
        testDate, 
        'hanafi'
      );
      
      expect(times).toHaveProperty('fajr');
      expect(times).toHaveProperty('sunrise');
      expect(times).toHaveProperty('dhuhr');
      expect(times).toHaveProperty('asr');
      expect(times).toHaveProperty('maghrib');
      expect(times).toHaveProperty('sunset');
      expect(times).toHaveProperty('isha');
      
      // Validate time format
      expect(times.fajr).toMatch(/^\d{2}:\d{2}$/);
    });
    
    test('should have correct time sequence', () => {
      const times = calculatePrayerTimes(
        dhakaCoords.lat, 
        dhakaCoords.lng, 
        testDate, 
        'hanafi'
      );
      
      const parseTime = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };
      
      expect(parseTime(times.fajr)).toBeLessThan(parseTime(times.sunrise));
      expect(parseTime(times.sunrise)).toBeLessThan(parseTime(times.dhuhr));
      expect(parseTime(times.dhuhr)).toBeLessThan(parseTime(times.asr));
      expect(parseTime(times.asr)).toBeLessThan(parseTime(times.maghrib));
      expect(parseTime(times.maghrib)).toBeLessThan(parseTime(times.isha));
    });
    
    test('should match expected values for Dhaka on March 15, 2024', () => {
      const times = calculatePrayerTimes(
        dhakaCoords.lat, 
        dhakaCoords.lng, 
        testDate, 
        'hanafi'
      );
      
      // Expected values (with tolerance of ±2 minutes)
      expect(times.fajr).toMatch(/04:4[3-7]/);
      expect(times.dhuhr).toMatch(/12:0[6-9]/);
      expect(times.maghrib).toMatch(/18:0[2-6]/);
    });
  });
  
  describe('Different Calculation Methods', () => {
    test('should produce different Fajr times for different methods', () => {
      const hanafi = calculatePrayerTimes(23.8103, 90.4125, testDate, 'hanafi');
      const shafi = calculatePrayerTimes(23.8103, 90.4125, testDate, 'shafi');
      
      // Shafi should have earlier Fajr (20° vs 18°)
      const parseTime = (t) => t.split(':').map(Number).reduce((h, m) => h * 60 + m);
      expect(parseTime(shafi.fajr)).toBeLessThan(parseTime(hanafi.fajr));
    });
  });
  
  describe('Coordinate Variations', () => {
    test('should produce different times for different coordinates', () => {
      const dhaka = calculatePrayerTimes(23.8103, 90.4125, testDate, 'hanafi');
      const chittagong = calculatePrayerTimes(22.3569, 91.7832, testDate, 'hanafi');
      
      // Times should differ (within reasonable range)
      expect(dhaka.maghrib).not.toBe(chittagong.maghrib);
    });
  });
});
```

#### 9.2.3 Fasting Time Calculation Tests

**Test Structure:**
```javascript
describe('Fasting Time Calculations', () => {
  const dhakaCoords = { lat: 23.8103, lng: 90.4125 };
  const testDate = new Date('2024-03-15');
  
  test('should calculate all fasting times', () => {
    const fasting = calculateFastingTimes(
      dhakaCoords.lat, 
      dhakaCoords.lng, 
      testDate, 
      'hanafi', 
      10
    );
    
    expect(fasting).toHaveProperty('sehri_end');
    expect(fasting).toHaveProperty('fajr');
    expect(fasting).toHaveProperty('iftar');
    expect(fasting).toHaveProperty('fasting_duration_minutes');
    expect(fasting).toHaveProperty('day_length_minutes');
  });
  
  test('should have Sehri end before Fajr', () => {
    const fasting = calculateFastingTimes(
      dhakaCoords.lat, 
      dhakaCoords.lng, 
      testDate, 
      'hanafi', 
      10
    );
    
    const parseTime = (t) => t.split(':').map(Number).reduce((h, m) => h * 60 + m);
    expect(parseTime(fasting.sehri_end)).toBeLessThan(parseTime(fasting.fajr));
  });
  
  test('should respect Sehri margin', () => {
    const fasting10 = calculateFastingTimes(23.8103, 90.4125, testDate, 'hanafi', 10);
    const fasting15 = calculateFastingTimes(23.8103, 90.4125, testDate, 'hanafi', 15);
    
    const parseTime = (t) => t.split(':').map(Number).reduce((h, m) => h * 60 + m);
    const diff = parseTime(fasting10.sehri_end) - parseTime(fasting15.sehri_end);
    expect(Math.abs(diff)).toBe(5); // 5 minutes difference
  });
  
  test('should calculate reasonable fasting duration', () => {
    const fasting = calculateFastingTimes(
      dhakaCoords.lat, 
      dhakaCoords.lng, 
      testDate, 
      'hanafi', 
      10
    );
    
    // Fasting duration should be between 10-17 hours for Bangladesh
    expect(fasting.fasting_duration_minutes).toBeGreaterThan(10 * 60);
    expect(fasting.fasting_duration_minutes).toBeLessThan(17 * 60);
  });
});
```

#### 9.2.4 Utility Function Tests

**Test Structure:**
```javascript
describe('Utility Functions', () => {
  describe('Time Formatting', () => {
    test('should format minutes to HH:MM', () => {
      expect(minutesToTime(285)).toBe('04:45'); // 4 hours 45 minutes
      expect(minutesToTime(1080)).toBe('18:00'); // 18 hours
      expect(minutesToTime(1445)).toBe('00:05'); // Next day (handles overflow)
    });
  });
  
  describe('Coordinate Validation', () => {
    test('should validate Bangladesh coordinates', () => {
      expect(validateCoordinates(23.8103, 90.4125)).toBe(true);
      expect(validateCoordinates(20.738, 88.084)).toBe(true); // Boundary
      expect(validateCoordinates(26.638, 92.673)).toBe(true); // Boundary
    });
    
    test('should reject coordinates outside Bangladesh', () => {
      expect(validateCoordinates(30.0, 90.0)).toBe(false); // Too far north
      expect(validateCoordinates(20.0, 90.0)).toBe(false); // Too far south
      expect(validateCoordinates(23.0, 85.0)).toBe(false); // Too far west
      expect(validateCoordinates(23.0, 95.0)).toBe(false); // Too far east
    });
  });
  
  describe('Date Validation', () => {
    test('should validate date format', () => {
      expect(validateDate('2024-03-15')).toBe(true);
      expect(validateDate('2024-12-31')).toBe(true);
      expect(validateDate('2024-02-29')).toBe(true); // Leap year
    });
    
    test('should reject invalid dates', () => {
      expect(validateDate('2024-13-45')).toBe(false);
      expect(validateDate('2024-02-30')).toBe(false);
      expect(validateDate('invalid')).toBe(false);
    });
  });
});
```

### 9.3 Integration Tests

#### 9.3.1 API Endpoint Tests

**Test Setup:**
```javascript
import request from 'supertest';
import app from '../src/server.js';

describe('API Endpoints', () => {
  describe('GET /v1/prayer-times', () => {
    test('should return prayer times for valid coordinates', async () => {
      const response = await request(app)
        .get('/v1/prayer-times')
        .query({
          latitude: 23.8103,
          longitude: 90.4125,
          date: '2024-03-15',
          method: 'hanafi'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('date');
      expect(response.body).toHaveProperty('location');
      expect(response.body).toHaveProperty('times');
      expect(response.body.times).toHaveProperty('fajr');
      expect(response.body.times).toHaveProperty('sunrise');
      expect(response.body.times).toHaveProperty('dhuhr');
      expect(response.body.times).toHaveProperty('asr');
      expect(response.body.times).toHaveProperty('maghrib');
      expect(response.body.times).toHaveProperty('sunset');
      expect(response.body.times).toHaveProperty('isha');
    });
    
    test('should use today as default date', async () => {
      const response = await request(app)
        .get('/v1/prayer-times')
        .query({
          latitude: 23.8103,
          longitude: 90.4125
        });
      
      expect(response.status).toBe(200);
      const today = new Date().toISOString().split('T')[0];
      expect(response.body.date).toBe(today);
    });
    
    test('should default to hanafi method', async () => {
      const response = await request(app)
        .get('/v1/prayer-times')
        .query({
          latitude: 23.8103,
          longitude: 90.4125
        });
      
      expect(response.status).toBe(200);
      expect(response.body.method).toBe('hanafi');
    });
    
    test('should return 400 for invalid latitude', async () => {
      const response = await request(app)
        .get('/v1/prayer-times')
        .query({
          latitude: 95.0,
          longitude: 90.4125
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_LATITUDE');
    });
    
    test('should return 400 for coordinates outside Bangladesh', async () => {
      const response = await request(app)
        .get('/v1/prayer-times')
        .query({
          latitude: 30.0,
          longitude: 90.0
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('COORDINATES_OUT_OF_BOUNDS');
    });
    
    test('should return 400 for invalid method', async () => {
      const response = await request(app)
        .get('/v1/prayer-times')
        .query({
          latitude: 23.8103,
          longitude: 90.4125,
          method: 'invalid_method'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_METHOD');
    });
    
    test('should return cached result when available', async () => {
      // First request
      const response1 = await request(app)
        .get('/v1/prayer-times')
        .query({
          latitude: 23.8103,
          longitude: 90.4125,
          date: '2024-03-15'
        });
      
      expect(response1.status).toBe(200);
      
      // Second request should be cached
      const response2 = await request(app)
        .get('/v1/prayer-times')
        .query({
          latitude: 23.8103,
          longitude: 90.4125,
          date: '2024-03-15'
        });
      
      expect(response2.status).toBe(200);
      expect(response2.body.cache_hit).toBe(true);
    });
  });
  
  describe('GET /v1/fasting-times', () => {
    test('should return fasting times for valid coordinates', async () => {
      const response = await request(app)
        .get('/v1/fasting-times')
        .query({
          latitude: 23.8103,
          longitude: 90.4125,
          date: '2024-03-15',
          method: 'hanafi',
          sehri_margin: 10
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('fasting');
      expect(response.body.fasting).toHaveProperty('sehri_end');
      expect(response.body.fasting).toHaveProperty('fajr');
      expect(response.body.fasting).toHaveProperty('iftar');
      expect(response.body.fasting).toHaveProperty('fasting_duration_minutes');
    });
    
    test('should return 400 for invalid Sehri margin', async () => {
      const response = await request(app)
        .get('/v1/fasting-times')
        .query({
          latitude: 23.8103,
          longitude: 90.4125,
          date: '2024-03-15',
          sehri_margin: 20
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('INVALID_SEHRI_MARGIN');
    });
  });
  
  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ok');
    });
  });
});
```

#### 9.3.2 Database Integration Tests

**Test Structure:**
```javascript
import pool from '../src/config/database.js';

describe('Database Integration', () => {
  beforeAll(async () => {
    // Set up test database connection
  });
  
  afterAll(async () => {
    // Clean up test database
    await pool.end();
  });
  
  beforeEach(async () => {
    // Clear test data before each test
    await pool.query('DELETE FROM prayer_times_cache WHERE date = ?', ['2024-03-15']);
  });
  
  describe('Prayer Times Cache', () => {
    test('should insert prayer times into cache', async () => {
      const [result] = await pool.query(
        `INSERT INTO prayer_times_cache 
         (latitude, longitude, date, method, fajr, sunrise, dhuhr, asr, maghrib, sunset, isha)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [23.8103, 90.4125, '2024-03-15', 'hanafi', 
         '04:45:00', '06:12:00', '12:08:00', '15:32:00', '18:04:00', '18:04:00', '19:31:00']
      );
      
      expect(result.affectedRows).toBe(1);
    });
    
    test('should retrieve prayer times from cache', async () => {
      // Insert test data
      await pool.query(
        `INSERT INTO prayer_times_cache 
         (latitude, longitude, date, method, fajr, sunrise, dhuhr, asr, maghrib, sunset, isha)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [23.8103, 90.4125, '2024-03-15', 'hanafi', 
         '04:45:00', '06:12:00', '12:08:00', '15:32:00', '18:04:00', '18:04:00', '19:31:00']
      );
      
      // Retrieve
      const [rows] = await pool.query(
        `SELECT * FROM prayer_times_cache 
         WHERE latitude = ? AND longitude = ? AND date = ? AND method = ?`,
        [23.8103, 90.4125, '2024-03-15', 'hanafi']
      );
      
      expect(rows.length).toBe(1);
      expect(rows[0].fajr).toBe('04:45:00');
    });
    
    test('should prevent duplicate entries', async () => {
      // First insert
      await pool.query(
        `INSERT INTO prayer_times_cache 
         (latitude, longitude, date, method, fajr, sunrise, dhuhr, asr, maghrib, sunset, isha)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [23.8103, 90.4125, '2024-03-15', 'hanafi', 
         '04:45:00', '06:12:00', '12:08:00', '15:32:00', '18:04:00', '18:04:00', '19:31:00']
      );
      
      // Duplicate insert should fail
      await expect(
        pool.query(
          `INSERT INTO prayer_times_cache 
           (latitude, longitude, date, method, fajr, sunrise, dhuhr, asr, maghrib, sunset, isha)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [23.8103, 90.4125, '2024-03-15', 'hanafi', 
           '04:45:00', '06:12:00', '12:08:00', '15:32:00', '18:04:00', '18:04:00', '19:31:00']
        )
      ).rejects.toThrow();
    });
  });
  
  describe('Location Lookup', () => {
    test('should find location by name', async () => {
      const [rows] = await pool.query(
        `SELECT * FROM locations WHERE name = ?`,
        ['Dhaka']
      );
      
      expect(rows.length).toBeGreaterThan(0);
      expect(rows[0].latitude).toBeCloseTo(23.8103, 4);
      expect(rows[0].longitude).toBeCloseTo(90.4125, 4);
    });
    
    test('should find locations by coordinate proximity', async () => {
      const [rows] = await pool.query(
        `SELECT * FROM locations 
         WHERE ABS(latitude - ?) < 0.01 AND ABS(longitude - ?) < 0.01 
         ORDER BY is_popular DESC LIMIT 1`,
        [23.8103, 90.4125]
      );
      
      expect(rows.length).toBeGreaterThan(0);
    });
  });
});
```

#### 9.3.3 Caching Mechanism Tests

**Test Structure:**
```javascript
describe('Caching Mechanisms', () => {
  test('should cache prayer times after first calculation', async () => {
    // Clear cache
    await pool.query('DELETE FROM prayer_times_cache WHERE date = ?', ['2024-03-15']);
    
    // First request (should calculate)
    const response1 = await request(app)
      .get('/v1/prayer-times')
      .query({
        latitude: 23.8103,
        longitude: 90.4125,
        date: '2024-03-15'
      });
    
    expect(response1.status).toBe(200);
    expect(response1.body.cache_hit).toBe(false);
    
    // Second request (should be cached)
    const response2 = await request(app)
      .get('/v1/prayer-times')
      .query({
        latitude: 23.8103,
        longitude: 90.4125,
        date: '2024-03-15'
      });
    
    expect(response2.status).toBe(200);
    expect(response2.body.cache_hit).toBe(true);
    expect(response2.body.times.fajr).toBe(response1.body.times.fajr);
  });
  
  test('should use different cache entries for different methods', async () => {
    const hanafi = await request(app)
      .get('/v1/prayer-times')
      .query({
        latitude: 23.8103,
        longitude: 90.4125,
        date: '2024-03-15',
        method: 'hanafi'
      });
    
    const shafi = await request(app)
      .get('/v1/prayer-times')
      .query({
        latitude: 23.8103,
        longitude: 90.4125,
        date: '2024-03-15',
        method: 'shafi'
      });
    
    expect(hanafi.body.times.fajr).not.toBe(shafi.body.times.fajr);
  });
});
```

### 9.4 Validation Tests

#### 9.4.1 Accuracy Validation

**Comparison with Known Sources:**
```javascript
describe('Accuracy Validation', () => {
  // Known prayer times from established sources
  const knownTimes = {
    '2024-03-15': {
      dhaka: {
        hanafi: {
          fajr: '04:45',
          dhuhr: '12:08',
          maghrib: '18:04',
          isha: '19:31'
        }
      }
    }
  };
  
  test('should match known prayer times for Dhaka', () => {
    const date = new Date('2024-03-15');
    const times = calculatePrayerTimes(23.8103, 90.4125, date, 'hanafi');
    
    const known = knownTimes['2024-03-15'].dhaka.hanafi;
    
    // Allow ±2 minutes tolerance
    expect(compareTime(times.fajr, known.fajr)).toBeLessThanOrEqual(2);
    expect(compareTime(times.dhuhr, known.dhuhr)).toBeLessThanOrEqual(2);
    expect(compareTime(times.maghrib, known.maghrib)).toBeLessThanOrEqual(2);
    expect(compareTime(times.isha, known.isha)).toBeLessThanOrEqual(2);
  });
  
  function compareTime(time1, time2) {
    const parse = (t) => t.split(':').map(Number).reduce((h, m) => h * 60 + m);
    return Math.abs(parse(time1) - parse(time2));
  }
});
```

**Cross-Validation with Multiple Sources:**
```javascript
describe('Cross-Validation', () => {
  test('should validate against multiple calculation sources', async () => {
    const coordinates = [
      { lat: 23.8103, lng: 90.4125, name: 'Dhaka' },
      { lat: 22.3569, lng: 91.7832, name: 'Chittagong' },
      { lat: 24.8949, lng: 91.8687, name: 'Sylhet' }
    ];
    
    for (const coord of coordinates) {
      const times = calculatePrayerTimes(coord.lat, coord.lng, new Date('2024-03-15'), 'hanafi');
      
      // Validate time sequence
      expect(validateTimeSequence(times)).toBe(true);
      
      // Validate time ranges (reasonable for Bangladesh)
      expect(validateTimeRanges(times)).toBe(true);
    }
  });
});
```

#### 9.4.2 Edge Case Tests

**Boundary Conditions:**
```javascript
describe('Edge Cases', () => {
  describe('Coordinate Boundaries', () => {
    test('should handle northernmost Bangladesh coordinate', () => {
      const times = calculatePrayerTimes(26.638, 88.084, new Date('2024-03-15'), 'hanafi');
      expect(validateTimeSequence(times)).toBe(true);
    });
    
    test('should handle southernmost Bangladesh coordinate', () => {
      const times = calculatePrayerTimes(20.738, 92.673, new Date('2024-03-15'), 'hanafi');
      expect(validateTimeSequence(times)).toBe(true);
    });
    
    test('should handle easternmost Bangladesh coordinate', () => {
      const times = calculatePrayerTimes(24.8949, 92.673, new Date('2024-03-15'), 'hanafi');
      expect(validateTimeSequence(times)).toBe(true);
    });
    
    test('should handle westernmost Bangladesh coordinate', () => {
      const times = calculatePrayerTimes(26.638, 88.084, new Date('2024-03-15'), 'hanafi');
      expect(validateTimeSequence(times)).toBe(true);
    });
  });
  
  describe('Date Boundaries', () => {
    test('should handle leap year dates', () => {
      const times = calculatePrayerTimes(23.8103, 90.4125, new Date('2024-02-29'), 'hanafi');
      expect(validateTimeSequence(times)).toBe(true);
    });
    
    test('should handle year boundaries', () => {
      const times1 = calculatePrayerTimes(23.8103, 90.4125, new Date('2024-12-31'), 'hanafi');
      const times2 = calculatePrayerTimes(23.8103, 90.4125, new Date('2025-01-01'), 'hanafi');
      expect(validateTimeSequence(times1)).toBe(true);
      expect(validateTimeSequence(times2)).toBe(true);
    });
    
    test('should handle solstices', () => {
      const summer = calculatePrayerTimes(23.8103, 90.4125, new Date('2024-06-21'), 'hanafi');
      const winter = calculatePrayerTimes(23.8103, 90.4125, new Date('2024-12-21'), 'hanafi');
      
      expect(validateTimeSequence(summer)).toBe(true);
      expect(validateTimeSequence(winter)).toBe(true);
      
      // Summer should have longer days
      const parseTime = (t) => t.split(':').map(Number).reduce((h, m) => h * 60 + m);
      const summerDayLength = parseTime(summer.maghrib) - parseTime(summer.sunrise);
      const winterDayLength = parseTime(winter.maghrib) - parseTime(winter.sunrise);
      expect(summerDayLength).toBeGreaterThan(winterDayLength);
    });
  });
  
  describe('Calculation Method Variations', () => {
    test('should handle all calculation methods', () => {
      const methods = ['hanafi', 'shafi', 'maliki', 'hanbali'];
      
      for (const method of methods) {
        const times = calculatePrayerTimes(23.8103, 90.4125, new Date('2024-03-15'), method);
        expect(validateTimeSequence(times)).toBe(true);
      }
    });
  });
});
```

### 9.5 Performance Tests

#### 9.5.1 Load Testing

**Load Test Scenarios:**
```javascript
// Using k6 for load testing
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 },  // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests under 200ms
    http_req_failed: ['rate<0.01'],   // Less than 1% failures
  },
};

export default function () {
  const response = http.get('http://localhost:3000/v1/prayer-times?latitude=23.8103&longitude=90.4125');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
    'has prayer times': (r) => JSON.parse(r.body).times !== undefined,
  });
  
  sleep(1);
}
```

**Performance Benchmarks:**
```javascript
describe('Performance Benchmarks', () => {
  test('should respond to prayer times request in < 200ms (cached)', async () => {
    // Warm up cache
    await request(app)
      .get('/v1/prayer-times')
      .query({ latitude: 23.8103, longitude: 90.4125, date: '2024-03-15' });
    
    const start = Date.now();
    const response = await request(app)
      .get('/v1/prayer-times')
      .query({ latitude: 23.8103, longitude: 90.4125, date: '2024-03-15' });
    const duration = Date.now() - start;
    
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(200); // 200ms target
  });
  
  test('should respond to prayer times request in < 500ms (uncached)', async () => {
    // Clear cache
    await pool.query('DELETE FROM prayer_times_cache WHERE date = ?', ['2024-03-16']);
    
    const start = Date.now();
    const response = await request(app)
      .get('/v1/prayer-times')
      .query({ latitude: 23.8103, longitude: 90.4125, date: '2024-03-16' });
    const duration = Date.now() - start;
    
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(500); // 500ms target for uncached
  });
  
  test('should handle concurrent requests', async () => {
    const requests = Array(100).fill(null).map(() =>
      request(app)
        .get('/v1/prayer-times')
        .query({ latitude: 23.8103, longitude: 90.4125, date: '2024-03-15' })
    );
    
    const start = Date.now();
    const responses = await Promise.all(requests);
    const duration = Date.now() - start;
    
    expect(responses.every(r => r.status === 200)).toBe(true);
    expect(duration).toBeLessThan(5000); // All requests in 5 seconds
  });
});
```

#### 9.5.2 Cache Performance Tests

**Cache Hit Rate Testing:**
```javascript
describe('Cache Performance', () => {
  test('should achieve high cache hit rate', async () => {
    const coordinates = [
      { lat: 23.8103, lng: 90.4125 },
      { lat: 22.3569, lng: 91.7832 },
      { lat: 24.8949, lng: 91.8687 }
    ];
    
    let cacheHits = 0;
    let totalRequests = 0;
    
    // Make multiple requests
    for (let i = 0; i < 100; i++) {
      const coord = coordinates[i % coordinates.length];
      const response = await request(app)
        .get('/v1/prayer-times')
        .query({
          latitude: coord.lat,
          longitude: coord.lng,
          date: '2024-03-15'
        });
      
      totalRequests++;
      if (response.body.cache_hit) cacheHits++;
    }
    
    const hitRate = (cacheHits / totalRequests) * 100;
    expect(hitRate).toBeGreaterThan(80); // 80% cache hit rate target
  });
});
```

#### 9.5.3 Database Query Performance

**Query Performance Tests:**
```javascript
describe('Database Query Performance', () => {
  test('should execute prayer times lookup query quickly', async () => {
    const start = Date.now();
    const [rows] = await pool.query(
      `SELECT * FROM prayer_times_cache 
       WHERE latitude = ? AND longitude = ? AND date = ? AND method = ?`,
      [23.8103, 90.4125, '2024-03-15', 'hanafi']
    );
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(50); // 50ms target
  });
  
  test('should use indexes efficiently', async () => {
    const [explain] = await pool.query(
      `EXPLAIN SELECT * FROM prayer_times_cache 
       WHERE latitude = ? AND longitude = ? AND date = ?`,
      [23.8103, 90.4125, '2024-03-15']
    );
    
    // Check that index is used
    expect(explain[0].key).toBe('idx_coordinate_date');
  });
});
```

### 9.6 Test Data Management

#### 9.6.1 Test Data Sets

**Standard Test Coordinates:**
```javascript
export const TEST_COORDINATES = {
  dhaka: { lat: 23.8103, lng: 90.4125, name: 'Dhaka' },
  chittagong: { lat: 22.3569, lng: 91.7832, name: 'Chittagong' },
  sylhet: { lat: 24.8949, lng: 91.8687, name: 'Sylhet' },
  rajshahi: { lat: 24.3745, lng: 88.6042, name: 'Rajshahi' },
  khulna: { lat: 22.8456, lng: 89.5403, name: 'Khulna' },
  boundaries: {
    north: { lat: 26.638, lng: 88.084 },
    south: { lat: 20.738, lng: 92.673 },
    east: { lat: 24.8949, lng: 92.673 },
    west: { lat: 26.638, lng: 88.084 }
  }
};
```

**Test Dates:**
```javascript
export const TEST_DATES = {
  normal: new Date('2024-03-15'),
  summerSolstice: new Date('2024-06-21'),
  winterSolstice: new Date('2024-12-21'),
  springEquinox: new Date('2024-03-20'),
  autumnEquinox: new Date('2024-09-22'),
  leapYear: new Date('2024-02-29'),
  yearBoundary: new Date('2024-12-31')
};
```

#### 9.6.2 Test Fixtures

**Known Prayer Times (for validation):**
```javascript
export const KNOWN_PRAYER_TIMES = {
  '2024-03-15': {
    dhaka: {
      hanafi: {
        fajr: '04:45',
        sunrise: '06:12',
        dhuhr: '12:08',
        asr: '15:32',
        maghrib: '18:04',
        sunset: '18:04',
        isha: '19:31'
      }
    }
  }
};
```

### 9.7 Continuous Integration/Continuous Deployment (CI/CD)

#### 9.7.1 CI/CD Pipeline

**GitHub Actions Example:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: test_password
          MYSQL_DATABASE: salat_saom_test
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run database migrations
        run: npm run migrate
        env:
          DB_HOST: localhost
          DB_USER: root
          DB_PASSWORD: test_password
          DB_NAME: salat_saom_test
      
      - name: Run tests
        run: npm test
        env:
          DB_HOST: localhost
          DB_USER: root
          DB_PASSWORD: test_password
          DB_NAME: salat_saom_test
      
      - name: Generate coverage report
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

#### 9.7.2 Test Execution Strategy

**Pre-commit Hooks:**
- Run linter
- Run unit tests
- Check code coverage threshold

**Pull Request Checks:**
- All unit tests
- Integration tests
- Code coverage check
- Linting

**Pre-deployment Checks:**
- Full test suite
- Performance tests
- Security scans
- Database migration tests

### 9.8 Test Maintenance

#### 9.8.1 Test Documentation

**Test Documentation Requirements:**
- **Test Purpose**: What each test validates
- **Test Data**: Source of test data
- **Expected Results**: What results are expected
- **Known Issues**: Any known limitations or issues

#### 9.8.2 Test Refactoring

**When to Refactor Tests:**
- Tests become hard to maintain
- Test data becomes outdated
- Test structure becomes inconsistent
- Performance issues with test suite

**Test Refactoring Best Practices:**
- Keep tests independent
- Use test fixtures for common data
- Extract common test logic to helpers
- Maintain test readability

---

## 10. Deployment Architecture

### 10.1 System Architecture Overview

#### 10.1.1 High-Level Architecture

**Architecture Diagram:**
```
                    Internet
                       |
                  [CDN/Edge]
                       |
              [Load Balancer]
                       |
        +--------------+--------------+
        |              |              |
   [API Server 1] [API Server 2] [API Server N]
        |              |              |
        +--------------+--------------+
                       |
        +--------------+--------------+
        |              |              |
    [MySQL]      [Redis Cache]   [Monitoring]
   (Primary)      (In-Memory)    (APM/Logs)
        |
   [MySQL Replica]
   (Read-Only)
```

**Architecture Principles:**
- **Stateless API Servers**: All API servers are stateless for horizontal scaling
- **Database Separation**: Read replicas for scaling database reads
- **Caching Layer**: Multi-level caching (application, Redis, database)
- **Load Distribution**: Load balancer distributes traffic across instances
- **High Availability**: Multiple instances prevent single point of failure

#### 10.1.2 Component Responsibilities

**API Servers:**
- Handle HTTP requests
- Execute prayer time calculations
- Query database and cache
- Return JSON responses
- Log requests and errors

**Database (MySQL):**
- Store pre-calculated prayer times
- Store location data
- Store calculation method configurations
- Store API request logs
- Provide persistent storage

**Cache (Redis):**
- Store frequently accessed prayer times
- Reduce database load
- Improve response times
- Temporary storage for hot data

**Load Balancer:**
- Distribute incoming requests
- Health check API servers
- SSL/TLS termination
- Rate limiting (optional)

### 10.2 System Components

#### 10.2.1 API Server

**Technology Stack:**
- **Runtime**: Node.js 18+ (LTS)
- **Framework**: Express.js 4.x
- **Language**: JavaScript (ES6+ modules)
- **Process Manager**: PM2 or systemd

**Server Configuration:**
```javascript
// Recommended server settings
const serverConfig = {
  port: process.env.PORT || 3000,
  host: '0.0.0.0', // Listen on all interfaces
  keepAlive: true,
  keepAliveTimeout: 65000,
  headersTimeout: 66000,
  maxConnections: 1000
};
```

**Deployment Options:**

**Option 1: Docker Containers (Recommended)**
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "src/server.js"]
```

**Benefits:**
- Consistent environment across dev/staging/prod
- Easy scaling with container orchestration
- Isolation from host system
- Easy deployment and rollback

**Option 2: Direct Deployment**
- Deploy Node.js application directly on server
- Use PM2 for process management
- Systemd for service management
- Nginx as reverse proxy

**Scaling Strategy:**
- **Horizontal Scaling**: Add more API server instances
- **Load Balancer**: Distribute traffic across instances
- **Auto-scaling**: Scale based on CPU/memory/request metrics
- **Container Orchestration**: Kubernetes or Docker Swarm

**Resource Requirements:**
- **Minimum**: 1 CPU, 512MB RAM per instance
- **Recommended**: 2 CPU, 1GB RAM per instance
- **Production**: 2-4 CPU, 2-4GB RAM per instance
- **Storage**: Minimal (application code only)

#### 10.2.2 Database (MySQL)

**Database Configuration:**
- **Engine**: InnoDB (for transactions and foreign keys)
- **Character Set**: utf8mb4 (for Bengali support)
- **Collation**: utf8mb4_unicode_ci
- **Connection Pooling**: 10-20 connections per API server

**MySQL Configuration:**
```ini
# my.cnf recommendations
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
max_connections = 200
query_cache_size = 64M
query_cache_type = 1
slow_query_log = 1
long_query_time = 1
```

**Database Architecture:**

**Primary Database:**
- **Purpose**: Write operations, primary queries
- **Replication**: Master in replication setup
- **Backup**: Daily automated backups
- **Location**: Same region as API servers (low latency)

**Read Replicas:**
- **Purpose**: Read-only queries (scales read operations)
- **Replication**: Asynchronous replication from primary
- **Use Cases**: Calendar queries, location searches
- **Scaling**: Can have multiple read replicas

**Connection Pooling:**
```javascript
// MySQL connection pool configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,        // Per API server instance
  queueLimit: 0,              // Unlimited queue
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});
```

**Database Backup Strategy:**
- **Full Backup**: Daily at 2 AM (low traffic time)
- **Incremental Backup**: Every 6 hours
- **Backup Retention**: 30 days
- **Backup Storage**: Separate region/cloud storage
- **Backup Verification**: Weekly restore tests

**Database Monitoring:**
- **Query Performance**: Monitor slow queries (>1 second)
- **Connection Pool**: Monitor active/idle connections
- **Replication Lag**: Monitor replica lag
- **Disk Space**: Monitor database growth
- **CPU/Memory**: Monitor database server resources

#### 10.2.3 Cache Layer (Redis)

**Redis Configuration:**
- **Purpose**: In-memory caching for frequently accessed data
- **Data Types**: Strings (JSON), Hashes, Sets
- **TTL Strategy**: 
  - Today's times: 1 hour TTL
  - Future dates: 24 hours TTL
  - Location data: 7 days TTL

**Redis Setup:**
```javascript
// Redis configuration
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  db: 0
});

// Cache key strategy
const cacheKey = `prayer:${lat}:${lng}:${date}:${method}`;
```

**Cache Strategy:**
- **L1 Cache**: Application memory (Node.js Map/LRU)
- **L2 Cache**: Redis (distributed cache)
- **L3 Cache**: Database (persistent cache)

**Cache Invalidation:**
- **Time-based**: TTL expiration
- **Manual**: Clear cache on method configuration changes
- **Never**: Astronomical data doesn't change (no invalidation needed)

**Redis Resource Requirements:**
- **Memory**: 1-2GB for typical usage
- **Persistence**: Optional (RDB snapshots)
- **High Availability**: Redis Sentinel or Cluster mode

#### 10.2.4 Load Balancer

**Load Balancer Configuration:**
- **Type**: Application Load Balancer (Layer 7)
- **Protocol**: HTTP/HTTPS
- **SSL/TLS**: Terminate SSL at load balancer
- **Health Checks**: HTTP GET /health endpoint
- **Session Affinity**: Not required (stateless API)

**Load Balancing Algorithm:**
- **Round Robin**: Default, distributes evenly
- **Least Connections**: Routes to server with fewest connections
- **IP Hash**: For consistent routing (optional)

**Health Check Configuration:**
```yaml
Health Check:
  Path: /health
  Interval: 30 seconds
  Timeout: 5 seconds
  Healthy Threshold: 2
  Unhealthy Threshold: 3
```

**SSL/TLS Configuration:**
- **Certificate**: Let's Encrypt or commercial SSL certificate
- **Protocols**: TLS 1.2, TLS 1.3
- **Ciphers**: Strong ciphers only
- **HSTS**: Enable HTTP Strict Transport Security

#### 10.2.5 CDN and Edge Services

**CDN Configuration:**
- **Purpose**: Serve static assets and documentation
- **Content**: API documentation, static files
- **Caching**: Long TTL for static content
- **Geographic Distribution**: Edge locations worldwide

**API Gateway (Optional):**
- **Purpose**: Centralized API management
- **Features**: Rate limiting, authentication, request/response transformation
- **Options**: AWS API Gateway, Kong, Apigee

### 10.3 Infrastructure Deployment

#### 10.3.1 Cloud Platform Options

**AWS (Amazon Web Services):**

**Recommended Services:**
- **Compute**: EC2 (for API servers) or ECS/EKS (containerized)
- **Database**: RDS MySQL (managed database)
- **Cache**: ElastiCache Redis
- **Load Balancer**: Application Load Balancer (ALB)
- **CDN**: CloudFront
- **Monitoring**: CloudWatch
- **Storage**: S3 (for backups)

**Architecture:**
```
Internet → CloudFront → ALB → EC2/ECS → RDS MySQL
                              ↓
                         ElastiCache Redis
```

**Azure:**

**Recommended Services:**
- **Compute**: Azure App Service or Azure Container Instances
- **Database**: Azure Database for MySQL
- **Cache**: Azure Cache for Redis
- **Load Balancer**: Azure Load Balancer
- **CDN**: Azure CDN
- **Monitoring**: Azure Monitor

**GCP (Google Cloud Platform):**

**Recommended Services:**
- **Compute**: Compute Engine or Cloud Run
- **Database**: Cloud SQL for MySQL
- **Cache**: Memorystore for Redis
- **Load Balancer**: Cloud Load Balancing
- **CDN**: Cloud CDN
- **Monitoring**: Cloud Monitoring

**On-Premises Deployment:**
- **Servers**: Physical or virtual machines
- **Database**: Self-managed MySQL
- **Cache**: Self-managed Redis
- **Load Balancer**: Nginx, HAProxy, or hardware load balancer
- **Monitoring**: Prometheus + Grafana

#### 10.3.2 Container Orchestration

**Docker Compose (Development/Simple Production):**
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=mysql
      - REDIS_HOST=redis
    depends_on:
      - mysql
      - redis
  
  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=salat_saom_db
    volumes:
      - mysql_data:/var/lib/mysql
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:
```

**Kubernetes (Production):**
```yaml
# Deployment example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: salat-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: salat-api
  template:
    metadata:
      labels:
        app: salat-api
    spec:
      containers:
      - name: api
        image: salat-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: host
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

**Kubernetes Services:**
- **Deployment**: API server pods
- **Service**: Internal service for API pods
- **Ingress**: External access with SSL termination
- **ConfigMap**: Application configuration
- **Secret**: Database credentials, API keys
- **HorizontalPodAutoscaler**: Auto-scaling based on metrics

#### 10.3.3 Deployment Environments

**Development Environment:**
- **Purpose**: Local development and testing
- **Infrastructure**: Docker Compose or local services
- **Database**: Local MySQL instance
- **Cache**: Optional (can use in-memory cache)
- **Monitoring**: Basic logging

**Staging Environment:**
- **Purpose**: Pre-production testing
- **Infrastructure**: Similar to production but smaller scale
- **Database**: Staging database (can use production replica)
- **Cache**: Full Redis setup
- **Monitoring**: Full monitoring stack

**Production Environment:**
- **Purpose**: Live API serving users
- **Infrastructure**: Full-scale, high-availability setup
- **Database**: Primary + read replicas
- **Cache**: Redis cluster
- **Monitoring**: Comprehensive monitoring and alerting

### 10.4 Scaling Strategies

#### 10.4.1 Horizontal Scaling

**API Server Scaling:**
- **Trigger**: CPU > 70%, Memory > 80%, Request queue > threshold
- **Scale Out**: Add more API server instances
- **Scale In**: Remove instances when load decreases
- **Cooldown**: 5 minutes between scaling actions
- **Max Instances**: Based on expected peak load

**Auto-scaling Configuration:**
```yaml
Auto Scaling:
  Min Instances: 2
  Max Instances: 10
  Target CPU: 70%
  Target Memory: 80%
  Scale Out: +2 instances
  Scale In: -1 instance
  Cooldown: 5 minutes
```

**Database Scaling:**
- **Read Scaling**: Add read replicas for read-heavy workloads
- **Write Scaling**: Vertical scaling (larger instance) for write-heavy
- **Connection Pooling**: Adjust pool size based on instance count

#### 10.4.2 Vertical Scaling

**When to Scale Vertically:**
- **Database**: When query performance degrades
- **API Server**: When single instance can't handle load
- **Cache**: When memory limits reached

**Scaling Considerations:**
- **Cost**: Vertical scaling can be more expensive
- **Downtime**: May require brief downtime
- **Limits**: Hardware limits eventually reached

#### 10.4.3 Caching Strategy for Scale

**Multi-Level Caching:**
1. **Application Cache**: Fastest, limited size
2. **Redis Cache**: Fast, distributed, larger size
3. **Database Cache**: Persistent, largest size

**Cache Warming:**
- **Pre-calculate**: Popular coordinates for upcoming dates
- **Background Jobs**: Calculate and cache in background
- **Popular Locations**: Pre-cache major cities

### 10.5 Monitoring and Observability

#### 10.5.1 Application Monitoring

**Key Metrics to Monitor:**
- **Response Time**: p50, p95, p99 percentiles
- **Request Rate**: Requests per second
- **Error Rate**: Percentage of failed requests
- **Cache Hit Rate**: Percentage of cached responses
- **Database Query Time**: Average query execution time
- **Connection Pool Usage**: Active/idle connections

**Monitoring Tools:**
- **APM**: New Relic, Datadog, AppDynamics
- **Logging**: ELK Stack, Splunk, CloudWatch Logs
- **Metrics**: Prometheus + Grafana
- **Tracing**: Jaeger, Zipkin (for distributed tracing)

**Monitoring Dashboard:**
```
Dashboard Sections:
- Request Metrics (RPS, Response Time, Error Rate)
- Cache Performance (Hit Rate, Miss Rate, Evictions)
- Database Performance (Query Time, Connections, Replication Lag)
- System Resources (CPU, Memory, Disk, Network)
- Error Tracking (Error Types, Frequency, Trends)
```

#### 10.5.2 Logging Strategy

**Log Levels:**
- **ERROR**: Errors requiring attention
- **WARN**: Warnings that may indicate issues
- **INFO**: General information (requests, responses)
- **DEBUG**: Detailed debugging information

**Structured Logging:**
```javascript
// Structured log format
{
  "timestamp": "2024-03-15T10:30:00Z",
  "level": "info",
  "message": "Request completed",
  "request_id": "req_abc123",
  "method": "GET",
  "path": "/v1/prayer-times",
  "status": 200,
  "duration_ms": 45,
  "cache_hit": true,
  "ip": "192.168.1.1"
}
```

**Log Aggregation:**
- **Centralized Logging**: All logs sent to central system
- **Log Retention**: 30 days for application logs, 90 days for error logs
- **Log Analysis**: Search and analyze logs for debugging
- **Alerting**: Alert on error patterns or anomalies

#### 10.5.3 Health Checks

**Health Check Endpoint:**
```javascript
// GET /health
{
  "status": "healthy",
  "timestamp": "2024-03-15T10:30:00Z",
  "checks": {
    "database": "healthy",
    "cache": "healthy",
    "disk": "healthy"
  },
  "version": "1.0.0"
}
```

**Health Check Components:**
- **Database Connection**: Verify database connectivity
- **Cache Connection**: Verify Redis connectivity
- **Disk Space**: Check available disk space
- **Memory**: Check available memory

**Health Check Intervals:**
- **Load Balancer**: Every 30 seconds
- **Monitoring System**: Every 60 seconds
- **Internal**: Continuous monitoring

### 10.6 Security Architecture

#### 10.6.1 Network Security

**Network Segmentation:**
- **Public Subnet**: Load balancer, API servers
- **Private Subnet**: Database, Redis (no public access)
- **Security Groups**: Restrict access between components

**Firewall Rules:**
- **API Servers**: Allow HTTP/HTTPS from load balancer only
- **Database**: Allow MySQL (3306) from API servers only
- **Redis**: Allow Redis (6379) from API servers only
- **Load Balancer**: Allow HTTP/HTTPS from internet

**DDoS Protection:**
- **Cloud Provider**: Use cloud DDoS protection (AWS Shield, etc.)
- **Rate Limiting**: Application-level rate limiting
- **IP Filtering**: Block known malicious IPs
- **WAF**: Web Application Firewall for additional protection

#### 10.6.2 Application Security

**Authentication:**
- **API Keys**: Primary authentication method
- **Key Storage**: Encrypted in database
- **Key Rotation**: Support for key rotation
- **OAuth 2.0**: Optional for advanced integrations

**Input Validation:**
- **Coordinate Validation**: Validate latitude/longitude ranges
- **Date Validation**: Validate date format and range
- **Method Validation**: Validate calculation method
- **SQL Injection Prevention**: Parameterized queries only

**Output Security:**
- **No Sensitive Data**: Don't expose internal details in errors
- **CORS**: Configured CORS policy
- **Content Security**: No user-generated content (not applicable)

#### 10.6.3 Data Security

**Encryption:**
- **In Transit**: TLS 1.2+ for all connections
- **At Rest**: Database encryption enabled
- **Backups**: Encrypted backups
- **Secrets**: Encrypted secret storage

**Access Control:**
- **Database Users**: Separate users for read/write
- **Least Privilege**: Minimum required permissions
- **Audit Logging**: Log all database access
- **Key Management**: Use secret management services

### 10.7 Deployment Process

#### 10.7.1 Deployment Pipeline

**CI/CD Pipeline Stages:**
1. **Source Control**: Code committed to Git
2. **Build**: Build Docker image or package
3. **Test**: Run automated tests
4. **Security Scan**: Scan for vulnerabilities
5. **Deploy to Staging**: Deploy to staging environment
6. **Integration Tests**: Run integration tests
7. **Deploy to Production**: Deploy to production
8. **Smoke Tests**: Verify deployment success
9. **Monitor**: Monitor for issues

**Deployment Tools:**
- **CI/CD**: GitHub Actions, GitLab CI, Jenkins, CircleCI
- **Container Registry**: Docker Hub, AWS ECR, Google Container Registry
- **Deployment**: Kubernetes, Docker Swarm, AWS ECS, Azure Container Instances

#### 10.7.2 Blue-Green Deployment

**Strategy:**
- **Blue Environment**: Current production
- **Green Environment**: New version
- **Deploy**: Deploy new version to green
- **Test**: Test green environment
- **Switch**: Switch traffic from blue to green
- **Rollback**: Keep blue for quick rollback

**Benefits:**
- **Zero Downtime**: No service interruption
- **Quick Rollback**: Instant rollback if issues
- **Testing**: Test new version before switching

#### 10.7.3 Canary Deployment

**Strategy:**
- **Deploy**: Deploy new version to small percentage of traffic
- **Monitor**: Monitor metrics and errors
- **Gradual Rollout**: Gradually increase traffic percentage
- **Full Rollout**: Route 100% traffic to new version
- **Rollback**: Rollback if issues detected

**Benefits:**
- **Risk Mitigation**: Limited impact if issues
- **Gradual Rollout**: Test with real traffic
- **Metrics**: Compare old vs new version

### 10.8 Disaster Recovery

#### 10.8.1 Backup Strategy

**Database Backups:**
- **Full Backup**: Daily at 2 AM
- **Incremental Backup**: Every 6 hours
- **Backup Storage**: Separate region/cloud
- **Backup Retention**: 30 days
- **Backup Verification**: Weekly restore tests

**Application Backups:**
- **Code**: Git repository (version control)
- **Configuration**: Version controlled
- **Secrets**: Secure secret management
- **Docker Images**: Container registry

#### 10.8.2 Recovery Procedures

**Recovery Time Objectives (RTO):**
- **Database**: 4 hours
- **Application**: 1 hour
- **Full System**: 4 hours

**Recovery Point Objectives (RPO):**
- **Database**: 24 hours (daily backup)
- **Application**: 0 (no data loss, code in Git)

**Recovery Procedures:**
1. **Assess**: Assess damage and scope
2. **Restore Database**: Restore from latest backup
3. **Deploy Application**: Deploy from Git
4. **Verify**: Run smoke tests
5. **Monitor**: Monitor for issues

### 10.9 Performance Optimization

#### 10.9.1 Database Optimization

**Query Optimization:**
- **Indexes**: Proper indexes on frequently queried columns
- **Query Analysis**: Regular EXPLAIN analysis
- **Slow Query Log**: Monitor and optimize slow queries
- **Connection Pooling**: Efficient connection management

**Database Maintenance:**
- **Vacuum/Analyze**: Regular maintenance (PostgreSQL)
- **OPTIMIZE TABLE**: Regular maintenance (MySQL)
- **Index Rebuilding**: Periodic index optimization
- **Statistics Update**: Keep statistics current

#### 10.9.2 Application Optimization

**Code Optimization:**
- **Calculation Caching**: Cache intermediate calculations
- **Lazy Loading**: Load data on demand
- **Batch Processing**: Process multiple requests together
- **Async Operations**: Non-blocking I/O

**Memory Optimization:**
- **Connection Pooling**: Reuse connections
- **Object Pooling**: Reuse objects where possible
- **Garbage Collection**: Tune GC for Node.js
- **Memory Leaks**: Monitor and fix memory leaks

### 10.10 Cost Optimization

#### 10.10.1 Infrastructure Costs

**Cost Optimization Strategies:**
- **Right-Sizing**: Use appropriately sized instances
- **Reserved Instances**: Use reserved instances for predictable workloads
- **Auto-Scaling**: Scale down during low traffic
- **Caching**: Reduce database load with caching
- **Storage Optimization**: Archive old logs and data

**Estimated Monthly Costs (Example):**
- **API Servers (3x t3.medium)**: ~$150/month
- **Database (db.t3.medium)**: ~$100/month
- **Redis (cache.t3.micro)**: ~$15/month
- **Load Balancer**: ~$20/month
- **Data Transfer**: ~$10/month
- **Total**: ~$295/month (varies by provider and usage)

#### 10.10.2 Cost Monitoring

**Cost Tracking:**
- **Cloud Cost Dashboard**: Monitor spending
- **Cost Alerts**: Alert on budget thresholds
- **Cost Analysis**: Analyze costs by service
- **Optimization Recommendations**: Regular cost reviews

### 10.11 Deployment Checklist

#### 10.11.1 Pre-Deployment

- [ ] All tests passing
- [ ] Code review completed
- [ ] Security scan passed
- [ ] Database migrations tested
- [ ] Configuration validated
- [ ] Documentation updated
- [ ] Backup verified
- [ ] Rollback plan prepared

#### 10.11.2 Deployment

- [ ] Deploy to staging
- [ ] Run integration tests
- [ ] Verify staging functionality
- [ ] Deploy to production
- [ ] Run smoke tests
- [ ] Monitor metrics
- [ ] Verify health checks
- [ ] Check error logs

#### 10.11.3 Post-Deployment

- [ ] Monitor for 1 hour
- [ ] Verify performance metrics
- [ ] Check error rates
- [ ] Verify cache hit rates
- [ ] Update deployment log
- [ ] Notify stakeholders
- [ ] Document any issues

### 10.12 Infrastructure as Code

#### 10.12.1 Infrastructure Definition

**Terraform Example (AWS):**
```hcl
# API Server Auto Scaling Group
resource "aws_autoscaling_group" "api" {
  name                = "salat-api-asg"
  min_size            = 2
  max_size            = 10
  desired_capacity    = 3
  vpc_zone_identifier = var.private_subnet_ids
  
  launch_template {
    id = aws_launch_template.api.id
  }
  
  target_group_arns = [aws_lb_target_group.api.arn]
  
  health_check_type = "ELB"
}

# RDS MySQL Instance
resource "aws_db_instance" "mysql" {
  identifier     = "salat-mysql"
  engine         = "mysql"
  engine_version = "8.0"
  instance_class = "db.t3.medium"
  
  allocated_storage     = 100
  max_allocated_storage  = 200
  storage_type          = "gp3"
  
  db_name  = "salat_saom_db"
  username = var.db_username
  password = var.db_password
  
  backup_retention_period = 30
  backup_window          = "02:00-03:00"
  
  vpc_security_group_ids = [aws_security_group.db.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
}
```

**Benefits of Infrastructure as Code:**
- **Version Control**: Infrastructure changes tracked in Git
- **Reproducibility**: Same infrastructure across environments
- **Automation**: Automated infrastructure provisioning
- **Documentation**: Infrastructure documented in code
- **Disaster Recovery**: Quick infrastructure recreation

### 10.13 Monitoring and Alerting

#### 10.13.1 Alert Configuration

**Critical Alerts:**
- **API Down**: All health checks failing
- **Database Down**: Database connection failures
- **High Error Rate**: Error rate > 5%
- **High Response Time**: p95 response time > 500ms
- **Disk Space**: Disk usage > 90%

**Warning Alerts:**
- **High CPU**: CPU usage > 80%
- **High Memory**: Memory usage > 85%
- **Cache Miss Rate**: Cache hit rate < 70%
- **Database Connections**: Connection pool > 80% utilized

**Alert Channels:**
- **Email**: For critical alerts
- **SMS**: For critical alerts (optional)
- **Slack/PagerDuty**: For team notifications
- **Dashboard**: Real-time monitoring dashboard

#### 10.13.2 Monitoring Dashboard

**Dashboard Components:**
- **Request Metrics**: RPS, response time, error rate
- **Cache Metrics**: Hit rate, miss rate, evictions
- **Database Metrics**: Query time, connections, replication lag
- **System Metrics**: CPU, memory, disk, network
- **Error Tracking**: Error types, frequency, trends
- **Geographic Distribution**: Requests by region

### 10.14 Maintenance Windows

#### 10.14.1 Scheduled Maintenance

**Maintenance Schedule:**
- **Weekly**: Database optimization (low traffic time)
- **Monthly**: Security updates, dependency updates
- **Quarterly**: Infrastructure review, capacity planning

**Maintenance Procedures:**
1. **Announce**: Notify users in advance
2. **Backup**: Create backup before maintenance
3. **Maintenance**: Perform maintenance tasks
4. **Verify**: Verify system functionality
5. **Monitor**: Monitor for issues post-maintenance

#### 10.14.2 Zero-Downtime Maintenance

**Strategies:**
- **Blue-Green Deployment**: Deploy new version, switch traffic
- **Rolling Updates**: Update instances one at a time
- **Read Replicas**: Use replicas during primary maintenance
- **Maintenance Windows**: Schedule during low traffic periods

---

## 11. Future Enhancements

### 11.1 Overview

This section outlines potential future enhancements to the Salat and Saom Timing API. These features are planned for future releases and are prioritized based on user demand, technical feasibility, and impact on the Muslim community in Bangladesh.

**Enhancement Categories:**
1. **Additional Features**: New functionality to enhance user experience
2. **Advanced Calculations**: Improved accuracy and customization options
3. **Integration**: Third-party integrations and platform support
4. **User Experience**: Mobile apps, offline support, notifications
5. **Community Features**: Mosque integration, community calendars

**Prioritization:**
- **High Priority**: Features with high user demand and clear value
- **Medium Priority**: Features that enhance functionality
- **Low Priority**: Nice-to-have features for future consideration

### 11.2 Additional Features

#### 11.2.1 Qibla Direction Calculation

**Description:**
Calculate the Qibla (direction to Mecca) for any coordinate in Bangladesh. This is essential for Muslims to face the correct direction during prayer.

**Implementation:**

**Calculation Method:**
```
Qibla Direction = arctan(sin(λ_m - λ) / (cos(φ) × tan(φ_m) - sin(φ) × cos(λ_m - λ)))
```

Where:
- `φ`: Latitude of location
- `λ`: Longitude of location
- `φ_m`: Latitude of Mecca (21.4225°N)
- `λ_m`: Longitude of Mecca (39.8262°E)

**API Endpoint:**
```
GET /v1/qibla?latitude=23.8103&longitude=90.4125
```

**Response:**
```json
{
  "location": {
    "latitude": 23.8103,
    "longitude": 90.4125,
    "name": "Dhaka"
  },
  "qibla": {
    "direction_degrees": 267.5,
    "direction_compass": "W",
    "direction_compass_detailed": "WNW",
    "mecca_coordinates": {
      "latitude": 21.4225,
      "longitude": 39.8262
    },
    "distance_km": 4567.8
  }
}
```

**Use Cases:**
- **Mobile Apps**: Show Qibla compass in prayer apps
- **Mosque Displays**: Display Qibla direction in mosques
- **Websites**: Show Qibla direction for locations
- **Smart Devices**: IoT devices with Qibla indicators

**Priority**: High (essential for prayer)

**Complexity**: Low (straightforward calculation)

**Estimated Effort**: 1-2 weeks

#### 11.2.2 Moon Sighting Integration

**Description:**
Integrate with moon sighting data to determine the start of Islamic months (especially Ramadan and Eid) based on actual moon sightings rather than calculated dates.

**Implementation:**

**Data Sources:**
- **Local Moon Sighting Committees**: Bangladesh moon sighting reports
- **International Sources**: Global moon sighting data
- **Astronomical Calculations**: Calculated new moon dates as fallback

**API Endpoint:**
```
GET /v1/moon-sighting?year=2024&month=9
```

**Response:**
```json
{
  "year": 2024,
  "month": 9,
  "hijri_month": "Ramadan",
  "calculated_date": "2024-03-11",
  "sighting_reports": [
    {
      "date": "2024-03-11",
      "location": "Dhaka",
      "sighted": true,
      "source": "Bangladesh Moon Sighting Committee",
      "verified": true
    }
  ],
  "confirmed_date": "2024-03-11",
  "status": "confirmed"
}
```

**Features:**
- **Sighting Reports**: Store and retrieve moon sighting reports
- **Confirmation**: Confirm start of month based on sightings
- **Notifications**: Notify users when month is confirmed
- **Fallback**: Use calculated date if no sighting available

**Use Cases:**
- **Ramadan Start**: Determine exact start of Ramadan
- **Eid Dates**: Determine Eid al-Fitr and Eid al-Adha dates
- **Hijri Calendar**: Accurate Hijri calendar based on sightings
- **Community Coordination**: Coordinate with local moon sighting committees

**Priority**: High (critical for Ramadan and Eid)

**Complexity**: Medium (requires data integration and verification)

**Estimated Effort**: 4-6 weeks

#### 11.2.3 Push Notifications

**Description:**
Send push notifications to users for prayer times, Sehri/Iftar reminders, and important Islamic dates.

**Implementation:**

**Notification Types:**
- **Prayer Reminders**: 5-10 minutes before each prayer
- **Sehri Reminder**: 30 minutes before Sehri end time
- **Iftar Notification**: At Iftar time
- **Ramadan Start**: Notification when Ramadan begins
- **Eid Notifications**: Notifications for Eid dates

**API Endpoints:**
```
POST /v1/notifications/subscribe
POST /v1/notifications/unsubscribe
GET /v1/notifications/preferences
PUT /v1/notifications/preferences
```

**Subscription Request:**
```json
{
  "device_token": "fcm_token_or_apns_token",
  "platform": "ios" | "android" | "web",
  "latitude": 23.8103,
  "longitude": 90.4125,
  "preferences": {
    "prayer_reminders": true,
    "sehri_reminders": true,
    "iftar_notifications": true,
    "reminder_minutes_before": 10
  }
}
```

**Notification Services:**
- **Firebase Cloud Messaging (FCM)**: For Android and web
- **Apple Push Notification Service (APNS)**: For iOS
- **Web Push**: For web browsers

**Features:**
- **Customizable Reminders**: User-configurable reminder times
- **Location-Based**: Notifications based on user's location
- **Method Selection**: Notifications based on user's preferred method
- **Opt-out Options**: Users can disable specific notification types

**Use Cases:**
- **Daily Reminders**: Never miss a prayer time
- **Fasting Reminders**: Sehri and Iftar notifications during Ramadan
- **Special Dates**: Notifications for important Islamic dates
- **Community Alerts**: Mosque announcements and community events

**Priority**: High (high user value)

**Complexity**: Medium (requires notification infrastructure)

**Estimated Effort**: 3-4 weeks

#### 11.2.4 Mobile Applications

**Description:**
Native mobile applications for iOS and Android that provide a user-friendly interface for accessing prayer and fasting times.

**iOS Application:**

**Features:**
- **Prayer Times**: Display daily prayer times
- **Fasting Calendar**: Monthly and yearly fasting calendars
- **Location Services**: Automatic location detection
- **Notifications**: Push notifications for prayers
- **Qibla Compass**: Qibla direction indicator
- **Offline Mode**: Download calendars for offline use
- **Widgets**: Home screen widgets with prayer times

**Technology Stack:**
- **Framework**: SwiftUI or UIKit
- **Language**: Swift
- **API Integration**: REST API client
- **Storage**: Core Data or SQLite

**Android Application:**

**Features:**
- **Prayer Times**: Display daily prayer times
- **Fasting Calendar**: Monthly and yearly fasting calendars
- **Location Services**: Automatic location detection
- **Notifications**: Push notifications for prayers
- **Qibla Compass**: Qibla direction indicator
- **Offline Mode**: Download calendars for offline use
- **Widgets**: Home screen widgets with prayer times

**Technology Stack:**
- **Framework**: Jetpack Compose or XML layouts
- **Language**: Kotlin
- **API Integration**: Retrofit or OkHttp
- **Storage**: Room Database or SQLite

**Common Features:**
- **Multiple Calculation Methods**: Support all API methods
- **Customization**: User preferences for methods and adjustments
- **Dark Mode**: Support for dark/light themes
- **Bengali Language**: Full Bengali language support
- **Accessibility**: Support for accessibility features

**Priority**: High (significant user demand)

**Complexity**: High (requires mobile development expertise)

**Estimated Effort**: 8-12 weeks per platform

#### 11.2.5 Offline Support

**Description:**
Allow users to download prayer and fasting calendars for offline use, enabling access without internet connection.

**Implementation:**

**Download Endpoints:**
```
GET /v1/calendar/download?latitude=23.8103&longitude=90.4125&year=2024&format=pdf
GET /v1/calendar/download?latitude=23.8103&longitude=90.4125&year=2024&format=json
GET /v1/calendar/download?latitude=23.8103&longitude=90.4125&year=2024&format=ical
```

**Download Formats:**
- **PDF**: Printable calendar format
- **JSON**: Machine-readable format for apps
- **iCal**: Standard calendar format for import
- **CSV**: Spreadsheet format

**Features:**
- **Yearly Calendars**: Download full year calendars
- **Monthly Calendars**: Download monthly calendars
- **Custom Date Ranges**: Download specific date ranges
- **Multiple Methods**: Download for different calculation methods
- **Compression**: Compressed downloads for large calendars

**Use Cases:**
- **Rural Areas**: Access in areas with poor internet
- **Travel**: Access while traveling
- **Backup**: Keep backup calendars
- **Printing**: Print calendars for distribution

**Priority**: Medium (useful but not critical)

**Complexity**: Low (straightforward implementation)

**Estimated Effort**: 2-3 weeks

### 11.3 Advanced Calculations

#### 11.3.1 High Precision with Altitude

**Description:**
Account for altitude in calculations to provide sub-minute accuracy for locations at different elevations.

**Implementation:**

**Altitude Adjustment:**
```
Adjusted Horizon = Standard Horizon + Altitude Correction
Altitude Correction = arctan(altitude / distance_to_horizon)
```

**API Enhancement:**
```
GET /v1/prayer-times?latitude=23.8103&longitude=90.4125&altitude=100
```

**Altitude Data Sources:**
- **User Input**: Users provide altitude
- **Elevation APIs**: Integration with elevation services
- **Database**: Store altitude in locations table

**Benefits:**
- **Hill Tracts**: More accurate for Chittagong Hill Tracts
- **Urban Areas**: Account for building heights
- **Precision**: Sub-minute accuracy

**Priority**: Medium (useful for specific regions)

**Complexity**: Medium (requires altitude data and calculations)

**Estimated Effort**: 2-3 weeks

#### 11.3.2 Custom Horizon Adjustments

**Description:**
Allow users to specify custom horizon adjustments for locations with obstructed horizons (tall buildings, mountains).

**Implementation:**

**API Parameter:**
```
GET /v1/prayer-times?latitude=23.8103&longitude=90.4125&horizon_adjustment=2.0
```

**Horizon Adjustment:**
- **Range**: -5.0° to +5.0° (degrees)
- **Positive**: Horizon is higher (buildings/mountains block view)
- **Negative**: Horizon is lower (elevated location)

**Use Cases:**
- **Urban Areas**: Adjust for tall buildings
- **Valleys**: Adjust for surrounding mountains
- **Coastal Areas**: Adjust for sea level variations

**Priority**: Low (niche use case)

**Complexity**: Low (simple calculation adjustment)

**Estimated Effort**: 1 week

#### 11.3.3 Historical Data

**Description:**
Provide prayer times for past dates, enabling historical analysis and record-keeping.

**Implementation:**

**API Endpoint:**
```
GET /v1/prayer-times?latitude=23.8103&longitude=90.4125&date=2020-03-15
```

**Features:**
- **Date Range**: Support dates from 1900 to present
- **Validation**: Validate historical dates
- **Calculation**: Same calculation methods apply
- **Storage**: Store historical data in database

**Use Cases:**
- **Historical Records**: Keep records of past prayer times
- **Research**: Academic research on prayer times
- **Analysis**: Analyze trends over time
- **Documentation**: Historical documentation

**Priority**: Low (limited use case)

**Complexity**: Low (same calculations, different date range)

**Estimated Effort**: 1 week

#### 11.3.4 Long-Term Projections

**Description:**
Generate prayer time projections for many years in advance (e.g., 50-100 years).

**Implementation:**

**API Endpoint:**
```
GET /v1/calendar/project?latitude=23.8103&longitude=90.4125&years=50
```

**Features:**
- **Long Range**: Support 50-100 year projections
- **Batch Generation**: Efficient batch calculation
- **Storage**: Store projections in database
- **Format**: Multiple output formats (JSON, CSV, PDF)

**Use Cases:**
- **Long-Term Planning**: Plan for future years
- **Calendar Publishing**: Generate long-term calendars
- **Research**: Long-term astronomical studies
- **Institutions**: Mosques and organizations planning

**Priority**: Low (specialized use case)

**Complexity**: Medium (requires efficient batch processing)

**Estimated Effort**: 2-3 weeks

### 11.4 Integration Features

#### 11.4.1 Mosque Integration

**Description:**
Specialized API endpoints and features for mosques to display prayer times and manage community calendars.

**Implementation:**

**Mosque-Specific Endpoints:**
```
GET /v1/mosques/{mosque_id}/times
GET /v1/mosques/{mosque_id}/calendar
POST /v1/mosques/{mosque_id}/announcements
```

**Features:**
- **Mosque Profiles**: Store mosque information and coordinates
- **Custom Schedules**: Mosque-specific prayer time adjustments
- **Announcements**: Community announcements and events
- **Display Integration**: APIs for digital displays
- **Community Calendar**: Shared community calendar

**Display Integration:**
- **Digital Displays**: APIs for LED/LCD displays
- **Web Widgets**: Embeddable widgets for websites
- **Mobile Apps**: Mosque-specific mobile apps
- **Smart Boards**: Integration with smart board systems

**Use Cases:**
- **Mosque Displays**: Show prayer times in mosques
- **Community Apps**: Mosque community applications
- **Announcements**: Share community announcements
- **Event Management**: Manage mosque events

**Priority**: Medium (valuable for mosques)

**Complexity**: Medium (requires mosque management features)

**Estimated Effort**: 4-6 weeks

#### 11.4.2 Smart Home Integration

**Description:**
Integration with smart home devices (Amazon Alexa, Google Home, Apple HomeKit) for voice-activated prayer time queries.

**Implementation:**

**Alexa Skill:**
```
User: "Alexa, what time is Maghrib?"
Alexa: "Maghrib prayer time is 6:04 PM"
```

**Google Assistant Action:**
```
User: "Hey Google, when is Iftar today?"
Google: "Iftar time is 6:04 PM"
```

**Features:**
- **Voice Queries**: Natural language prayer time queries
- **Location Detection**: Use device location
- **Daily Briefings**: Daily prayer time briefings
- **Reminders**: Voice reminders for prayers
- **Fasting Information**: Fasting time queries during Ramadan

**API Endpoints:**
```
POST /v1/voice/prayer-times
POST /v1/voice/fasting-times
```

**Use Cases:**
- **Hands-Free Access**: Access prayer times without devices
- **Home Automation**: Integrate with smart home systems
- **Accessibility**: Voice access for visually impaired
- **Convenience**: Quick voice queries

**Priority**: Medium (nice-to-have feature)

**Complexity**: Medium (requires voice platform integration)

**Estimated Effort**: 3-4 weeks per platform

#### 11.4.3 Calendar App Integration

**Description:**
Generate calendar files (iCal, Google Calendar) that users can import into their calendar applications.

**Implementation:**

**iCal Format Endpoint:**
```
GET /v1/calendar/ical?latitude=23.8103&longitude=90.4125&year=2024
```

**Response Format:**
```ical
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Salat Saom API//EN
BEGIN:VEVENT
DTSTART:20240315T044500
DTEND:20240315T044600
SUMMARY:Fajr Prayer
DESCRIPTION:Fajr prayer time
END:VEVENT
...
END:VCALENDAR
```

**Google Calendar Integration:**
- **Calendar URL**: Direct subscription URL
- **Auto-Update**: Calendar updates automatically
- **Multiple Methods**: Support different calculation methods

**Features:**
- **iCal Format**: Standard iCalendar format
- **Google Calendar**: Direct Google Calendar integration
- **Outlook**: Outlook calendar compatibility
- **Recurring Events**: Prayer times as recurring events
- **Customization**: User-configurable event details

**Use Cases:**
- **Personal Calendars**: Add prayer times to personal calendars
- **Family Sharing**: Share calendars with family
- **Scheduling**: Plan around prayer times
- **Reminders**: Calendar app reminders

**Priority**: Medium (useful feature)

**Complexity**: Low (standard calendar formats)

**Estimated Effort**: 2 weeks

#### 11.4.4 Voice Assistant Integration

**Description:**
Integration with voice assistants (Alexa, Google Assistant, Siri) for voice queries about prayer and fasting times.

**Implementation:**

**Supported Platforms:**
- **Amazon Alexa**: Alexa Skills
- **Google Assistant**: Actions on Google
- **Apple Siri**: Siri Shortcuts
- **Microsoft Cortana**: Cortana Skills (if available)

**Query Examples:**
- "What time is Maghrib?"
- "When is Iftar today?"
- "What are today's prayer times?"
- "When does Ramadan start?"

**Features:**
- **Natural Language**: Natural language understanding
- **Location Awareness**: Use device location
- **Multi-language**: Support Bengali and English
- **Context Awareness**: Remember user preferences

**Priority**: Medium (convenience feature)

**Complexity**: Medium (requires NLP and platform integration)

**Estimated Effort**: 4-6 weeks

### 11.5 User Experience Enhancements

#### 11.5.1 User Accounts and Preferences

**Description:**
User account system to save preferences, favorite locations, and notification settings.

**Implementation:**

**User Account Features:**
- **Registration**: User registration and authentication
- **Profile**: User profile with preferences
- **Favorite Locations**: Save frequently used locations
- **Notification Settings**: Configure notification preferences
- **Method Preferences**: Save preferred calculation methods

**API Endpoints:**
```
POST /v1/users/register
POST /v1/users/login
GET /v1/users/profile
PUT /v1/users/profile
GET /v1/users/locations
POST /v1/users/locations
```

**Use Cases:**
- **Personalization**: Personalized experience
- **Convenience**: Quick access to saved locations
- **Settings Sync**: Sync settings across devices
- **History**: Track usage history

**Priority**: Medium (enhances user experience)

**Complexity**: Medium (requires authentication system)

**Estimated Effort**: 4-5 weeks

#### 11.5.2 Multi-Language Support

**Description:**
Full support for Bengali language in API responses and documentation.

**Implementation:**

**Language Support:**
- **English**: Default language
- **Bengali**: Full Bengali language support
- **Language Detection**: Auto-detect from Accept-Language header
- **Localization**: All text in Bengali

**API Parameter:**
```
GET /v1/prayer-times?latitude=23.8103&longitude=90.4125&lang=bn
```

**Response:**
```json
{
  "date": "2024-03-15",
  "location": {
    "name": "ঢাকা",
    "district": "ঢাকা",
    "division": "ঢাকা"
  },
  "times": {
    "fajr": "04:45",
    "sunrise": "06:12",
    "dhuhr": "12:08",
    "asr": "15:32",
    "maghrib": "18:04",
    "isha": "19:31"
  },
  "prayer_names": {
    "fajr": "ফজর",
    "dhuhr": "যোহর",
    "asr": "আসর",
    "maghrib": "মাগরিব",
    "isha": "ইশা"
  }
}
```

**Priority**: High (important for Bangladesh users)

**Complexity**: Low (translation and localization)

**Estimated Effort**: 2-3 weeks

#### 11.5.3 Widgets and Embeddable Components

**Description:**
Web widgets and embeddable components for websites to display prayer times.

**Implementation:**

**Widget Types:**
- **Prayer Times Widget**: Display today's prayer times
- **Monthly Calendar Widget**: Monthly prayer calendar
- **Fasting Widget**: Fasting times widget
- **Qibla Widget**: Qibla direction widget

**Embedding:**
```html
<!-- Prayer Times Widget -->
<script src="https://api.salat-saom.bd/widgets/prayer-times.js"></script>
<div id="salat-widget" data-lat="23.8103" data-lng="90.4125"></div>
```

**Features:**
- **Customizable**: Customizable appearance
- **Responsive**: Mobile-friendly design
- **Auto-Update**: Automatic updates
- **Multiple Styles**: Multiple widget styles

**Use Cases:**
- **Mosque Websites**: Display prayer times on mosque websites
- **Community Sites**: Community organization websites
- **Personal Sites**: Personal websites and blogs
- **News Sites**: News websites with Islamic content

**Priority**: Medium (useful for websites)

**Complexity**: Low (JavaScript widgets)

**Estimated Effort**: 2-3 weeks

### 11.6 Community Features

#### 11.6.1 Community Calendars

**Description:**
Shared community calendars where multiple users can contribute and view community-wide prayer time information.

**Implementation:**

**Features:**
- **Community Creation**: Create community calendars
- **Member Management**: Add/remove members
- **Shared Locations**: Shared favorite locations
- **Community Events**: Community events and announcements
- **Discussion**: Community discussions and updates

**Use Cases:**
- **Mosque Communities**: Mosque community calendars
- **Neighborhood Groups**: Neighborhood prayer time coordination
- **Organizations**: Islamic organization calendars
- **Family Groups**: Family prayer time coordination

**Priority**: Low (specialized use case)

**Complexity**: High (requires community management features)

**Estimated Effort**: 6-8 weeks

#### 11.6.2 Prayer Time Sharing

**Description:**
Allow users to share prayer times via social media, messaging apps, or email.

**Implementation:**

**Sharing Options:**
- **Social Media**: Share to Facebook, Twitter, WhatsApp
- **Email**: Email prayer times
- **SMS**: SMS prayer times (if supported)
- **QR Code**: Generate QR codes for prayer times

**API Endpoint:**
```
POST /v1/share/prayer-times
```

**Features:**
- **Multiple Formats**: Text, image, calendar file
- **Customization**: Customizable share messages
- **QR Codes**: QR codes for easy sharing
- **Scheduled Sharing**: Schedule regular sharing

**Priority**: Low (nice-to-have)

**Complexity**: Low (standard sharing features)

**Estimated Effort**: 1-2 weeks

### 11.7 Advanced API Features

#### 11.7.1 Webhooks

**Description:**
Webhook support for real-time notifications when prayer times are updated or important events occur.

**Implementation:**

**Webhook Events:**
- **Prayer Time Update**: When prayer times are recalculated
- **Ramadan Start**: When Ramadan is confirmed
- **Eid Announcement**: When Eid dates are confirmed
- **Method Update**: When calculation methods are updated

**API Endpoints:**
```
POST /v1/webhooks/subscribe
DELETE /v1/webhooks/{webhook_id}
GET /v1/webhooks
```

**Webhook Payload:**
```json
{
  "event": "prayer_time_updated",
  "timestamp": "2024-03-15T10:30:00Z",
  "data": {
    "location": {
      "latitude": 23.8103,
      "longitude": 90.4125
    },
    "date": "2024-03-15",
    "times": { ... }
  }
}
```

**Use Cases:**
- **Third-Party Apps**: Real-time updates for apps
- **Mosque Systems**: Automatic updates for mosque displays
- **Integration**: Integration with other systems
- **Automation**: Automated workflows

**Priority**: Medium (useful for integrations)

**Complexity**: Medium (requires webhook infrastructure)

**Estimated Effort**: 3-4 weeks

#### 11.7.2 GraphQL API

**Description:**
GraphQL API as an alternative to REST API for more flexible queries.

**Implementation:**

**GraphQL Schema:**
```graphql
type Query {
  prayerTimes(
    latitude: Float!
    longitude: Float!
    date: String
    method: String
  ): PrayerTimes
  
  fastingTimes(
    latitude: Float!
    longitude: Float!
    date: String!
    method: String
  ): FastingTimes
  
  qibla(latitude: Float!, longitude: Float!): Qibla
}

type PrayerTimes {
  date: String!
  location: Location!
  method: String!
  times: Times!
}

type Times {
  fajr: String!
  sunrise: String!
  dhuhr: String!
  asr: String!
  maghrib: String!
  sunset: String!
  isha: String!
}
```

**Benefits:**
- **Flexible Queries**: Request only needed fields
- **Single Request**: Get multiple resources in one request
- **Type Safety**: Strong typing with GraphQL schema
- **Introspection**: Self-documenting API

**Priority**: Low (alternative to REST)

**Complexity**: Medium (requires GraphQL implementation)

**Estimated Effort**: 4-5 weeks

#### 11.7.3 API Versioning and Deprecation

**Description:**
Proper API versioning strategy and deprecation policies for maintaining backward compatibility.

**Implementation:**

**Versioning Strategy:**
- **URL Versioning**: `/v1/`, `/v2/` in URL
- **Header Versioning**: `API-Version: 2` header
- **Semantic Versioning**: Major.Minor.Patch versions

**Deprecation Policy:**
- **6-Month Notice**: 6 months notice before deprecation
- **Migration Guides**: Provide migration guides
- **Sunset Dates**: Clear sunset dates for deprecated endpoints
- **Support**: Support for deprecated versions during transition

**Priority**: Medium (important for API stability)

**Complexity**: Low (versioning strategy)

**Estimated Effort**: 1-2 weeks

### 11.8 Analytics and Insights

#### 11.8.1 Usage Analytics

**Description:**
Analytics dashboard for API usage, popular locations, and usage patterns.

**Implementation:**

**Analytics Endpoints:**
```
GET /v1/analytics/usage
GET /v1/analytics/popular-locations
GET /v1/analytics/method-distribution
```

**Metrics:**
- **Request Volume**: Requests per day/week/month
- **Popular Locations**: Most requested coordinates
- **Method Distribution**: Usage of different calculation methods
- **Geographic Distribution**: Requests by region
- **Peak Times**: Peak usage times
- **Error Rates**: Error rates and types

**Use Cases:**
- **Capacity Planning**: Plan infrastructure capacity
- **Feature Usage**: Understand feature usage
- **Optimization**: Optimize based on usage patterns
- **Reporting**: Generate usage reports

**Priority**: Medium (useful for operations)

**Complexity**: Medium (requires analytics infrastructure)

**Estimated Effort**: 3-4 weeks

#### 11.8.2 Accuracy Reporting

**Description:**
Allow users to report accuracy issues and provide feedback on prayer times.

**Implementation:**

**Reporting Endpoint:**
```
POST /v1/feedback/accuracy
```

**Feedback Form:**
```json
{
  "latitude": 23.8103,
  "longitude": 90.4125,
  "date": "2024-03-15",
  "prayer": "maghrib",
  "reported_time": "18:05",
  "calculated_time": "18:04",
  "difference_minutes": 1,
  "comments": "Observed sunset at 18:05",
  "user_location": "Dhaka, Bangladesh"
}
```

**Features:**
- **Accuracy Reports**: Users can report discrepancies
- **Validation**: Review and validate reports
- **Adjustments**: Make adjustments based on feedback
- **Statistics**: Track accuracy statistics

**Priority**: Medium (improves accuracy)

**Complexity**: Low (feedback collection system)

**Estimated Effort**: 2 weeks

### 11.9 Implementation Roadmap

#### 11.9.1 Phase 1 (Months 1-3)

**High Priority Features:**
1. **Qibla Direction** (Week 1-2)
2. **Multi-Language Support** (Week 3-4)
3. **Moon Sighting Integration** (Week 5-10)
4. **Push Notifications** (Week 11-14)

**Deliverables:**
- Qibla calculation API
- Bengali language support
- Moon sighting data integration
- Notification infrastructure

#### 11.9.2 Phase 2 (Months 4-6)

**Medium Priority Features:**
1. **Mobile Applications** (Week 15-26)
2. **Calendar Integration** (Week 27-28)
3. **Widgets** (Week 29-31)
4. **User Accounts** (Week 32-36)

**Deliverables:**
- iOS and Android apps
- iCal/Google Calendar integration
- Web widgets
- User account system

#### 11.9.3 Phase 3 (Months 7-9)

**Additional Features:**
1. **Smart Home Integration** (Week 37-40)
2. **Mosque Integration** (Week 41-46)
3. **Webhooks** (Week 47-50)
4. **Analytics Dashboard** (Week 51-54)

**Deliverables:**
- Voice assistant integrations
- Mosque management features
- Webhook system
- Analytics platform

#### 11.9.4 Phase 4 (Months 10-12)

**Advanced Features:**
1. **High Precision Calculations** (Week 55-57)
2. **GraphQL API** (Week 58-62)
3. **Community Features** (Week 63-66)
4. **Long-Term Projections** (Week 67-69)

**Deliverables:**
- Altitude-based calculations
- GraphQL API
- Community calendar features
- Long-term projection system

### 11.10 Feature Prioritization Matrix

**Priority Criteria:**
- **User Demand**: How many users need this feature
- **Impact**: Impact on user experience
- **Complexity**: Implementation complexity
- **Dependencies**: Dependencies on other features

**High Priority (Implement First):**
- Qibla Direction
- Moon Sighting Integration
- Push Notifications
- Multi-Language Support

**Medium Priority (Implement Next):**
- Mobile Applications
- Calendar Integration
- User Accounts
- Widgets
- Smart Home Integration

**Low Priority (Future Consideration):**
- Historical Data
- Long-Term Projections
- Custom Horizon Adjustments
- Community Features
- GraphQL API

### 11.11 Success Metrics

**Feature Adoption Metrics:**
- **Usage Rate**: Percentage of users using each feature
- **Retention**: User retention after feature launch
- **Engagement**: User engagement with features
- **Feedback**: User feedback and ratings

**Technical Metrics:**
- **Performance Impact**: Impact on API performance
- **Error Rates**: Error rates for new features
- **Scalability**: Ability to scale new features
- **Maintenance**: Maintenance overhead

**Business Metrics:**
- **User Growth**: User growth after feature launch
- **API Usage**: Increase in API usage
- **Satisfaction**: User satisfaction scores
- **Revenue**: Revenue impact (if applicable)

---

## 12. References and Standards

### 12.1 Astronomical References
- **NOAA Solar Calculations**: National Oceanic and Atmospheric Administration
- **US Naval Observatory**: Astronomical algorithms
- **Meeus, Jean**: Astronomical Algorithms (book)

### 12.2 Islamic Calculation Standards
- **Islamic Society of North America (ISNA)**: Standard calculation methods
- **Muslim World League (MWL)**: Calculation parameters
- **Egyptian General Authority of Survey**: Calculation methods

### 12.3 Bangladesh References
- **Bangladesh Meteorological Department**: Official time references
- **Islamic Foundation Bangladesh**: Religious guidance
- **District-wise Calendars**: Existing calendars for validation

---

## 13. Glossary

- **Fajr**: Dawn prayer, first of five daily prayers
- **Dhuhr**: Midday prayer, second of five daily prayers
- **Asr**: Afternoon prayer, third of five daily prayers
- **Maghrib**: Sunset prayer, fourth of five daily prayers
- **Isha**: Night prayer, fifth of five daily prayers
- **Sunrise**: The moment when the upper edge of the sun's disk appears above the horizon
- **Sunset**: The moment when the upper edge of the sun's disk disappears below the horizon
- **Sehri**: Pre-dawn meal before fasting begins
- **Iftar**: Breaking fast at sunset
- **Saom**: Fasting (Arabic term)
- **Salat**: Prayer (Arabic term)
- **Madhab**: School of Islamic jurisprudence (Hanafi, Shafi, etc.)
- **Hour Angle**: Angular distance of sun from meridian
- **Solar Declination**: Angle of sun relative to celestial equator
- **Equation of Time**: Difference between apparent and mean solar time

---

## 14. Appendix

### 14.1 Sample Calculation

**Input:**
- Latitude: 23.8103°N (Dhaka)
- Longitude: 90.4125°E
- Date: March 15, 2024
- Method: Hanafi

**Calculation Steps:**
1. Day of year: 74 (March 15)
2. Solar declination: δ = 23.45° × sin(360° × (284 + 74) / 365) ≈ -2.4°
3. Equation of time: EoT ≈ -8 minutes
4. Hour angle for Fajr (18°): H ≈ 97.5°
5. Fajr time: 12:00 - (97.5° / 15°) + EoT ≈ 05:30 (adjusted for longitude)

**Output:**
- Fajr: 04:45
- Sunrise: 06:12
- Dhuhr: 12:08
- Asr: 15:32
- Maghrib: 18:04
- Sunset: 18:04
- Isha: 19:31
- Day Length: 11 hours 52 minutes (712 minutes)

### 14.2 Coordinate Examples for Bangladesh

| Location | Latitude | Longitude | District |
|----------|----------|-----------|----------|
| Dhaka | 23.8103°N | 90.4125°E | Dhaka |
| Chittagong | 22.3569°N | 91.7832°E | Chittagong |
| Sylhet | 24.8949°N | 91.8687°E | Sylhet |
| Rajshahi | 24.3745°N | 88.6042°E | Rajshahi |
| Khulna | 22.8456°N | 89.5403°E | Khulna |

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Author**: Technical Documentation Team
