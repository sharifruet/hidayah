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
    (COALESCE(fajr_angle, 0)),
    (COALESCE(isha_angle, 0)),
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
    (COALESCE(fajr_angle, 0)),
    (COALESCE(isha_angle, 0)),
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
  CONSTRAINT check_fasting_longitude_range CHECK (longitude >= -180 AND longitude <= 180)
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

-- ─── Quran ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS quran_surahs (
  number        TINYINT UNSIGNED PRIMARY KEY,        -- 1–114
  name_ar       VARCHAR(100)  NOT NULL,
  name_en       VARCHAR(100)  NOT NULL,
  name_en_trans VARCHAR(200)  NOT NULL,
  revelation_type ENUM('Meccan','Medinan') NOT NULL,
  ayah_count    SMALLINT UNSIGNED NOT NULL,
  INDEX idx_qs_revelation (revelation_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quran_ayahs (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  surah_number  TINYINT UNSIGNED NOT NULL,
  ayah_number   SMALLINT UNSIGNED NOT NULL,   -- within surah (1-indexed)
  number_global SMALLINT UNSIGNED NOT NULL,   -- 1–6236
  text_ar       TEXT NOT NULL,
  page          SMALLINT UNSIGNED NOT NULL,
  juz           TINYINT UNSIGNED NOT NULL,
  hizb          TINYINT UNSIGNED NOT NULL,
  sajdah        TINYINT(1) NOT NULL DEFAULT 0,
  UNIQUE KEY uq_surah_ayah (surah_number, ayah_number),
  UNIQUE KEY uq_global (number_global),
  INDEX idx_qa_page (page),
  INDEX idx_qa_juz (juz),
  FOREIGN KEY (surah_number) REFERENCES quran_surahs(number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quran_editions (
  identifier  VARCHAR(50) PRIMARY KEY,
  language    VARCHAR(10)  NOT NULL,
  name        VARCHAR(200) NOT NULL,
  author      VARCHAR(200) NOT NULL DEFAULT '',
  direction   ENUM('ltr','rtl') NOT NULL DEFAULT 'ltr',
  INDEX idx_qe_language (language)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quran_translations (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  edition     VARCHAR(50)  NOT NULL,
  surah_number TINYINT UNSIGNED NOT NULL,
  ayah_number  SMALLINT UNSIGNED NOT NULL,
  text        MEDIUMTEXT   NOT NULL,
  UNIQUE KEY uq_tr_edition_ayah (edition, surah_number, ayah_number),
  INDEX idx_tr_surah (edition, surah_number),
  FULLTEXT INDEX idx_tr_fulltext (text),
  FOREIGN KEY (edition) REFERENCES quran_editions(identifier),
  FOREIGN KEY (surah_number, ayah_number) REFERENCES quran_ayahs(surah_number, ayah_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Hadith ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS hadith_collections (
  slug          VARCHAR(30) PRIMARY KEY,       -- 'bukhari', 'muslim', ...
  name          VARCHAR(150) NOT NULL,
  total_hadiths SMALLINT UNSIGNED NOT NULL,
  total_books   SMALLINT UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hadith_books (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  collection_slug     VARCHAR(30) NOT NULL,
  book_number         SMALLINT UNSIGNED NOT NULL,
  name                VARCHAR(255) NOT NULL,
  hadithnumber_first  SMALLINT UNSIGNED NOT NULL,
  hadithnumber_last   SMALLINT UNSIGNED NOT NULL,
  UNIQUE KEY uq_hb_collection_book (collection_slug, book_number),
  FOREIGN KEY (collection_slug) REFERENCES hadith_collections(slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hadiths (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  collection_slug   VARCHAR(30) NOT NULL,
  book_number       SMALLINT UNSIGNED NOT NULL,
  hadithnumber      SMALLINT UNSIGNED NOT NULL,   -- global sequence within collection
  in_book_number    SMALLINT UNSIGNED NOT NULL,   -- number within the book
  arabic_number     SMALLINT UNSIGNED NULL,
  text_ar           MEDIUMTEXT NOT NULL,
  grades            JSON NULL,
  UNIQUE KEY uq_h_collection_number (collection_slug, hadithnumber),
  INDEX idx_h_book (collection_slug, book_number),
  FOREIGN KEY (collection_slug) REFERENCES hadith_collections(slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hadith_editions (
  identifier      VARCHAR(50) PRIMARY KEY,   -- e.g. 'ben-bukhari', 'eng-bukhari'
  collection_slug VARCHAR(30) NOT NULL,
  language        VARCHAR(10) NOT NULL,      -- 'bn', 'en'
  name            VARCHAR(200) NOT NULL,
  author          VARCHAR(200) NOT NULL DEFAULT '',
  direction       ENUM('ltr','rtl') NOT NULL DEFAULT 'ltr',
  FOREIGN KEY (collection_slug) REFERENCES hadith_collections(slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hadith_translations (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  edition         VARCHAR(50) NOT NULL,
  collection_slug VARCHAR(30) NOT NULL,
  hadithnumber    SMALLINT UNSIGNED NOT NULL,
  text            MEDIUMTEXT NOT NULL,
  UNIQUE KEY uq_ht_edition_hadith (edition, hadithnumber),
  INDEX idx_ht_collection (collection_slug, hadithnumber),
  FULLTEXT INDEX idx_ht_fulltext (text),
  FOREIGN KEY (edition) REFERENCES hadith_editions(identifier),
  FOREIGN KEY (collection_slug, hadithnumber) REFERENCES hadiths(collection_slug, hadithnumber)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS books (
  id                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug                  VARCHAR(120) UNIQUE NOT NULL,
  title                 VARCHAR(300) NOT NULL,
  title_ar              VARCHAR(300),
  subtitle              VARCHAR(300),
  description           TEXT,
  language              VARCHAR(10) NOT NULL DEFAULT 'en',
  primary_text_language VARCHAR(10) NOT NULL DEFAULT 'en',
  islamic_topics        JSON,
  author                VARCHAR(200),
  translator            VARCHAR(200),
  publisher             VARCHAR(200),
  published_year        SMALLINT UNSIGNED,
  cover_url             VARCHAR(500),
  embed_url             VARCHAR(500),
  pdf_url               VARCHAR(500),
  content_type          ENUM('pdf','text') NOT NULL DEFAULT 'pdf',
  page_count            SMALLINT UNSIGNED,
  license_class         ENUM('public_domain','cc_by','cc_by_sa','cc_by_nc','permission') DEFAULT 'public_domain',
  status                ENUM('live','draft','removed') NOT NULL DEFAULT 'draft',
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_books_language (language),
  INDEX idx_books_status (status),
  FULLTEXT INDEX idx_books_search (title, subtitle, description, author)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS book_chapters (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  book_id         INT UNSIGNED NOT NULL,
  parent_id       INT UNSIGNED,
  type            ENUM('section','chapter','scene','paragraph') NOT NULL DEFAULT 'chapter',
  position        SMALLINT UNSIGNED NOT NULL,
  title           VARCHAR(300),
  content         LONGTEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_chapters_parent (parent_id),
  INDEX idx_chapters_book_parent_position (book_id, parent_id, position),
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES book_chapters(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO books
  (slug, title, title_ar, subtitle, description, language, primary_text_language, islamic_topics, author, translator, publisher, published_year, cover_url, embed_url, pdf_url, page_count, license_class, status)
VALUES
  ('riyad-as-salihin',         'Riyad as-Salihin',          'رياض الصالحين',   'Gardens of the Righteous',             'A comprehensive collection of authentic hadiths compiled by Imam al-Nawawi, covering every aspect of Islamic life and spirituality.',                                                                                                     'en','en','["hadith","spirituality"]',    'Imam al-Nawawi',              NULL, NULL,          NULL, 'https://archive.org/services/img/riyad-us-saliheen',                                     'https://archive.org/embed/riyad-us-saliheen',                                     'https://archive.org/download/riyad-us-saliheen/riyad-us-saliheen.pdf',                                               NULL, 'public_domain', 'live'),
  ('sealed-nectar',             'The Sealed Nectar',          'الرحيق المختوم',  'Biography of the Noble Prophet',       'An award-winning biography of Prophet Muhammad by Saif ur-Rahman Mubarakpuri. Winner of the First Prize by the Muslim World League at a worldwide competition on the Prophet''s biography.',                                         'en','en','["seerah"]',                  'Saif ur-Rahman Mubarakpuri',  NULL, 'Darussalam',  1996, 'https://archive.org/services/img/TheSealedNectarBiographyOfTheProphetMuhammadPBUH',    'https://archive.org/embed/TheSealedNectarBiographyOfTheProphetMuhammadPBUH',      'https://archive.org/download/TheSealedNectarBiographyOfTheProphetMuhammadPBUH/TheSealedNectar.pdf',                  580,  'public_domain', 'live'),
  ('fiqh-us-sunnah',            'Fiqh us-Sunnah',             'فقه السنة',       'Vol. 1 — Purification and Prayer',     'A clear and authoritative guide to Islamic jurisprudence based on the Quran and Sunnah. Covers the fundamentals of Islamic law with clear evidence from primary sources.',                                                               'en','en','["fiqh"]',                    'Sayyid Sabiq',                NULL, NULL,          NULL, 'https://archive.org/services/img/FiqhUsSunnahVolume1SayyidSabiq',                       'https://archive.org/embed/FiqhUsSunnahVolume1SayyidSabiq',                        'https://archive.org/download/FiqhUsSunnahVolume1SayyidSabiq/Fiqh-Us-Sunnah-Volume-1.pdf',                            NULL, 'public_domain', 'live'),
  ('tafsir-ibn-kathir-1',       'Tafsir Ibn Kathir',          'تفسير ابن كثير',  'Vol. 1 — Abridged',                    'The abridged version of the renowned Tafsir by Ibn Kathir, one of the most comprehensive and authentic explanations of the Quran. An essential reference for students of Islamic knowledge.',                                          'en','en','["tafsir"]',                  'Ibn Kathir',                  NULL, 'Darussalam',  2000, 'https://archive.org/services/img/TafsirIbnKathirPart1',                                 'https://archive.org/embed/TafsirIbnKathirPart1',                                  'https://archive.org/download/TafsirIbnKathirPart1/Tafsir_Ibn_Kathir_Part_1.pdf',                                     NULL, 'public_domain', 'live'),
  ('forty-hadith-nawawi',       'Forty Hadith',               'الأربعون النووية','An-Nawawi''s Forty Hadith',            'Imam al-Nawawi''s famous collection of forty-two hadith encompassing the most fundamental principles of Islam. Essential reading for every Muslim.',                                                                                    'en','en','["hadith"]',                  'Imam al-Nawawi',              NULL, NULL,          NULL, 'https://archive.org/services/img/FortyHadithNawawi',                                    'https://archive.org/embed/FortyHadithNawawi',                                     'https://archive.org/download/FortyHadithNawawi/Forty_Hadith_Nawawi.pdf',                                              NULL, 'public_domain', 'live'),
  ('three-fundamental-principles','The Three Fundamental Principles','ثلاثة الأصول','Usool ath-Thalathah',              'A foundational text of Islamic creed by Shaykh Muhammad ibn Abd al-Wahhab, covering three essential questions every Muslim must know: Who is your Lord? What is your religion? Who is your Prophet?',                                    'en','en','["aqeedah"]',                 'Muhammad ibn Abd al-Wahhab', NULL, NULL,          NULL, 'https://archive.org/services/img/ThreeFundamentalPrinciples',                           'https://archive.org/embed/ThreeFundamentalPrinciples',                            'https://archive.org/download/ThreeFundamentalPrinciples/Three_Fundamental_Principles.pdf',                            NULL, 'public_domain', 'live'),
  ('dont-be-sad',               'Don''t Be Sad',              'لا تحزن',         NULL,                                   'A global bestseller offering comfort, reassurance, and practical advice drawn from the Quran and Sunnah for dealing with grief, anxiety, and the trials of life.',                                                                       'en','en','["spirituality"]',            'Aaidh al-Qarni',              NULL, NULL,          NULL, 'https://archive.org/services/img/DontBeSadAaidhalQarni',                                'https://archive.org/embed/don-t-be-sad-aaidh-ibn-abdullah-al-qarni',                                 'https://archive.org/download/don-t-be-sad-aaidh-ibn-abdullah-al-qarni/Don_t_be_Sad_Aaidh_ibn_Abdullah_al_Qarni.pdf',                                                   NULL, 'public_domain', 'live'),
  ('stories-of-the-prophets',   'Stories of the Prophets',   'قصص الأنبياء',    NULL,                                   'Ibn Kathir''s comprehensive retelling of the stories of the prophets from Adam to Jesus, drawn from the Quran, authentic hadiths, and historical records.',                                                   'en','en','["seerah","history"]',        'Ibn Kathir',                  NULL, NULL,          NULL, 'https://archive.org/services/img/StoriesOfTheProphetsIbnKathir',                        'https://archive.org/embed/StoriesOfTheProphetsIbnKathir',                         'https://archive.org/download/StoriesOfTheProphetsIbnKathir/StoriesOfTheProphets.pdf',                                 NULL, 'public_domain', 'live')
ON DUPLICATE KEY UPDATE
  title=VALUES(title), description=VALUES(description), embed_url=VALUES(embed_url), cover_url=VALUES(cover_url), status=VALUES(status);
