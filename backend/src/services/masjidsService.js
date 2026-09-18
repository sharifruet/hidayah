import pool from '../config/database.js';
import { boundingBox } from '../utils/geo.js';

export const JAMAH_PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'jumuah'];

const MAX_RADIUS_KM = 50;
const MAX_LIMIT = 50;

// Haversine distance in km, evaluated in SQL so the DB can sort/limit.
// The three placeholders are: lat, lng, lat (in that order).
const DISTANCE_SQL = `(6371 * ACOS(LEAST(1, GREATEST(-1,
  COS(RADIANS(?)) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(?))
  + SIN(RADIANS(?)) * SIN(RADIANS(latitude))
))))`;

function formatMasjid(row) {
  return {
    id: row.id,
    name: row.name,
    name_bn: row.name_bn || null,
    address: row.address || null,
    city: row.city || null,
    district: row.district || null,
    latitude: parseFloat(row.latitude),
    longitude: parseFloat(row.longitude),
    phone: row.phone || null,
    description: row.description || null,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    ...(row.distance_km !== undefined && row.distance_km !== null && {
      distance_km: Math.round(parseFloat(row.distance_km) * 100) / 100,
    }),
  };
}

// mysql2 returns TIME columns as 'HH:MM:SS'
function formatTime(t) {
  return typeof t === 'string' ? t.substring(0, 5) : null;
}

/**
 * Attach `jamah` ({ fajr: 'HH:MM', ... }) and `jamah_updated_at` to each
 * masjid in one query instead of N.
 */
async function attachJamahTimes(masjids) {
  if (masjids.length === 0) return masjids;

  const ids = masjids.map(m => m.id);
  const [rows] = await pool.query(
    'SELECT masjid_id, prayer, time, updated_at FROM masjid_jamah_times WHERE masjid_id IN (?)',
    [ids]
  );

  const byMasjid = new Map(masjids.map(m => [m.id, { jamah: {}, jamah_updated_at: null }]));
  for (const r of rows) {
    const entry = byMasjid.get(r.masjid_id);
    if (!entry) continue;
    entry.jamah[r.prayer] = formatTime(r.time);
    if (!entry.jamah_updated_at || new Date(r.updated_at) > new Date(entry.jamah_updated_at)) {
      entry.jamah_updated_at = r.updated_at;
    }
  }

  return masjids.map(m => ({ ...m, ...byMasjid.get(m.id) }));
}

export async function listNearbyMasjidsService({ lat, lng, radiusKm = 5, limit = 20 }) {
  const radius = Math.min(MAX_RADIUS_KM, Math.max(0.1, parseFloat(radiusKm) || 5));
  const safeLimit = Math.min(MAX_LIMIT, Math.max(1, parseInt(limit) || 20));
  const box = boundingBox(lat, lng, radius);

  const [rows] = await pool.query(
    `SELECT *, ${DISTANCE_SQL} AS distance_km
     FROM masjids
     WHERE status = 'active'
       AND latitude BETWEEN ? AND ?
       AND longitude BETWEEN ? AND ?
     HAVING distance_km <= ?
     ORDER BY distance_km ASC
     LIMIT ?`,
    [lat, lng, lat, box.minLat, box.maxLat, box.minLng, box.maxLng, radius, safeLimit]
  );

  const masjids = await attachJamahTimes(rows.map(formatMasjid));
  return { masjids, radius_km: radius, center: { latitude: lat, longitude: lng } };
}

export async function searchMasjidsService({ q, lat, lng, limit = 20 }) {
  const safeLimit = Math.min(MAX_LIMIT, Math.max(1, parseInt(limit) || 20));
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);

  const where = ["status = 'active'"];
  const params = [];
  if (hasCoords) params.push(lat, lng, lat);

  if (q && q.trim()) {
    const like = `%${q.trim()}%`;
    where.push('(name LIKE ? OR name_bn LIKE ? OR address LIKE ? OR city LIKE ? OR district LIKE ?)');
    params.push(like, like, like, like, like);
  }

  const [rows] = await pool.query(
    `SELECT *${hasCoords ? `, ${DISTANCE_SQL} AS distance_km` : ''}
     FROM masjids
     WHERE ${where.join(' AND ')}
     ORDER BY ${hasCoords ? 'distance_km ASC' : 'name ASC'}
     LIMIT ?`,
    [...params, safeLimit]
  );

  const masjids = await attachJamahTimes(rows.map(formatMasjid));
  return { masjids, query: q?.trim() || '' };
}

