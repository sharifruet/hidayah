-- Upazila-level locations: prayer times differ by a few minutes across a district.
-- For an existing database run this once, then `npm run seed:upazilas`:
--   mysql -u <user> -p salat_saom_db < database/migrations/003_upazila_locations.sql
-- (The seeder also applies this change itself if it is missing.)

ALTER TABLE locations MODIFY COLUMN type
  ENUM('city','district','upazila','area','landmark','mosque') NOT NULL;
