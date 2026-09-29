import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, 'data', 'upazilas.json');

/**
 * All ~500 upazilas as searchable locations (type 'upazila'), since prayer times differ
 * by a few minutes across a district. Source: Wikidata (CC0; two coordinates from
 * OpenStreetMap/ODbL) — see data/upazilas.json. Idempotent: replaces every 'upazila' row.
 */
async function ensureSchema(conn) {
  const [[col]] = await conn.query(
    `SELECT COLUMN_TYPE AS type FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'locations' AND COLUMN_NAME = 'type'`
  );
  if (col && !String(col.type).includes("'upazila'")) {
    await conn.query(
      `ALTER TABLE locations MODIFY COLUMN type
       ENUM('city','district','upazila','area','landmark','mosque') NOT NULL`
    );
  }
}

export async function seedUpazilas(conn) {
  await ensureSchema(conn);
  const upazilas = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

  await conn.beginTransaction();
  try {
    await conn.query(`DELETE FROM locations WHERE type = 'upazila'`);
    const rows = upazilas.map((u) => [u.name, u.name_bn, u.lat, u.lng, u.district, u.division, 'upazila', 'BD']);
    for (let i = 0; i < rows.length; i += 200) {
      await conn.query(
        `INSERT INTO locations (name, name_bengali, latitude, longitude, district, division, type, country) VALUES ?`,
        [rows.slice(i, i + 200)]
      );
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  }
  console.log(`✅ Seeded ${upazilas.length} upazilas`);
}

// Run standalone: `npm run seed:upazilas`
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let conn;
  try {
    conn = await pool.getConnection();
    await seedUpazilas(conn);
    process.exit(0);
  } catch (err) {
    console.error('❌ Upazila seeder failed:', err);
    process.exit(1);
  } finally {
    if (conn) conn.release();
  }
}