export async function getMasjidService(id, { lat, lng, includeHidden = false } = {}) {
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);
  const params = hasCoords ? [lat, lng, lat, id] : [id];

  const [rows] = await pool.query(
    `SELECT *${hasCoords ? `, ${DISTANCE_SQL} AS distance_km` : ''}
     FROM masjids WHERE id = ?${includeHidden ? '' : " AND status = 'active'"}`,
    params
  );
  if (rows.length === 0) return null;

  const [masjid] = await attachJamahTimes([formatMasjid(rows[0])]);
  return masjid;
}

export async function listAllMasjidsService() {
  const [rows] = await pool.query('SELECT * FROM masjids ORDER BY created_at DESC');
  return attachJamahTimes(rows.map(formatMasjid));
}

export async function createMasjidService(data) {
  const [result] = await pool.query(
    `INSERT INTO masjids
      (name, name_bn, address, city, district, latitude, longitude, phone, description, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name.trim(),
      data.name_bn?.trim() || null,
      data.address?.trim() || null,
      data.city?.trim() || null,
      data.district?.trim() || null,
      data.latitude,
      data.longitude,
      data.phone?.trim() || null,
      data.description?.trim() || null,
      data.status || 'active',
    ]
  );

  if (data.jamah && Object.keys(data.jamah).length > 0) {
    await upsertJamahTimesService(result.insertId, data.jamah, { includeHidden: true });
  }

  return getMasjidService(result.insertId, { includeHidden: true });
}

export async function updateMasjidService(id, data) {
  const [result] = await pool.query(
    `UPDATE masjids SET
      name=?, name_bn=?, address=?, city=?, district=?, latitude=?, longitude=?,
      phone=?, description=?, status=?
     WHERE id=?`,
    [
      data.name.trim(),
      data.name_bn?.trim() || null,
      data.address?.trim() || null,
      data.city?.trim() || null,
      data.district?.trim() || null,
      data.latitude,
      data.longitude,
      data.phone?.trim() || null,
      data.description?.trim() || null,
      data.status || 'active',
      id,
    ]
  );
  if (result.affectedRows === 0) return null;

  if (data.jamah) {
    await upsertJamahTimesService(id, data.jamah, { includeHidden: true });
  }

  return getMasjidService(id, { includeHidden: true });
}

export async function deleteMasjidService(id) {
  const [result] = await pool.query('DELETE FROM masjids WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

/**
 * Upsert jamah times for a masjid. `times` maps prayer → 'HH:MM';
 * a null/empty value removes that prayer's row. `updated_at` is set
 * explicitly so re-confirming an unchanged time still counts as an update.
 */
export async function upsertJamahTimesService(masjidId, times, { includeHidden = false } = {}) {
  const [exists] = await pool.query(
    `SELECT id FROM masjids WHERE id = ?${includeHidden ? '' : " AND status = 'active'"}`,
    [masjidId]
  );
  if (exists.length === 0) return null;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    for (const prayer of JAMAH_PRAYERS) {
      if (!(prayer in times)) continue;
      const value = times[prayer];

      if (value === null || value === '') {
        await conn.query(
          'DELETE FROM masjid_jamah_times WHERE masjid_id = ? AND prayer = ?',
          [masjidId, prayer]
        );
      } else {
        await conn.query(
          `INSERT INTO masjid_jamah_times (masjid_id, prayer, time, updated_at)
           VALUES (?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE time = VALUES(time), updated_at = NOW()`,
          [masjidId, prayer, `${value}:00`]
        );
      }
    }

    // Bump the masjid row too so list views can sort by "recently updated".
    await conn.query('UPDATE masjids SET updated_at = NOW() WHERE id = ?', [masjidId]);

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  return getMasjidService(masjidId, { includeHidden });
}
