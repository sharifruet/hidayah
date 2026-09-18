/**
 * Unit tests for the masjid feature's pure pieces: geo helpers and
 * request validation. Service/DB behaviour is exercised by the API
 * integration tests when a database is available.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { haversineKm, boundingBox } from '../src/utils/geo.js';
import {
  validateMasjidBody,
  validateJamahBody,
  validateNearbyQuery,
  validateOptionalCoords,
} from '../src/middleware/validation.js';

function run(middleware, req) {
  let response = null;
  let nextCalled = false;
  const res = { status: (code) => ({ json: (data) => { response = { code, data }; } }) };
  const fullReq = { id: 'test', ...req };
  middleware(fullReq, res, () => { nextCalled = true; });
  return { response, nextCalled, req: fullReq };
}

describe('geo helpers', () => {
  it('haversineKm returns 0 for identical points', () => {
    assert.strictEqual(haversineKm(23.81, 90.41, 23.81, 90.41), 0);
  });

  it('haversineKm approximates Dhaka → Chittagong (~215 km)', () => {
    const d = haversineKm(23.8103, 90.4125, 22.3569, 91.7832);
    assert.ok(d > 205 && d < 225, `got ${d}`);
  });

  it('boundingBox contains the circle it wraps', () => {
    const lat = 23.8103, lng = 90.4125, radius = 5;
    const box = boundingBox(lat, lng, radius);
    // Points exactly `radius` away along each axis must fall inside the box
    for (const [plat, plng] of [
      [box.maxLat, lng], [box.minLat, lng], [lat, box.maxLng], [lat, box.minLng],
    ]) {
      assert.ok(haversineKm(lat, lng, plat, plng) >= radius - 0.05);
    }
    assert.ok(box.minLat < lat && box.maxLat > lat);
    assert.ok(box.minLng < lng && box.maxLng > lng);
  });

  it('boundingBox clamps to valid coordinate ranges', () => {
    const box = boundingBox(89.9, 179.9, 50);
    assert.ok(box.maxLat <= 90 && box.maxLng <= 180);
  });
});

describe('validateNearbyQuery', () => {
  it('accepts lat/lng with optional radius and limit', () => {
    const { nextCalled } = run(validateNearbyQuery, { query: { lat: '23.8', lng: '90.4', radius_km: '10', limit: '5' } });
    assert.strictEqual(nextCalled, true);
  });

  it('rejects missing coordinates', () => {
    const { response, nextCalled } = run(validateNearbyQuery, { query: { lat: '23.8' } });
    assert.strictEqual(nextCalled, false);
    assert.strictEqual(response.code, 400);
    assert.strictEqual(response.data.error.code, 'INVALID_NEARBY_QUERY');
  });

  it('rejects a radius above the cap', () => {
    const { response } = run(validateNearbyQuery, { query: { lat: '23.8', lng: '90.4', radius_km: '500' } });
    assert.strictEqual(response.code, 400);
    assert.strictEqual(response.data.error.details.parameter, 'radius_km');
  });
});

describe('validateOptionalCoords', () => {
  it('passes when no coordinates are given', () => {
    assert.strictEqual(run(validateOptionalCoords, { query: {} }).nextCalled, true);
  });

  it('rejects lat without lng', () => {
    const { response } = run(validateOptionalCoords, { query: { lat: '23.8' } });
    assert.strictEqual(response.code, 400);
  });
});

describe('validateMasjidBody', () => {
  const valid = { name: 'Baitul Mukarram', latitude: 23.7276, longitude: 90.4126 };

  it('accepts a minimal valid body and strips unknown keys', () => {
    const { nextCalled, req } = run(validateMasjidBody, { body: { ...valid, evil: 'x' } });
    assert.strictEqual(nextCalled, true);
    assert.strictEqual(req.body.evil, undefined);
  });

  it('accepts nested jamah times', () => {
    const { nextCalled } = run(validateMasjidBody, { body: { ...valid, jamah: { fajr: '05:15', jumuah: '13:30' } } });
    assert.strictEqual(nextCalled, true);
  });

  it('rejects a missing name', () => {
    const { response } = run(validateMasjidBody, { body: { latitude: 1, longitude: 1 } });
    assert.strictEqual(response.code, 400);
    assert.strictEqual(response.data.error.code, 'INVALID_MASJID');
    assert.strictEqual(response.data.error.details.parameter, 'name');
  });

  it('rejects out-of-range coordinates', () => {
    const { response } = run(validateMasjidBody, { body: { ...valid, latitude: 95 } });
    assert.strictEqual(response.code, 400);
    assert.strictEqual(response.data.error.details.parameter, 'latitude');
  });
});

describe('validateJamahBody', () => {
  it('accepts HH:MM times and null to clear', () => {
    const { nextCalled } = run(validateJamahBody, { body: { fajr: '05:15', asr: null, isha: '' } });
    assert.strictEqual(nextCalled, true);
  });

  it('rejects an empty body', () => {
    const { response } = run(validateJamahBody, { body: {} });
    assert.strictEqual(response.code, 400);
    assert.strictEqual(response.data.error.code, 'INVALID_JAMAH_TIMES');
  });

  it('rejects malformed times', () => {
    for (const bad of ['5:15', '25:00', '13:60', '1:5pm']) {
      const { response } = run(validateJamahBody, { body: { dhuhr: bad } });
      assert.strictEqual(response?.code, 400, `expected ${bad} to be rejected`);
    }
  });

  it('rejects unknown prayer keys', () => {
    // stripUnknown removes them; an all-unknown body then fails the min(1) rule
    const { response } = run(validateJamahBody, { body: { tahajjud: '03:00' } });
    assert.strictEqual(response.code, 400);
  });
});
