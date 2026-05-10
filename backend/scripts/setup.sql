-- =============================================================================
-- Hidayah – Full Database Setup (excluding quran_data)
-- Run this on the production database: bandhan1_hidayah
-- =============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;

-- -----------------------------------------------------------------------------
-- migrations
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `migration_name` VARCHAR(255) UNIQUE NOT NULL,
  `batch_number` INT NOT NULL,
  `executed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `execution_time_ms` INT,
  `status` ENUM('pending','running','completed','failed','rolled_back') DEFAULT 'pending',
  `error_message` TEXT,
  INDEX idx_batch (batch_number),
  INDEX idx_status (status),
  INDEX idx_executed_at (executed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- calculation_methods
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `calculation_methods` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `method_code` VARCHAR(50) UNIQUE NOT NULL,
  `numeric_code` INT UNIQUE,
  `method_name` VARCHAR(255) NOT NULL,
  `fajr_angle` DECIMAL(4,1) NOT NULL,
  `isha_angle` DECIMAL(4,1),
  `isha_time_adjustment` INT,
  `isha_calculation_type` ENUM('angle','time') DEFAULT 'angle',
  `asr_method` VARCHAR(20) DEFAULT 'standard',
  `dhuhr_adjustment` INT DEFAULT 1,
  `maghrib_adjustment` INT DEFAULT 1,
  `is_default` BOOLEAN DEFAULT FALSE,
  `is_active` BOOLEAN DEFAULT TRUE,
  `regional_preference` TEXT,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_methods_code (method_code),
  INDEX idx_methods_numeric (numeric_code),
  INDEX idx_methods_active (is_active),
  INDEX idx_methods_default (is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `calculation_methods`
  (method_code, numeric_code, method_name, fajr_angle, isha_angle, isha_time_adjustment, isha_calculation_type, asr_method, dhuhr_adjustment, maghrib_adjustment, is_default, is_active, regional_preference, description)
VALUES
  ('karachi',       3,    'University of Islamic Sciences, Karachi',                    18.0, 18.0, NULL, 'angle', 'standard', 1, 1, 1, 1, '["Pakistan","India","Bangladesh"]', 'Most commonly used method in South Asia, including Bangladesh. This is the default method for the API.'),
  ('mwl',           1,    'Muslim World League',                                        18.0, 17.0, NULL, 'angle', 'standard', 1, 1, 0, 1, '["International"]',                  'Used by many Islamic organizations worldwide'),
  ('isna',          5,    'Islamic Society of North America',                           15.0, 15.0, NULL, 'angle', 'standard', 1, 1, 0, 1, '["United States","Canada"]',         'Common in North America'),
  ('egyptian',      2,    'Egyptian General Authority of Survey',                       19.5, 17.5, NULL, 'angle', 'standard', 1, 1, 0, 1, '["Egypt","Middle East"]',            'Official method used in Egypt'),
  ('umm_al_qura',   4,    'Umm Al-Qura',                                               18.5, NULL, 90,   'time',  'standard', 1, 1, 0, 1, '["Saudi Arabia","Gulf countries"]',  'Official method for Saudi Arabia. Isha is time-based (90 minutes after Maghrib)'),
  ('singapore',     9,    'Majlis Ugama Islam Singapura',                               20.0, 18.0, NULL, 'angle', 'standard', 1, 1, 0, 1, '["Singapore","Southeast Asia"]',     'Official method for Singapore'),
  ('turkey',        16,   'Diyanet İşleri Başkanlığı, Turkey',                         18.0, 17.0, NULL, 'angle', 'standard', 1, 1, 0, 1, '["Turkey"]',                         'Official method for Turkey'),
  ('jakim',         13,   'JAKIM (Jabatan Kemajuan Islam Malaysia)',                    20.0, 18.0, NULL, 'angle', 'standard', 1, 1, 0, 1, '["Malaysia"]',                       'Official method for Malaysia'),
  ('france',        8,    'Union des Organisations Islamiques de France',               12.0, 12.0, NULL, 'angle', 'standard', 1, 1, 0, 1, '["France","Europe"]',                'Used by French Islamic organizations'),
  ('algeria',       15,   'Algerian Ministry of Religious Affairs and Wakfs',           18.0, 17.0, NULL, 'angle', 'standard', 1, 1, 0, 1, '["Algeria"]',                        'Official method for Algeria'),
  ('tunisia',       12,   'Tunisian Ministry of Religious Affairs',                     18.0, 18.0, NULL, 'angle', 'standard', 1, 1, 0, 1, '["Tunisia"]',                        'Official method for Tunisia'),
  ('indonesia',     11,   'Sihat/Kemenag (Indonesia)',                                  20.0, 18.0, NULL, 'angle', 'standard', 1, 1, 0, 1, '["Indonesia"]',                      'Official method for Indonesia'),
  ('russia',        14,   'Spiritual Administration of Muslims of Russia',              16.0, 15.0, NULL, 'angle', 'standard', 1, 1, 0, 1, '["Russia","Central Asia"]',          'Used in Russia'),
  ('jafri',         18,   'Shia Ithna-Ashari, Leva Institute, Qum (Jafri)',            16.0, 14.0, NULL, 'angle', 'standard', 1, 1, 0, 1, '["Shia communities worldwide"]',     'Used by Shia Ithna-Ashari communities'),
  ('hanafi',        NULL, 'Hanafi',                                                     18.0, 18.0, NULL, 'angle', 'hanafi',   1, 1, 0, 1, '["Hanafi communities"]',             'Hanafi school of thought'),
  ('shafi',         NULL, 'Shafi',                                                      20.0, 18.0, NULL, 'angle', 'standard', 1, 1, 0, 1, '["Shafi communities"]',              'Shafi school of thought'),
  ('maliki',        NULL, 'Maliki',                                                     18.0, 17.0, NULL, 'angle', 'standard', 1, 1, 0, 1, '["Maliki communities"]',             'Maliki school of thought'),
  ('hanbali',       NULL, 'Hanbali',                                                    18.0, 17.0, NULL, 'angle', 'standard', 1, 1, 0, 1, '["Hanbali communities"]',            'Hanbali school of thought'),
  ('custom_angles', 6,    'Custom - Fajr and Isha Angle',                               18.0, 18.0, NULL, 'angle', 'standard', 1, 1, 0, 1, NULL,                                 'User-defined Fajr and Isha angles'),
  ('custom_time',   7,    'Custom - Fajr Angle and Isha Time Adjustment',               18.0, NULL, 90,   'time',  'standard', 1, 1, 0, 1, NULL,                                 'Fajr angle + Isha time adjustment (similar to Umm Al-Qura)')
ON DUPLICATE KEY UPDATE
  method_name = VALUES(method_name),
  fajr_angle = VALUES(fajr_angle),
  isha_angle = VALUES(isha_angle),
  isha_time_adjustment = VALUES(isha_time_adjustment),
  isha_calculation_type = VALUES(isha_calculation_type),
  asr_method = VALUES(asr_method),
  is_default = VALUES(is_default),
  regional_preference = VALUES(regional_preference),
  description = VALUES(description);

-- -----------------------------------------------------------------------------
-- locations
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `locations` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `name_bengali` VARCHAR(255),
  `latitude` DECIMAL(9,6) NOT NULL,
  `longitude` DECIMAL(9,6) NOT NULL,
  `altitude` INT DEFAULT NULL,
  `district` VARCHAR(100),
  `division` VARCHAR(100),
  `country` VARCHAR(2) DEFAULT 'BD',
  `type` ENUM('city','district','area','landmark','mosque') NOT NULL,
  `population` BIGINT,
  `is_popular` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_location_coords (latitude, longitude),
  INDEX idx_location_name (name),
  INDEX idx_location_name_bengali (name_bengali),
  INDEX idx_location_district (district),
  INDEX idx_location_division (division),
  INDEX idx_location_type (type),
  INDEX idx_location_popular (is_popular),
  FULLTEXT INDEX idx_location_search (name, name_bengali, district, division)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `locations` (name, name_bengali, latitude, longitude, district, division, type, population, is_popular, country) VALUES
  ('Dhaka',       'ঢাকা',       23.810300, 90.412500, 'Dhaka',       'Dhaka',       'city', 21000000, 1, 'BD'),
  ('Chittagong',  'চট্টগ্রাম',  22.356900, 91.783200, 'Chittagong',  'Chittagong',  'city',  5000000, 1, 'BD'),
  ('Sylhet',      'সিলেট',      24.894900, 91.868700, 'Sylhet',      'Sylhet',      'city',   500000, 1, 'BD'),
  ('Rajshahi',    'রাজশাহী',    24.374500, 88.604200, 'Rajshahi',    'Rajshahi',    'city',   700000, 1, 'BD'),
  ('Khulna',      'খুলনা',      22.845600, 89.540300, 'Khulna',      'Khulna',      'city',  1500000, 1, 'BD'),
  ('Barisal',     'বরিশাল',     22.701000, 90.353100, 'Barisal',     'Barisal',     'city',   300000, 1, 'BD'),
  ('Rangpur',     'রংপুর',      25.743900, 89.275600, 'Rangpur',     'Rangpur',     'city',   300000, 1, 'BD'),
  ('Mymensingh',  'ময়মনসিংহ',  24.747100, 90.420300, 'Mymensingh',  'Mymensingh',  'city',   400000, 1, 'BD')
ON DUPLICATE KEY UPDATE name_bengali=VALUES(name_bengali), latitude=VALUES(latitude), longitude=VALUES(longitude), type=VALUES(type), population=VALUES(population), is_popular=VALUES(is_popular);

INSERT INTO `locations` (name, name_bengali, latitude, longitude, district, division, type, country) VALUES
  -- Dhaka Division
  ('Dhaka',        'ঢাকা',        23.810300, 90.412500, 'Dhaka',        'Dhaka',       'district', 'BD'),
  ('Gazipur',      'গাজীপুর',     24.002900, 90.426300, 'Gazipur',      'Dhaka',       'district', 'BD'),
  ('Narayanganj',  'নারায়ণগঞ্জ', 23.623800, 90.500000, 'Narayanganj',  'Dhaka',       'district', 'BD'),
  ('Tangail',      'টাঙ্গাইল',    24.251300, 89.916700, 'Tangail',      'Dhaka',       'district', 'BD'),
  ('Kishoreganj',  'কিশোরগঞ্জ',   24.444400, 90.783300, 'Kishoreganj',  'Dhaka',       'district', 'BD'),
  ('Manikganj',    'মানিকগঞ্জ',   23.860000, 90.000000, 'Manikganj',    'Dhaka',       'district', 'BD'),
  ('Munshiganj',   'মুন্সীগঞ্জ',  23.550000, 90.533300, 'Munshiganj',   'Dhaka',       'district', 'BD'),
  ('Narsingdi',    'নরসিংদী',     23.916700, 90.716700, 'Narsingdi',    'Dhaka',       'district', 'BD'),
  ('Faridpur',     'ফরিদপুর',     23.600000, 89.833300, 'Faridpur',     'Dhaka',       'district', 'BD'),
  ('Gopalganj',    'গোপালগঞ্জ',   23.016700, 89.916700, 'Gopalganj',    'Dhaka',       'district', 'BD'),
  ('Madaripur',    'মাদারীপুর',   23.166700, 90.200000, 'Madaripur',    'Dhaka',       'district', 'BD'),
  ('Rajbari',      'রাজবাড়ী',    23.750000, 89.583300, 'Rajbari',      'Dhaka',       'district', 'BD'),
  ('Shariatpur',   'শরীয়তপুর',   23.200000, 90.350000, 'Shariatpur',   'Dhaka',       'district', 'BD'),
  -- Chittagong Division
  ('Chittagong',   'চট্টগ্রাম',   22.356900, 91.783200, 'Chittagong',   'Chittagong',  'district', 'BD'),
  ('Cox\'s Bazar', 'কক্সবাজার',   21.433300, 91.983300, 'Cox\'s Bazar', 'Chittagong',  'district', 'BD'),
  ('Bandarban',    'বান্দরবান',   22.195300, 92.218100, 'Bandarban',    'Chittagong',  'district', 'BD'),
  ('Rangamati',    'রাঙ্গামাটি',  22.633300, 92.200000, 'Rangamati',    'Chittagong',  'district', 'BD'),
  ('Khagrachhari', 'খাগড়াছড়ি',  23.100000, 91.983300, 'Khagrachhari', 'Chittagong',  'district', 'BD'),
  ('Feni',         'ফেনী',        23.016700, 91.400000, 'Feni',         'Chittagong',  'district', 'BD'),
  ('Lakshmipur',   'লক্ষ্মীপুর',  22.950000, 90.833300, 'Lakshmipur',   'Chittagong',  'district', 'BD'),
  ('Noakhali',     'নোয়াখালী',   22.866700, 91.100000, 'Noakhali',     'Chittagong',  'district', 'BD'),
  ('Chandpur',     'চাঁদপুর',     23.216700, 90.650000, 'Chandpur',     'Chittagong',  'district', 'BD'),
  ('Comilla',      'কুমিল্লা',    23.461900, 91.185000, 'Comilla',      'Chittagong',  'district', 'BD'),
  ('Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 23.966700, 91.100000, 'Brahmanbaria', 'Chittagong', 'district', 'BD'),
  -- Sylhet Division
  ('Sylhet',       'সিলেট',       24.894900, 91.868700, 'Sylhet',       'Sylhet',      'district', 'BD'),
  ('Moulvibazar',  'মৌলভীবাজার',  24.483300, 91.766700, 'Moulvibazar',  'Sylhet',      'district', 'BD'),
  ('Habiganj',     'হবিগঞ্জ',     24.366700, 91.416700, 'Habiganj',     'Sylhet',      'district', 'BD'),
  ('Sunamganj',    'সুনামগঞ্জ',   25.033300, 91.400000, 'Sunamganj',    'Sylhet',      'district', 'BD'),
  -- Rajshahi Division
  ('Rajshahi',     'রাজশাহী',     24.374500, 88.604200, 'Rajshahi',     'Rajshahi',    'district', 'BD'),
  ('Bogra',        'বগুড়া',       24.850000, 89.366700, 'Bogra',        'Rajshahi',    'district', 'BD'),
  ('Joypurhat',    'জয়পুরহাট',   25.100000, 89.016700, 'Joypurhat',    'Rajshahi',    'district', 'BD'),
  ('Naogaon',      'নওগাঁ',       24.800000, 88.933300, 'Naogaon',      'Rajshahi',    'district', 'BD'),
  ('Natore',       'নাটোর',       24.416700, 88.983300, 'Natore',       'Rajshahi',    'district', 'BD'),
  ('Chapai Nawabganj', 'চাঁপাই নবাবগঞ্জ', 24.600000, 88.283300, 'Chapai Nawabganj', 'Rajshahi', 'district', 'BD'),
  ('Pabna',        'পাবনা',       24.000000, 89.250000, 'Pabna',        'Rajshahi',    'district', 'BD'),
  ('Sirajganj',    'সিরাজগঞ্জ',   24.450000, 89.716700, 'Sirajganj',    'Rajshahi',    'district', 'BD'),
  -- Khulna Division
  ('Khulna',       'খুলনা',       22.845600, 89.540300, 'Khulna',       'Khulna',      'district', 'BD'),
  ('Bagerhat',     'বাগেরহাট',    22.650000, 89.783300, 'Bagerhat',     'Khulna',      'district', 'BD'),
  ('Chuadanga',    'চুয়াডাঙ্গা',  23.633300, 88.816700, 'Chuadanga',    'Khulna',      'district', 'BD'),
  ('Jashore',      'যশোর',        23.166700, 89.216700, 'Jashore',      'Khulna',      'district', 'BD'),
  ('Jhenaidah',    'ঝিনাইদহ',     23.533300, 89.166700, 'Jhenaidah',    'Khulna',      'district', 'BD'),
  ('Kushtia',      'কুষ্টিয়া',   23.900000, 89.116700, 'Kushtia',      'Khulna',      'district', 'BD'),
  ('Magura',       'মাগুরা',      23.483300, 89.416700, 'Magura',       'Khulna',      'district', 'BD'),
  ('Meherpur',     'মেহেরপুর',    23.766700, 88.633300, 'Meherpur',     'Khulna',      'district', 'BD'),
  ('Narail',       'নড়াইল',       23.166700, 89.500000, 'Narail',       'Khulna',      'district', 'BD'),
  ('Satkhira',     'সাতক্ষীরা',   22.716700, 89.083300, 'Satkhira',     'Khulna',      'district', 'BD'),
  -- Barisal Division
  ('Barisal',      'বরিশাল',      22.701000, 90.353100, 'Barisal',      'Barisal',     'district', 'BD'),
  ('Barguna',      'বরগুনা',      22.150000, 90.116700, 'Barguna',      'Barisal',     'district', 'BD'),
  ('Bhola',        'ভোলা',        22.683300, 90.650000, 'Bhola',        'Barisal',     'district', 'BD'),
  ('Jhalokati',    'ঝালকাঠি',     22.633300, 90.200000, 'Jhalokati',    'Barisal',     'district', 'BD'),
  ('Patuakhali',   'পটুয়াখালী',  22.350000, 90.316700, 'Patuakhali',   'Barisal',     'district', 'BD'),
  ('Pirojpur',     'পিরোজপুর',    22.583300, 90.000000, 'Pirojpur',     'Barisal',     'district', 'BD'),
  -- Rangpur Division
  ('Rangpur',      'রংপুর',       25.743900, 89.275600, 'Rangpur',      'Rangpur',     'district', 'BD'),
  ('Dinajpur',     'দিনাজপুর',    25.633300, 88.633300, 'Dinajpur',     'Rangpur',     'district', 'BD'),
  ('Gaibandha',    'গাইবান্ধা',   25.250000, 89.516700, 'Gaibandha',    'Rangpur',     'district', 'BD'),
  ('Kurigram',     'কুড়িগ্রাম',  25.816700, 89.650000, 'Kurigram',     'Rangpur',     'district', 'BD'),
  ('Lalmonirhat',  'লালমনিরহাট',  25.916700, 89.450000, 'Lalmonirhat',  'Rangpur',     'district', 'BD'),
  ('Nilphamari',   'নীলফামারী',   25.933300, 88.850000, 'Nilphamari',   'Rangpur',     'district', 'BD'),
  ('Panchagarh',   'পঞ্চগড়',     26.333300, 88.566700, 'Panchagarh',   'Rangpur',     'district', 'BD'),
  ('Thakurgaon',   'ঠাকুরগাঁও',  26.033300, 88.466700, 'Thakurgaon',   'Rangpur',     'district', 'BD'),
  -- Mymensingh Division
  ('Mymensingh',   'ময়মনসিংহ',   24.747100, 90.420300, 'Mymensingh',   'Mymensingh',  'district', 'BD'),
  ('Jamalpur',     'জামালপুর',    24.916700, 89.933300, 'Jamalpur',     'Mymensingh',  'district', 'BD'),
  ('Netrokona',    'নেত্রকোণা',   24.883300, 90.733300, 'Netrokona',    'Mymensingh',  'district', 'BD'),
  ('Sherpur',      'শেরপুর',      25.016700, 90.016700, 'Sherpur',      'Mymensingh',  'district', 'BD')
ON DUPLICATE KEY UPDATE name_bengali=VALUES(name_bengali), latitude=VALUES(latitude), longitude=VALUES(longitude), division=VALUES(division);

-- -----------------------------------------------------------------------------
-- prayer_times_cache
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `prayer_times_cache` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `latitude` DECIMAL(9,6) NOT NULL,
  `longitude` DECIMAL(9,6) NOT NULL,
  `date` DATE NOT NULL,
  `method` VARCHAR(50) NOT NULL,
  `fajr_angle` DECIMAL(4,1),
  `isha_angle` DECIMAL(4,1),
  `asr_method` VARCHAR(20) DEFAULT 'standard',
  `dhuhr_adjustment` INT DEFAULT 1,
  `maghrib_adjustment` INT DEFAULT 1,
  `fajr` TIME NOT NULL,
  `sunrise` TIME NOT NULL,
  `dhuhr` TIME NOT NULL,
  `asr` TIME NOT NULL,
  `maghrib` TIME NOT NULL,
  `sunset` TIME NOT NULL,
  `isha` TIME NOT NULL,
  `timezone` VARCHAR(10) DEFAULT '+06:00',
  `calculated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_coordinate_date (latitude, longitude, date),
  INDEX idx_date_method (date, method),
  INDEX idx_method (method),
  INDEX idx_date_range (date),
  INDEX idx_calculated_at (calculated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- fasting_times_cache
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `fasting_times_cache` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `latitude` DECIMAL(9,6) NOT NULL,
  `longitude` DECIMAL(9,6) NOT NULL,
  `date` DATE NOT NULL,
  `method` VARCHAR(50) NOT NULL,
  `sehri_margin` INT DEFAULT 10,
  `fajr_angle` DECIMAL(4,1),
  `isha_angle` DECIMAL(4,1),
  `asr_method` VARCHAR(20) DEFAULT 'standard',
  `dhuhr_adjustment` INT DEFAULT 1,
  `maghrib_adjustment` INT DEFAULT 1,
  `sehri_end` TIME NOT NULL,
  `fajr` TIME NOT NULL,
  `sunrise` TIME NOT NULL,
  `sunset` TIME NOT NULL,
  `iftar` TIME NOT NULL,
  `maghrib` TIME NOT NULL,
  `fasting_duration_minutes` INT NOT NULL,
  `day_length_minutes` INT NOT NULL,
  `timezone` VARCHAR(10) DEFAULT '+06:00',
  `calculated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_fasting_coordinate_date (latitude, longitude, date),
  INDEX idx_fasting_date_method (date, method),
  INDEX idx_fasting_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- api_requests
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `api_requests` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `request_id` VARCHAR(255) UNIQUE NOT NULL,
  `endpoint` VARCHAR(255) NOT NULL,
  `method` VARCHAR(10) NOT NULL,
  `api_key_id` VARCHAR(255),
  `ip_address` VARCHAR(45),
  `latitude` DECIMAL(9,6),
  `longitude` DECIMAL(9,6),
  `request_date` DATE,
  `calculation_method` VARCHAR(50),
  `status_code` INT NOT NULL,
  `response_time_ms` INT,
  `cache_hit` BOOLEAN DEFAULT FALSE,
  `error_code` VARCHAR(100),
  `error_message` TEXT,
  `user_agent` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_requests_api_key (api_key_id, created_at),
  INDEX idx_requests_endpoint (endpoint, created_at),
  INDEX idx_requests_date (created_at),
  INDEX idx_requests_status (status_code, created_at),
  INDEX idx_requests_coordinate (latitude, longitude),
  INDEX idx_requests_method (calculation_method, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- quran_surahs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `quran_surahs` (
  `number`          TINYINT UNSIGNED PRIMARY KEY,
  `name_ar`         VARCHAR(100)  NOT NULL,
  `name_en`         VARCHAR(100)  NOT NULL,
  `name_en_trans`   VARCHAR(200)  NOT NULL,
  `revelation_type` ENUM('Meccan','Medinan') NOT NULL,
  `ayah_count`      SMALLINT UNSIGNED NOT NULL,
  INDEX idx_qs_revelation (revelation_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- quran_ayahs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `quran_ayahs` (
  `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `surah_number`  TINYINT UNSIGNED NOT NULL,
  `ayah_number`   SMALLINT UNSIGNED NOT NULL,
  `number_global` SMALLINT UNSIGNED NOT NULL,
  `text_ar`       TEXT NOT NULL,
  `page`          SMALLINT UNSIGNED NOT NULL,
  `juz`           TINYINT UNSIGNED NOT NULL,
  `hizb`          TINYINT UNSIGNED NOT NULL,
  `sajdah`        TINYINT(1) NOT NULL DEFAULT 0,
  UNIQUE KEY uq_surah_ayah (surah_number, ayah_number),
  UNIQUE KEY uq_global (number_global),
  INDEX idx_qa_page (page),
  INDEX idx_qa_juz (juz),
  FOREIGN KEY (surah_number) REFERENCES quran_surahs(number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- quran_editions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `quran_editions` (
  `identifier` VARCHAR(50) PRIMARY KEY,
  `language`   VARCHAR(10)  NOT NULL,
  `name`       VARCHAR(200) NOT NULL,
  `author`     VARCHAR(200) NOT NULL DEFAULT '',
  `direction`  ENUM('ltr','rtl') NOT NULL DEFAULT 'ltr',
  INDEX idx_qe_language (language)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- quran_translations
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `quran_translations` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `edition`      VARCHAR(50)  NOT NULL,
  `surah_number` TINYINT UNSIGNED NOT NULL,
  `ayah_number`  SMALLINT UNSIGNED NOT NULL,
  `text`         MEDIUMTEXT   NOT NULL,
  UNIQUE KEY uq_tr_edition_ayah (edition, surah_number, ayah_number),
  INDEX idx_tr_surah (edition, surah_number),
  FULLTEXT INDEX idx_tr_fulltext (text),
  FOREIGN KEY (edition) REFERENCES quran_editions(identifier),
  FOREIGN KEY (surah_number, ayah_number) REFERENCES quran_ayahs(surah_number, ayah_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- books
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `books` (
  `id`                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug`                  VARCHAR(120) UNIQUE NOT NULL,
  `title`                 VARCHAR(300) NOT NULL,
  `title_ar`              VARCHAR(300),
  `subtitle`              VARCHAR(300),
  `description`           TEXT,
  `language`              VARCHAR(10) NOT NULL DEFAULT 'en',
  `primary_text_language` VARCHAR(10) NOT NULL DEFAULT 'en',
  `islamic_topics`        JSON,
  `author`                VARCHAR(200),
  `translator`            VARCHAR(200),
  `publisher`             VARCHAR(200),
  `published_year`        SMALLINT UNSIGNED,
  `cover_url`             VARCHAR(500),
  `embed_url`             VARCHAR(500),
  `pdf_url`               VARCHAR(500),
  `page_count`            SMALLINT UNSIGNED,
  `license_class`         ENUM('public_domain','cc_by','cc_by_sa','cc_by_nc','permission') DEFAULT 'public_domain',
  `status`                ENUM('live','draft','removed') NOT NULL DEFAULT 'draft',
  `created_at`            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_books_language (language),
  INDEX idx_books_status (status),
  FULLTEXT INDEX idx_books_search (title, subtitle, description, author)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `books`
  (slug, title, title_ar, subtitle, description, language, primary_text_language, islamic_topics, author, translator, publisher, published_year, cover_url, embed_url, pdf_url, page_count, license_class, status)
VALUES
  ('riyad-as-salihin',          'Riyad as-Salihin',          'رياض الصالحين',   'Gardens of the Righteous',             'A comprehensive collection of authentic hadiths compiled by Imam al-Nawawi, covering every aspect of Islamic life and spirituality.',                                                                                                     'en','en','["hadith","spirituality"]',    'Imam al-Nawawi',              NULL, NULL,          NULL, 'https://archive.org/services/img/riyad-us-saliheen',                                     'https://archive.org/embed/riyad-us-saliheen',                                     'https://archive.org/download/riyad-us-saliheen/riyad-us-saliheen.pdf',                                               NULL, 'public_domain', 'live'),
  ('sealed-nectar',             'The Sealed Nectar',          'الرحيق المختوم',  'Biography of the Noble Prophet',       'An award-winning biography of Prophet Muhammad ﷺ by Saif ur-Rahman Mubarakpuri. Winner of the First Prize by the Muslim World League at a worldwide competition on the Prophet\'s biography.',                                         'en','en','["seerah"]',                  'Saif ur-Rahman Mubarakpuri',  NULL, 'Darussalam',  1996, 'https://archive.org/services/img/TheSealedNectarBiographyOfTheProphetMuhammadPBUH',    'https://archive.org/embed/TheSealedNectarBiographyOfTheProphetMuhammadPBUH',      'https://archive.org/download/TheSealedNectarBiographyOfTheProphetMuhammadPBUH/TheSealedNectar.pdf',                  580,  'public_domain', 'live'),
  ('fiqh-us-sunnah',            'Fiqh us-Sunnah',             'فقه السنة',       'Vol. 1 — Purification and Prayer',     'A clear and authoritative guide to Islamic jurisprudence based on the Quran and Sunnah. Covers the fundamentals of Islamic law with clear evidence from primary sources.',                                                               'en','en','["fiqh"]',                    'Sayyid Sabiq',                NULL, NULL,          NULL, 'https://archive.org/services/img/FiqhUsSunnahVolume1SayyidSabiq',                       'https://archive.org/embed/FiqhUsSunnahVolume1SayyidSabiq',                        'https://archive.org/download/FiqhUsSunnahVolume1SayyidSabiq/Fiqh-Us-Sunnah-Volume-1.pdf',                            NULL, 'public_domain', 'live'),
  ('tafsir-ibn-kathir-1',       'Tafsir Ibn Kathir',          'تفسير ابن كثير',  'Vol. 1 — Abridged',                    'The abridged version of the renowned Tafsir by Ibn Kathir, one of the most comprehensive and authentic explanations of the Quran. An essential reference for students of Islamic knowledge.',                                          'en','en','["tafsir"]',                  'Ibn Kathir',                  NULL, 'Darussalam',  2000, 'https://archive.org/services/img/TafsirIbnKathirPart1',                                 'https://archive.org/embed/TafsirIbnKathirPart1',                                  'https://archive.org/download/TafsirIbnKathirPart1/Tafsir_Ibn_Kathir_Part_1.pdf',                                     NULL, 'public_domain', 'live'),
  ('forty-hadith-nawawi',       'Forty Hadith',               'الأربعون النووية','An-Nawawi\'s Forty Hadith',            'Imam al-Nawawi\'s famous collection of forty-two hadith encompassing the most fundamental principles of Islam. Essential reading for every Muslim.',                                                                                    'en','en','["hadith"]',                  'Imam al-Nawawi',              NULL, NULL,          NULL, 'https://archive.org/services/img/FortyHadithNawawi',                                    'https://archive.org/embed/FortyHadithNawawi',                                     'https://archive.org/download/FortyHadithNawawi/Forty_Hadith_Nawawi.pdf',                                              NULL, 'public_domain', 'live'),
  ('three-fundamental-principles','The Three Fundamental Principles','ثلاثة الأصول','Usool ath-Thalathah',              'A foundational text of Islamic creed by Shaykh Muhammad ibn Abd al-Wahhab, covering three essential questions every Muslim must know: Who is your Lord? What is your religion? Who is your Prophet?',                                    'en','en','["aqeedah"]',                 'Muhammad ibn Abd al-Wahhab', NULL, NULL,          NULL, 'https://archive.org/services/img/ThreeFundamentalPrinciples',                           'https://archive.org/embed/ThreeFundamentalPrinciples',                            'https://archive.org/download/ThreeFundamentalPrinciples/Three_Fundamental_Principles.pdf',                            NULL, 'public_domain', 'live'),
  ('dont-be-sad',               'Don\'t Be Sad',              'لا تحزن',         NULL,                                   'A global bestseller offering comfort, reassurance, and practical advice drawn from the Quran and Sunnah for dealing with grief, anxiety, and the trials of life.',                                                                       'en','en','["spirituality"]',            'Aaidh al-Qarni',              NULL, NULL,          NULL, 'https://archive.org/services/img/DontBeSadAaidhalQarni',                                'https://archive.org/embed/DontBeSadAaidhalQarni',                                 'https://archive.org/download/DontBeSadAaidhalQarni/DontBeSad.pdf',                                                   NULL, 'public_domain', 'live'),
  ('stories-of-the-prophets',   'Stories of the Prophets',   'قصص الأنبياء',    NULL,                                   'Ibn Kathir\'s comprehensive retelling of the stories of the prophets from Adam to Jesus (peace be upon them all), drawn from the Quran, authentic hadiths, and historical records.',                                                   'en','en','["seerah","history"]',        'Ibn Kathir',                  NULL, NULL,          NULL, 'https://archive.org/services/img/StoriesOfTheProphetsIbnKathir',                        'https://archive.org/embed/StoriesOfTheProphetsIbnKathir',                         'https://archive.org/download/StoriesOfTheProphetsIbnKathir/StoriesOfTheProphets.pdf',                                 NULL, 'public_domain', 'live')
ON DUPLICATE KEY UPDATE
  title=VALUES(title), description=VALUES(description), embed_url=VALUES(embed_url), cover_url=VALUES(cover_url), status=VALUES(status);

-- -----------------------------------------------------------------------------
-- admin_users
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id`            INT AUTO_INCREMENT PRIMARY KEY,
  `username`      VARCHAR(80) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `is_active`     TINYINT(1) NOT NULL DEFAULT 1,
  `last_login`    TIMESTAMP NULL,
  `created_at`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default admin — password: admin123 (CHANGE THIS IMMEDIATELY after first login)
-- Hash generated with bcrypt rounds=10
INSERT INTO `admin_users` (username, password_hash) VALUES
  ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE username=username;

-- -----------------------------------------------------------------------------
-- duas
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `duas` (
  `id`              INT AUTO_INCREMENT PRIMARY KEY,
  `category`        VARCHAR(50) NOT NULL,
  `arabic`          TEXT NOT NULL,
  `transliteration` TEXT,
  `translation_en`  TEXT NOT NULL,
  `translation_bn`  TEXT,
  `reference`       VARCHAR(200),
  `count`           TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `quran_surah`     TINYINT UNSIGNED,
  `quran_ayah`      SMALLINT UNSIGNED,
  `sort_order`      SMALLINT NOT NULL DEFAULT 0,
  `created_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_duas_category (category),
  INDEX idx_duas_sort (category, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET foreign_key_checks = 1;
