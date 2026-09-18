-- Masjids + jamah (congregation) times.
-- Run this against an existing database that was created before these
-- tables existed (`npm run migrate` skips schema.sql once it has completed):
--   mysql -u <user> -p salat_saom_db < database/migrations/001_masjids.sql

CREATE TABLE IF NOT EXISTS masjids (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  name_bn       VARCHAR(200),
  address       VARCHAR(400),
  city          VARCHAR(100),
  district      VARCHAR(100),
  latitude      DECIMAL(9,6) NOT NULL,
  longitude     DECIMAL(9,6) NOT NULL,
  phone         VARCHAR(40),
  description   TEXT,
  status        ENUM('active','hidden') NOT NULL DEFAULT 'active',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_masjids_coords (latitude, longitude),
  INDEX idx_masjids_status (status),
  INDEX idx_masjids_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One row per (masjid, prayer). `updated_at` is set explicitly on every
-- save so "last updated" reflects the last confirmation, not just changes.
CREATE TABLE IF NOT EXISTS masjid_jamah_times (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  masjid_id     INT UNSIGNED NOT NULL,
  prayer        ENUM('fajr','dhuhr','asr','maghrib','isha','jumuah') NOT NULL,
  time          TIME NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_masjid_prayer (masjid_id, prayer),
  FOREIGN KEY (masjid_id) REFERENCES masjids(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
