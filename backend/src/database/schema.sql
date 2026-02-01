-- Create database
CREATE DATABASE IF NOT EXISTS salat_saom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE salat_saom_db;

-- Calculation Methods Table
-- Supports all 20 calculation methods from various Islamic organizations
CREATE TABLE IF NOT EXISTS calculation_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  method_code VARCHAR(50) UNIQUE NOT NULL,
  numeric_code INT UNIQUE, -- For compatibility with Islamic Finder (1-18)
  method_name VARCHAR(255) NOT NULL,
  fajr_angle DECIMAL(4,1) NOT NULL,
  isha_angle DECIMAL(4,1), -- NULL if time-based
  isha_time_adjustment INT, -- Minutes after Maghrib (for time-based Isha like Umm Al-Qura)
  isha_calculation_type ENUM('angle', 'time') DEFAULT 'angle',
  asr_method VARCHAR(20) DEFAULT 'standard', -- 'standard' or 'hanafi'
  dhuhr_adjustment INT DEFAULT 1, -- Minutes after Zawal
  maghrib_adjustment INT DEFAULT 1, -- Minutes after sunset
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  regional_preference TEXT, -- JSON array of regions
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_methods_code (method_code),
  INDEX idx_methods_numeric (numeric_code),
  INDEX idx_methods_active (is_active),
  INDEX idx_methods_default (is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Locations Table
-- Stores location data with Bengali names and coordinates
CREATE TABLE IF NOT EXISTS locations (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_bengali VARCHAR(255),
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  altitude INT DEFAULT NULL,
  district VARCHAR(100),
  division VARCHAR(100),
  country VARCHAR(2) DEFAULT 'BD',
  type ENUM('city', 'district', 'area', 'landmark', 'mosque') NOT NULL,
  population BIGINT,
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_location_coords (latitude, longitude),
  INDEX idx_location_name (name),
  INDEX idx_location_name_bengali (name_bengali),
  INDEX idx_location_district (district),
  INDEX idx_location_division (division),
  INDEX idx_location_type (type),
  INDEX idx_location_popular (is_popular),
  FULLTEXT INDEX idx_location_search (name, name_bengali, district, division),
  CONSTRAINT check_latitude_range CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT check_longitude_range CHECK (longitude >= -180 AND longitude <= 180),
  CONSTRAINT check_bangladesh_bounds CHECK (
    latitude >= 20.738 AND latitude <= 26.638 AND
    longitude >= 88.084 AND longitude <= 92.673
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Prayer Times Cache Table
-- Caches calculated prayer times for performance
CREATE TABLE IF NOT EXISTS prayer_times_cache (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  date DATE NOT NULL,
  method VARCHAR(50) NOT NULL, -- Can be method code or 'custom_angles', 'custom_time'
  fajr_angle DECIMAL(4,1), -- Custom Fajr angle if used
  isha_angle DECIMAL(4,1), -- Custom Isha angle if used
  asr_method VARCHAR(20) DEFAULT 'standard',
  dhuhr_adjustment INT DEFAULT 1,
  maghrib_adjustment INT DEFAULT 1,
  fajr TIME NOT NULL,
  sunrise TIME NOT NULL,
  dhuhr TIME NOT NULL,
  asr TIME NOT NULL,
  maghrib TIME NOT NULL,
  sunset TIME NOT NULL,
  isha TIME NOT NULL,
  timezone VARCHAR(10) DEFAULT '+06:00',
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_coordinate_date_method (
    latitude,
    longitude,
    date,
    method,
    COALESCE(fajr_angle, 0),
    COALESCE(isha_angle, 0),
    asr_method,
    dhuhr_adjustment,
    maghrib_adjustment
  ),
  INDEX idx_coordinate_date (latitude, longitude, date),
  INDEX idx_date_method (date, method),
  INDEX idx_method (method),
  INDEX idx_date_range (date),
  INDEX idx_calculated_at (calculated_at),
  CONSTRAINT check_latitude_range_cache CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT check_longitude_range_cache CHECK (longitude >= -180 AND longitude <= 180),
  CONSTRAINT check_bangladesh_bounds_cache CHECK (
    latitude >= 20.738 AND latitude <= 26.638 AND
    longitude >= 88.084 AND longitude <= 92.673
  ),
  CONSTRAINT check_dhuhr_adjustment CHECK (dhuhr_adjustment >= 1 AND dhuhr_adjustment <= 60),
  CONSTRAINT check_maghrib_adjustment CHECK (maghrib_adjustment >= 1 AND maghrib_adjustment <= 15)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Fasting Times Cache Table
-- Caches calculated fasting times for performance
CREATE TABLE IF NOT EXISTS fasting_times_cache (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  date DATE NOT NULL,
  method VARCHAR(50) NOT NULL,
  sehri_margin INT DEFAULT 10, -- Minutes before Fajr for Sehri end
  fajr_angle DECIMAL(4,1), -- Custom Fajr angle if used
  isha_angle DECIMAL(4,1), -- Custom Isha angle if used
  asr_method VARCHAR(20) DEFAULT 'standard',
  dhuhr_adjustment INT DEFAULT 1,
  maghrib_adjustment INT DEFAULT 1,
  sehri_end TIME NOT NULL,
  fajr TIME NOT NULL,
  sunrise TIME NOT NULL,
  sunset TIME NOT NULL,
  iftar TIME NOT NULL,
  maghrib TIME NOT NULL,
  fasting_duration_minutes INT NOT NULL,
  day_length_minutes INT NOT NULL,
  timezone VARCHAR(10) DEFAULT '+06:00',
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_fasting_coordinate_date_method (
    latitude,
    longitude,
    date,
    method,
    sehri_margin,
    COALESCE(fajr_angle, 0),
    COALESCE(isha_angle, 0),
    asr_method,
    dhuhr_adjustment,
    maghrib_adjustment
  ),
  INDEX idx_fasting_coordinate_date (latitude, longitude, date),
  INDEX idx_fasting_date_method (date, method),
  INDEX idx_fasting_date (date),
  CONSTRAINT check_sehri_margin CHECK (sehri_margin >= 5 AND sehri_margin <= 15),
  CONSTRAINT check_durations CHECK (
    fasting_duration_minutes > 0 AND
    day_length_minutes > 0 AND
    fasting_duration_minutes <= 1440 AND
    day_length_minutes <= 1440
  ),
  CONSTRAINT check_fasting_latitude_range CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT check_fasting_longitude_range CHECK (longitude >= -180 AND longitude <= 180),
  CONSTRAINT check_fasting_bangladesh_bounds CHECK (
    latitude >= 20.738 AND latitude <= 26.638 AND
    longitude >= 88.084 AND longitude <= 92.673
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- API Requests Log Table
-- Logs API requests for analytics and monitoring
CREATE TABLE IF NOT EXISTS api_requests (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  request_id VARCHAR(255) UNIQUE NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  api_key_id VARCHAR(255),
  ip_address VARCHAR(45),
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  request_date DATE,
  calculation_method VARCHAR(50),
  status_code INT NOT NULL,
  response_time_ms INT,
  cache_hit BOOLEAN DEFAULT FALSE,
  error_code VARCHAR(100),
  error_message TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_requests_api_key (api_key_id, created_at),
  INDEX idx_requests_endpoint (endpoint, created_at),
  INDEX idx_requests_date (created_at),
  INDEX idx_requests_status (status_code, created_at),
  INDEX idx_requests_coordinate (latitude, longitude),
  INDEX idx_requests_method (calculation_method, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
