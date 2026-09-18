-- Du'as move from static app data into the database.
-- Adds dua_categories, and slug/virtue columns on duas. For an existing
-- database run this once, then `npm run seed:duas`:
--   mysql -u <user> -p salat_saom_db < database/migrations/002_duas.sql
-- (The seeder also applies these changes itself if they are missing.)

CREATE TABLE IF NOT EXISTS dua_categories (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(50) UNIQUE NOT NULL,
  label_en    VARCHAR(100) NOT NULL,
  label_bn    VARCHAR(100),
  label_ur    VARCHAR(100),
  label_tr    VARCHAR(100),
  label_id    VARCHAR(100),
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE duas ADD COLUMN slug VARCHAR(60) UNIQUE NULL AFTER id;
ALTER TABLE duas ADD COLUMN virtue_en TEXT NULL AFTER translation_bn;
ALTER TABLE duas ADD COLUMN virtue_bn TEXT NULL AFTER virtue_en;
